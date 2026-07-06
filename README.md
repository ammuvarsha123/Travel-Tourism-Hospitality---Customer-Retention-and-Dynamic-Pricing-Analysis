# Tourism & Hospitality Analytics - Full-Stack SaaS & Power BI Dashboard

Welcome to the Tourism & Hospitality Analytics SaaS application! This is a complete, full-stack application centered on a detailed analysis of international tourism data. It provides a web-based, interactive dashboard inspired by Microsoft Power BI Service.

## Features

1. **Power BI Service Emulator:**
   - **Report View:** Interactive widgets showing metrics (Revenue, Tourists, Occupancy, Satisfaction) and charts (Line, Bar, Donut, Scatter) with automatic cross-filtering.
   - **Data View:** A tabular, searchable, sortable database sheet of the CSV records.
   - **Model View:** Interactive relationship diagram showing the underlying Star Schema model.
   - **Fields & Visualizations Pane:** Customize columns and charts on the fly.
   
2. **Full-Stack SaaS Platform:**
   - **Authentication:** Simulated multi-user accounts (Analyst, Admin) with secure persistence.
   - **Workspace Management:** Create separate workspaces to organize different datasets.
   - **Collaborative Notes:** Leave comments on charts that persist in the database.
   - **Billing & Upgrade:** Interactive payment gateway simulator to upgrade to "Pro" or "Enterprise" access.
   - **Developer Portal:** Issue developer API keys, copy sample Javascript/Python fetch snippets, and run live sandbox requests.

---

## Getting Started

### Prerequisites
- **Node.js:** v18.0 or later
- **npm:** v9.0 or later

### Installation
From the root workspace directory, run:
```bash
npm run install:all
```
This will automatically install dependencies for the root coordinator, backend server, and React frontend application.

### Running Locally
To launch both the backend server and React dev server concurrently, run:
```bash
npm run dev
```

The application will start at:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)

---

## Tech Stack
- **Frontend:** React, Vite, Recharts, Lucide Icons, Vanilla CSS (Glassmorphism, animations).
- **Backend:** Node.js, Express, Cors, body-parser, csv-parser.
- **Database:** Lightweight JSON file-based database for reliable, zero-compilation local setup.
