"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PeakHour } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {payload[0].value} kWh
      </p>
    </div>
  );
};

export default function PeakHourChart() {
  const [hours, setHours] = useState<PeakHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = (await api.analytics.peakHours()) as PeakHour[];

        if (!mounted) return;

        setHours(data ?? []);
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
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Peak Hour Analysis
            </CardTitle>

            <span className="text-[11px] text-muted-foreground">
              Last 24 hours
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hours}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                  style={{ outline: "none" }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1F2937"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                    tickLine={false}
                    axisLine={false}
                    interval={2}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                  />

                  <Bar
                    dataKey="consumption"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  >
                    {hours.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.consumption > 350
                            ? "#EF4444"
                            : entry.consumption > 250
                            ? "#F59E0B"
                            : "#3B82F6"
                        }
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}