import { fetchWithTimeout } from './fetchWithTimeout.ts';

interface CheckResult {
  status: 'up' | 'down';
  responseTime: number;
  error?: string;
}

export async function checkWebsite(url: string): Promise<CheckResult> {
  const startTime = Date.now();
  
  // Normalize URL
  let normalizedUrl = url.toLowerCase();
  normalizedUrl = normalizedUrl.replace(/\/+$/, '');
  
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    console.log(`Checking website: ${normalizedUrl}`);
    const response = await fetchWithTimeout(normalizedUrl);
    const responseTime = Date.now() - startTime;

    console.log(`Response status for ${normalizedUrl}:`, response.status);
    console.log(`Response ok for ${normalizedUrl}:`, response.ok);

    // Consider any 2xx or 3xx status as UP
    if (response.status >= 200 && response.status < 400) {
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
    
    // Si l'erreur est due à HTTPS, essayons avec HTTP
    if (!normalizedUrl.startsWith('http://')) {
      try {
        const httpUrl = normalizedUrl.replace('https://', 'http://');
        console.log(`Retrying with HTTP: ${httpUrl}`);
        const response = await fetchWithTimeout(httpUrl);
        const responseTime = Date.now() - startTime;

        if (response.status >= 200 && response.status < 400) {
          console.log(`Website ${httpUrl} is UP (${response.status})`);
          return { status: 'up', responseTime };
        }
      } catch (httpError) {
        console.error(`HTTP fallback also failed for ${normalizedUrl}:`, httpError);
      }
    }

    return { 
      status: 'down', 
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}