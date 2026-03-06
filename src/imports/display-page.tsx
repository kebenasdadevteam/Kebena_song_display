import { useEffect, useState } from "react";
import { DisplayScreen } from "./display-screen";
import { Loader2 } from "lucide-react";

export default function DisplayPage() {
  const ROOM_ID_KEY = "kebena_active_room_id_v1";
  const ACTIVE_BACKGROUND_KEY = "display_background_active_v1";
  const LEGACY_UPLOADED_BACKGROUND_KEY = "display_background_uploaded_v1";
  const SONG_BACKGROUND_COLOR_KEY = "display_song_background_color_v1";
  const [roomId, setRoomId] = useState<string>("");
  const [background, setBackground] = useState("#000000");
  const [songBackgroundColor, setSongBackgroundColor] = useState("#000000");
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
    };

    globalThis.addEventListener("message", handleMessage);

    setLoading(false);

    return () => globalThis.removeEventListener("message", handleMessage);
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
    />
  );
}
