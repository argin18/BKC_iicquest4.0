"use client";

import { motion } from "framer-motion";
import { Zap, Activity, IndianRupee, Leaf } from "lucide-react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import EnergyTrendChart from "@/components/charts/EnergyTrendChart";
import PeakHourChart from "@/components/charts/PeakHourChart";
import DeviceBarChart from "@/components/charts/DeviceBarChart";
import RecommendationCard from "@/components/ai/RecommendationCard";
import DeviceTable from "@/components/devices/DeviceTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Recommendation } from "@/lib/types";

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [liveConsumption, setLiveConsumption] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [estCost, setEstCost] = useState(0);
  const [carbonOffset, setCarbonOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recs, summary] = await Promise.all([
          api.recommendations.list(),
          api.analytics.summary() as Promise<any>
        ]);
        setRecommendations(recs as Recommendation[]);
        setLiveConsumption(summary?.total_consumption ?? 0);
        setActiveDevices(summary?.active_devices ?? 0);
        setEstCost(summary?.estimated_cost ?? 0);
        setCarbonOffset(summary?.carbon_footprint ?? 0);
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchData();

    // WebSocket connection for live simulator
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const wsUrl = API_BASE.replace("http", "ws").replace("/api/v1", "/ws/energy");
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "energy_update") {
          setLiveConsumption(message.data.total_consumption);
          setActiveDevices(message.data.active_devices);
          setEstCost(Number((message.data.total_consumption * 0.14).toFixed(2)));
          setCarbonOffset(Number((message.data.total_consumption * 0.0005).toFixed(2)));
        }
      } catch (e) {}
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your energy infrastructure.</p>
        </motion.div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Consumption" value={liveConsumption.toLocaleString()} change={-4.2} unit="kWh" icon={Zap} color="primary" index={0} />
        <SummaryCard title="Active Devices" value={activeDevices.toString()} change={0} unit="/ 12" icon={Activity} color="success" index={1} />
        <SummaryCard title="Est. Cost" value={`Rs${estCost.toLocaleString()}`} change={-5.1} icon={IndianRupee} color="warning" index={2} />
        <SummaryCard title="Carbon Offset" value={carbonOffset.toLocaleString()} change={8.4} unit="tons" icon={Leaf} color="success" index={3} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnergyTrendChart />
        </div>
        <div className="lg:col-span-1">
          <DeviceBarChart />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PeakHourChart />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-1 flex flex-col rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold tracking-tight">Top AI Insights</h3>
              <span className="text-xs font-medium text-primary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="flex-1 space-y-3">
              {loadingRecs ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : recommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No insights available.</p>
              ) : (
                recommendations.slice(0, 3).map((rec, i) => (
                  <RecommendationCard key={rec.id} recommendation={rec} index={i} compact />
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Device Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <DeviceTable />
      </motion.div>
    </div>
  );
}
