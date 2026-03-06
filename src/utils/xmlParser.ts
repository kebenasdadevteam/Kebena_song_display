import { Song } from '../types';

/**
 * Parse XML hymnal songs from Android string-array format
 * Converts XML structure to Song objects
 */
export function parseHymnalXML(xmlContent: string): Song[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid XML format');
  }
  
  const targetArray =
    xmlDoc.querySelector('string-array[name="hymnal_Song"]') ||
    xmlDoc.querySelector('string-array[name="hymnal_song"]') ||
    xmlDoc.querySelector('string-array[name*="hymnal" i]') ||
    xmlDoc.querySelector('string-array');

  const items = targetArray
    ? targetArray.querySelectorAll(':scope > item')
    : xmlDoc.querySelectorAll('item');
  const songs: Song[] = [];
  
  items.forEach((item, index) => {
    const pages = item.querySelectorAll('page');
    const lyrics: string[] = [];
    
    pages.forEach((page) => {
      const lines = Array.from(page.querySelectorAll('line'));
      const slideText = lines.map(line => line.textContent?.trim() || '').join('\n');
      if (slideText) {
        lyrics.push(slideText);
      }
    });
    
    if (lyrics.length > 0) {
      // Extract first line as title (Amharic)
      const firstLine = lyrics[0].split('\n')[0] || `መዝሙር ${index + 1}`;
      
      songs.push({
        id: index + 1,
        number: String(index + 1).padStart(3, '0'),
        category: 'hymnal',
        titleAmharic: firstLine.substring(0, 50), // Limit title length
        titleEnglish: `Hymn ${index + 1}`,
        lyrics: lyrics,
        metadata: {
          creator: 'Traditional',
          uploader: 'System',
          updatedDate: new Date().toISOString().split('T')[0]
        }
      });
    }
  });
  
  return songs;
}

/**
 * Load and parse hymnal XML file
 */
export async function loadHymnalFromXML(xmlFilePath: string): Promise<Song[]> {
  try {
    const response = await fetch(xmlFilePath);
    const xmlText = await response.text();
    return parseHymnalXML(xmlText);
  } catch (error) {
    console.error('Error loading hymnal XML:', error);
    return [];
  }
}
