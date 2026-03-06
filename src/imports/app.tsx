import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { SongList } from "./components/SongList";
import { SongViewer } from "./components/SongViewer";
import { AdminPanel } from "./components/AdminPanel";
import { LoginScreen } from "./components/LoginScreen";
import { Button } from "./components/ui/button";
import { Settings, LogOut, Loader2, Smartphone } from "lucide-react";
import { Song, User as UserType } from "./types";
import { toast, Toaster } from "sonner";
import churchLogo from "../assets/3887ae57771394e51301a4417cbc2775554606f6.png";
import { authAPI, songAPI } from "./services/api";
import { initialSongs } from "./data/songs";
import { useWebSocket } from "./hooks/useWebSocket";
import { MobileControl } from "./components/MobileControl";

const LOCAL_SONGS_KEY = "kebena_local_songs_cache_v1";

const loadLocalSongs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_SONGS_KEY);
    if (!raw) return initialSongs;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialSongs;
    return parsed as Song[];
  } catch {
    return initialSongs;
  }
};

const saveLocalSongs = (songsToSave: Song[]) => {
  try {
    localStorage.setItem(LOCAL_SONGS_KEY, JSON.stringify(songsToSave));
  } catch {
    // Ignore storage errors
  }
};

const mergeSongs = (primary: Song[], secondary: Song[]) => {
  const merged = new Map<number, Song>();
  primary.forEach((song) => merged.set(song.id, song));
  secondary.forEach((song) => {
    if (!merged.has(song.id)) {
      merged.set(song.id, song);
    }
  });
  return Array.from(merged.values());
};

const getNextSongId = (songsList: Song[]) => {
  if (songsList.length === 0) return 1;
  return Math.max(...songsList.map((song) => song.id)) + 1;
};

const ROOM_ID_KEY = "kebena_active_room_id_v1";
const BG_MODE_PREFIX = "display_bg_mode_";

const resolveRoomId = (paramRoomId?: string) => {
  if (paramRoomId) return paramRoomId;
  const cached = localStorage.getItem(ROOM_ID_KEY);
  if (cached) return cached;
  const newRoomId = `room-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(ROOM_ID_KEY, newRoomId);
  return newRoomId;
};

export default function App() {
  const params = useParams();
  const roomId = resolveRoomId(params.roomId);

  const [songs, setSongs] = useState<Song[]>(() => loadLocalSongs());
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingSongId, setEditingSongId] = useState<number | null>(null);
  const [showMobileControl, setShowMobileControl] = useState(false);
  const [background, setBackground] = useState<string>("#1a1a2e");
  const [extendedScreenBackground, setExtendedScreenBackground] =
    useState<string>("");
  const [displayBackgroundMode, setDisplayBackgroundMode] = useState<
    "presentation" | "custom"
  >("presentation");
  const displayChannelRef = useRef<BroadcastChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sendMessage: sendControlMessage, isConnected: isControlConnected } =
    useWebSocket("control", roomId, (message) => {
      if (message.type === "control_message" && message.data?.text) {
        toast.info(message.data.text);
      }

      if (message.type === "sync_state" && message.data?.song) {
        setSelectedSong(message.data.song);
      }
    });

  // Load saved background settings
  useEffect(() => {
    const savedBg = localStorage.getItem(`display_bg_${roomId}`) || "";
    setExtendedScreenBackground(savedBg);
    const savedMode = localStorage.getItem(`${BG_MODE_PREFIX}${roomId}`);
    if (savedMode === "custom" || savedMode === "presentation") {
      setDisplayBackgroundMode(savedMode);
    }
  }, [roomId]);

  // Setup BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    displayChannelRef.current?.close();
    displayChannelRef.current = new BroadcastChannel(
      `kebena-display-${roomId}`,
    );
    return () => {
      displayChannelRef.current?.close();
      displayChannelRef.current = null;
    };
  }, [roomId]);

  // Get effective display background
  const getEffectiveDisplayBackground = () => {
    if (displayBackgroundMode === "custom" && extendedScreenBackground) {
      return extendedScreenBackground;
    }
    return background;
  };

  // Handle background changes and broadcast to all windows
  useEffect(() => {
    const effectiveBackground = getEffectiveDisplayBackground();

    // Save to localStorage
    localStorage.setItem(
      `display_bg_${roomId}`,
      effectiveBackground || "#000000",
    );

    // Send via WebSocket
    sendControlMessage("background_changed", {
      background: effectiveBackground || "#000000",
      mode: displayBackgroundMode,
    });

    // Broadcast to all windows (DisplayPage, AdminPanel preview, etc.)
    displayChannelRef.current?.postMessage({
      type: "SET_BACKGROUND",
      background: effectiveBackground || "#000000",
      mode: displayBackgroundMode,
    });
  }, [
    displayBackgroundMode,
    extendedScreenBackground,
    background,
    roomId,
    sendControlMessage,
  ]);

  // Sync initial state when WebSocket connects
  useEffect(() => {
    if (isControlConnected) {
      const effectiveBackground = getEffectiveDisplayBackground();
      sendControlMessage("background_changed", {
        background: effectiveBackground || "#000000",
        mode: displayBackgroundMode,
      });
      if (selectedSong) {
        sendControlMessage("select_song", { song: selectedSong });
      }
    }
  }, [
    isControlConnected,
    displayBackgroundMode,
    selectedSong,
    sendControlMessage,
  ]);

  const handleExtendedBackgroundChange = (bg: string) => {
    setExtendedScreenBackground(bg);
    if (bg) {
      setDisplayBackgroundMode("custom");
      localStorage.setItem(`${BG_MODE_PREFIX}${roomId}`, "custom");
    } else {
      setDisplayBackgroundMode("presentation");
      localStorage.setItem(`${BG_MODE_PREFIX}${roomId}`, "presentation");
    }
  };

  const handleBackgroundChange = (bg: string) => {
    setBackground(bg);
    setDisplayBackgroundMode("presentation");
    localStorage.setItem(`${BG_MODE_PREFIX}${roomId}`, "presentation");
  };

  useEffect(() => {
    if (selectedSong) {
      sendControlMessage("select_song", { song: selectedSong });
    } else {
      sendControlMessage("clear_song", {});
    }
  }, [selectedSong, sendControlMessage]);

  // Load songs from backend on component mount
  useEffect(() => {
    const loadSongs = async () => {
      try {
        console.log("🔄 Loading songs from backend...");
        const backendSongs = await songAPI.getAllSongs();
        console.log("✅ Songs loaded from backend:", backendSongs);

        const formattedSongs: Song[] = backendSongs.map((song: any) => ({
          id: song.id,
          number: song.number,
          category: song.category,
          titleAmharic: song.titleAmharic || song.title_amharic || "",
          titleEnglish: song.titleEnglish || song.title_english || "",
          lyrics: Array.isArray(song.lyrics) ? song.lyrics : [],
          metadata: song.metadata || {},
        }));

        const cachedSongs = loadLocalSongs();
        const mergedSongs = mergeSongs(formattedSongs, cachedSongs);
        setSongs(mergedSongs);
        saveLocalSongs(mergedSongs);
        setError(null);
      } catch (error: any) {
        console.error("❌ Failed to load songs:", error);
        const fallbackSongs = loadLocalSongs();
        setSongs(fallbackSongs);
        setError(`Failed to load songs: ${error.message}`);
        toast.error("Could not load songs", {
          description: error.message || "Please check backend connection",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      const user = authAPI.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  // Show login screen if not logged in
  if (!currentUser && !loading) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-amber-800">Loading songs from database...</p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";
  const hymnalSongs = songs.filter((song) => song.category === "hymnal");
  const localSongs = songs.filter((song) => song.category === "local");

  const handleAddSong = async (songData: Omit<Song, "id">) => {
    try {
      const result = await songAPI.createSong(songData);

      if (result.success) {
        const updatedSongs = await songAPI.getAllSongs();
        const formattedSongs: Song[] = updatedSongs.map((song: any) => ({
          id: song.id,
          number: song.number,
          category: song.category,
          titleAmharic: song.titleAmharic || song.title_amharic || "",
          titleEnglish: song.titleEnglish || song.title_english || "",
          lyrics: Array.isArray(song.lyrics) ? song.lyrics : [],
          metadata: song.metadata || {},
        }));

        const cachedSongs = loadLocalSongs();
        const mergedSongs = mergeSongs(formattedSongs, cachedSongs);
        setSongs(mergedSongs);
        saveLocalSongs(mergedSongs);
        toast.success("Song added successfully!", {
          description: `${songData.titleEnglish} has been added to ${
            songData.category === "hymnal" ? "Hymnal" : "Local Songs"
          }`,
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to add song:", error);
      const localSongs = loadLocalSongs();
      const newLocalSong: Song = {
        id: getNextSongId(localSongs),
        ...songData,
      };
      const updatedLocalSongs = [...localSongs, newLocalSong];
      setSongs(updatedLocalSongs);
      saveLocalSongs(updatedLocalSongs);
      toast.error("Failed to add song", {
        description:
          error.message ||
          "Saved locally. Backend not available for database save.",
      });
    }
  };

  const handleEditSong = async (id: number, updatedSong: Partial<Song>) => {
    try {
      await songAPI.updateSong(id, updatedSong);

      const updatedSongs = await songAPI.getAllSongs();
      const formattedSongs: Song[] = updatedSongs.map((song: any) => ({
        id: song.id,
        number: song.number,
        category: song.category,
        titleAmharic: song.titleAmharic || song.title_amharic || "",
        titleEnglish: song.titleEnglish || song.title_english || "",
        lyrics: Array.isArray(song.lyrics) ? song.lyrics : [],
        metadata: song.metadata || {},
      }));

      const cachedSongs = loadLocalSongs().map((song) =>
        song.id === id ? { ...song, ...updatedSong } : song,
      );
      const mergedSongs = mergeSongs(formattedSongs, cachedSongs);
      setSongs(mergedSongs);
      saveLocalSongs(mergedSongs);
      toast.success("Song updated successfully!");
    } catch (error: any) {
      console.error("❌ Failed to update song:", error);
      const localSongs = loadLocalSongs().map((song) =>
        song.id === id ? { ...song, ...updatedSong } : song,
      );
      setSongs(localSongs);
      saveLocalSongs(localSongs);
      toast.error("Failed to update song", {
        description:
          error.message ||
          "Saved locally. Backend not available for database update.",
      });
    }
  };

  const handleDeleteSong = async (id: number) => {
    try {
      await songAPI.deleteSong(id);

      const updatedSongs = await songAPI.getAllSongs();
      const formattedSongs: Song[] = updatedSongs.map((song: any) => ({
        id: song.id,
        number: song.number,
        category: song.category,
        titleAmharic: song.titleAmharic || song.title_amharic || "",
        titleEnglish: song.titleEnglish || song.title_english || "",
        lyrics: Array.isArray(song.lyrics) ? song.lyrics : [],
        metadata: song.metadata || {},
      }));

      const cachedSongs = loadLocalSongs().filter((song) => song.id !== id);
      const mergedSongs = mergeSongs(formattedSongs, cachedSongs).filter(
        (song) => song.id !== id,
      );
      setSongs(mergedSongs);
      saveLocalSongs(mergedSongs);
      if (selectedSong?.id === id) {
        setSelectedSong(null);
      }

      toast.success("Song deleted successfully!");
    } catch (error: any) {
      console.error("❌ Failed to delete song:", error);
      const localSongs = loadLocalSongs().filter((song) => song.id !== id);
      setSongs(localSongs);
      saveLocalSongs(localSongs);
      toast.error("Failed to delete song", {
        description:
          error.message ||
          "Deleted locally. Backend not available for database delete.",
      });
    }
  };

  const handleStartEdit = (song: Song) => {
    setEditingSongId(song.id);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setSelectedSong(null);
    setShowAdminPanel(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header
          className="text-white p-4 shadow-lg flex-shrink-0"
          style={{ background: "linear-gradient(to right, #865014, #E0AE3F)" }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={churchLogo}
                alt="Kebena Church Logo"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl">Kebena Church Song Display</h1>
                <p className="text-sm" style={{ color: "#F6EBD8" }}>
                  የቀበና ቤተክርስትያን የመዝሙር ማሳያ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-sm">{currentUser?.name}</p>
                <p className="text-xs" style={{ color: "#F6EBD8" }}>
                  {isAdmin ? "Administrator" : "User"}
                </p>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="bg-white/10 text-white border-white/50 hover:bg-white/30 hover:border-white"
                >
                  <Settings className="size-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileControl(true)}
                className="bg-white/10 text-white border-white/50 hover:bg-white/30 hover:border-white"
              >
                <Smartphone className="size-4 mr-2" />
                Mobile Control
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-white/10 text-white border-white/50 hover:bg-white/30 hover:border-white"
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            role="alert"
          >
            <div className="flex items-center">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Connection Issue</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => globalThis.location.reload()}
                  className="text-red-500 underline text-sm mt-1"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {selectedSong ? (
            /* Song Viewer */
            <SongViewer
              song={selectedSong}
              onClose={() => setSelectedSong(null)}
              background={background}
              onSendMessage={sendControlMessage}
            />
          ) : (
            /* Split View: Hymnal & Local Songs */
            <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
              {/* Hymnal Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
                <div
                  className="mb-4 pb-4 border-b flex-shrink-0"
                  style={{ borderColor: "#865014" }}
                >
                  <h2 className="text-xl" style={{ color: "#865014" }}>
                    Hymnal Songs{" "}
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {hymnalSongs.length} songs
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600">ውዳሴ መዝሙሮች</p>
                </div>
                <SongList
                  songs={hymnalSongs}
                  onSelectSong={setSelectedSong}
                  isAdmin={isAdmin}
                  onEditSong={handleEditSong}
                  onDeleteSong={handleDeleteSong}
                  onStartEdit={handleStartEdit}
                />
              </div>

              {/* Local Songs Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
                <div
                  className="mb-4 pb-4 border-b flex-shrink-0"
                  style={{ borderColor: "#E0AE3F" }}
                >
                  <h2 className="text-xl" style={{ color: "#E0AE3F" }}>
                    Local Songs{" "}
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {localSongs.length} songs
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600">ሀገርኛ መዝሙሮች</p>
                </div>
                <SongList
                  songs={localSongs}
                  onSelectSong={setSelectedSong}
                  isAdmin={isAdmin}
                  onEditSong={handleEditSong}
                  onDeleteSong={handleDeleteSong}
                  onStartEdit={handleStartEdit}
                />
              </div>
            </div>
          )}
        </div>

        {/* Admin Panel */}
        {isAdmin && showAdminPanel && (
          <AdminPanel
            songs={songs}
            onAddSong={handleAddSong}
            onEditSong={handleEditSong}
            onDeleteSong={handleDeleteSong}
            onClose={() => setShowAdminPanel(false)}
            background={background}
            onBackgroundChange={handleBackgroundChange}
            extendedScreenBackground={extendedScreenBackground}
            onExtendedScreenBackgroundChange={handleExtendedBackgroundChange}
            editingSongId={editingSongId}
            roomId={roomId}
            displayBackgroundMode={displayBackgroundMode}
          />
        )}

        <MobileControl
          isOpen={showMobileControl}
          onClose={() => setShowMobileControl(false)}
          currentSong={selectedSong || undefined}
          roomId={roomId}
          extendedBackground={getEffectiveDisplayBackground()}
        />
      </div>
    </>
  );
}
