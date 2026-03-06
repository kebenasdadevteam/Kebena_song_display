import { useState, useEffect } from 'react';
import { displayStateService } from '../services/displayStateService';
import { DisplayState, Song } from '../types';
import { songAPI } from '../services/api';

interface BibleDisplayProps {
  background: string;
}

export function BibleDisplay({ background }: BibleDisplayProps) {
  const [displayState, setDisplayState] = useState<DisplayState>({
    type: 'none',
    isVisible: false,
    background,
  });
  const [isReady, setIsReady] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    // Initialize and wait for ready state
    const initializeDisplay = async () => {
      console.log('[BibleDisplay] Initializing display service...');
      await displayStateService.initialize();
      
      // Get current state after initialization
      const currentState = displayStateService.getCurrentState();
      console.log('[BibleDisplay] Current state on load:', currentState);
      
      if (currentState && currentState.type !== 'none') {
        setDisplayState(currentState);
        
        // Load song data if needed
        if (currentState.type === 'song' && currentState.songId) {
          await loadSongData(currentState.songId);
        }
      }
      
      setIsReady(true);
      console.log('[BibleDisplay] Display service ready');
    };

    initializeDisplay();
    
    const unsubscribe = displayStateService.subscribe((state) => {
      console.log('[BibleDisplay] Received state update:', state);
      setDisplayState(state);
      
      // Load song data if displaying a song
      if (state.type === 'song' && state.songId) {
        loadSongData(state.songId);
      } else if (state.type === 'none') {
        setCurrentSong(null);
      }
    });

    return () => {
      unsubscribe();
      // Don't cleanup here - other windows might still be using it
    };
  }, []);

  // Load song data when needed
  const loadSongData = async (songId: number) => {
    try {
      const response = await songAPI.getAllSongs();
      if (response.success && response.songs) {
        const song = response.songs.find(s => s.id === songId);
        if (song) {
          setCurrentSong(song);
        }
      }
    } catch (error) {
      console.error('[BibleDisplay] Error loading song:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc key - Clear display
      if (e.key === 'Escape') {
        e.preventDefault();
        displayStateService.updateDisplayState({
          type: 'none',
          isVisible: false,
          background: displayState.background || background,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayState.background, background]);

  const currentBackground = displayState.background || background;

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center p-12"
      style={{ 
        background: currentBackground,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1a1a2e' // Fallback color
      }}
    >
      {displayState.isVisible && displayState.type === 'bible' && displayState.bibleText ? (
        /* Bible Display */
        <div className="max-w-6xl w-full text-center text-white space-y-8">
          {/* Reference */}
          <div 
            className="text-4xl font-semibold mb-10" 
            style={{ 
              textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
              color: '#ffffff'
            }}
          >
            {displayState.bibleBook} {displayState.bibleChapter}:
            {displayState.bibleVerseStart === displayState.bibleVerseEnd
              ? displayState.bibleVerseStart
              : `${displayState.bibleVerseStart}-${displayState.bibleVerseEnd}`
            }
          </div>

          {/* Verse Text */}
          <div 
            className="text-5xl leading-relaxed whitespace-pre-line font-medium"
            style={{ 
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
              color: '#ffffff'
            }}
          >
            {displayState.bibleText}
          </div>
        </div>
      ) : displayState.isVisible && displayState.type === 'song' && displayState.songId && currentSong ? (
        /* Song Display */
        <div className="max-w-6xl w-full text-center text-white">
          {/* Song Title */}
          <div 
            className="text-4xl font-semibold mb-10"
            style={{ 
              textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
              color: '#ffffff'
            }}
          >
            {currentSong.titleAmharic}
          </div>

          {/* Song Lyrics - Current Slide */}
          <div 
            className="text-5xl leading-relaxed whitespace-pre-line font-medium"
            style={{ 
              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
              color: '#ffffff'
            }}
          >
            {currentSong.lyrics[displayState.songSlide || 0]}
          </div>

          {/* Slide Indicator */}
          <div 
            className="mt-12 text-2xl"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              color: '#ffffff',
              opacity: 0.7
            }}
          >
            {(displayState.songSlide || 0) + 1} / {currentSong.lyrics.length}
          </div>
        </div>
      ) : (
        /* Show wallpaper when nothing is displayed */
        <div 
          className="text-center text-white"
          style={{ 
            opacity: 0.4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
          }}
        >
          <div className="text-7xl mb-6">📖</div>
          <div className="text-5xl font-semibold mb-3">Kebena Church</div>
          <div className="text-3xl">የቀበና ቤተክርስትያን</div>
          <div className="text-xl mt-6 opacity-70">Worship Display</div>
        </div>
      )}
    </div>
  );
}