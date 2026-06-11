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
  Legend,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { DeviceBreakdown } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { type: string; percentage: number; color: string } }> }) => {
  if (!active || !payload) return null;
  const data = payload[0]?.payload;
  if (!data) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="mb-1 text-xs font-medium text-foreground">{data.type}</p>
      <p className="text-sm text-muted-foreground">
        {Math.abs(data.consumption ?? payload[0].value).toLocaleString()} kWh ({data.percentage > 0 ? data.percentage : Math.abs(data.percentage)}%)
      </p>
    </div>
  );
};

export default function DeviceBarChart() {
  const [breakdown, setBreakdown] = useState<DeviceBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = (await api.analytics.topConsumers()) as DeviceBreakdown[];
        if (!mounted) return;
        setBreakdown(data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Consumption by Device Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <div className="p-6 h-full w-full flex items-center justify-center">
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
                <BarChart
                  data={breakdown.map((d) => ({ ...d, absConsumption: Math.abs(d.consumption) }))}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  style={{ outline: 'none' }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} stroke="#9CA3AF" tickLine={false} axisLine={false} width={70} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.05)" }} />
                  <Legend />
                  <Bar dataKey="absConsumption" name="Consumption (kWh)" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {breakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
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
