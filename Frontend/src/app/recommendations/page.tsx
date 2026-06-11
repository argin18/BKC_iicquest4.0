"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCcw, Loader2 } from "lucide-react";
import RecommendationCard from "@/components/ai/RecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Recommendation } from "@/lib/types";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const data = await api.recommendations.list() as Recommendation[];
      const uniqueRecs = Array.from(new Map(data.map(item => [item.title, item])).values());
      setRecommendations(uniqueRecs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImplement = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.recommendations.generate();
      await fetchRecs();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <div className="rounded-md bg-primary/10 p-1">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mt-1">Actionable, AI-driven recommendations to optimize your infrastructure.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button variant="default" size="sm" className="gap-2 h-10" onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            {generating ? "Analyzing..." : "Generate Insights"}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))
        ) : recommendations.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No recommendations generated yet. Click "Generate Insights" to run AI analysis.
          </div>
        ) : (
          recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={i} onImplement={handleImplement} />
          ))
        )}
      </div>
    </div>
  );
}
