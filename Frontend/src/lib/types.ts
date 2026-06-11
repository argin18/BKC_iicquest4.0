export interface Device {
  id: string;
  name: string;
  type: string;
  location?: string;
  status: "online" | "offline" | "warning" | "maintenance";
  consumption?: number;
  baseline_consumption?: number;
  efficiency?: number;
  lastReading?: string;
  health?: number;
  health_score?: number;
  room_id?: string;
}

export interface EnergyReading {
  timestamp: string;
  consumption: number;
  generation: number;
  cost: number;
}

export interface KPIData {
  title: string;
  value: string;
  change: number;
  unit: string;
  icon: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "cost" | "energy" | "sustainability" | "maintenance";
  estimated_savings: number;
  priority_score: number;
  status: "pending" | "implemented" | "dismissed";
  ai_confidence?: number;
  metadata_json?: {
    roi_percentage?: number;
    [key: string]: any;
  };
}

export interface AnalyticsTrend {
  date: string;
  consumption: number;
  baseline: number;
  optimized: number;
  cost: number;
}

export interface PeakHour {
  hour: string;
  consumption: number;
  average: number;
}

export interface ImpactMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
}

export interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

export interface DeviceBreakdown {
  type: string;
  consumption: number;
  percentage: number;
  color: string;
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  lower: number;
  upper: number;
}
