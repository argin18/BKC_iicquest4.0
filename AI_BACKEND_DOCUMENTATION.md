# AI-Driven Backend Documentation

## Overview

This is a fully AI-powered, data-driven backend for intelligent infrastructure and resource optimization. All analytics, recommendations, and reports are generated dynamically through real-time data analysis and Gemini AI integration.

## Architecture

### Core Services

#### 1. Analytics Service (`app/services/analytics_service.py`)
Generates comprehensive data-driven insights from energy readings and device data.

**Key Methods:**
- `get_summary_analytics()` - Real-time consumption, generation, cost, and carbon metrics
- `get_device_analytics(device_id)` - Device-specific performance metrics
- `get_peak_hours_analysis()` - Peak consumption patterns and hourly distribution
- `get_top_consumers()` - Ranked list of highest consuming devices
- `get_cost_analysis()` - Financial metrics and savings projections
- `get_carbon_analysis()` - Environmental impact and offset calculations
- `create_analytics_snapshot()` - Historical snapshot for trend analysis

#### 2. Recommendation Engine (`app/services/recommendation_engine.py`)
AI-powered optimization suggestions based on real analytics data.

**Features:**
- Contextual recommendations tailored to specific consumption patterns
- Uses Gemini API for intelligent analysis
- Generates 4-8 diverse recommendations covering different optimization areas
- Each recommendation includes:
  - Title and detailed description
  - Impact level (high, medium, low)
  - Category (cost, energy, sustainability, maintenance)
  - Estimated annual savings
  - Implementation cost estimate
  - Priority score (0-100)
  - AI confidence level (0-1)
  - Metadata with implementation details

#### 3. Report Engine (`app/services/report_engine.py`)
Generates comprehensive AI-driven impact reports.

**Capabilities:**
- Period-based analysis (7, 30, 90 days, custom)
- Consolidates all analytics, cost, carbon, and device metrics
- Generates executive summary using Gemini AI
- Includes key findings, performance metrics, and recommendations
- Calculates total savings potential and carbon reduction
- Provides actionable next steps

#### 4. Predictive Analytics Service (`app/services/predictive_analytics_service.py`)
Forecasting and anomaly detection for proactive management.

**Features:**
- Energy consumption forecasting
- Device health degradation prediction
- Anomaly detection and pattern analysis
- Optimization potential calculation
- Maintenance need estimation

### Repositories

#### Analytics Repository (`app/repositories/analytics.py`)
Data access layer with specialized queries:
- `RecommendationRepository` - Query by status, category, impact, priority
- `ImpactReportRepository` - Query by period, get latest reports
- `AnalyticsSnapshotRepository` - Historical analytics tracking

## API Endpoints

### Analytics Endpoints (`/api/v1/analytics`)

#### GET /summary
Real-time energy summary with all key metrics.
```json
{
  "timestamp": "2026-06-11T01:26:00Z",
  "total_consumption": 2450.5,
  "total_generation": 500.0,
  "net_consumption": 1950.5,
  "estimated_cost": 343.07,
  "carbon_footprint": 1.23,
  "active_devices": 10,
  "total_devices": 12,
  "efficiency_percentage": 20.4,
  "renewable_percentage": 20.4
}
```

#### GET /device/{device_id}
Device-specific performance analytics.

#### GET /top-consumers?limit=5
Ranked list of top energy-consuming devices.

#### GET /peak-hours
Peak hour analysis with hourly distribution.

#### GET /cost-analysis
Financial analysis with daily, monthly, annual projections and savings potential.

#### GET /carbon-analysis
Carbon footprint analysis with offset potential and renewable integration data.

#### GET /trends?days=30
Consumption trends and efficiency analysis.

#### POST /snapshot?resolution=daily
Create a historical snapshot of current analytics state.

### Recommendations Endpoints (`/api/v1/recommendations`)

#### GET /
List all recommendations with optional filtering.

**Query Parameters:**
- `skip` - Pagination offset
- `limit` - Results per page (max 200)
- `status` - Filter by status: `pending`, `implemented`, `dismissed`
- `category` - Filter by category: `cost`, `energy`, `sustainability`, `maintenance`

#### POST /generate
Generate new AI-driven recommendations based on real analytics.
Returns 4-8 contextual optimization suggestions.

#### GET /top?limit=10
Get top-priority recommendations ready for implementation.

#### GET /by-category/{category}
Filter recommendations by category.

#### GET /by-impact/{impact}
Filter recommendations by impact level: `high`, `medium`, `low`.

#### GET /{recommendation_id}
Get detailed recommendation information.

#### PATCH /{recommendation_id}/status?new_status=implemented
Update recommendation status (workflow tracking).

#### DELETE /{recommendation_id}
Remove a recommendation.

#### POST /batch-generate?count=3
Generate multiple recommendation batches for comprehensive analysis.

### Reports Endpoints (`/api/v1/reports`)

#### GET /
List all historical impact reports.

#### POST /generate?days_back=30
Generate a new AI-driven impact report for specified period.

Returns comprehensive report including:
- Executive summary
- Key findings
- Performance metrics
- Business impact analysis
- Recommendations summary
- Next steps

#### GET /{report_id}
Retrieve specific report details.

#### DELETE /{report_id}
Delete a report.

#### GET /{report_id}/recommendations
Get recommendations associated with a report.

#### GET /period/{year}/{month}
Get all reports for a specific month.

#### POST /batch-generate?periods=[7,30,90]
Generate reports for multiple periods simultaneously.

### Predictive Analytics Endpoints (`/api/v1/predictive`)

#### GET /forecast/consumption?days_ahead=7
Forecast energy consumption for next N days based on historical patterns.

#### GET /health/{device_id}
Predict device health and maintenance needs:
- Current health score
- Health trend (declining, improving, stable)
- Degradation rate
- Maintenance need assessment
- Estimated days until failure
- Recommended action

#### GET /anomalies
Detect unusual consumption patterns and anomalies in the last 7 days.

Returns:
- Average consumption
- Standard deviation
- Detected anomalies with severity levels
- Deviation percentages

#### GET /optimization-potential
Calculate potential energy savings based on consumption patterns.

## Data Flow

### Recommendation Generation Flow
1. **Fetch Real Data**
   - Query energy readings from database
   - Get device performance metrics
   - Calculate analytics (consumption, cost, carbon)
   
2. **AI Analysis**
   - Send analytics data to Gemini API
   - Request diverse, contextual recommendations
   - Include specific metrics for context
   
3. **Validation & Storage**
   - Parse AI response
   - Validate recommendation structure
   - Deduplicate by title
   - Store in database with metadata
   
4. **Return Results**
   - Return stored recommendations to client
   - Include priority scores and confidence levels

### Report Generation Flow
1. **Data Aggregation**
   - Gather all analytics for period
   - Consolidate cost, carbon, device data
   - Calculate savings potential
   
2. **AI Report Generation**
   - Send comprehensive context to Gemini
   - Request professional report structure
   - Include actionable insights
   
3. **Storage & Association**
   - Store report in database
   - Link with relevant recommendations
   - Create historical snapshot
   
4. **API Response**
   - Return full report with metadata
   - Include all component analyses

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/iiros

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Gemini AI
GEMINI_API_KEY=your-api-key-here

# Environment
ENVIRONMENT=development
```

### Setting Up Gemini API Key

1. Get API key from [Google AI Studio](https://ai.google.dev/tutorials/setup)
2. Set `GEMINI_API_KEY` environment variable
3. Service will gracefully fall back to mock data if key is missing

## AI Integration Details

### Gemini Model
- **Model**: `gemini-1.5-flash` (fast, cost-effective)
- **Retry Logic**: 3 retries with exponential backoff
- **Timeout Handling**: Graceful fallback to mock data
- **Response Format**: JSON with automatic markdown fence stripping

### Prompt Engineering
All prompts are carefully crafted to:
- Request specific JSON structure
- Provide sufficient context from real data
- Enforce diversity in recommendations
- Include confidence scores and metadata
- Generate professional, actionable content

## Data Models

### Recommendation Model
```python
{
  "id": "uuid",
  "title": "Short actionable title",
  "description": "Detailed explanation",
  "impact": "high|medium|low",
  "category": "cost|energy|sustainability|maintenance",
  "estimated_savings": 4500.00,
  "implementation_cost": 2000.00,
  "priority_score": 90,
  "status": "pending|implemented|dismissed",
  "ai_confidence": 0.92,
  "metadata_json": {...},
  "created_at": "2026-06-11T01:26:00Z",
  "updated_at": "2026-06-11T01:26:00Z"
}
```

### ImpactReport Model
```python
{
  "id": "uuid",
  "title": "Impact Report: 2026-06-01 to 2026-06-30",
  "period_start": "2026-06-01T00:00:00Z",
  "period_end": "2026-06-30T23:59:59Z",
  "executive_summary": "Professional summary of findings",
  "total_savings": 2058.42,
  "carbon_reduced": 36.9,
  "full_report_data": {
    "key_findings": [...],
    "performance_metrics": {...},
    "recommendations_summary": "...",
    "business_impact": {...},
    "next_steps": [...]
  },
  "created_at": "2026-06-11T01:26:00Z",
  "updated_at": "2026-06-11T01:26:00Z"
}
```

## Usage Examples

### Generate Recommendations
```bash
curl -X POST http://localhost:8000/api/v1/recommendations/generate
```

### Get Top Recommendations
```bash
curl http://localhost:8000/api/v1/recommendations/top?limit=5
```

### Generate Monthly Report
```bash
curl -X POST http://localhost:8000/api/v1/reports/generate?days_back=30
```

### Forecast Consumption
```bash
curl http://localhost:8000/api/v1/predictive/forecast/consumption?days_ahead=7
```

### Detect Anomalies
```bash
curl http://localhost:8000/api/v1/predictive/anomalies
```

## Performance Considerations

- **Caching**: Analytics snapshots provide historical tracking without recalculation
- **Deduplication**: Recommendations are deduplicated by title to avoid duplicates
- **Async Processing**: All operations use async/await for non-blocking I/O
- **Database Indexing**: Timestamps and status fields are indexed for fast queries
- **Pagination**: Large datasets are paginated to prevent memory overload

## Error Handling

All services include:
- Try-catch error handling with logging
- Graceful fallback to mock/default data
- User-friendly error messages
- Detailed server logs for debugging

## Future Enhancements

1. **Machine Learning** - Integrate TensorFlow for advanced predictions
2. **Real-time Streaming** - WebSocket updates for live analytics
3. **Multi-tenant Support** - Organization-level isolation
4. **Advanced Scheduling** - Background jobs for periodic report generation
5. **Alert System** - Threshold-based notifications
6. **Custom Models** - User-defined optimization objectives
7. **Integration APIs** - Connect to external energy management systems
8. **Mobile Support** - REST API for mobile applications
