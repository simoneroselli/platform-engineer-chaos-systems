// Define the shape of our load test configuration
interface LoadTestConfig {
  targetUrl: string;
  totalRequests: number;
  concurrencyLimit: number;
}

// Define the shape of a single request result
interface RequestResult {
  success: boolean;
  statusCode?: number;
  latencyMs: number;
  error?: string;
}

// Takes a single URL (like http://localhost:8080), fires one HTTP 
// request at it, and measures how many milliseconds it took to reply.
async function sendPing(url: string): Promise<RequestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url);
    const latencyMs = Date.now() - startTime;
    
    return {
      success: response.ok, // true if status code is 200-299
      statusCode: response.status,
      latencyMs
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "Unknown network error";
    
    return {
      success: false,
      latencyMs,
      error: errorMessage
    };
  }
}

// Define the final summary shape
interface TestSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
}

// Orchestrator function to run the load test
export async function runLoadTest(config: LoadTestConfig): Promise<TestSummary> {
  const results: RequestResult[] = [];
  console.log(`Starting stress test against ${config.targetUrl} with ${config.totalRequests} total requests (Concurrency: ${config.concurrencyLimit})...\n`);

  // Loop through requests in batches based on concurrency limit
  for (let i = 0; i < config.totalRequests; i += config.concurrencyLimit) {
    const batchSize = Math.min(config.concurrencyLimit, config.totalRequests - i);
    const batchPromises: Promise<RequestResult>[] = [];

    for (let j = 0; j < batchSize; j++) {
      batchPromises.push(sendPing(config.targetUrl));
    }

    // Wait for the current batch to complete before moving to the next
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  // Aggregate metrics
  return computeSummary(results);
}

// Helper to calculate statistics
export function computeSummary(results: RequestResult[]): TestSummary {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const latencies = results.map(r => r.latencyMs);

  const totalLatency = latencies.reduce((sum, val) => sum + val, 0);
  const avgLatency = latencies.length > 0 ? totalLatency / latencies.length : 0;

  return {
    totalRequests: results.length,
    successfulRequests: successful.length,
    failedRequests: failed.length,
    averageLatencyMs: Math.round(avgLatency),
    minLatencyMs: latencies.length > 0 ? Math.min(...latencies) : 0,
    maxLatencyMs: latencies.length > 0 ? Math.max(...latencies) : 0,
  };
}

// --- Execution Configuration ---
const testConfig: LoadTestConfig = {
  targetUrl: "http://localhost:8080",
  totalRequests: 200,
  concurrencyLimit: 5
};

// Run the test and print results
runLoadTest(testConfig).then(summary => {
  console.log("=== NGINX STRESS TEST REPORT ===");
  console.log(`Total Requests Sent : ${summary.totalRequests}`);
  console.log(`Successful          : ${summary.successfulRequests}`);
  console.log(`Failed              : ${summary.failedRequests}`);
  console.log(`Avg Latency         : ${summary.averageLatencyMs}ms`);
  console.log(`Min Latency         : ${summary.minLatencyMs}ms`);
  console.log(`Max Latency         : ${summary.maxLatencyMs}ms`);
  console.log("================================");
});