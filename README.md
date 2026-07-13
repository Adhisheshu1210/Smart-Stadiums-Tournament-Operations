# 🏆 StadiumMind AI - FIFA World Cup 2026 Smart Stadium Platform (MVP)

Welcome to the official repository for **StadiumMind AI**, a production-quality MVP engineered for the **FIFA World Cup 2026 Hackathon** under **Challenge 4: Smart Stadiums & Tournament Operations**.

StadiumMind AI is a state-of-the-art, GenAI-powered intelligent stadium control and spectator operations platform designed to optimize arena navigation, de-escalate crowd bottleneck risks, support volunteers in critical workflows, and gamify sustainable fan transit.

---

## 🌟 Core Features

### 1. 🤖 Secure Server-Side AI Stadium Assistant
- **Multilingual Support**: Real-time localized support in 10+ major languages (English, Spanish, French, Arabic, Hindi, Portuguese, Japanese, Chinese, German, Italian) with automatic query detection.
- **RAG Knowledge Base**: Fully integrated retrieval-augmented generation matching official FIFA 2026 stadium policies, safety guidelines, bag limits, and accessible route locations.
- **Role-Based Adaptation**: Dynamically adjusts assistance behavior for **Fans** (navigation, restrooms, policies) versus **Volunteers & Staff** (lost child SOPs, medical emergencies, gate diversion tactics).

### 2. 🗺️ Interactive Digital Twin & Pathfinder Map
- **Vector Arena Visualization**: Interactive high-fidelity map showcasing real-time crowd densities, wait times, gate statuses, and concession stands.
- **Dynamic Route Planning**:
  - ⚡ **Fastest Path**: Bypasses congested areas.
  - ♿ **Accessible Path**: Routes via ADA ramp entry points, tactile paving corridors, and elevator lifts.
  - 👪 **Family Path**: Directs via quiet zones and infant-care rest locations.
  - 🚨 **Emergency Evacuation**: Highlights active fire safety egress routes in critical situations.
- **Drone CCTV Telemetry**: Real-time simulated drone feed overlays to pinpoint high-density sections.

### 3. 📊 Crowd Density Control Room Dashboard
- **Live IoT Metrics**: Displays current attendance (e.g. 76,420 / 82,500), security queue duration, restroom availability, and concessions load.
- **Recharts Analytics**: Staggered, beautiful line charts tracking incoming gate wait times and predicting future bottlenecks.

### 4. 🚨 Crisis Management & Organizer Dashboard
- **Incident Intelligence Engine**: Real-time volunteer reports (slips/falls, exit blockages) instantly process through a server-side Gemini intelligence engine to output **custom Standard Operating Procedures (SOPs)**.
- **Dynamic SOP Action Board**: Immediate dispatching instructions and visual alerts pushed straight to the volunteer task hub.

### 5. ♿ Accessibility & High-Contrast Design
- **WCAG AAA Contrast Toggle**: Instantly increases text-to-background contrast ratio.
- **Font Resizer (A+)**: Responsive layouts adjust sizing dynamically.
- **Text-to-Speech & Voice Placeholder**: Accessibility-first interface controls for vision-impaired spectators.

### 6. 🌱 Transport Carbon Tracker & Green Gamification
- **Green Route Score**: Estimates CO2 footprint based on transit choices (Metro, bus, walking, rideshare, parking).
- **Eco Reward Points**: Fans claim points for taking eco-friendly paths (Meadowlands Express Line M4, walking), unlocking rewards and digital gold badges.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend & Host**: Node.js (TypeScript), Express.js v4, Vite Dev Server Middleware.
- **Build Tooling**: `tsx` (runtime loader), `esbuild` (standalone Node.js CommonJS bundler), `vite`.
- **GenAI Engine**: `@google/genai` (Official modern SDK) with Google Gemini 1.5/2.0 Models.
- **Testing Framework**: Vitest (Unit and integration tests).

### Architecture Map
```text
           +--------------------------------------------+
           |           Vite Single Page React App       |
           |   (Interactive Twin, Chatbot, Green Hub)   |
           +---------------------+----------------------+
                                 |
                                 v  (AJAX / REST Endpoints)
           +---------------------+----------------------+
           |         Express.js API Router (Port 3000)  |
           |  - /api/gemini/chat   - /api/incidents     |
           |  - /api/crowd         - /api/tasks         |
           +---------------------+----------------------+
                                 |
                                 v  (Secure Node Server Client)
           +---------------------+----------------------+
           |      Google Gemini 3.5 Flash Model API     |
           +--------------------------------------------+
```

---

## 📂 Folder Structure

The repository has been engineered to remain exceptionally lightweight and compliant under **10 MB**:

```text
├── public/                 # Static assets copied directly to dist/ during build
│   ├── manifest.json       # PWA Application manifest
│   └── robots.txt          # Web crawl controls
├── src/
│   ├── components/         # Reusable dashboard cards, charts, chatbot & map
│   ├── utils/
│   │   └── navigation.ts   # Core algorithms for pathfinding, CO2, and chat mocks
│   ├── App.tsx             # Main React application shell and UI router
│   ├── data.ts             # High-fidelity static seed data & knowledge base
│   ├── types.ts            # Absolute strict TypeScript interfaces
│   ├── main.tsx            # Main client entry point
│   ├── index.css           # Global Tailwind stylesheet
│   ├── sitemap.ts          # SEO Sitemap config mapping
│   └── robots.ts           # SEO Robots rules configuration
├── tests/
│   ├── chat-api.test.ts    # Tests AI fallback responses & workflows
│   ├── dashboard.test.ts   # Tests dashboard state models and metrics
│   └── navigation.test.ts  # Tests pathfinder gate selection and green CO2
├── server.ts               # Production Express.js server & Vite middleware
├── package.json            # Scripts, dependencies, and build pipelines
├── tsconfig.json           # Strictly configured TypeScript compiler rules
├── vite.config.ts          # Vite asset bundling rules
├── .env.example            # Sample environment parameters
└── .gitignore              # Production-ready file exclusion configuration
```

---

## 🔧 Installation & Setup

Ensure you have **Node.js 18+** installed on your system.

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file in the project root (or configure your environment variables in AI Studio):
```env
GEMINI_API_KEY="YOUR_ACTUAL_SECURE_GEMINI_API_KEY"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live app preview.

### 4. Execute Unit Tests
```bash
npm run test
```

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🚀 Future Enhancements

1. **Real-time Mapbox Grounding**: Swap static vector maps with live GPS Mapbox geofenced coordinates inside MetLife Stadium.
2. **WebSocket Synchronization**: Connect active volunteer tasks to live server-authoritative broadcast nodes.
3. **Audio Streaming**: Stream native text-to-speech audio files directly from Gemini's Live API for visually impaired fans.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
All brand-marks, flags, and FIFA World Cup references are trademarks of their respective owners.
