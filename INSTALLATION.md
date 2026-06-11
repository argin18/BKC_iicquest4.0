# Installation & Setup Guide

Complete step-by-step instructions for setting up IIROS (Intelligent Integrated Resource Optimization System) with Gemini AI integration.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Testing the Setup](#testing-the-setup)
7. [Troubleshooting](#troubleshooting)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## System Requirements

### For All Platforms

- **Git**: Version 2.0 or higher ([download](https://git-scm.com/))
- **Gemini API Key**: Free from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Windows

- **Python**: 3.11 or higher (NOT Python 3.14+ - has compatibility issues)
- **Node.js**: 18.0 or higher with npm
- **Git Bash** or **PowerShell** (as administrator for some operations)
- **Visual C++ Build Tools**: Required for some Python packages
- **Port Requirements**: 8000 (backend), 3000 (frontend)

### macOS

- **Python**: 3.11 or higher (via Homebrew recommended)
- **Node.js**: 18.0 or higher
- **Xcode Command Line Tools**: `xcode-select --install`
- **Port Requirements**: 8000 (backend), 3000 (frontend)

### Linux (Ubuntu/Debian)

- **Python**: 3.11 or higher
- **Node.js**: 18.0 or higher
- **Build Tools**: `sudo apt-get install build-essential python3-dev`
- **Port Requirements**: 8000 (backend), 3000 (frontend)

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
# Windows (PowerShell)
cd Backend

# macOS / Linux
cd Backend
```

### Step 2: Create Python Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal prompt.

### Step 3: Upgrade pip

**All Platforms:**
```bash
pip install --upgrade pip
```

### Step 4: Install Dependencies

**All Platforms:**
```bash
pip install -r requirements.txt
```

**What gets installed:**
- FastAPI (web framework)
- SQLAlchemy (database ORM)
- Pydantic (data validation)
- Uvicorn (ASGI server)
- Google Generative AI (Gemini integration)
- And 10+ other required packages

### Step 5: Create Environment File

**Windows (PowerShell):**
```powershell
New-Item -Path ".env" -ItemType File
```

**macOS / Linux:**
```bash
touch .env
```

### Step 6: Configure Environment Variables

Open `.env` file and add:

```env
# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./iiros.db

# Gemini API Configuration (required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Application Settings
ENVIRONMENT=development
SECRET_KEY=your-secret-key-here-change-in-production

# CORS Configuration (for frontend communication)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

### Step 7: Verify Backend Installation

**Test imports:**
```bash
python -c "import fastapi; import sqlalchemy; import google.generativeai; print('✓ All dependencies installed successfully')"
```

**Test database initialization:**
```bash
python -c "from app.core.config import settings; print(f'Database URL: {settings.DATABASE_URL}')"
```

### Step 8: Start Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Backend is now running at:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs (interactive API documentation)

---

## Frontend Setup

### Step 1: Open New Terminal

Keep the backend running in the current terminal. Open a new terminal/PowerShell window.

### Step 2: Navigate to Frontend Directory

```bash
# Windows (PowerShell)
cd Frontend

# macOS / Linux
cd Frontend
```

### Step 3: Install Dependencies

**All Platforms:**
```bash
npm install
```

Or if you prefer yarn:
```bash
yarn install
```

**What gets installed:**
- Next.js 16 (React framework)
- React 19 (UI library)
- TypeScript (type safety)
- Tailwind CSS (styling)
- And 20+ other packages

### Step 4: Create Environment File

**Windows (PowerShell):**
```powershell
New-Item -Path ".env.local" -ItemType File
```

**macOS / Linux:**
```bash
touch .env.local
```

### Step 5: Configure Frontend Environment

Open `.env.local` file and add:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: For production deployment
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Step 6: Start Frontend Development Server

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

Expected output:
```
▲ Next.js 16.2.9
- Local:        http://localhost:3000
- Environments: .env.local
✓ Ready in XXXms
```

**Frontend is now running at:**
- App: http://localhost:3000
- Automatically opens in your default browser

---

## Environment Configuration

### Complete .env File Reference

#### Backend (.env file in Backend directory)

```env
# ════════════════════════════════════════════════════════════════
# DATABASE CONFIGURATION
# ════════════════════════════════════════════════════════════════

# SQLite (Development - default)
DATABASE_URL=sqlite+aiosqlite:///./iiros.db

# PostgreSQL (Production)
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/iiros

# ════════════════════════════════════════════════════════════════
# AI INTEGRATION (GEMINI API)
# ════════════════════════════════════════════════════════════════

# Get free API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# ════════════════════════════════════════════════════════════════
# APPLICATION SETTINGS
# ════════════════════════════════════════════════════════════════

PROJECT_NAME=IIROS Backend
ENVIRONMENT=development

# Change in production! Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=your-secret-key-here

ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ════════════════════════════════════════════════════════════════
# CORS CONFIGURATION
# ════════════════════════════════════════════════════════════════

# Comma-separated list of allowed frontend URLs
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# ════════════════════════════════════════════════════════════════
# SERVER CONFIGURATION
# ════════════════════════════════════════════════════════════════

HOST=0.0.0.0
PORT=8000
```

#### Frontend (.env.local file in Frontend directory)

```env
# Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics/Monitoring (optional)
# NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Theme configuration (optional)
# NEXT_PUBLIC_THEME=light
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select or create a Google Cloud project
4. Copy the API key
5. Add to `.env` file: `GEMINI_API_KEY=your_copied_key`

---

## Running the Application

### Start Both Services (Recommended)

Open two terminal windows side by side:

**Terminal 1 - Backend:**
```bash
cd Backend
source venv/bin/activate  # macOS/Linux: source venv/bin/activate
# OR Windows: venv\Scripts\activate
pip install -r requirements.txt  # If not done yet
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install  # If not done yet
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Project Structure Navigation

```
IIROS/
├── Backend/
│   ├── app/
│   │   ├── api/           # API endpoints & routes
│   │   ├── services/      # Business logic & Gemini integration
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Data validation schemas
│   │   ├── core/          # Configuration & setup
│   │   └── database/      # Database connection
│   ├── requirements.txt   # Python dependencies
│   ├── .env              # Environment variables
│   └── main.py           # Application entry point
│
├── Frontend/
│   ├── src/
│   │   ├── app/          # Pages & routing
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities & API client
│   │   └── styles/       # Global styling
│   ├── package.json      # Node dependencies
│   ├── .env.local        # Environment variables
│   └── next.config.ts    # Next.js configuration
│
└── Documentation/        # All .md files for reference
```

---

## Testing the Setup

### Backend Tests

**1. Check if backend is running:**
```bash
curl http://localhost:8000/docs
```

Expected: API documentation page loads

**2. Test Gemini Service Status:**
```bash
curl http://localhost:8000/api/v1/analytics/ai/service-status
```

Expected response:
```json
{
  "available": true,
  "token_count": 0,
  "last_call": null,
  "model": "gemini-1.5-flash"
}
```

**3. Test API endpoints:**
```bash
# Get all analytics
curl http://localhost:8000/api/v1/analytics

# Get all recommendations
curl http://localhost:8000/api/v1/recommendations

# Get all reports
curl http://localhost:8000/api/v1/reports
```

### Frontend Tests

**1. Check if frontend is running:**
- Open http://localhost:3000 in your browser

**2. Navigate the application:**
- Click on "Analytics" → Check "AI-Powered Analysis" section
- Click on "Recommendations" → See AI confidence scores
- Click on "Impact Reports" → See AI Executive Summary

**3. Test API integration:**
- Open browser Developer Tools (F12)
- Go to Console tab
- Should see no errors (only warnings about devTools)
- Network tab should show API calls to localhost:8000

### Complete Verification Checklist

- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 3000
- [ ] No error messages in backend terminal
- [ ] No error messages in frontend terminal
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Frontend loads without errors
- [ ] Analytics page shows AI panel
- [ ] Can see recommendations with confidence scores
- [ ] Impact Reports show AI summaries

---

## Troubleshooting

### Backend Issues

#### Issue: `ModuleNotFoundError: No module named 'aiosqlite'`

**Solution:**
```bash
pip install aiosqlite>=0.19.0
```

Or reinstall all requirements:
```bash
pip install -r requirements.txt --force-reinstall
```

#### Issue: Port 8000 already in use

**Windows:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process (replace PID)
kill -9 <PID>
```

Or use a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

#### Issue: `sqlite3.DatabaseError: database disk image is malformed`

**Solution:**
```bash
# Remove corrupted database
rm iiros.db
# Backend will create a new one on next run
```

#### Issue: ImportError when running backend

**Solution:**
1. Activate virtual environment
2. Reinstall dependencies: `pip install -r requirements.txt`
3. Check Python version: `python --version` (should be 3.11+)

### Frontend Issues

#### Issue: Port 3000 already in use

**Windows:**
```powershell
# Find process
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

Or use different port:
```bash
npm run dev -- -p 3001
```

#### Issue: `Cannot find module` error

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Webpack build error

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### API Connection Issues

#### Issue: Frontend can't reach backend (CORS error)

**Check:**
1. Backend is running on port 8000
2. `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Backend `.env` has correct `CORS_ORIGINS=http://localhost:3000`

**Solution:**
```bash
# Restart both servers
# Backend: uvicorn app.main:app --reload
# Frontend: npm run dev
```

#### Issue: Gemini API returns error

**Check:**
1. API key is valid and not expired
2. `.env` file has `GEMINI_API_KEY=your_key`
3. Internet connection is working

**Solution:**
1. Get new API key from https://aistudio.google.com/app/apikey
2. Update `.env` file
3. Restart backend: `uvicorn app.main:app --reload`

---

## Common Issues & Solutions

### Issue: `python: command not found` (macOS/Linux)

```bash
# Use python3 instead
python3 -m venv venv
source venv/bin/activate
python3 -c "import fastapi; print('OK')"
```

### Issue: `pip: command not found`

```bash
python -m pip install --upgrade pip
# Then use: python -m pip install -r requirements.txt
```

### Issue: Virtual environment not activating (Windows)

```powershell
# Try this in PowerShell as administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate again
venv\Scripts\activate
```

### Issue: npm not found

1. Download Node.js from https://nodejs.org/ (LTS version)
2. Install it
3. Close and reopen terminal
4. Verify: `node --version` and `npm --version`

### Issue: Database connection timeout

```bash
# Check if port 5432 is listening (PostgreSQL)
netstat -an | grep 5432

# If using SQLite, delete and recreate
rm iiros.db
```

### Issue: GEMINI_API_KEY not being read

**Windows PowerShell:**
```powershell
# Check if .env is being read
python -c "from app.core.config import settings; print(settings.GEMINI_API_KEY)"
```

**macOS/Linux:**
```bash
# Check environment
cat .env
# Verify it's being read
python -c "from app.core.config import settings; print(settings.GEMINI_API_KEY)"
```

If None is returned, the key is not set. Update `.env` file.

---

## Quick Verification Script

Create `test-setup.sh` (macOS/Linux) or `test-setup.bat` (Windows):

**macOS/Linux:**
```bash
#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "IIROS Setup Verification"
echo "═══════════════════════════════════════════════════════════"

echo -e "\n[1/5] Checking Python..."
python3 --version

echo -e "\n[2/5] Checking Node.js..."
node --version
npm --version

echo -e "\n[3/5] Checking Backend..."
cd Backend
python3 -c "import fastapi, sqlalchemy, google.generativeai; print('✓ Backend dependencies OK')"

echo -e "\n[4/5] Checking Frontend..."
cd ../Frontend
npm list next react typescript --depth=0 | head -5

echo -e "\n[5/5] Checking Ports..."
echo "Port 8000 (Backend): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:8000 2>/dev/null || echo 'Not running')"
echo "Port 3000 (Frontend): $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 'Not running')"

echo -e "\n═══════════════════════════════════════════════════════════"
echo "Verification Complete"
echo "═══════════════════════════════════════════════════════════"
```

Run with: `bash test-setup.sh`

---

## Support & Resources

- **Gemini API Docs**: https://ai.google.dev/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Next.js Docs**: https://nextjs.org/docs
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Uvicorn Docs**: https://www.uvicorn.org/

---

## Next Steps After Installation

1. ✅ Complete this installation guide
2. ✅ Both services running without errors
3. 📖 Read `DOCUMENTATION_INDEX.md` for feature overview
4. 🏗️ Read `ARCHITECTURE_AND_FEATURES.md` for system design
5. 🚀 Deploy to production (see `TECH_STACK_DETAILS.md`)

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready
