import { useState, useEffect, useRef } from 'react';
import { SongList } from './components/SongList';
import { SongViewer } from './components/SongViewer';
import { AdminPanel } from './components/AdminPanel';
import { LoginScreen } from './components/LoginScreen';
import { MobileControl } from './components/MobileControl';
import { XMLImporter } from './components/XMLImporter';
import { Button } from './components/ui/button';
import { Settings, LogOut, Monitor, Maximize, Smartphone, Upload } from 'lucide-react';
import { Song, User as UserType } from './types';
import { initialSongs } from './data/songs';
import { toast, Toaster } from 'sonner';
import churchLogo from './assets/3887ae57771394e51301a4417cbc2775554606f6.png';
import defaultBackgroundImage from './assets/background.jpg';
import { dualStorageService } from './services/dualStorage';
import { useWebSocket } from './hooks/useWebSocket';
import { settingsAPI } from './services/api';

const ACTIVE_BACKGROUND_KEY = 'display_background_active_v1';
const LEGACY_UPLOADED_BACKGROUND_KEY = 'display_background_uploaded_v1';
const SONG_BACKGROUND_COLOR_KEY = 'display_song_background_color_v1';

export default function App() {
  const resolveRoomId = () => {
    const params = new URLSearchParams(globalThis.location.search);
    const queryRoom = params.get('room');
    if (queryRoom) return queryRoom;

    const pathParts = globalThis.location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'control' && pathParts[1]) {
      return pathParts[1];
    }

    const saved = localStorage.getItem('church_room_id');
    if (saved) return saved;

    return `room_${Date.now()}`;
  };

  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [extendedScreenWindow, setExtendedScreenWindow] = useState<Window | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMobileControl, setShowMobileControl] = useState(false);
  const [showXMLImporter, setShowXMLImporter] = useState(false);
  const [roomId] = useState<string>(resolveRoomId);
  const [background, setBackground] = useState<string>(() => {
    // Load active background from the best available local source.
    const saved =
      localStorage.getItem(ACTIVE_BACKGROUND_KEY) ||
      localStorage.getItem('display_background') ||
      localStorage.getItem(LEGACY_UPLOADED_BACKGROUND_KEY);
    return saved || defaultBackgroundImage;
  });
  const [songBackgroundColor, setSongBackgroundColor] = useState<string>(() => {
    const saved = localStorage.getItem(SONG_BACKGROUND_COLOR_KEY);
    return saved || '#000000';
  });
  const [isLoading, setIsLoading] = useState(true);
  const lastSentSongIdRef = useRef<number | null>(null);

  const { sendMessage: sendControlMessage, isConnected: isWsConnected } = useWebSocket(
    'control',
    roomId
  );
  // BIBLE FEATURE - Commented out for song-only version
  // const [activeTab, setActiveTab] = useState<'songs' | 'bible'>('songs');
  // const [viewMode, setViewMode] = useState<'control' | 'display'>('control');

  // Save and broadcast background changes for the active display room
  useEffect(() => {
    localStorage.setItem('church_room_id', roomId);
    localStorage.setItem(ACTIVE_BACKGROUND_KEY, background);
    localStorage.setItem('display_background', background);
    localStorage.setItem(`display_bg_${roomId}`, background);

    if (isWsConnected) {
      sendControlMessage('background_changed', {
        background,
      });
    }

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(`kebena-display-${roomId}`);
      channel.postMessage({
        type: 'SET_BACKGROUND',
        background,
      });
      channel.close();
    }
  }, [background, roomId, isWsConnected, sendControlMessage]);

  // BIBLE FEATURE - Commented out for song-only version
  // // Check URL for display mode
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const mode = params.get('mode');
  //   if (mode === 'display') {
  //     setViewMode('display');
  //   }
  // }, []);

  // Load songs from database when user logs in
  useEffect(() => {
    if (currentUser) {
      loadSongsFromDatabase();
    }
  }, [currentUser]);

  // Load persisted background setting from backend after login.
  useEffect(() => {
    if (!currentUser) return;

    let cancelled = false;

    const loadBackgroundSetting = async () => {
      try {
        const response = await settingsAPI.getSettings();
        const settings = response?.settings || {};
        const persistedBackground =
          settings.display_background_image || settings.display_background;
        const persistedSongBackground = settings.display_song_background_color;

        if (!cancelled && typeof persistedBackground === 'string' && persistedBackground.trim()) {
          setBackground(persistedBackground.trim());
        }

        if (
          !cancelled &&
          typeof persistedSongBackground === 'string' &&
          persistedSongBackground.trim()
        ) {
          setSongBackgroundColor(persistedSongBackground.trim());
        }
      } catch {
        // Keep local fallback when backend settings are unavailable.
      }
    };

    loadBackgroundSetting();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // Save and broadcast song-only background color for active room.
  useEffect(() => {
    localStorage.setItem(SONG_BACKGROUND_COLOR_KEY, songBackgroundColor);
    localStorage.setItem(`display_song_bg_${roomId}`, songBackgroundColor);

    if (isWsConnected) {
      sendControlMessage('song_background_changed', {
        color: songBackgroundColor,
      });
    }

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(`kebena-display-${roomId}`);
      channel.postMessage({
        type: 'SET_SONG_BG_COLOR',
        color: songBackgroundColor,
      });
      channel.close();
    }
  }, [songBackgroundColor, roomId, isWsConnected, sendControlMessage]);

  const loadSongsFromDatabase = async () => {
    try {
      setIsLoading(true);
      // Use dual storage service which tries database first, then falls back to localStorage
      const loadedSongs = await dualStorageService.getAllSongs();
      setSongs(loadedSongs);
      
      if (loadedSongs.length > 0) {
        const dbAvailable = await dualStorageService.isDatabaseAvailable();
        if (dbAvailable) {
          toast.success('Songs loaded from database', {
            description: `Loaded ${loadedSongs.length} songs`
          });
        } else {
          toast.info('Using local storage', {
            description: `Loaded ${loadedSongs.length} songs from local storage`
          });
        }
      } else {
        // If no songs, use initial songs as fallback
        setSongs(initialSongs);
        toast.info('Using sample data', {
          description: 'No songs found. Using sample data.'
        });
      }
    } catch (error: any) {
      console.error('Error loading songs:', error);
      // Fallback to initial songs
      setSongs(initialSongs);
      toast.warning('Using sample data', {
        description: 'Could not load songs. Using sample data.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show login screen if not logged in
  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  // Display Mode - Full screen for projection
  // BIBLE FEATURE - Commented out for song-only version
  // if (viewMode === 'display') {
  //   return (
  //     <>
  //       <Toaster position="top-right" />
  //       <BibleDisplay background={background} />
  //     </>
  //   );
  // }

  // Control Mode - Main application
  const isAdmin = currentUser.role === 'admin';
  const hymnalSongs = songs.filter(song => song.category === 'hymnal');
  const localSongs = songs.filter(song => song.category === 'local');

  const handleAddSong = async (song: Omit<Song, 'id'>) => {
    try {
      // Use dual storage service (saves to both localStorage and database)
      const newSong = await dualStorageService.addSong(song);
      
      // Update local state
      setSongs([...songs, newSong]);
      
      toast.success('Song added successfully!', {
        description: `${song.titleEnglish} has been saved`
      });
    } catch (error: any) {
      console.error('Error adding song:', error);
      toast.error('Failed to save song', {
        description: error.message || 'Could not save song'
      });
    }
  };

  const handleEditSong = async (id: number, updatedSong: Partial<Song>) => {
    try {
      // Use dual storage service
      const success = await dualStorageService.updateSong(id, updatedSong);
      
      if (success) {
        // Update local state
        setSongs(songs.map(song => 
          song.id === id ? { ...song, ...updatedSong } : song
        ));
        
        toast.success('Song updated successfully!');
      } else {
        toast.error('Failed to update song');
      }
    } catch (error: any) {
      console.error('Error updating song:', error);
      toast.error('Failed to update song', {
        description: error.message || 'Could not update song'
      });
    }
  };

  const handleDeleteSong = async (id: number) => {
    try {
      const song = songs.find(s => s.id === id);
      
      // Use dual storage service
      const success = await dualStorageService.deleteSong(id);
      
      if (success) {
        // Update local state
        setSongs(songs.filter(song => song.id !== id));
        if (selectedSong?.id === id) {
          setSelectedSong(null);
        }
        
        if (song) {
          toast.success('Song deleted', {
            description: `${song.titleEnglish} has been removed`
          });
        }
      } else {
        toast.error('Failed to delete song');
      }
    } catch (error: any) {
      console.error('Error deleting song:', error);
      toast.error('Failed to delete song', {
        description: error.message || 'Could not delete song'
      });
    }
  };

  const handleImportComplete = (importedSongs: Song[]) => {
    // Reload songs to include newly imported ones
    loadSongsFromDatabase();
  };

  const openDisplayWindow = () => {
    const displayUrl = `${globalThis.location.origin}/display/${roomId}`;
    const windowRef = globalThis.open(displayUrl, 'ChurchDisplay', 'fullscreen=yes');

    if (windowRef) {
      setExtendedScreenWindow(windowRef);
      return windowRef;
    }

    toast.error('Please allow popups to open display screen');
    return null;
  };

  const handleSelectSong = (song: Song) => {
    if (!extendedScreenWindow || extendedScreenWindow.closed) {
      openDisplayWindow();
    }

    setSelectedSong(song);
  };

  const handleCloseSongViewer = () => {
    setSelectedSong(null);
  };

  const handleBackgroundChange = (nextBackground: string) => {
    const normalized = nextBackground.trim();
    const urlMatch = normalized.match(/^url\((['"]?)(.*?)\1\)\s*(.*)$/i);
    const parsedBackground = urlMatch?.[2]?.trim() || normalized;

    if (
      parsedBackground.includes('src/asset/background.jpg') ||
      parsedBackground.includes('src/assets/background.jpg')
    ) {
      setBackground(defaultBackgroundImage);
      return;
    }

    setBackground(parsedBackground);
  };

  const handleSongBackgroundColorChange = async (nextColor: string) => {
    const normalized = nextColor.trim();
    setSongBackgroundColor(normalized);

    try {
      await settingsAPI.updateSetting('display_song_background_color', normalized);
    } catch {
      // Keep local persistence when backend is unavailable.
    }
  };

  const syncSongToDisplay = (song: Song, slideIndex: number) => {
    if (!isWsConnected) return;

    if (lastSentSongIdRef.current !== song.id) {
      sendControlMessage('select_song', { song });
      lastSentSongIdRef.current = song.id;
    }

    sendControlMessage('change_slide', { slideIndex });
  };

  const clearSongOnDisplay = () => {
    if (!isWsConnected) return;
    sendControlMessage('clear_song', {});
    lastSentSongIdRef.current = null;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedSong(null);
    setShowAdminPanel(false);
    setSongs([]);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="text-white p-4 shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(to right, #865014, #E0AE3F)' }}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={churchLogo} alt="Kebena Church Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl">Kebena Church Song Display</h1>
                <p className="text-sm" style={{ color: '#F6EBD8' }}>የቀበና ቤተክርስትያን የመዝሙር ማሳያ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-sm">{currentUser.name}</p>
                <p className="text-xs" style={{ color: '#F6EBD8' }}>
                  {isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
              {/* Mobile Control Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileControl(!showMobileControl)}
                className="text-black border-white hover:bg-white/20"
                title="Mobile Control & Sync"
              >
                <Smartphone className="size-4 mr-2" />
                Mobile
              </Button>
              {/* XML Import Button (Admin Only) */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowXMLImporter(!showXMLImporter)}
                  className="text-black border-white hover:bg-white/20"
                  title="Import Songs from XML"
                >
                  <Upload className="size-4 mr-2" />
                  Import XML
                </Button>
              )}
              {/* Admin Panel Button */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="text-black border-white hover:bg-white/20"
                >
                  <Settings className="size-4 mr-2" />
                  Admin
                </Button>
              )}
              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-black border-white hover:bg-white/20"
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Direct Song Display (No Tabs) */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {!selectedSong ? (
            /* Split View: Hymnal & Local Songs */
            <div className="h-full grid grid-cols-2 gap-4 p-4 overflow-hidden w-full">
              {/* Hymnal Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
                <div className="mb-4 pb-4 border-b flex-shrink-0" style={{ borderColor: '#865014' }}>
                  <h2 className="text-xl" style={{ color: '#865014' }}>Hymnal Songs</h2>
                  <p className="text-sm text-gray-600">ውዳሴ መዝሙሮች</p>
                </div>
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Loading songs...</p>
                  </div>
                ) : (
                  <SongList
                    songs={hymnalSongs}
                    onSelectSong={handleSelectSong}
                    isAdmin={isAdmin}
                    onEditSong={handleEditSong}
                    onDeleteSong={handleDeleteSong}
                  />
                )}
              </div>

              {/* Local Songs Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
                <div className="mb-4 pb-4 border-b flex-shrink-0" style={{ borderColor: '#E0AE3F' }}>
                  <h2 className="text-xl" style={{ color: '#E0AE3F' }}>Local Songs</h2>
                  <p className="text-sm text-gray-600">ሀገርኛ መዝሙሮች</p>
                </div>
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Loading songs...</p>
                  </div>
                ) : (
                  <SongList
                    songs={localSongs}
                    onSelectSong={handleSelectSong}
                    isAdmin={isAdmin}
                    onEditSong={handleEditSong}
                    onDeleteSong={handleDeleteSong}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Song Viewer */
            <SongViewer
              song={selectedSong}
              onClose={handleCloseSongViewer}
              background={background}
              onOpenDisplayWindow={openDisplayWindow}
              onSyncSongToDisplay={syncSongToDisplay}
              onClearDisplay={clearSongOnDisplay}
            />
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
            songBackgroundColor={songBackgroundColor}
            onSongBackgroundColorChange={handleSongBackgroundColorChange}
            onReload={loadSongsFromDatabase}
          />
        )}

        {/* Mobile Control */}
        {showMobileControl && (
          <MobileControl
            isOpen={showMobileControl}
            onClose={() => setShowMobileControl(false)}
            currentSong={selectedSong}
            roomId={roomId}
            background={background}
            userName={currentUser.name}
          />
        )}

        {/* XML Importer */}
        {showXMLImporter && (
          <XMLImporter
            isOpen={showXMLImporter}
            onClose={() => setShowXMLImporter(false)}
            onImportComplete={handleImportComplete}
          />
        )}
      </div>
    </>
  );
}