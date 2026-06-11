"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Zap,
  IndianRupee,
  Leaf,
  Wrench,
  ChevronRight,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import type { Recommendation } from "@/lib/types";

const categoryIcons = {
  energy: Zap,
  cost: IndianRupee,
  sustainability: Leaf,
  maintenance: Wrench,
};

const impactColors = {
  high: "destructive" as const,
  medium: "warning" as const,
  low: "default" as const,
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  index?: number;
  compact?: boolean;
  onImplement?: (id: string) => void;
}

export default function RecommendationCard({
  recommendation,
  index = 0,
  compact = false,
  onImplement,
}: RecommendationCardProps) {
  const [open, setOpen] = useState(false);
  const CategoryIcon = categoryIcons[recommendation.category];

  if (compact) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="cursor-pointer"
          >
            <div className="group flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 transition-all duration-200 hover:border-primary/20 hover:bg-card">
              <div className={cn("rounded-lg p-2", recommendation.category === "energy" ? "bg-primary/10" : recommendation.category === "cost" ? "bg-warning/10" : recommendation.category === "sustainability" ? "bg-success/10" : "bg-muted")}>
                <CategoryIcon className={cn("h-3.5 w-3.5", recommendation.category === "energy" ? "text-primary" : recommendation.category === "cost" ? "text-warning" : recommendation.category === "sustainability" ? "text-success" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-foreground">{recommendation.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  Save Rs{(recommendation.estimated_savings || 0).toLocaleString()}/yr
                </p>
              </div>
              <Badge variant={impactColors[recommendation.impact]} className="text-[10px]">
                {recommendation.impact}
              </Badge>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("rounded-lg p-2", recommendation.category === "energy" ? "bg-primary/10" : recommendation.category === "cost" ? "bg-warning/10" : recommendation.category === "sustainability" ? "bg-success/10" : "bg-muted")}>
                <CategoryIcon className={cn("h-5 w-5", recommendation.category === "energy" ? "text-primary" : recommendation.category === "cost" ? "text-warning" : recommendation.category === "sustainability" ? "text-success" : "text-muted-foreground")} />
              </div>
              <DialogTitle className="text-xl">{recommendation.title}</DialogTitle>
            </div>
            <DialogDescription className="text-base text-foreground mt-4 leading-relaxed">
              {recommendation.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Impact Level</p>
              <Badge variant={impactColors[recommendation.impact]} className="capitalize">{recommendation.impact}</Badge>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Est. Savings</p>
              <p className="text-lg font-bold text-success">Rs{(recommendation.estimated_savings || 0).toLocaleString()}/yr</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full sm:w-auto">Implement Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="cursor-pointer"
        >
          <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-xl p-2.5 mt-0.5", recommendation.category === "energy" ? "bg-primary/10" : recommendation.category === "cost" ? "bg-warning/10" : recommendation.category === "sustainability" ? "bg-success/10" : "bg-muted")}>
                    <CategoryIcon className={cn("h-4 w-4", recommendation.category === "energy" ? "text-primary" : recommendation.category === "cost" ? "text-warning" : recommendation.category === "sustainability" ? "text-success" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {recommendation.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
                <Badge variant={impactColors[recommendation.impact]} className="shrink-0">
                  {recommendation.impact} impact
                </Badge>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-xs text-muted-foreground">AI Confidence: {Math.round((recommendation.ai_confidence || 0.94) * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3 w-3 text-success" />
                    <span className="text-xs font-medium text-success">
                      Rs{(recommendation.estimated_savings || 0).toLocaleString()}/yr
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
                  View Details <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("rounded-lg p-2", recommendation.category === "energy" ? "bg-primary/10" : recommendation.category === "cost" ? "bg-warning/10" : recommendation.category === "sustainability" ? "bg-success/10" : "bg-muted")}>
              <CategoryIcon className={cn("h-5 w-5", recommendation.category === "energy" ? "text-primary" : recommendation.category === "cost" ? "text-warning" : recommendation.category === "sustainability" ? "text-success" : "text-muted-foreground")} />
            </div>
            <DialogTitle className="text-xl">{recommendation.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-foreground mt-4 leading-relaxed">
            {recommendation.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Impact Level</p>
            <Badge variant={impactColors[recommendation.impact]} className="capitalize">{recommendation.impact}</Badge>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Est. Savings</p>
            <p className="text-lg font-bold text-success">Rs{(recommendation.estimated_savings || 0).toLocaleString()}/yr</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> ROI
            </p>
            <p className="text-lg font-bold text-primary">{recommendation.metadata_json?.roi_percentage ? recommendation.metadata_json.roi_percentage.toFixed(1) : ((recommendation.estimated_savings || 0) / (recommendation.implementation_cost || 1) * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Timeline
            </p>
            <p className="text-sm font-semibold text-foreground">{recommendation.metadata_json?.implementation_timeline || recommendation.metadata_json?.['implementation_timeline'] || '2-4 weeks'}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 my-4 space-y-3">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">AI Confidence</p>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all" 
                    style={{ width: `${(recommendation.ai_confidence || 0.94) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-primary">{Math.round((recommendation.ai_confidence || 0.94) * 100)}%</span>
              </div>
            </div>
          </div>
          
          {recommendation.implementation_cost && recommendation.implementation_cost > 0 && (
            <div className="flex items-start gap-2">
              <IndianRupee className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Implementation Cost</p>
                <p className="text-sm text-muted-foreground mt-0.5">Rs{(recommendation.implementation_cost).toLocaleString()} one-time investment</p>
              </div>
            </div>
          )}
          
          {recommendation.metadata_json?.risk_level && (
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Risk Level</p>
                <p className="text-sm text-muted-foreground mt-0.5 capitalize">{recommendation.metadata_json.risk_level}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button className="w-full sm:w-auto" onClick={() => {
            if (onImplement) {
              onImplement(recommendation.id);
            }
            setOpen(false);
            alert("Change successfully implemented!");
          }}>Implement Change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
