export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

// Song types
export interface SongMetadata {
  creator?: string;
  uploader?: string;
  updatedDate?: string;
}

export interface Song {
  id: number;
  number: string;
  category: 'hymnal' | 'local';
  titleAmharic: string;
  titleEnglish: string;
  lyrics: string[];
  metadata?: SongMetadata;
}

// BIBLE FEATURE - Commented out for song-only version
// // Bible types
// export interface BibleVerse {
//   book: string;
//   chapter: number;
//   verse: number;
//   text: string;
// }

// export interface BibleBook {
//   name: string;
//   nameAmharic: string;
//   abbreviation?: string;
//   chapters: number;
// }

// export interface BibleVersion {
//   id: string;
//   name: string;
//   nameAmharic: string;
// }

export interface DisplayState {
  type: 'song' | 'bible' | 'none';
  isVisible: boolean;
  
  // Song display
  songId?: number;
  songData?: Song;
  songSlide?: number;
  
  // Bible display
  bibleVersion?: string;
  bibleBook?: string;
  bibleChapter?: number;
  bibleVerseStart?: number;
  bibleVerseEnd?: number;
  bibleText?: string;
  
  background?: string;
  timestamp?: number;
}