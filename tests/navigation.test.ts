import { describe, it, expect } from 'vitest';
import { findOptimalGate, calculateCarbonSavings, generateMockChatResponse } from '../src/utils/navigation';
import { Stadium } from '../src/types';

describe('Navigation Utilities', () => {
  const mockGates: Stadium['gates'] = [
    { id: 'gate-a', name: 'Gate A', occupancy: 90, waitTimeMinutes: 25, accessibilityFriendly: false },
    { id: 'gate-b', name: 'Gate B', occupancy: 40, waitTimeMinutes: 8, accessibilityFriendly: true },
    { id: 'gate-c', name: 'Gate C', occupancy: 85, waitTimeMinutes: 20, accessibilityFriendly: false },
    { id: 'gate-d', name: 'Gate D', occupancy: 20, waitTimeMinutes: 4, accessibilityFriendly: true }
  ];

  it('should find the fastest gate when no options are provided', () => {
    const optimal = findOptimalGate(mockGates);
    expect(optimal).not.toBeNull();
    expect(optimal?.id).toBe('gate-d'); // Gate D has 4 mins wait
  });

  it('should filter for accessible gates only', () => {
    const optimal = findOptimalGate(mockGates, { accessibilityRequired: true });
    expect(optimal?.accessibilityFriendly).toBe(true);
    expect(optimal?.id).toBe('gate-d'); // both B and D are accessible, D is faster
  });

  it('should select fastest eligible gate within time limits', () => {
    const optimal = findOptimalGate(mockGates, { maxWaitTimeMinutes: 10 });
    expect(optimal?.id).toBe('gate-d');
  });

  it('should calculate accurate CO2 savings for clean transportation', () => {
    const metroStats = calculateCarbonSavings('metro', 10);
    // Solo car would emit: 10 * 0.22 = 2.2 kg
    // Metro emits: 10 * 0.03 = 0.3 kg
    // Saved: 1.9 kg
    expect(metroStats.carbonProducedKg).toBe(0.3);
    expect(metroStats.carbonSavedKg).toBe(1.9);
    expect(metroStats.sustainabilityScore).toBe(85);

    const walkingStats = calculateCarbonSavings('walking', 5);
    expect(walkingStats.carbonProducedKg).toBe(0);
    expect(walkingStats.carbonSavedKg).toBe(parseFloat((5 * 0.22).toFixed(2)));
    expect(walkingStats.sustainabilityScore).toBe(100);
  });
});
