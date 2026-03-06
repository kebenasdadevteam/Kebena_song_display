import { useState, useEffect } from 'react';
import { Song } from '../types';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight, Play, Pause, Moon, Sun, Monitor, Eye, EyeOff } from 'lucide-react';
import { displayStateService } from '../services/displayStateService';
import { toast } from 'sonner';

interface SongViewerProps {
  song: Song;
  onClose: () => void;
  background: string;
  onOpenDisplayWindow: () => Window | null;
  onSyncSongToDisplay?: (song: Song, slideIndex: number) => void;
  onClearDisplay?: () => void;
}

export function SongViewer({
  song,
  onClose,
  background,
  onOpenDisplayWindow,
  onSyncSongToDisplay,
  onClearDisplay,
}: Readonly<SongViewerProps>) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDisplaying, setIsDisplaying] = useState(false);

  // Initialize display service
  useEffect(() => {
    const initializeDisplay = async () => {
      await displayStateService.initialize();
    };
    initializeDisplay();
  }, []);

  // Update display when slide changes while displaying
  useEffect(() => {
    if (isDisplaying) {
      updateDisplay();
    }
  }, [currentSlide, isDisplaying, background]);

  const updateDisplay = async () => {
    await displayStateService.updateDisplayState({
      type: 'song',
      isVisible: true,
      songId: song.id,
      songData: song,
      songSlide: currentSlide,
      background: isDarkMode ? background : '#ffffff',
    });

    onSyncSongToDisplay?.(song, currentSlide);
  };

  const handleShowOnDisplay = async () => {
    setIsDisplaying(true);
    await updateDisplay();
    toast.success('Song displayed on screen', {
      description: `${song.titleEnglish} - Slide ${currentSlide + 1}`,
    });
  };

  const handleHideFromDisplay = async () => {
    setIsDisplaying(false);
    await displayStateService.updateDisplayState({
      type: 'none',
      isVisible: false,
      background,
    });
    onClearDisplay?.();
    toast.info('Display cleared');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isDisplaying) {
        displayStateService.updateDisplayState({
          type: 'none',
          isVisible: false,
          background,
        });
      }
    };
  }, [isDisplaying, background]);

  // Auto-slide timer
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => 
        prev < song.lyrics.length - 1 ? prev + 1 : 0
      );
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, [isAutoPlay, song.lyrics.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(song.lyrics.length - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleShowOnDisplay();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleHideFromDisplay();
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay(prev => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        openPresentationMode();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleHideFromDisplay();
      }
    };

    globalThis.addEventListener('keydown', handleKeyPress);
    return () => globalThis.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, song.lyrics.length]);

  // Auto-open extended screen and show first slide when song opens
  useEffect(() => {
    openPresentationMode();
    handleShowOnDisplay();
  }, []);

  const openPresentationMode = () => {
    onOpenDisplayWindow();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev < song.lyrics.length - 1 ? prev + 1 : prev
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  };

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
        <p>PgUp / PgDn: Navigate slides</p>
        <p>Home / End: First / Last slide</p>
        <p>Enter: Show on display</p>
        <p>H: Hide from display</p>
        <p>Space: Play/Pause</p>
        <p>P: Open display screen</p>
        <p>Esc: Hide + Close viewer</p>
      </div>
    </div>
  );
}