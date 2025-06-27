import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { Skeleton } from '@/Components/ui/Skeleton';
import { Badge } from '@/Components/ui/Badge';

const categoryColors = {
  web_scraping: "bg-blue-100 text-blue-800",
  marketing: "bg-green-100 text-green-800",
  sales: "bg-purple-100 text-purple-800",
  analytics: "bg-orange-100 text-orange-800",
  research: "bg-pink-100 text-pink-800",
  finance: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800"
};

const CategoryItem = ({ name, count, colorClass }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colorClass.replace('text', 'bg').replace('-800', '-500')}`} />
      <span className="text-sm font-medium text-slate-700 capitalize">{name.replace('_', ' ')}</span>
    </div>
    <Badge variant="secondary" className="font-semibold">{count}</Badge>
  </div>
);

export default function CategoryBreakdown({ datasets, isLoading }) {
  const categoryCounts = React.useMemo(() => {
    if (!datasets || datasets.length === 0) return [];
    
    const counts = datasets.reduce((acc, d) => {
      const category = d.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [datasets]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 smooth-shadow gradient-border"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-600" />
        Category Breakdown
      </h3>
      <div className="space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))
        ) : categoryCounts.length > 0 ? (
          categoryCounts.map(({ name, count }) => (
            <CategoryItem 
              key={name}
              name={name}
              count={count}
              colorClass={categoryColors[name] || categoryColors.default}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No categories found.</p>
        )}
      </div>
    </motion.div>
  );
} 