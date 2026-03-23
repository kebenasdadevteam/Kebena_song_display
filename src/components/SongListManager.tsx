import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { 
  Plus, Calendar, Copy, Trash2, GripVertical, Edit2, Save, X, 
  List, Music, ChevronRight, CheckCircle, Download, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { Song, SongList, SongListItem } from '../types';
import { songListService } from '../services/songListService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface SongListManagerProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentUser: string;
  userRole: 'admin' | 'song_leader' | 'user';
  onSelectSong?: (song: Song) => void;
}

export function SongListManager({ 
  isOpen, 
  onClose, 
  songs,
  currentUser,
  userRole,
  onSelectSong,
}: Readonly<SongListManagerProps>) {
  const [songLists, setSongLists] = useState<SongList[]>([]);
  const [selectedList, setSelectedList] = useState<SongList | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDate, setNewListDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedSlides, setSelectedSlides] = useState<number[]>([]);
  const [itemNotes, setItemNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedItem, setCopiedItem] = useState<SongListItem | null>(null);
  const isReadOnly = userRole === 'user';

  // Load song lists
  useEffect(() => {
    loadSongLists();
  }, []);

  const loadSongLists = () => {
    const lists = songListService.getAllSongLists();
    setSongLists(lists);

    const visibleLists =
      isReadOnly && lists.some((list) => list.isActive)
        ? lists.filter((list) => list.isActive)
        : lists;

    if (visibleLists.length === 0) {
      setSelectedList(null);
      return;
    }

    if (!selectedList || !visibleLists.some((list) => list.id === selectedList.id)) {
      setSelectedList(visibleLists[0]);
    }
  };

  const visibleSongLists =
    isReadOnly && songLists.some((list) => list.isActive)
      ? songLists.filter((list) => list.isActive)
      : songLists;

  const handleOpenList = (list: SongList) => {
    setSelectedList(list);
  };

  const handleDisplayListItem = (item: SongListItem) => {
    const song = songs.find((entry) => entry.id === item.songId);
    if (!song) {
      toast.error('Song not found in library');
      return;
    }

    const selectedSlideCount = item.selectedSlides?.length ?? 0;
    const selectedSlideLabel = selectedSlideCount === 1 ? 'slide' : 'slides';
    const displayDescription = selectedSlideCount > 0
      ? `${item.songTitle} (${selectedSlideCount} selected ${selectedSlideLabel})`
      : item.songTitle;

    onSelectSong?.(song);
    toast.success('Song ready to display', {
      description: displayDescription,
    });
    onClose();
  };

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    const newList = songListService.createSongList({
      name: newListName.trim(),
      date: newListDate,
      createdBy: currentUser,
    });

    loadSongLists();
    setSelectedList(newList);
    setIsCreating(false);
    setNewListName('');
    setNewListDate(new Date().toISOString().split('T')[0]);
    
    toast.success('Song list created!', {
      description: `${newList.name} is ready to use`
    });
  };

  const handleDeleteList = (listId: string) => {
    if (confirm('Are you sure you want to delete this song list?')) {
      const success = songListService.deleteSongList(listId);
      if (success) {
        loadSongLists();
        if (selectedList?.id === listId) {
          setSelectedList(null);
        }
        toast.success('Song list deleted');
      }
    }
  };

  const handleAddSongToList = () => {
    if (!selectedList || !selectedSong) return;

    const item: Omit<SongListItem, 'id'> = {
      songId: selectedSong.id,
      songNumber: selectedSong.number,
      songTitle: selectedSong.titleEnglish,
      songTitleAmharic: selectedSong.titleAmharic,
      selectedSlides: selectedSlides.length > 0 ? selectedSlides : undefined,
      notes: itemNotes.trim() || undefined,
    };

    const success = songListService.addSongToList(selectedList.id, item);
    if (success) {
      loadSongLists();
      const updated = songListService.getSongListById(selectedList.id);
      setSelectedList(updated);
      setSelectedSong(null);
      setSelectedSlides([]);
      setItemNotes('');

      const selectedSlideLabel = selectedSlides.length === 1 ? 'slide' : 'slides';
      const slideInfo = selectedSlides.length > 0
        ? ` (${selectedSlides.length} ${selectedSlideLabel})`
        : ' (entire song)';
      
      toast.success('Song added to list!', {
        description: `${selectedSong.titleEnglish}${slideInfo}`
      });
    }
  };

  const handleRemoveFromList = (itemId: string) => {
    if (!selectedList) return;
    
    const success = songListService.removeSongFromList(selectedList.id, itemId);
    if (success) {
      loadSongLists();
      const updated = songListService.getSongListById(selectedList.id);
      setSelectedList(updated);
      toast.success('Song removed from list');
    }
  };

  const handleCopyItem = (item: SongListItem) => {
    setCopiedItem(item);
    toast.success('Song copied!', {
      description: 'You can now paste it into any list'
    });
  };

  const handlePasteItem = () => {
    if (!selectedList || !copiedItem) return;

    const newItem: Omit<SongListItem, 'id'> = {
      songId: copiedItem.songId,
      songNumber: copiedItem.songNumber,
      songTitle: copiedItem.songTitle,
      songTitleAmharic: copiedItem.songTitleAmharic,
      selectedSlides: copiedItem.selectedSlides,
      notes: copiedItem.notes,
    };

    const success = songListService.addSongToList(selectedList.id, newItem);
    if (success) {
      loadSongLists();
      const updated = songListService.getSongListById(selectedList.id);
      setSelectedList(updated);
      toast.success('Song pasted!');
    }
  };

  const handleSetActive = (listId: string) => {
    const success = songListService.setActiveSongList(listId);
    if (success) {
      loadSongLists();
      toast.success('Active list set', {
        description: 'This list is now active for worship service'
      });
    }
  };

  const handleExportList = (listId: string) => {
    const json = songListService.exportSongList(listId);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `song-list-${listId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Song list exported!');
    }
  };

  const toggleSlideSelection = (slideIndex: number) => {
    setSelectedSlides(prev => {
      if (prev.includes(slideIndex)) {
        return prev.filter(i => i !== slideIndex);
      } else {
        return [...prev, slideIndex].sort((a, b) => a - b);
      }
    });
  };

  const selectAllSlides = () => {
    if (!selectedSong) return;
    setSelectedSlides(selectedSong.lyrics.map((_, i) => i));
  };

  const clearSlideSelection = () => {
    setSelectedSlides([]);
  };

  const filteredSongs = songs.filter(song => 
    song.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.titleAmharic.includes(searchQuery) ||
    song.number.includes(searchQuery)
  );

  const listActionLabel = isReadOnly
    ? (selectedList ? 'View List' : 'Song List')
    : (selectedList ? 'Edit List' : 'Create New');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <List className="size-5" style={{ color: '#865014' }} />
            Song List Manager - የመዝሙር ዝርዝር አስተዳዳሪ
          </DialogTitle>
          <DialogDescription>
            Create and manage song lists for worship services
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="my-lists" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-lists">
              <FileText className="size-4 mr-2" />
              {isReadOnly ? 'Available Lists' : 'My Lists'}
            </TabsTrigger>
            <TabsTrigger value="create-edit">
              <Edit2 className="size-4 mr-2" />
              {listActionLabel}
            </TabsTrigger>
          </TabsList>

          {/* My Lists Tab */}
          <TabsContent value="my-lists" className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {songLists.length === 0 ? (
                <Alert>
                  <List className="size-4" />
                  <AlertDescription>
                    {isReadOnly
                      ? 'No song lists are available yet.'
                      : 'No song lists yet. Create your first song list to get started!'}
                  </AlertDescription>
                </Alert>
              ) : (
                visibleSongLists.map(list => (
                  <Card key={list.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{list.name}</h3>
                          {list.isActive && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {new Date(list.date).toLocaleDateString()}
                          </span>
                          <span>{list.items.length} {list.items.length === 1 ? 'song' : 'songs'}</span>
                          <span>Created by {list.createdBy}</span>
                        </div>
                        
                        {/* Song items preview */}
                        {list.items.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {list.items.slice(0, 3).map((item, index) => (
                              <div key={item.id} className="text-sm flex items-center gap-2">
                                <span className="text-gray-500">{index + 1}.</span>
                                <span>{item.songTitle}</span>
                                {item.selectedSlides && (
                                  <span className="text-xs text-gray-500">
                                    (Slides: {item.selectedSlides.map(s => s + 1).join(', ')})
                                  </span>
                                )}
                              </div>
                            ))}
                            {list.items.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{list.items.length - 3} more...
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenList(list)}
                          title={isReadOnly ? 'View list' : 'Edit list'}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        {!isReadOnly && !list.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetActive(list.id)}
                            title="Set as active"
                            style={{ color: '#865014', borderColor: '#865014' }}
                          >
                            <CheckCircle className="size-4" />
                          </Button>
                        )}
                        {!isReadOnly && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportList(list.id)}
                          title="Export list"
                        >
                          <Download className="size-4" />
                        </Button>
                        )}
                        {!isReadOnly && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteList(list.id)}
                          title="Delete list"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}

              {/* Create New Button */}
              {!isReadOnly && (
              <Button
                onClick={() => setIsCreating(true)}
                className="w-full"
                style={{ backgroundColor: '#865014', color: 'white' }}
              >
                <Plus className="size-4 mr-2" />
                Create New Song List
              </Button>
              )}

              {/* Create New Dialog */}
              {!isReadOnly && isCreating && (
                <Card className="p-4 border-2" style={{ borderColor: '#865014' }}>
                  <h3 className="font-semibold mb-4">Create New Song List</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="list-name">List Name *</Label>
                      <Input
                        id="list-name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="e.g., Sunday Service - March 10, 2026"
                      />
                    </div>
                    <div>
                      <Label htmlFor="list-date">Service Date *</Label>
                      <Input
                        id="list-date"
                        type="date"
                        value={newListDate}
                        onChange={(e) => setNewListDate(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateList}
                        style={{ backgroundColor: '#865014', color: 'white' }}
                      >
                        <Save className="size-4 mr-2" />
                        Create
                      </Button>
                      <Button
                        onClick={() => setIsCreating(false)}
                        variant="outline"
                      >
                        <X className="size-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Create/Edit Tab */}
          <TabsContent value="create-edit" className="flex-1 overflow-y-auto flex flex-col">
            {!selectedList ? (
              <Alert>
                <List className="size-4" />
                <AlertDescription>
                  {isReadOnly
                    ? 'Select a song list from the Available Lists tab to view the songs for today.'
                    : 'Select a list from "My Lists" tab to edit, or create a new one.'}
                </AlertDescription>
              </Alert>
            ) : (
              <div className={`flex-1 overflow-hidden grid gap-4 ${isReadOnly ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {/* Left: Current List */}
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <h3 className="font-semibold">{selectedList.name}</h3>
                    {!isReadOnly && copiedItem && (
                      <Button
                        size="sm"
                        onClick={handlePasteItem}
                        variant="outline"
                        style={{ color: '#865014', borderColor: '#865014' }}
                      >
                        <Copy className="size-4 mr-2" />
                        Paste
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2">
                    {selectedList.items.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Music className="size-12 mx-auto mb-2 opacity-50" />
                        <p>No songs in this list yet</p>
                        <p className="text-sm">Add songs from the right panel</p>
                      </div>
                    ) : (
                      selectedList.items.map((item, index) => (
                        <Card key={item.id} className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="text-gray-500 font-medium">{index + 1}.</span>
                              <GripVertical className="size-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.songTitle}</div>
                              <div className="text-sm text-gray-600 truncate">{item.songTitleAmharic}</div>
                              {item.selectedSlides && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Slides: {item.selectedSlides.map(s => s + 1).join(', ')}
                                </div>
                              )}
                              {item.notes && (
                                <div className="text-xs text-gray-600 mt-1 italic">
                                  {item.notes}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDisplayListItem(item)}
                                title="Display song"
                              >
                                Display
                              </Button>
                              {!isReadOnly && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyItem(item)}
                                title="Copy"
                              >
                                <Copy className="size-4" />
                              </Button>
                              )}
                              {!isReadOnly && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveFromList(item.id)}
                                className="text-red-600"
                                title="Remove"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                {/* Right: Add Songs */}
                {!isReadOnly && (
                <div className="flex flex-col overflow-y-auto border-l pl-4">
                  <h3 className="font-semibold mb-3">Add Songs</h3>
                  
                  {/* Search */}
                  <Input
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-3"
                  />

                  {/* Song Selection */}
                  {!selectedSong ? (
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {filteredSongs.map(song => (
                        <Card
                          key={song.id}
                          className="p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedSong(song)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{song.titleEnglish}</div>
                              <div className="text-sm text-gray-600">{song.titleAmharic}</div>
                            </div>
                            <ChevronRight className="size-5 text-gray-400" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto flex flex-col">
                      <Card className="p-3 mb-3 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{selectedSong.titleEnglish}</div>
                            <div className="text-sm text-gray-600">{selectedSong.titleAmharic}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSong(null);
                              setSelectedSlides([]);
                              setItemNotes('');
                            }}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </Card>

                      {/* Slide Selection */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Select Slides (optional)</Label>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={selectAllSlides}
                            >
                              All
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={clearSlideSelection}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Leave empty to include entire song
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-2 border rounded p-2">
                          {selectedSong.lyrics.map((lyric, index) => (
                            <button
                              key={`${selectedSong.id}-${index + 1}-${lyric.slice(0, 20)}`}
                              type="button"
                              className={`w-full p-2 rounded cursor-pointer border text-left ${
                                selectedSlides.includes(index)
                                  ? 'bg-[#865014] text-white border-[#865014]'
                                  : 'bg-white hover:bg-gray-50 border-gray-200'
                              }`}
                              onClick={() => toggleSlideSelection(index)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Slide {index + 1}</span>
                                {selectedSlides.includes(index) && (
                                  <CheckCircle className="size-4" />
                                )}
                              </div>
                              <div className="text-xs mt-1 opacity-80 line-clamp-2">
                                {lyric}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-3">
                        <Label htmlFor="item-notes">Notes (optional)</Label>
                        <Textarea
                          id="item-notes"
                          value={itemNotes}
                          onChange={(e) => setItemNotes(e.target.value)}
                          placeholder="e.g., Sing twice, acapella, etc."
                          rows={2}
                        />
                      </div>

                      <Button
                        onClick={handleAddSongToList}
                        style={{ backgroundColor: '#865014', color: 'white' }}
                        className="w-full"
                      >
                        <Plus className="size-4 mr-2" />
                        Add to List
                      </Button>
                    </div>
                  )}
                </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
