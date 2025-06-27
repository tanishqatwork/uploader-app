import React, { useRef } from 'react';
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import { Button } from "@/Components/ui/Button";

export default function UploadZone({ onFileSelect, dragActive, selectedFile }) {
  const fileInputRef = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-300 smooth-shadow gradient-border ${
        dragActive 
          ? "border-blue-400 bg-blue-50/50" 
          : selectedFile 
          ? "border-green-400 bg-green-50/50"
          : "border-slate-300 hover:border-slate-400"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="p-12 text-center">
        {selectedFile ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">File Selected</h3>
              <p className="text-slate-600">{selectedFile.name}</p>
              <p className="text-sm text-slate-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleClick}
              className="rounded-xl hover-lift"
            >
              Choose Different File
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
              dragActive 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 scale-110" 
                : "bg-gradient-to-br from-slate-100 to-slate-200"
            }`}>
              {dragActive ? (
                <Upload className="w-8 h-8 text-white" />
              ) : (
                <FileSpreadsheet className="w-8 h-8 text-slate-600" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">
                {dragActive ? "Drop your file here" : "Upload Excel or CSV"}
              </h3>
              <p className="text-slate-600">
                {dragActive 
                  ? "Release to upload your dataset" 
                  : "Drag and drop your file, or click to browse"
                }
              </p>
            </div>
            
            <Button 
              onClick={handleClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-8 py-3 hover-lift"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose File
            </Button>
            
            <p className="text-xs text-slate-500">
              Supported formats: XLSX, XLS, CSV • Max size: 10MB
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 