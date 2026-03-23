import { useMemo, useState, useEffect } from "react";
import { displayStateService } from "../services/displayStateService";
import { Song } from "../types";
import { useWebSocket } from "../hooks/useWebSocket";

interface DisplayScreenProps {
  readonly roomId: string;
  readonly initialBackground?: string;
  readonly initialSongBackgroundColor?: string;
  readonly initialSongTextColor?: string;
  readonly initialSongFontSize?: number;
}

export function DisplayScreen({
  roomId,
  initialBackground = "#000000",
  initialSongBackgroundColor = "#000000",
  initialSongTextColor = "#ffffff",
  initialSongFontSize = 56,
}: Readonly<DisplayScreenProps>) {
  const normalizeBackgroundValue = (value: string) => {
    const trimmed = (value || "").trim();
    const urlMatch = trimmed.match(/^url\((['"]?)(.*?)\1\)\s*(.*)$/i);

    // Support legacy values like: url('...') center/cover no-repeat
    if (urlMatch && urlMatch[2]) {
      return urlMatch[2].trim();
    }

    // Support legacy values like: https://... center/cover no-repeat
    if (/^(https?:|data:|blob:|\/uploads\/)/i.test(trimmed)) {
      return trimmed.split(/\s+/)[0];
    }

    return trimmed;
  };

  const isImageValue = (value: string) => {
    const normalized = (value || "").trim();
    return (
      /^(https?:|data:|blob:|\/uploads\/)/i.test(normalized) ||
      /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(normalized)
    );
  };

  const [songs, setSongs] = useState<Song[]>([]);
  const [displayState, setDisplayState] = useState(displayStateService.getCurrentState());
  const [background, setBackground] = useState(initialBackground);
  const [songBackgroundColor, setSongBackgroundColor] = useState(initialSongBackgroundColor);
  const [songTextColor, setSongTextColor] = useState(initialSongTextColor);
  const [songFontSize, setSongFontSize] = useState(initialSongFontSize);
  const [socketSong, setSocketSong] = useState<Song | null>(null);
  const [socketSlide, setSocketSlide] = useState(0);

  useWebSocket("display", roomId, (message) => {
    if (!message) return;

    if (message.type === "select_song" && message.data?.song) {
      setSocketSong(message.data.song as Song);
      setSocketSlide(0);
      return;
    }

    if (message.type === "current_song" && message.data?.song) {
      setSocketSong(message.data.song as Song);
      setSocketSlide(message.data.currentSlide ?? 0);
      return;
    }

    if (message.type === "change_slide" && typeof message.data?.slideIndex === "number") {
      setSocketSlide(message.data.slideIndex);
      return;
    }

    if (message.type === "clear_song") {
      setSocketSong(null);
      setSocketSlide(0);
      return;
    }

    if (message.type === "background_changed" && message.data?.background) {
      setBackground(message.data.background);
      return;
    }

    if (message.type === 'song_background_changed' && message.data?.color) {
      setSongBackgroundColor(message.data.color);
      return;
    }

    if (message.type === 'song_text_color_changed' && message.data?.color) {
      setSongTextColor(message.data.color);
      return;
    }

    if (message.type === 'song_font_size_changed' && Number.isFinite(Number(message.data?.size))) {
      setSongFontSize(Number(message.data.size));
    }
  });

  const loadSongsFromStorage = () => {
    try {
      const primaryRaw = localStorage.getItem("kebena_church_songs");
      const legacyRaw = localStorage.getItem("kebena_local_songs_cache_v1");

      const primarySongs: Song[] = primaryRaw ? JSON.parse(primaryRaw) : [];
      const legacySongs: Song[] = legacyRaw ? JSON.parse(legacyRaw) : [];

      const mergedMap = new Map<number, Song>();
      legacySongs.forEach((song) => mergedMap.set(song.id, song));
      primarySongs.forEach((song) => mergedMap.set(song.id, song));

      setSongs(Array.from(mergedMap.values()));
    } catch {
      setSongs([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      await displayStateService.initialize();
      setDisplayState(displayStateService.getCurrentState());
      loadSongsFromStorage();
    };

    init();

    const unsubscribe = displayStateService.subscribe((nextState) => {
      setDisplayState(nextState);
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "kebena_church_songs" || event.key === "kebena_local_songs_cache_v1") {
        loadSongsFromStorage();
      }
    };

    globalThis.addEventListener("storage", handleStorage);

    return () => {
      unsubscribe();
      globalThis.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Handle background changes from BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(`kebena-display-${roomId}`);

    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data?.type === "SET_BACKGROUND") {
        setBackground(event.data.background || initialBackground);
      }

      if (event.data?.type === 'SET_SONG_BG_COLOR') {
        setSongBackgroundColor(event.data.color || initialSongBackgroundColor);
      }

      if (event.data?.type === 'SET_SONG_TEXT_COLOR') {
        setSongTextColor(event.data.color || initialSongTextColor);
      }

      if (event.data?.type === 'SET_SONG_FONT_SIZE') {
        const size = Number(event.data.size || initialSongFontSize);
        if (Number.isFinite(size)) {
          setSongFontSize(size);
        }
      }
    };

    channel.addEventListener("message", handleChannelMessage);

    return () => {
      channel.removeEventListener("message", handleChannelMessage);
      channel.close();
    };
  }, [roomId, initialBackground, initialSongBackgroundColor, initialSongTextColor, initialSongFontSize]);

  // Handle background changes from parent window
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "SET_BACKGROUND") {
        setBackground(e.data.background);
      }

      if (e.data?.type === 'SET_SONG_BG_COLOR') {
        setSongBackgroundColor(e.data.color);
      }

      if (e.data?.type === 'SET_SONG_TEXT_COLOR') {
        setSongTextColor(e.data.color);
      }

      if (e.data?.type === 'SET_SONG_FONT_SIZE') {
        const size = Number(e.data.size);
        if (Number.isFinite(size)) {
          setSongFontSize(size);
        }
      }
    };

    globalThis.addEventListener("message", handleMessage);
    return () => globalThis.removeEventListener("message", handleMessage);
  }, []);

  // Sync background when initialBackground changes
  useEffect(() => {
    setBackground(initialBackground);
  }, [initialBackground]);

  useEffect(() => {
    setSongBackgroundColor(initialSongBackgroundColor);
  }, [initialSongBackgroundColor]);

  useEffect(() => {
    setSongTextColor(initialSongTextColor);
  }, [initialSongTextColor]);

  useEffect(() => {
    setSongFontSize(initialSongFontSize);
  }, [initialSongFontSize]);

  useEffect(() => {
    if (displayState.background) {
      setBackground(displayState.background);
    }
  }, [displayState.background]);

  const resolvedBackground = normalizeBackgroundValue(background || initialBackground);
  const persistedRoomBackground = normalizeBackgroundValue(
    localStorage.getItem(`display_bg_${roomId}`) || ""
  );
  const persistedActiveBackground = normalizeBackgroundValue(
    localStorage.getItem("display_background_active_v1") ||
      localStorage.getItem("display_background") ||
      ""
  );

  const effectiveImageBackground = isImageValue(resolvedBackground)
    ? resolvedBackground
    : isImageValue(persistedRoomBackground)
      ? persistedRoomBackground
      : isImageValue(persistedActiveBackground)
        ? persistedActiveBackground
        : isImageValue(normalizeBackgroundValue(initialBackground))
          ? normalizeBackgroundValue(initialBackground)
          : "";

  const currentSong = useMemo(() => {
    if (socketSong?.lyrics?.length) {
      return socketSong;
    }

    if (displayState.type !== "song") {
      return null;
    }

    if (displayState.songData?.lyrics?.length) {
      return displayState.songData;
    }

    if (!displayState.songId) {
      return null;
    }

    return songs.find((song) => song.id === displayState.songId) || null;
  }, [socketSong, songs, displayState.type, displayState.songId, displayState.songData]);

  const currentSlide = useMemo(() => {
    if (!currentSong) return 0;
    if (socketSong) {
      return Math.min(Math.max(socketSlide, 0), currentSong.lyrics.length - 1);
    }
    const requestedSlide = displayState.songSlide ?? 0;
    return Math.min(Math.max(requestedSlide, 0), currentSong.lyrics.length - 1);
  }, [socketSong, socketSlide, currentSong, displayState.songSlide]);

  const isSongActive = Boolean(currentSong);
  const displayBackgroundColor = isSongActive
    ? songBackgroundColor
    : effectiveImageBackground
      ? "#000000"
      : resolvedBackground || "#000000";
  const displayBackgroundImage = !isSongActive && effectiveImageBackground
    ? `url(${effectiveImageBackground})`
    : "none";

  useEffect(() => {
    const handleKeyboardControl = async (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        await displayStateService.updateDisplayState({
          type: "none",
          isVisible: false,
          background: resolvedBackground,
        });
        return;
      }

      if (!currentSong) {
        return;
      }

      const isNext =
        event.key === ">" ||
        event.key === "." ||
        event.code === "Period" ||
        event.code === "NumpadDecimal";
      const isPrev =
        event.key === "<" ||
        event.key === "," ||
        event.code === "Comma";

      if (!isNext && !isPrev) {
        return;
      }

      event.preventDefault();

      const nextSlide = isNext
        ? Math.min(currentSlide + 1, currentSong.lyrics.length - 1)
        : Math.max(currentSlide - 1, 0);

      // When song state is socket-driven, update local socket slide immediately.
      if (socketSong) {
        setSocketSlide(nextSlide);
      }

      await displayStateService.updateDisplayState({
        ...displayState,
        type: "song",
        isVisible: true,
        songId: currentSong.id,
        songData: currentSong,
        songSlide: nextSlide,
        background: resolvedBackground,
      });
    };

    globalThis.addEventListener("keydown", handleKeyboardControl);
    return () => globalThis.removeEventListener("keydown", handleKeyboardControl);
  }, [currentSong, currentSlide, displayState, resolvedBackground, socketSong]);

  const normalizedSongTextColor = (songTextColor || "").trim().toLowerCase();
  const displaySongTextColor =
    normalizedSongTextColor === "#000000" ||
    normalizedSongTextColor === "#000" ||
    normalizedSongTextColor === "black"
      ? "#000000"
      : "#ffffff";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-all duration-500 p-4 overflow-hidden"
      style={{
        backgroundColor: displayBackgroundColor,
        backgroundImage: displayBackgroundImage,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >
      {/* Slide Content */}
      {currentSong ? (
        <div className="w-full max-w-6xl px-4 md:px-8 text-center relative z-10">
          <div
            className="text-white text-3xl md:text-5xl lg:text-6xl leading-relaxed whitespace-pre-line"
            style={{
              color: displaySongTextColor,
              fontSize: `${songFontSize}px`,
              textShadow: "none",
            }}
          >
            {currentSong.lyrics[currentSlide]}
          </div>

          {/* Slide Indicator */}
          <div className="absolute bottom-8 right-8 text-white/70 text-xl">
            {currentSlide + 1} / {currentSong.lyrics.length}
          </div>

          {/* Song Info */}
          <div className="absolute bottom-8 left-8 text-white/50 text-lg hidden md:block">
            {currentSong.titleEnglish}
          </div>
        </div>
      ) : (
        /* Keep display clean when no song is active */
        <></>
      )}
    </div>
  );
}
