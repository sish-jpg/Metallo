# METALLO — Full-Stack Industrial Energy Optimization Platform

> **Intelligent Energy and Process Decision-Support Platform for Metal Foundries**  
> *Production-quality prototype for foundry cost reduction, specific energy consumption (SEC) benchmarking, time-of-day tariff optimization, and furnace charge scheduling.*

---

## 📌 Important Product Boundary

> [!NOTE]  
> **CURRENT PROTOTYPE:** Operates using **simulated industrial telemetry**, user-uploaded batch logs (CSV), and manual operational entries. It does **not** claim physical sensor connectivity.  
> **FUTURE DEPLOYMENT:** Architected with decoupled service interfaces so native industrial Modbus TCP, OPC-UA, and digital energy meters can stream plant data directly into the time-series ingestion pipeline.

---

## 1. Problem Statement & Industrial Significance

Metal casting is among the most energy-intensive manufacturing sub-sectors. Small and medium-sized foundries operating medium-frequency induction furnaces face several critical economic and operational challenges:

1. **High Specific Energy Consumption (SEC):** Melting grey iron or SG iron typically requires 550–620 kWh per tonne. Inefficient scrap density, slag build-up, and prolonged holding inflate SEC above 680+ kWh/t, destroying operating margins.
2. **Thermal Holding Waste:** When pouring moulds are delayed, molten metal sits idle in the furnace crucible at 1450°C+. Continuous holding power (80–120 kW) consumes pure energy simply combating radiation losses without adding any metallurgical value.
3. **Time-of-Day (ToD) Peak Surcharges:** Regional electricity boards (DISCOMs) impose steep tariff multipliers during peak hours (e.g., 06:00–10:00 & 18:00–22:00 at ₹9.0/kWh vs ₹6.0/kWh off-peak). Melting during peak periods inflates electricity bills by 20–35%.
4. **Apparent Demand (kVA) & Low Power Factor Penalties:** Induction furnace coil reactance requires balanced capacitor banks. A power factor drop below 0.95 increases kVA apparent load ($kVA = kW / PF$), exhausting substation headroom and incurring severe utility penalties.
5. **Demand Spikes from Uncoordinated Starts:** Running two 600 kW induction furnaces simultaneously in the morning shift creates a 1,200 kW surge, breaching contract sanctions (e.g., 1,100 kW limit) and ratcheting monthly fixed charges.

**METALLO** provides plant managers with real-time decision support to understand where energy and capital are being lost, quantify the financial impact, and execute an optimized production schedule.

---

## 2. Core Product Capabilities

- **Furnace-First Information Architecture:** Real-time visibility into machine state (`MELTING`, `HOLDING`, `POURING`, `IDLE`, `OFF`), bath temperatures, active power (kW), apparent load (kVA), and power factor (PF).
- **Dynamic SEC Calculation:** Calculates $SEC = \text{Total Energy (kWh)} / \text{Production (tonnes)}$ dynamically for every batch heat and flags anomalies against the 580 kWh/t benchmark.
- **Explainable Anomaly Detection:** Rules-based detection (no black-box machine learning) flagging abnormal melting kW, low PF, excessive holding, and demand spikes with clear mechanical inspection points.
- **Explainable Schedule Optimizer:** Staggers furnace melt starts and back-calculates timing from mould pour deadlines ($Start = Pour - Duration - Buffer$), cutting simultaneous peak demand from 1,200 kW to 600 kW and saving thousands of rupees in daily holding waste.
- **Time-Of-Day Tariff Commercial Engine:** Models multi-tiered HT tariffs (Peak, Normal, Off-Peak) to quantify exact cost per heat.
- **Live Factory Telemetry Simulation:** Deterministic simulation engine modeling cyclic furnace states, power fluctuations, bath temperatures, and automatic alert generation.
- **CSV Data Ingestion & Validation:** Validates user-uploaded historical heat logs and telemetry with row-level error reporting.

---

## 3. Engineering Formulas & Calculation Logic

### 3.1 Specific Energy Consumption (SEC)
$$\text{SEC} = \frac{\text{Total Energy Consumed (kWh)}}{\text{Liquid Metal Output (tonnes)}} \quad [\text{kWh/t}]$$

### 3.2 Power Factor & Apparent Power
$$\text{kVA} = \frac{\text{Active Power (kW)}}{\text{Power Factor (PF)}} \qquad \text{PF} = \frac{\text{Active Power (kW)}}{\text{Apparent Power (kVA)}}$$
- **Target PF:** $\ge 0.95$ (Configurable)
- **Apparent Load Headroom Impact:** $\Delta \text{kVA} = \frac{\text{kW}}{\text{PF}_{\text{observed}}} - \frac{\text{kW}}{0.95}$

### 3.3 Avoidable Holding Energy & Cost
$$\text{Holding Energy (kWh)} = \text{Holding Power (kW)} \times \left(\frac{\text{Holding Duration (minutes)}}{60}\right)$$
$$\text{Excess Minutes} = \max(0, \text{Actual Holding} - \text{Threshold [30m]})$$
$$\text{Avoidable Cost} = \left(\text{Holding Power} \times \frac{\text{Excess Minutes}}{60}\right) \times \text{Applicable Tariff Rate (₹/kWh)}$$

### 3.4 4 Explainable Scheduling Rules
1. **Rule 1 (Melt Start Back-Calculation):** $\text{Start Time} = \text{Pour Time} - \text{Melt Duration} - \text{Safety Buffer}$ to minimize unproductive holding.
2. **Rule 2 (Peak Tariff Avoidance):** Shift melts outside 06:00–10:00 or 18:00–22:00 peak hours where mould readiness permits. If impossible, tag: *"Peak consumption unavoidable under current pour-time constraint"*.
3. **Rule 3 (Melt Staggering):** Offset parallel furnace melts so combined active power does not breach the plant contract threshold ($600\,\text{kW} + 600\,\text{kW} = 1200\,\text{kW} > 1100\,\text{kW} \longrightarrow \text{Staggered to } 600\,\text{kW}$).
4. **Rule 4 (Holding Time Flag):** Flag any heat holding molten metal beyond the 30-minute threshold.

---

## 4. Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   METALLO PLATFORM                     │
└────────────────────────────────────────────────────────┘
                           │
 ┌─────────────────────────┴─────────────────────────┐
 │                                                   │
 ▼                                                   ▼
FRONTEND (Client)                          BACKEND (Server)
• React 18 + Vite                          • Node.js + Express (ES Modules)
• Tailwind CSS (Industrial Theme)          • REST API Controller Pattern
• Recharts (Telemetry & SEC Trends)        • Deterministic Physics Engines
• Lucide React Icons                       • Fallback Embedded Mongo Store
                                           • Native Mongoose Support
```

### Technology Matrix
- **Runtime:** Node.js v20+ / v24
- **Backend:** Express.js, Multer, CSV-Parser, Mongoose
- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
- **Database:** MongoDB with automatic embedded in-memory/JSON fallback (`data/db_store.json`) for zero-configuration local evaluation.

---

## 5. Local Setup & Quickstart

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/sishiraav/metallo.git
cd metallo

# Install backend dependencies
npm install

# Install client dependencies
npm --prefix client install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/metallo
SIMULATION_TICK_MS=3000
HOLDING_ALERT_THRESHOLD_MINUTES=30
PF_ALERT_THRESHOLD=0.95
DEMAND_ALERT_THRESHOLD_KW=1100
SAFETY_BUFFER_MINUTES=15
```

### Seed Demo Data
Populate the database with realistic furnaces (F1, F2), historical heats, HT tariffs, and baseline alerts:
```bash
npm run seed
```

### Run Automated Test Suite
Verify 100% of calculation formulas, scheduler rules, and validation checks:
```bash
npm test
```

### Start the Application
```bash
# Option A: Build and run unified full-stack server
npm run build
npm start

# Access in browser:
# UI: http://localhost:5000
# API: http://localhost:5000/api
# Health: http://localhost:5000/health

# Option B: Run Vite hot-reloading dev client concurrently
npm run client
# Access frontend: http://localhost:5173
```

---

## 6. End-to-End Demonstration Journey

1. **Overview Dashboard:** View plant KPIs, today's average SEC (580–610 kWh/t), current active demand (kW), apparent load (kVA), and live telemetry trends.
2. **Furnace Equipment View:** Inspect Furnace F1 (Melting 582 kW, 1420°C) and Furnace F2 (Holding 102 kW, 1490°C).
3. **Heat Analytics:** Deep-dive into Heat `H-105` to observe excessive holding duration (47 min vs 30 min limit) and quantified thermal loss (~₹326 avoidable cost).
4. **Power Factor Analysis:** Visualize the power triangle ($kW \text{ vs } kVA$). Notice F2 operating at 0.88 PF, triggering an explainable inspection recommendation for capacitor banks.
5. **Schedule Optimizer:** Compare the unoptimized morning baseline against the **METALLO Optimized Schedule**. Observe how staggering melts saves **₹5,725/day**, eliminates **583 kWh** of holding energy, and drops peak demand from **1,200 kW to 600 kW**.
6. **Live Telemetry Simulation:** Click **[START SIMULATION]** on the top controller bar. Watch furnace states cycle deterministically (`MELTING` $\rightarrow$ `HOLDING` $\rightarrow$ `POURING` $\rightarrow$ `IDLE`), observe real-time power updates, and watch explainable alerts trigger dynamically.
7. **Settings & CSV Ingestion:** Adjust DISCOM peak rates or plant demand thresholds in Settings; verify that all platform calculations update instantly. Upload custom foundry heat CSVs or download the provided CSV template.

---

## 7. Future Deployment Architecture

```
Physical Induction Furnace
  │ (Modbus RTU / RS-485 / 4-20mA)
  ▼
Edge Gateway (Raspberry Pi / Industrial PC running Node-RED / Kanto)
  │ (TLS MQTT / OPC-UA)
  ▼
METALLO Ingestion Worker
  │ (Kafka / RabbitMQ)
  ▼
Time-Series Database (TimescaleDB / InfluxDB / MongoDB Timeseries)
  │
METALLO Core Analytics & Optimization Engine
```

### Potential Machine Learning Enhancements (Future Scope)
- **Refractory Wear Estimation:** Inferring lining thickness degradation from thermal dissipation and SEC trends over 200+ heats.
- **Dynamic Scrap Charge Optimizer:** Optimizing steel scrap vs pig iron proportions based on market scrap prices and carbon equivalent target constraints.
- **Predictive Mould Synchronization:** Vision-based mould readiness tracking to dynamically advance or retard furnace power ramping.

---

## 8. License

Distributed under the MIT License. See `LICENSE` for more information.
