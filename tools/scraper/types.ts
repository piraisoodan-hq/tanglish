export interface ScrapedItem {
  id: string;
  text: string;
  source: 'wiki' | 'literature' | 'casual';
  metadata: {
    title?: string;
    url?: string;
    pageid?: number;
    author?: string;
    year?: string;
    [key: string]: any;
  };
  scrapedAt: string; // ISO Date
}
