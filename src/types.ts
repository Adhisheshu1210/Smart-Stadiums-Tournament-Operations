/**
 * StadiumMind AI - Data Models and Type Declarations
 */

export type UserRole = 'fan' | 'organizer' | 'volunteer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  sustainabilityPoints: number;
  completedTasks: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  teamAFlag: string;
  teamBFlag: string;
  date: string;
  time: string;
  stadiumId: string;
  group: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: { teamA: number; teamB: number };
  possession?: { teamA: number; teamB: number };
  stats?: {
    expectedGoals: { teamA: number; teamB: number };
    shots: { teamA: number; teamB: number };
    fouls: { teamA: number; teamB: number };
    corners: { teamA: number; teamB: number };
    yellowCards: { teamA: number; teamB: number };
    redCards: { teamA: number; teamB: number };
  };
  timeline?: {
    minute: number;
    type: 'goal' | 'card' | 'sub' | 'whistle';
    team?: 'A' | 'B';
    player: string;
    detail: string;
  }[];
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  gates: { id: string; name: string; occupancy: number; waitTimeMinutes: number; accessibilityFriendly: boolean }[];
  floors: string[];
}

export interface CrowdMetrics {
  currentOccupancy: number;
  maxCapacity: number;
  densityHeatmap: { sector: string; density: number; trend: 'rising' | 'stable' | 'falling' }[];
  queueTimes: {
    security: number;
    foodCourts: number;
    restrooms: number;
    gates: number;
  };
  predictions30m: { sector: string; predictedDensity: number }[];
}

export interface TransportOption {
  type: 'metro' | 'bus' | 'rideshare' | 'walking' | 'parking';
  lineName?: string;
  timeMinutes: number;
  costEstimate: string;
  crowdLevel: 'low' | 'moderate' | 'high';
  carbonFootprintKg: number;
  sustainabilityMultiplier: number;
  recommended: boolean;
  statusDetail: string;
}

export interface ParkingZone {
  id: string;
  name: string;
  totalSpots: number;
  occupiedSpots: number;
  price: string;
  distanceMinutes: number;
  chargingStations: number;
}

export interface RestroomStatus {
  id: string;
  location: string;
  gender: 'mens' | 'womens' | 'all-gender';
  queueLength: number;
  waitTimeMinutes: number;
  accessible: boolean;
  isClean: boolean;
}

export interface FoodVendor {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  popularItem: string;
  priceRange: '$' | '$$' | '$$$';
  waitTimeMinutes: number;
  ecoFriendlyOptions: boolean;
  sustainabilityRewardPoints: number;
  seatDelivery: boolean;
}

export interface Alert {
  id: string;
  type: 'emergency' | 'congestion' | 'weather' | 'transport' | 'info';
  title: string;
  message: string;
  timestamp: string;
  sector?: string;
  active: boolean;
}

export interface VolunteerTask {
  id: string;
  assignedTo: string;
  title: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  category: 'crowd-control' | 'medical' | 'info' | 'accessibility';
}

export interface IncidentReport {
  id: string;
  title: string;
  type: 'medical' | 'security' | 'fire' | 'facility' | 'other';
  location: string;
  description: string;
  reporterName: string;
  status: 'reported' | 'dispatching' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  aiSopRecommendation?: string;
}

export interface EmergencyActionGuide {
  id: string;
  hazardType: 'overcrowding' | 'medical' | 'fire' | 'weather' | 'suspicious-activity' | 'power-outage';
  alertLevel: 'warning' | 'severe' | 'extreme';
  headline: string;
  sopSteps: string[];
  recommendedExits: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  language?: string;
  suggestions?: string[];
}
