import { describe, it, expect } from 'vitest';
import { computeSummary } from './stress';

// Imagine computeSummary is imported or available in this file
// Let's test the math logic directly
describe('Stress Test Summary Calculations', () => {
  
  it('should correctly calculate averages and success/failure counts', () => {
    // 1. Arrange: Create mock request results (fake test data)
    const mockResults = [
      { success: true, statusCode: 200, latencyMs: 100 },
      { success: true, statusCode: 200, latencyMs: 200 },
      { success: false, latencyMs: 500, error: 'Connection Refused' }
    ];

    // 2. Act: Run our computation function against mock data
    const summary = computeSummary(mockResults);

    // 3. Assert: Verify the output matches our exact expectations
    expect(summary.totalRequests).toBe(3);
    expect(summary.successfulRequests).toBe(2);
    expect(summary.failedRequests).toBe(1);
    expect(summary.averageLatencyMs).toBe(267); // (100 + 200 + 500) / 3 = 266.66... rounded
    expect(summary.minLatencyMs).toBe(100);
    expect(summary.maxLatencyMs).toBe(500);
  });

});
