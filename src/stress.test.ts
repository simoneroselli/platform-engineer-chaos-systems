import { describe, it, expect, vi } from 'vitest';
import { computeSummary } from './stress';
import { runLoadTest } from './stress';

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

describe('runLoadTest Orchestrator', () => {
  
  it('should successfully coordinate batch requests and return a valid summary', async () => {
    // 1. Arrange: Mock global fetch so it doesn't hit a real server
    // We tell fetch: "Whenever called, return a fake 200 OK response"
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    // Define a small test config to keep things fast
    const testConfig = {
      targetUrl: "http://localhost:8080",
      totalRequests: 4,
      concurrencyLimit: 2
    };

    // 2. Act: Run the orchestrator function
    const summary = await runLoadTest(testConfig);

    // 3. Assert: Check that orchestration handled all requests correctly
    expect(summary.totalRequests).toBe(4);
    expect(summary.successfulRequests).toBe(4);
    expect(summary.failedRequests).toBe(0);
    
    // Verify our mocked fetch was actually called 4 times
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

});
