"""AI-powered recommendations endpoints for optimization suggestions."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.session import get_db
from app.schemas.analytics import RecommendationResponse
from app.repositories.analytics import recommendation_repo
from app.services.recommendation_engine import recommendation_engine
from app.models.analytics import Recommendation
from app.core.logging import logger

router = APIRouter()


@router.get("/", response_model=list[RecommendationResponse])
async def list_recommendations(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    status: str | None = Query(default=None),
    category: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """
    List all AI-generated recommendations with optional filtering.
    Can filter by status (pending, implemented, dismissed) or category.
    """
    try:
        if status:
            recommendations = await recommendation_repo.get_by_status(db, status, limit)
        elif category:
            recommendations = await recommendation_repo.get_by_category(db, category, limit)
        else:
            recommendations = await recommendation_repo.get_multi(db, skip=skip, limit=limit)
        
        return recommendations
    except Exception as e:
        logger.error("list_recommendations_error", error=str(e))
        return []


@router.post("/generate", response_model=list[RecommendationResponse], status_code=status.HTTP_201_CREATED)
async def generate_recommendations(db: AsyncSession = Depends(get_db)):
    """
    Generate AI-driven recommendations based on real analytics data.
    Analyzes consumption patterns, device performance, and operational metrics
    using Gemini API to provide contextual, actionable suggestions.
    """
    try:
        # Generate recommendations using real database analytics
        recs_in = await recommendation_engine.generate_recommendations(db)
        
        if not recs_in:
            logger.warning("no_recommendations_generated")
            return []
        
        # Deduplicate by title to avoid storing duplicates
        created_recs = []
        for rec_in in recs_in:
            existing = await db.scalar(
                select(Recommendation).where(Recommendation.title == rec_in.title)
            )
            
            if not existing:
                created_rec = await recommendation_repo.create(db, obj_in=rec_in)
                created_recs.append(created_rec)
                logger.info("recommendation_created", title=rec_in.title, priority=rec_in.priority_score)
            else:
                logger.debug("recommendation_duplicate_skipped", title=rec_in.title)
        
        logger.info("recommendations_generated", count=len(created_recs))
        
        return created_recs
    except Exception as e:
        logger.error("generate_recommendations_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recommendations: {str(e)}",
        )


@router.get("/top", response_model=list[RecommendationResponse])
async def get_top_recommendations(
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get top-priority recommendations ready for implementation."""
    try:
        recommendations = await recommendation_repo.get_top_recommendations(db, limit=limit)
        return recommendations
    except Exception as e:
        logger.error("get_top_recommendations_error", error=str(e))
        return []


@router.get("/by-category/{category}", response_model=list[RecommendationResponse])
async def get_recommendations_by_category(
    category: str,
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get recommendations filtered by category (cost, energy, sustainability, maintenance)."""
    try:
        valid_categories = ["cost", "energy", "sustainability", "maintenance"]
        if category not in valid_categories:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category. Must be one of: {valid_categories}",
            )
        
        recommendations = await recommendation_repo.get_by_category(db, category, limit)
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_recommendations_by_category_error", category=category, error=str(e))
        return []


@router.get("/by-impact/{impact}", response_model=list[RecommendationResponse])
async def get_recommendations_by_impact(
    impact: str,
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get recommendations filtered by impact level (high, medium, low)."""
    try:
        valid_impacts = ["high", "medium", "low"]
        if impact not in valid_impacts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid impact. Must be one of: {valid_impacts}",
            )
        
        recommendations = await recommendation_repo.get_by_impact(db, impact, limit)
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_recommendations_by_impact_error", impact=impact, error=str(e))
        return []


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
async def get_recommendation(
    recommendation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific recommendation by ID."""
    try:
        recommendation = await recommendation_repo.get(db, id=recommendation_id)
        if not recommendation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recommendation {recommendation_id} not found",
            )
        return recommendation
    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_recommendation_error", recommendation_id=recommendation_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve recommendation",
        )


@router.patch("/{recommendation_id}/status", response_model=RecommendationResponse)
async def update_recommendation_status(
    recommendation_id: str,
    new_status: str = Query(..., description="pending, implemented, or dismissed"),
    db: AsyncSession = Depends(get_db),
):
    """Update the status of a recommendation (pending, implemented, dismissed)."""
    try:
        valid_statuses = ["pending", "implemented", "dismissed"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {valid_statuses}",
            )
        
        recommendation = await recommendation_repo.get(db, id=recommendation_id)
        if not recommendation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recommendation {recommendation_id} not found",
            )
        
        # Update status
        recommendation.status = new_status
        db.add(recommendation)
        await db.commit()
        await db.refresh(recommendation)
        
        logger.info("recommendation_status_updated", recommendation_id=recommendation_id, status=new_status)
        
        return recommendation
    except HTTPException:
        raise
    except Exception as e:
        logger.error("update_recommendation_status_error", recommendation_id=recommendation_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update recommendation",
        )


@router.delete("/{recommendation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recommendation(
    recommendation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a recommendation."""
    try:
        recommendation = await recommendation_repo.get(db, id=recommendation_id)
        if not recommendation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recommendation {recommendation_id} not found",
            )
        
        await recommendation_repo.remove(db, id=recommendation_id)
        
        logger.info("recommendation_deleted", recommendation_id=recommendation_id)
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error("delete_recommendation_error", recommendation_id=recommendation_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete recommendation",
        )


@router.post("/batch-generate")
async def batch_generate_recommendations(
    count: int = Query(default=1, ge=1, le=5),
    db: AsyncSession = Depends(get_db),
):
    """Generate multiple recommendation batches for comprehensive analysis."""
    try:
        all_recs = []
        for _ in range(count):
            recs = await recommendation_engine.generate_recommendations(db)
            
            for rec_in in recs:
                existing = await db.scalar(
                    select(Recommendation).where(Recommendation.title == rec_in.title)
                )
                
                if not existing:
                    created_rec = await recommendation_repo.create(db, obj_in=rec_in)
                    all_recs.append(created_rec)
        
        logger.info("batch_recommendations_generated", total=len(all_recs), batches=count)
        
        return {
            "status": "success",
            "batches_generated": count,
            "total_recommendations": len(all_recs),
            "recommendations": all_recs,
        }
    except Exception as e:
        logger.error("batch_generate_recommendations_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recommendations: {str(e)}",
        )

