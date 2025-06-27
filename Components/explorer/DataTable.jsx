import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, ArrowUpDown } from "lucide-react";
import { Button } from "@/Components/ui/Button";
import { Badge } from "@/Components/ui/Badge";

export default function DataTable({ data, columns, totalRows, filteredRows }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';
      
      // Try to parse as numbers first
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // String comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronLeft className="w-4 h-4 text-blue-600" />
      : <ChevronRight className="w-4 h-4 text-blue-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl smooth-shadow gradient-border overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Data Table</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Showing {filteredRows} of {totalRows} rows
            </Badge>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column)}
                    className="h-auto p-0 font-medium text-slate-900 hover:text-blue-600 flex items-center gap-2"
                  >
                    {column}
                    {getSortIcon(column)}
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors duration-200"
              >
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-sm text-slate-600">
                    <div className="max-w-xs truncate">
                      {String(row[column] || '')}
                    </div>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
} 