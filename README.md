# Platform Engineer TypeScript Toolkit

A local stress test toolkit for the various stack.

## 📋 Project Overview

**platform-engineer-ts-toolkit** is a TypeScript-based HTTP load testing and stress testing framework. It provides tools to measure application performance under load by simulating concurrent requests, measuring latency, and generating comprehensive test summaries. This toolkit is designed for platform engineers to validate application performance and infrastructure capacity.

### Key Features
- **HTTP Load Testing**: Send configurable concurrent requests to target endpoints
- **Latency Measurement**: Track request latency and response times
- **Performance Metrics**: Generate detailed summaries including success rates, average/min/max latencies
- **TypeScript Support**: Fully typed with interfaces for type-safe testing configurations
- **Test Framework**: Built with Vitest for comprehensive test coverage

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests with Vitest
npm run test
```

## 💡 Usage

The toolkit provides stress testing capabilities through the main stress testing module:

```typescript
import { sendPing, runLoadTest } from './src/stress';

// Configure your load test
const config = {
  targetUrl: 'http://localhost:8080',
  totalRequests: 1000,
  concurrencyLimit: 50
};

// Run the test and get performance metrics
const results = await runLoadTest(config);
```

### Configuration Options

- **targetUrl**: The endpoint to stress test
- **totalRequests**: Total number of HTTP requests to send
- **concurrencyLimit**: Maximum concurrent requests at any given time

### Output

The toolkit generates a summary with:
- Total requests executed
- Number of successful/failed requests
- Average, minimum, and maximum latency measurements
- Error details for failed requests

## 🛠 Development

### Project Stack
- **Language**: TypeScript
- **Test Framework**: Vitest
- **HTTP Client**: Fetch API

### Bootstrap Environment

To set up a local testing environment with Nginx:

```bash
./bootstrap/setup.sh
```

This will prepare the necessary Kubernetes manifests for deploying test targets.

## 📦 Dependencies

- **vitest** (v3.0.0+): Zero-config unit test framework for testing the stress testing functionality

## 📝 License

See the project repository for license details.