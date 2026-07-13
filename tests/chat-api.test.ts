import { describe, it, expect } from 'vitest';
import { generateMockChatResponse } from '../src/utils/navigation';

describe('Chat API & LLM Bot Integration', () => {
  it('should correctly handle fan inquiries about Gates and queue times', () => {
    const question = "Where is Gate 5 and what are wait times?";
    const response = generateMockChatResponse(question, 'fan');
    
    expect(response).toContain('Gate B');
    expect(response).toContain('Gate D');
    expect(response).toContain('Gate C');
  });

  it('should handle accessibility and wheelchair questions', () => {
    const question = "Do you have wheelchair access?";
    const response = generateMockChatResponse(question, 'fan');
    
    expect(response).toContain('Gate D');
    expect(response).toContain('accessible');
    expect(response.toLowerCase()).toContain('ramps');
  });

  it('should handle emergency SOP guidelines for volunteer staff', () => {
    const question = "We have a lost child in sector 215, what to do?";
    const response = generateMockChatResponse(question, 'volunteer');
    
    expect(response).toContain('LOST CHILD WORKFLOW');
    expect(response).toContain('Sector 215');
    expect(response).toContain('Security Station');
  });

  it('should handle medical emergencies gracefully', () => {
    const question = "Someone is hurt and needs emergency medical help!";
    const response = generateMockChatResponse(question, 'volunteer');
    
    expect(response).toContain('EMERGENCY MEDICAL RESPOND');
    expect(response).toContain('AED Unit');
  });
});
