import { Match, Stadium, CrowdMetrics, TransportOption, ParkingZone, RestroomStatus, FoodVendor, Alert, VolunteerTask, IncidentReport, EmergencyActionGuide } from './types';

// RAG Knowledge Base Content
export const STADIUM_KNOWLEDGE_BASE = {
  policies: [
    "Prohibited items: No glass containers, umbrellas, weapons, drones, or banners larger than 2x1.5m.",
    "Bag Policy: Only clear plastic bags under 30x15x30cm or small clutch purses under 11x16cm are allowed.",
    "Food & Beverage: No outside food is allowed, except for medical necessities or infant formula.",
    "Smoking: All 2026 World Cup stadiums are 100% smoke-free (including e-cigarettes/vapes)."
  ],
  gates: [
    "Gate A (North): Nearest to Metro Station North. High-capacity, escalators to Upper Tier. Accessible ramps available.",
    "Gate B (East): Near Parking Lot East and Bus Terminal. Moderate capacity, ideal for VIP and family entrances.",
    "Gate C (South): Ride-share pickup/drop-off zone. Quick automated ticket scanners.",
    "Gate D (West - Wheelchair Access): Specially equipped wide gates, close to Accessible Parking and ADA services desk."
  ],
  emergencySops: {
    overcrowding: [
      "AI Detects critical crowding density. Pause entry gates immediately.",
      "Activate visual indicators to guide fans to alternative underutilized exits.",
      "Mobilize volunteer crowd control units to form guide lanes."
    ],
    medical: [
      "Alert nearest on-duty medical responder with location details.",
      "Dispatch AED-equipped team if chest pains reported.",
      "Establish safe pathway for emergency vehicle access."
    ],
    fire: [
      "Trigger localized audio alarm. Initiate sequential sector evacuation.",
      "Unlock all electronic gate locks and emergency doors automatically.",
      "Coordinate with stadium fire wardens to sweep restrooms."
    ]
  },
  accessibilityGuide: [
    "Elevators: Located at Gate D and Sector 104, 218, 305.",
    "Wheelchair Seats: Rows 1-3 in all lower sections, with accompanying companion seats.",
    "Sinn Language Video support: QR code available at Information desks broadcasts live match commentary in International Sign Language.",
    "Sensory Rooms: Located at Sector 112 (Quiet space for neurodivergent fans)."
  ]
};

// Seed Data
export const INITIAL_MATCHES: Match[] = [
  {
    id: "match-1",
    teamA: "United States",
    teamB: "England",
    teamAFlag: "🇺🇸",
    teamBFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date: "2026-07-13",
    time: "18:00",
    stadiumId: "stadium-1",
    group: "Group B",
    status: "live",
    score: { teamA: 2, teamB: 1 },
    possession: { teamA: 48, teamB: 52 },
    stats: {
      expectedGoals: { teamA: 1.85, teamB: 1.45 },
      shots: { teamA: 12, teamB: 14 },
      fouls: { teamA: 9, teamB: 11 },
      corners: { teamA: 4, teamB: 6 },
      yellowCards: { teamA: 1, teamB: 2 },
      redCards: { teamA: 0, teamB: 0 }
    },
    timeline: [
      { minute: 0, type: 'whistle', player: 'Referee', detail: 'Match started' },
      { minute: 14, type: 'goal', team: 'A', player: 'Christian Pulisic', detail: 'Stunning right-foot shot into top corner, assist by McKennie.' },
      { minute: 32, type: 'card', team: 'B', player: 'Jude Bellingham', detail: 'Yellow card for late tackle.' },
      { minute: 45, type: 'whistle', player: 'Referee', detail: 'First half ends' },
      { minute: 58, type: 'goal', team: 'B', player: 'Harry Kane', detail: 'Clinical header off a corner delivery.' },
      { minute: 72, type: 'goal', team: 'A', player: 'Folarin Balogun', detail: 'Tap-in after a defensive scramble in the six-yard box!' },
      { minute: 81, type: 'sub', team: 'B', player: 'Bukayo Saka (OUT) / Phil Foden (IN)', detail: 'Tactical substitution' }
    ]
  },
  {
    id: "match-2",
    teamA: "Mexico",
    teamB: "Argentina",
    teamAFlag: "🇲🇽",
    teamBFlag: "🇦🇷",
    date: "2026-07-14",
    time: "15:00",
    stadiumId: "stadium-2",
    group: "Group A",
    status: "upcoming"
  },
  {
    id: "match-3",
    teamA: "Canada",
    teamB: "Brazil",
    teamAFlag: "🇨🇦",
    teamBFlag: "🇧🇷",
    date: "2026-07-15",
    time: "20:00",
    stadiumId: "stadium-1",
    group: "Group F",
    status: "upcoming"
  }
];

export const INITIAL_STADIUM: Stadium = {
  id: "stadium-1",
  name: "MetLife Stadium (FIFA 2026 Edition)",
  city: "East Rutherford, NJ, USA",
  capacity: 82500,
  gates: [
    { id: "gate-a", name: "Gate A (North)", occupancy: 85, waitTimeMinutes: 22, accessibilityFriendly: true },
    { id: "gate-b", name: "Gate B (East)", occupancy: 42, waitTimeMinutes: 8, accessibilityFriendly: true },
    { id: "gate-c", name: "Gate C (South)", occupancy: 92, waitTimeMinutes: 28, accessibilityFriendly: false },
    { id: "gate-d", name: "Gate D (West - Accessible)", occupancy: 25, waitTimeMinutes: 4, accessibilityFriendly: true }
  ],
  floors: ["Lower Concourse (100 Level)", "Club Plaza (200 Level)", "Upper Pavilion (300 Level)"]
};

export const INITIAL_CROWD_METRICS: CrowdMetrics = {
  currentOccupancy: 76420,
  maxCapacity: 82500,
  densityHeatmap: [
    { sector: "North Stand (Sec 101-115)", density: 88, trend: "rising" },
    { sector: "East Plaza (Sec 116-128)", density: 45, trend: "stable" },
    { sector: "South Curve (Sec 129-142)", density: 94, trend: "rising" },
    { sector: "West Stand (Sec 143-150)", density: 62, trend: "falling" }
  ],
  queueTimes: {
    security: 18,
    foodCourts: 12,
    restrooms: 9,
    gates: 14
  },
  predictions30m: [
    { sector: "North Stand (Sec 101-115)", predictedDensity: 95 },
    { sector: "East Plaza (Sec 116-128)", predictedDensity: 50 },
    { sector: "South Curve (Sec 129-142)", predictedDensity: 98 },
    { sector: "West Stand (Sec 143-150)", predictedDensity: 55 }
  ]
};

export const INITIAL_TRANSPORT_OPTIONS: TransportOption[] = [
  {
    type: "metro",
    lineName: "Meadowlands Express (Line M4)",
    timeMinutes: 25,
    costEstimate: "$4.50",
    crowdLevel: "high",
    carbonFootprintKg: 0.4,
    sustainabilityMultiplier: 3,
    recommended: true,
    statusDetail: "Frequent trains running every 3 minutes post-match. Highly sustainable."
  },
  {
    type: "bus",
    lineName: "FIFA Shuttle Bus 351",
    timeMinutes: 35,
    costEstimate: "$3.00",
    crowdLevel: "moderate",
    carbonFootprintKg: 0.8,
    sustainabilityMultiplier: 2.5,
    recommended: false,
    statusDetail: "Slight delays on Route 3 East due to heavy traffic. Departures every 8 minutes."
  },
  {
    type: "rideshare",
    lineName: "Uber/Lyft Safe Zone",
    timeMinutes: 45,
    costEstimate: "$35.00",
    crowdLevel: "high",
    carbonFootprintKg: 4.2,
    sustainabilityMultiplier: 1.0,
    recommended: false,
    statusDetail: "Surge pricing active. Pick up point located at Lot G (12-minute walk)."
  },
  {
    type: "parking",
    lineName: "Lot B Gold Parking",
    timeMinutes: 15,
    costEstimate: "$40.00",
    crowdLevel: "moderate",
    carbonFootprintKg: 5.5,
    sustainabilityMultiplier: 0.5,
    recommended: false,
    statusDetail: "Lot B is 94% full. Pre-booked passes required. EV chargers available."
  },
  {
    type: "walking",
    lineName: "Secaucus Greenway Walk",
    timeMinutes: 50,
    costEstimate: "Free",
    crowdLevel: "low",
    carbonFootprintKg: 0.0,
    sustainabilityMultiplier: 5.0,
    recommended: true,
    statusDetail: "Safe pedestrian walkway with beautiful water views and zero carbon emission!"
  }
];

export const INITIAL_PARKING_ZONES: ParkingZone[] = [
  { id: "park-a", name: "Lot A (North Premium)", totalSpots: 1200, occupiedSpots: 1120, price: "$50", distanceMinutes: 5, chargingStations: 8 },
  { id: "park-b", name: "Lot B (East General)", totalSpots: 3500, occupiedSpots: 3290, price: "$40", distanceMinutes: 10, chargingStations: 12 },
  { id: "park-c", name: "Lot C (South Family)", totalSpots: 2000, occupiedSpots: 1400, price: "$35", distanceMinutes: 12, chargingStations: 0 },
  { id: "park-d", name: "Lot D (Accessible Ramps)", totalSpots: 400, occupiedSpots: 180, price: "$20", distanceMinutes: 3, chargingStations: 10 }
];

export const INITIAL_RESTROOMS: RestroomStatus[] = [
  { id: "rest-1", location: "Concourse Sec 103", gender: "all-gender", queueLength: 3, waitTimeMinutes: 2, accessible: true, isClean: true },
  { id: "rest-2", location: "Concourse Sec 112", gender: "womens", queueLength: 12, waitTimeMinutes: 10, accessible: true, isClean: true },
  { id: "rest-3", location: "Concourse Sec 129", gender: "mens", queueLength: 15, waitTimeMinutes: 8, accessible: true, isClean: false },
  { id: "rest-4", location: "Club Level Sec 208", gender: "womens", queueLength: 2, waitTimeMinutes: 1, accessible: true, isClean: true },
  { id: "rest-5", location: "Upper Sec 324", gender: "mens", queueLength: 8, waitTimeMinutes: 5, accessible: false, isClean: true }
];

export const INITIAL_FOOD_VENDORS: FoodVendor[] = [
  { id: "food-1", name: "World Cup Stadium Burgers", cuisine: "American", rating: 4.5, popularItem: "Champion Cheese Burger & Fries", priceRange: "$$", waitTimeMinutes: 14, ecoFriendlyOptions: true, sustainabilityRewardPoints: 15, seatDelivery: true },
  { id: "food-2", name: "Tacos el Tri", cuisine: "Mexican", rating: 4.8, popularItem: "Carne Asada Street Tacos", priceRange: "$", waitTimeMinutes: 20, ecoFriendlyOptions: true, sustainabilityRewardPoints: 20, seatDelivery: false },
  { id: "food-3", name: "Zero-Waste Greens & Wraps", cuisine: "Healthy / Vegan", rating: 4.2, popularItem: "Organic Falafel Avocado Salad Bowl", priceRange: "$$", waitTimeMinutes: 5, ecoFriendlyOptions: true, sustainabilityRewardPoints: 40, seatDelivery: true },
  { id: "food-4", name: "FIFA Slice & Score Pizza", cuisine: "Italian / Pizza", rating: 4.3, popularItem: "Pepperoni Double Slices", priceRange: "$", waitTimeMinutes: 11, ecoFriendlyOptions: false, sustainabilityRewardPoints: 5, seatDelivery: false }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: "alert-1",
    type: "congestion",
    title: "Gate C High Congestion",
    message: "Security queues at Gate C (South) currently exceed 25 minutes. Fans are strongly advised to reroute to Gate B (East) or Gate D (West).",
    timestamp: "18:24",
    sector: "Gate C",
    active: true
  },
  {
    id: "alert-2",
    type: "transport",
    title: "Metro Orange Line Post-Match Plan",
    message: "Two additional direct shuttle trains will start operation immediately at Secaucus Plaza to clear outbound crowds. Follow signposts.",
    timestamp: "17:55",
    active: true
  },
  {
    id: "alert-3",
    type: "info",
    title: "Sustainability Challenge Active",
    message: "Scan your eco-friendly metro transport ticket in the app to instantly earn 100 bonus fan reward points!",
    timestamp: "16:00",
    active: true
  }
];

export const INITIAL_VOLUNTEER_TASKS: VolunteerTask[] = [
  { id: "task-1", assignedTo: "Adhisheshu", title: "Assist ADA Fan Entrance", description: "Guide a wheelchair user and their companion from Gate D accessible terminal to Sector 112 ADA seating.", location: "Gate D Accessible Plaza", priority: "high", status: "in-progress", category: "accessibility" },
  { id: "task-2", assignedTo: "Sarah", title: "Crowd Lane Deflection Gate C", description: "Direct arriving fans away from Gate C queue bottleneck towards underutilized Gate B entrance corridors.", location: "Gate C Forecourt", priority: "high", status: "pending", category: "crowd-control" },
  { id: "task-3", assignedTo: "Unassigned", title: "Missing Child Workflow Sector 215", description: "Report of a 6-year-old child wearing a red USA jersey separated from family near the main merchandise store.", location: "Sector 215 Concourse", priority: "critical", status: "pending", category: "medical" },
  { id: "task-4", assignedTo: "Unassigned", title: "Replenish Water Rehydration Booth", description: "Deliver 10 cases of reusable aluminum water cups to the Green Stadium Hydration Booth in Sector 142.", location: "Sector 142 Eco-Hub", priority: "medium", status: "pending", category: "info" }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: "inc-1",
    title: "Slipped on Wet Ground in Sector 104",
    type: "medical",
    location: "Sector 104 Concourse",
    description: "An elderly spectator slipped on spilled liquid near the food court. Complaining of mild wrist pain. Conscious and alert.",
    reporterName: "Volunteer Carlos",
    status: "dispatching",
    priority: "high",
    timestamp: "18:15",
    aiSopRecommendation: "1. Confirm conscious state and maintain immobility if neck pain reported. 2. Contact Medical Responder Sector B-4 (Ext 140) to bring wrist splint. 3. Request immediate sanitation clean-up to prevent further slippage. 4. Record details for insurance logs."
  },
  {
    id: "inc-2",
    title: "Blocked Fire Exit Stairwell North 3-A",
    type: "facility",
    location: "North Stand Exit Stairs 3-A",
    description: "Arriving fan banners and boxes are temporarily stacked directly in front of the primary exit staircase.",
    reporterName: "Security Supervisor Mike",
    status: "reported",
    priority: "critical",
    timestamp: "18:02",
    aiSopRecommendation: "1. Instruct nearby volunteers or security staff to immediately clear the path. 2. Identify owner of materials and issue administrative warning. 3. Log structural exit path inspection as complete."
  }
];

export const EMERGENCY_GUIDES: EmergencyActionGuide[] = [
  {
    id: "guide-1",
    hazardType: "overcrowding",
    alertLevel: "severe",
    headline: "Gate C Crowd Congestion Emergency Plan",
    sopSteps: [
      "Halt incoming fan tickets on South Gate scan lines.",
      "Broadcast directional audio: 'Gate C is temporarily busy. Please make a left turn towards Gate B.'",
      "Deploy 12 crowd-control personnel to partition the forecourt.",
      "Unlock West access fire corridors to expand egress options."
    ],
    recommendedExits: ["Gate B", "Gate D"]
  },
  {
    id: "guide-2",
    hazardType: "weather",
    alertLevel: "warning",
    headline: "Lightning Storm Evacuation SOP",
    sopSteps: [
      "Instruct spectators to immediately vacate the high upper bowl seats.",
      "Open access to the interior enclosed concrete concourses.",
      "Suspend overhead metallic camera rigs and crane-camera operations.",
      "Update digital billboards to direct fans to the lower covered areas."
    ],
    recommendedExits: ["Interior Covered Concourses 100/200 Level"]
  }
];
