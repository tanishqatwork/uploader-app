import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/Components/ui/Button";
import { ArrowLeft, Save, Lightbulb, BarChart3, Database, FileSpreadsheet, Download } from "lucide-react";
import { Badge } from "@/Components/ui/Badge";

export default function DataPreview({ data, analysis, onSave, onBack, isProcessing }) {
  const sampleData = data.data.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Analysis Summary */}
      <div className="bg-white rounded-2xl p-6 smooth-shadow gradient-border">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          AI Analysis Summary
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Overview</h4>
            <p className="text-slate-600">{analysis?.summary}</p>
          </div>
          
          {analysis?.insights && analysis.insights.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Key Insights</h4>
              <ul className="space-y-2">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-600">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white rounded-2xl smooth-shadow gradient-border overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Data Preview
            </h3>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {data.row_count} total rows
              </Badge>
              <Badge variant="outline" className="text-sm">
                {data.columns.length} columns
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {data.columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left text-sm font-medium text-slate-900">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index} className="border-t border-slate-100">
                  {data.columns.map((column) => (
                    <td key={column} className="px-4 py-3 text-sm text-slate-600">
                      {String(row[column] || '').slice(0, 50)}
                      {String(row[column] || '').length > 50 && '...'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.row_count > 5 && (
          <div className="p-4 bg-slate-50 text-center text-sm text-slate-600">
            Showing first 5 rows of {data.row_count} total rows
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="rounded-xl hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button
          onClick={onSave}
          disabled={isProcessing}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl px-6 hover-lift"
        >
          <Save className="w-4 h-4 mr-2" />
          {isProcessing ? "Saving..." : "Save Dataset"}
        </Button>
      </div>
    </motion.div>
  );
} 