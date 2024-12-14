import { fetchWithTimeout } from './fetchWithTimeout.ts';

interface CheckResult {
  status: 'up' | 'down';
  responseTime: number;
  error?: string;
}

export async function checkWebsite(url: string): Promise<CheckResult> {
  const startTime = Date.now();
  
  // Normalize URL
  let normalizedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Try HTTPS first
    try {
      const httpsResponse = await fetchWithTimeout(`https://${url}`);
      if (httpsResponse.ok || httpsResponse.status === 304) {
        normalizedUrl = `https://${url}`;
      } else {
        // If HTTPS fails, try HTTP
        const httpResponse = await fetchWithTimeout(`http://${url}`);
        if (httpResponse.ok || httpResponse.status === 304) {
          normalizedUrl = `http://${url}`;
        }
      }
    } catch {
      // If HTTPS fails, default to HTTP
      normalizedUrl = `http://${url}`;
    }
  }

  try {
    console.log(`Checking website: ${normalizedUrl}`);
    const response = await fetchWithTimeout(normalizedUrl);
    const responseTime = Date.now() - startTime;

    // Consider redirects (3xx) as successful too
    if (response.ok || (response.status >= 300 && response.status < 400)) {
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