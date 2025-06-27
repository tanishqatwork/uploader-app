import React from 'react';
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Info } from "lucide-react";
import { Badge } from "@/Components/ui/Badge";

export default function DataInsights({ dataset, filteredData }) {
  const getColumnStats = (column) => {
    const values = filteredData.map(row => row[column]).filter(v => v != null && v !== '');
    const unique = [...new Set(values)].length;
    const total = values.length;
    
    // Try to detect if it's numeric
    const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
    const isNumeric = numericValues.length > total * 0.8; // 80% numeric threshold
    
    if (isNumeric && numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      
      return {
        type: 'numeric',
        total,
        unique,
        average: avg.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2)
      };
    }
    
    return {
      type: 'text',
      total,
      unique,
      fillRate: ((total / filteredData.length) * 100).toFixed(1)
    };
  };

  const topColumns = dataset.columns.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Dataset Summary */}
      <div className="bg-white rounded-2xl p-6 smooth-shadow gradient-border">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Dataset Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Total Rows</span>
            <Badge variant="outline">{filteredData.length.toLocaleString()}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Columns</span>
            <Badge variant="outline">{dataset.columns.length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Category</span>
            <Badge className="bg-blue-100 text-blue-800">
              {dataset.category.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {dataset.analysis && (
        <div className="bg-white rounded-2xl p-6 smooth-shadow gradient-border">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            AI Insights
          </h3>
          
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{dataset.analysis.summary}</p>
            
            {dataset.analysis.insights && dataset.analysis.insights.length > 0 && (
              <div className="space-y-2">
                {dataset.analysis.insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-xs text-slate-600">{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Column Statistics */}
      <div className="bg-white rounded-2xl p-6 smooth-shadow gradient-border">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Column Stats
        </h3>
        
        <div className="space-y-4">
          {topColumns.map((column) => {
            const stats = getColumnStats(column);
            return (
              <div key={column} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900 text-sm">{column}</span>
                  <Badge variant="outline" className="text-xs">
                    {stats.type}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-slate-600">
                    <span className="block">Unique: {stats.unique}</span>
                    {stats.type === 'numeric' ? (
                      <span className="block">Avg: {stats.average}</span>
                    ) : (
                      <span className="block">Fill: {stats.fillRate}%</span>
                    )}
                  </div>
                  <div className="text-slate-600">
                    <span className="block">Total: {stats.total}</span>
                    {stats.type === 'numeric' && (
                      <span className="block">Range: {stats.min}-{stats.max}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
} 