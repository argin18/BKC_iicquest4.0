# Gemini API Integration - Setup Guide

This document provides comprehensive instructions for setting up and using the Gemini API integration for data-driven AI analysis in the IIROS platform.

## Overview

The IIROS platform now includes **complete Gemini API integration** for intelligent energy analysis:

- **Enhanced Gemini Service**: Robust API client with timeout handling, token tracking, retry logic, and graceful fallback
- **AI-Powered Recommendations**: Data-driven optimization suggestions with ROI calculations and implementation timelines
- **AI-Powered Reports**: Comprehensive impact analysis with financial and environmental insights
- **AI Analysis Endpoints**: New `/api/v1/analytics/ai/*` endpoints for instant data-driven insights
- **Frontend Integration**: AI-enhanced UI components showing confidence scores, metrics, and actionable insights

## Prerequisites

- Google Cloud Account with Gemini API enabled
- Valid Gemini API Key
- Backend running Python 3.8+ with FastAPI
- Frontend running Node.js with Next.js

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key" or use existing key
3. Copy the API key (starts with `AIza...`)
4. Store securely - never commit to version control

### 2. Configure Backend Environment

**Option A: Development Setup**

Create or update `.env` file in the Backend directory:

```bash
# Backend/.env
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite+aiosqlite:///./iiros.db
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Option B: Docker/Production**

Set environment variable:

```bash
export GEMINI_API_KEY=your_api_key_here
```

### 3. Start Backend Server

```bash
cd Backend

# Install dependencies (if needed)
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use python
python -m uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

**Health Check:**
```bash
curl http://localhost:8000/health
# Response: {"status": "healthy", "version": "1.0.0", "environment": "development"}
```

### 4. Configure Frontend Environment

Create or update `.env.development.local` in Frontend directory:

```bash
# Frontend/.env.development.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 5. Start Frontend Server

```bash
cd Frontend

# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## API Endpoints Overview

### AI Analysis Endpoints

All endpoints are under `/api/v1/analytics/ai/`:

#### 1. Get AI Summary
```
GET /analytics/ai/ai-summary?days_back=30
```
**Returns:** Gemini-generated executive summary with key insights
**Response:**
```json
{
  "status": "success",
  "analysis": {
    "summary": "AI-generated 2-3 sentence overview",
    "key_insight": "Primary finding for the user to focus on",
    "cost_assessment": "Cost analysis and savings opportunity",
    "environmental_impact": "Carbon reduction insights",
    "priority_action": "Single most important next step",
    "confidence": 0.95
  },
  "data_points": {
    "total_consumption_kwh": 15000,
    "total_cost_usd": 1850,
    "total_emissions_kg_co2": 4500
  }
}
```

#### 2. Analytics Comparison
```
GET /analytics/ai/comparison?period1_days=30&period2_days=30
```
**Returns:** Trend analysis comparing two periods
**Response includes:** consumption trend, cost efficiency, carbon trend, anomalies, outlook, recommendations

#### 3. Deep Analysis
```
GET /analytics/ai/deep-analysis
```
**Returns:** Comprehensive facility analysis with:
- Overall performance rating (excellent/good/fair/poor)
- Consumption analysis with efficiency insights
- Cost drivers and savings opportunities
- Carbon footprint and reduction pathways
- Peak demand patterns and optimization potential
- Top 5 efficiency improvement opportunities with ROI
- Risk factors and investment opportunities
- 12-month implementation roadmap
- Benchmarking against industry standards

#### 4. Service Status
```
GET /analytics/ai/service-status
```
**Returns:** Gemini service health and token usage statistics

### Recommendation Endpoints

#### Generate AI Recommendations
```
POST /recommendations/generate
```
**Returns:** 5-7 diverse, data-driven recommendations with:
- Title and detailed description (tied to actual data)
- Impact level (high/medium/low)
- Estimated annual savings
- Implementation cost and timeline
- ROI percentage
- AI confidence score (0.0-1.0)
- Risk assessment
- Target devices and expected impact

### Report Endpoints

#### Generate Impact Report
```
POST /reports/generate?days_back=30
```
**Returns:** Comprehensive AI-generated report with:
- Executive summary based on actual data
- Key findings across energy, cost, carbon, peak hours
- Performance analysis and efficiency metrics
- Financial impact summary
- Environmental impact assessment
- Strategic recommendations (quick wins, medium-term, long-term)
- Implementation roadmap with phases
- Success metrics and next immediate action

## Frontend Components

### 1. AIAnalysisPanel Component
**Location:** `src/components/ai/AIAnalysisPanel.tsx`

Displays comprehensive AI analysis with:
- Executive summary from Gemini
- Performance rating
- Real-time metrics (consumption, cost, emissions, renewable %)
- Top opportunities
- Implementation roadmap
- Cost assessment

**Usage:**
```tsx
import AIAnalysisPanel from "@/components/ai/AIAnalysisPanel";

export default function MyPage() {
  return (
    <div>
      <AIAnalysisPanel />
    </div>
  );
}
```

### 2. Enhanced ReportDisplay Component
**Location:** `src/components/ai/ReportDisplay.tsx`

Shows comprehensive impact report with:
- AI executive summary
- Key findings with Gemini insights
- AI-evaluated metrics
- Impact summary (carbon, cost, efficiency)
- Top improvement areas from AI analysis

### 3. Enhanced RecommendationCard Component
**Location:** `src/components/ai/RecommendationCard.tsx`

Displays recommendations with:
- Confidence score and progress bar
- ROI percentage calculation
- Implementation timeline
- Risk level assessment
- Cost-benefit visualization

## Testing the Integration

### 1. Test Backend API

**Check Gemini Service Status:**
```bash
curl http://localhost:8000/api/v1/analytics/ai/service-status
```

**Generate AI Summary:**
```bash
curl http://localhost:8000/api/v1/analytics/ai/ai-summary
```

**Generate Recommendations:**
```bash
curl -X POST http://localhost:8000/api/v1/recommendations/generate
```

**Generate Impact Report:**
```bash
curl -X POST http://localhost:8000/api/v1/reports/generate
```

### 2. Test Frontend Pages

1. **Analytics Page** (`http://localhost:3000/analytics`)
   - Should display AIAnalysisPanel at the top
   - Shows Gemini-generated insights and recommendations
   - Displays all performance metrics

2. **Reports Page** (`http://localhost:3000/reports`)
   - Shows AI-generated impact reports
   - Executive summary from Gemini
   - Key findings and recommendations

3. **Recommendations Page** (`http://localhost:3000/recommendations`)
   - Lists AI-generated recommendations
   - Shows confidence scores and ROI
   - Click "View Details" for full analysis

### 3. Test AI Features

**With Valid API Key:**
- All endpoints return Gemini-generated analysis
- Recommendations are specific to your facility data
- Reports include comprehensive insights
- Confidence scores reflect AI analysis quality

**Without Valid API Key (or invalid key):**
- System gracefully falls back to mock data
- All endpoints still work and return sensible defaults
- Allows testing UI without API access
- Console shows warnings about missing API key

## Troubleshooting

### Issue: "API key not set" warnings

**Solution:** Ensure `GEMINI_API_KEY` is set in environment:
```bash
export GEMINI_API_KEY=your_api_key
# Verify
echo $GEMINI_API_KEY
```

### Issue: Timeout errors

**Symptoms:** Requests timeout after 30 seconds

**Solution:** 
- Check internet connection
- Verify API key is valid and has quota remaining
- Check Google Cloud Console for rate limits
- Increase timeout in `gemini_service.py` if needed

### Issue: JSON parsing errors

**Symptoms:** "gemini_json_parse_error" in logs

**Solution:**
- Verify Gemini API is returning valid JSON
- Check logs for raw response content
- API automatically retries up to 3 times with exponential backoff

### Issue: Empty or missing analysis

**Symptoms:** Analysis fields are empty or null

**Solution:**
- Verify analytics data is available (check `/analytics/summary`)
- Check that devices have readings data
- Wait for data to accumulate (recommendations need 24+ hours of data for best results)
- Check server logs for detailed error messages

### Issue: Frontend not showing AI components

**Symptoms:** AIAnalysisPanel doesn't appear or shows loading state indefinitely

**Solution:**
1. Check backend API is accessible: `curl http://localhost:8000/health`
2. Verify `NEXT_PUBLIC_API_URL` is correct in Frontend/.env.development.local
3. Check browser console for API errors
4. Ensure backend routes are registered (check main.py for `analytics_analysis.router`)

## Performance Optimization

### Token Usage Tracking
The Gemini service tracks token usage automatically. Monitor via:
```bash
curl http://localhost:8000/api/v1/analytics/ai/service-status
```

**Token Limits:**
- Free tier: 60 requests per minute
- Most queries use 500-2000 tokens
- Reports and deep analysis use more tokens

### Caching Strategy
- Frontend caches API responses with SWR
- Analytics computed once per hour for efficiency
- Recommendations cached until new data available

### Rate Limiting
- API implements exponential backoff for retries
- Default max 3 retries with 1-8 second delays
- Configure in `gemini_service.py` if needed

## Security Best Practices

1. **Never commit API keys:**
   ```bash
   echo "GEMINI_API_KEY=*" >> .gitignore
   ```

2. **Rotate keys periodically** in Google Cloud Console

3. **Use environment variables** only (never hardcode)

4. **Restrict API key** to:
   - Only Gemini API (not other services)
   - Only your application's IP if possible

5. **Monitor API usage** in Google Cloud Console for suspicious activity

## Database Schema

The system automatically stores generated recommendations and reports:

```sql
-- Recommendations table
CREATE TABLE recommendation (
  id VARCHAR PRIMARY KEY,
  title VARCHAR,
  description TEXT,
  category ENUM (energy, cost, sustainability, maintenance),
  impact ENUM (high, medium, low),
  estimated_savings FLOAT,
  implementation_cost FLOAT,
  priority_score INT,
  ai_confidence FLOAT,
  metadata_json JSON,
  created_at TIMESTAMP
);

-- Reports table
CREATE TABLE impact_report (
  id VARCHAR PRIMARY KEY,
  title VARCHAR,
  period_start DATETIME,
  period_end DATETIME,
  executive_summary TEXT,
  total_savings FLOAT,
  carbon_reduced FLOAT,
  full_report_data JSON,
  created_at TIMESTAMP
);
```

## API Response Caching

Frontend uses SWR for caching:

```typescript
// Auto-revalidates every 5 minutes
const { data, error } = useSWR(
  '/api/v1/analytics/ai/ai-summary',
  fetcher,
  { revalidateInterval: 5 * 60 * 1000 }
);
```

## Advanced Configuration

### Custom AI Prompts

Edit prompt templates in:
- `Backend/app/services/recommendation_engine.py` (lines 73-115)
- `Backend/app/services/report_engine.py` (lines 63-124)

### Model Selection

Currently using: `gemini-1.5-flash` (fast, cost-effective)

To use different model:
```python
# Backend/app/services/gemini_service.py
self._model = genai.GenerativeModel("gemini-1.5-pro")  # More capable but slower
```

Available models:
- `gemini-1.5-flash`: Fast, cost-effective (recommended)
- `gemini-1.5-pro`: More capable, higher quality
- `gemini-pro`: Older model, still available

## Support & Documentation

- **Gemini API Docs:** https://ai.google.dev/docs
- **FastAPI Docs:** http://localhost:8000/docs (when server running)
- **Next.js Docs:** https://nextjs.org/docs
- **Project Issues:** Check GitHub repository

## Summary

Your IIROS platform now has enterprise-grade AI analysis capabilities:

1. **All data is processed through Gemini API** for intelligent insights
2. **Responses are fully data-driven** - analyzed from your actual facility metrics
3. **Fallback system ensures stability** - works even without API access
4. **Frontend shows AI confidence levels** - users understand analysis reliability
5. **Comprehensive reporting** - executive summaries, ROI calculations, implementation roadmaps

Users get instant understanding of their energy data through Gemini-summarized reports, ranked recommendations with ROI explanations, and actionable next steps - no manual interpretation needed.
