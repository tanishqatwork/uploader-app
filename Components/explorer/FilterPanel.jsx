import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/Select";
import { Button } from "@/Components/ui/Button";
import { Filter, X } from "lucide-react";
import { Badge } from "@/Components/ui/Badge";

export default function FilterPanel({ columns, data, activeFilters, onFiltersChange }) {
  const getUniqueValues = (column) => {
    const values = [...new Set(data.map(row => String(row[column] || '')))];
    return values.filter(v => v).slice(0, 20); // Limit to 20 unique values
  };

  const addFilter = (column) => {
    if (!activeFilters[column]) {
      onFiltersChange({
        ...activeFilters,
        [column]: ""
      });
    }
  };

  const updateFilter = (column, value) => {
    onFiltersChange({
      ...activeFilters,
      [column]: value
    });
  };

  const removeFilter = (column) => {
    const newFilters = { ...activeFilters };
    delete newFilters[column];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 smooth-shadow gradient-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          Filters
        </h3>
        {Object.keys(activeFilters).length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="rounded-lg hover-lift"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Add Filter Dropdown */}
        <Select onValueChange={addFilter}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Add filter by column..." />
          </SelectTrigger>
          <SelectContent>
            {columns.filter(col => !activeFilters[col]).map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active Filters */}
        <div className="space-y-3">
          {Object.entries(activeFilters).map(([column, value]) => (
            <motion.div
              key={column}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
            >
              <Badge variant="outline" className="text-xs">
                {column}
              </Badge>
              <Select value={value} onValueChange={(newValue) => updateFilter(column, newValue)}>
                <SelectTrigger className="flex-1 h-8 rounded-lg">
                  <SelectValue placeholder="Select value..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All values</SelectItem>
                  {getUniqueValues(column).map((uniqueValue) => (
                    <SelectItem key={uniqueValue} value={uniqueValue}>
                      {uniqueValue.slice(0, 50)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(column)}
                className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 