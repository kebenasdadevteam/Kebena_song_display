import { useState, useEffect } from 'react';
import { Song } from '../types';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight, Play, Pause, Moon, Sun, Monitor, Eye, EyeOff, Type, Minus, Plus } from 'lucide-react';
import { displayStateService } from '../services/displayStateService';
import { toast } from 'sonner';
import { useWebSocket } from '../hooks/useWebSocket';

interface SongViewerProps {
  song: Song;
  onClose: () => void;
  background: string;
  roomId: string;
  onOpenDisplayWindow: () => Window | null;
  onSyncSongToDisplay?: (song: Song, slideIndex: number) => void;
  onClearDisplay?: () => void;
}

export function SongViewer({
  song,
  onClose,
  background,
  roomId,
  onOpenDisplayWindow,
  onSyncSongToDisplay,
  onClearDisplay,
}: Readonly<SongViewerProps>) {
  const SONG_BG_COLOR_KEY = 'display_song_background_color_v1';
  const SONG_TEXT_COLOR_KEY = 'display_song_text_color_v1';
  const SONG_FONT_SIZE_KEY = 'display_song_font_size_px_v1';
  const MIN_FONT_SIZE = 28;
  const MAX_FONT_SIZE = 100;

  const initialSongBackground = localStorage.getItem(SONG_BG_COLOR_KEY) || '#000000';
  const initialSongTextColor = localStorage.getItem(SONG_TEXT_COLOR_KEY) || '#ffffff';
  const initialSongFontSize = Number(localStorage.getItem(SONG_FONT_SIZE_KEY) || '56');

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [songBackgroundColor, setSongBackgroundColor] = useState(initialSongBackground);
  const [songTextColor, setSongTextColor] = useState(initialSongTextColor);
  const [songFontSize, setSongFontSize] = useState(
    Number.isFinite(initialSongFontSize)
      ? Math.min(Math.max(initialSongFontSize, MIN_FONT_SIZE), MAX_FONT_SIZE)
      : 56
  );
  const { sendMessage } = useWebSocket('control', roomId || 'default');

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
  }, [currentSlide, isDisplaying, background, songBackgroundColor, songTextColor, songFontSize]);

  useEffect(() => {
    localStorage.setItem(SONG_BG_COLOR_KEY, songBackgroundColor);
    localStorage.setItem(SONG_TEXT_COLOR_KEY, songTextColor);
    localStorage.setItem(SONG_FONT_SIZE_KEY, String(songFontSize));

    const channelName = `kebena-display-${roomId || 'default'}`;
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(channelName);
      channel.postMessage({ type: 'SET_SONG_BG_COLOR', color: songBackgroundColor });
      channel.postMessage({ type: 'SET_SONG_TEXT_COLOR', color: songTextColor });
      channel.postMessage({ type: 'SET_SONG_FONT_SIZE', size: songFontSize });
      channel.close();
    }

    sendMessage('song_background_changed', { color: songBackgroundColor });
    sendMessage('song_text_color_changed', { color: songTextColor });
    sendMessage('song_font_size_changed', { size: songFontSize });
  }, [roomId, songBackgroundColor, songTextColor, songFontSize]);

  const updateDisplay = async () => {
    await displayStateService.updateDisplayState({
      type: 'song',
      isVisible: true,
      songId: song.id,
      songData: song,
      songSlide: currentSlide,
      background,
    });

    const channelName = `kebena-display-${roomId || 'default'}`;
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(channelName);
      channel.postMessage({ type: 'SET_SONG_BG_COLOR', color: songBackgroundColor });
      channel.postMessage({ type: 'SET_SONG_TEXT_COLOR', color: songTextColor });
      channel.postMessage({ type: 'SET_SONG_FONT_SIZE', size: songFontSize });
      channel.close();
    }

    sendMessage('select_song', { song });
    sendMessage('change_slide', { slideIndex: currentSlide });

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
    sendMessage('clear_song', {});
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
        sendMessage('clear_song', {});
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

  const toggleThemePreset = () => {
    if (isDarkMode) {
      setSongBackgroundColor('#ffffff');
      setSongTextColor('#111111');
      setIsDarkMode(false);
      return;
    }

    setSongBackgroundColor('#000000');
    setSongTextColor('#ffffff');
    setIsDarkMode(true);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev < song.lyrics.length - 1 ? prev + 1 : prev
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  };

  const bgColor = songBackgroundColor;
  const textColor = songTextColor;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Control Bar */}
      <div className="bg-black/90 text-white p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div className="min-w-0">
          <h2 className="text-base sm:text-xl truncate">{song.titleAmharic}</h2>
          <p className="text-xs sm:text-sm text-gray-300 truncate">{song.titleEnglish} - #{song.number}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap overflow-x-auto pb-1 w-full sm:w-auto">
          {/* Slide Counter */}
          <span className="text-sm px-3 py-1 bg-white/10 rounded">
            {currentSlide + 1} / {song.lyrics.length}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wide text-white/70">Song BG</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] text-black border-white/40 hover:bg-white/10"
              onClick={() => setSongBackgroundColor('#000000')}
            >
              Black
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] text-black border-white/40 hover:bg-white/10"
              onClick={() => setSongBackgroundColor('#ffffff')}
            >
              White
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wide text-white/70">Text</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] text-black border-white/40 hover:bg-white/10"
              onClick={() => setSongTextColor('#000000')}
            >
              Black
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px] text-black border-white/40 hover:bg-white/10"
              onClick={() => setSongTextColor('#ffffff')}
            >
              White
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Type className="size-3.5 text-white/80" />
            <span className="text-[11px] uppercase tracking-wide text-white/70">Font</span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 text-black border-white/40 hover:bg-white/10"
              onClick={() => setSongFontSize((prev) => Math.max(prev - 2, MIN_FONT_SIZE))}
              title="Decrease font size"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="text-sm min-w-10 text-center">{songFontSize}px</span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 text-black border-white/40 hover:bg-white/10"
              onClick={() => setSongFontSize((prev) => Math.min(prev + 2, MAX_FONT_SIZE))}
              title="Increase font size"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

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
            onClick={toggleThemePreset}
            className="text-white hover:bg-white/20"
            title="Quick dark/light preset"
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
        className="flex-1 flex items-center justify-center p-4 sm:p-8 transition-colors duration-300"
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
      <div className="bg-black/90 p-3 sm:p-6 flex justify-center items-center gap-2 sm:gap-4">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          size="lg"
          variant="outline"
          className="text-black border-white hover:bg-white/20"
        >
          <ChevronLeft className="size-6 mr-2" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2 overflow-x-auto max-w-[42vw] sm:max-w-none px-1">
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
          className="text-black border-white hover:bg-white/20"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-6 ml-2" />
        </Button>
      </div>

      {/* Keyboard Hints */}
      <div className="hidden md:block absolute bottom-24 right-8 bg-black/70 text-white text-xs p-3 rounded">
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