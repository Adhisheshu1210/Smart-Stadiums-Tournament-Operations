import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Users, 
  Bus, 
  Leaf, 
  Clipboard, 
  AlertTriangle, 
  Accessibility, 
  Volume2, 
  VolumeX,
  Mic, 
  Search, 
  Send, 
  ShieldAlert, 
  User as UserIcon, 
  Smartphone, 
  Clock, 
  Activity, 
  FileText, 
  CheckCircle, 
  Award, 
  RefreshCw, 
  Tv, 
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Map as MapIcon,
  ShoppingBag,
  Bell,
  Check
} from 'lucide-react';
import { 
  Match, 
  Stadium, 
  CrowdMetrics, 
  TransportOption, 
  ParkingZone, 
  RestroomStatus, 
  FoodVendor, 
  Alert, 
  VolunteerTask, 
  IncidentReport, 
  ChatMessage,
  UserRole
} from './types';
import { EMERGENCY_GUIDES } from './data';
import { generateMockChatResponse } from './utils/navigation';


export default function App() {
  // Navigation & User Role State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserRole>('fan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Applet States (Fetched from Server)
  const [matches, setMatches] = useState<Match[]>([]);
  const [stadium, setStadium] = useState<Stadium | null>(null);
  const [crowdMetrics, setCrowdMetrics] = useState<CrowdMetrics | null>(null);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([]);
  const [restrooms, setRestrooms] = useState<RestroomStatus[]>([]);
  const [foodVendors, setFoodVendors] = useState<FoodVendor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [sustainabilityPoints, setSustainabilityPoints] = useState(1250);
  const [completedTasksCount, setCompletedTasksCount] = useState(3);

  // Interactive UI States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Accessibility & Multilingual
  const [highContrast, setHighContrast] = useState(false);
  const [largeFonts, setLargeFonts] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSignLanguageVideo, setShowSignLanguageVideo] = useState(false);

  // Chat/AI State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Welcome to StadiumMind AI! I'm your official FIFA World Cup 2026 Smart Stadium Intelligent Assistant. Ask me anything about Gate wait times, accessible routes, prohibited items, or food vendors.",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      suggestions: ["Where is Gate D?", "What items are prohibited?", "Find nearest eco-friendly food", "How do I reach the Metro?"]
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiResponding, setAiResponding] = useState(false);

  // Companion Chat State (For match analysis)
  const [matchChatMessages, setMatchChatMessages] = useState<ChatMessage[]>([
    {
      id: 'mc-1',
      sender: 'ai',
      text: "Welcome to the Live Match Companion! I have real-time stats for USA vs England. Ask me about historical stats, expected goals, or live squad tactics.",
      timestamp: '18:05',
      suggestions: ["Who scored the first goal?", "What is the expected goals (xG) ratio?", "Show team possession history"]
    }
  ]);
  const [matchChatInput, setMatchChatInput] = useState('');

  // Interactive Navigation/Map State
  const [selectedRouteType, setSelectedRouteType] = useState<'fastest' | 'accessible' | 'family' | 'emergency'>('fastest');
  const [mapSelectedSector, setMapSelectedSector] = useState<string | null>(null);
  const [simulatedDroneMode, setSimulatedDroneMode] = useState(false);

  // New Incident Form State
  const [newIncident, setNewIncident] = useState({
    title: '',
    type: 'medical' as IncidentReport['type'],
    location: '',
    description: '',
    priority: 'medium' as IncidentReport['priority'],
    reporterName: 'Supervisor Adhisheshu'
  });
  const [reportingIncident, setReportingIncident] = useState(false);

  // Executive AI Report Generator State
  const [insightsReport, setInsightsReport] = useState<string>('');
  const [generatingInsights, setGeneratingInsights] = useState(false);

  // Fetch all initial data
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [
        resMatches, 
        resStadium, 
        resCrowd, 
        resTransport, 
        resParking, 
        resRestrooms, 
        resFood, 
        resAlerts, 
        resTasks, 
        resIncidents
      ] = await Promise.all([
        fetch('/api/matches').then(r => r.json()),
        fetch('/api/stadium').then(r => r.json()),
        fetch('/api/crowd').then(r => r.json()),
        fetch('/api/transport').then(r => r.json()),
        fetch('/api/parking').then(r => r.json()),
        fetch('/api/restrooms').then(r => r.json()),
        fetch('/api/food').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/incidents').then(r => r.json()),
      ]);

      setMatches(resMatches);
      setStadium(resStadium);
      setCrowdMetrics(resCrowd);
      setTransportOptions(resTransport);
      setParkingZones(resParking);
      setRestrooms(resRestrooms);
      setFoodVendors(resFood);
      setAlerts(resAlerts);
      setTasks(resTasks);
      setIncidents(resIncidents);
    } catch (err) {
      console.error("Error fetching stadium data: ", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Start automated IoT data fetching simulation every 10 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle Refresh Action
  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  // Claim Eco Transport reward points
  const claimSustainabilityPoints = async (points: number, type: string) => {
    try {
      const res = await fetch('/api/sustainability/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, transportType: type })
      }).then(r => r.json());
      
      if (res.success) {
        setSustainabilityPoints(res.points);
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Claim Volunteer Task
  const claimTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, assignedTo: 'Adhisheshu' })
      }).then(r => r.json());

      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Complete Volunteer Task
  const completeTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId })
      }).then(r => r.json());

      if (res.success) {
        setTasks(res.tasks);
        setSustainabilityPoints(res.points);
        setCompletedTasksCount(res.completedCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Incident Report
  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.location || !newIncident.description) {
      alert("Please fill out all incident details.");
      return;
    }

    setReportingIncident(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncident)
      }).then(r => r.json());

      if (res.success) {
        setIncidents(res.incidents);
        setAlerts(res.alerts);
        setNewIncident({
          title: '',
          type: 'medical',
          location: '',
          description: '',
          priority: 'medium',
          reporterName: 'Supervisor Adhisheshu'
        });
        alert("Incident successfully submitted to FIFA Command Center. AI standard operating procedures (SOP) generated immediately.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportingIncident(false);
    }
  };

  // Generate Executive AI Report
  const generateExecutiveReport = async () => {
    setGeneratingInsights(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json());

      if (res.text) {
        setInsightsReport(res.text);
      } else if (res.error) {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingInsights(false);
    }
  };

  // Send message to LLM AI Assistant
  const handleSendChatMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setAiResponding(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatMessages.slice(-6), // Send last 6 messages as window
          role: userRole === 'volunteer' ? 'volunteer' : 'fan'
        })
      }).then(r => r.json());

      const responseText = res.text || generateMockChatResponse(textToSend, userRole === 'volunteer' ? 'volunteer' : 'fan');

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };

      setChatMessages(prev => [...prev, aiMsg]);

      // Speak response if Text-to-Speech is active
      if (speechEnabled) {
        const cleanText = responseText.replace(/[*#`_-]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = selectedLanguage === 'Spanish' ? 'es-ES' : 
                         selectedLanguage === 'French' ? 'fr-FR' : 
                         selectedLanguage === 'Arabic' ? 'ar-SA' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      console.error("Fetch failed, using local fallback:", err);
      const responseText = generateMockChatResponse(textToSend, userRole === 'volunteer' ? 'volunteer' : 'fan');
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setChatMessages(prev => [...prev, aiMsg]);

      // Speak response if Text-to-Speech is active
      if (speechEnabled) {
        const cleanText = responseText.replace(/[*#`_-]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = selectedLanguage === 'Spanish' ? 'es-ES' : 
                         selectedLanguage === 'French' ? 'fr-FR' : 
                         selectedLanguage === 'Arabic' ? 'ar-SA' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setAiResponding(false);
    }
  };

  // Voice inputs simulated for Iframe compatibility & hands-free accessibility
  const handleSimulatedMicInput = () => {
    setMicActive(true);
    setTimeout(() => {
      setMicActive(false);
      const randomPrompts = [
        "Where is Gate D?",
        "Find nearest wheelchair washrooms",
        "How to report an incident?",
        "What is the shortest path to metro line M4?"
      ];
      const selected = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
      setChatInput(selected);
    }, 2000);
  };

  // Match Companion live chat companion
  const handleSendMatchChatMessage = async (customText?: string) => {
    const textToSend = customText || matchChatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `mc-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: '18:16'
    };

    setMatchChatMessages(prev => [...prev, userMsg]);
    if (!customText) setMatchChatInput('');

    // Generate a contextual companion answer based on simple matches schema or Gemini API
    setTimeout(() => {
      let answerText = "";
      const textLower = textToSend.toLowerCase();

      if (textLower.includes('xg') || textLower.includes('expected goals')) {
        answerText = "The Expected Goals (xG) is currently **1.85 for USA** vs **1.45 for England**, reflecting the USA's higher-quality box opportunities, primarily generated via Christian Pulisic.";
      } else if (textLower.includes('possession')) {
        answerText = "Current possession is **48% for USA** and **52% for England**. Despite England holding the ball more in build-up, USA is extremely dangerous on quick transitions.";
      } else if (textLower.includes('who scored') || textLower.includes('goal')) {
        answerText = "First, **Christian Pulisic** scored for USA in the 14th minute. England's captain **Harry Kane** equalized in the 58th minute with a stunning header. Then **Folarin Balogun** retook the lead for USA in the 72nd minute.";
      } else if (textLower.includes('trivia') || textLower.includes('history')) {
        answerText = "Did you know? The USA and England have played each other three times in World Cup history. USA won 1-0 in 1950, drew 1-1 in 2010, and drew 0-0 in 2022. USA remains undefeated against England at World Cups!";
      } else {
        answerText = "Currently, USA has 12 shots compared to England's 14. Tactically, England is utilizing an overlapping 4-3-3 formation while USA is dropping deep in a compact 4-4-2 defensive block.";
      }

      setMatchChatMessages(prev => [...prev, {
        id: `mc-ai-${Date.now()}`,
        sender: 'ai',
        text: answerText,
        timestamp: '18:16'
      }]);
    }, 1000);
  };

  // Helper translations for high-fidelity multi-lingual toggle
  const getLanguageTranslationText = () => {
    const translations: Record<string, string> = {
      English: "Fifa World Cup Smart Assistant Online",
      Spanish: "Asistente Inteligente de la Copa Mundial en Línea",
      French: "Assistant Intelligent de la Coupe du Monde en Ligne",
      Arabic: "مساعد كأس العالم الذكي متصل بالإنترنت",
      Portuguese: "Assistente Inteligente da Copa do Mundo Online",
      Hindi: "फीफा विश्व कप स्मार्ट सहायक ऑनलाइन",
      Japanese: "FIFAワールドカップ スマートアシスタント オンライン",
      Chinese: "国际足联世界杯智能助手在线",
      German: "FIFA-Weltmeisterschaft Intelligenter Assistent Online",
      Italian: "Assistente intelligente della Coppa del Mondo FIFA online"
    };
    return translations[selectedLanguage] || translations['English'];
  };

  const activeMatch = matches.find(m => m.status === 'live') || matches[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020813] text-slate-100 flex flex-col items-center justify-center font-sans p-6" role="status" aria-live="polite">
        <div className="text-center space-y-6 max-w-md w-full">
          {/* Animated pulsing stadium logo container */}
          <div className="relative inline-flex p-5 bg-gradient-to-tr from-slate-900 to-[#00E5FF]/20 rounded-3xl border border-[#00E5FF]/30 shadow-2xl shadow-[#00E5FF]/10 animate-pulse">
            <Activity className="h-12 w-12 text-[#00E5FF]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl tracking-wider text-white">StadiumMind AI</h1>
            <p className="text-xs text-[#00E5FF] font-mono uppercase tracking-widest font-semibold">FIFA 2026 Smart Stadium Platform</p>
          </div>

          {/* Skeleton loading bars */}
          <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="h-3 w-1/3 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-3.5 w-12 bg-slate-800 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2 pt-1.5">
              <div className="h-2 w-full bg-slate-800 rounded animate-pulse"></div>
              <div className="h-2 w-5/6 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-2 w-4/6 bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 font-mono">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
            <span>Booting live IoT telemetry feed...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#020813] text-slate-100 flex flex-col font-sans selection:bg-brand-accent selection:text-slate-900 transition-colors duration-300 ${highContrast ? 'contrast-125 saturate-150' : ''} ${largeFonts ? 'text-lg' : 'text-sm'}`}>
      
      {/* Skip link for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Smart Alert Notification Ticker */}
      {alerts.length > 0 && (
        <div className="bg-[#0c1a30] border-b border-rose-500/30 text-rose-200 py-2.5 px-4 overflow-hidden relative" id="alert-banner">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span className="font-mono text-xs text-rose-400 font-semibold uppercase tracking-wider">[Live Alert]</span>
              <span className="text-sm font-medium truncate">{alerts[0].title}: {alerts[0].message}</span>
            </div>
            <button 
              onClick={() => setActiveTab('emergency')}
              className="text-xs font-mono font-bold text-rose-400 hover:text-rose-300 underline uppercase tracking-wider flex-shrink-0 ml-4 cursor-pointer"
            >
              Action Plan SOP &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 shadow-2xl px-4 py-3" id="main-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative p-2 bg-gradient-to-tr from-brand-blue to-[#00E5FF]/20 rounded-xl border border-[#00E5FF]/30 shadow-lg shadow-brand-accent/5">
              <Activity className="h-6 w-6 text-[#00E5FF] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-lg tracking-wider text-white">StadiumMind AI</h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-green/10 border border-brand-green/20 text-brand-green uppercase font-semibold">FIFA '26 SOP</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide">Smart Stadium & Tournament Control Engine</p>
            </div>
          </div>

          {/* Quick Stats Live Display (World Cup Match Mini Panel) */}
          {activeMatch && (
            <div className="hidden md:flex items-center bg-slate-900/60 border border-white/5 rounded-2xl px-4 py-1.5 space-x-3 text-xs" id="match-scorebar">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-300 font-mono text-[10px] tracking-widest uppercase">LIVE MATCH</span>
              <span className="font-display font-medium text-slate-200 flex items-center space-x-1.5">
                <span>{activeMatch.teamAFlag}</span>
                <span className="font-semibold">{activeMatch.teamA}</span>
                <span className="font-mono text-brand-accent bg-[#00E5FF]/10 px-2 py-0.5 rounded font-bold mx-1">
                  {activeMatch.score?.teamA} - {activeMatch.score?.teamB}
                </span>
                <span className="font-semibold">{activeMatch.teamB}</span>
                <span>{activeMatch.teamBFlag}</span>
              </span>
              <span className="text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">74'</span>
            </div>
          )}

          {/* Accessibility, Language, and Role Switch Controllers */}
          <div className="flex items-center space-x-2">
            
            {/* Live Mode/Role Selector */}
            <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/5 space-x-1">
              <button 
                onClick={() => { setUserRole('fan'); setActiveTab('overview'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${userRole === 'fan' ? 'bg-[#00E5FF]/15 text-[#00E5FF] shadow-inner font-semibold border border-[#00E5FF]/20' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Fan Hub
              </button>
              <button 
                onClick={() => { setUserRole('volunteer'); setActiveTab('volunteer'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${userRole === 'volunteer' ? 'bg-brand-green/15 text-brand-green shadow-inner font-semibold border border-brand-green/20' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Volunteer Desk
              </button>
              <button 
                onClick={() => { setUserRole('organizer'); setActiveTab('overview'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${userRole === 'organizer' ? 'bg-purple-500/15 text-purple-400 shadow-inner font-semibold border border-purple-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              >
                FIFA Command
              </button>
            </div>

            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-900 border border-white/10 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl outline-none focus:border-[#00E5FF]/50 cursor-pointer"
              id="language-select"
            >
              <option value="English">🇬🇧 EN</option>
              <option value="Spanish">🇪🇸 ES</option>
              <option value="French">🇫🇷 FR</option>
              <option value="Arabic">🇸🇦 AR</option>
              <option value="Portuguese">🇵🇹 PT</option>
              <option value="Hindi">🇮🇳 HI</option>
              <option value="Japanese">🇯🇵 JA</option>
              <option value="Chinese">🇨🇳 ZH</option>
              <option value="German">🇩🇪 DE</option>
              <option value="Italian">🇮🇹 IT</option>
            </select>

            {/* Accessibility Panel Quick Toggle */}
            <button
              onClick={() => {
                setHighContrast(!highContrast);
              }}
              title="Toggle High Contrast Mode"
              className={`p-2 rounded-xl border transition-all cursor-pointer ${highContrast ? 'bg-[#00E5FF] border-[#00E5FF] text-slate-900' : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'}`}
              id="high-contrast-btn"
            >
              <Accessibility className="h-4 w-4" />
            </button>

            {/* Large Font Toggle */}
            <button
              onClick={() => {
                setLargeFonts(!largeFonts);
              }}
              title="Toggle Larger Text"
              className={`p-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${largeFonts ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'}`}
              id="large-text-btn"
            >
              A+
            </button>

            {/* Manual Refresh button */}
            <button
              onClick={handleManualRefresh}
              className="p-2 bg-slate-900 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              disabled={refreshing}
              title="Refresh Simulated Arena Data"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-[#00E5FF]' : ''}`} />
            </button>

            {/* Hamburger menu for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-900 border border-white/10 text-slate-300 rounded-xl"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Role Switcher Bar */}
      <div className="lg:hidden flex justify-around bg-[#071123] border-b border-white/5 py-2 px-4 gap-2">
        <button 
          onClick={() => { setUserRole('fan'); setActiveTab('overview'); }}
          className={`flex-1 py-1 rounded text-center text-xs font-semibold cursor-pointer ${userRole === 'fan' ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20' : 'text-slate-400'}`}
        >
          Fan Hub
        </button>
        <button 
          onClick={() => { setUserRole('volunteer'); setActiveTab('volunteer'); }}
          className={`flex-1 py-1 rounded text-center text-xs font-semibold cursor-pointer ${userRole === 'volunteer' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' : 'text-slate-400'}`}
        >
          Volunteer Desk
        </button>
        <button 
          onClick={() => { setUserRole('organizer'); setActiveTab('overview'); }}
          className={`flex-1 py-1 rounded text-center text-xs font-semibold cursor-pointer ${userRole === 'organizer' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-slate-400'}`}
        >
          FIFA Control
        </button>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row relative">

        {/* Dynamic Sidebar / Menu Navigation */}
        <nav className={`lg:w-64 glass-panel lg:border-r border-white/5 p-4 shrink-0 transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`} id="side-nav">
          <div className="space-y-6">
            
            {/* Active User Information Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#091833] to-slate-950 border border-[#00E5FF]/15">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center font-mono font-bold text-sm text-[#00E5FF]">
                  {userRole === 'fan' ? '🏆' : userRole === 'volunteer' ? '🤝' : '💻'}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">
                    {userRole === 'fan' ? 'Adhisheshu (Fan)' : userRole === 'volunteer' ? 'Adhisheshu (Volunteer)' : 'Adhisheshu (FIFA)'}
                  </h4>
                  <p className="text-[10px] text-[#00E5FF] uppercase tracking-wider font-mono font-bold mt-0.5">
                    {userRole === 'fan' ? `${sustainabilityPoints} PTS` : userRole === 'volunteer' ? `${completedTasksCount} Completed` : 'Lead Command'}
                  </p>
                </div>
              </div>

              {userRole === 'fan' && (
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Green Status:</span>
                  <span className="text-brand-green font-semibold flex items-center gap-1">
                    <Award className="h-3 w-3" /> Gold Level
                  </span>
                </div>
              )}
            </div>

            {/* Menu Grouping */}
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2">Primary Operations</p>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                  aria-label="Navigate to Interactive Map & Digital Twin Overview"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border-l-4 border-l-[#00E5FF]' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <Compass className="h-4 w-4 text-[#00E5FF]" />
                  <span>Interactive Map & Twin</span>
                </button>
                <button
                  onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                  aria-label="Navigate to AI Assistant Chatbot"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border-l-4 border-l-[#00E5FF]' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span>AI Assistant Chat</span>
                </button>
                <button
                  onClick={() => { setActiveTab('transport'); setMobileMenuOpen(false); }}
                  aria-label="Navigate to Transportation and Sustainability Hub"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'transport' ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border-l-4 border-l-[#00E5FF]' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <Bus className="h-4 w-4 text-emerald-400" />
                  <span>Transit & Green Hub</span>
                </button>
                <button
                  onClick={() => { setActiveTab('match'); setMobileMenuOpen(false); }}
                  aria-label="Navigate to Match Companion AI Panel"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'match' ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border-l-4 border-l-[#00E5FF]' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <Tv className="h-4 w-4 text-amber-400" />
                  <span>Match Companion AI</span>
                </button>
              </div>
            </div>

            {/* Special Roles Specific Sub-Menus */}
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2">Control & Safety</p>
              <div className="space-y-1">
                {userRole === 'volunteer' && (
                  <button
                    onClick={() => { setActiveTab('volunteer'); setMobileMenuOpen(false); }}
                    aria-label="Navigate to Volunteer Tasks List"
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'volunteer' ? 'bg-brand-green/10 text-brand-green font-semibold border-l-4 border-l-brand-green' : 'text-slate-300 hover:bg-white/5'}`}
                  >
                    <Clipboard className="h-4 w-4 text-brand-green" />
                    <span>Volunteer Tasks</span>
                  </button>
                )}
                <button
                  onClick={() => { setActiveTab('emergency'); setMobileMenuOpen(false); }}
                  aria-label="Navigate to Emergency SOP and Intelligence Panel"
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'emergency' ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border-l-4 border-l-[#00E5FF]' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span>Emergency Intelligence</span>
                </button>
                {userRole === 'organizer' && (
                  <button
                    onClick={() => { setActiveTab('insights'); setMobileMenuOpen(false); }}
                    aria-label="Navigate to AI Insights Executive Report Dashboard"
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${activeTab === 'insights' ? 'bg-purple-500/10 text-purple-400 font-semibold border-l-4 border-l-purple-500' : 'text-slate-300 hover:bg-white/5'}`}
                  >
                    <FileText className="h-4 w-4 text-purple-400" />
                    <span>AI Insights Executive</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Informational Guide Links */}
            <div className="pt-6 border-t border-white/5 text-[11px] text-slate-400 font-mono space-y-2 px-3">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green"></span>
                <span>50+ Languages Auto-Detect</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]"></span>
                <span>Active RAG Knowledge Base</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <span>IoT Sensor Telemetry: Live</span>
              </div>
            </div>

          </div>
        </nav>

        {/* Main Application Feed Panel */}
        <main id="main-content" tabIndex={-1} className="outline-none flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
          
          {/* Welcome translation header (Dynamic multilingual support indicator) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#071123] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-brand-green text-xs font-mono font-semibold">
                <Sparkles className="h-3 w-3" />
                <span>MULTILINGUAL ENGINE DETECTED: {selectedLanguage.toUpperCase()}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 font-display">
                {getLanguageTranslationText()}
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-white/10 shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">Current Arena Time:</span>
              <span className="text-[10px] text-brand-accent font-mono font-semibold">18:14:52 EDT</span>
            </div>
          </div>

          {/* Tab 1: OVERVIEW & DIGITAL TWIN & INTERACTIVE MAP */}
          {activeTab === 'overview' && (
            <div className="space-y-6" id="overview-tab">
              
              {/* Row 1: Crowd Stats Overview Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-slate-700">
                    <Users className="h-10 w-10 text-[#00E5FF]/10" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Stadium Attendance</p>
                  <p className="text-2xl font-bold font-display text-white mt-2">
                    {crowdMetrics ? crowdMetrics.currentOccupancy.toLocaleString() : '76,420'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">&bull; {stadium ? Math.round((crowdMetrics?.currentOccupancy || 76420) / stadium.capacity * 100) : 92}% Capacity</span>
                    <span>({stadium ? stadium.capacity.toLocaleString() : '82,500'} Max)</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-slate-700">
                    <Clock className="h-10 w-10 text-rose-500/10" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Security Wait Time</p>
                  <p className="text-2xl font-bold font-display text-rose-400 mt-2">
                    {crowdMetrics ? `${crowdMetrics.queueTimes.security} Min` : '18 Min'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                    <span className="text-rose-400 font-semibold font-mono">Critical Congestion Zone:</span>
                    <span>Gate C</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-slate-700">
                    <Leaf className="h-10 w-10 text-brand-green/10" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Green Transport Intake</p>
                  <p className="text-2xl font-bold font-display text-brand-green mt-2">72%</p>
                  <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                    <TrendingUp className="h-3 w-3 text-brand-green" />
                    <span className="text-brand-green">Saved 8,450 kg CO2 today</span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-slate-700">
                    <AlertTriangle className="h-10 w-10 text-amber-500/10" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Active Incident Alerts</p>
                  <p className="text-2xl font-bold font-display text-amber-400 mt-2">
                    {incidents.filter(i => i.status !== 'resolved').length}
                  </p>
                  <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                    <span className="text-amber-400 font-semibold">&bull; {incidents.filter(i => i.priority === 'critical').length} Critical</span>
                    <span>SOP generated</span>
                  </div>
                </div>

              </div>

              {/* Row 2: Digital Twin 3D Visualization Canvas & Sector Selector Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 3D Digital Twin Simulation Screen (Left 7-columns) */}
                <div className="lg:col-span-8 glass-card p-5 rounded-3xl border border-white/5 flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                        <Layers className="h-5 w-5 text-[#00E5FF]" />
                        <span>Interactive Digital Twin: 3D Arena Flow</span>
                      </h3>
                      <p className="text-xs text-slate-400">Interact with sectors to inspect queuing rates, live occupancy & evacuation pathways.</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSimulatedDroneMode(!simulatedDroneMode)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${simulatedDroneMode ? 'bg-amber-500/25 border-amber-500 text-amber-300 font-bold' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                        title="Simulate Drone CCTV Crowding Telemetry"
                      >
                        🚁 Drone View: {simulatedDroneMode ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {/* High fidelity interactive Vector Stadium Simulation Graphic */}
                  <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[350px]">
                    
                    {/* Floating map legend overlays */}
                    <div className="absolute top-4 left-4 bg-slate-900/90 border border-white/10 p-3 rounded-xl space-y-2 text-[10px] font-mono z-10">
                      <p className="text-xs font-bold text-white mb-1 border-b border-white/5 pb-1">Density Index</p>
                      <div className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded bg-rose-600 inline-block border border-rose-400"></span>
                        <span>90%+ Congested</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded bg-amber-500 inline-block border border-amber-300"></span>
                        <span>60%-89% Moderate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded bg-emerald-500 inline-block border border-emerald-300"></span>
                        <span>&lt;60% Clear / Safe</span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-slate-900/90 border border-white/10 p-3 rounded-xl text-[10px] font-mono space-y-2 z-10">
                      <p className="text-xs font-bold text-white mb-1 border-b border-white/5 pb-1">AI Smart Paths</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-1 border-b-2 border-dashed border-[#00E5FF]"></div>
                        <span>{selectedRouteType.toUpperCase()} Route</span>
                      </div>
                    </div>

                    {/* Simulation Drone Camera Scan Lines overlay */}
                    {simulatedDroneMode && (
                      <div className="absolute inset-0 border border-amber-500/30 bg-amber-500/[0.02] pointer-events-none rounded-2xl flex flex-col justify-between p-2 z-10">
                        <div className="flex justify-between text-[8px] font-mono text-amber-500 font-bold">
                          <span>[DRONE FEED #FIFA-26]</span>
                          <span>ALT: 124m - AUTO SCANNING</span>
                        </div>
                        <div className="w-full h-0.5 bg-amber-500/40 animate-bounce"></div>
                        <div className="text-[8px] font-mono text-amber-500 text-right font-bold">
                          LAT: 40.8135&deg; N, LON: 74.0744&deg; W
                        </div>
                      </div>
                    )}

                    {/* Beautiful SVG Interactive Stadium Map */}
                    <svg viewBox="0 0 400 320" className="w-full max-w-[360px] h-auto drop-shadow-2xl">
                      
                      {/* Outer Background Glow */}
                      <circle cx="200" cy="160" r="150" fill="none" stroke="rgba(0, 229, 255, 0.03)" strokeWidth="8" />

                      {/* STADIUM BOWL SECTORS */}
                      {/* North Stand Sector */}
                      <path 
                        d="M 120 40 Q 200 15 280 40 L 260 70 Q 200 50 140 70 Z" 
                        fill={mapSelectedSector === 'North' ? 'rgba(239, 68, 68, 0.75)' : 'rgba(239, 68, 68, 0.45)'}
                        stroke="#ef4444" 
                        strokeWidth={mapSelectedSector === 'North' ? '2' : '1'}
                        className="cursor-pointer transition-all duration-200 hover:fill-rose-500/60"
                        onClick={() => setMapSelectedSector('North')}
                      />
                      <text x="200" y="52" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono">NORTH SECTOR (88%)</text>

                      {/* East Stand Plaza */}
                      <path 
                        d="M 280 40 Q 380 160 280 280 L 260 250 Q 330 160 260 70 Z" 
                        fill={mapSelectedSector === 'East' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(245, 158, 11, 0.3)'}
                        stroke="#f59e0b" 
                        strokeWidth={mapSelectedSector === 'East' ? '2' : '1'}
                        className="cursor-pointer transition-all duration-200 hover:fill-amber-500/60"
                        onClick={() => setMapSelectedSector('East')}
                      />
                      <text x="300" y="165" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono" transform="rotate(90 300 165)">EAST PLAZA (45%)</text>

                      {/* South Curve Stand */}
                      <path 
                        d="M 120 280 Q 200 305 280 280 L 260 250 Q 200 270 140 250 Z" 
                        fill={mapSelectedSector === 'South' ? 'rgba(220, 38, 38, 0.8)' : 'rgba(220, 38, 38, 0.45)'}
                        stroke="#ef4444" 
                        strokeWidth={mapSelectedSector === 'South' ? '2' : '1'}
                        className="cursor-pointer transition-all duration-200 hover:fill-rose-600/60"
                        onClick={() => setMapSelectedSector('South')}
                      />
                      <text x="200" y="275" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono">SOUTH CURVE (94%)</text>

                      {/* West Stand Sector */}
                      <path 
                        d="M 120 40 Q 20 160 120 280 L 140 250 Q 70 160 140 70 Z" 
                        fill={mapSelectedSector === 'West' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.3)'}
                        stroke="#10b981" 
                        strokeWidth={mapSelectedSector === 'West' ? '2' : '1'}
                        className="cursor-pointer transition-all duration-200 hover:fill-emerald-500/60"
                        onClick={() => setMapSelectedSector('West')}
                      />
                      <text x="100" y="165" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono" transform="rotate(-90 100 165)">WEST STAND (62%)</text>

                      {/* Central Pitch Representation */}
                      <rect x="145" y="105" width="110" height="110" rx="10" fill="#041530" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="2" />
                      <circle cx="200" cy="160" r="25" fill="none" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />
                      <line x1="145" y1="160" x2="255" y2="160" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1.5" />
                      <text x="200" y="163" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-widest text-slate-400">PITCH</text>

                      {/* INTERACTIVE NAVIGATION PATH TRAILS OVERLAY */}
                      {selectedRouteType === 'fastest' && (
                        <path d="M 200 290 Q 290 280 270 75" fill="none" stroke="#00E5FF" strokeWidth="3.5" strokeDasharray="4 3" className="animate-pulse-ring" />
                      )}
                      {selectedRouteType === 'accessible' && (
                        <path d="M 110 270 L 130 80" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="6 3" />
                      )}
                      {selectedRouteType === 'family' && (
                        <path d="M 280 75 Q 240 60 140 80" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="5 3" />
                      )}
                      {selectedRouteType === 'emergency' && (
                        <path d="M 200 160 L 200 25 M 200 160 L 300 165" fill="none" stroke="#ef4444" strokeWidth="4" />
                      )}

                      {/* GATES DOTS */}
                      {/* Gate A North */}
                      <circle cx="200" cy="30" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="200" cy="30" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="200" y="21" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">GATE A</text>

                      {/* Gate B East */}
                      <circle cx="350" cy="160" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                      <text x="355" y="148" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="start" className="font-mono">GATE B</text>

                      {/* Gate C South */}
                      <circle cx="200" cy="290" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="200" cy="290" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      <text x="200" y="303" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">GATE C</text>

                      {/* Gate D West - Accessible */}
                      <circle cx="50" cy="160" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                      <text x="45" y="148" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono">GATE D♿</text>

                    </svg>

                    {/* Dynamic Evacuation instructions panel */}
                    <div className="w-full mt-4 bg-slate-900/90 border border-white/10 p-3.5 rounded-xl">
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-slate-400">Pathfinder Logic Output:</span>
                        <span className="text-brand-accent font-semibold flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5" /> AI Recommended
                        </span>
                      </div>
                      
                      {selectedRouteType === 'fastest' && (
                        <p className="text-xs text-slate-200">
                          <strong>Fastest Path:</strong> Enter via <strong>Gate B (East)</strong> (8m wait). Proceed clockwise through Sector 116. Avoid Gate C due to security hold-up.
                        </p>
                      )}
                      {selectedRouteType === 'accessible' && (
                        <p className="text-xs text-slate-200">
                          <strong>Accessible Path ♿:</strong> Recommended <strong>Gate D (West)</strong> (4m wait). Level entrance corridors with tactile paving. Elevator lift accessible near Sector 104 lobby.
                        </p>
                      )}
                      {selectedRouteType === 'family' && (
                        <p className="text-xs text-slate-200">
                          <strong>Family Path:</strong> Enter via <strong>Gate B</strong>. Highly spacious lane. Restrooms and baby changing lounge are located nearby in Sector 208.
                        </p>
                      )}
                      {selectedRouteType === 'emergency' && (
                        <p className="text-xs text-rose-300 font-bold animate-pulse">
                          🚨 EMERGENCY ACTION PROTOCOL ACTIVE: All fans steer clear of South curve. Evacuate immediately via North Gate A or West Gate D. Ramps unlocked.
                        </p>
                      )}
                    </div>

                  </div>

                </div>

                {/* Live Sensors & Metrics Sidebar Panel (Right 4-columns) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Map Selector details box */}
                  <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                      <MapIcon className="h-4 w-4 text-emerald-400" />
                      <span>Route Recommendation Planner</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setSelectedRouteType('fastest')}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${selectedRouteType === 'fastest' ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        <p className="font-bold">⚡ Fastest Path</p>
                        <p className="text-[10px] opacity-80 mt-0.5">8m wait corridor</p>
                      </button>
                      <button 
                        onClick={() => setSelectedRouteType('accessible')}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${selectedRouteType === 'accessible' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        <p className="font-bold">♿ Accessible</p>
                        <p className="text-[10px] opacity-80 mt-0.5">Tactile, wide ramps</p>
                      </button>
                      <button 
                        onClick={() => setSelectedRouteType('family')}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${selectedRouteType === 'family' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        <p className="font-bold">👪 Family Path</p>
                        <p className="text-[10px] opacity-80 mt-0.5">Quiet zone, play plazas</p>
                      </button>
                      <button 
                        onClick={() => setSelectedRouteType('emergency')}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${selectedRouteType === 'emergency' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'}`}
                      >
                        <p className="font-bold">🚨 Emergency Exit</p>
                        <p className="text-[10px] opacity-80 mt-0.5">Direct fire pathways</p>
                      </button>
                    </div>
                  </div>

                  {/* Gate Status IoT Monitor */}
                  <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                        <Users className="h-4 w-4 text-brand-green" />
                        <span>IoT Gate Crowding Index</span>
                      </h3>
                      <span className="text-[9px] font-mono bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded uppercase font-semibold">Live</span>
                    </div>

                    <div className="space-y-2.5">
                      {stadium?.gates.map(gate => {
                        const isCongested = gate.occupancy > 80;
                        return (
                          <div key={gate.id} className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                                {gate.name} {gate.accessibilityFriendly && <span title="Fully wheelchair friendly">♿</span>}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400">Queue Time:</span>
                                <span className={`text-[10px] font-bold ${isCongested ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  {gate.waitTimeMinutes} Min
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isCongested ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                                {gate.occupancy}% occupancy
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Restroom Wait-Time Tracker */}
                  <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3">
                    <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-violet-400" />
                      <span>Restroom Queue Monitor</span>
                    </h3>

                    <div className="space-y-2">
                      {restrooms.slice(0, 3).map(r => (
                        <div key={r.id} className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-slate-200">
                              {r.location} <span className="text-slate-400">({r.gender})</span>
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {r.accessible ? '♿ Accessible' : 'Standard'} &bull; {r.isClean ? '✨ Cleaned' : '🔧 Maintenance Dispatched'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-bold ${r.waitTimeMinutes > 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {r.waitTimeMinutes}m wait
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Fan personalization recommendation food feed */}
              <div className="glass-card p-5 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-amber-400" />
                      <span>AI Personalized Fan Recommendations</span>
                    </h3>
                    <p className="text-xs text-slate-400">Based on your Gold Green rank and short restroom queues near Sector 112.</p>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-full font-bold">15% Reward Discount Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {foodVendors.map(vendor => (
                    <div key={vendor.id} className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-slate-400">{vendor.cuisine}</span>
                          <span className="text-[11px] text-amber-400 font-bold">★ {vendor.rating}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-100">{vendor.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Popular: <span className="text-slate-200">{vendor.popularItem}</span></p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400">Wait Time</p>
                          <p className="text-xs font-bold text-emerald-400">{vendor.waitTimeMinutes} mins</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Green Reward</p>
                          <p className="text-xs font-bold text-brand-green font-mono">+{vendor.sustainabilityRewardPoints} pts</p>
                        </div>
                      </div>

                      {vendor.seatDelivery && (
                        <div className="mt-3 bg-brand-green/10 border border-brand-green/20 rounded-lg p-1.5 text-center text-[10px] font-semibold text-brand-green">
                          ⚡ Express Seat Delivery Available
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: AI ASSISTANT CHAT WITH SPEECH AND RAG */}
          {activeTab === 'chat' && (
            <div className="glass-card p-5 rounded-3xl border border-white/5 flex flex-col h-[650px]" id="chat-tab">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-gradient-to-tr from-[#00E5FF]/20 to-violet-500/20 rounded-xl border border-[#00E5FF]/30">
                    <Sparkles className="h-5 w-5 text-[#00E5FF] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                      <span>RAG AI Stadium Assistant</span>
                    </h3>
                    <p className="text-xs text-slate-400">Ask about layouts, regulations, transport schedules, accessibility or safety protocols.</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Speech Switch toggle */}
                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${speechEnabled ? 'bg-brand-green/10 border-brand-green text-brand-green font-semibold' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                    title="Toggle Text-to-Speech Output"
                  >
                    {speechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    <span>TTS: {speechEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <button 
                    onClick={() => setShowSignLanguageVideo(!showSignLanguageVideo)}
                    className="text-xs font-mono px-3 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded-xl"
                  >
                    👋 Live Sign Language Video
                  </button>
                </div>
              </div>

              {/* Sign Language Video Simulation Frame */}
              {showSignLanguageVideo && (
                <div className="mb-4 bg-slate-950 p-3 rounded-2xl border border-[#00E5FF]/20 flex flex-col items-center justify-center">
                  <div className="w-full flex justify-between items-center text-xs font-mono text-[#00E5FF] mb-2">
                    <span>[ACCESSIBILITY CHANNEL: LIVE COMMENTARY DEAF SIGN INTERPRETER]</span>
                    <button onClick={() => setShowSignLanguageVideo(false)} className="hover:text-rose-400 font-bold">&times; Close</button>
                  </div>
                  <div className="w-full max-w-sm aspect-video bg-indigo-950/80 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <span className="absolute top-2 left-2 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">Live Video</span>
                    {/* Simulated Sign language silhouette loop */}
                    <div className="text-center space-y-2">
                      <div className="h-16 w-16 bg-brand-green/20 rounded-full mx-auto flex items-center justify-center border border-brand-green/30 animate-pulse">
                        👋
                      </div>
                      <p className="text-[10px] text-slate-300 font-semibold uppercase">Transmitting International Sign Language Feed</p>
                      <p className="text-[9px] text-slate-400 font-mono">Simulating real-time AI hand-skeleton gestures mapping...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-slate-950/50 rounded-2xl border border-white/5 mb-4 max-h-[420px]">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#00E5FF]/15 text-slate-100 border border-[#00E5FF]/25' 
                        : 'bg-slate-900 text-slate-200 border border-white/5 shadow-lg'
                    }`}>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mb-1.5 justify-between">
                        <span className="font-semibold uppercase tracking-wider">{msg.sender === 'user' ? 'You' : 'StadiumMind AI'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      
                      {/* Markdown formatted styled display */}
                      <div className="whitespace-pre-line space-y-1 text-slate-100 font-sans">
                        {msg.text}
                      </div>

                      {/* AI Quick suggestion buttons */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {msg.suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendChatMessage(s)}
                              className="text-[10px] bg-slate-950 border border-white/10 hover:border-[#00E5FF]/50 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {aiResponding && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 max-w-[80%] flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                      </span>
                      <span>FIFA AI is analyzing RAG database & policies...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input controls */}
              <div className="flex items-center space-x-2 bg-slate-950/80 p-2 rounded-2xl border border-white/10">
                <input
                  type="text"
                  placeholder="Ask any stadium, safety, lost-and-found or route question..."
                  aria-label="Ask any stadium, safety, lost-and-found or route question"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  className="flex-1 bg-transparent border-none text-slate-200 text-xs px-3 py-2 outline-none"
                />

                <button
                  onClick={handleSimulatedMicInput}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${micActive ? 'bg-rose-500 border-rose-500 text-white animate-pulse' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'}`}
                  title="Simulate Voice Speech-to-Text Input"
                  aria-label="Simulate Voice Speech-to-Text Input"
                >
                  <Mic className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleSendChatMessage()}
                  aria-label="Send message"
                  className="p-2.5 bg-[#00E5FF] hover:bg-[#00c8e0] text-slate-900 font-bold rounded-xl transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

            </div>
          )}

          {/* Tab 3: TRANSPORTATION & SUSTAINABILITY ECO HUB */}
          {activeTab === 'transport' && (
            <div className="space-y-6" id="transport-tab">
              
              {/* Sustainability Gamification Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#031c26] to-[#041530] border border-brand-green/20 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <Leaf className="h-48 w-48 text-brand-green" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-semibold mb-3">
                      <Leaf className="h-3.5 w-3.5" />
                      <span>Sustainability & Eco Gamification Tracker</span>
                    </div>
                    <h2 className="text-2xl font-bold font-display text-white">Earn Rewards for Low-Carbon Transit</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      FIFA 2026 commits to zero-waste, eco-conscious tournament operations. Log your eco-friendly travel ticket, EV charging status, or local walking route to instantly earn redeemable food court points.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-brand-green/30 text-center shrink-0 min-w-[180px]">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Your Eco Points Balance</p>
                    <p className="text-3xl font-bold font-mono text-brand-green mt-1">{sustainabilityPoints}</p>
                    <span className="text-[10px] text-[#00E5FF] font-semibold tracking-wider font-mono">🏆 GOLD MEDAL STATUS</span>
                  </div>
                </div>
              </div>

              {/* Transit Recommendations and EV Map Zone */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recommeded Public Transit option (Left 7-columns) */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                    <Bus className="h-5 w-5 text-emerald-400" />
                    <span>AI Recommended Outbound Transit Routes</span>
                  </h3>

                  <div className="space-y-3">
                    {transportOptions.map((opt, index) => (
                      <div key={index} className={`p-4 bg-slate-950 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${opt.recommended ? 'border-brand-green/40 shadow-lg shadow-brand-green/5' : 'border-white/5'}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2.5 rounded-xl border font-bold text-sm ${opt.type === 'metro' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : opt.type === 'bus' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : opt.type === 'walking' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-white/5 text-slate-400'}`}>
                            {opt.type === 'metro' ? '🚇' : opt.type === 'bus' ? '🚌' : opt.type === 'walking' ? '🚶' : '🚗'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-sm text-slate-100">{opt.lineName || opt.type.toUpperCase()}</h4>
                              {opt.recommended && (
                                <span className="text-[8px] font-mono font-bold bg-brand-green/15 text-brand-green px-1.5 py-0.5 rounded border border-brand-green/20">AI RECOMMENDED</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{opt.statusDetail}</p>
                            
                            <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-500">
                              <span>Duration: <strong className="text-slate-300">{opt.timeMinutes} mins</strong></span>
                              <span>Cost: <strong className="text-slate-300">{opt.costEstimate}</strong></span>
                              <span>Emission: <strong className="text-emerald-400">{opt.carbonFootprintKg} kg CO2</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-stretch md:items-end w-full md:w-auto shrink-0 space-y-2">
                          <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-mono">
                            <span className="text-slate-400">Reward points multiplier:</span>
                            <span className="text-brand-green font-bold">x{opt.sustainabilityMultiplier}</span>
                          </div>
                          
                          <button
                            onClick={() => claimSustainabilityPoints(Math.round(opt.sustainabilityMultiplier * 50), opt.type)}
                            className="px-3.5 py-1.5 bg-brand-green hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer w-full md:w-auto"
                          >
                            Claim transit reward
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parking, EV details and environmental tracker chart (Right 5-columns) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* EV charging spots & general parking */}
                  <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      <span>Smart Parking & EV Charging Lots</span>
                    </h3>

                    <div className="space-y-3">
                      {parkingZones.map(lot => {
                        const isFull = (lot.occupiedSpots / lot.totalSpots) > 0.9;
                        return (
                          <div key={lot.id} className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-slate-200">{lot.name}</span>
                              <span className={`text-[10px] font-bold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {lot.totalSpots - lot.occupiedSpots} spots left
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>Distance: {lot.distanceMinutes}m walk</span>
                              <span>Price: {lot.price}</span>
                            </div>

                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${(lot.occupiedSpots / lot.totalSpots) * 100}%` }}
                              ></div>
                            </div>

                            {lot.chargingStations > 0 && (
                              <div className="text-[9px] text-brand-green font-semibold bg-brand-green/5 border border-brand-green/20 rounded p-1 flex items-center gap-1.5">
                                🔌 {lot.chargingStations} High-Speed EV chargers active in Sector {lot.id.split('-')[1].toUpperCase()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CO2 Emissions Offset card */}
                  <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-3">
                    <h3 className="font-display font-bold text-sm text-white">Sustainability Breakdown</h3>
                    
                    <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-xs space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carbon Saved today:</span>
                        <span className="font-mono text-brand-green font-bold">8,450 kg CO2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Water Recycled in toilets:</span>
                        <span className="font-mono text-brand-green font-bold">12,400 Gallons</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zero-Waste food cups:</span>
                        <span className="font-mono text-brand-green font-bold">42,000 units</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Tab 4: MATCH COMPANION AI */}
          {activeTab === 'match' && (
            <div className="space-y-6" id="match-tab">
              
              {/* Active match companion statistics header panel */}
              {activeMatch && (
                <div className="glass-card p-5 rounded-3xl border border-white/5">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{activeMatch.teamAFlag}</span>
                      <div>
                        <h2 className="text-xl font-bold text-white font-display">{activeMatch.teamA} vs {activeMatch.teamB}</h2>
                        <p className="text-xs text-slate-400 font-mono">{activeMatch.group} &bull; MetLife Stadium (New Jersey)</p>
                      </div>
                      <span className="text-3xl">{activeMatch.teamBFlag}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-mono bg-slate-950 px-3 py-1.5 border border-white/10 rounded-xl font-semibold text-slate-300 uppercase">
                        Active Playback (74')
                      </span>
                    </div>
                  </div>

                  {/* Core Match stats grids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Stat items */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 text-center">Team Possession</h4>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#00E5FF] font-bold">48% USA</span>
                        <span className="text-slate-300 font-bold">52% ENG</span>
                      </div>
                      <div className="w-full bg-[#051937] h-3 rounded-full flex overflow-hidden border border-white/5">
                        <div className="bg-[#00E5FF] h-full" style={{ width: '48%' }}></div>
                        <div className="bg-indigo-600 h-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 text-center">Expected Goals (xG)</h4>
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span className="text-emerald-400">1.85 xG</span>
                        <span className="text-slate-400">Expected Ratio</span>
                        <span className="text-slate-200">1.45 xG</span>
                      </div>
                      <div className="w-full bg-[#051937] h-3 rounded-full flex overflow-hidden border border-white/5">
                        <div className="bg-emerald-500 h-full" style={{ width: '56%' }}></div>
                        <div className="bg-slate-700 h-full" style={{ width: '44%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 text-center">Live Cards & Fouls</h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                          <p className="text-[10px] text-slate-400 uppercase">Yellow Cards</p>
                          <p className="text-sm font-bold text-yellow-500">1 - 2</p>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-white/5">
                          <p className="text-[10px] text-slate-400 uppercase">Fouls Committed</p>
                          <p className="text-sm font-bold text-slate-200">9 - 11</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Match live timeline timeline list & Match Assistant Chat */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Event timeline timeline (Left 6 columns) */}
                <div className="lg:col-span-6 glass-card p-5 rounded-3xl border border-white/5 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                    <Tv className="h-5 w-5 text-amber-400" />
                    <span>Live Match Timeline Events</span>
                  </h3>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {activeMatch?.timeline?.map((event, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-white/5 flex gap-3 text-xs">
                        <span className="font-mono text-brand-accent font-bold mt-0.5 shrink-0 bg-[#00E5FF]/10 px-2 py-0.5 rounded h-fit">
                          {event.minute}'
                        </span>
                        <div>
                          <p className="font-semibold text-slate-100">
                            {event.type === 'goal' ? '⚽ GOAL! ' : event.type === 'card' ? '🟨 CARD! ' : '📢 EVENT: '}
                            {event.player}
                          </p>
                          <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{event.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match companion chatbot (Right 6 columns) */}
                <div className="lg:col-span-6 glass-card p-5 rounded-3xl border border-white/5 flex flex-col justify-between h-[450px]">
                  <div>
                    <h3 className="font-display font-bold text-base text-white flex items-center space-x-2 mb-1">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>Live AI Match Companion Chat</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 border-b border-white/5 pb-3 mb-3">Ask about live tactical switches, player stats, historical tournament records, or rules.</p>
                  </div>

                  {/* companion messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 max-h-[250px]">
                    {matchChatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-xl text-xs max-w-[85%] ${msg.sender === 'user' ? 'bg-amber-500/10 border border-amber-500/20 text-slate-100' : 'bg-slate-950 border border-white/5 text-slate-200'}`}>
                          <p className="text-[9px] font-mono text-slate-500 mb-1">{msg.sender === 'user' ? 'You' : 'Companion AI'}</p>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* companion input controls */}
                  <div className="space-y-3">
                    {/* Pre-fill suggestion badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {matchChatMessages[0].suggestions?.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMatchChatMessage(s)}
                          className="text-[9px] bg-slate-950 border border-white/10 text-slate-300 hover:text-white px-2 py-1 rounded transition-all cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 bg-slate-950 p-2 rounded-xl border border-white/10">
                      <input
                        type="text"
                        placeholder="Ask about Kane's passing accuracy, Pulisic trivia..."
                        aria-label="Ask about match statistics, player performance, and tournament info"
                        value={matchChatInput}
                        onChange={(e) => setMatchChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendMatchChatMessage();
                        }}
                        className="flex-1 bg-transparent text-xs text-slate-200 outline-none px-2"
                      />
                      <button
                        onClick={() => handleSendMatchChatMessage()}
                        aria-label="Send match question"
                        className="p-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-all cursor-pointer text-xs flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Tab 5: EMERGENCY ACTIONS & INCIDENT REPORTING */}
          {activeTab === 'emergency' && (
            <div className="space-y-6" id="emergency-tab">
              
              {/* Emergency response alert layout */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#330c14] to-slate-950 border border-rose-500/30">
                <div className="flex items-center space-x-3 text-rose-400 text-xs font-mono font-bold uppercase tracking-widest mb-2">
                  <AlertTriangle className="h-4 w-4 animate-bounce" />
                  <span>FIFA Emergency Management Hub</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-white">Emergency Response System & AI SOPs</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  This system integrates live crowd intelligence, medical incident routing, and lightning evacuation procedures. Organizers and security staff use this portal to instantly deploy volunteers, generate SOP checklists, and direct outbound crowd lanes dynamically.
                </p>
              </div>

              {/* Standard guides list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SOP Procedure Checklists (Left 7-columns) */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                    <ShieldAlert className="h-5 w-5 text-rose-400" />
                    <span>Active Emergency Standard Operating Procedures (SOP)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EMERGENCY_GUIDES.map(guide => (
                      <div key={guide.id} className="p-5 bg-slate-950 rounded-2xl border border-rose-500/10 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 uppercase font-semibold">
                              {guide.hazardType} • {guide.alertLevel.toUpperCase()}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">{guide.id}</span>
                          </div>

                          <h4 className="font-semibold text-sm text-slate-100">{guide.headline}</h4>

                          <ul className="mt-4 space-y-2">
                            {guide.sopSteps.map((step, sIdx) => (
                              <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="font-mono text-rose-400 font-bold shrink-0">{sIdx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/5">
                          <p className="text-[10px] text-slate-400 font-mono">RECOMMENDED OUTBOUND EVACUATION EXIT CORRIDORS:</p>
                          <div className="flex gap-2 mt-1.5">
                            {guide.recommendedExits.map((exit, eIdx) => (
                              <span key={eIdx} className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                                {exit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Incident List */}
                  <div className="p-5 bg-slate-950 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-[#00E5FF]" />
                      <span>Live Active Incident Reports</span>
                    </h3>

                    <div className="space-y-3">
                      {incidents.map(inc => (
                        <div key={inc.id} className="p-4 bg-slate-900 rounded-2xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${inc.priority === 'critical' ? 'bg-rose-500 animate-pulse' : inc.priority === 'high' ? 'bg-amber-500' : 'bg-blue-400'}`}></span>
                              <h4 className="font-bold text-xs text-slate-100">{inc.title}</h4>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">{inc.timestamp}</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                          <div className="flex justify-between text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded">
                            <span>Location: <strong className="text-slate-200">{inc.location}</strong></span>
                            <span>Status: <strong className="text-rose-400 uppercase">{inc.status}</strong></span>
                            <span>Reported by: <strong className="text-slate-200">{inc.reporterName}</strong></span>
                          </div>

                          {inc.aiSopRecommendation && (
                            <div className="mt-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3 space-y-1.5">
                              <p className="text-[10px] font-mono text-[#00E5FF] font-bold uppercase tracking-wider">🤖 AI Instantly Generated SOP Guideline:</p>
                              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{inc.aiSopRecommendation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Organizer Post Incident form (Right 5-columns) */}
                <div className="lg:col-span-4">
                  <div className="glass-card p-5 rounded-3xl border border-white/5 space-y-4">
                    <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2 border-b border-white/5 pb-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <span>Report New Incident (AI Assisted)</span>
                    </h3>

                    <form onSubmit={handleReportIncident} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label htmlFor="inc-title" className="text-slate-400 font-mono">Incident Title / Hazard Type</label>
                        <input
                          id="inc-title"
                          type="text"
                          placeholder="e.g. Wet ground spill, Blocked Corridor, etc."
                          value={newIncident.title}
                          onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-[#00E5FF]/50 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label htmlFor="inc-type" className="text-slate-400 font-mono">Incident Type</label>
                          <select
                            id="inc-type"
                            value={newIncident.type}
                            onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as any })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-[#00E5FF]/50 outline-none cursor-pointer"
                          >
                            <option value="medical">Medical</option>
                            <option value="security">Security / Riot</option>
                            <option value="fire">Fire / Smoke</option>
                            <option value="facility">Blocked / Broken</option>
                            <option value="other">Other Hazard</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="inc-priority" className="text-slate-400 font-mono">Priority Alert</label>
                          <select
                            id="inc-priority"
                            value={newIncident.priority}
                            onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value as any })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-[#00E5FF]/50 outline-none cursor-pointer"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="inc-loc" className="text-slate-400 font-mono">Exact Sector Location</label>
                        <input
                          id="inc-loc"
                          type="text"
                          placeholder="e.g. Sector 104 Concourse near Burger Plaza"
                          value={newIncident.location}
                          onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-[#00E5FF]/50 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="inc-desc" className="text-slate-400 font-mono">Hazard Description</label>
                        <textarea
                          id="inc-desc"
                          placeholder="Provide descriptive details of the hazard so that the Gemini AI Emergency SOP generator can provide tailored steps."
                          value={newIncident.description}
                          onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-[#00E5FF]/50 outline-none min-h-[90px]"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={reportingIncident}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {reportingIncident ? 'Generating SOP Procedures...' : 'Submit Incident & Run AI SOP Guidance'}
                      </button>
                    </form>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 6: VOLUNTEER DESK & TASKS */}
          {activeTab === 'volunteer' && (
            <div className="space-y-6" id="volunteer-tab">
              
              {/* Volunteer header overview info */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a2313] to-slate-950 border border-brand-green/20">
                <div className="flex items-center space-x-3 text-brand-green text-xs font-mono font-bold uppercase tracking-widest mb-2">
                  <Users className="h-4 w-4" />
                  <span>FIFA Volunteer Desk Terminal</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-white">Live Operations Coordination</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Coordinate with supervisors, claim active tasks, inspect emergency Procedures, and assist spectators around restrooms, elevators, and accessible seating.
                </p>
              </div>

              {/* Grid of Volunteer tasks lists and volunteer companion procedure */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Volunteer task boards list (Left 7-columns) */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                    <Clipboard className="h-5 w-5 text-brand-green" />
                    <span>Current Volunteer Task Board</span>
                  </h3>

                  <div className="space-y-3">
                    {tasks.map(task => {
                      const isUnassigned = task.assignedTo === 'Unassigned';
                      const isMyTask = task.assignedTo === 'Adhisheshu';
                      const isCompleted = task.status === 'completed';

                      return (
                        <div key={task.id} className={`p-4 bg-slate-950 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isMyTask ? 'border-brand-green/40 bg-emerald-950/10' : 'border-white/5'}`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                task.priority === 'critical' ? 'bg-rose-500/10 text-rose-400' :
                                task.priority === 'high' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {task.priority.toUpperCase()} PRIORITY
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">[{task.category.toUpperCase()}]</span>
                            </div>

                            <h4 className="font-semibold text-sm text-slate-200 mt-1.5">{task.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                            
                            <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-500">
                              <span>Location: <strong className="text-slate-300">{task.location}</strong></span>
                              <span>Assigned to: <strong className={isMyTask ? 'text-brand-green font-bold' : 'text-slate-300'}>{task.assignedTo}</strong></span>
                            </div>
                          </div>

                          <div className="shrink-0 w-full md:w-auto">
                            {isUnassigned && (
                              <button
                                onClick={() => claimTask(task.id)}
                                className="w-full md:w-auto px-4 py-2 bg-brand-green text-slate-900 hover:bg-emerald-500 font-bold rounded-xl text-xs transition-all cursor-pointer"
                              >
                                Claim Task
                              </button>
                            )}

                            {isMyTask && !isCompleted && (
                              <button
                                onClick={() => completeTask(task.id)}
                                className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Check className="h-3.5 w-3.5" /> Mark Completed (+150 pts)
                              </button>
                            )}

                            {isCompleted && (
                              <span className="text-xs text-brand-green font-bold flex items-center gap-1 font-mono">
                                <CheckCircle className="h-4 w-4" /> COMPLETED
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SOP Procedure Quick guides (Right 5-columns) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="glass-card p-5 rounded-3xl border border-white/5 space-y-3">
                    <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-brand-green" />
                      <span>Volunteer AI SOP Chat Tool</span>
                    </h3>
                    <p className="text-xs text-slate-400">Ask the assistant about exact procedures: lost child protocols, translation assistance or emergency dispatch numbers.</p>

                    <div className="space-y-2.5">
                      <button
                        onClick={() => handleSendChatMessage("What is the lost child protocol in Sector 215?")}
                        className="w-full text-left p-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-brand-green/30 rounded-xl transition-all cursor-pointer text-xs"
                      >
                        👶 <strong>Lost Child Protocol</strong>
                        <p className="text-[10px] text-slate-400 mt-1">SOP checklist for volunteer search</p>
                      </button>

                      <button
                        onClick={() => handleSendChatMessage("What is the medical emergency SOP for a spectator slipping?")}
                        className="w-full text-left p-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-brand-green/30 rounded-xl transition-all cursor-pointer text-xs"
                      >
                        🚑 <strong>Spectator Injury Medical SOP</strong>
                        <p className="text-[10px] text-slate-400 mt-1">AED delivery & safety guidelines</p>
                      </button>

                      <button
                        onClick={() => setActiveTab('chat')}
                        className="w-full text-center py-2 bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 rounded-xl font-bold text-brand-green transition-all cursor-pointer text-xs block"
                      >
                        Open Volunteer AI Assistant Chat &rarr;
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 7: AI INSIGHTS ENGINE - EXECUTIVE OPERATIONAL AUDIT */}
          {activeTab === 'insights' && (
            <div className="space-y-6" id="insights-tab">
              
              {/* Executive intelligence overview header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17092c] to-slate-950 border border-purple-500/30">
                <div className="flex items-center space-x-3 text-purple-400 text-xs font-mono font-bold uppercase tracking-widest mb-2">
                  <FileText className="h-4 w-4" />
                  <span>FIFA EXECUTIVE INTELLIGENCE MODULE</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-white">Gemini AI Executive Operational Reports</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Produce deep real-time operational diagnostics of stadium safety, crowd wait-times, environmental sustainability index, volunteer dispatch performance and post-match outbound forecast.
                </p>
              </div>

              {/* Insights generation control */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3.5 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/40 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Generate Live Operational Briefing Report</h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1">
                    Connects directly to the server-side Gemini 3.5 Flash RAG query engine to formulate an executive operational summary audit.
                  </p>
                </div>

                <button
                  onClick={generateExecutiveReport}
                  disabled={generatingInsights}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  {generatingInsights ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Gemini is auditing live IoT telemetry...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Run AI Executive Audit Briefing</span>
                    </>
                  )}
                </button>
              </div>

              {/* Executive Report Viewport */}
              {insightsReport && (
                <div className="p-6 bg-slate-950 rounded-3xl border border-purple-500/20 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">🤖 OFFICIAL FIFA EXECUTIVE OPERATIONS AUDIT</span>
                    <button 
                      onClick={() => {
                        const blob = new Blob([insightsReport], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `FIFA_2026_StadiumMind_Briefing_${Date.now()}.txt`;
                        a.click();
                      }}
                      className="text-[10px] font-mono text-slate-400 hover:text-white border border-white/10 px-2.5 py-1.5 rounded bg-slate-900 cursor-pointer"
                    >
                      📥 Download Report (.txt)
                    </button>
                  </div>

                  {/* Rendered markdown style format */}
                  <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line bg-slate-900/60 p-5 rounded-2xl border border-white/5 overflow-x-auto max-w-full">
                    {insightsReport}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* Floating AI chat assistant button at the bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setActiveTab('chat');
          }}
          className="p-4 bg-[#00E5FF] hover:bg-[#00c8e0] text-slate-900 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center group border border-[#00E5FF]/40 relative"
          id="floating-ai-button"
          title="Open StadiumMind AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
          </span>
          <Sparkles className="h-6 w-6 animate-pulse" />
        </button>
      </div>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-white/5 py-6 px-4 bg-slate-950/40 text-center text-[10px] font-mono text-slate-500" id="global-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© FIFA World Cup 2026 Hackathon Prototype. All Rights Reserved. Powered by StadiumMind AI.</p>
          <div className="flex gap-4">
            <span className="text-brand-green font-semibold">● SECURE HOST SERVICE PORT: 3000</span>
            <span>&bull;</span>
            <span className="text-brand-accent">GEMINI 3.5 FLASH ACTIVE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
