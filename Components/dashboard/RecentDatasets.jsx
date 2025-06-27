import React from 'react';
import { motion } from "framer-motion";
import { format } from "date-fns";
import { FileSpreadsheet, Eye, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/Components/ui/Button";
import { Badge } from "@/Components/ui/Badge";
import { Skeleton } from "@/Components/ui/Skeleton";

const categoryColors = {
  web_scraping: "bg-blue-100 text-blue-800 border-blue-200",
  marketing: "bg-green-100 text-green-800 border-green-200",
  sales: "bg-purple-100 text-purple-800 border-purple-200",
  analytics: "bg-orange-100 text-orange-800 border-orange-200",
  research: "bg-pink-100 text-pink-800 border-pink-200",
  finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  default: "bg-gray-100 text-gray-800 border-gray-200"
};

const RecentDatasetItem = ({ dataset, onDatasetSelect, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-200 hover-lift cursor-pointer"
    onClick={() => onDatasetSelect(dataset)}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
        <FileSpreadsheet className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-medium text-slate-900">{dataset.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={`text-xs ${categoryColors[dataset.category] || categoryColors.default} border`}>
            {dataset.category?.replace('_', ' ') ?? 'uncategorized'}
          </Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dataset.created_date ? format(new Date(dataset.created_date), "MMM d") : 'No date'}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        {dataset.row_count?.toLocaleString() ?? 0} rows
      </span>
      <Button variant="ghost" size="icon" className="rounded-lg hover:bg-blue-50">
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array(3).fill(0).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <FileSpreadsheet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-slate-900 mb-2">No datasets yet</h3>
    <p className="text-slate-600">Upload your first dataset to get started with analysis</p>
  </div>
);

export default function RecentDatasets({ datasets, isLoading, onDatasetSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl smooth-shadow gradient-border"
    >
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Recent Datasets
        </h2>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : datasets?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {datasets.slice(0, 5).map((dataset, index) => (
              <RecentDatasetItem 
                key={dataset.id} 
                dataset={dataset}
                onDatasetSelect={onDatasetSelect}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
} 