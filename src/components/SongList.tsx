import { useState } from 'react';
import { Song } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Edit, Trash2 } from 'lucide-react';

interface SongListProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  isAdmin: boolean;
  onEditSong: (id: number, song: Partial<Song>) => void;
  onDeleteSong: (id: number) => void;
}

export function SongList({ songs, onSelectSong, isAdmin, onEditSong, onDeleteSong }: SongListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = songs.filter(song => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      song.number.includes(query) ||
      song.titleAmharic.toLowerCase().includes(query) ||
      song.titleEnglish.toLowerCase().includes(query)
    );
  });

  // Determine badge color based on category
  const getBadgeStyle = (category: 'hymnal' | 'local') => {
    if (category === 'hymnal') {
      return { backgroundColor: '#F6EBD8', color: '#865014' };
    }
    return { backgroundColor: '#FFF9E6', color: '#E0AE3F' };
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search Bar */}
      <div className="mb-3 sm:mb-4 relative flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by number, Amharic or English title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
        <div className="space-y-2">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No songs found</p>
              <p className="text-sm">ምንም መዝሙር አልተገኘም</p>
            </div>
          ) : (
            filteredSongs.map(song => (
              <div
                key={song.id}
                className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => onSelectSong(song)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="px-2 py-0.5 rounded text-xs"
                        style={getBadgeStyle(song.category)}
                      >
                        #{song.number}
                      </span>
                    </div>
                    <h3 className="text-gray-900 mb-1 text-sm sm:text-base">{song.titleAmharic}</h3>
                    <p className="text-sm text-gray-600">{song.titleEnglish}</p>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality would open a modal
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${song.titleEnglish}"?`)) {
                            onDeleteSong(song.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}