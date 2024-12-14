export async function fetchWithTimeout(url: string, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UptimeBot/1.0; +https://example.com/bot)',
      },
      redirect: 'follow',
      method: 'HEAD', // Use HEAD request first for faster checks
    });

    // If HEAD request fails, try GET request
    if (!response.ok && response.status !== 304 && !(response.status >= 300 && response.status < 400)) {
      const getResponse = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UptimeBot/1.0; +https://example.com/bot)',
        },
        redirect: 'follow',
        method: 'GET',
      });
      clearTimeout(id);
      return getResponse;
    }

    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}