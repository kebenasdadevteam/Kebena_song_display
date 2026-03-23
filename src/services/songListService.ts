import { SongList, SongListItem } from "../types";

const STORAGE_KEY = "kebena_song_lists";
const ACTIVE_LIST_KEY = "kebena_active_song_list";

/**
 * Song List Service
 * Manages song lists/playlists for worship services
 * Saves to localStorage (and optionally to database in future)
 */
class SongListService {
  /**
   * Get all song lists
   */
  getAllSongLists(): SongList[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error reading song lists:", error);
    }
    return [];
  }

  /**
   * Get song list by ID
   */
  getSongListById(id: string): SongList | null {
    const lists = this.getAllSongLists();
    return lists.find((list) => list.id === id) || null;
  }

  /**
   * Get song lists by creator
   */
  getSongListsByCreator(creatorName: string): SongList[] {
    const lists = this.getAllSongLists();
    return lists.filter((list) => list.createdBy === creatorName);
  }

  /**
   * Create new song list
   */
  createSongList(data: {
    name: string;
    date: string;
    createdBy: string;
    items?: SongListItem[];
  }): SongList {
    const newList: SongList = {
      id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      date: data.date,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: data.items || [],
      isActive: false,
    };

    const lists = this.getAllSongLists();
    lists.push(newList);
    this.saveSongLists(lists);

    return newList;
  }

  /**
   * Update song list
   */
  updateSongList(id: string, updates: Partial<SongList>): boolean {
    const lists = this.getAllSongLists();
    const index = lists.findIndex((list) => list.id === id);

    if (index === -1) return false;

    lists[index] = {
      ...lists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveSongLists(lists);
    return true;
  }

  /**
   * Delete song list
   */
  deleteSongList(id: string): boolean {
    const lists = this.getAllSongLists();
    const filtered = lists.filter((list) => list.id !== id);

    if (filtered.length === lists.length) return false;

    this.saveSongLists(filtered);

    // If deleted list was active, clear active list
    const activeListId = localStorage.getItem(ACTIVE_LIST_KEY);
    if (activeListId === id) {
      localStorage.removeItem(ACTIVE_LIST_KEY);
    }

    return true;
  }

  /**
   * Add song to list
   */
  addSongToList(listId: string, item: Omit<SongListItem, "id">): boolean {
    const list = this.getSongListById(listId);
    if (!list) return false;

    const newItem: SongListItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    list.items.push(newItem);
    return this.updateSongList(listId, { items: list.items });
  }

  /**
   * Remove song from list
   */
  removeSongFromList(listId: string, itemId: string): boolean {
    const list = this.getSongListById(listId);
    if (!list) return false;

    list.items = list.items.filter((item) => item.id !== itemId);
    return this.updateSongList(listId, { items: list.items });
  }

  /**
   * Reorder songs in list
   */
  reorderSongs(listId: string, items: SongListItem[]): boolean {
    return this.updateSongList(listId, { items });
  }

  /**
   * Set active song list (for current service)
   */
  setActiveSongList(listId: string | null): boolean {
    const lists = this.getAllSongLists();

    // Clear all active flags
    lists.forEach((list) => {
      list.isActive = false;
    });

    if (listId) {
      const list = lists.find((l) => l.id === listId);
      if (list) {
        list.isActive = true;
        localStorage.setItem(ACTIVE_LIST_KEY, listId);
      } else {
        return false;
      }
    } else {
      localStorage.removeItem(ACTIVE_LIST_KEY);
    }

    this.saveSongLists(lists);
    return true;
  }

  /**
   * Get active song list
   */
  getActiveSongList(): SongList | null {
    const activeListId = localStorage.getItem(ACTIVE_LIST_KEY);
    if (!activeListId) return null;
    return this.getSongListById(activeListId);
  }

  /**
   * Duplicate song list
   */
  duplicateSongList(
    listId: string,
    newName: string,
    createdBy: string,
  ): SongList | null {
    const original = this.getSongListById(listId);
    if (!original) return null;

    const duplicate: SongList = {
      ...original,
      id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newName,
      createdBy: createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
      items: original.items.map((item) => ({
        ...item,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })),
    };

    const lists = this.getAllSongLists();
    lists.push(duplicate);
    this.saveSongLists(lists);

    return duplicate;
  }

  /**
   * Export song list to JSON
   */
  exportSongList(listId: string): string | null {
    const list = this.getSongListById(listId);
    if (!list) return null;
    return JSON.stringify(list, null, 2);
  }

  /**
   * Import song list from JSON
   */
  importSongList(jsonString: string, createdBy: string): SongList | null {
    try {
      const data = JSON.parse(jsonString);
      const imported: SongList = {
        ...data,
        id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdBy: createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: false,
      };

      const lists = this.getAllSongLists();
      lists.push(imported);
      this.saveSongLists(lists);

      return imported;
    } catch (error) {
      console.error("Error importing song list:", error);
      return null;
    }
  }

  /**
   * Save song lists to localStorage
   */
  private saveSongLists(lists: SongList[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error("Error saving song lists:", error);
    }
  }

  /**
   * Clear all song lists (use with caution!)
   */
  clearAllSongLists(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_LIST_KEY);
  }
}

export const songListService = new SongListService();
