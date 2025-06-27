import React, { useState, useEffect } from "react";
import { Dataset } from "@/Entities/Dataset";
import { Button } from "@/Components/ui/Button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Database, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import StatsGrid from "@/Components/dashboard/StatsGrid.jsx";
import RecentDatasets from "@/Components/dashboard/RecentDatasets.jsx";
import CategoryBreakdown from "@/Components/dashboard/CategoryBreakdown.jsx";

export default function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setIsLoading(true);
    try {
      const data = await Dataset.list("-created_date");
      setDatasets(data);
    } catch (error) {
      console.error("Error loading datasets:", error);
      // Optionally, set an error state here to show in the UI
      setDatasets([]);
    }
    setIsLoading(false);
  };

  const stats = {
    totalDatasets: datasets.length,
    totalRows: datasets.reduce((sum, d) => sum + (d.row_count || 0), 0),
    lastUpload: datasets[0]?.created_date ? format(new Date(datasets[0].created_date), "MMM d, yyyy") : "Never",
    categories: [...new Set(datasets.map(d => d.category))].length
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-600 text-lg">
            Analyze your data with powerful insights and beautiful visualizations
          </p>
        </div>
        <Link to={createPageUrl("Upload")}>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            <Plus className="w-5 h-5 mr-2" />
            Upload Dataset
          </Button>
        </Link>
      </motion.div>

      <StatsGrid stats={stats} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentDatasets 
            datasets={datasets}
            isLoading={isLoading}
            onDatasetSelect={(dataset) => {
              window.location.href = createPageUrl("Explorer") + `?dataset=${dataset.id}`;
            }}
          />
        </div>

        <div className="space-y-8">
          <CategoryBreakdown datasets={datasets} isLoading={isLoading} />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 smooth-shadow gradient-border"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to={createPageUrl("Upload")}>
                <Button variant="outline" className="w-full justify-start hover-lift rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload New Dataset
                </Button>
              </Link>
              <Link to={createPageUrl("Explorer")}>
                <Button variant="outline" className="w-full justify-start hover-lift rounded-xl">
                  <Database className="w-4 h-4 mr-2" />
                  Explore Data
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 