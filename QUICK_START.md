# Quick Start Guide - Gemini Integration

## 30-Second Setup

### 1. Get API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key (starts with `AIza...`)

### 2. Configure Environment
```bash
# Backend
cd Backend
echo "GEMINI_API_KEY=your_key_here" >> .env

# Frontend
cd Frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" >> .env.development.local
```

### 3. Start Services
```bash
# Terminal 1 - Backend
cd Backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd Frontend
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Analytics: http://localhost:3000/analytics
- Reports: http://localhost:3000/reports
- Recommendations: http://localhost:3000/recommendations
- API Docs: http://localhost:8000/docs

---

## What's New

### AI-Powered Pages
1. **Analytics** - Gemini analysis at top with insights
2. **Reports** - AI-generated impact reports with executive summary
3. **Recommendations** - Data-driven suggestions with ROI & confidence scores

### New API Endpoints
- `GET /analytics/ai/ai-summary` - Quick insights
- `GET /analytics/ai/comparison` - Trend analysis
- `GET /analytics/ai/deep-analysis` - Comprehensive analysis
- `GET /analytics/ai/service-status` - API health

---

## Key Features

✓ All analysis is **data-driven** (uses your actual metrics)
✓ **AI confidence scores** on every recommendation (0-100%)
✓ **ROI calculations** with implementation cost
✓ **Risk assessment** for each action
✓ **Executive summaries** ready for leadership
✓ **Fallback mode** - works without API key
✓ **Automatic retries** - robust error handling

---

## Testing

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### Get AI Summary
```bash
curl http://localhost:8000/api/v1/analytics/ai/ai-summary
```

### Generate Recommendations
```bash
curl -X POST http://localhost:8000/api/v1/recommendations/generate
```

### Check Service Status
```bash
curl http://localhost:8000/api/v1/analytics/ai/service-status
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not found" | Run: `export GEMINI_API_KEY=your_key` |
| Backend won't start | Run: `pip install -r requirements.txt` |
| Frontend 404 errors | Check `NEXT_PUBLIC_API_URL` in `.env.development.local` |
| Timeout errors | Check internet, verify API key is valid |
| Mock data showing | API key is invalid or missing (system working in fallback mode) |

---

## Next Steps

1. **Add some device readings** to generate analysis
2. **View Analytics page** to see AI insights
3. **Check Recommendations** for data-driven suggestions
4. **Generate a Report** for comprehensive impact analysis

---

## Important Files

**Backend:**
- `Backend/app/services/gemini_service.py` - AI API client
- `Backend/app/services/recommendation_engine.py` - Recommendations logic
- `Backend/app/services/report_engine.py` - Report generation
- `Backend/app/api/v1/analytics_analysis.py` - New AI endpoints
- `Backend/.env` - Configuration (add GEMINI_API_KEY here)

**Frontend:**
- `Frontend/src/components/ai/AIAnalysisPanel.tsx` - Main AI component
- `Frontend/src/lib/api.ts` - API client
- `Frontend/src/app/analytics/page.tsx` - Updated analytics page
- `Frontend/.env.development.local` - Frontend config

---

## Documentation

- **Setup Guide:** `GEMINI_SETUP.md` (detailed instructions)
- **Implementation Summary:** `GEMINI_IMPLEMENTATION_SUMMARY.md` (complete overview)
- **This File:** `QUICK_START.md` (quick reference)

---

## Support

- **API Docs:** http://localhost:8000/docs
- **Gemini Docs:** https://ai.google.dev/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**That's it!** Your energy platform now has AI-powered analysis. Start the servers and explore the new intelligence features.
