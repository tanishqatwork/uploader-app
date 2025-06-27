import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/Select";
import { FileSpreadsheet, Database } from "lucide-react";
import { Badge } from "@/Components/ui/Badge";
import { Skeleton } from "@/Components/ui/Skeleton";

export default function DatasetSelector({ datasets, selectedDataset, onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 smooth-shadow gradient-border">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 smooth-shadow gradient-border text-center">
        <FileSpreadsheet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No datasets available</h3>
        <p className="text-slate-600">Upload your first dataset to start exploring data</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 smooth-shadow gradient-border"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-600" />
        Select Dataset
      </h3>
      
      <Select value={selectedDataset?.id || ""} onValueChange={(value) => {
        const dataset = datasets.find(d => d.id === value);
        onSelect(dataset);
      }}>
        <SelectTrigger className="w-full rounded-xl">
          <SelectValue placeholder="Choose a dataset to explore" />
        </SelectTrigger>
        <SelectContent>
          {datasets.map((dataset) => (
            <SelectItem key={dataset.id} value={dataset.id}>
              <div className="flex items-center justify-between w-full">
                <span>{dataset.name}</span>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className="text-xs">
                    {dataset.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {dataset.row_count?.toLocaleString() || 0} rows
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
} 