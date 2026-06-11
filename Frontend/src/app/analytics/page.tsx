"use client";

import { motion } from "framer-motion";
import EnergyTrendChart from "@/components/charts/EnergyTrendChart";
import PeakHourChart from "@/components/charts/PeakHourChart";
import DeviceBarChart from "@/components/charts/DeviceBarChart";
import AIAnalysisPanel from "@/components/ai/AIAnalysisPanel";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [range, setRange] = useState("7D");
  const [date, setDate] = useState<Date>();

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Consumption,Baseline,Cost\n2026-06-01,2450,2600,342\n2026-06-02,2380,2600,330";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_export_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into energy consumption patterns and forecasts.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center rounded-lg border border-border bg-card p-1">
            {["7D", "30D", "3M", "1Y"].map((r) => (
              <Button
                key={r}
                variant="ghost"
                size="sm"
                onClick={() => setRange(r)}
                className={`h-8 rounded-md ${range === r ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                {r}
              </Button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "gap-2 h-10 w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a custom date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => { setDate(d); setRange("Custom"); }}
              />
            </PopoverContent>
          </Popover>
          <Button variant="default" size="sm" className="gap-2 h-10" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </motion.div>
      </div>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <EnergyTrendChart />
        </div>
        <div>
          <PeakHourChart />
        </div>
        <div>
          <DeviceBarChart />
        </div>
      </div>
    </div>
  );
}
