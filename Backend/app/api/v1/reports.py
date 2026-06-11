"""Impact report endpoints with AI-driven generation and full CRUD operations."""
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database.session import get_db
from app.services.report_engine import report_engine
from app.repositories.analytics import report_repo, recommendation_repo
from app.schemas.analytics import ImpactReportResponse, RecommendationResponse
from app.core.logging import logger
from app.models.analytics import ImpactReport

router = APIRouter()


@router.get("/", response_model=list[ImpactReportResponse])
async def list_reports(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all historical impact reports."""
    try:
        reports = await report_repo.get_latest(db, limit=limit)
        return reports[skip : skip + limit]
    except Exception as e:
        logger.error("list_reports_error", error=str(e))
        return []


@router.post("/generate", response_model=ImpactReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    days_back: int = Query(default=30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a comprehensive AI-driven impact report for the specified period.
    Uses Gemini API to analyze analytics data and create actionable insights.
    """
    try:
        period_end = datetime.now(timezone.utc)
        period_start = period_end - timedelta(days=days_back)
        
        # Generate AI-powered report
        report_base = await report_engine.generate_impact_report(
            db, period_start, period_end
        )
        
        # Save to database
        report = await report_repo.create(db, obj_in=report_base)
        
        logger.info(
            "report_generated",
            report_id=report.id,
            period_days=days_back,
            title=report.title,
        )
        
        return report
    except Exception as e:
        logger.error("generate_report_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}",
        )


@router.get("/{report_id}", response_model=ImpactReportResponse)
async def get_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a specific impact report by ID."""
    try:
        report = await report_repo.get(db, id=report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report {report_id} not found",
            )
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_report_error", report_id=report_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve report",
        )


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(report_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a report by ID."""
    try:
        report = await report_repo.get(db, id=report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report {report_id} not found",
            )
        
        await report_repo.remove(db, id=report_id)
        
        logger.info("report_deleted", report_id=report_id)
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error("delete_report_error", report_id=report_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete report",
        )


@router.get("/{report_id}/recommendations", response_model=list[RecommendationResponse])
async def get_report_recommendations(
    report_id: str,
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get recommendations associated with a specific report."""
    try:
        report = await report_repo.get(db, id=report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Report {report_id} not found",
            )
        
        # Get top recommendations for the report's period
        recommendations = await recommendation_repo.get_top_recommendations(
            db, limit=limit, status="pending"
        )
        
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "get_report_recommendations_error",
            report_id=report_id,
            error=str(e),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve recommendations",
        )


@router.get("/period/{year}/{month}", response_model=list[ImpactReportResponse])
async def get_reports_by_period(
    year: int,
    month: int,
    db: AsyncSession = Depends(get_db),
):
    """Get all reports for a specific year and month."""
    try:
        # Validate month
        if not (1 <= month <= 12):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Month must be between 1 and 12",
            )
        
        period_start = datetime(year, month, 1)
        if month == 12:
            period_end = datetime(year + 1, 1, 1)
        else:
            period_end = datetime(year, month + 1, 1)
        
        reports = await report_repo.get_by_period(db, period_start, period_end)
        
        return reports
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_reports_by_period_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve reports",
        )


@router.post("/batch-generate", status_code=status.HTTP_202_ACCEPTED)
async def batch_generate_reports(
    periods: list[int] = Query(default=[7, 30, 90]),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate multiple reports for different periods in one call.
    Useful for creating comprehensive historical analysis.
    """
    try:
        results = []
        for days in periods:
            period_end = datetime.now(timezone.utc)
            period_start = period_end - timedelta(days=days)
            
            report_base = await report_engine.generate_impact_report(
                db, period_start, period_end
            )
            report = await report_repo.create(db, obj_in=report_base)
            
            results.append({
                "period_days": days,
                "report_id": report.id,
                "title": report.title,
                "total_savings": report.total_savings,
                "carbon_reduced": report.carbon_reduced,
            })
        
        logger.info("batch_reports_generated", count=len(results))
        
        return {
            "status": "success",
            "reports_generated": len(results),
            "reports": results,
        }
    except Exception as e:
        logger.error("batch_generate_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate reports: {str(e)}",
        )
