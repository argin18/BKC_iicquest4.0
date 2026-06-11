"""AI-powered analytics analysis endpoints for comprehensive data-driven insights."""
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.gemini_service import gemini_service
from app.services.analytics_service import analytics_service
from app.core.logging import logger

router = APIRouter()


@router.get("/ai-summary")
async def get_ai_summary(
    days_back: int = Query(default=30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    """
    Get AI-generated summary of analytics data using Gemini.
    Provides instant insights without needing to interpret raw data.
    """
    try:
        # Gather comprehensive analytics data
        summary = await analytics_service.get_summary_analytics(db)
        cost = await analytics_service.get_cost_analysis(db)
        carbon = await analytics_service.get_carbon_analysis(db)
        peak_hours = await analytics_service.get_peak_hours_analysis(db)
        top_consumers = await analytics_service.get_top_consumers(db, limit=5)
        
        # Format for AI analysis
        data_context = f"""
FACILITY ANALYTICS SUMMARY:
- Total Consumption: {summary.get('total_consumption', 0):.2f} kWh
- Daily Average: {summary.get('average_daily', 0):.2f} kWh
- Peak Hour: {summary.get('peak_consumption', 0):.2f} kWh

FINANCIAL METRICS:
- Total Cost: ${cost.get('total_cost', 0):.2f}
- Daily Average Cost: ${cost.get('average_daily_cost', 0):.2f}
- Monthly Savings Potential: ${cost.get('monthly_savings_potential', 0):.2f}

ENVIRONMENTAL IMPACT:
- Total CO2 Emissions: {carbon.get('total_emissions', 0):.2f} kg
- Monthly Rate: {carbon.get('monthly_carbon_kg', 0):.2f} kg CO2
- Reduction Potential: {carbon.get('reduction_potential', 0)}%

PEAK HOURS: {peak_hours.get('peak_hours', []) if isinstance(peak_hours, dict) else peak_hours}

TOP CONSUMERS:
{chr(10).join(f"- {c.get('name', 'Unknown')}: {c.get('consumption', 0):.2f} kWh" for c in (top_consumers if isinstance(top_consumers, list) else [])[:5])}
"""
        
        prompt = f"""Analyze the following facility analytics data and provide a clear, concise executive summary.
{data_context}

Provide a JSON response with:
- summary: 2-3 sentence overview of facility performance
- key_insight: Most important finding (what should the user focus on?)
- cost_assessment: Brief analysis of costs and savings opportunity
- environmental_impact: Carbon footprint and improvement potential
- priority_action: Single most important action to take
- confidence: Your confidence level (0.0-1.0) in this analysis

Format: Return ONLY valid JSON."""
        
        result = await gemini_service.generate_json(prompt)
        
        if not isinstance(result, dict):
            result = {"summary": str(result)}
        
        result.setdefault("summary", "Analysis unavailable")
        result.setdefault("key_insight", "")
        result.setdefault("cost_assessment", "")
        result.setdefault("environmental_impact", "")
        result.setdefault("priority_action", "")
        result.setdefault("confidence", 0.0)
        
        logger.info("ai_summary_generated", confidence=result.get("confidence"))
        
        return {
            "status": "success",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "analysis": result,
            "data_points": {
                "total_consumption_kwh": summary.get("total_consumption", 0),
                "total_cost_usd": cost.get("total_cost", 0),
                "total_emissions_kg_co2": carbon.get("total_emissions", 0),
            }
        }
    
    except Exception as e:
        logger.error("ai_summary_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI summary: {str(e)}",
        )


@router.get("/comparison")
async def get_analytics_comparison(
    period1_days: int = Query(default=30, ge=1, le=365),
    period2_days: int = Query(default=30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    """
    Compare analytics across two time periods using AI analysis.
    Shows trends, improvements, and areas needing attention.
    """
    try:
        # Get analytics for both periods
        current_summary = await analytics_service.get_summary_analytics(db)
        current_cost = await analytics_service.get_cost_analysis(db)
        current_carbon = await analytics_service.get_carbon_analysis(db)
        
        comparison_data = f"""
CURRENT PERIOD ({period1_days} days):
- Consumption: {current_summary.get('total_consumption', 0):.2f} kWh
- Cost: ${current_cost.get('total_cost', 0):.2f}
- CO2: {current_carbon.get('total_emissions', 0):.2f} kg
- Daily Average: {current_summary.get('average_daily', 0):.2f} kWh/day
- Cost per kWh: ${current_cost.get('cost_per_kwh', 0):.4f}
"""
        
        prompt = f"""Analyze this energy facility's performance data and trends.
{comparison_data}

Provide JSON response with:
- trend_analysis: Is performance improving, declining, or stable? Why?
- consumption_trend: Change in consumption (increasing/decreasing/stable) and percentage
- cost_efficiency: Cost per kWh analysis and efficiency rating
- carbon_trend: Emissions trend and improvement potential
- anomalies: Any unusual patterns or consumption spikes detected
- outlook: Predicted trends for next period if current pattern continues
- recommendations: Top 2-3 specific actions to improve metrics

Format: Return ONLY valid JSON."""
        
        result = await gemini_service.generate_json(prompt)
        
        if not isinstance(result, dict):
            result = {}
        
        return {
            "status": "success",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "analysis": result,
            "metrics": {
                "current_consumption": current_summary.get("total_consumption", 0),
                "current_cost": current_cost.get("total_cost", 0),
                "current_emissions": current_carbon.get("total_emissions", 0),
                "efficiency_score": round(100 - (current_cost.get("cost_per_kwh", 0) * 100), 1),
            }
        }
    
    except Exception as e:
        logger.error("comparison_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate comparison analysis: {str(e)}",
        )


@router.get("/deep-analysis")
async def get_deep_analysis(
    db: AsyncSession = Depends(get_db),
):
    """
    Generate comprehensive deep-dive analysis of facility performance.
    Includes detailed breakdowns, patterns, and strategic recommendations.
    """
    try:
        # Gather all available analytics
        summary = await analytics_service.get_summary_analytics(db)
        cost = await analytics_service.get_cost_analysis(db)
        carbon = await analytics_service.get_carbon_analysis(db)
        peak_hours = await analytics_service.get_peak_hours_analysis(db)
        top_consumers = await analytics_service.get_top_consumers(db, limit=10)
        
        data_context = f"""
FACILITY DATA:
Consumption: {summary.get('total_consumption', 0):.2f} kWh (avg {summary.get('average_daily', 0):.2f} daily)
Peak: {summary.get('peak_consumption', 0):.2f} kWh

Costs: ${cost.get('total_cost', 0):.2f} (${cost.get('average_daily_cost', 0):.2f} daily)
Rate: ${cost.get('cost_per_kwh', 0):.4f}/kWh

Carbon: {carbon.get('total_emissions', 0):.2f} kg CO2 ({carbon.get('monthly_carbon_kg', 0):.2f}/month)
Renewable: {carbon.get('current_renewable_percent', 0)}%

Peak Hours: {peak_hours.get('peak_hours', []) if isinstance(peak_hours, dict) else peak_hours}

Top Consumers: {', '.join(c.get('name', 'Unknown') for c in (top_consumers if isinstance(top_consumers, list) else [])[:5])}
"""
        
        prompt = f"""Conduct a comprehensive energy facility analysis:
{data_context}

Generate JSON with:
- overall_performance: Rating (excellent/good/fair/poor) with detailed justification
- consumption_analysis: Detailed consumption patterns and efficiency insights
- cost_analysis: Cost drivers, efficiency metrics, and savings opportunities
- carbon_footprint: Emissions analysis and reduction pathways
- peak_demand: Pattern analysis and demand reduction opportunities
- efficiency_opportunities: Ranked list of top 5 improvement areas with potential ROI
- risk_factors: Any concerning trends or inefficiencies
- investment_opportunities: Capital projects with payback periods
- quick_wins: No-cost or low-cost improvements
- 12_month_roadmap: Phased approach to improvements
- benchmarking: How this facility compares to industry standards
- implementation_priority: Action priority based on impact and feasibility

Format: Return ONLY valid JSON."""
        
        result = await gemini_service.generate_json(prompt)
        
        if not isinstance(result, dict):
            result = {}
        
        return {
            "status": "success",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "analysis": result,
            "summary_metrics": {
                "total_consumption_kwh": summary.get("total_consumption", 0),
                "total_cost_usd": cost.get("total_cost", 0),
                "total_emissions_kg_co2": carbon.get("total_emissions", 0),
                "renewable_percentage": carbon.get("current_renewable_percent", 0),
                "cost_per_kwh": cost.get("cost_per_kwh", 0),
            }
        }
    
    except Exception as e:
        logger.error("deep_analysis_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate deep analysis: {str(e)}",
        )


@router.get("/service-status")
async def get_service_status():
    """Get Gemini AI service health and token usage status."""
    try:
        status = gemini_service.get_status()
        
        return {
            "status": "healthy" if status.get("available") else "unavailable",
            "service": status,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        logger.error("service_status_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get service status",
        )
