import React, { useState, useEffect } from "react";
import { Dataset } from "@/Entities/Dataset";
import { motion } from "framer-motion";
import { Filter, Search, Download, Eye } from "lucide-react";
import { Input } from "@/Components/ui/Input";
import { Button } from "@/Components/ui/Button";

import DatasetSelector from "@/Components/explorer/DatasetSelector.jsx";
import FilterPanel from "@/Components/explorer/FilterPanel.jsx";
import DataTable from "@/Components/explorer/DataTable.jsx";
import DataInsights from "@/Components/explorer/DataInsights.jsx";

export default function Explorer() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  useEffect(() => {
    // Check for dataset ID in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const datasetId = urlParams.get('dataset');
    if (datasetId && datasets.length > 0) {
      const dataset = datasets.find(d => d.id === datasetId);
      if (dataset) {
        setSelectedDataset(dataset);
      }
    }
  }, [datasets]);

  useEffect(() => {
    if (selectedDataset) {
      applyFiltersAndSearch();
    }
  }, [selectedDataset, searchTerm, activeFilters]);

  const loadDatasets = async () => {
    setIsLoading(true);
    const data = await Dataset.list("-created_date");
    setDatasets(data);
    setIsLoading(false);
  };

  const applyFiltersAndSearch = () => {
    if (!selectedDataset?.data) return;

    let filtered = [...selectedDataset.data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([column, filterValue]) => {
      if (filterValue && filterValue !== "all") {
        filtered = filtered.filter(row => 
          String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    if (!filteredData.length) return;

    const csv = [
      selectedDataset.columns.join(','),
      ...filteredData.map(row => 
        selectedDataset.columns.map(col => JSON.stringify(row[col] || '')).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDataset.name}_filtered.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
            Data Explorer
          </h1>
          <p className="text-slate-600 text-lg">
            Dive deep into your datasets with advanced filtering and analysis
          </p>
        </div>

        {selectedDataset && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={!filteredData.length}
              className="rounded-xl hover-lift"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        )}
      </motion.div>

      <DatasetSelector
        datasets={datasets}
        selectedDataset={selectedDataset}
        onSelect={setSelectedDataset}
        isLoading={isLoading}
      />

      {selectedDataset && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search across all data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl bg-white border-slate-200 focus:border-blue-300"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-xl hover-lift flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters ({Object.keys(activeFilters).length})
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <FilterPanel
                columns={selectedDataset.columns}
                data={selectedDataset.data}
                activeFilters={activeFilters}
                onFiltersChange={setActiveFilters}
              />
              
              <DataTable
                data={filteredData}
                columns={selectedDataset.columns}
                totalRows={selectedDataset.row_count}
                filteredRows={filteredData.length}
              />
            </div>

            <div>
              <DataInsights
                dataset={selectedDataset}
                filteredData={filteredData}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 