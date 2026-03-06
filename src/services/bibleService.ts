// BIBLE FEATURE - Entire file commented out for song-only version
// Uncomment this entire file to re-enable Bible functionality

/*
import { BibleBook, BibleVersion, BibleVerse } from '../types';

const API_BASE_URL = 'https://openamharicbible.vercel.app/api/am';

// Bible versions - Currently only Amharic is supported by the API
export const bibleVersions: BibleVersion[] = [
  { id: 'amharic', name: 'Amharic Bible', nameAmharic: 'የአማርኛ መጽሐፍ ቅዱስ' },
];

// Fallback verses for when API is unavailable
// Includes commonly used verses like John 3:16
const fallbackVerses: Record<string, BibleVerse[]> = {
  'amharic-John-3': [
    { book: 'John', chapter: 3, verse: 1, text: 'ከፈሪሳውያንም የሕዝቡ አለቆች አንዱ ኒቆዴሞስ የሚባል ሰው ነበረ።' },
    { book: 'John', chapter: 3, verse: 2, text: 'እርሱም ምሽት ሆኖ ወደ እርሱ መጥቶ። መምህር ሆይ፥ ከእግዚአብሔር ምምህር የመጣህ መሆንህን እናውቃለን፤ እግዚአብሔር ካልሆነ ከእርስህ ጋር ካልሆነ እነዚህን ምልክቶች የሚያደርግ ስለማይኖር ብሎት አለ።' },
    { book: 'John', chapter: 3, verse: 3, text: 'ኢየሱስም መልሶ። እውነት እውነት እላለሁ፥ ሁለተኛ ከመወለድ በቀር የእግዚአብሔርን መንግሥት ሰው አይመለከትም አለው።' },
    { book: 'John', chapter: 3, verse: 4, text: 'ኒቆዴሞስም። ሰው አዛውኖ ሲሆን እንዴት መወለድ ይችላል? ሁለተኛ ግዜ ወደ እናቱ ማኅፀን ገብቶ መወለድ ይችላል እንዴ? አለው።' },
    { book: 'John', chapter: 3, verse: 5, text: 'ኢየሱስም መልሶ። እውነት እውነት እላለሁ፥ ሰው በውኃና በመንፈስ ካልተወለደ በስተቀር ወደ እግዚአብሔር መንግሥት መግባት አይችልም።' },
    { book: 'John', chapter: 3, verse: 6, text: 'ከሥጋ የተወለደ ሥጋ ነው፥ ከመንፈስ የተወለደም መንፈስ ነው።' },
    { book: 'John', chapter: 3, verse: 7, text: 'ሁለተኛ መወለድ ይገባችኋል ብዬሃችሁ አትደነግጡ።' },
    { book: 'John', chapter: 3, verse: 8, text: 'ነፋስ የሚወደውን ይነፍሳል፥ ድምጹንም ትሰማለህ፥ ግን ከወዴት እንደሚመጣና ወዴት እንደሚሄድ አታውቅም፤ ከመንፈስ የተወለደ ሁሉ እንዲሁ ነው አለው።' },
    { book: 'John', chapter: 3, verse: 9, text: 'ኒቆዴሞስም መልሶ። ይህ እንዴት ይሆናል? አለው።' },
    { book: 'John', chapter: 3, verse: 10, text: 'ኢየሱስም መልሶ። የእስራኤል መምህር ነህ፥ ይህንስ አታውቀውምን?' },
    { book: 'John', chapter: 3, verse: 11, text: 'እውነት እውነት እላለሃለሁ፥ የምናውቀውን እንናገራለን፥ የምንመለከተውንም እናስከተላለን፥ እናንተም ምስክርነታችንን አትቀበሉም።' },
    { book: 'John', chapter: 3, verse: 12, text: 'የምድርን ነገር ቢነግራችሁ አላመናችሁም፥ የሰማይንስ ነገር ብነግራችሁ እንዴት ታምናላችሁ?' },
    { book: 'John', chapter: 3, verse: 13, text: 'ከሰማይ ወደ ታች የወረደው ከሰማይ ያለው የሰው ልጅ ከሆነ በቀር ወደ ሰማይ የወጣ የለም።' },
    { book: 'John', chapter: 3, verse: 14, text: 'ሙሴም በምድረ በዳ እባቡን እንደ ከፈለው፥ የሰው ልጅም እንዲሁ መከፈል ይገባዋል፤' },
    { book: 'John', chapter: 3, verse: 15, text: 'የሚያምንበት ሁሉ የዘላለም ሕይወት እንዲኖረው።' },
    { book: 'John', chapter: 3, verse: 16, text: 'እግዚአብሔር ዓለምን በጣም ስለ ወደዳት፥ በእርሱ የሚያምን ሁሉ ሳይጠፋ የዘላለም ሕይወት እንዲኖረው ልጁን ያንን ልዑልን ሰጠ።' },
    { book: 'John', chapter: 3, verse: 17, text: 'እግዚአብሔር ልጁን ወደ ዓለም የላከው ዓለምን ይፈርድባት ዘንድ አይደለም፥ ዓለም በእርሱ እንድትድን ነው።' },
    { book: 'John', chapter: 3, verse: 18, text: 'የሚያምንበት አይፈረድበትም፤ ያላመነ ግን አስቀድሞ ተፈርዶበታል፥ በአንዱ በእግዚአብሔር ልጅ ስም ስላላመነ።' },
    { book: 'John', chapter: 3, verse: 19, text: 'ፍርዱም ይህ ነው፥ ብርሃን ወደ ዓለም መጥቷል፥ ሰዎችም ሥራቸው ክፉ ነበረና ብርሃንን ሳይሆን ጨለማን ወደዱ።' },
    { book: 'John', chapter: 3, verse: 20, text: 'ክፉ የሚያደርግ ሁሉ ብርሃንን ይጠላል፥ ሥራውም እንዳይገለጥ ወደ ብርሃን አይመጣም።' },
    { book: 'John', chapter: 3, verse: 21, text: 'እውነትን የሚያደርግ ግን ሥራው በእግዚአብሔር መሥራቱ ይገለጥ ዘንድ ወደ ብርሃን ይመጣል።' },
  ],
  'amharic-Psalms-23': [
    { book: 'Psalms', chapter: 23, verse: 1, text: 'የዳዊት መዝሙር። እግዚአብሔር እረኛዬ ነው እንዳልጐድል ያደርገኛል።' },
    { book: 'Psalms', chapter: 23, verse: 2, text: 'በአረንጓዴ ሣር ያደርቀኛል፥ ወደ ዕረፍቱ ውኃም ያመራኛል።' },
    { book: 'Psalms', chapter: 23, verse: 3, text: 'ነፍሴን ያጸናናል፤ ስለ ስሙም በጽድቅ መንገድ ያመራኛል።' },
    { book: 'Psalms', chapter: 23, verse: 4, text: 'እንኳ በጨለማው ሸለቆ ብሄድ እኔ ክፉን አልፈራም፥ አንተ ከእኔ ጋር ነህና፤ በትርህና በጦርህም ያጸናኑኛል።' },
    { book: 'Psalms', chapter: 23, verse: 5, text: 'በጸረኞቼ ፊት ገበያ ዘረጋልኝ፥ ራሴን በዘይት ቀባኸው፥ ጽዋዬም ፈሰሰ።' },
    { book: 'Psalms', chapter: 23, verse: 6, text: 'በሕይወቴ ቀናት ሁሉ መልካምና ምሕረት በእርግጥ ይከተሉኛል፥ ለዘላለምም በእግዚአብሔር ቤት እቀመጣለሁ።' },
  ],
};

// Mapping of book abbreviations to full names
// Based on the API's book structure
export interface BookMapping {
  name: string;
  nameAmharic: string;
  abbreviation: string;
  chapters: number;
}

export const bibleBooks: BookMapping[] = [
  // Old Testament
  { name: 'Genesis', nameAmharic: 'ዘፍጥረት', abbreviation: 'ዘፍ', chapters: 50 },
  { name: 'Exodus', nameAmharic: 'ዘጸአት', abbreviation: 'ዘጸ', chapters: 40 },
  { name: 'Leviticus', nameAmharic: 'ዘሌዋውያን', abbreviation: 'ዘሌ', chapters: 27 },
  { name: 'Numbers', nameAmharic: 'ዘኍልቊ', abbreviation: 'ዘ狞', chapters: 36 },
  { name: 'Deuteronomy', nameAmharic: 'ዘዳግም', abbreviation: 'ዘዳ', chapters: 34 },
  { name: 'Joshua', nameAmharic: 'ኢያሱ', abbreviation: 'ኢያ', chapters: 24 },
  { name: 'Judges', nameAmharic: 'መሳፍንት', abbreviation: 'መሳ', chapters: 21 },
  { name: 'Ruth', nameAmharic: 'ሩት', abbreviation: 'ሩት', chapters: 4 },
  { name: '1 Samuel', nameAmharic: '1 ሳሙኤል', abbreviation: '1ሳሙ', chapters: 31 },
  { name: '2 Samuel', nameAmharic: '2 ሳሙኤል', abbreviation: '2ሳሙ', chapters: 24 },
  { name: '1 Kings', nameAmharic: '1 ነገሥት', abbreviation: '1ነገ', chapters: 22 },
  { name: '2 Kings', nameAmharic: '2 ነገሥት', abbreviation: '2ነገ', chapters: 25 },
  { name: '1 Chronicles', nameAmharic: '1 ዜና መዋዕል', abbreviation: '1ዜና', chapters: 29 },
  { name: '2 Chronicles', nameAmharic: '2 ዜና መዋዕል', abbreviation: '2ዜና', chapters: 36 },
  { name: 'Ezra', nameAmharic: 'ዕዝራ', abbreviation: 'ዕዝ', chapters: 10 },
  { name: 'Nehemiah', nameAmharic: 'ነህምያ', abbreviation: 'ነህ', chapters: 13 },
  { name: 'Esther', nameAmharic: 'አስቴር', abbreviation: 'አስ', chapters: 10 },
  { name: 'Job', nameAmharic: 'ኢዮብ', abbreviation: 'ኢዮ', chapters: 42 },
  { name: 'Psalms', nameAmharic: 'መዝሙረ ዳዊት', abbreviation: 'መዝ', chapters: 150 },
  { name: 'Proverbs', nameAmharic: 'ምሳሌ', abbreviation: 'ምሳ', chapters: 31 },
  { name: 'Ecclesiastes', nameAmharic: 'መክብብ', abbreviation: 'መክ', chapters: 12 },
  { name: 'Song of Solomon', nameAmharic: 'መኃልየ መኃልይ', abbreviation: 'መኃ', chapters: 8 },
  { name: 'Isaiah', nameAmharic: 'ኢሳይያስ', abbreviation: 'ኢሳ', chapters: 66 },
  { name: 'Jeremiah', nameAmharic: 'ኤርምያስ', abbreviation: 'ኤር', chapters: 52 },
  { name: 'Lamentations', nameAmharic: 'ሰቆቃው', abbreviation: 'ሰቆ', chapters: 5 },
  { name: 'Ezekiel', nameAmharic: 'ሕዝቅኤል', abbreviation: 'ሕዝ', chapters: 48 },
  { name: 'Daniel', nameAmharic: 'ዳንኤል', abbreviation: 'ዳን', chapters: 12 },
  { name: 'Hosea', nameAmharic: 'ሆሴዕ', abbreviation: 'ሆሴ', chapters: 14 },
  { name: 'Joel', nameAmharic: 'ኢዮኤል', abbreviation: 'ኢዮኤ', chapters: 3 },
  { name: 'Amos', nameAmharic: 'አሞጽ', abbreviation: 'አሞ', chapters: 9 },
  { name: 'Obadiah', nameAmharic: 'አብድዩ', abbreviation: 'አብ', chapters: 1 },
  { name: 'Jonah', nameAmharic: 'ዮናስ', abbreviation: 'ዮና', chapters: 4 },
  { name: 'Micah', nameAmharic: 'ሚክያስ', abbreviation: 'ሚክ', chapters: 7 },
  { name: 'Nahum', nameAmharic: 'ናሆም', abbreviation: 'ናሆ', chapters: 3 },
  { name: 'Habakkuk', nameAmharic: 'ዕንባቆም', abbreviation: 'ዕንባ', chapters: 3 },
  { name: 'Zephaniah', nameAmharic: 'ሶፎንያስ', abbreviation: 'ሶፎ', chapters: 3 },
  { name: 'Haggai', nameAmharic: 'ሐጌ', abbreviation: 'ሐጌ', chapters: 2 },
  { name: 'Zechariah', nameAmharic: 'ዘካርያስ', abbreviation: 'ዘካ', chapters: 14 },
  { name: 'Malachi', nameAmharic: 'ሚልክያስ', abbreviation: 'ሚል', chapters: 4 },
  
  // New Testament
  { name: 'Matthew', nameAmharic: 'ማቴዎስ', abbreviation: 'ማቴ', chapters: 28 },
  { name: 'Mark', nameAmharic: 'ማርቆስ', abbreviation: 'ማር', chapters: 16 },
  { name: 'Luke', nameAmharic: 'ሉቃስ', abbreviation: 'ሉቃ', chapters: 24 },
  { name: 'John', nameAmharic: 'ዮሐንስ', abbreviation: 'ዮሐ', chapters: 21 },
  { name: 'Acts', nameAmharic: 'ሐዋርያት', abbreviation: 'ሐዋ', chapters: 28 },
  { name: 'Romans', nameAmharic: 'ሮሜ', abbreviation: 'ሮሜ', chapters: 16 },
  { name: '1 Corinthians', nameAmharic: '1 ቆሮንቶስ', abbreviation: '1ቆሮ', chapters: 16 },
  { name: '2 Corinthians', nameAmharic: '2 ቆሮንቶስ', abbreviation: '2ቆሮ', chapters: 13 },
  { name: 'Galatians', nameAmharic: 'ገላትያ', abbreviation: 'ገላ', chapters: 6 },
  { name: 'Ephesians', nameAmharic: 'ኤፌሶን', abbreviation: 'ኤፌ', chapters: 6 },
  { name: 'Philippians', nameAmharic: 'ፊልጲስዩስ', abbreviation: 'ፊል', chapters: 4 },
  { name: 'Colossians', nameAmharic: 'ቆላስይስ', abbreviation: 'ቆላ', chapters: 4 },
  { name: '1 Thessalonians', nameAmharic: '1 ተሰሎንቄ', abbreviation: '1ተሰ', chapters: 5 },
  { name: '2 Thessalonians', nameAmharic: '2 ተሰሎንቄ', abbreviation: '2ተሰ', chapters: 3 },
  { name: '1 Timothy', nameAmharic: '1 ጢሞቴዎስ', abbreviation: '1ጢሞ', chapters: 6 },
  { name: '2 Timothy', nameAmharic: '2 ጢሞቴዎስ', abbreviation: '2ጢሞ', chapters: 4 },
  { name: 'Titus', nameAmharic: 'ጢጦስ', abbreviation: 'ጢጦ', chapters: 3 },
  { name: 'Philemon', nameAmharic: 'ፊልሞና', abbreviation: 'ፊልሞ', chapters: 1 },
  { name: 'Hebrews', nameAmharic: 'ዕብራውያን', abbreviation: 'ዕብ', chapters: 13 },
  { name: 'James', nameAmharic: 'ያዕቆብ', abbreviation: 'ያዕ', chapters: 5 },
  { name: '1 Peter', nameAmharic: '1 ጴጥሮስ', abbreviation: '1ጴጥ', chapters: 5 },
  { name: '2 Peter', nameAmharic: '2 ጴጥሮስ', abbreviation: '2ጴጥ', chapters: 3 },
  { name: '1 John', nameAmharic: '1 ዮሐንስ', abbreviation: '1ዮሐ', chapters: 5 },
  { name: '2 John', nameAmharic: '2 ዮሐንስ', abbreviation: '2ዮሐ', chapters: 1 },
  { name: '3 John', nameAmharic: '3 ዮሐንስ', abbreviation: '3ዮሐ', chapters: 1 },
  { name: 'Jude', nameAmharic: 'ይሁዳ', abbreviation: 'ይሁ', chapters: 1 },
  { name: 'Revelation', nameAmharic: 'ራእይ', abbreviation: 'ራእ', chapters: 22 },
];

// API Response interfaces
interface APIVerse {
  verse: number;
  text: string;
}

interface APIChapterResponse {
  book: string;
  chapter: number;
  verses: APIVerse[];
}

// Bible service class
class BibleService {
  private cache: Map<string, BibleVerse[]> = new Map();
  private bookListCache: any[] | null = null;

  // Get book abbreviation from name
  private getBookAbbreviation(bookName: string): string {
    const book = bibleBooks.find(
      b => b.name === bookName || b.nameAmharic === bookName
    );
    return book?.abbreviation || bookName;
  }

  // Fetch books from API
  async fetchBooks(): Promise<any[]> {
    if (this.bookListCache) {
      return this.bookListCache;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      this.bookListCache = data;
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  // Get verses for a specific chapter from API
  async getChapterVerses(
    version: string,
    book: string,
    chapter: number
  ): Promise<BibleVerse[]> {
    const cacheKey = `${version}-${book}-${chapter}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const bookAbbr = this.getBookAbbreviation(book);
      const url = `${API_BASE_URL}/books/${encodeURIComponent(bookAbbr)}/chapters/${chapter}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch chapter: ${response.statusText}`);
      }

      const data: APIChapterResponse = await response.json();
      
      // Transform API response to our format
      const verses: BibleVerse[] = data.verses.map((v: APIVerse) => ({
        book,
        chapter,
        verse: v.verse,
        text: v.text,
      }));

      // Cache the result
      this.cache.set(cacheKey, verses);
      return verses;
    } catch (error) {
      // Silently use fallback data if available (don't log error for expected failures)
      const fallbackKey = `${version}-${book}-${chapter}`;
      if (fallbackVerses[fallbackKey]) {
        console.info(`Using offline Bible data for ${book} ${chapter}`);
        return fallbackVerses[fallbackKey];
      }
      
      // Only log warning if no fallback available
      console.warn(`Bible API unavailable for ${book} ${chapter}. Try selecting John 3 or Psalms 23.`);
      
      // Return empty array on error
      return [];
    }
  }

  // Get a specific verse
  async getVerse(
    version: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<BibleVerse | null> {
    try {
      const bookAbbr = this.getBookAbbreviation(book);
      const url = `${API_BASE_URL}/books/${encodeURIComponent(bookAbbr)}/chapters/${chapter}/${verse}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch verse: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        book,
        chapter,
        verse: data.verse,
        text: data.text,
      };
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  }

  // Get a range of verses
  async getVerseRange(
    version: string,
    book: string,
    chapter: number,
    startVerse: number,
    endVerse: number
  ): Promise<BibleVerse[]> {
    const verses = await this.getChapterVerses(version, book, chapter);
    return verses.filter(v => v.verse >= startVerse && v.verse <= endVerse);
  }

  // Search the Bible
  async search(
    query: string,
    options?: {
      book?: string;
      testament?: 'old' | 'new';
      limit?: number;
    }
  ): Promise<BibleVerse[]> {
    try {
      const params = new URLSearchParams({ q: query });
      
      if (options?.book) {
        const bookAbbr = this.getBookAbbreviation(options.book);
        params.append('book', bookAbbr);
      }
      
      if (options?.testament) {
        params.append('testament', options.testament);
      }
      
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }

      const url = `${API_BASE_URL}/search?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform search results to our format
      return data.results?.map((result: any) => ({
        book: result.book || '',
        chapter: result.chapter || 0,
        verse: result.verse || 0,
        text: result.text || '',
      })) || [];
    } catch (error) {
      console.error('Error searching Bible:', error);
      return [];
    }
  }

  // Simpler search method that uses the existing search functionality
  async searchVerses(version: string, query: string, limit: number = 20): Promise<BibleVerse[]> {
    return this.search(query, { limit });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.bookListCache = null;
  }
}

export const bibleService = new BibleService();
*/
