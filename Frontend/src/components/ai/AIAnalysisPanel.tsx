"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, TrendingUp, RefreshCw, Zap, DollarSign, Leaf, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIAnalysisPanel() {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalysis = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [analysisData, summaryData] = await Promise.all([
        api.aiAnalysis.deepAnalysis(),
        api.aiAnalysis.summary()
      ]);

      setAnalysis(analysisData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to load AI analysis:", error);
      // Set fallback data on error
      setAnalysis(null);
      setSummary(null);

      // Log which endpoint failed
      if (error instanceof Error) {
        const errorMsg = error.message;
        if (errorMsg.includes("404")) {
          console.error("[v0] Backend AI endpoints not found (404). Ensure backend is running on port 8000");
        } else if (errorMsg.includes("Connection refused")) {
          console.error("[v0] Cannot connect to backend. Is it running on port 8000?");
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const performanceRating = analysis?.analysis?.overall_performance || "excellent";
  const ratingColor =
    performanceRating.includes("excellent") ? "text-green-500" :
      performanceRating.includes("good") ? "text-blue-500" :
        performanceRating.includes("fair") ? "text-amber-500" :
          "text-red-500";

  // Show loading skeleton or error state
  if (loading && !analysis && !summary) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-background to-background border border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>AI-Powered Analysis</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Loading insights...
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-24 w-full rounded" />
        </CardContent>
      </Card>
    );
  }

  // Show error state when backend is unavailable
  if (!analysis && !summary && !loading) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 via-background to-background border border-amber-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-amber-900">Backend Not Available</CardTitle>
              <p className="text-sm text-amber-700 mt-1">
                Cannot connect to API server
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-amber-800">
            <p className="font-medium">To enable AI analysis:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Ensure backend is running: <code className="bg-amber-100 px-2 py-1 rounded text-xs">uvicorn app.main:app --reload --port 8000</code></li>
              <li>Check that <code className="bg-amber-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_API_URL=http://localhost:8000</code> is set in Frontend/.env.local</li>
              <li>Verify GEMINI_API_KEY is set in Backend/.env</li>
              <li>Click refresh once backend is running</li>
            </ol>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadAnalysis(true)}
              disabled={refreshing}
              className="mt-4 gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/5 via-background to-background border border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI-Powered Analysis
                  <Badge variant="outline" className="ml-2 text-xs">
                    {refreshing ? "Analyzing..." : "Ready"}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Gemini-powered facility insights
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadAnalysis(true)}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AI Summary */}
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/6 rounded" />
            </div>
          ) : summary?.analysis ? (
            <div className="bg-card rounded-lg border border-border p-4 space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Executive Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary.analysis.summary || "Loading insights..."}
              </p>
            </div>
          ) : null}

          {/* Performance Rating */}
          {!loading && analysis?.analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h4 className="text-sm font-semibold">Performance Rating</h4>
                <div className="flex items-center gap-3">
                  <div className={`text-3xl font-bold ${ratingColor}`}>
                    {performanceRating.split(" ")[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Overall Facility</p>
                    <p className="text-sm font-medium capitalize mt-1">{performanceRating}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h4 className="text-sm font-semibold">Key Insight</h4>
                <p className="text-sm text-muted-foreground">
                  {summary?.analysis?.key_insight || "AI analysis in progress..."}
                </p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          {!loading && analysis?.summary_metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-border bg-card/50 p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <p className="text-xs text-muted-foreground font-medium">Consumption</p>
                </div>
                <p className="text-lg font-bold">{(analysis.summary_metrics.total_consumption_kwh / 1000).toFixed(1)} MWh</p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <p className="text-xs text-muted-foreground font-medium">Total Cost</p>
                </div>
                <p className="text-lg font-bold">${(analysis.summary_metrics.total_cost_usd || 0).toFixed(0)}</p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  <p className="text-xs text-muted-foreground font-medium">Emissions</p>
                </div>
                <p className="text-lg font-bold">{(analysis.summary_metrics.total_emissions_kg_co2 / 1000).toFixed(1)}T</p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <p className="text-xs text-muted-foreground font-medium">Renewable</p>
                </div>
                <p className="text-lg font-bold">{(analysis.summary_metrics.renewable_percentage || 0).toFixed(1)}%</p>
              </div>
            </div>
          )}

          {/* Top Opportunities */}
          {!loading && analysis?.analysis?.efficiency_opportunities && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Top Opportunities
              </h4>
              <div className="space-y-2">
                {(Array.isArray(analysis.analysis.efficiency_opportunities)
                  ? analysis.analysis.efficiency_opportunities
                  : []).slice(0, 3).map((opportunity: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {typeof opportunity === 'string' ? opportunity : opportunity.title || opportunity}
                        </p>
                        {opportunity.expected_impact && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Impact: {opportunity.expected_impact}
                          </p>
                        )}
                      </div>
                      <TrendingUp className="h-4 w-4 text-success flex-shrink-0 mt-1" />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Implementation Roadmap */}
          {!loading && analysis?.analysis?.implementation_roadmap && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Implementation Roadmap
              </h4>
              <div className="space-y-2">
                {(Array.isArray(analysis.analysis.implementation_roadmap)
                  ? analysis.analysis.implementation_roadmap
                  : []).slice(0, 2).map((phase: any, index: number) => (
                    <div key={index} className="rounded-lg border border-border bg-card/50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{phase.phase || `Phase ${index + 1}`}</p>
                        <Badge variant="outline" className="text-xs">
                          {phase.expected_savings && `Saves ${phase.expected_savings}`}
                        </Badge>
                      </div>
                      {phase.actions && (
                        <ul className="space-y-1">
                          {(Array.isArray(phase.actions) ? phase.actions : []).slice(0, 2).map((action: any, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{typeof action === 'string' ? action : action}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Cost Assessment */}
          {!loading && summary?.analysis?.cost_assessment && (
            <div className="rounded-lg border border-border/50 bg-warning/5 p-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-warning" />
                Cost Assessment
              </h4>
              <p className="text-sm text-muted-foreground">
                {summary.analysis.cost_assessment}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div >
  );
}
