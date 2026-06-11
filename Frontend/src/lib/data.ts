import type {
  Device,
  Recommendation,
  AnalyticsTrend,
  PeakHour,
  HeatmapCell,
  DeviceBreakdown,
  ForecastPoint,
} from "./types";

export const devices: Device[] = [
  { id: "d1", name: "HVAC Unit A — Main Hall", type: "hvac", location: "Building A, Floor 1", status: "online", consumption: 342, efficiency: 87, lastReading: "2 min ago", health: 92 },
  { id: "d2", name: "LED Panel Array B2", type: "lighting", location: "Building B, Floor 2", status: "online", consumption: 45, efficiency: 96, lastReading: "1 min ago", health: 98 },
  { id: "d3", name: "Server Room Cooling", type: "hvac", location: "Data Center", status: "warning", consumption: 520, efficiency: 71, lastReading: "5 min ago", health: 64 },
  { id: "d4", name: "Solar Inverter #1", type: "solar", location: "Rooftop A", status: "online", consumption: -180, efficiency: 94, lastReading: "1 min ago", health: 96 },
  { id: "d5", name: "Smart Meter — West Wing", type: "meter", location: "Building C", status: "online", consumption: 267, efficiency: 82, lastReading: "3 min ago", health: 88 },
  { id: "d6", name: "Lab Equipment Cluster", type: "equipment", location: "Building A, Floor 3", status: "maintenance", consumption: 0, efficiency: 0, lastReading: "2 hrs ago", health: 35 },
  { id: "d7", name: "HVAC Unit C — Library", type: "hvac", location: "Library Wing", status: "online", consumption: 198, efficiency: 91, lastReading: "1 min ago", health: 94 },
  { id: "d8", name: "Outdoor Lighting Grid", type: "lighting", location: "Campus Grounds", status: "online", consumption: 78, efficiency: 88, lastReading: "2 min ago", health: 90 },
  { id: "d9", name: "Backup Generator", type: "equipment", location: "Utility Block", status: "offline", consumption: 0, efficiency: 0, lastReading: "1 day ago", health: 72 },
  { id: "d10", name: "IoT Sensor Network", type: "sensor", location: "All Buildings", status: "online", consumption: 12, efficiency: 99, lastReading: "30 sec ago", health: 99 },
  { id: "d11", name: "Solar Inverter #2", type: "solar", location: "Rooftop B", status: "online", consumption: -145, efficiency: 92, lastReading: "1 min ago", health: 93 },
  { id: "d12", name: "Water Heater System", type: "equipment", location: "Building A, Basement", status: "online", consumption: 156, efficiency: 78, lastReading: "4 min ago", health: 81 },
];

export const recommendations: Recommendation[] = [
  { id: "r1", title: "Optimize HVAC scheduling during off-peak hours", description: "Analysis shows HVAC units run at full capacity during unoccupied hours (10 PM - 6 AM). Implementing smart scheduling could reduce consumption by 23%.", impact: "high", category: "energy", estimated_savings: 4200, priority_score: 1, status: "pending" },
  { id: "r2", title: "Replace Server Room Cooling with liquid cooling", description: "Server Room Cooling unit is operating at 71% efficiency. Transitioning to modern liquid cooling could improve efficiency by 25% and extend equipment life.", impact: "high", category: "cost", estimated_savings: 8500, priority_score: 2, status: "pending" },
  { id: "r3", title: "Install motion sensors for lighting automation", description: "Outdoor and corridor lighting operates continuously. Motion-based activation would cut lighting costs by 40% while maintaining safety standards.", impact: "medium", category: "sustainability", estimated_savings: 2100, priority_score: 3, status: "implemented" },
  { id: "r4", title: "Schedule Lab Equipment maintenance cycle", description: "Lab Equipment Cluster has been offline. Preventive maintenance scheduling could prevent 15% of equipment failures and reduce downtime.", impact: "medium", category: "maintenance", estimated_savings: 3200, priority_score: 4, status: "pending" },
  { id: "r5", title: "Expand solar panel capacity on Rooftop C", description: "Current solar generation covers 18% of total consumption. Adding panels on Rooftop C could increase coverage to 32%, yielding significant long-term savings.", impact: "high", category: "sustainability", estimated_savings: 12000, priority_score: 5, status: "pending" },
  { id: "r6", title: "Implement demand response protocol", description: "During peak grid demand (2-5 PM), shifting non-critical loads to off-peak hours could reduce peak charges by 30%.", impact: "medium", category: "cost", estimated_savings: 3800, priority_score: 6, status: "pending" },
];

export const energyTrends: AnalyticsTrend[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 5, i + 1);
  const base = 2400 + Math.sin(i * 0.3) * 400;
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    consumption: Math.round(base + Math.random() * 200),
    baseline: Math.round(base + 300),
    optimized: Math.round(base - 200 + Math.random() * 100),
    cost: Math.round((base * 0.12) + Math.random() * 30),
  };
});

export const peakHours: PeakHour[] = Array.from({ length: 24 }, (_, i) => {
  const hour = `${i.toString().padStart(2, "0")}:00`;
  const base = i >= 8 && i <= 18 ? 300 + Math.sin((i - 8) * 0.31) * 150 : 100;
  return {
    hour,
    consumption: Math.round(base + Math.random() * 50),
    average: Math.round(base * 0.85),
  };
});

export const heatmapData: HeatmapCell[] = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data: HeatmapCell[] = [];
  days.forEach((day) => {
    for (let h = 0; h < 24; h++) {
      const isWeekend = day === "Sat" || day === "Sun";
      const isWorkHour = h >= 8 && h <= 18;
      let value = 20 + Math.random() * 30;
      if (!isWeekend && isWorkHour) value = 60 + Math.random() * 40;
      if (!isWeekend && h >= 12 && h <= 14) value = 80 + Math.random() * 20;
      data.push({ day, hour: h, value: Math.round(value) });
    }
  });
  return data;
})();

export const deviceBreakdown: DeviceBreakdown[] = [
  { type: "HVAC", consumption: 1060, percentage: 42, color: "#3B82F6" },
  { type: "Lighting", consumption: 323, percentage: 13, color: "#10B981" },
  { type: "Equipment", consumption: 456, percentage: 18, color: "#F59E0B" },
  { type: "Solar (Gen)", consumption: -325, percentage: -13, color: "#8B5CF6" },
  { type: "Other", consumption: 279, percentage: 11, color: "#EC4899" },
];

export const forecastData: ForecastPoint[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(2026, 5, 15 + i);
  const base = 2200 + Math.sin(i * 0.4) * 300;
  const isPast = i < 7;
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    actual: isPast ? Math.round(base + Math.random() * 150) : null,
    predicted: Math.round(base + 50),
    lower: Math.round(base - 150),
    upper: Math.round(base + 250),
  };
});
