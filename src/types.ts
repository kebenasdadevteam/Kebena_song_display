export interface User {
  id: string;
  name: string;
  role: "admin" | "song_leader" | "user";
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
  category: "hymnal" | "local";
  titleAmharic: string;
  titleEnglish: string;
  lyrics: string[];
  metadata?: SongMetadata;
}

// Song List / Playlist types
export interface SongListItem {
  id: string;
  songId: number;
  songNumber: string;
  songTitle: string;
  songTitleAmharic: string;
  selectedSlides?: number[]; // Specific slides/paragraphs, or undefined for entire song
  notes?: string;
}

export interface SongList {
  id: string;
  name: string;
  date: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  items: SongListItem[];
  isActive?: boolean;
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
  type: "song" | "bible" | "none";
  isVisible: boolean;

  // Song display
  songId?: number;
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
