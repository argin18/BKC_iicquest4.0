"use client";

import { motion } from "framer-motion";
import ReportDisplay from "@/components/ai/ReportDisplay";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await api.reports.generate();
      alert("New Impact Report generated successfully!");
      // If we had a state in ReportDisplay to trigger a re-render, we would call it here
      // For now, reload window to fetch latest if it was fully dynamic, or just alert
    } catch (e) {
      console.error(e);
      alert("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Impact Reports</h1>
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mt-1">Review your sustainability goals, cost savings, and optimization impact.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="no-print"
        >
          <Button variant="default" size="sm" className="gap-2 h-10" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} 
            {isGenerating ? "Generating..." : "Generate New Report"}
          </Button>
        </motion.div>
      </div>

      <div className="space-y-6">
        <ReportDisplay />
      </div>
    </div>
  );
}
