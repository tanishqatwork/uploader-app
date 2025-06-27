import React from 'react';
import { motion } from "framer-motion";
import { Upload, Zap, Eye, CheckCircle } from "lucide-react";
import { debug } from '@/utils/debug';

// Debug component loading
debug.log('ProcessingSteps', 'Component file loaded');

const steps = [
  { key: "upload", label: "Upload", icon: Upload },
  { key: "processing", label: "Processing", icon: Zap },
  { key: "preview", label: "Preview", icon: Eye },
];

export default function ProcessingSteps({ currentStep }) {
  // Debug component render
  React.useEffect(() => {
    debug.log('ProcessingSteps', 'Component mounted', { currentStep });
    return () => debug.log('ProcessingSteps', 'Component unmounted');
  }, []);

  const getStepIndex = (step) => steps.findIndex(s => s.key === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 smooth-shadow gradient-border">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted ? "#10b981" : isActive ? "#3b82f6" : "#e2e8f0"
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-600"}`} />
                  )}
                </motion.div>
                <span className={`font-medium ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-slate-200 relative overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: index < currentIndex ? "100%" : "0%" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 