"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2, Sparkles, TrendingUp, AlertCircle, Zap, Leaf, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportDisplay() {
  const [report, setReport] = useState<any | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch report
        const list = (await api.reports.list()) as any[];
        if (!mounted) return;
        setReport(list?.[0] ?? null);
        
        // Fetch AI analysis
        setLoadingAI(true);
        try {
          const analysis = await api.aiAnalysis.deepAnalysis();
          if (mounted) {
            setAiAnalysis(analysis);
          }
        } catch (aiError) {
          console.warn("AI analysis failed:", aiError);
          setAiAnalysis(null);
        } finally {
          if (mounted) setLoadingAI(false);
        }
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
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20 bg-primary/[0.02] shadow-lg shadow-primary/5">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Executive Impact Summary</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">AI-generated monthly optimization report</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background text-xs font-medium">
                {format(new Date(), "MMMM d, yyyy")}
              </Badge>
              <Button size="sm" className="gap-2" onClick={() => window.print()}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Executive Summary from AI */}
            {aiAnalysis && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Executive Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiAnalysis.analysis?.overall_performance || aiAnalysis.summary || "Loading AI insights..."}
                </p>
              </div>
            )}
            
            {/* Key Findings from Report */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Key Findings
              </h4>
              {loading || loadingAI ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              ) : !report && !aiAnalysis ? (
                <p className="text-sm text-muted-foreground">No reports available.</p>
              ) : (
                <ul className="space-y-3">
                  {(aiAnalysis?.analysis?.key_findings || 
                    (Array.isArray(report?.full_report_data?.key_findings) ? report.full_report_data.key_findings : [report?.executive_summary]) ||
                    []).slice(0, 4).map((finding: any, i: number) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{typeof finding === 'string' ? finding : `${finding.category}: ${finding.finding}`}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* AI Metrics */}
            {aiAnalysis?.summary_metrics && (
              <div>
                <h4 className="text-sm font-semibold mb-3">AI Analysis Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Consumption</p>
                      <p className="text-sm font-semibold">{(aiAnalysis.summary_metrics.total_consumption_kwh / 1000).toFixed(1)} MWh</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                      <p className="text-sm font-semibold">${aiAnalysis.summary_metrics.total_cost_usd?.toFixed(0) || '—'}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Emissions</p>
                      <p className="text-sm font-semibold">{(aiAnalysis.summary_metrics.total_emissions_kg_co2 / 1000).toFixed(1)} T CO2</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Renewable</p>
                      <p className="text-sm font-semibold">{aiAnalysis.summary_metrics.renewable_percentage?.toFixed(1) || '0'}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Impact Summary from Report */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Carbon Offset</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{loading ? '—' : (report?.carbon_reduced ?? '—')}</span>
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
                <p className="text-xs text-success mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Reduction achieved
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Cost Savings</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{loading ? '—' : `$${(report?.total_savings ?? '—')}`}</span>
                </div>
                <p className="text-xs text-success mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Identified potential
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Efficiency Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{loading || loadingAI ? '—' : (aiAnalysis?.summary_metrics?.renewable_percentage ?? '0').toFixed(0)}</span>
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-success mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> AI evaluated
                </p>
              </div>
            </div>
            
            {/* AI Recommendations */}
            {aiAnalysis?.analysis?.efficiency_opportunities && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" /> Top Improvement Areas
                </h4>
                <ul className="space-y-2">
                  {(Array.isArray(aiAnalysis.analysis.efficiency_opportunities) ? aiAnalysis.analysis.efficiency_opportunities : []).slice(0, 3).map((opportunity: any, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="inline-block w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-semibold">{i + 1}</span>
                      <span>{typeof opportunity === 'string' ? opportunity : opportunity.title || opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
