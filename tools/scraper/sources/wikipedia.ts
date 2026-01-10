import { cleanText } from '../utils/cleaner';

const API_ENDPOINT = 'https://ta.wikipedia.org/w/api.php';

interface WikiResponse {
  query: {
    pages: Record<string, { pageid: number; title: string; extract: string }>;
  };
}

/**
 * Validates if the page is a content page (namespace 0) and not a category/user page.
 * The API 'random' generator should handle this via strict params, but we double check.
 */
function isValidPage(title: string): boolean {
  if (title.startsWith('பகுப்பு:') || title.includes(':')) return false;
  return true;
}

/**
 * Fetches random articles from Tamil Wikipedia
 * @param count Number of articles to fetch
 */
export async function fetchWikiData(count: number = 5): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'random',
    grnnamespace: '0', // Main namespace only
    grnlimit: count.toString(),
    prop: 'extracts',
    exintro: '1', // Get only the intro (usually highest quality text) or remove for full
    explaintext: '1', // Get plaintext, not HTML
  });

  try {
    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
    if (!response.ok) throw new Error(`Wiki API Error: ${response.statusText}`);

    const data = (await response.json()) as WikiResponse;
    const pages = data.query?.pages || {};
    const results: string[] = [];

    for (const key in pages) {
      const page = pages[key];
      if (isValidPage(page.title)) {
        const cleaned = cleanText(page.extract);
        if (cleaned.length > 50) {
          // Minimum length check
          results.push(cleaned);
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching Wiki data:', error);
    return [];
  }
}
