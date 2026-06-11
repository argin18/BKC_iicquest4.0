const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  devices: {
    list: () => fetchApi("/devices"),
    get: (id: string) => fetchApi(`/devices/${id}`),
    create: (data: any) => fetchApi("/devices", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchApi(`/devices/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/devices/${id}`, { method: "DELETE" }),
  },
  readings: {
    latest: () => fetchApi("/readings/latest"),
    history: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return fetchApi(`/readings/history${query}`);
    },
  },
  analytics: {
    summary: () => fetchApi("/analytics/summary"),
    trends: () => fetchApi("/analytics/trends"),
    topConsumers: () => fetchApi("/analytics/top-consumers"),
    peakHours: () => fetchApi("/analytics/peak-hours"),
    costAnalysis: () => fetchApi("/analytics/cost-analysis"),
    carbonAnalysis: () => fetchApi("/analytics/carbon-analysis"),
  },
  predictive: {
    forecast: () => fetchApi("/predictive/forecast/consumption"),
    health: (deviceId: string) => fetchApi(`/predictive/health/${deviceId}`),
    anomalies: () => fetchApi("/predictive/anomalies"),
    optimization: () => fetchApi("/predictive/optimization-potential"),
  },
  recommendations: {
    list: () => fetchApi("/recommendations"),
    generate: () => fetchApi("/recommendations/generate", { method: "POST" }),
  },
  reports: {
    list: () => fetchApi("/reports"),
    generate: () => fetchApi("/reports/generate", { method: "POST" }),
    get: (id: string) => fetchApi(`/reports/${id}`),
  },
  aiAnalysis: {
    summary: () => fetchApi("/analytics/ai/ai-summary"),
    comparison: (period1Days?: number, period2Days?: number) => {
      const params = new URLSearchParams();
      if (period1Days) params.append("period1_days", period1Days.toString());
      if (period2Days) params.append("period2_days", period2Days.toString());
      const query = params.toString() ? "?" + params.toString() : "";
      return fetchApi(`/analytics/ai/comparison${query}`);
    },
    deepAnalysis: () => fetchApi("/analytics/ai/deep-analysis"),
    serviceStatus: () => fetchApi("/analytics/ai/service-status"),
  },
};
