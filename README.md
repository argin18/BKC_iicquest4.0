<div align="center">

#  IIROS
### Intelligent Infrastructure & Resource Optimization System

*Because your electricity bill shouldn't be a surprise.*

**AI-powered energy intelligence for Nepal's institutions — real-time visibility, Gemini-driven insights, and actionable cost savings, all from a browser.**

[![Frontend](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-black?style=flat-square&logo=vercel)](https://iiros.vercel.app)
[![Backend](https://img.shields.io/badge/API-Live%20on%20Render-46E3B7?style=flat-square&logo=render)](https://iiros-api.onrender.com/api/docs)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%2B%20FastAPI%20%2B%20Gemini-blue?style=flat-square)](/)
[![DB](https://img.shields.io/badge/Database-PostgreSQL%20%40%20Neon-336791?style=flat-square&logo=postgresql)](/)
</div>

---

## The Moment That Started Everything

Imagine getting an electricity bill that's 40% higher than last month - and having absolutely no idea why.

You call maintenance. Maintenance checks the spreadsheet. The spreadsheet is three weeks old. Nobody knows which device caused the spike, when it happened, or how much it actually cost. The audit company wants NPR 100,000 and six weeks to answer a question that should take six seconds.

**This is the daily reality for most institutional buildings in Nepal.**

IIROS changes that. Open the dashboard - in under 90 seconds you see exactly which devices spiked, when it happened, what it cost in NPR, and an AI-generated action plan to stop it from happening again. No specialized hardware. No data science team. No waiting for the monthly report that nobody reads.

---

## Table of Contents

- [Team](#-team)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Functional Requirements](#-functional-requirements)
- [Non-Functional Requirements](#-non-functional-requirements)
- [Features & Functions](#-features--functions)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Business Logic](#-business-logic)
- [AI Integration](#-ai-integration)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Startup Roadmap](#-startup-roadmap)
- [AI Tools Disclosure](#-ai-tools-disclosure)

---

## 👥 Team

**Team Name: *BKC***

| Name | Role | Responsibilities |
|---|---|---|
| *Mahadev Rajbanshi* | Designer | Figma Design System, Business Model Canvas, UI Polish |
| *Hira Prasad Niroula* | Backend Lead | FastAPI, PostgreSQL, Analytics Engine, Gemini Integration, Pitch Deck|
| *Ravi  Shah* | Frontend Lead | Next.js Dashboard, Recharts, Shadcn/ui,Presenter, Judge Q&A Preparation, Live Demo |
| *Sumit Bhujel* | Full-Stack Intregator | Problem Narrative, Frontend and Backend Intrigrate, Render & Vercel Deployment, Testing |

---

## ❗ The Problem

Commercial and institutional buildings in Nepal waste an estimated **30% of their energy consumption**. That's not a rounding error  that's real money, burned silently, month after month, because the infrastructure to see it simply doesn't exist at an affordable price point.

The problem isn't that facility managers don't care. It's that nobody has given them the right tools.

| Pain Point | What It Actually Costs |
|---|---|
| No real-time device monitoring | Equipment runs at full load even when idle — wasted cost, 24 hours a day |
| Peak-hour charges go undetected | Organizations unknowingly pay 2–3× standard NEA tariff rates during peak windows |
| Manual audits are the only option | Each audit costs NPR 50,000–200,000, takes weeks, and produces a PDF nobody acts on |
| Zero CO₂ visibility | Sustainability and ESG reporting becomes impossible — a growing compliance risk |
| Fragmented data everywhere | Energy figures, cost records, and device logs live in separate spreadsheets — never connected, never actionable |

The result is a quiet crisis: **facility managers operate completely blind while costs climb every billing cycle.**

---

## 💡 Our Solution

### Problem Statement

Institutional buildings in Nepal lack affordable, real-time energy monitoring tools, causing undetected waste, unpredictable utility costs, and a complete absence of sustainability reporting. Facility managers have no intelligent system to identify inefficiencies, understand device-level consumption, or take data-driven action.

### Solution Statement

IIROS is a web-based, AI-powered energy management platform that ingests device-level energy consumption data, runs a deterministic analytics engine to classify inefficiencies and detect anomalies, and uses Google Gemini AI to translate those findings into plain-language recommendations and executive-ready reports — all delivered in a single-pane-of-glass dashboard with every number expressed in NPR.

No specialized hardware is required to start. The architecture is designed from day one for IoT integration — adding real sensors is a 2-week sprint, not a redesign.

### The 90-Second Journey

Here's what a facility manager actually experiences:

1. **Open the dashboard** → see four KPI cards summarizing the entire building's energy health at a glance
2. **Spot the anomaly spike on June 3rd** in the 30-day trend chart
3. **Click into the device breakdown** → identify "Server Room AC Unit" running at 24% efficiency
4. **Hit "Generate Recommendations"** → Gemini returns: *"Adjust AC setpoint to 24°C during off-peak hours — estimated saving NPR 12,400/month"*
5. **Click "Generate Executive Report"** → share with management → decision made

Total time from login to actionable insight: **under 90 seconds.**

---

## 🌐 Live Demo

| Resource | Link |
|---|---|
| **Frontend Dashboard** | [https://iiros.vercel.app](https://iiros.vercel.app) |
| **Backend API Docs** | [https://iiros-api.onrender.com/api/docs](https://iiros-api.onrender.com/api/docs) |

> No login required. Single-organization demo mode — open and explore freely.

### Screenshots

| Dashboard Overview | AI Recommendations | Executive Report |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

---

## ✨ Key Features

### Core MVP — Delivered

**Live Summary Dashboard** gives facility managers an at-a-glance health check: total kWh consumed, estimated cost in NPR, the current peak usage hour, and a composite efficiency score from 0 to 100. Everything a manager needs in the first five seconds of opening the app.

**30-Day Energy Trend Chart** renders an area chart with hourly granularity. Anomaly days are visually distinguished from normal days. Period selection lets users toggle between 7, 14, and 30-day views — useful for quick checks and deeper analysis alike.

**Device Breakdown Table** shows per-device kWh totals, cost estimates, efficiency percentages, and a color-coded status badge (Efficient / Underloaded / Overload Risk / Idle Waste). This is where the story moves from *"something is wrong"* to *"this specific device is the problem."*

**Gemini AI Recommendations** — on demand, the system assembles a full analytics context and sends it to Gemini 1.5 Flash. Back comes a prioritized list of 5–8 actionable recommendations, each with a title, description, priority level, and an estimated monthly NPR saving.

**NEA Cost Estimation Engine** uses Nepal Electricity Authority's commercial tariff of NPR 18/unit. Every figure on the dashboard is in local currency — not generic USD stats disconnected from Nepali economic reality.

**CO₂ & Sustainability Metrics** calculate carbon impact using the NEA grid emission factor of 0.43 kg CO₂/kWh (NEA Annual Report 2023), translated into tree equivalents and kilometers driven for intuitive understanding.

### Advanced Features — Also Delivered

- **AI Executive Report Generator** — one click produces a structured narrative report with executive summary, key findings, cost analysis, sustainability section, and a prioritized action plan with timelines
- **Peak Hour Heatmap** — a 24-bar chart with peak windows highlighted and surge cost factors applied visually
- **Date Range Filter** — interactive period selector across all charts (7d / 14d / 30d)
- **Anomaly Detection Alerts** — statistical z-score flagging surfaces abnormal consumption days without requiring any ML model
- **Loading Skeletons & Error States** — every async operation has a skeleton loader and graceful fallback; no blank screens, no unexplained failures

---

## 📋 Functional Requirements

These define what IIROS must do — the observable, testable behaviors the system delivers to its users.

### FR-01 · Energy Data Ingestion

The system must accept energy readings per device containing `device_id`, `timestamp`, `kwh_consumed`, and `power_kw`. It must support both single-reading ingestion (for IoT compatibility) and bulk ingestion of historical records for seeding and imports. All readings must be stored in a time-indexed PostgreSQL table with no data loss, and each reading must be associated with exactly one registered device.

### FR-02 · Real-Time Summary Dashboard

The dashboard must display four KPI values on every load: total kWh consumed, total estimated cost in NPR, the current peak usage hour (0–23), and a composite efficiency score from 0 to 100. All values must be fetched live from the `/analytics/summary` endpoint. The dashboard must render without errors even when the database contains no readings — graceful empty states, not blank screens.

### FR-03 · Energy Trend Visualization

The system must provide hourly time-series data aggregated for selectable periods of 7, 14, and 30 days. Anomaly days must be visually distinguished from normal days in the chart. Both kWh consumption and NPR cost must be available on the same timeline.

### FR-04 · Device Management

The system must maintain a device registry with name, type, location, rated power in kW, and active status. It must calculate and return per-device consumption totals, average power draw, efficiency percentage, and status classification. Device status must be derived in real time from consumption patterns — not set manually.

### FR-05 · Business Logic Analytics

The system must calculate energy cost using the NEA commercial tariff of NPR 18/kWh. It must detect peak hours based on the 09:00–17:00 business window and apply a 1.3× surge factor to costs within that window. Any day whose total kWh exceeds the 30-day mean by more than 2.5 standard deviations must be flagged as anomalous. Each device must be classified into one of four states: Efficient, Underloaded, Overload Risk, or Idle Waste. CO₂ emissions must be computed using the NEA grid factor of 0.43 kg CO₂/kWh.

### FR-06 · AI Recommendations

The system must assemble a structured analytics context object and send it to Gemini, receiving back a minimum of 3 prioritized recommendations. Each recommendation must include a title, description, type (cost_saving / efficiency / sustainability), priority (HIGH / MEDIUM / LOW), and an estimated monthly saving in NPR. All generated recommendations must be persisted in the database as an immutable audit log. Previously generated recommendations must be servable from cache without re-calling Gemini.

### FR-07 · AI Executive Report

The system must generate a structured executive report on demand for a specified date range. The report must include an executive summary, key findings, cost analysis with period-over-period comparison, a sustainability section, and a prioritized action plan with timelines. All generated reports must be stored and retrievable from a reports list.

### FR-08 · Peak Hour Analysis

The system must return average hourly consumption data for all 24 hours. Each hour entry must carry a boolean `is_peak` flag. The frontend must render this as a bar chart with peak hours visually differentiated from off-peak hours.

### FR-09 · Error Handling & Fallbacks

Every API endpoint must return errors using a consistent JSON envelope: `{ error, code, message, status }`. The AI service must never propagate a Gemini API failure to the frontend — a rule-based fallback using computed analytics figures must always be available. The frontend must display informative error messages and skeleton loaders for all async operations.

---

## 🔒 Non-Functional Requirements

These define *how well* IIROS performs — the quality attributes that determine whether it's genuinely production-worthy and not just a demo that falls apart under scrutiny.

### NFR-01 · Performance

The `/analytics/summary` endpoint must respond within **1,500ms** under normal load, including all aggregation calculations across 7,200+ readings. The frontend dashboard must achieve a Lighthouse Performance score of **≥ 75** on desktop. The 30-day trend chart must render 720 data points (30 days × 24 hours) without visible lag. Gemini API calls must be non-blocking — the rest of the dashboard must remain fully interactive while an AI request is pending.

### NFR-02 · Reliability & Availability

The backend must return a valid HTTP response for every request — no unhandled exceptions that result in a 500 with an empty body. If Gemini is unavailable, the recommendations endpoint must fall back to rule-based output within 3 seconds. The system must handle a completely empty database without crashing any endpoint.

### NFR-03 · Scalability

The `energy_readings` table must carry composite indexes on `(device_id, timestamp DESC)` and `(timestamp DESC)` to support sub-second queries even at 1 million+ rows. The analytics engine must be stateless — it accepts a list of readings as input and returns computed values, making it trivially horizontally scalable. The backend must be deployable as a single stateless process suitable for Render's auto-scaling.

### NFR-04 · Security

`GEMINI_API_KEY` and `DATABASE_URL` must never be committed to version control — enforced via `.gitignore` and an `.env.example` template. CORS must be restricted to explicitly whitelisted origins; wildcard `*` is unacceptable in production. All data in transit is served over HTTPS, enforced by Vercel and Render by default. The Neon PostgreSQL instance must use SSL for all connections.

### NFR-05 · Maintainability

Business logic must live entirely in `analytics.py` with zero database calls, enabling unit testing without a live connection. The codebase must follow strict layer separation: models → schemas → crud → analytics → routers, with no cross-layer business logic bleeding. All API response shapes must be Pydantic schemas — no untyped `dict` returns from any endpoint. Frontend API calls must be centralized in `lib/api.ts` with TypeScript interfaces matching backend schemas exactly.

### NFR-06 · Usability

The dashboard must be fully functional on screen widths ≥ 1024px. All charts must show tooltips with exact values on hover. The UI must provide visual feedback within 200ms of any user interaction. Empty states must communicate an actionable next step — never a blank white screen.

### NFR-07 · Observability

All Gemini API errors must be logged to the server console with full error context for debugging. Database connection status must be verified at application startup with a clear failure message if unreachable. The `/docs` Swagger UI endpoint must be available in all environments for API inspection and manual testing.

---

## 🗂️ Features & Functions

A precise mapping of every user-facing feature to the underlying function powering it — so nothing in IIROS is a black box.

### Dashboard Module

| Feature | What It Does Under the Hood | Endpoint |
|---|---|---|
| Total kWh Consumed card | Sums all `kwh_consumed` values across all devices for the selected period | `GET /analytics/summary` |
| Estimated Cost (NPR) card | Applies NEA tariff: `total_kwh × 18.0` | `GET /analytics/summary` |
| Peak Usage Hour card | Finds the hour (0–23) with the highest average kWh across all devices | `GET /analytics/summary` |
| Efficiency Score gauge | Composite penalty-based score starting at 100, deducted by device and anomaly conditions | `GET /analytics/summary` |
| CO₂ Emitted card | `total_kwh × 0.43` with tree and km-driven equivalents | `GET /analytics/summary` |
| Energy Trend Area Chart | Time-bucketed hourly kWh + NPR cost series; anomaly days highlighted | `GET /analytics/trends?period=Xd` |
| Period selector (7d / 14d / 30d) | Re-fetches trend data with updated `period` query parameter | `GET /analytics/trends?period=Xd` |

### Device Module

| Feature | What It Does Under the Hood | Endpoint |
|---|---|---|
| Device list table | Returns all active devices with the latest reading snapshot for each | `GET /devices` |
| Per-device kWh total | Aggregates all readings for each device within the selected period | `GET /analytics/devices` |
| Efficiency % column | Calculates `(avg_kw / rated_kw) × 100` for each device | `GET /analytics/devices` |
| Status badge | Classifies device as Efficient / Underloaded / Overload Risk / Idle Waste from consumption patterns | `GET /analytics/devices` |
| Device detail view | Returns full 24-hour reading history + summary stats for a single device | `GET /devices/{id}` |

### Analytics Module

| Feature | What It Does Under the Hood | Endpoint |
|---|---|---|
| Peak Hour Heatmap chart | Returns average kWh for each of 24 hours with `is_peak` boolean flag | `GET /analytics/peak-hours` |
| Peak cost surge display | Multiplies readings within 09:00–17:00 window by 1.3× surge factor | Computed in `analytics.py` |
| Anomaly day markers on chart | Z-score: flags days where `daily_kwh > mean_30d + 2.5 × std_30d` | Computed in `analytics.py` |
| Daily cost spike alert | Flags days where daily cost exceeds 1.5× the 7-day rolling average | Computed in `analytics.py` |

### AI Module

| Feature | What It Does Under the Hood | Endpoint |
|---|---|---|
| Generate Recommendations button | Assembles analytics context → calls Gemini 1.5 Flash → parses JSON → stores to DB → returns list | `POST /recommendations/generate` |
| Recommendation cards | Fetches already-generated recommendations from the database cache | `GET /recommendations` |
| Priority badge (HIGH / MEDIUM / LOW) | Assigned by Gemini based on estimated impact, urgency, and category | Returned in recommendation JSON |
| NPR saving estimate on card | Computed by the analytics engine and validated *before* being sent to Gemini | Returned in recommendation JSON |
| Generate Executive Report button | Full Gemini narrative generation → structured JSON → stored to DB | `POST /reports/executive` |
| Report section display | Renders executive summary, key findings, cost analysis, sustainability section, and action plan | `GET /reports` |
| AI fallback behavior | If Gemini fails, returns rule-based recommendations with real NPR figures from `analytics.py` | Internal fallback in `ai_service.py` |

### Internal System Functions

| Function | What It Computes | File |
|---|---|---|
| `calculate_total_kwh(readings)` | Sums all kWh values in the reading set | `analytics.py` |
| `calculate_cost_npr(kwh)` | Applies NEA tariff: `kwh × 18.0` | `analytics.py` |
| `detect_peak_hours(readings)` | Returns the peak hour integer + 24-hour breakdown with `is_peak` flags | `analytics.py` |
| `calculate_efficiency_score(devices, readings)` | Penalty-based composite score from 0 to 100 | `analytics.py` |
| `calculate_co2(kwh)` | `kwh × 0.43` with tree and km-driven equivalents | `analytics.py` |
| `detect_anomalies(daily_totals)` | Z-score anomaly detection against 30-day mean and standard deviation | `analytics.py` |
| `classify_device_status(device, readings)` | Returns one of four efficiency classifications | `analytics.py` |
| `generate_recommendations(context)` | Calls Gemini with analytics context, parses JSON response, stores to DB | `ai_service.py` |
| `generate_executive_report(context, period)` | Calls Gemini for structured narrative report, stores to DB | `ai_service.py` |
| `bulk_create_readings(db, readings)` | Inserts multiple energy readings in a single database transaction | `crud.py` |

---

## 🏗️ System Architecture

IIROS follows a clean 3-tier architecture with an AI layer inserted between the analytics engine and the presentation layer. The separation is intentional — business logic never bleeds into the API layer, and the AI layer never touches the database directly.

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Dashboard                    │
│         (Vercel · TypeScript · Tailwind · Recharts)     │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────────┐
│                   FastAPI Backend                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ analytics.py│  │ ai_service.py│  │   routers/*.py  │ │
│  │ (Business   │  │ (Gemini 1.5  │  │   (Devices,     │ │
│  │  Logic)     │  │  Flash)      │  │  Readings, AI)  │ │
│  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘ │
│         └────────────────┴───────────────────┘          │
│                    (Render · Uvicorn)                   │
└──────────────────────┬──────────────────────────────────┘
                       │ SQLAlchemy ORM
┌──────────────────────▼──────────────────────────────────┐
│                 PostgreSQL (Neon)                       │
│   devices · energy_readings · recommendations · reports │
└─────────────────────────────────────────────────────────┘
```

### Future IoT Architecture

When real hardware is connected, the pipeline simply extends upstream — everything from the database forward is completely unchanged. That's deliberate.

```
ESP32 + CT Clamp  →  MQTT Topic: iiros/{device_id}/reading
                  →  Mosquitto Broker (Render container)
                  →  FastAPI MQTT Consumer (asyncio)
                  →  PostgreSQL  →  [same analytics + AI pipeline]
```

The `energy_readings` table already carries `voltage`, `current_amps`, and `power_factor` columns. The schema is ready. The architecture is ready. IoT integration is a 2-week sprint, not a redesign.

---

## 🛠️ Tech Stack

### Backend

| Layer | Technology | Why This Choice |
|---|---|---|
| Web Framework | FastAPI + Uvicorn | Async-native, auto-generates `/docs`, fastest Python API framework |
| ORM | SQLAlchemy + Alembic | Battle-tested ORM with proper migration support via Alembic |
| Validation | Pydantic v2 | Enforces request/response shapes at the boundary — no untyped dicts |
| Database | PostgreSQL via Neon | Serverless Postgres with generous free tier; production-grade from day one |
| AI | Google Gemini 1.5 Flash | Fastest Gemini model, JSON output mode, ideal for structured recommendations |
| Language | Python 3.11 | Ecosystem fit for data work, full async support, type hints throughout |

### Frontend

| Layer | Technology | Why This Choice |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR-ready, file-based routing, production Vercel deployment in one command |
| Language | TypeScript | End-to-end type safety — interfaces match Pydantic schemas exactly |
| Styling | Tailwind CSS + Shadcn/ui | Utility-first CSS with accessible, unstyled base components |
| Charts | Recharts | Composable React chart library with excellent TypeScript support |
| Icons | Lucide React | Consistent, clean icon set designed for React |

### Infrastructure

| Service | Provider | Notes |
|---|---|---|
| Frontend Hosting | Vercel | Auto-deploys from `main`, HTTPS enforced, global CDN |
| Backend Hosting | Render | Free tier web service, auto-deploy from GitHub |
| Database | Neon PostgreSQL | Serverless, free tier, SSL connections, branching for dev/prod |

---

## ⚙️ Business Logic

All calculation rules live exclusively in `analytics.py`. Pure Python functions, zero database calls, testable in isolation without a live connection. This isn't an accident — it's the architecture choice that makes the system reliable, auditable, and easy to extend.

### Cost Calculation

Nepal Electricity Authority (NEA) commercial tariff: **NPR 18 per unit** (1 unit = 1 kWh) for institutional buildings.

```python
cost_npr         = kwh_consumed × 18.0
monthly_estimate = daily_avg_kwh × 30 × 18.0
```

### Peak Hour Detection

Business hours from 09:00 to 17:00 are flagged as the peak window. Any day where total cost exceeds 1.5× the 7-day rolling average triggers a spike alert. Readings recorded within peak hours carry a 1.3× surge cost multiplier — reflecting the real-world premium for peak consumption.

### Device Efficiency Classification

| Status | How It's Determined | Badge Color |
|---|---|---|
| Efficient | `avg_kw / rated_kw` falls between 60% and 90% | 🟢 Green |
| Underloaded | `avg_kw / rated_kw` below 30% during business hours | 🟡 Yellow |
| Overload Risk | `avg_kw / rated_kw` above 95% sustained for 2+ hours | 🔴 Red |
| Idle Waste | Non-zero reading between midnight and 6 AM on non-server/security devices | 🟠 Orange |

### Efficiency Score (0–100)

A composite gauge shown on the dashboard. Starts at 100 and applies penalties:

- **−10** for each device classified as Overload Risk
- **−5** for each device classified as Idle Waste
- **−2** for each percentage point that peak-hour share exceeds 40% of the daily total
- **−5** if any anomaly day occurred in the last 7 days
- **+5** if zero anomaly days occurred across the full 30-day window

| Score Range | Meaning |
|---|---|
| 80–100 | ✅ Excellent |
| 60–79 | 🟡 Good |
| 40–59 | ⚠️ Needs Attention |
| Below 40 | 🚨 Critical |

### CO₂ & Sustainability

Nepal NEA grid emission factor: **0.43 kg CO₂ per kWh** (NEA Annual Report 2023).

```python
co2_kg           = total_kwh × 0.43
equivalent_trees = co2_kg / 21.77   # average tree absorbs 21.77 kg CO₂/year
equivalent_km    = co2_kg / 0.21    # average car emits 210g CO₂/km
```

### Anomaly Detection

A day is flagged anomalous when its total kWh exceeds the 30-day mean by more than 2.5 standard deviations. Simple, interpretable, and zero ML dependency.

```python
is_anomaly = daily_kwh > (mean_30d + 2.5 × std_30d)
```

---

## 🤖 AI Integration

IIROS uses **Google Gemini 1.5 Flash** for three distinct capabilities — and each one is designed so that a Gemini failure degrades gracefully rather than breaking the system.

### Recommendations

When a user clicks "Generate Recommendations," the system assembles a full analytics context object: total kWh, per-device efficiency breakdowns, anomaly days, NPR cost figures, and the current efficiency score. This context goes to Gemini, which returns a JSON array of 5–8 prioritized recommendations. Each carries a title, description, category, priority, and an estimated monthly NPR saving.

> **Important design principle:** The NPR figures come from `analytics.py` — Gemini writes the narrative around verified numbers, not the reverse. Gemini is a language layer, not a calculation layer.

### Executive Reports

A single endpoint call triggers Gemini to generate a complete structured report: an executive summary, key findings, cost analysis with period-over-period comparison, a sustainability section with CO₂ context, and a prioritized action plan. The output is formatted for direct use in management presentations.

### Error Handling

Every Gemini call sits inside a `try/except` block. If the response isn't valid JSON, the system retries once with an explicit `Return ONLY valid JSON` instruction appended. If the second attempt also fails, `analytics.py` generates rule-based fallback recommendations using real computed NPR figures. No Gemini error ever surfaces to the frontend — the API always returns a valid, shaped response.

> Gemini never queries the database, never makes device control decisions, and holds no state between calls. It is purely a language layer that receives validated numbers and returns human-readable narrative.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

- Python 3.11 or higher
- Node.js 18 or higher
- A free [Neon](https://neon.tech) PostgreSQL project
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_TEAM/teamname_iicquest.git
cd teamname_iicquest/backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install all dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env — fill in DATABASE_URL, GEMINI_API_KEY, CORS_ORIGINS

# Run database migrations
alembic upgrade head

# Seed 30 days of realistic energy data (7,200 readings across 10 devices)
python seed.py

# Start the development server
uvicorn main:app --reload
```

Visit [http://localhost:8000/docs](http://localhost:8000/docs) to explore the full interactive API documentation.

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start the development server
npm run dev
```

Dashboard available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Service | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string from Neon |
| `GEMINI_API_KEY` | Backend | Google AI Studio key — **never commit this to Git** |
| `CORS_ORIGINS` | Backend | Comma-separated list of allowed origins |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |

---

## 📡 API Reference

**Base URL:** `http://localhost:8000/api` (development) · `https://iiros-api.onrender.com/api` (production)

All responses are `Content-Type: application/json`. Every error follows the same envelope:

```json
{
  "error": true,
  "code": "DEVICE_NOT_FOUND",
  "message": "Device with id=99 does not exist",
  "status": 404
}
```

### Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/analytics/summary` | Dashboard KPIs: total kWh, cost NPR, peak hour, efficiency score, CO₂ kg |
| `GET` | `/analytics/trends?period=7d` | Hourly time-series data for the trend chart (7d / 14d / 30d) |
| `GET` | `/analytics/devices` | Per-device breakdown: kWh, cost NPR, efficiency %, status badge |
| `GET` | `/analytics/peak-hours` | 24-hour heatmap data with `is_peak` flag and surge cost per hour |
| `GET` | `/devices` | All active devices with their latest reading snapshot |
| `GET` | `/devices/{id}` | Single device detail with 24-hour reading history |
| `POST` | `/readings/bulk` | Bulk ingest historical readings (used by seed.py and imports) |
| `POST` | `/recommendations/generate` | Trigger Gemini to generate and store new recommendations |
| `GET` | `/recommendations` | Fetch cached recommendations (filterable by type and priority) |
| `POST` | `/reports/executive` | Generate a full AI executive report and store to database |
| `GET` | `/reports` | List all previously generated reports with metadata |

Full interactive documentation at `/docs` (Swagger UI) and `/redoc`.

---

## ☁️ Deployment

### Backend — Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repository
3. Set the **Start Command** to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables in the Render dashboard: `DATABASE_URL`, `GEMINI_API_KEY`, `CORS_ORIGINS`
5. Render auto-deploys on every push to `main`

After your first successful deploy, run migrations and seed data once using the Render shell:

```bash
alembic upgrade head
python seed.py
```

### Frontend — Vercel

```bash
cd frontend
vercel --prod
```

Or connect your GitHub repository in the Vercel dashboard for fully automatic deploys. Set the environment variable:

```
NEXT_PUBLIC_API_URL = https://iiros-api.onrender.com/api
```

### Database — Neon PostgreSQL

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string into `DATABASE_URL` in both your local `.env` and the Render dashboard
3. Neon manages serverless scaling automatically — no further configuration required

---

## 📈 Startup Roadmap

IIROS was built as a product, not a prototype. The path to revenue is clear and the architecture supports every step.

### Months 0–3 · First Customer

Deploy a live pilot at a real institution with 5 smart plugs. Collect 30 days of genuine consumption data. Ship JWT authentication with role-based access (Admin and Viewer roles). Add anomaly email alerts so facility managers get notified before they even open the dashboard. Sign the first paying customer at NPR 5,000/month.

### Months 3–6 · Hardware & Scale

Complete the ESP32 + MQTT hardware pipeline. Release the branded IIROS Smart Energy Meter kit at NPR 8,000 per sensor. Reach 10 paying customers across the region. Build multi-tenant architecture with per-organization data isolation. **ARR target: NPR 600,000.**

### Months 6–12 · Market Leadership

Scale to 25–50 customers. Train an ML anomaly detection model on 6+ months of real data. Add carbon credit estimation for UNFCCC compliance. Establish a formal partnership with NEA for official tariff data integration. **ARR target: NPR 3,000,000+.**

### Pricing

| Plan | NPR / month | Device Limit | What's Included |
|---|---|---|---|
| Starter | 5,000 | Up to 20 | Dashboard, AI recommendations, monthly reports |
| Professional | 15,000 | Up to 100 | Multi-building view, API access, custom alert thresholds |
| Enterprise | 40,000 | Unlimited | White-label branding, dedicated support, 99.9% SLA |
| Hardware Kit | 8,000 one-time | Per sensor | ESP32 module, CT clamp, weatherproof enclosure |

---

## 🔍 AI Tools Disclosure

In the spirit of full transparency, the following AI tools were used during the development of IIROS:

| Tool | How It Was Used |
|---|---|
| **Google Gemini 1.5 Flash** | Core product feature — runs at runtime inside the application to generate energy recommendations and executive reports for end users |
| **Claude (Anthropic)** | Used during development for system architecture planning, database schema design, prompt engineering, and code structure assistance |
| **GitHub Copilot** | Used for code completion during frontend component development and backend endpoint implementation |

**One important boundary worth being explicit about:** all business logic calculations — cost estimation, efficiency scoring, CO₂ computation, anomaly detection — are deterministic Python code written by the development team in `analytics.py`. Gemini receives only pre-validated numbers and generates natural language narrative around them. It computes nothing independently.

---
