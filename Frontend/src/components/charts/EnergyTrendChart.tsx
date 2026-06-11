"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AnalyticsTrend } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {label}
      </p>

      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-muted-foreground">
            {entry.dataKey}:
          </span>
          <span className="font-medium text-foreground">
            {entry.value.toLocaleString()} kWh
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EnergyTrendChart() {
  const [trends, setTrends] = useState<AnalyticsTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = (await api.analytics.trends()) as AnalyticsTrend[];

        if (!mounted) return;

        setTrends(data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Energy Consumption Trends
            </CardTitle>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[11px] text-muted-foreground">
                  Actual
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <span className="text-[11px] text-muted-foreground">
                  Baseline
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-[11px] text-muted-foreground">
                  Optimized
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trends}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                  style={{ outline: "none" }}
                >
                  <defs>
                    <linearGradient
                      id="colorConsumption"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3B82F6"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="colorOptimized"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10B981"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10B981"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1F2937"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${(value / 1000).toFixed(1)}k`
                    }
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="#4B5563"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    fill="transparent"
                    dot={false}
                  />

                  <Area
                    type="monotone"
                    dataKey="consumption"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorConsumption)"
                    dot={false}
                  />

                  <Area
                    type="monotone"
                    dataKey="optimized"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorOptimized)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}