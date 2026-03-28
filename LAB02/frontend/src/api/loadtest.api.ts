import api from './axios';

export interface LoadTestRequest {
  testType: string;
  totalRequests: number;
  concurrencyLevel: number;
  ioDelayMs: number;
}

export interface LoadTestResult {
  architecture: string;
  testType: string;
  totalRequests: number;
  successCount: number;
  errorCount: number;
  totalTimeMs: number;
  avgResponseTimeMs: number;
  minResponseTimeMs: number;
  maxResponseTimeMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  throughputReqPerSec: number;
  peakThreadCount: number;
  memoryUsedMb: number;
}

export interface LoadTestEvent {
  type: 'progress' | 'result' | 'error' | 'complete';
  architecture: string;
  completedRequests: number;
  totalRequests: number;
  currentAvgMs: number;
  message: string;
  result: LoadTestResult | null;
}

export function runLoadTest(
  request: LoadTestRequest,
  onEvent: (event: LoadTestEvent) => void,
  onError: (error: string) => void,
  onComplete: () => void,
): () => void {
  const token = sessionStorage.getItem('token');
  const controller = new AbortController();

  fetch('/api/load-tests/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder();
      let buffer = '';

      const read = (): Promise<void> =>
        reader.read().then(({ done, value }) => {
          if (done) {
            onComplete();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';
          for (const part of parts) {
            const dataLine = part
              .split('\n')
              .find((line) => line.startsWith('data:'));
            if (dataLine) {
              try {
                const json = JSON.parse(dataLine.slice(5));
                onEvent(json);
              } catch {
                // skip malformed events
              }
            }
          }
          return read();
        });

      return read();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err.message);
      }
    });

  return () => controller.abort();
}
