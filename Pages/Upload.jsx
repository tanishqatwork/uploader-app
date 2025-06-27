import React, { useState, useCallback, useRef } from "react";
import { Dataset } from "@/Entities/Dataset";
import { ExtractDataFromUploadedFile, UploadFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Textarea } from "@/Components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/Select";
import { ArrowLeft, Upload, Sparkles, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/Alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import UploadZone from "@/Components/upload/UploadZone.jsx";
import ProcessingSteps from "@/Components/upload/ProcessingSteps.jsx";
import DataPreview from "@/Components/upload/DataPreview.jsx";

export default function UploadPage() {
  console.log('[DEBUG] UploadPage component rendering');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("upload"); // upload, processing, preview, save
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [datasetForm, setDatasetForm] = useState({
    name: "",
    description: "",
    category: "other"
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const excelFile = droppedFiles.find(f => 
      f.type.includes("spreadsheet") || 
      f.name.endsWith(".xlsx") || 
      f.name.endsWith(".xls") || 
      f.name.endsWith(".csv")
    );

    if (!excelFile) {
      setError("Please upload an Excel or CSV file");
      return;
    }

    handleFileSelect(excelFile);
  }, []);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setDatasetForm(prev => ({
      ...prev,
      name: selectedFile.name.replace(/\.[^/.]+$/, "")
    }));
    setError(null);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setCurrentStep("processing");
    setError(null);

    try {
      // Upload file
      const { file_url } = await UploadFile({ file });
      
      // Extract data
      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { type: "object" }
            },
            columns: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      if (extractResult.status !== "success") {
        throw new Error("Failed to extract data from file");
      }

      // Analyze data with AI
      const sampleData = extractResult.output.data.slice(0, 5);
      const analysisResult = await InvokeLLM({
        prompt: `Analyze this dataset and provide insights. Data sample: ${JSON.stringify(sampleData)}. Columns: ${extractResult.output.columns.join(", ")}. Provide a summary, key insights, and data type analysis.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            insights: { 
              type: "array",
              items: { type: "string" }
            },
            data_types: { type: "object" }
          }
        }
      });

      setExtractedData({
        ...extractResult.output,
        file_url,
        file_name: file.name,
        row_count: extractResult.output.data.length
      });
      setAnalysis(analysisResult);
      setCurrentStep("preview");

    } catch (error) {
      setError(`Error processing file: ${error.message}`);
      setCurrentStep("upload");
    }

    setIsProcessing(false);
  };

  const saveDataset = async () => {
    setIsProcessing(true);
    try {
      await Dataset.create({
        ...datasetForm,
        ...extractedData,
        analysis
      });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      setError("Error saving dataset");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="rounded-xl hover-lift"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Upload Dataset</h1>
            <p className="text-slate-600 mt-1">Transform your data into actionable insights</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <ProcessingSteps currentStep={currentStep} />

        <AnimatePresence mode="wait">
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadZone 
                  onFileSelect={handleFileSelect}
                  dragActive={dragActive}
                  selectedFile={file}
                />
              </div>

              {file && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 smooth-shadow gradient-border space-y-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Dataset Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Dataset Name</Label>
                      <Input
                        id="name"
                        value={datasetForm.name}
                        onChange={(e) => setDatasetForm(prev => ({...prev, name: e.target.value}))}
                        className="rounded-xl"
                        placeholder="My Dataset"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={datasetForm.category}
                        onValueChange={(value) => setDatasetForm(prev => ({...prev, category: value}))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web_scraping">Web Scraping</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={datasetForm.description}
                      onChange={(e) => setDatasetForm(prev => ({...prev, description: e.target.value}))}
                      className="rounded-xl h-24"
                      placeholder="Describe your dataset..."
                    />
                  </div>

                  <Button
                    onClick={processFile}
                    disabled={!datasetForm.name.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 hover-lift"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Process Dataset
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center py-16"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Processing your data...</h3>
                  <p className="text-slate-600 mt-2">Extracting insights and analyzing patterns</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "preview" && extractedData && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DataPreview
                data={extractedData}
                analysis={analysis}
                onSave={saveDataset}
                onBack={() => setCurrentStep("upload")}
                isProcessing={isProcessing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 