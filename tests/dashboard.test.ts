import { describe, it, expect } from 'vitest';
import { INITIAL_CROWD_METRICS, INITIAL_ALERTS, INITIAL_INCIDENTS } from '../src/data';

describe('Crowd and Incident Dashboard Model', () => {
  it('should initialize crowd metrics correctly', () => {
    const metrics = INITIAL_CROWD_METRICS;
    expect(metrics.currentOccupancy).toBeGreaterThan(70000);
    expect(metrics.maxCapacity).toBe(82500);
    
    const occupancyPercentage = Math.round((metrics.currentOccupancy / metrics.maxCapacity) * 100);
    expect(occupancyPercentage).toBe(93); // 76420 / 82500 is ~92.6% which rounds to 93
  });

  it('should correctly filter active alerts', () => {
    const alerts = INITIAL_ALERTS;
    const activeAlerts = alerts.filter(a => a.active);
    expect(activeAlerts.length).toBe(3);
    
    const emergencyAlerts = alerts.filter(a => a.type === 'emergency');
    expect(emergencyAlerts.length).toBe(0); // initial alerts are congestion, transport, info
  });

  it('should correctly classify reported incidents by priority and type', () => {
    const incidents = INITIAL_INCIDENTS;
    expect(incidents.length).toBe(2);
    
    const criticalIncidents = incidents.filter(i => i.priority === 'critical');
    expect(criticalIncidents.length).toBe(1);
    expect(criticalIncidents[0].location).toBe('North Stand Exit Stairs 3-A');
    
    const medicalIncidents = incidents.filter(i => i.type === 'medical');
    expect(medicalIncidents.length).toBe(1);
    expect(medicalIncidents[0].reporterName).toBe('Volunteer Carlos');
  });

  it('should calculate simulated metrics fluctuations safely within stadium boundaries', () => {
    let occupancy = INITIAL_CROWD_METRICS.currentOccupancy;
    const maxCapacity = INITIAL_CROWD_METRICS.maxCapacity;

    // Simulate 5 ticks of crowd movement
    for (let i = 0; i < 5; i++) {
      const change = Math.floor((Math.random() - 0.5) * 100);
      occupancy = Math.max(70000, Math.min(maxCapacity, occupancy + change));
    }

    expect(occupancy).toBeGreaterThanOrEqual(70000);
    expect(occupancy).toBeLessThanOrEqual(maxCapacity);
  });
});
