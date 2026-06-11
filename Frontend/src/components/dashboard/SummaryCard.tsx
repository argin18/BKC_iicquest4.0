"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  unit?: string;
  icon: LucideIcon;
  color?: string;
  index?: number;
}

export default function SummaryCard({
  title,
  value,
  change,
  unit,
  icon: Icon,
  color = "primary",
  index = 0,
}: SummaryCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary", glow: "shadow-primary/5" },
    success: { bg: "bg-success/10", text: "text-success", glow: "shadow-success/5" },
    warning: { bg: "bg-warning/10", text: "text-warning", glow: "shadow-warning/5" },
    danger: { bg: "bg-danger/10", text: "text-danger", glow: "shadow-danger/5" },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className={cn("group relative overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-lg", c.glow)}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {title}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {value}
                </span>
                {unit && (
                  <span className="text-sm font-medium text-muted-foreground">{unit}</span>
                )}
              </div>
            </div>
            <div className={cn("rounded-xl p-2.5", c.bg)}>
              <Icon className={cn("h-5 w-5", c.text)} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            {isNeutral ? (
              <Minus className="h-3 w-3 text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-danger" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isNeutral
                  ? "text-muted-foreground"
                  : isPositive
                  ? "text-success"
                  : "text-danger"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">vs last week</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
