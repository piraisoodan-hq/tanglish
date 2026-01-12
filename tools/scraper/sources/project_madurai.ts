import { cleanText } from '../utils/cleaner';
import type { ScrapedItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const INDEX_URL = 'http://www.projectmadurai.org/pm_works.html';
const BASE_URL = 'http://www.projectmadurai.org/';

// Cache valid links to avoid re-fetching index
let cachedLinks: string[] = [];

/**
 * Fetches the main index and extracts e-text links
 */
async function getBookLinks(): Promise<string[]> {
  if (cachedLinks.length > 0) return cachedLinks;

  try {
    console.log('📚 Fetching Project Madurai Index...');
    const response = await fetch(INDEX_URL);
    const html = await response.text();

    // Regex to find links to UTF8 html files
    // Pattern: href="pm_etexts/utf8/pmXXXX.html"
    const linkRegex = /href="(pm_etexts\/utf8\/pm\d+\.html)"/g;
    const matches = [...html.matchAll(linkRegex)];

    cachedLinks = matches.map((m) => BASE_URL + m[1]);
    console.log(`📚 Found ${cachedLinks.length} books in Project Madurai.`);

    // Shuffle them to get random probability
    cachedLinks = cachedLinks.sort(() => Math.random() - 0.5);
    return cachedLinks;
  } catch (e) {
    console.error('Failed to fetch PM Index', e);
    return [];
  }
}

/**
 * Fetches random books from Project Madurai
 * @param count Number of books to fetch chunks from
 */
export async function fetchMaduraiData(count: number = 2): Promise<ScrapedItem[]> {
  const links = await getBookLinks();
  const selectedLinks = links.slice(0, count);
  // Rotate links so we don't fetch same ones next time (simple simulated queue)
  cachedLinks = [...links.slice(count), ...selectedLinks];

  const results: ScrapedItem[] = [];

  for (const link of selectedLinks) {
    try {
      // console.log(`   ⬇️ Fetching ${link}...`);
      const res = await fetch(link);
      const text = await res.text();

      // Extract title: <title>Project Madurai - ...</title>
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Unknown Literature';

      // Remove HTML tags crudely but effectively for bulk text
      // 1. Remove scripts/styles
      let raw = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');

      // 2. Extract body text (naive)
      raw = raw.replace(/<[^>]+>/g, ' '); // Strip all tags

      const cleaned = cleanText(raw);
      if (cleaned.length > 100) {
        results.push({
          id: uuidv4(),
          text: cleaned,
          source: 'literature',
          metadata: {
            title,
            url: link,
            publisher: 'Project Madurai',
          },
          scrapedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch book ${link}`);
    }
  }

  return results;
}
