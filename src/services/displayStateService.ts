import { DisplayState } from '../types';

const DISPLAY_STATE_KEY = 'display_state';

class DisplayStateService {
  private listeners = new Set<(state: DisplayState) => void>();
  private currentState: DisplayState = {
    type: 'none',
    isVisible: false,
    background: '#1a1a2e',
  };
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    const savedState = localStorage.getItem(DISPLAY_STATE_KEY);
    if (savedState) {
      try {
        this.currentState = JSON.parse(savedState) as DisplayState;
      } catch {
        localStorage.removeItem(DISPLAY_STATE_KEY);
      }
    }

    window.addEventListener('storage', this.handleStorageSync);
    this.isInitialized = true;
  }

  private handleStorageSync = (event: StorageEvent) => {
    if (event.key !== DISPLAY_STATE_KEY || !event.newValue) {
      return;
    }

    try {
      const syncedState = JSON.parse(event.newValue) as DisplayState;
      this.currentState = syncedState;
      this.notify(syncedState);
    } catch {
      // Ignore malformed payloads from other tabs/windows
    }
  };

  async updateDisplayState(state: DisplayState) {
    const nextState: DisplayState = {
      ...state,
      timestamp: Date.now(),
    };

    this.currentState = nextState;
    localStorage.setItem(DISPLAY_STATE_KEY, JSON.stringify(nextState));
    this.notify(nextState);

    return nextState;
  }

  subscribe(callback: (state: DisplayState) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getCurrentState(): DisplayState {
    return this.currentState;
  }

  private notify(state: DisplayState) {
    this.listeners.forEach((listener) => listener(state));
  }
}

export const displayStateService = new DisplayStateService();
