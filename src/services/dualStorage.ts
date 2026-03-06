import { Song } from '../types';
import { songAPI } from './api';

const LOCAL_STORAGE_KEY = 'kebena_church_songs';
const LAST_SYNC_KEY = 'kebena_songs_last_sync';
const LEGACY_STORAGE_KEYS = ['kebena_local_songs_cache_v1'];

/**
 * Dual Storage Service
 * Saves songs to both localStorage (fallback) and database (when available)
 * Fetches from database first, falls back to localStorage
 */
class DualStorageService {
  /**
   * Get all songs - tries database first, falls back to localStorage
   */
  async getAllSongs(): Promise<Song[]> {
    const localSongs = this.getFromLocalStorage();

    try {
      // Try to fetch from database first
      const response = await songAPI.getAllSongs();
      
      if (response.success && response.songs) {
        console.log('✅ Loaded songs from database');
        // Merge with local backup so offline-imported songs are not lost
        const merged = this.mergeSongs(response.songs, localSongs);
        this.saveToLocalStorage(merged);
        return merged;
      }
    } catch (error) {
      console.warn('⚠️ Database unavailable, using local storage');
    }
    
    // Fallback to localStorage
    return localSongs;
  }

  /**
   * Add a new song - saves to both storage locations
   */
  async addSong(song: Omit<Song, 'id'>): Promise<Song> {
    let savedSong: Song;
    
    // Try to save to database
    try {
      const response = await songAPI.createSong(song);
      
      if (response.success && response.song) {
        console.log('✅ Song saved to database');
        savedSong = response.song;
      } else {
        // If database save fails, generate local ID
        savedSong = {
          ...song,
          id: Date.now()
        };
      }
    } catch (error) {
      console.warn('⚠️ Database unavailable, saving locally only');
      // Generate local ID
      savedSong = {
        ...song,
        id: Date.now()
      };
    }
    
    // Always save to localStorage as backup
    const localSongs = this.getFromLocalStorage();
    localSongs.push(savedSong);
    this.saveToLocalStorage(localSongs);
    
    return savedSong;
  }

  /**
   * Update existing song - updates both storage locations
   */
  async updateSong(id: number, updates: Partial<Song>): Promise<boolean> {
    let dbSuccess = false;
    
    // Try to update in database
    try {
      const response = await songAPI.updateSong(id, updates);
      dbSuccess = response.success;
      
      if (dbSuccess) {
        console.log('✅ Song updated in database');
      }
    } catch (error) {
      console.warn('⚠️ Database unavailable, updating locally only');
    }
    
    // Always update in localStorage
    const localSongs = this.getFromLocalStorage();
    const index = localSongs.findIndex(s => s.id === id);
    
    if (index !== -1) {
      localSongs[index] = { ...localSongs[index], ...updates };
      this.saveToLocalStorage(localSongs);
      return true;
    }
    
    return dbSuccess;
  }

  /**
   * Delete a song - removes from both storage locations
   */
  async deleteSong(id: number): Promise<boolean> {
    // Try to delete from database
    try {
      await songAPI.deleteSong(id);
      console.log('✅ Song deleted from database');
    } catch (error) {
      console.warn('⚠️ Database unavailable, deleting locally only');
    }
    
    // Always delete from localStorage
    const localSongs = this.getFromLocalStorage();
    const filtered = localSongs.filter(s => s.id !== id);
    this.saveToLocalStorage(filtered);
    
    return true;
  }

  /**
   * Import multiple songs (e.g., from XML)
   */
  async importSongs(songs: Song[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    
    for (const song of songs) {
      try {
        await this.addSong(song);
        success++;
      } catch (error) {
        console.error('Error importing song:', error);
        failed++;
      }
    }
    
    return { success, failed };
  }

  /**
   * Sync local songs to database (when connection is restored)
   */
  async syncToDatabase(): Promise<{ synced: number; failed: number }> {
    const localSongs = this.getFromLocalStorage();
    let synced = 0;
    let failed = 0;
    
    try {
      // Get database songs to check what needs syncing
      const dbResponse = await songAPI.getAllSongs();
      
      if (!dbResponse.success) {
        throw new Error('Database not available');
      }
      
      const dbSongs = dbResponse.songs || [];
      const dbIds = new Set(dbSongs.map(s => s.id));
      
      // Sync songs that don't exist in database
      for (const localSong of localSongs) {
        if (!dbIds.has(localSong.id)) {
          try {
            await songAPI.createSong(localSong);
            synced++;
          } catch (error) {
            failed++;
          }
        }
      }
      
      // Update last sync time
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      
    } catch (error) {
      console.error('Sync failed:', error);
    }
    
    return { synced, failed };
  }

  /**
   * Save songs to localStorage
   */
  private saveToLocalStorage(songs: Song[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(songs));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get songs from localStorage
   */
  private getFromLocalStorage(): Song[] {
    this.migrateLegacySongs();

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return [];
  }

  private mergeSongs(primarySongs: Song[], secondarySongs: Song[]): Song[] {
    const mergedMap = new Map<number, Song>();

    for (const song of secondarySongs) {
      mergedMap.set(song.id, song);
    }

    for (const song of primarySongs) {
      mergedMap.set(song.id, song);
    }

    return Array.from(mergedMap.values());
  }

  private migrateLegacySongs(): void {
    try {
      const currentRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const currentSongs: Song[] = currentRaw ? JSON.parse(currentRaw) : [];
      let mergedSongs = [...currentSongs];
      let changed = false;

      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (!legacyRaw) continue;

        const legacySongs: Song[] = JSON.parse(legacyRaw);
        mergedSongs = this.mergeSongs(mergedSongs, legacySongs);
        localStorage.removeItem(legacyKey);
        changed = true;
      }

      if (changed) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedSongs));
      }
    } catch (error) {
      console.error('Error migrating legacy songs:', error);
    }
  }

  /**
   * Get last sync timestamp
   */
  getLastSyncTime(): Date | null {
    const timestamp = localStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? new Date(timestamp) : null;
  }

  /**
   * Clear all local storage (use with caution!)
   */
  clearLocalStorage(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LAST_SYNC_KEY);
  }

  /**
   * Check if database is available
   */
  async isDatabaseAvailable(): Promise<boolean> {
    try {
      const response = await songAPI.getAllSongs();
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

export const dualStorageService = new DualStorageService();
