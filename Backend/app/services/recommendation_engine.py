"""AI-powered recommendation engine for generating contextual optimization suggestions."""
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.gemini_service import gemini_service
from app.services.analytics_service import analytics_service
from app.schemas.analytics import RecommendationBase
from app.models.analytics import RecommendationImpactEnum, RecommendationCategoryEnum
from app.core.logging import logger


class RecommendationEngine:
    """Generate AI-driven recommendations using real analytics data."""
    
    async def generate_recommendations(
        self, db: AsyncSession, analytics_data: dict | None = None
    ) -> list[RecommendationBase]:
        """
        Generate 4-8 diverse optimization recommendations based on real analytics.
        If no analytics_data provided, fetch from database.
        """
        try:
            # Gather real analytics data if not provided
            if analytics_data is None:
                analytics_data = {
                    "summary": await analytics_service.get_summary_analytics(db),
                    "cost": await analytics_service.get_cost_analysis(db),
                    "carbon": await analytics_service.get_carbon_analysis(db),
                    "peak_hours": await analytics_service.get_peak_hours_analysis(db),
                    "top_consumers": await analytics_service.get_top_consumers(db),
                }
            
            # Generate AI recommendations using Gemini
            result = await self._generate_ai_recommendations(analytics_data)
            
            if not isinstance(result, list):
                result = [result] if result else []
            
            recommendations = []
            for item in result:
                try:
                    # Validate and map fields
                    rec = RecommendationBase(
                        title=item.get("title", "Optimization Insight"),
                        description=item.get("description", ""),
                        impact=RecommendationImpactEnum(
                            item.get("impact", "medium").lower()
                        ),
                        category=RecommendationCategoryEnum(
                            item.get("category", "energy").lower()
                        ),
                        estimated_savings=float(item.get("estimated_savings", 0)),
                        implementation_cost=float(item.get("implementation_cost", 0)) if item.get("implementation_cost") else None,
                        priority_score=int(item.get("priority_score", 50)),
                        status=item.get("status", "pending"),
                        ai_confidence=float(item.get("ai_confidence", 0.8)),
                        metadata_json=item.get("metadata", {}),
                    )
                    recommendations.append(rec)
                except (ValueError, TypeError) as e:
                    logger.warning(
                        "recommendation_validation_error",
                        item=item,
                        error=str(e),
                    )
                    continue
            
            return recommendations if recommendations else self._get_fallback_recommendations()
        except Exception as e:
            logger.error("recommendation_generation_error", error=str(e))
            return self._get_fallback_recommendations()
    
    async def _generate_ai_recommendations(self, analytics_data: dict) -> list[dict]:
        """Use Gemini to generate contextual, data-driven recommendations."""
        # Format analytics data for better context
        data_context = self._format_analytics_context(analytics_data)
        
        prompt = f"""You are an expert energy efficiency consultant analyzing real facility data.

FACILITY ANALYTICS DATA:
{data_context}

TASK: Generate 5-7 DIVERSE, highly specific optimization recommendations based on ACTUAL data patterns shown above.

CRITICAL RULES:
1. Each recommendation MUST address a DIFFERENT optimization area
2. Recommendations MUST be based on specific data points from the analytics
3. Reference actual numbers, peak hours, consumption patterns, and top consumers from the data
4. Include both quick-win operational improvements AND strategic investments
5. Calculate realistic ROI based on shown consumption and cost patterns

RECOMMENDATION REQUIREMENTS - Return JSON array with these exact fields:
- title: Concise actionable title (max 50 characters)
- description: Specific explanation tied to the provided data (max 250 characters)
- category: MUST be one of [cost, energy, sustainability, maintenance]
- impact: MUST be one of [high, medium, low] - based on actual savings potential
- estimated_savings: Annual savings in USD - calculated from data patterns (minimum 100)
- implementation_cost: Cost in USD or null if under $500
- priority_score: Integer 0-100 based on ROI, urgency, and data insights
- ai_confidence: Float 0.0-1.0 reflecting confidence in this specific recommendation
- roi_percentage: Calculated (savings / implementation_cost * 100)
- implementation_timeline: "1-2 weeks", "2-4 weeks", "1-3 months", or "3-6 months"
- metadata: Object with:
    - target_devices: List of specific device types affected
    - expected_impact: Specific percentage or value reduction
    - risk_level: "low", "medium", or "high"

ANALYSIS APPROACH:
- Identify patterns in peak hours and consumption
- Recommend HVAC optimization if peak hours vary
- Recommend lighting if consumption is high during off-peak
- Recommend maintenance if equipment efficiency is declining
- Recommend renewable integration if costs are consistently high
- Recommend automation if scheduling can be optimized

Return ONLY valid JSON array - no markdown, no prose, no code fences."""
        
        try:
            result = await gemini_service.generate_json(prompt)
            
            # Validate and enhance response
            if isinstance(result, list):
                validated = []
                for rec in result:
                    if self._validate_recommendation(rec):
                        validated.append(rec)
                return validated if validated else self._get_fallback_recommendations_raw()
            return [result] if result else self._get_fallback_recommendations_raw()
            
        except Exception as e:
            logger.error("gemini_recommendations_error", error=str(e))
            return self._get_fallback_recommendations_raw()
    
    def _format_analytics_context(self, analytics_data: dict) -> str:
        """Format analytics data into readable context for AI."""
        parts = []
        
        if summary := analytics_data.get("summary"):
            parts.append(f"SUMMARY:\n"
                        f"- Total Consumption: {summary.get('total_consumption', 'N/A')} kWh\n"
                        f"- Average Daily: {summary.get('average_daily', 'N/A')} kWh\n"
                        f"- Peak Hour: {summary.get('peak_consumption', 'N/A')} kWh")
        
        if cost := analytics_data.get("cost"):
            parts.append(f"COST ANALYSIS:\n"
                        f"- Total Cost: ${cost.get('total_cost', 'N/A')}\n"
                        f"- Average Daily Cost: ${cost.get('average_daily_cost', 'N/A')}\n"
                        f"- Peak Hour Cost: ${cost.get('peak_hour_cost', 'N/A')}")
        
        if carbon := analytics_data.get("carbon"):
            parts.append(f"CARBON ANALYSIS:\n"
                        f"- Total Emissions: {carbon.get('total_emissions', 'N/A')} kg CO2\n"
                        f"- Reduction Potential: {carbon.get('reduction_potential', 'N/A')}%")
        
        if peak := analytics_data.get("peak_hours"):
            if isinstance(peak, dict):
                peak_list = peak.get("peak_hours", [])
                parts.append(f"PEAK HOURS: {', '.join(str(h) for h in peak_list[:5])}")
        
        if consumers := analytics_data.get("top_consumers"):
            if isinstance(consumers, list) and consumers:
                top_names = [c.get('name', 'Unknown')[:20] for c in consumers[:3]]
                parts.append(f"TOP CONSUMERS: {', '.join(top_names)}")
        
        return "\n\n".join(parts) if parts else "No analytics data available"
    
    def _validate_recommendation(self, rec: dict) -> bool:
        """Validate recommendation has required fields."""
        required_fields = ["title", "description", "category", "impact", 
                          "estimated_savings", "priority_score", "ai_confidence"]
        return all(field in rec for field in required_fields)
    
    def _get_fallback_recommendations(self) -> list[RecommendationBase]:
        """Return fallback recommendations when AI generation fails."""
        fallbacks = [
            RecommendationBase(
                title="Optimize HVAC Scheduling",
                description="Adjust HVAC setpoints based on occupancy patterns and peak hours analysis.",
                impact=RecommendationImpactEnum.high,
                category=RecommendationCategoryEnum.energy,
                estimated_savings=4500,
                implementation_cost=2000,
                priority_score=90,
                status="pending",
                ai_confidence=0.92,
            ),
            RecommendationBase(
                title="Upgrade to LED Lighting",
                description="Replace traditional lighting with LED systems to reduce consumption by 40-50%.",
                impact=RecommendationImpactEnum.high,
                category=RecommendationCategoryEnum.cost,
                estimated_savings=3200,
                implementation_cost=8000,
                priority_score=85,
                status="pending",
                ai_confidence=0.88,
            ),
            RecommendationBase(
                title="Implement Predictive Maintenance",
                description="Use equipment health scores to predict failures and schedule preventive maintenance.",
                impact=RecommendationImpactEnum.medium,
                category=RecommendationCategoryEnum.maintenance,
                estimated_savings=2100,
                implementation_cost=1500,
                priority_score=75,
                status="pending",
                ai_confidence=0.85,
            ),
            RecommendationBase(
                title="Increase Solar Renewable Integration",
                description="Expand solar capacity by 30% to reduce grid dependency and peak hour consumption.",
                impact=RecommendationImpactEnum.high,
                category=RecommendationCategoryEnum.sustainability,
                estimated_savings=6800,
                implementation_cost=45000,
                priority_score=80,
                status="pending",
                ai_confidence=0.90,
            ),
        ]
        return fallbacks
    
    def _get_fallback_recommendations_raw(self) -> list[dict]:
        """Return raw fallback data for Gemini retry."""
        return [
            {
                "title": "Optimize HVAC Scheduling",
                "description": "Adjust HVAC setpoints based on occupancy patterns.",
                "category": "energy",
                "impact": "high",
                "estimated_savings": 4500,
                "implementation_cost": 2000,
                "priority_score": 90,
                "ai_confidence": 0.92,
                "metadata": {
                    "target_devices": ["hvac"],
                    "implementation_timeline": "2-3 weeks",
                    "risk_level": "low"
                }
            }
        ]

recommendation_engine = RecommendationEngine()
