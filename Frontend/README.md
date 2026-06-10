# IIROS Frontend

Intelligent Infrastructure and Resource Optimization System frontend for the BKC IIC demo project.

## Current Progress

Last updated: June 10, 2026

This frontend is currently in initial project setup state.

Completed so far:

- Read and reviewed the IIROS blueprint document.
- Analyzed only the frontend-related sections of the blueprint.
- Created the frontend folder structure under this directory.
- Added empty placeholder files for the planned Next.js App Router frontend.
- Added `package.json` with the planned frontend dependency baseline.
- No feature implementation code has been written yet.
- No dependencies have been installed yet.
- No `node_modules` or lockfile has been generated yet.

## Frontend Scope From Blueprint

The frontend is planned as a Next.js App Router dashboard for facility managers.

Main pages:

- Dashboard
- Devices
- AI Recommendations
- Executive Reports

Main UI areas:

- Sidebar navigation
- Topbar
- Summary KPI cards
- Energy trend charts
- Device breakdown charts and table
- Recommendation cards
- Executive report display

## Current File Structure

```text
frontend/
  package.json
  public/
    .gitkeep
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
      devices/
        page.tsx
      recommendations/
        page.tsx
      reports/
        page.tsx
    components/
      ai/
        RecommendationCard.tsx
        ReportDisplay.tsx
      charts/
        DeviceBarChart.tsx
        EnergyTrendChart.tsx
        PeakHourChart.tsx
      dashboard/
        SummaryCard.tsx
      devices/
        DeviceTable.tsx
      layout/
        Sidebar.tsx
        Topbar.tsx
      ui/
        badge.tsx
        button.tsx
        card.tsx
        skeleton.tsx
        table.tsx
    lib/
      api.ts
      types.ts
      utils.ts
```

All scaffold files above are currently empty placeholders, except this README and `package.json`.

## Dependency Baseline

Core dependencies currently recorded in `package.json`:

- Next.js `16.2.9`
- React `19.2.7`
- React DOM `19.2.7`
- Tailwind CSS `4.3.0`
- shadcn CLI `4.11.0`
- Recharts `3.8.1`
- Lucide React `1.17.0`
- TypeScript `6.0.3`
- ESLint `9.39.4`

Note: ESLint is pinned to the latest compatible v9 version because the current Next.js ESLint plugin stack does not fully support ESLint v10 peer ranges yet.

## Intended Setup

When development starts, dependencies can be installed from this directory:

```bash
npm install
```

The expected development command after implementation setup is:

```bash
npm run dev
```

## README Update Rule

This README should be updated side by side as frontend development continues.

Future updates should record:

- New files or folders added
- Components implemented
- Pages implemented
- API integration progress
- Environment variables added
- Setup commands that become required
- Known issues or pending tasks
- Verification steps completed

