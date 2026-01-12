import { cleanText } from '../utils/cleaner';
import type { ScrapedItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'https://www.sirukathaigal.com/';

// Cache visited links to avoid loops
const visitedLinks = new Set<string>();

/**
 * Fetches random stories/conversational text
 */
export async function fetchCasualData(count: number = 3): Promise<ScrapedItem[]> {
  const results: ScrapedItem[] = [];

  try {
    // 1. Fetch Homepage to find story links
    // In a real robust scraper, we'd crawl categories. taking a shortcut here.
    const res = await fetch(BASE_URL, { verbose: true });
    const html = await res.text();

    // Regex to find story links (heuristic: ends with /)
    // <a href="https://www.sirukathaigal.com/aesop-fables/the-fox-and-the-grapes/">
    const linkRegex = /href="(https:\/\/www\.sirukathaigal\.com\/[^"]+\/)"/g;
    const matches = [...html.matchAll(linkRegex)];

    // Filter and shuffle
    const links = matches
      .map(m => m[1])
      .filter(l => !visitedLinks.has(l) && l !== BASE_URL && !l.includes('/category/')) // Avoid category pages if possible
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    for (const link of links) {
      visitedLinks.add(link);
      try {
        const storyRes = await fetch(link);
        const storyHtml = await storyRes.text();

        // Extract title
        const titleMatch = storyHtml.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'Values Story';

        // Extract content from <div class="entry-content"> or similar
        // We'll use a naive regex to grab paragraphs <p>...</p> inside the body
        // This is a rough heuristic.
        const pRegex = /<p>(.*?)<\/p>/g;
        const pMatches = [...storyHtml.matchAll(pRegex)];

        const rawText = pMatches.map(m => m[1].replace(/<[^>]+>/g, '')).join('\n');

        const cleaned = cleanText(rawText);
        if (cleaned.length > 50) {
          results.push({
            id: uuidv4(),
            text: cleaned,
            source: 'casual',
            metadata: {
              title,
              url: link,
            },
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        // console.warn('Failed to fetch story', link);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch Casual Stories source', error);
  }

  return results;
}
