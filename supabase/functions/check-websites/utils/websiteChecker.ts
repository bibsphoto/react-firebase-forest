import { fetchWithTimeout } from './fetchWithTimeout.ts';

interface CheckResult {
  status: 'up' | 'down';
  responseTime: number;
  error?: string;
}

export async function checkWebsite(url: string): Promise<CheckResult> {
  const startTime = Date.now();
  
  // Normalize URL and handle www subdomain
  let normalizedUrl = url.toLowerCase();
  
  // Remove trailing slashes
  normalizedUrl = normalizedUrl.replace(/\/+$/, '');
  
  // Handle www and protocol
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    // Try HTTPS with www first if not present
    const urlWithoutProtocol = normalizedUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
    const variants = [
      `https://www.${urlWithoutProtocol}`,
      `https://${urlWithoutProtocol}`,
      `http://www.${urlWithoutProtocol}`,
      `http://${urlWithoutProtocol}`
    ];

    for (const variant of variants) {
      try {
        console.log(`Trying variant: ${variant}`);
        const response = await fetchWithTimeout(variant);
        if (response.ok || (response.status >= 300 && response.status < 400)) {
          normalizedUrl = variant;
          console.log(`Success with variant: ${variant}`);
          break;
        }
      } catch (error) {
        console.log(`Failed with variant: ${variant}`, error);
        continue;
      }
    }

    // If no variant worked, use HTTPS with www as default
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://www.${urlWithoutProtocol}`;
    }
  }

  try {
    console.log(`Final check for website: ${normalizedUrl}`);
    const response = await fetchWithTimeout(normalizedUrl);
    const responseTime = Date.now() - startTime;

    // Consider redirects (3xx) and successful responses as UP
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