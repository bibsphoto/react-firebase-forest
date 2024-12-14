import { fetchWithTimeout } from './fetchWithTimeout.ts';

interface CheckResult {
  status: 'up' | 'down';
  responseTime: number;
  error?: string;
}

export async function checkWebsite(url: string): Promise<CheckResult> {
  const startTime = Date.now();
  let normalizedUrl = url;
  
  if (!url.startsWith('http')) {
    normalizedUrl = `https://${url}`;
  }

  try {
    console.log(`Checking website: ${normalizedUrl}`);
    const response = await fetchWithTimeout(normalizedUrl);
    const responseTime = Date.now() - startTime;

    if (response.ok || response.status === 304) {
      console.log(`Website ${normalizedUrl} is UP (${response.status})`);
      return { status: 'up', responseTime };
    } else {
      console.log(`Website ${normalizedUrl} returned status ${response.status}`);
      return { 
        status: 'down', 
        responseTime,
        error: `HTTP ${response.status}` 
      };
    }
  } catch (error) {
    console.error(`Error checking ${normalizedUrl}:`, error);
    return { 
      status: 'down', 
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}