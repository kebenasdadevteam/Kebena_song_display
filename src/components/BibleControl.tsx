import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Monitor, Info, Search } from 'lucide-react';
import { bibleVersions, bibleBooks, bibleService } from '../services/bibleService';
import { displayStateService } from '../services/displayStateService';
import { DisplayState, BibleVerse } from '../types';
import { toast } from 'sonner';

interface BibleControlProps {
  background: string;
}

export function BibleControl({ background }: BibleControlProps) {
  const [selectedVersion, setSelectedVersion] = useState(bibleVersions[0].id);
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [selectedVerseStart, setSelectedVerseStart] = useState(16);
  const [selectedVerseEnd, setSelectedVerseEnd] = useState(16);
  const [chapterInput, setChapterInput] = useState('3');
  const [verseStartInput, setVerseStartInput] = useState('16');
  const [verseEndInput, setVerseEndInput] = useState('16');
  const [availableVerses, setAvailableVerses] = useState<BibleVerse[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [displayState, setDisplayState] = useState<DisplayState>({
    type: 'none',
    isVisible: false,
    background,
  });
  const [presentationWindow, setPresentationWindow] = useState<Window | null>(null);
  const [currentVerseText, setCurrentVerseText] = useState('');
  const [currentReference, setCurrentReference] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get current book data and max chapters - MOVED HERE to avoid initialization error
  const currentBook = bibleBooks.find(b => b.name === selectedBook);
  const maxChapter = currentBook?.chapters || 1;

  // Update display state when background changes
  useEffect(() => {
    if (displayState.background !== background) {
      const newState = { ...displayState, background };
      setDisplayState(newState);
      // Only update if display is active
      if (displayState.isVisible) {
        displayStateService.updateDisplayState(newState);
      }
    }
  }, [background]);

  // Load verses when book or chapter changes
  useEffect(() => {
    const loadVerses = async () => {
      setIsLoadingVerses(true);
      try {
        const verses = await bibleService.getChapterVerses(selectedVersion, selectedBook, selectedChapter);
        setAvailableVerses(verses);
        
        // Show info message if verses are empty (API might be down)
        if (verses.length === 0) {
          toast.info('Bible verses unavailable', {
            description: 'Try selecting John 3 or Psalms 23 for offline access'
          });
        }
      } catch (error) {
        console.error('Error loading verses:', error);
        toast.info('Bible verses unavailable', {
          description: 'Try selecting John 3 or Psalms 23 for offline access'
        });
      } finally {
        setIsLoadingVerses(false);
      }
    };

    loadVerses();
  }, [selectedVersion, selectedBook, selectedChapter]);

  // Subscribe to display state changes
  useEffect(() => {
    const initializeControl = async () => {
      console.log('[BibleControl] Initializing display service...');
      await displayStateService.initialize();
      console.log('[BibleControl] Display service ready');
    };

    initializeControl();
    
    const unsubscribe = displayStateService.subscribe((state) => {
      console.log('[BibleControl] Received state update:', state);
      setDisplayState(state);
    });

    return () => {
      unsubscribe();
      // Don't cleanup here - display window might still be open
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Enter key while in input - Show on Display
        if (e.key === 'Enter') {
          e.preventDefault();
          openPresentationMode();
        }
        return;
      }

      switch(e.key) {
        case 'Enter':
          // Enter key - Show on Display (not preview)
          e.preventDefault();
          openPresentationMode();
          break;
        case 'Escape':
          // Esc - Clear all displays
          e.preventDefault();
          handleStopDisplay();
          if (presentationWindow && !presentationWindow.closed) {
            presentationWindow.close();
            setPresentationWindow(null);
          }
          break;
        case 'p':
        case 'P':
          // P - Show on Preview (quick preview check)
          e.preventDefault();
          handleShowVerse();
          break;
        case 'ArrowUp':
          // Previous chapter
          e.preventDefault();
          if (selectedChapter > 1) {
            const newChapter = selectedChapter - 1;
            setSelectedChapter(newChapter);
            setChapterInput(newChapter.toString());
          }
          break;
        case 'ArrowDown':
          // Next chapter
          e.preventDefault();
          if (selectedChapter < maxChapter) {
            const newChapter = selectedChapter + 1;
            setSelectedChapter(newChapter);
            setChapterInput(newChapter.toString());
          }
          break;
        case 'ArrowLeft':
          // Previous verse
          e.preventDefault();
          if (selectedVerseStart > 1) {
            const newVerse = selectedVerseStart - 1;
            setSelectedVerseStart(newVerse);
            setVerseStartInput(newVerse.toString());
            setSelectedVerseEnd(newVerse);
            setVerseEndInput(newVerse.toString());
            // Auto-update if display is open
            if (presentationWindow && !presentationWindow.closed && autoUpdateEnabled) {
              setTimeout(() => openPresentationMode(), 100);
            }
          }
          break;
        case 'ArrowRight':
          // Next verse
          e.preventDefault();
          const newVerse = selectedVerseStart + 1;
          setSelectedVerseStart(newVerse);
          setVerseStartInput(newVerse.toString());
          setSelectedVerseEnd(newVerse);
          setVerseEndInput(newVerse.toString());
          // Auto-update if display is open
          if (presentationWindow && !presentationWindow.closed && autoUpdateEnabled) {
            setTimeout(() => openPresentationMode(), 100);
          }
          break;
        case 'PageUp':
          // PageUp - Previous book
          e.preventDefault();
          const currentBookIndex = bibleBooks.findIndex(b => b.name === selectedBook);
          if (currentBookIndex > 0) {
            const newBook = bibleBooks[currentBookIndex - 1];
            setSelectedBook(newBook.name);
            setSelectedChapter(1);
            setChapterInput('1');
          }
          break;
        case 'PageDown':
          // PageDown - Next book
          e.preventDefault();
          const currentIndex = bibleBooks.findIndex(b => b.name === selectedBook);
          if (currentIndex < bibleBooks.length - 1) {
            const newBook = bibleBooks[currentIndex + 1];
            setSelectedBook(newBook.name);
            setSelectedChapter(1);
            setChapterInput('1');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedChapter, selectedVerseStart, selectedVerseEnd, maxChapter, selectedBook, presentationWindow, autoUpdateEnabled]);

  const handleBookChange = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setChapterInput('1');
  };

  const handleChapterInputChange = (value: string) => {
    setChapterInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      const bookData = bibleBooks.find(b => b.name === selectedBook);
      if (bookData && num <= bookData.chapters) {
        setSelectedChapter(num);
      }
    }
  };

  const handleVerseStartInputChange = (value: string) => {
    setVerseStartInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setSelectedVerseStart(num);
      // Auto-adjust end verse if it's less than start
      if (selectedVerseEnd < num) {
        setSelectedVerseEnd(num);
        setVerseEndInput(value);
      }
    }
  };

  const handleVerseEndInputChange = (value: string) => {
    setVerseEndInput(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= selectedVerseStart) {
      setSelectedVerseEnd(num);
    }
  };

  const handleShowVerse = async () => {
    try {
      const verses = await bibleService.getVerseRange(
        selectedVersion,
        selectedBook,
        selectedChapter,
        selectedVerseStart,
        selectedVerseEnd
      );

      if (verses.length === 0) {
        toast.error('No verses found');
        return;
      }

      const verseText = verses.map(v => `${v.verse}. ${v.text}`).join('\n\n');
      const reference = selectedVerseStart === selectedVerseEnd
        ? `${selectedBook} ${selectedChapter}:${selectedVerseStart}`
        : `${selectedBook} ${selectedChapter}:${selectedVerseStart}-${selectedVerseEnd}`;

      const newState: DisplayState = {
        type: 'bible',
        isVisible: true,
        bibleVersion: selectedVersion,
        bibleBook: selectedBook,
        bibleChapter: selectedChapter,
        bibleVerseStart: selectedVerseStart,
        bibleVerseEnd: selectedVerseEnd,
        bibleText: verseText,
        background,
      };

      await displayStateService.updateDisplayState(newState);
      toast.success('Verse displayed on screen', {
        description: reference,
      });

      // Update current verse text and reference for preview
      setCurrentVerseText(verseText);
      setCurrentReference(reference);
    } catch (error) {
      console.error('Error showing verse:', error);
      toast.error('Failed to display verse');
    }
  };

  const handleStopDisplay = async () => {
    const newState: DisplayState = {
      type: 'none',
      isVisible: false,
      background,
    };

    await displayStateService.updateDisplayState(newState);
    toast.info('Display cleared');

    // Clear current verse text and reference for preview
    setCurrentVerseText('');
    setCurrentReference('');
  };

  // Open presentation window (like song presentation mode)
  const openPresentationMode = async () => {
    try {
      // First, get the verse text
      const verses = await bibleService.getVerseRange(
        selectedVersion,
        selectedBook,
        selectedChapter,
        selectedVerseStart,
        selectedVerseEnd
      );

      if (verses.length === 0) {
        toast.error('No verses found');
        return;
      }

      const verseText = verses.map(v => `${v.verse}. ${v.text}`).join('\\n\\n');
      const reference = selectedVerseStart === selectedVerseEnd
        ? `${selectedBook} ${selectedChapter}:${selectedVerseStart}`
        : `${selectedBook} ${selectedChapter}:${selectedVerseStart}-${selectedVerseEnd}`;

      // Close existing window if open
      if (presentationWindow && !presentationWindow.closed) {
        presentationWindow.close();
      }

      // Open new window
      const newWindow = window.open('', 'BiblePresentationMode', 'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no');
      
      if (newWindow) {
        const bgColor = isDarkMode ? background : '#ffffff';
        const textColor = isDarkMode ? '#ffffff' : '#1a1a2e';
        
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Bible Display - ${reference}</title>
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
                  padding: 4rem;
                }
                #content-wrapper {
                  max-width: 90%;
                  text-align: center;
                }
                #reference {
                  font-size: 3rem;
                  margin-bottom: 3rem;
                  opacity: 0.9;
                  text-shadow: ${isDarkMode ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'};
                }
                #verse-text {
                  font-size: 4rem;
                  line-height: 1.6;
                  white-space: pre-line;
                  text-shadow: ${isDarkMode ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'};
                }
              </style>
            </head>
            <body>
              <div id="content-wrapper">
                <div id="reference">${reference}</div>
                <div id="verse-text">${verseText}</div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
        setPresentationWindow(newWindow);
        
        toast.success('Bible verse opened in presentation window', {
          description: 'Move the window to your projector screen',
        });
        
        // Update current verse text and reference for preview
        setCurrentVerseText(verseText);
        setCurrentReference(reference);
      }
    } catch (error) {
      console.error('Error opening presentation:', error);
      toast.error('Failed to open presentation window');
    }
  };

  // Clean up presentation window on unmount
  useEffect(() => {
    return () => {
      if (presentationWindow && !presentationWindow.closed) {
        presentationWindow.close();
      }
    };
  }, [presentationWindow]);

  // Auto-update presentation window when verse selection changes
  useEffect(() => {
    // Only auto-update if window is open and auto-update is enabled
    if (presentationWindow && !presentationWindow.closed && autoUpdateEnabled) {
      // Small delay to avoid rapid updates while typing
      const timer = setTimeout(() => {
        updatePresentationWindow();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedVersion, selectedBook, selectedChapter, selectedVerseStart, selectedVerseEnd, presentationWindow, autoUpdateEnabled]);

  // Update presentation window content without closing/reopening
  const updatePresentationWindow = async () => {
    if (!presentationWindow || presentationWindow.closed) return;

    try {
      const verses = await bibleService.getVerseRange(
        selectedVersion,
        selectedBook,
        selectedChapter,
        selectedVerseStart,
        selectedVerseEnd
      );

      if (verses.length === 0) return;

      const verseText = verses.map(v => `${v.verse}. ${v.text}`).join('\\n\\n');
      const reference = selectedVerseStart === selectedVerseEnd
        ? `${selectedBook} ${selectedChapter}:${selectedVerseStart}`
        : `${selectedBook} ${selectedChapter}:${selectedVerseStart}-${selectedVerseEnd}`;

      // Update the window content
      const referenceEl = presentationWindow.document.getElementById('reference');
      const verseEl = presentationWindow.document.getElementById('verse-text');
      
      if (referenceEl && verseEl) {
        referenceEl.textContent = reference;
        verseEl.textContent = verseText;
        presentationWindow.document.title = `Bible Display - ${reference}`;
      }

      // Update current verse text and reference for preview
      setCurrentVerseText(verseText);
      setCurrentReference(reference);
    } catch (error) {
      console.error('Error updating presentation:', error);
    }
  };

  // Search functionality
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      toast.info('Enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const results = await bibleService.searchVerses(selectedVersion, searchQuery);
      setSearchResults(results);
      toast.success('Search results found', {
        description: `${results.length} results found`,
      });
    } catch (error) {
      console.error('Error searching verses:', error);
      toast.error('Failed to search verses');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 flex gap-4 p-4 overflow-hidden h-full">
      {/* Control Panel */}
      <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col min-h-0">
        <div className="p-6 border-b">
          <h2 className="text-2xl mb-1" style={{ color: '#865014' }}>
            Bible Control Panel
          </h2>
          <p className="text-sm text-gray-600">የመጽሐፍ ቅዱስ መቆጣጠሪያ ፓነል</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Instructions Alert */}
          <Alert className="mb-6" style={{ backgroundColor: '#F6EBD8', borderColor: '#E0AE3F' }}>
            <Info className="size-4" style={{ color: '#865014' }} />
            <AlertDescription className="text-sm">
              <strong>Quick Start:</strong> Select book, chapter, and verse, then press <kbd className="px-1 py-0.5 bg-white rounded border">Enter</kbd> to display.
              <div className="mt-3 pt-2 border-t border-gray-300">
                <strong>All Keyboard Shortcuts:</strong><br/>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div><kbd className="px-1 py-0.5 bg-white rounded border">Enter</kbd> Display verse</div>
                  <div><kbd className="px-1 py-0.5 bg-white rounded border">P</kbd> Preview only</div>
                  <div><kbd className="px-1 py-0.5 bg-white rounded border">←→</kbd> Next/Prev verse</div>
                  <div><kbd className="px-1 py-0.5 bg-white rounded border">↑↓</kbd> Next/Prev chapter</div>
                  <div><kbd className="px-1 py-0.5 bg-white rounded border">PgUp/PgDn</kbd> Change book</div>
                  <div><kbd className="px-1 py-0.5 bg-white rounded border">Esc</kbd> Clear display</div>
                </div>
                <div className="mt-2 text-xs italic opacity-75">
                  💡 Tip: Arrow keys auto-update the display if window is open!
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {/* Version Selection */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#865014' }}>
                Version / ስሪት
              </label>
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bibleVersions.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.nameAmharic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Book Selection */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#865014' }}>
                Book / መጽሐፍ
              </label>
              <Select value={selectedBook} onValueChange={handleBookChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {bibleBooks.map(book => (
                    <SelectItem key={book.name} value={book.name}>
                      {book.nameAmharic} ({book.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter Selection */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#865014' }}>
                Chapter / ምዕራፍ (1-{maxChapter})
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max={maxChapter}
                  value={chapterInput}
                  onChange={(e) => handleChapterInputChange(e.target.value)}
                  className="flex-1"
                />
                <Select 
                  value={selectedChapter.toString()} 
                  onValueChange={(val) => {
                    setSelectedChapter(parseInt(val));
                    setChapterInput(val);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Array.from({ length: maxChapter }, (_, i) => i + 1).map(ch => (
                      <SelectItem key={ch} value={ch.toString()}>
                        Chapter {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Verse Selection */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#865014' }}>
                Verse / ቁጥር
                {isLoadingVerses && (
                  <span className="ml-2 text-xs text-gray-500">(Loading...)</span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start / ጅምር</label>
                  <Input
                    type="number"
                    min="1"
                    value={verseStartInput}
                    onChange={(e) => handleVerseStartInputChange(e.target.value)}
                    disabled={isLoadingVerses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End / መጨረሻ</label>
                  <Input
                    type="number"
                    min={selectedVerseStart}
                    value={verseEndInput}
                    onChange={(e) => handleVerseEndInputChange(e.target.value)}
                    disabled={isLoadingVerses}
                  />
                </div>
              </div>
            </div>

            {/* Search Functionality */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#865014' }}>
                Search / ይፈልጉ
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  className="text-white"
                  style={{ backgroundColor: '#E0AE3F', color: '#000' }}
                >
                  <Search className="size-4 mr-2" />
                  Search
                </Button>
              </div>
              {isSearching && (
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              )}
              {searchResults.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-bold mb-1">Search Results:</h4>
                  <ul className="list-disc pl-4">
                    {searchResults.map((verse, index) => (
                      <li key={index} className="text-sm">
                        {verse.book} {verse.chapter}:{verse.verse} - {verse.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Preview Button */}
              <Button
                onClick={handleShowVerse}
                className="w-full text-white"
                style={{ backgroundColor: '#865014' }}
              >
                <Eye className="size-4 mr-2" />
                Show on Preview
              </Button>
              
              {/* Display Window Buttons Row */}
              <div className="flex gap-3">
                <Button
                  onClick={openPresentationMode}
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#E0AE3F', color: '#000' }}
                >
                  <Monitor className="size-4 mr-2" />
                  Show on Display
                </Button>
                <Button
                  onClick={handleStopDisplay}
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: '#865014', color: '#865014' }}
                >
                  <EyeOff className="size-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Preview */}
      <div className="w-[400px] bg-white rounded-lg shadow-lg p-6 flex flex-col min-h-0">
        <div className="mb-4 flex items-center gap-2">
          <Monitor className="size-5" style={{ color: '#865014' }} />
          <h3 className="text-lg" style={{ color: '#865014' }}>
            Display Preview
          </h3>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent 
            className="flex-1 p-6 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: displayState.isVisible ? displayState.background : background,
              minHeight: '400px',
            }}
          >
            {displayState.isVisible && displayState.type === 'bible' && displayState.bibleText ? (
              <div className="text-center text-white space-y-4">
                <div className="text-xl opacity-80 mb-4">
                  {displayState.bibleBook} {displayState.bibleChapter}:
                  {displayState.bibleVerseStart === displayState.bibleVerseEnd
                    ? displayState.bibleVerseStart
                    : `${displayState.bibleVerseStart}-${displayState.bibleVerseEnd}`
                  }
                </div>
                <div className="text-2xl leading-relaxed whitespace-pre-line">
                  {displayState.bibleText}
                </div>
              </div>
            ) : (
              <div className="text-center text-white opacity-50">
                <Monitor className="size-16 mx-auto mb-4" />
                <p>No content displayed</p>
                <p className="text-sm">ምንም ይዘት አልታየም</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}