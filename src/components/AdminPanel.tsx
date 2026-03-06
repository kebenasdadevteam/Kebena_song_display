import { useState, useEffect } from 'react';
import { Song } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Palette, Upload, FileText, X, CheckCircle, Loader2, AlertCircle, Edit2, Trash2, FolderOpen, RefreshCw, Save, Users, Key, Shield, UserCheck, UserX, Monitor, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';
import { Card } from './ui/card';
import { songAPI, authAPI } from '../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';

const MAX_BACKGROUND_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_LOCAL_BG_WIDTH = 1920;
const MAX_LOCAL_BG_HEIGHT = 1080;
const BACKGROUND_LIBRARY_STORAGE_KEY = 'display_background_library_v1';
const ACTIVE_BACKGROUND_KEY = 'display_background_active_v1';

interface AdminPanelProps {
  songs: Song[];
  onAddSong: (song: Omit<Song, 'id'>) => void;
  onEditSong: (id: number, song: Partial<Song>) => void;
  onDeleteSong: (id: number) => void;
  onClose: () => void;
  background: string;
  onBackgroundChange: (bg: string) => void;
  songBackgroundColor: string;
  onSongBackgroundColorChange: (color: string) => void;
  onReload?: () => void;
}

interface ExtractedSlide {
  slideNumber: number;
  content: string;
}

interface DetectedFile {
  filename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface User {
  id: number;
  username: string;
  full_name: string;
  role: 'admin' | 'user';
  email: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

interface SavedBackgroundImage {
  id: string;
  src: string;
  name: string;
  source: 'server' | 'local';
  addedAt: string;
}

export function AdminPanel({ 
  songs,
  onAddSong, 
  onEditSong,
  onDeleteSong,
  onClose, 
  background, 
  onBackgroundChange,
  songBackgroundColor,
  onSongBackgroundColorChange,
  onReload
}: AdminPanelProps) {
  // Manual entry state
  const [manualSong, setManualSong] = useState({
    number: '',
    category: 'hymnal' as 'hymnal' | 'local',
    titleAmharic: '',
    titleEnglish: '',
    lyrics: '',
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedSlides, setExtractedSlides] = useState<ExtractedSlide[]>([]);
  const [fileSongData, setFileSongData] = useState({
    number: '',
    category: 'hymnal' as 'hymnal' | 'local',
    titleAmharic: '',
    titleEnglish: '',
  });

  // Edit song state
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editFormData, setEditFormData] = useState({
    number: '',
    category: 'hymnal' as 'hymnal' | 'local',
    titleAmharic: '',
    titleEnglish: '',
    lyrics: '',
  });

  // Auto-detect files state
  const [detectedFiles, setDetectedFiles] = useState<DetectedFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [selectedDetectedFile, setSelectedDetectedFile] = useState<DetectedFile | null>(null);
  const [detectedSlides, setDetectedSlides] = useState<ExtractedSlide[]>([]);
  const [detectedFileSongData, setDetectedFileSongData] = useState({
    number: '',
    category: 'hymnal' as 'hymnal' | 'local',
    titleAmharic: '',
    titleEnglish: '',
  });

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    username: '',
    full_name: '',
    role: 'user' as 'admin' | 'user',
    email: '',
    password: '',
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [backgroundLibrary, setBackgroundLibrary] = useState<SavedBackgroundImage[]>([]);

  const songBackgroundPresets = ['#000000', '#111827', '#1f2937', '#ffffff', '#f3f4f6', '#7f1d1d', '#0f766e'];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'ppt', 'pptx'].includes(fileExtension || '')) {
      toast.error('Invalid file type', {
        description: 'Please upload a PDF, PPT, or PPTX file'
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    toast.info('Uploading file...', {
      description: 'Processing ' + file.name
    });

    try {
      const response = await songAPI.uploadFile(file);

      console.log('Upload response:', response);

      if (response.success) {
        // Check if extraction was successful or if there were issues
        const hasExtractionIssues = response.extraction?.extractionSuccess === false || response.warning;
        
        const slides: ExtractedSlide[] = (response.extraction?.slides || []).map((content: string, index: number) => ({
          slideNumber: index + 1,
          content
        }));

        setExtractedSlides(slides);
        
        if (hasExtractionIssues) {
          toast.warning('File uploaded with warnings', {
            description: response.warning || 'Content extraction had issues. Please review and edit the slides below.'
          });
        } else {
          toast.success('File processed successfully!', {
            description: `Extracted ${slides.length} slides from ${file.name}`
          });
        }
      } else {
        // If response has extraction data even though success is false, use it
        if (response.extraction?.slides) {
          const slides: ExtractedSlide[] = response.extraction.slides.map((content: string, index: number) => ({
            slideNumber: index + 1,
            content
          }));
          setExtractedSlides(slides);
          
          toast.warning('Processing issue', {
            description: response.message || 'File uploaded but may need manual editing'
          });
        } else {
          throw new Error(response.message || 'Failed to process file');
        }
      }
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error('File upload failed', {
        description: error.message || 'Could not process file. Make sure backend is running.'
      });
      
      setUploadedFile(null);
      setExtractedSlides([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setExtractedSlides([]);
    setFileSongData({
      number: '',
      category: 'hymnal',
      titleAmharic: '',
      titleEnglish: '',
    });
  };

  const handleSubmitFromFile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      toast.error('Please upload a file');
      return;
    }

    if (!fileSongData.number || !fileSongData.titleAmharic || !fileSongData.titleEnglish) {
      toast.error('Please fill all required fields');
      return;
    }

    if (extractedSlides.length === 0) {
      toast.error('No slides extracted from file');
      return;
    }

    onAddSong({
      number: fileSongData.number,
      category: fileSongData.category,
      titleAmharic: fileSongData.titleAmharic,
      titleEnglish: fileSongData.titleEnglish,
      lyrics: extractedSlides.map(slide => slide.content),
      metadata: {
        creator: 'Admin',
        uploader: 'Admin',
        updatedDate: new Date().toISOString().split('T')[0],
        sourceFile: uploadedFile.name,
        fileType: uploadedFile.name.endsWith('.pdf') ? 'pdf' : 'ppt'
      }
    });

    toast.success('Song added successfully!', {
      description: `${fileSongData.titleEnglish} with ${extractedSlides.length} slides`
    });

    handleRemoveFile();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualSong.number || !manualSong.titleAmharic || !manualSong.titleEnglish) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!manualSong.lyrics) {
      toast.error('Please enter lyrics for the song');
      return;
    }

    const lyricsArray = manualSong.lyrics
      .split('\n\n')
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);

    if (lyricsArray.length === 0) {
      toast.error('Please enter lyrics for the song');
      return;
    }

    onAddSong({
      number: manualSong.number,
      category: manualSong.category,
      titleAmharic: manualSong.titleAmharic,
      titleEnglish: manualSong.titleEnglish,
      lyrics: lyricsArray,
      metadata: {
        creator: 'Admin',
        uploader: 'Admin',
        updatedDate: new Date().toISOString().split('T')[0],
        fileType: 'manual'
      }
    });

    toast.success('Song added successfully!', {
      description: `${manualSong.titleEnglish} with ${lyricsArray.length} slides`
    });

    setManualSong({
      number: '',
      category: 'hymnal',
      titleAmharic: '',
      titleEnglish: '',
      lyrics: '',
    });
  };

  const updateSlideContent = (slideNumber: number, newContent: string) => {
    setExtractedSlides(slides =>
      slides.map(slide =>
        slide.slideNumber === slideNumber
          ? { ...slide, content: newContent }
          : slide
      )
    );
  };

  // Edit song functions
  const startEditingSong = (song: Song) => {
    setEditingSong(song);
    setEditFormData({
      number: song.number,
      category: song.category,
      titleAmharic: song.titleAmharic,
      titleEnglish: song.titleEnglish,
      lyrics: song.lyrics.join('\n\n'),
    });
  };

  const cancelEditingSong = () => {
    setEditingSong(null);
    setEditFormData({
      number: '',
      category: 'hymnal',
      titleAmharic: '',
      titleEnglish: '',
      lyrics: '',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSong) return;

    if (!editFormData.number || !editFormData.titleAmharic || !editFormData.titleEnglish) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editFormData.lyrics) {
      toast.error('Please enter lyrics for the song');
      return;
    }

    const lyricsArray = editFormData.lyrics
      .split('\n\n')
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);

    if (lyricsArray.length === 0) {
      toast.error('Please enter lyrics for the song');
      return;
    }

    onEditSong(editingSong.id, {
      number: editFormData.number,
      category: editFormData.category,
      titleAmharic: editFormData.titleAmharic,
      titleEnglish: editFormData.titleEnglish,
      lyrics: lyricsArray,
    });

    toast.success('Song updated successfully!');
    cancelEditingSong();
  };

  const handleDeleteWithConfirm = (song: Song) => {
    if (window.confirm(`Are you sure you want to delete "${song.titleEnglish}"?`)) {
      onDeleteSong(song.id);
    }
  };

  // Auto-detect files functions
  const scanUploadsFolder = async () => {
    setIsScanning(true);
    try {
      const response = await songAPI.scanUploads();
      if (response.success) {
        setDetectedFiles(response.files || []);
        toast.success(`Found ${response.files?.length || 0} files in uploads folder`);
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      toast.error('Failed to scan uploads folder', {
        description: error.message
      });
    } finally {
      setIsScanning(false);
    }
  };

  const processDetectedFile = async (file: DetectedFile) => {
    setProcessingFile(file.filename);
    try {
      const response = await songAPI.processUploadFile(file.filename);
      
      if (response.success) {
        const slides: ExtractedSlide[] = response.extraction.slides.map((content: string, index: number) => ({
          slideNumber: index + 1,
          content
        }));

        setDetectedSlides(slides);
        setSelectedDetectedFile(file);
        
        toast.success('File processed successfully!', {
          description: `Extracted ${slides.length} slides`
        });
      }
    } catch (error: any) {
      console.error('Process file error:', error);
      toast.error('Failed to process file', {
        description: error.message
      });
    } finally {
      setProcessingFile(null);
    }
  };

  const cancelDetectedFile = () => {
    setSelectedDetectedFile(null);
    setDetectedSlides([]);
    setDetectedFileSongData({
      number: '',
      category: 'hymnal',
      titleAmharic: '',
      titleEnglish: '',
    });
  };

  const handleSubmitDetectedFile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDetectedFile) {
      toast.error('No file selected');
      return;
    }

    if (!detectedFileSongData.number || !detectedFileSongData.titleAmharic || !detectedFileSongData.titleEnglish) {
      toast.error('Please fill all required fields');
      return;
    }

    if (detectedSlides.length === 0) {
      toast.error('No slides extracted from file');
      return;
    }

    onAddSong({
      number: detectedFileSongData.number,
      category: detectedFileSongData.category,
      titleAmharic: detectedFileSongData.titleAmharic,
      titleEnglish: detectedFileSongData.titleEnglish,
      lyrics: detectedSlides.map(slide => slide.content),
      metadata: {
        creator: 'Admin',
        uploader: 'Admin',
        updatedDate: new Date().toISOString().split('T')[0],
        sourceFile: selectedDetectedFile.filename,
        fileType: selectedDetectedFile.fileType
      }
    });

    toast.success('Song added successfully!', {
      description: `${detectedFileSongData.titleEnglish} with ${detectedSlides.length} slides`
    });

    cancelDetectedFile();
    scanUploadsFolder(); // Refresh the list
  };

  const updateDetectedSlideContent = (slideNumber: number, newContent: string) => {
    setDetectedSlides(slides =>
      slides.map(slide =>
        slide.slideNumber === slideNumber
          ? { ...slide, content: newContent }
          : slide
      )
    );
  };

  const isImageValue = (value: string) => {
    const normalized = value.trim().toLowerCase();
    return (
      normalized.startsWith('data:image') ||
      normalized.startsWith('http://') ||
      normalized.startsWith('https://') ||
      normalized.startsWith('/uploads/') ||
      /\.(jpg|jpeg|png|gif|webp)(\?|#|$)/i.test(normalized)
    );
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = src;
    });
  };

  const optimizeImageForLocalStorage = async (file: File): Promise<string> => {
    const sourceDataUrl = await readFileAsDataUrl(file);
    const image = await loadImage(sourceDataUrl);

    const widthRatio = MAX_LOCAL_BG_WIDTH / image.width;
    const heightRatio = MAX_LOCAL_BG_HEIGHT / image.height;
    const scaleRatio = Math.min(1, widthRatio, heightRatio);

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scaleRatio));
    canvas.height = Math.max(1, Math.round(image.height * scaleRatio));

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return sourceDataUrl;
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const persistBackgroundLibrary = (items: SavedBackgroundImage[]) => {
    try {
      localStorage.setItem(BACKGROUND_LIBRARY_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // If storage is full, keep the in-memory list and trim persisted history.
      const trimmed = items.slice(0, 8);
      try {
        localStorage.setItem(BACKGROUND_LIBRARY_STORAGE_KEY, JSON.stringify(trimmed));
      } catch {
        // Ignore storage failures on older browsers/quota issues.
      }
    }
  };

  const addBackgroundToLibrary = (
    src: string,
    name: string,
    source: 'server' | 'local'
  ) => {
    setBackgroundLibrary((prev) => {
      const withoutDuplicates = prev.filter((item) => item.src !== src);
      const next: SavedBackgroundImage[] = [
        {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          src,
          name,
          source,
          addedAt: new Date().toISOString(),
        },
        ...withoutDuplicates,
      ].slice(0, 20);

      persistBackgroundLibrary(next);
      return next;
    });
  };

  const removeBackgroundFromLibrary = (id: string, name: string) => {
    setBackgroundLibrary((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistBackgroundLibrary(next);
      return next;
    });

    toast.success('Background removed', {
      description: `${name} removed from saved images`
    });
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BACKGROUND_LIBRARY_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as SavedBackgroundImage[];
      if (Array.isArray(parsed)) {
        setBackgroundLibrary(parsed.filter((item) => item?.src));
      }
    } catch {
      setBackgroundLibrary([]);
    }
  }, []);

  useEffect(() => {
    if (!isImageValue(background)) return;

    setBackgroundLibrary((prev) => {
      const alreadyExists = prev.some((item) => item.src === background);
      if (alreadyExists) return prev;

      const next: SavedBackgroundImage[] = [
        {
          id: `active_${Date.now()}`,
          src: background,
          name: 'Current Active Background',
          source: background.startsWith('data:image') ? 'local' : 'server',
          addedAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 20);

      persistBackgroundLibrary(next);
      return next;
    });
  }, [background]);

  const handleBackgroundFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPG, PNG, or WebP)'
      });
      return;
    }

    if (file.size > MAX_BACKGROUND_FILE_SIZE) {
      toast.error('Image is too large', {
        description: 'Please upload an image smaller than 8MB'
      });
      return;
    }

    try {
      const result = await songAPI.uploadBackgroundImage(file);
      const uploadedUrl = result.url as string;
      onBackgroundChange(uploadedUrl);
      localStorage.setItem(ACTIVE_BACKGROUND_KEY, uploadedUrl);
      addBackgroundToLibrary(uploadedUrl, file.name, 'server');

      toast.success('Background image updated', {
        description: `${file.name} is now active on display and saved on server`
      });
    } catch (error: any) {
      try {
        const localImageData = await optimizeImageForLocalStorage(file);
        onBackgroundChange(localImageData);
        localStorage.setItem(ACTIVE_BACKGROUND_KEY, localImageData);
        addBackgroundToLibrary(localImageData, file.name, 'local');

        toast.success('Background image updated (offline mode)', {
          description: 'Saved locally because backend is unavailable'
        });
      } catch {
        toast.error('Failed to upload background image', {
          description: error.message || 'Please try another image file'
        });
      }
    } finally {
      event.target.value = '';
    }
  };

  // User management functions
  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (error: any) {
      console.error('Fetch users error:', error);
      toast.error('Failed to fetch users', {
        description: error.message
      });
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.full_name || !newUser.role || !newUser.email || !newUser.password) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await authAPI.createUser({
        username: newUser.username,
        password: newUser.password,
        fullName: newUser.full_name,
        role: newUser.role,
        email: newUser.email
      });
      if (response.success) {
        toast.success('User added successfully!');
        await fetchUsers(); // Refresh the list
        setNewUser({
          username: '',
          full_name: '',
          role: 'user',
          email: '',
          password: '',
        });
        setIsAddingUser(false);
      }
    } catch (error: any) {
      console.error('Add user error:', error);
      toast.error('Failed to add user', {
        description: error.message
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    if (!editingUser.username || !editingUser.full_name || !editingUser.role || !editingUser.email) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await authAPI.updateUser(editingUser.id, {
        fullName: editingUser.full_name,
        role: editingUser.role,
        email: editingUser.email,
        isActive: editingUser.is_active
      });
      if (response.success) {
        toast.success('User updated successfully!');
        await fetchUsers(); // Refresh the list
        setEditingUser(null);
        setIsEditingUser(false);
      }
    } catch (error: any) {
      console.error('Edit user error:', error);
      toast.error('Failed to update user', {
        description: error.message
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm(`Are you sure you want to delete this user?`)) {
      try {
        const response = await authAPI.deleteUser(userId);
        if (response.success) {
          toast.success('User deleted successfully!');
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (error: any) {
        console.error('Delete user error:', error);
        toast.error('Failed to delete user', {
          description: error.message
        });
      }
    }
  };

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await authAPI.updateUser(userId, { isActive });
      if (response.success) {
        toast.success('User status updated successfully!');
        await fetchUsers(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Toggle user status error:', error);
      toast.error('Failed to update user status', {
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Panel - የአስተዳዳሪ ፓነል</DialogTitle>
          <DialogDescription>
            Add, edit, or delete songs and configure presentation settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manage-songs" className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="manage-songs" className="flex-col gap-1 py-2 px-2">
              <Edit2 className="size-4" />
              <span className="text-xs">Manage</span>
            </TabsTrigger>
            <TabsTrigger value="auto-detect" className="flex-col gap-1 py-2 px-2">
              <FolderOpen className="size-4" />
              <span className="text-xs">Auto-Detect</span>
            </TabsTrigger>
            <TabsTrigger value="add-from-file" className="flex-col gap-1 py-2 px-2">
              <Upload className="size-4" />
              <span className="text-xs">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="add-manually" className="flex-col gap-1 py-2 px-2">
              <FileText className="size-4" />
              <span className="text-xs">Manual</span>
            </TabsTrigger>
            <TabsTrigger value="user-management" className="flex-col gap-1 py-2 px-2">
              <Users className="size-4" />
              <span className="text-xs">Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-col gap-1 py-2 px-2">
              <Palette className="size-4" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Manage Songs Tab */}
          <TabsContent value="manage-songs" className="space-y-4">
            <Alert>
              <Edit2 className="size-4" />
              <AlertDescription>
                Edit or delete existing songs. Click the edit button to modify song details and lyrics.
              </AlertDescription>
            </Alert>

            {editingSong ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <Card className="p-4 border-2" style={{ borderColor: '#E0AE3F', backgroundColor: '#F6EBD8' }}>
                  <h3 className="mb-2" style={{ color: '#865014' }}>Editing: {editingSong.titleEnglish}</h3>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-number">Song Number *</Label>
                    <Input
                      id="edit-number"
                      value={editFormData.number}
                      onChange={(e) => setEditFormData({ ...editFormData, number: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value: 'hymnal' | 'local') => 
                        setEditFormData({ ...editFormData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hymnal">Hymnal (ውዳሴ)</SelectItem>
                        <SelectItem value="local">Local Song (ሀገርኛ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-titleAmharic">Amharic Title *</Label>
                  <Input
                    id="edit-titleAmharic"
                    value={editFormData.titleAmharic}
                    onChange={(e) => setEditFormData({ ...editFormData, titleAmharic: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-titleEnglish">English Title *</Label>
                  <Input
                    id="edit-titleEnglish"
                    value={editFormData.titleEnglish}
                    onChange={(e) => setEditFormData({ ...editFormData, titleEnglish: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-lyrics">
                    Song Lyrics * 
                    <span className="text-sm text-gray-500 ml-2">
                      (Separate slides with double line breaks)
                    </span>
                  </Label>
                  <Textarea
                    id="edit-lyrics"
                    value={editFormData.lyrics}
                    onChange={(e) => setEditFormData({ ...editFormData, lyrics: e.target.value })}
                    rows={14}
                    required
                    className="font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={cancelEditingSong}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    style={{ backgroundColor: '#865014', color: 'white' }}
                    className="hover:opacity-90"
                  >
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Amharic Title</TableHead>
                      <TableHead>English Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Slides</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {songs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          No songs available. Add some songs to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      songs.map((song) => (
                        <TableRow key={song.id}>
                          <TableCell>{song.number}</TableCell>
                          <TableCell>{song.titleAmharic}</TableCell>
                          <TableCell>{song.titleEnglish}</TableCell>
                          <TableCell>
                            <span className="text-xs px-2 py-1 rounded" style={{
                              backgroundColor: song.category === 'hymnal' ? '#F6EBD8' : '#E0AE3F40',
                              color: '#865014'
                            }}>
                              {song.category === 'hymnal' ? 'Hymnal' : 'Local'}
                            </span>
                          </TableCell>
                          <TableCell>{song.lyrics.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingSong(song)}
                              >
                                <Edit2 className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWithConfirm(song)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Auto-Detect Files Tab */}
          <TabsContent value="auto-detect" className="space-y-4">
            <Alert>
              <FolderOpen className="size-4" />
              <AlertDescription>
                Automatically detect PPTX and PDF files in the uploads folder. Click scan to find files, then process and add song details.
              </AlertDescription>
            </Alert>

            {!selectedDetectedFile ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Files in Uploads Folder</h3>
                  <Button
                    onClick={scanUploadsFolder}
                    disabled={isScanning}
                    style={{ backgroundColor: '#865014', color: 'white' }}
                    className="hover:opacity-90"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="size-4 mr-2" />
                        Scan Folder
                      </>
                    )}
                  </Button>
                </div>

                {detectedFiles.length === 0 ? (
                  <Card className="p-8 text-center">
                    <FolderOpen className="size-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="mb-2 text-gray-700">No Files Found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Click "Scan Folder" to detect PPTX and PDF files in the uploads directory.
                    </p>
                    <p className="text-xs text-gray-400">
                      Place your files in: /kebena_backend/uploads/
                    </p>
                  </Card>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Filename</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detectedFiles.map((file) => (
                          <TableRow key={file.filename}>
                            <TableCell className="font-mono text-sm">{file.filename}</TableCell>
                            <TableCell>
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                {file.fileType.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell>{(file.fileSize / 1024).toFixed(2)} KB</TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => processDetectedFile(file)}
                                disabled={processingFile === file.filename}
                                size="sm"
                                style={{ backgroundColor: '#865014', color: 'white' }}
                                className="hover:opacity-90"
                              >
                                {processingFile === file.filename ? (
                                  <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  'Process'
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmitDetectedFile} className="space-y-4">
                <Card className="p-4 border-2" style={{ borderColor: '#E0AE3F', backgroundColor: '#F6EBD8' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="size-8" style={{ color: '#865014' }} />
                      <div>
                        <p className="font-medium" style={{ color: '#865014' }}>
                          {selectedDetectedFile.filename}
                        </p>
                        <p className="text-xs text-gray-600">
                          {detectedSlides.length} slides extracted • {(selectedDetectedFile.fileSize / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={cancelDetectedFile}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="detected-number">Song Number *</Label>
                    <Input
                      id="detected-number"
                      value={detectedFileSongData.number}
                      onChange={(e) => setDetectedFileSongData({ ...detectedFileSongData, number: e.target.value })}
                      placeholder="e.g., 001"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="detected-category">Category *</Label>
                    <Select
                      value={detectedFileSongData.category}
                      onValueChange={(value: 'hymnal' | 'local') => 
                        setDetectedFileSongData({ ...detectedFileSongData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hymnal">Hymnal (ውዳሴ)</SelectItem>
                        <SelectItem value="local">Local Song (ሀገርኛ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="detected-titleAmharic">Amharic Title *</Label>
                  <Input
                    id="detected-titleAmharic"
                    value={detectedFileSongData.titleAmharic}
                    onChange={(e) => setDetectedFileSongData({ ...detectedFileSongData, titleAmharic: e.target.value })}
                    placeholder="የአማርኛ ርዕስ"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="detected-titleEnglish">English Title *</Label>
                  <Input
                    id="detected-titleEnglish"
                    value={detectedFileSongData.titleEnglish}
                    onChange={(e) => setDetectedFileSongData({ ...detectedFileSongData, titleEnglish: e.target.value })}
                    placeholder="English Title"
                    required
                  />
                </div>

                <div>
                  <Label className="mb-3 block">
                    Extracted Slides (Click to edit)
                  </Label>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {detectedSlides.map((slide) => (
                      <Card key={slide.slideNumber} className="p-3">
                        <Label className="text-xs text-gray-500 mb-2 block">
                          Slide {slide.slideNumber}
                        </Label>
                        <Textarea
                          value={slide.content}
                          onChange={(e) => updateDetectedSlideContent(slide.slideNumber, e.target.value)}
                          rows={4}
                          className="font-mono text-sm"
                        />
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={cancelDetectedFile}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    style={{ backgroundColor: '#865014', color: 'white' }}
                    className="hover:opacity-90"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Song ({detectedSlides.length} slides)
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          {/* Add from File Tab (existing) */}
          <TabsContent value="add-from-file" className="space-y-4">
            <Alert>
              <Upload className="size-4" />
              <AlertDescription>
                Upload a PPT, PPTX, or PDF file and the system will automatically extract the slides. 
                You can review and edit the extracted content before adding the song.
              </AlertDescription>
            </Alert>

            {!uploadedFile ? (
              <div 
                className="border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer hover:border-[#E0AE3F] hover:bg-[#F6EBD8]/30"
                style={{ borderColor: '#865014' }}
                onClick={() => document.getElementById('fileUploadAuto')?.click()}
              >
                <Upload className="size-16 mx-auto mb-4" style={{ color: '#865014' }} />
                <h3 className="text-lg mb-2" style={{ color: '#865014' }}>Upload Song File</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click to select or drag and drop<br />
                  Supported: PDF, PPT, PPTX
                </p>
                <Input
                  id="fileUploadAuto"
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <form onSubmit={handleSubmitFromFile} className="space-y-4">
                <Card className="p-4 border-2" style={{ borderColor: '#E0AE3F', backgroundColor: '#F6EBD8' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isProcessing ? (
                        <Loader2 className="size-8 animate-spin" style={{ color: '#865014' }} />
                      ) : (
                        <CheckCircle className="size-8" style={{ color: '#865014' }} />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: '#865014' }}>
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {isProcessing 
                            ? 'Processing file...' 
                            : `${extractedSlides.length} slides extracted • ${(uploadedFile.size / 1024).toFixed(2)} KB`
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isProcessing}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </Card>

                {!isProcessing && extractedSlides.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="file-number">Song Number *</Label>
                        <Input
                          id="file-number"
                          value={fileSongData.number}
                          onChange={(e) => setFileSongData({ ...fileSongData, number: e.target.value })}
                          placeholder="e.g., 001"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="file-category">Category *</Label>
                        <Select
                          value={fileSongData.category}
                          onValueChange={(value: 'hymnal' | 'local') => 
                            setFileSongData({ ...fileSongData, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hymnal">Hymnal (ውዳሴ)</SelectItem>
                            <SelectItem value="local">Local Song (ሀገርኛ)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="file-titleAmharic">Amharic Title *</Label>
                      <Input
                        id="file-titleAmharic"
                        value={fileSongData.titleAmharic}
                        onChange={(e) => setFileSongData({ ...fileSongData, titleAmharic: e.target.value })}
                        placeholder="የአማርኛ ርዕስ"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="file-titleEnglish">English Title *</Label>
                      <Input
                        id="file-titleEnglish"
                        value={fileSongData.titleEnglish}
                        onChange={(e) => setFileSongData({ ...fileSongData, titleEnglish: e.target.value })}
                        placeholder="English Title"
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block">
                        Extracted Slides (Click to edit)
                      </Label>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {extractedSlides.map((slide) => (
                          <Card key={slide.slideNumber} className="p-3">
                            <Label className="text-xs text-gray-500 mb-2 block">
                              Slide {slide.slideNumber}
                            </Label>
                            <Textarea
                              value={slide.content}
                              onChange={(e) => updateSlideContent(slide.slideNumber, e.target.value)}
                              rows={4}
                              className="font-mono text-sm"
                            />
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={handleRemoveFile}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        style={{ backgroundColor: '#865014', color: 'white' }}
                        className="hover:opacity-90"
                      >
                        <Plus className="size-4 mr-2" />
                        Add Song ({extractedSlides.length} slides)
                      </Button>
                    </div>
                  </>
                )}
              </form>
            )}
          </TabsContent>

          {/* Add Manually Tab (existing) */}
          <TabsContent value="add-manually">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Alert>
                <FileText className="size-4" />
                <AlertDescription>
                  Manually enter all song details and lyrics. Separate slides with double line breaks (blank lines).
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-number">Song Number *</Label>
                  <Input
                    id="manual-number"
                    value={manualSong.number}
                    onChange={(e) => setManualSong({ ...manualSong, number: e.target.value })}
                    placeholder="e.g., 001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="manual-category">Category *</Label>
                  <Select
                    value={manualSong.category}
                    onValueChange={(value: 'hymnal' | 'local') => 
                      setManualSong({ ...manualSong, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hymnal">Hymnal (ውዳሴ)</SelectItem>
                      <SelectItem value="local">Local Song (ሀገርኛ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="manual-titleAmharic">Amharic Title *</Label>
                <Input
                  id="manual-titleAmharic"
                  value={manualSong.titleAmharic}
                  onChange={(e) => setManualSong({ ...manualSong, titleAmharic: e.target.value })}
                  placeholder="የአማርኛ ርዕስ"
                  required
                />
              </div>

              <div>
                <Label htmlFor="manual-titleEnglish">English Title *</Label>
                <Input
                  id="manual-titleEnglish"
                  value={manualSong.titleEnglish}
                  onChange={(e) => setManualSong({ ...manualSong, titleEnglish: e.target.value })}
                  placeholder="English Title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="manual-lyrics">
                  Song Lyrics * 
                  <span className="text-sm text-gray-500 ml-2">
                    (Separate slides with double line breaks)
                  </span>
                </Label>
                <Textarea
                  id="manual-lyrics"
                  value={manualSong.lyrics}
                  onChange={(e) => setManualSong({ ...manualSong, lyrics: e.target.value })}
                  placeholder="Enter first slide here...&#10;&#10;Press Enter twice to create a new slide&#10;&#10;Each section separated by blank lines becomes a slide"
                  rows={14}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Add a blank line between verses to create separate slides
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  style={{ backgroundColor: '#865014', color: 'white' }}
                  className="hover:opacity-90"
                >
                  <Plus className="size-4 mr-2" />
                  Add Song
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Display Settings Tab (existing) */}
          <TabsContent value="settings" className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Monitor className="size-5" />
                Display Background Settings
              </h4>
              <p className="text-sm text-blue-800">
                Upload a background image for the display screen. This image is saved locally and remains active
                until an admin uploads a different one.
              </p>
            </div>

            <div>
              <Label htmlFor="displayBackgroundUpload" className="text-lg font-semibold mb-3 block">
                Upload Background Image
              </Label>
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <Upload className="size-4 text-green-700" />
                  <AlertDescription className="text-sm text-green-800">
                    Only image file upload is enabled here. Supported formats: JPG, PNG, WebP.
                  </AlertDescription>
                </Alert>

                <Input
                  id="displayBackgroundUpload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBackgroundFileUpload}
                />

                <p className="text-xs text-gray-500">
                  Recommended size: 1920x1080 or larger. Uploaded image remains the active background until changed.
                </p>

                {backgroundLibrary.length > 0 && (
                  <div className="pt-2">
                    <Label className="mb-2 block">Previously Uploaded Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {backgroundLibrary.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-md p-2 text-left hover:border-gray-400 transition-colors"
                          title={item.name}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onBackgroundChange(item.src);
                              localStorage.setItem(ACTIVE_BACKGROUND_KEY, item.src);
                              toast.success('Background changed', {
                                description: `${item.name} applied`
                              });
                            }}
                            className="w-full text-left"
                          >
                            <div
                              className="h-16 rounded mb-2"
                              style={{
                                backgroundImage: `url(${item.src})`,
                                backgroundSize: '100% 100%',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                              }}
                            />
                            <p className="text-[11px] text-gray-700 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{item.source}</p>
                          </button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => removeBackgroundFromLibrary(item.id, item.name)}
                          >
                            <Trash2 className="size-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="mb-2">Song Background Color (When Song Is Open)</h4>
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-7 gap-2">
                  {songBackgroundPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onSongBackgroundColorChange(color)}
                      className={`h-8 rounded border-2 ${songBackgroundColor === color ? 'border-yellow-500' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={songBackgroundColor}
                    onChange={(e) => onSongBackgroundColorChange(e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={songBackgroundColor}
                    onChange={(e) => onSongBackgroundColorChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This color is shown only while a song is open on the extended screen.
                </p>
              </div>

              <h4 className="mb-2">Preview</h4>
              <div 
                className="h-32 rounded flex items-center justify-center text-white text-2xl"
                style={{
                  background: isImageValue(background) ? '#000000' : background,
                  backgroundImage: isImageValue(background) ? `url(${background})` : undefined,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                Sample Text / ናሙና ፅሁፍ
              </div>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="user-management" className="space-y-6">
            <div>
              <Label className="mb-3 block">User Management</Label>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Users</h3>
                <Button
                  onClick={() => setIsAddingUser(true)}
                  style={{ backgroundColor: '#865014', color: 'white' }}
                  className="hover:opacity-90"
                >
                  <Plus className="size-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No users available. Add some users to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded" style={{
                            backgroundColor: user.role === 'admin' ? '#F6EBD8' : '#E0AE3F40',
                            color: '#865014'
                          }}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={user.is_active}
                            onCheckedChange={(checked) => handleToggleUserStatus(user.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUserId(user.id);
                                setEditingUser(user);
                                setIsEditingUser(true);
                              }}
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Add User Form */}
            {isAddingUser && (
              <form onSubmit={handleAddUser} className="space-y-4">
                <Card className="p-4 border-2" style={{ borderColor: '#E0AE3F', backgroundColor: '#F6EBD8' }}>
                  <h3 className="mb-2" style={{ color: '#865014' }}>Add New User</h3>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-username">Username *</Label>
                    <Input
                      id="add-username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="add-full_name">Full Name *</Label>
                    <Input
                      id="add-full_name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="add-email">Email *</Label>
                  <Input
                    id="add-email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="add-role">Role *</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: 'admin' | 'user') => 
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="add-password">Password *</Label>
                  <Input
                    id="add-password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    style={{ backgroundColor: '#865014', color: 'white' }}
                    className="hover:opacity-90"
                  >
                    <Plus className="size-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </form>
            )}

            {/* Edit User Form */}
            {isEditingUser && editingUser && (
              <form onSubmit={handleEditUser} className="space-y-4">
                <Card className="p-4 border-2" style={{ borderColor: '#E0AE3F', backgroundColor: '#F6EBD8' }}>
                  <h3 className="mb-2" style={{ color: '#865014' }}>Edit User: {editingUser.username}</h3>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-username">Username *</Label>
                    <Input
                      id="edit-username"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-full_name">Full Name *</Label>
                    <Input
                      id="edit-full_name"
                      value={editingUser.full_name}
                      onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value: 'admin' | 'user') => 
                      setEditingUser({ ...editingUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsEditingUser(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    style={{ backgroundColor: '#865014', color: 'white' }}
                    className="hover:opacity-90"
                  >
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}