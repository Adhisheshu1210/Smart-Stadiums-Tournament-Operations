import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import types & initial seeds
import { Match, VolunteerTask, IncidentReport, Alert } from './src/types';
import {
  STADIUM_KNOWLEDGE_BASE,
  INITIAL_MATCHES,
  INITIAL_STADIUM,
  INITIAL_CROWD_METRICS,
  INITIAL_TRANSPORT_OPTIONS,
  INITIAL_PARKING_ZONES,
  INITIAL_RESTROOMS,
  INITIAL_FOOD_VENDORS,
  INITIAL_ALERTS,
  INITIAL_VOLUNTEER_TASKS,
  INITIAL_INCIDENTS,
  EMERGENCY_GUIDES
} from './src/data';

// Initialize in-memory database states so updates are persistent throughout the server lifecycle
const database = {
  matches: [...INITIAL_MATCHES],
  stadium: { ...INITIAL_STADIUM },
  crowdMetrics: { ...INITIAL_CROWD_METRICS },
  transportOptions: [...INITIAL_TRANSPORT_OPTIONS],
  parkingZones: [...INITIAL_PARKING_ZONES],
  restrooms: [...INITIAL_RESTROOMS],
  foodVendors: [...INITIAL_FOOD_VENDORS],
  alerts: [...INITIAL_ALERTS],
  tasks: [...INITIAL_VOLUNTEER_TASKS],
  incidents: [...INITIAL_INCIDENTS],
  sustainabilityPoints: 1250,
  userCompletedTasks: 3
};

// Initialize Gemini Client
const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
let ai: GoogleGenAI | null = null;

if (hasApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI Client successfully initialized!");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI with API Key:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in high-fidelity mock fallback mode.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // ----------------------------------------------------
  // REST API Endpoints - Data Services & IoT Simulation
  // ----------------------------------------------------

  // Get current match stats
  app.get('/api/matches', (req, res) => {
    // Randomly fluctuate match times/stats to simulate IoT/live updates if match is live
    database.matches = database.matches.map(m => {
      if (m.status === 'live' && m.score && m.possession && m.stats) {
        const rand = Math.random();
        if (rand > 0.7) {
          // Increase possession slightly, simulate a corner or shot
          const side = Math.random() > 0.5 ? 'teamA' : 'teamB';
          m.possession[side] = Math.min(65, Math.max(35, m.possession[side] + (Math.random() > 0.5 ? 1 : -1)));
          m.possession[side === 'teamA' ? 'teamB' : 'teamA'] = 100 - m.possession[side];
          m.stats.shots[side] += Math.random() > 0.8 ? 1 : 0;
          m.stats.corners[side] += Math.random() > 0.9 ? 1 : 0;
          
          // Random live goal possibility
          if (Math.random() > 0.98) {
            m.score[side] += 1;
            const min = 81 + Math.floor(Math.random() * 8);
            m.timeline?.push({
              minute: min,
              type: 'goal',
              team: side === 'teamA' ? 'A' : 'B',
              player: side === 'teamA' ? 'Timothy Weah' : 'Marcus Rashford',
              detail: 'Fierce drive following a quick counterattack!'
            });
          }
        }
      }
      return m;
    });
    res.json(database.matches);
  });

  // Get stadium configuration
  app.get('/api/stadium', (req, res) => {
    res.json(database.stadium);
  });

  // Get crowd metrics (Simulates IoT Sensors, Drone telemetry, queue length updates)
  app.get('/api/crowd', (req, res) => {
    // Fluctuate wait times slightly
    const d = database.crowdMetrics;
    const delta = Math.random() > 0.5 ? 1 : -1;
    d.queueTimes.security = Math.max(5, Math.min(45, d.queueTimes.security + (Math.random() > 0.7 ? delta : 0)));
    d.queueTimes.foodCourts = Math.max(2, Math.min(25, d.queueTimes.foodCourts + (Math.random() > 0.7 ? delta : 0)));
    d.queueTimes.restrooms = Math.max(1, Math.min(20, d.queueTimes.restrooms + (Math.random() > 0.7 ? delta : 0)));
    d.currentOccupancy = Math.max(76000, Math.min(82500, d.currentOccupancy + Math.floor((Math.random() - 0.5) * 50)));
    res.json(d);
  });

  // Get public transport recommendations
  app.get('/api/transport', (req, res) => {
    res.json(database.transportOptions);
  });

  // Get parking zones
  app.get('/api/parking', (req, res) => {
    res.json(database.parkingZones);
  });

  // Get restroom status
  app.get('/api/restrooms', (req, res) => {
    // Random clean status / queue fluctuations
    database.restrooms = database.restrooms.map(r => {
      if (Math.random() > 0.8) {
        r.queueLength = Math.max(0, r.queueLength + (Math.random() > 0.5 ? 1 : -1));
        r.waitTimeMinutes = Math.max(0, Math.ceil(r.queueLength * 0.7));
      }
      return r;
    });
    res.json(database.restrooms);
  });

  // Get food vendors
  app.get('/api/food', (req, res) => {
    res.json(database.foodVendors);
  });

  // Get alerts list
  app.get('/api/alerts', (req, res) => {
    res.json(database.alerts);
  });

  // Get volunteer tasks
  app.get('/api/tasks', (req, res) => {
    res.json(database.tasks);
  });

  // Post or claim a volunteer task
  app.post('/api/tasks', (req, res) => {
    const { title, description, location, priority, category, assignedTo } = req.body;
    if (assignedTo && req.body.id) {
      // Claim task
      database.tasks = database.tasks.map(t => {
        if (t.id === req.body.id) {
          t.assignedTo = assignedTo;
          t.status = 'in-progress';
        }
        return t;
      });
      return res.json({ success: true, tasks: database.tasks });
    }

    const newTask: VolunteerTask = {
      id: `task-${Date.now()}`,
      title: title || 'New Task Request',
      description: description || 'No details provided.',
      location: location || 'Main Concourse',
      priority: priority || 'medium',
      status: 'pending',
      category: category || 'info',
      assignedTo: 'Unassigned'
    };
    database.tasks.unshift(newTask);
    res.json({ success: true, tasks: database.tasks, newTask });
  });

  // Complete a task and earn points
  app.post('/api/tasks/complete', (req, res) => {
    const { id } = req.body;
    database.tasks = database.tasks.map(t => {
      if (t.id === id) {
        t.status = 'completed';
        database.userCompletedTasks += 1;
        database.sustainabilityPoints += 150; // reward points
      }
      return t;
    });
    res.json({ success: true, tasks: database.tasks, points: database.sustainabilityPoints, completedCount: database.userCompletedTasks });
  });

  // Get and report incident reports (Crisis management / Emergency Intel)
  app.get('/api/incidents', (req, res) => {
    res.json(database.incidents);
  });

  // Create an Incident Report (With automatic AI recommendation engine)
  app.post('/api/incidents', async (req, res) => {
    const { title, type, location, description, reporterName, priority } = req.body;

    let aiRecommendation = "1. Isolate the affected area immediately. 2. Dispatch a rapid response supervisor. 3. Monitor live feed cameras.";

    if (ai) {
      try {
        const prompt = `An incident of type "${type}" named "${title}" was reported at "${location}". Description: "${description}". The priority level is "${priority}". Provide 3 to 4 concrete, actionable Standard Operating Procedure (SOP) bullet points for stadium operations staff to handle this emergency. Keep it concise, professional, and clear.`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: "You are StadiumMind AI's Emergency intelligence SOP generator. Output 3-4 numbered actionable steps without extra conversational filler."
          }
        });
        if (response.text) {
          aiRecommendation = response.text.trim();
        }
      } catch (err) {
        console.error("Failed to generate AI SOP recommendation:", err);
      }
    } else {
      // Clever local mock recommendation based on type
      if (type === 'medical') {
        aiRecommendation = "1. Direct the nearest medical responder in Quadrant 2 to the spot immediately. 2. Clear spectators to allow AED cart passage. 3. Prepare incident report for review.";
      } else if (type === 'security') {
        aiRecommendation = "1. Dispatch security squad Charlie to de-escalate. 2. Lock nearby automated exit gates if violence escalates. 3. Access CCTV feed camera Sec-14.";
      } else if (type === 'fire') {
        aiRecommendation = "1. Activate dry-chemical suppression nearest extinguisher. 2. Initiate partial crowd deflection to Gate B. 3. Open direct transit lane for fire department entry.";
      }
    }

    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      title: title || 'Reported Incident',
      type: type || 'other',
      location: location || 'Unknown Location',
      description: description || 'No description provided.',
      reporterName: reporterName || 'Anonymous',
      status: 'reported',
      priority: priority || 'medium',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      aiSopRecommendation: aiRecommendation
    };

    // Push new incident
    database.incidents.unshift(newIncident);

    // Also trigger automated smart notification / alert
    if (priority === 'critical' || priority === 'high') {
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        type: type === 'fire' || type === 'security' ? 'emergency' : 'congestion',
        title: `URGENT: ${title}`,
        message: `Response team dispatched to ${location}. Please cooperate with staff and keep pathways clear.`,
        timestamp: newIncident.timestamp,
        sector: location,
        active: true
      };
      database.alerts.unshift(newAlert);
    }

    res.json({ success: true, incidents: database.incidents, alerts: database.alerts, newIncident });
  });

  // Sustainability gamification & transportation tracker
  app.post('/api/sustainability/claim', (req, res) => {
    const { points, transportType } = req.body;
    database.sustainabilityPoints += points || 50;
    res.json({ success: true, points: database.sustainabilityPoints, message: `Successfully claimed ${points} green points for choosing eco-friendly ${transportType}!` });
  });

  // ----------------------------------------------------
  // Secures Server-Side Gemini Chatbot (RAG Built-in)
  // ----------------------------------------------------
  app.post('/api/gemini/chat', async (req, res) => {
    const { message, chatHistory, role } = req.body; // role can be 'fan' or 'volunteer'
    const contextStr = JSON.stringify(STADIUM_KNOWLEDGE_BASE);

    let systemInstruction = `You are StadiumMind AI, the premier FIFA World Cup 2026 Smart Stadium Intelligent Assistant. 
    You help Fans navigate the stadium, understand prohibited policies, find restrooms, food, and accessible gates, and manage their match experience.
    
    Here is our authentic, verified RAG Knowledge Base of stadium policies and details:
    ${contextStr}
    
    CRITICAL INSTRUCTIONS:
    1. Answer queries accurately based on this Knowledge Base. If a query is outside our data (e.g. general knowledge), use your intelligence to provide a helpful, polite response fitting a world-class FIFA host.
    2. Answer in the same language as the user's query (automatic language detection). Support English, Spanish, French, Arabic, Hindi, Portuguese, Japanese, Chinese, German, Italian, etc.
    3. Be concise, extremely polite, and provide useful directions. Mention specific Gates (e.g., Gate D for accessibility) or sectors where relevant.
    4. Keep tone professional, welcoming, and athletic. Use clear formatting.`;

    if (role === 'volunteer') {
      systemInstruction = `You are StadiumMind AI's Volunteer Operations Assistant. 
      Your purpose is to guide volunteers, staff, and medical personnel on official FIFA tournament procedures, emergency SOPs, lost child workflows, and translation tasks.
      
      Verified Volunteer & Emergency RAG Knowledge Base:
      ${contextStr}
      
      CRITICAL OPERATIONS INSTRUCTIONS:
      1. Lost Child Workflow: Guide volunteer to report Sector immediately, locate nearest security kiosk, and stay with the child. Never broadcast the child's name.
      2. Medical Emergency SOP: Direct volunteer to confirm consciousness, signal for AED, alert dispatch, and keep crowd clear.
      3. Overcrowding SOP: Pause entry, direct flow to underutilized gates.
      4. Speak with professional, highly calm, structured authority. Use lists, bold terms, and step-by-step logic. Answer in the language of the query.`;
    }

    if (ai) {
      try {
        // Map history to the required format of the chats/generateContent api
        const formattedContents = [];
        if (chatHistory && Array.isArray(chatHistory)) {
          for (const msg of chatHistory) {
            formattedContents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        }
        // Append current message
        formattedContents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });

        res.json({ text: response.text });
      } catch (err: any) {
        console.error("Gemini Chat Error:", err);
        res.status(500).json({ error: "Unable to process AI request at this time. Running simulation fallback." });
      }
    } else {
      // Ultra-realistic, stateful fallback responder using smart regex matching
      const msgLower = message.toLowerCase();
      let responseText = "";

      if (role === 'volunteer') {
        if (msgLower.includes('child') || msgLower.includes('lost')) {
          responseText = "**[LOCAL SIMULATOR SOP: LOST CHILD PROTOCOL]**\n\n1. **Do not move**: Keep the child in Sector 215 Concourse.\n2. **Dispatch**: Alert unassigned Volunteer Task-3 immediately via your Task panel.\n3. **De-escalate**: Calm the child down, do not broadcast the child's full name over stadium public address for safety.\n4. **Security Handover**: Accompany child to the nearest Security Sub-station behind Sector 201.";
        } else if (msgLower.includes('medical') || msgLower.includes('hurt') || msgLower.includes('emergency')) {
          responseText = "**[LOCAL SIMULATOR SOP: MEDICAL RESPONDER]**\n\n1. **Assess Consciousness**: If breathing, place in recovery position.\n2. **AED Ready**: Dispatch teammate to retrieve the automated external defibrillator located at Sec 112 ADA station.\n3. **Relay Core Info**: Contact Medical Desk (Ext 140) indicating Sector and exact gate details.";
        } else {
          responseText = `Hello! This is StadiumMind AI's Volunteer Hub. I see you are asking about: "${message}". 

To unlock full interactive real-time translation and dynamically generated procedures, configure your **GEMINI_API_KEY** under **Settings > Secrets** in AI Studio! All local systems are currently online and fully prepared to support you.`;
        }
      } else {
        // Fan chatbot fallback
        if (msgLower.includes('gate 12') || msgLower.includes('gate')) {
          responseText = "Based on RAG data, **Gate D (West)** is less crowded with only a **4-minute** wait. **Gate B (East)** has an **8-minute** wait, while **Gate C** is highly congested (28 mins queue). If you are looking for Gate 12, enter through Gate B and walk clockwise.";
        } else if (msgLower.includes('wheelchair') || msgLower.includes('accessible') || msgLower.includes('handicap')) {
          responseText = "Our stadium offers world-class accessibility! **Gate D (West - Accessible)** is fully optimized with accessible entrance lanes, tactile pavings, and a dedicated ADA service desk. Elevators are directly adjacent to Gate D to take you up to Club levels.";
        } else if (msgLower.includes('metro') || msgLower.includes('transport') || msgLower.includes('bus')) {
          responseText = "We highly recommend the **Meadowlands Express (Line M4)** Metro! Post-match trains run every 3 minutes. Plus, claiming this option in your Fan panel earns you **120 Green Points** towards stadium rewards.";
        } else if (msgLower.includes('prohibited') || msgLower.includes('bag') || msgLower.includes('items')) {
          responseText = "Under standard FIFA 2026 regulations:\n\n- **Prohibited**: Weapons, glass bottles, umbrellas, selfie sticks, and banners larger than 2x1.5m.\n- **Bags**: Only clear plastic bags under 30x15x30cm are allowed inside.";
        } else if (msgLower.includes('food') || msgLower.includes('eat')) {
          responseText = "We recommend **Zero-Waste Greens & Wraps** at Concourse Sec 142 (waitTime: 5 mins, earns **40 Green Points**!) or **Tacos el Tri** at Concourse Sec 112 (waitTime: 20 mins, rating 4.8★).";
        } else {
          responseText = `Welcome to **StadiumMind AI**! I'm here to guide you around the World Cup 2026 Arena.

To activate real-time Gemini language translation in 50+ languages, smart path finding, and customized food suggestions, please configure your **GEMINI_API_KEY** in **Settings > Secrets**. I'm running on a high-fidelity local database in the meantime!`;
        }
      }

      res.json({ text: responseText });
    }
  });

  // ----------------------------------------------------
  // AI Insights and Analytics Generator (Executive Summary)
  // ----------------------------------------------------
  app.post('/api/gemini/insights', async (req, res) => {
    const dataSummary = {
      occupancy: database.crowdMetrics.currentOccupancy,
      capacity: database.stadium.capacity,
      activeIncidents: database.incidents.filter(i => i.status !== 'resolved').length,
      unassignedTasks: database.tasks.filter(t => t.assignedTo === 'Unassigned').length,
      gateCongestions: database.stadium.gates.map(g => `${g.name}: wait ${g.waitTimeMinutes}m, occ ${g.occupancy}%`).join(', ')
    };

    const prompt = `Generate an executive FIFA tournament operational report for the Stadium Control Room. 
    Metrics Summary:
    - Stadium Occupancy: ${dataSummary.occupancy} / ${dataSummary.capacity}
    - Gate Statuses: ${dataSummary.gateCongestions}
    - Active Incident Reports: ${dataSummary.activeIncidents}
    - Pending Volunteer Tasks: ${dataSummary.unassignedTasks}

    Please write a structured report with these exact sections:
    1. Operational Overview: A professional daily summary of stadium load.
    2. Peak Hours Congestion Prediction: Predict when bottlenecks will peak post-match and analyze risks.
    3. Crisis Mitigation & Volunteer Allocation: Specific recommendations for dispatching unassigned personnel.
    4. Sustainability & Transport Efficiency KPI: Outline how many fans opted for public/green transport today.
    
    Keep the layout modern, professional, scannable, and extremely polished. Use Markdown formatting.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            temperature: 0.6
          }
        });
        res.json({ text: response.text });
      } catch (err) {
        console.error("Failed to generate AI insights:", err);
        res.status(500).json({ error: "Failed to generate AI Insights report." });
      }
    } else {
      // Return beautiful structured simulation report
      const fallbackReport = `### 📋 Executive Tournament Operations Report — FIFA 2026

**1. Operational Overview**
The arena has handled a significant volume today with current attendance peaking at **${dataSummary.occupancy}** (${Math.round((dataSummary.occupancy/dataSummary.capacity)*100)}% capacity). Match operations remained highly stable despite crowd spikes. Gate wait times are averaging 15.5 minutes across all stands.

**2. Peak Hours Congestion Prediction**
- **Inbound bottleneck**: Solved via sequential Gate C/Gate B flow deflection.
- **Outbound peak (post-match)**: Scheduled to peak at **19:55**. Immediate deployment of transit lines (Line M4 Meadowlands Express running every 3 minutes) will mitigate rail-head congestion.
- **Critical Risk**: Sector 129 North stand is experiencing higher densities (94%); outbound flows should be deflected to West exits.

**3. Crisis Mitigation & Volunteer Allocation**
- Dispatch **unassigned volunteers** to **Sector 215 Concourse** to resolve the reported critical missing child task.
- Allocate secondary support to Concourse Sector 104 to manage food plaza spills and prevent pedestrian injury.

**4. Sustainability & Transport Efficiency KPI**
- **Public Transport Intake**: **72%** of arriving fans checked in using Meadowlands Metro or walking corridor.
- **Carbon Offsetting**: Offset **8,450 kg of CO2** compared to standard private vehicle attendance.
- **Gamification Engagement**: 4,200 fans successfully converted green transport tickets into eco-stadium food coupons.

*Note: This report is generated in local simulation mode. Configure GEMINI_API_KEY to retrieve dynamic operational assessments.*`;
      res.json({ text: fallbackReport });
    }
  });


  // ----------------------------------------------------
  // Vite Integration & Production Static Hosting
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware successfully mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static files from /dist in production mode.");
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StadiumMind AI Server running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
