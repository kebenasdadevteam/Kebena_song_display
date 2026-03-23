import { useEffect, useState } from "react";
import { DisplayScreen } from "./display-screen";
import { Loader2 } from "lucide-react";

export default function DisplayPage() {
  const ROOM_ID_KEY = "kebena_active_room_id_v1";
  const ACTIVE_BACKGROUND_KEY = "display_background_active_v1";
  const LEGACY_UPLOADED_BACKGROUND_KEY = "display_background_uploaded_v1";
  const SONG_BACKGROUND_COLOR_KEY = "display_song_background_color_v1";
  const SONG_TEXT_COLOR_KEY = "display_song_text_color_v1";
  const SONG_FONT_SIZE_KEY = "display_song_font_size_px_v1";
  const [roomId, setRoomId] = useState<string>("");
  const [background, setBackground] = useState("#000000");
  const [songBackgroundColor, setSongBackgroundColor] = useState("#000000");
  const [songTextColor, setSongTextColor] = useState("#ffffff");
  const [songFontSize, setSongFontSize] = useState(56);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract room ID from URL
    const path = globalThis.location.pathname;
    const pathParts = path.split("/");
    const id =
      pathParts.at(-1) ||
      localStorage.getItem(ROOM_ID_KEY) ||
      "default";

    if (id && !localStorage.getItem(ROOM_ID_KEY)) {
      localStorage.setItem(ROOM_ID_KEY, id);
    }
    setRoomId(id);

    // Load background from room-specific key, then active fallback keys.
    const savedBg =
      localStorage.getItem(`display_bg_${id}`) ||
      localStorage.getItem(ACTIVE_BACKGROUND_KEY) ||
      localStorage.getItem("display_background") ||
      localStorage.getItem(LEGACY_UPLOADED_BACKGROUND_KEY) ||
      "#000000";
    setBackground(savedBg);

    const savedSongBg =
      localStorage.getItem(`display_song_bg_${id}`) ||
      localStorage.getItem(SONG_BACKGROUND_COLOR_KEY) ||
      '#000000';
    setSongBackgroundColor(savedSongBg);

    const savedSongText =
      localStorage.getItem(`display_song_text_${id}`) ||
      localStorage.getItem(SONG_TEXT_COLOR_KEY) ||
      '#ffffff';
    setSongTextColor(savedSongText);

    const savedSongFontSize = Number(
      localStorage.getItem(`display_song_font_${id}`) ||
      localStorage.getItem(SONG_FONT_SIZE_KEY) ||
      '56'
    );
    setSongFontSize(Number.isFinite(savedSongFontSize) ? savedSongFontSize : 56);

    // Listen for background updates
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "SET_BACKGROUND") {
        setBackground(e.data.background);
        localStorage.setItem(`display_bg_${id}`, e.data.background);
        localStorage.setItem(ACTIVE_BACKGROUND_KEY, e.data.background);
        localStorage.setItem("display_background", e.data.background);
      }

      if (e.data?.type === 'SET_SONG_BG_COLOR') {
        setSongBackgroundColor(e.data.color);
        localStorage.setItem(`display_song_bg_${id}`, e.data.color);
        localStorage.setItem(SONG_BACKGROUND_COLOR_KEY, e.data.color);
      }

      if (e.data?.type === 'SET_SONG_TEXT_COLOR') {
        setSongTextColor(e.data.color);
        localStorage.setItem(`display_song_text_${id}`, e.data.color);
        localStorage.setItem(SONG_TEXT_COLOR_KEY, e.data.color);
      }

      if (e.data?.type === 'SET_SONG_FONT_SIZE') {
        const size = Number(e.data.size);
        if (Number.isFinite(size)) {
          setSongFontSize(size);
          localStorage.setItem(`display_song_font_${id}`, String(size));
          localStorage.setItem(SONG_FONT_SIZE_KEY, String(size));
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === `display_song_bg_${id}` || event.key === SONG_BACKGROUND_COLOR_KEY) {
        setSongBackgroundColor(event.newValue || '#000000');
      }

      if (event.key === `display_song_text_${id}` || event.key === SONG_TEXT_COLOR_KEY) {
        setSongTextColor(event.newValue || '#ffffff');
      }

      if (event.key === `display_song_font_${id}` || event.key === SONG_FONT_SIZE_KEY) {
        const nextSize = Number(event.newValue || '56');
        if (Number.isFinite(nextSize)) {
          setSongFontSize(nextSize);
        }
      }
    };

    globalThis.addEventListener("message", handleMessage);
    globalThis.addEventListener("storage", handleStorage);

    setLoading(false);

    return () => {
      globalThis.removeEventListener("message", handleMessage);
      globalThis.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading display screen...</p>
        </div>
      </div>
    );
  }

  return (
    <DisplayScreen
      roomId={roomId}
      initialBackground={background}
      initialSongBackgroundColor={songBackgroundColor}
      initialSongTextColor={songTextColor}
      initialSongFontSize={songFontSize}
    />
  );
}
