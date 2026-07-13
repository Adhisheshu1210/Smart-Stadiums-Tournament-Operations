/**
 * StadiumMind AI - Navigation and Stadium Operations Utilities
 */

import { Stadium } from '../types';

/**
 * Finds the optimal gate based on user preferences.
 * 
 * @param gates Array of stadium gates
 * @param options Preferences such as accessibility or max acceptable queue wait times
 */
export function findOptimalGate(
  gates: Stadium['gates'],
  options: { accessibilityRequired?: boolean; maxWaitTimeMinutes?: number } = {}
) {
  if (!gates || gates.length === 0) return null;

  // Filter for accessibility if requested
  let eligibleGates = gates;
  if (options.accessibilityRequired) {
    eligibleGates = gates.filter(g => g.accessibilityFriendly);
    // If no accessible gates are configured, fallback to all gates but warn
    if (eligibleGates.length === 0) {
      eligibleGates = gates;
    }
  }

  // Filter by wait time if a max wait time threshold is provided
  if (options.maxWaitTimeMinutes !== undefined) {
    const matchingTime = eligibleGates.filter(g => g.waitTimeMinutes <= (options.maxWaitTimeMinutes ?? 100));
    if (matchingTime.length > 0) {
      eligibleGates = matchingTime;
    }
  }

  // Return the gate with the lowest occupancy rate (or shortest wait time)
  return eligibleGates.reduce((best, current) => {
    if (!best) return current;
    return current.waitTimeMinutes < best.waitTimeMinutes ? current : best;
  }, eligibleGates[0]);
}

/**
 * Calculates estimated CO2 emissions and CO2 savings compared to driving a standard private car.
 * Standard car footprint benchmark: ~0.4 kg CO2 per mile / ~0.25 kg per km.
 * 
 * @param transportType Transport method type
 * @param distanceKm Distance in kilometers
 */
export function calculateCarbonSavings(
  transportType: 'metro' | 'bus' | 'rideshare' | 'walking' | 'parking',
  distanceKm: number
): { carbonProducedKg: number; carbonSavedKg: number; sustainabilityScore: number } {
  const CAR_EMISSION_PER_KM = 0.22; // kg CO2 / km
  const benchmarkEmissions = distanceKm * CAR_EMISSION_PER_KM;

  let factor = 0;
  let score = 0;

  switch (transportType) {
    case 'walking':
      factor = 0.0;
      score = 100;
      break;
    case 'metro':
      factor = 0.03; // highly efficient mass rail
      score = 85;
      break;
    case 'bus':
      factor = 0.06; // shuttle transit
      score = 70;
      break;
    case 'rideshare':
      factor = 0.18; // shared/carpool trip
      score = 40;
      break;
    case 'parking':
    default:
      factor = 0.22; // equivalent to standard solo driving
      score = 10;
      break;
  }

  const carbonProducedKg = parseFloat((distanceKm * factor).toFixed(2));
  const carbonSavedKg = parseFloat(Math.max(0, benchmarkEmissions - carbonProducedKg).toFixed(2));

  return {
    carbonProducedKg,
    carbonSavedKg,
    sustainabilityScore: score
  };
}

/**
 * Intelligent chatbot mock generator for fallback and testing without live API keys
 * 
 * @param message User text query
 * @param role Fan or volunteer perspective
 */
export function generateMockChatResponse(message: string, role: 'fan' | 'volunteer' | 'organizer' = 'fan'): string {
  const msgLower = message.toLowerCase();

  if (role === 'volunteer') {
    if (msgLower.includes('child') || msgLower.includes('lost')) {
      return "**[SOP: LOST CHILD WORKFLOW]**\n\n1. **Secure the Location**: Stay with the child in Sector 215 Concourse.\n2. **Log Task**: Immediately dispatch unassigned task #3.\n3. **De-escalate & Safety**: Comfort the child; do not broadcast the child's full name over PA systems.\n4. **Handover**: Escort child to Security Station behind Section 201.";
    }
    if (msgLower.includes('medical') || msgLower.includes('hurt') || msgLower.includes('emergency')) {
      return "**[SOP: EMERGENCY MEDICAL RESPOND]**\n\n1. **Assess State**: Check if breathing/conscious.\n2. **AED Unit**: Retrieve portable AED at Sector 112 ADA station.\n3. **Alert Dispatch**: Call Medical Command Desk (Ext 140) indicating location quadrant.";
    }
    return `Hello! This is StadiumMind's Volunteer Desk. Regarding your question "${message}", please adhere to standard tournament security policies and coordinate with your Sector Warden at Sector 110.`;
  }

  // Fan responses
  if (msgLower.includes('gate d') || msgLower.includes('accessibility') || msgLower.includes('wheelchair') || msgLower.includes('handicap')) {
    return "Our stadium is fully accessible! **Gate D (West - Accessible)** offers expedited access, tactile corridors, and a dedicated ADA service booth. Ramps and elevator lifts are located directly adjacent.";
  }
  if (msgLower.includes('gate 5') || msgLower.includes('gate') || msgLower.includes('where is gate')) {
    return "Enter through **Gate B (East Stand)** for sectors 116-128 (8-minute queue). For sectors 129-142, **Gate D (West Stand)** is recommended (4-minute wait). Avoid Gate C (South Stand) due to heavy security queue times exceeding 25 minutes.";
  }
  if (msgLower.includes('bag') || msgLower.includes('prohibited') || msgLower.includes('rules')) {
    return "FIFA 2026 Stadium Rules forbid backpacks, luggage, glass containers, vapes, and umbrellas. Only clear plastic bags under 30x15x30cm are allowed.";
  }
  if (msgLower.includes('metro') || msgLower.includes('bus') || msgLower.includes('transport')) {
    return "We highly recommend the **Meadowlands Express (Line M4)** Metro. Post-match trains run every 3 minutes. Register your ticket in the app's 'Transit & Green Hub' to claim **120 Green Points**!";
  }

  return "Welcome to StadiumMind AI! Ask me about Gate details, restroom wait times, wheelchair routes, stadium regulations, or green mass-transit rewards.";
}
