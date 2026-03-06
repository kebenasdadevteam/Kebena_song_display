/**
 * Kebena Church Song Display Plugin
 * 
 * A standalone component for displaying church songs in a presentation-style format.
 * Supports both Amharic and English titles, slide navigation, auto-play, and keyboard shortcuts.
 * 
 * Usage:
 * import { SongDisplay } from './plugin/lyric/song-display';
 * 
 * <SongDisplay
 *   song={songObject}
 *   onClose={() => handleClose()}
 *   background="#1a1a2e"
 * />
 */

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Moon, Sun, Monitor, Eye, EyeOff } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

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

export interface DisplayState {
  type: 'song' | 'bible' | 'none';
  isVisible: boolean;
  songId?: number;
  songSlide?: number;
  background?: string;
  timestamp?: number;
}

interface SongDisplayProps {
  song: Song;
  onClose: () => void;
  background?: string;
  displayStateService?: any;
}

// ============================================================================
// BUTTON COMPONENT (Simplified UI Component)
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

function Button({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================================
// SONG DISPLAY COMPONENT
// ============================================================================

export function SongDisplay({ 
  song, 
  onClose, 
  background = '#1a1a2e',
  displayStateService 
}: SongDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [presentationWindow, setPresentationWindow] = useState<Window | null>(null);

  // ============================================================================
  // DISPLAY STATE SERVICE INTEGRATION (Optional)
  // ============================================================================

  useEffect(() => {
    if (displayStateService) {
      const initializeDisplay = async () => {
        await displayStateService.initialize();
      };
      initializeDisplay();
    }
  }, [displayStateService]);

  useEffect(() => {
    if (isDisplaying && displayStateService) {
      updateDisplay();
    }
  }, [currentSlide, isDisplaying, background]);

  const updateDisplay = async () => {
    if (displayStateService) {
      await displayStateService.updateDisplayState({
        type: 'song',
        isVisible: true,
        songId: song.id,
        songSlide: currentSlide,
        background: isDarkMode ? background : '#ffffff',
      });
    }
  };

  const handleShowOnDisplay = async () => {
    setIsDisplaying(true);
    if (displayStateService) {
      await updateDisplay();
    }
  };

  const handleHideFromDisplay = async () => {
    setIsDisplaying(false);
    if (displayStateService) {
      await displayStateService.updateDisplayState({
        type: 'none',
        isVisible: false,
        background,
      });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isDisplaying && displayStateService) {
        displayStateService.updateDisplayState({
          type: 'none',
          isVisible: false,
          background,
        });
      }
    };
  }, [isDisplaying, background, displayStateService]);

  // ============================================================================
  // AUTO-PLAY TIMER
  // ============================================================================

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => 
        prev < song.lyrics.length - 1 ? prev + 1 : 0
      );
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, [isAutoPlay, song.lyrics.length]);

  // ============================================================================
  // KEYBOARD NAVIGATION
  // ============================================================================

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay(prev => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        openPresentationMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, song.lyrics.length]);

  // ============================================================================
  // PRESENTATION MODE (SEPARATE WINDOW)
  // ============================================================================

  useEffect(() => {
    if (presentationWindow && !presentationWindow.closed) {
      presentationWindow.postMessage({
        type: 'SLIDE_UPDATE',
        slide: currentSlide,
        content: song.lyrics[currentSlide],
        background: isDarkMode ? background : '#ffffff',
        textColor: isDarkMode ? '#ffffff' : '#1a1a2e'
      }, '*');
    }
  }, [currentSlide, isDarkMode, background, presentationWindow]);

  useEffect(() => {
    return () => {
      if (presentationWindow && !presentationWindow.closed) {
        presentationWindow.close();
      }
    };
  }, [presentationWindow]);

  const openPresentationMode = () => {
    if (presentationWindow && !presentationWindow.closed) {
      presentationWindow.close();
    }

    const newWindow = window.open('', 'PresentationMode', 'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no');
    
    if (newWindow) {
      const bgColor = isDarkMode ? background : '#ffffff';
      const textColor = isDarkMode ? '#ffffff' : '#1a1a2e';
      
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Presentation - ${song.titleEnglish}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: ${bgColor};
                color: ${textColor};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
                overflow: hidden;
              }
              #slide-content {
                max-width: 90%;
                text-align: center;
                font-size: 3rem;
                line-height: 1.6;
                white-space: pre-line;
                text-shadow: ${isDarkMode ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'};
                padding: 2rem;
              }
            </style>
          </head>
          <body>
            <div id="slide-content">${song.lyrics[currentSlide]}</div>
            <script>
              window.addEventListener('message', (event) => {
                if (event.data.type === 'SLIDE_UPDATE') {
                  document.body.style.backgroundColor = event.data.background;
                  document.body.style.color = event.data.textColor;
                  document.getElementById('slide-content').textContent = event.data.content;
                  document.getElementById('slide-content').style.textShadow = 
                    event.data.textColor === '#ffffff' ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none';
                }
              });
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
      setPresentationWindow(newWindow);
    }
  };

  // ============================================================================
  // NAVIGATION FUNCTIONS
  // ============================================================================

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev < song.lyrics.length - 1 ? prev + 1 : prev
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const bgColor = isDarkMode ? background : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a2e';

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Control Bar */}
      <div className="bg-black/90 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl">{song.titleAmharic}</h2>
          <p className="text-sm text-gray-300">{song.titleEnglish} - #{song.number}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Slide Counter */}
          <span className="text-sm px-3 py-1 bg-white/10 rounded">
            {currentSlide + 1} / {song.lyrics.length}
          </span>

          {/* Show/Hide on Display Toggle */}
          {displayStateService && (
            <>
              {isDisplaying ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHideFromDisplay}
                  className="text-white hover:bg-white/20"
                  title="Hide from Display"
                >
                  <EyeOff className="size-5 mr-1" />
                  <span className="text-xs">Hide</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowOnDisplay}
                  className="text-white hover:bg-white/20"
                  title="Show on Display"
                >
                  <Eye className="size-5 mr-1" />
                  <span className="text-xs">Show</span>
                </Button>
              )}
            </>
          )}

          {/* Presentation Mode Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openPresentationMode}
            className="text-white hover:bg-white/20"
            title="Open Presentation Mode (P)"
          >
            <Monitor className="size-5" />
          </Button>

          {/* Auto-play Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="text-white hover:bg-white/20"
          >
            {isAutoPlay ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-white hover:bg-white/20"
          >
            {isDarkMode ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>

      {/* Slide Display */}
      <div 
        className="flex-1 flex items-center justify-center p-8 transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-5xl w-full text-center">
          <div 
            className="whitespace-pre-line transition-colors duration-300"
            style={{ 
              color: textColor,
              fontSize: '2.5rem',
              lineHeight: '1.6',
              textShadow: isDarkMode ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
            }}
          >
            {song.lyrics[currentSlide]}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-black/90 p-6 flex justify-center items-center gap-4">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          size="lg"
          variant="outline"
          className="text-white border-white hover:bg-white/20"
        >
          <ChevronLeft className="size-6 mr-2" />
          Previous
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {song.lyrics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={nextSlide}
          disabled={currentSlide === song.lyrics.length - 1}
          size="lg"
          variant="outline"
          className="text-white border-white hover:bg-white/20"
        >
          Next
          <ChevronRight className="size-6 ml-2" />
        </Button>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute bottom-24 right-8 bg-black/70 text-white text-xs p-3 rounded">
        <p>← → : Navigate slides</p>
        <p>Space: Play/Pause</p>
        <p>P: Presentation Mode</p>
        <p>Esc: Close viewer</p>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SongDisplay;
