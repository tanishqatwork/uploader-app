import React from 'react';
import { motion } from "framer-motion";
import { Database, Layers, Clock, TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-2xl p-6 smooth-shadow gradient-border hover-lift group"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  </motion.div>
);

export default function StatsGrid({ stats }) {
  const statItems = [
    {
      title: "Total Datasets",
      value: stats?.totalDatasets ?? 0,
      icon: Layers,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Total Rows",
      value: stats?.totalRows?.toLocaleString() ?? 0,
      icon: Database,
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Categories",
      value: stats?.categories ?? 0,
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Last Upload",
      value: stats?.lastUpload ?? "Never",
      icon: Clock,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
} 