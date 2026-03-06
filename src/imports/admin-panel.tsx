import { useState, useEffect } from "react";
import { Song } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Plus,
  Palette,
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
  Edit2,
  Trash2,
  FolderOpen,
  RefreshCw,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";
import { Card } from "./ui/card";
import { songAPI } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface AdminPanelProps {
  songs: Song[];
  onAddSong: (song: Omit<Song, "id">) => void;
  onEditSong: (id: number, song: Partial<Song>) => void;
  onDeleteSong: (id: number) => void;
  onClose: () => void;
  background: string;
  onBackgroundChange: (bg: string) => void;
  extendedScreenBackground: string;
  onExtendedScreenBackgroundChange: (bg: string) => void;
  editingSongId?: number | null;
  roomId: string;
  displayBackgroundMode: "presentation" | "custom";
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

export function AdminPanel(props: Readonly<AdminPanelProps>) {
  const {
    songs,
    onAddSong,
    onEditSong,
    onDeleteSong,
    onClose,
    background,
    onBackgroundChange,
    extendedScreenBackground,
    onExtendedScreenBackgroundChange,
    editingSongId,
    roomId,
    displayBackgroundMode,
  } = props;

  // Manual entry state
  const [manualSong, setManualSong] = useState({
    number: "",
    category: "hymnal" as "hymnal" | "local",
    titleAmharic: "",
    titleEnglish: "",
    lyrics: "",
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedSlides, setExtractedSlides] = useState<ExtractedSlide[]>([]);
  const [fileSongData, setFileSongData] = useState({
    number: "",
    category: "hymnal" as "hymnal" | "local",
    titleAmharic: "",
    titleEnglish: "",
  });

  // Edit song state
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editFormData, setEditFormData] = useState({
    number: "",
    category: "hymnal" as "hymnal" | "local",
    titleAmharic: "",
    titleEnglish: "",
    lyrics: "",
  });

  // Auto-detect files state
  const [detectedFiles, setDetectedFiles] = useState<DetectedFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [selectedDetectedFile, setSelectedDetectedFile] =
    useState<DetectedFile | null>(null);
  const [detectedSlides, setDetectedSlides] = useState<ExtractedSlide[]>([]);
  const [detectedFileSongData, setDetectedFileSongData] = useState({
    number: "",
    category: "hymnal" as "hymnal" | "local",
    titleAmharic: "",
    titleEnglish: "",
  });

  // Background image upload state
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  const withCacheBuster = (url: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Date.now()}`;
  };

  const isImageBackground = (value: string) => {
    if (!value) return false;
    if (
      value.startsWith("linear-gradient") ||
      value.startsWith("radial-gradient")
    ) {
      return false;
    }
    return (
      /^(https?:|data:|blob:|\/)/.test(value) ||
      /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(value)
    );
  };

  // Get effective background for preview
  const getEffectivePreviewBackground = () => {
    if (displayBackgroundMode === "custom" && extendedScreenBackground) {
      return extendedScreenBackground;
    }
    return background;
  };

  // Broadcast background changes to all windows
  useEffect(() => {
    const effectiveBackground = getEffectivePreviewBackground();

    const message = {
      type: "SET_BACKGROUND",
      background: effectiveBackground || "#000000",
      mode: displayBackgroundMode,
    };

    // Send to parent window (App)
    globalThis.postMessage(message, globalThis.location.origin);

    // Broadcast to DisplayPage windows
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(`kebena-display-${roomId}`);
      channel.postMessage(message);
      channel.close();
    }
  }, [background, extendedScreenBackground, displayBackgroundMode, roomId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "ppt", "pptx"].includes(fileExtension || "")) {
      toast.error("Invalid file type", {
        description: "Please upload a PDF, PPT, or PPTX file",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    toast.info("Uploading file...", {
      description: "Processing " + file.name,
    });

    try {
      const response = await songAPI.uploadFile(file);

      if (response.success) {
        const slides: ExtractedSlide[] = response.extraction.slides.map(
          (content: string, index: number) => ({
            slideNumber: index + 1,
            content,
          }),
        );

        setExtractedSlides(slides);

        toast.success("File processed successfully!", {
          description: `Extracted ${slides.length} slides from ${file.name}`,
        });
      } else {
        throw new Error(response.message || "Failed to process file");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      toast.error("File upload failed", {
        description:
          error.message ||
          "Could not process file. Make sure backend is running.",
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
      number: "",
      category: "hymnal",
      titleAmharic: "",
      titleEnglish: "",
    });
  };

  const handleSubmitFromFile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      toast.error("Please upload a file");
      return;
    }

    if (
      !fileSongData.number ||
      !fileSongData.titleAmharic ||
      !fileSongData.titleEnglish
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (extractedSlides.length === 0) {
      toast.error("No slides extracted from file");
      return;
    }

    onAddSong({
      number: fileSongData.number,
      category: fileSongData.category,
      titleAmharic: fileSongData.titleAmharic,
      titleEnglish: fileSongData.titleEnglish,
      lyrics: extractedSlides.map((slide) => slide.content),
      metadata: {
        creator: "Admin",
        uploader: "Admin",
        updatedDate: new Date().toISOString().split("T")[0],
        sourceFile: uploadedFile.name,
        fileType: uploadedFile.name.endsWith(".pdf") ? "pdf" : "ppt",
      },
    });

    toast.success("Song added successfully!", {
      description: `${fileSongData.titleEnglish} with ${extractedSlides.length} slides`,
    });

    handleRemoveFile();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !manualSong.number ||
      !manualSong.titleAmharic ||
      !manualSong.titleEnglish
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!manualSong.lyrics) {
      toast.error("Please enter lyrics for the song");
      return;
    }

    const lyricsArray = manualSong.lyrics
      .split("\n\n")
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);

    if (lyricsArray.length === 0) {
      toast.error("Please enter lyrics for the song");
      return;
    }

    onAddSong({
      number: manualSong.number,
      category: manualSong.category,
      titleAmharic: manualSong.titleAmharic,
      titleEnglish: manualSong.titleEnglish,
      lyrics: lyricsArray,
      metadata: {
        creator: "Admin",
        uploader: "Admin",
        updatedDate: new Date().toISOString().split("T")[0],
        fileType: "manual",
      },
    });

    toast.success("Song added successfully!", {
      description: `${manualSong.titleEnglish} with ${lyricsArray.length} slides`,
    });

    setManualSong({
      number: "",
      category: "hymnal",
      titleAmharic: "",
      titleEnglish: "",
      lyrics: "",
    });
  };

  const updateSlideContent = (slideNumber: number, newContent: string) => {
    setExtractedSlides((slides) =>
      slides.map((slide) =>
        slide.slideNumber === slideNumber
          ? { ...slide, content: newContent }
          : slide,
      ),
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
      lyrics: song.lyrics.join("\n\n"),
    });
  };

  const cancelEditingSong = () => {
    setEditingSong(null);
    setEditFormData({
      number: "",
      category: "hymnal",
      titleAmharic: "",
      titleEnglish: "",
      lyrics: "",
    });
  };

  useEffect(() => {
    if (editingSongId == null) return;
    const songToEdit = songs.find((song) => song.id === editingSongId);
    if (songToEdit) {
      startEditingSong(songToEdit);
    }
  }, [editingSongId, songs]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSong) return;

    if (
      !editFormData.number ||
      !editFormData.titleAmharic ||
      !editFormData.titleEnglish
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editFormData.lyrics) {
      toast.error("Please enter lyrics for the song");
      return;
    }

    const lyricsArray = editFormData.lyrics
      .split("\n\n")
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);

    if (lyricsArray.length === 0) {
      toast.error("Please enter lyrics for the song");
      return;
    }

    onEditSong(editingSong.id, {
      number: editFormData.number,
      category: editFormData.category,
      titleAmharic: editFormData.titleAmharic,
      titleEnglish: editFormData.titleEnglish,
      lyrics: lyricsArray,
    });

    toast.success("Song updated successfully!");
    cancelEditingSong();
  };

  const handleDeleteWithConfirm = (song: Song) => {
    if (
      globalThis.confirm(
        `Are you sure you want to delete "${song.titleEnglish}"?`,
      )
    ) {
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
        toast.success(
          `Found ${response.files?.length || 0} files in uploads folder`,
        );
      }
    } catch (error: any) {
      console.error("Scan error:", error);
      toast.error("Failed to scan uploads folder", {
        description: error.message,
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
        const slides: ExtractedSlide[] = response.extraction.slides.map(
          (content: string, index: number) => ({
            slideNumber: index + 1,
            content,
          }),
        );

        setDetectedSlides(slides);
        setSelectedDetectedFile(file);

        toast.success("File processed successfully!", {
          description: `Extracted ${slides.length} slides`,
        });
      }
    } catch (error: any) {
      console.error("Process file error:", error);
      toast.error("Failed to process file", {
        description: error.message,
      });
    } finally {
      setProcessingFile(null);
    }
  };

  const cancelDetectedFile = () => {
    setSelectedDetectedFile(null);
    setDetectedSlides([]);
    setDetectedFileSongData({
      number: "",
      category: "hymnal",
      titleAmharic: "",
      titleEnglish: "",
    });
  };

  const handleSubmitDetectedFile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDetectedFile) {
      toast.error("No file selected");
      return;
    }

    if (
      !detectedFileSongData.number ||
      !detectedFileSongData.titleAmharic ||
      !detectedFileSongData.titleEnglish
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (detectedSlides.length === 0) {
      toast.error("No slides extracted from file");
      return;
    }

    onAddSong({
      number: detectedFileSongData.number,
      category: detectedFileSongData.category,
      titleAmharic: detectedFileSongData.titleAmharic,
      titleEnglish: detectedFileSongData.titleEnglish,
      lyrics: detectedSlides.map((slide) => slide.content),
      metadata: {
        creator: "Admin",
        uploader: "Admin",
        updatedDate: new Date().toISOString().split("T")[0],
        sourceFile: selectedDetectedFile.filename,
        fileType: selectedDetectedFile.fileType,
      },
    });

    toast.success("Song added successfully!", {
      description: `${detectedFileSongData.titleEnglish} with ${detectedSlides.length} slides`,
    });

    cancelDetectedFile();
    scanUploadsFolder();
  };

  const updateDetectedSlideContent = (
    slideNumber: number,
    newContent: string,
  ) => {
    setDetectedSlides((slides) =>
      slides.map((slide) =>
        slide.slideNumber === slideNumber
          ? { ...slide, content: newContent }
          : slide,
      ),
    );
  };

  // Background image upload function
  const handleBackgroundImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPG, PNG, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setIsUploadingBackground(true);

    try {
      const result = await songAPI.uploadBackgroundImage(file);

      if (result.success && result.url) {
        onExtendedScreenBackgroundChange(withCacheBuster(result.url));
        toast.success("Background image uploaded successfully!", {
          description: "Extended screen background has been updated and saved",
        });
      } else {
        throw new Error(result.message || "Failed to upload image");
      }
    } catch (error: any) {
      console.error("Background upload error:", error);
      toast.error("Failed to upload background image", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsUploadingBackground(false);
    }
  };

  const removeBackgroundImage = () => {
    onExtendedScreenBackgroundChange("");
    toast.info("Background image removed", {
      description: "Extended screen will use presentation background",
    });
  };

  const backgroundPresets = [
    { name: "Church Brown", value: "#865014" },
    { name: "Church Gold", value: "#E0AE3F" },
    { name: "Dark Blue", value: "#1a1a2e" },
    { name: "Deep Purple", value: "#2d1b69" },
    { name: "Forest Green", value: "#1b4332" },
    { name: "Charcoal", value: "#1a1a1a" },
  ];

  const handleExtendedPresetSelect = (bg: string) => {
    onExtendedScreenBackgroundChange(bg);
  };

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
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger
              value="manage-songs"
              className="flex-col gap-1 py-2 px-2"
            >
              <Edit2 className="size-4" />
              <span className="text-xs">Manage</span>
            </TabsTrigger>
            <TabsTrigger
              value="auto-detect"
              className="flex-col gap-1 py-2 px-2"
            >
              <FolderOpen className="size-4" />
              <span className="text-xs">Auto-Detect</span>
            </TabsTrigger>
            <TabsTrigger
              value="add-from-file"
              className="flex-col gap-1 py-2 px-2"
            >
              <Upload className="size-4" />
              <span className="text-xs">Upload</span>
            </TabsTrigger>
            <TabsTrigger
              value="add-manually"
              className="flex-col gap-1 py-2 px-2"
            >
              <FileText className="size-4" />
              <span className="text-xs">Manual</span>
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
                Edit or delete existing songs. Click the edit button to modify
                song details and lyrics.
              </AlertDescription>
            </Alert>

            {editingSong ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <Card
                  className="p-4 border-2"
                  style={{ borderColor: "#E0AE3F", backgroundColor: "#F6EBD8" }}
                >
                  <h3 className="mb-2" style={{ color: "#865014" }}>
                    Editing: {editingSong.titleEnglish}
                  </h3>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-number">Song Number *</Label>
                    <Input
                      id="edit-number"
                      value={editFormData.number}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          number: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-category">Category *</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value: "hymnal" | "local") =>
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
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        titleAmharic: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-titleEnglish">English Title *</Label>
                  <Input
                    id="edit-titleEnglish"
                    value={editFormData.titleEnglish}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        titleEnglish: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-lyrics">
                    Song Lyrics *{" "}
                    <span className="text-sm text-gray-500 ml-2">
                      (Separate slides with double line breaks)
                    </span>
                  </Label>
                  <Textarea
                    id="edit-lyrics"
                    value={editFormData.lyrics}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lyrics: e.target.value,
                      })
                    }
                    rows={14}
                    required
                    className="font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditingSong}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#865014", color: "white" }}
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
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500"
                        >
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
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor:
                                  song.category === "hymnal"
                                    ? "#F6EBD8"
                                    : "#E0AE3F40",
                                color: "#865014",
                              }}
                            >
                              {song.category === "hymnal" ? "Hymnal" : "Local"}
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
                Automatically detect PPT, PPTX, and PDF files in the uploads
                folder. Click scan to find files, then process and add song
                details.
              </AlertDescription>
            </Alert>

            {selectedDetectedFile === null ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Files in Uploads Folder</h3>
                  <Button
                    onClick={scanUploadsFolder}
                    disabled={isScanning}
                    style={{ backgroundColor: "#865014", color: "white" }}
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
                      Click "Scan Folder" to detect PPT, PPTX, and PDF files in
                      the uploads directory.
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
                            <TableCell className="font-mono text-sm">
                              {file.filename}
                            </TableCell>
                            <TableCell>
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                {file.fileType.toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell>
                              {(file.fileSize / 1024).toFixed(2)} KB
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => processDetectedFile(file)}
                                disabled={processingFile === file.filename}
                                size="sm"
                                style={{
                                  backgroundColor: "#865014",
                                  color: "white",
                                }}
                                className="hover:opacity-90"
                              >
                                {processingFile === file.filename ? (
                                  <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Process"
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
                <Card
                  className="p-4 border-2"
                  style={{ borderColor: "#E0AE3F", backgroundColor: "#F6EBD8" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle
                        className="size-8"
                        style={{ color: "#865014" }}
                      />
                      <div>
                        <p className="font-medium" style={{ color: "#865014" }}>
                          {selectedDetectedFile.filename}
                        </p>
                        <p className="text-xs text-gray-600">
                          {detectedSlides.length} slides extracted •{" "}
                          {(selectedDetectedFile.fileSize / 1024).toFixed(2)} KB
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
                      onChange={(e) =>
                        setDetectedFileSongData({
                          ...detectedFileSongData,
                          number: e.target.value,
                        })
                      }
                      placeholder="e.g., 001"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="detected-category">Category *</Label>
                    <Select
                      value={detectedFileSongData.category}
                      onValueChange={(value: "hymnal" | "local") =>
                        setDetectedFileSongData({
                          ...detectedFileSongData,
                          category: value,
                        })
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
                    onChange={(e) =>
                      setDetectedFileSongData({
                        ...detectedFileSongData,
                        titleAmharic: e.target.value,
                      })
                    }
                    placeholder="የአማርኛ ርዕስ"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="detected-titleEnglish">English Title *</Label>
                  <Input
                    id="detected-titleEnglish"
                    value={detectedFileSongData.titleEnglish}
                    onChange={(e) =>
                      setDetectedFileSongData({
                        ...detectedFileSongData,
                        titleEnglish: e.target.value,
                      })
                    }
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
                          onChange={(e) =>
                            updateDetectedSlideContent(
                              slide.slideNumber,
                              e.target.value,
                            )
                          }
                          rows={4}
                          className="font-mono text-sm"
                        />
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelDetectedFile}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    style={{ backgroundColor: "#865014", color: "white" }}
                    className="hover:opacity-90"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Song ({detectedSlides.length} slides)
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          {/* Add from File Tab */}
          <TabsContent value="add-from-file" className="space-y-4">
            <Alert>
              <Upload className="size-4" />
              <AlertDescription>
                Upload a PPT, PPTX, or PDF file and the system will
                automatically extract the slides. You can review and edit the
                extracted content before adding the song.
              </AlertDescription>
            </Alert>

            {uploadedFile === null ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("fileUploadAuto")?.click()
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById("fileUploadAuto")?.click();
                    }
                  }}
                  className="border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer hover:border-[#E0AE3F] hover:bg-[#F6EBD8]/30 w-full"
                  style={{ borderColor: "#865014" }}
                >
                  <Upload
                    className="size-16 mx-auto mb-4"
                    style={{ color: "#865014" }}
                  />
                  <h3 className="text-lg mb-2" style={{ color: "#865014" }}>
                    Upload Song File
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Click to select or drag and drop
                    <br />
                    Supported: PDF, PPT, PPTX
                  </p>
                </button>
                <Input
                  id="fileUploadAuto"
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            ) : (
              <form onSubmit={handleSubmitFromFile} className="space-y-4">
                <Card
                  className="p-4 border-2"
                  style={{ borderColor: "#E0AE3F", backgroundColor: "#F6EBD8" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isProcessing ? (
                        <Loader2
                          className="size-8 animate-spin"
                          style={{ color: "#865014" }}
                        />
                      ) : (
                        <CheckCircle
                          className="size-8"
                          style={{ color: "#865014" }}
                        />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: "#865014" }}>
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {isProcessing
                            ? "Processing file..."
                            : `${extractedSlides.length} slides extracted • ${(uploadedFile.size / 1024).toFixed(2)} KB`}
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
                          onChange={(e) =>
                            setFileSongData({
                              ...fileSongData,
                              number: e.target.value,
                            })
                          }
                          placeholder="e.g., 001"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="file-category">Category *</Label>
                        <Select
                          value={fileSongData.category}
                          onValueChange={(value: "hymnal" | "local") =>
                            setFileSongData({
                              ...fileSongData,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hymnal">Hymnal (ውዳሴ)</SelectItem>
                            <SelectItem value="local">
                              Local Song (ሀገርኛ)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="file-titleAmharic">Amharic Title *</Label>
                      <Input
                        id="file-titleAmharic"
                        value={fileSongData.titleAmharic}
                        onChange={(e) =>
                          setFileSongData({
                            ...fileSongData,
                            titleAmharic: e.target.value,
                          })
                        }
                        placeholder="የአማርኛ ርዕስ"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="file-titleEnglish">English Title *</Label>
                      <Input
                        id="file-titleEnglish"
                        value={fileSongData.titleEnglish}
                        onChange={(e) =>
                          setFileSongData({
                            ...fileSongData,
                            titleEnglish: e.target.value,
                          })
                        }
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
                              onChange={(e) =>
                                updateSlideContent(
                                  slide.slideNumber,
                                  e.target.value,
                                )
                              }
                              rows={4}
                              className="font-mono text-sm"
                            />
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveFile}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        style={{ backgroundColor: "#865014", color: "white" }}
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

          {/* Add Manually Tab */}
          <TabsContent value="add-manually">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Alert>
                <FileText className="size-4" />
                <AlertDescription>
                  Manually enter all song details and lyrics. Separate slides
                  with double line breaks (blank lines).
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-number">Song Number *</Label>
                  <Input
                    id="manual-number"
                    value={manualSong.number}
                    onChange={(e) =>
                      setManualSong({ ...manualSong, number: e.target.value })
                    }
                    placeholder="e.g., 001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="manual-category">Category *</Label>
                  <Select
                    value={manualSong.category}
                    onValueChange={(value: "hymnal" | "local") =>
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
                  onChange={(e) =>
                    setManualSong({
                      ...manualSong,
                      titleAmharic: e.target.value,
                    })
                  }
                  placeholder="የአማርኛ ርዕስ"
                  required
                />
              </div>

              <div>
                <Label htmlFor="manual-titleEnglish">English Title *</Label>
                <Input
                  id="manual-titleEnglish"
                  value={manualSong.titleEnglish}
                  onChange={(e) =>
                    setManualSong({
                      ...manualSong,
                      titleEnglish: e.target.value,
                    })
                  }
                  placeholder="English Title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="manual-lyrics">
                  Song Lyrics *{" "}
                  <span className="text-sm text-gray-500 ml-2">
                    (Separate slides with double line breaks)
                  </span>
                </Label>
                <Textarea
                  id="manual-lyrics"
                  value={manualSong.lyrics}
                  onChange={(e) =>
                    setManualSong({ ...manualSong, lyrics: e.target.value })
                  }
                  placeholder="Enter first slide here...&#10;&#10;Press Enter twice to create a new slide&#10;&#10;Each section separated by blank lines becomes a slide"
                  rows={14}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Add a blank line between verses to create separate
                  slides
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  style={{ backgroundColor: "#865014", color: "white" }}
                  className="hover:opacity-90"
                >
                  <Plus className="size-4 mr-2" />
                  Add Song
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <Label className="mb-3 block">
                Background Color for Presentation
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {backgroundPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onBackgroundChange(preset.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      background === preset.value &&
                      displayBackgroundMode === "presentation"
                        ? "ring-2"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{
                      backgroundColor: preset.value,
                      borderColor:
                        background === preset.value &&
                        displayBackgroundMode === "presentation"
                          ? "#E0AE3F"
                          : undefined,
                      boxShadow:
                        background === preset.value &&
                        displayBackgroundMode === "presentation"
                          ? "0 0 0 2px #E0AE3F40"
                          : undefined,
                    }}
                  >
                    <span className="text-white text-sm drop-shadow-lg">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="customColor">Custom Background Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="customColor"
                  type="color"
                  value={background}
                  onChange={(e) => onBackgroundChange(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={background}
                  onChange={(e) => onBackgroundChange(e.target.value)}
                  placeholder="#1a1a2e"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Extended Screen Background Image Section */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block">
                    Extended Screen Background Image
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    This image appears on the extended screen when no song is
                    displayed
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Current mode:{" "}
                    {displayBackgroundMode === "custom"
                      ? "Custom Image"
                      : "Presentation Color"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Background Image Upload Area */}
                {!extendedScreenBackground ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("backgroundImageUpload")
                          ?.click()
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          document
                            .getElementById("backgroundImageUpload")
                            ?.click();
                        }
                      }}
                      className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-[#E0AE3F] hover:bg-[#F6EBD8]/30 w-full"
                      style={{ borderColor: "#865014" }}
                    >
                      <ImageIcon
                        className="size-12 mx-auto mb-4"
                        style={{ color: "#865014" }}
                      />
                      <h3 className="text-lg mb-2" style={{ color: "#865014" }}>
                        Upload Background Image
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Click to select an image for the extended screen
                        background
                        <br />
                        Recommended: 1920x1080 landscape image
                      </p>
                      <Button
                        type="button"
                        disabled={isUploadingBackground}
                        style={{ backgroundColor: "#865014", color: "white" }}
                        className="hover:opacity-90"
                      >
                        {isUploadingBackground ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="size-4 mr-2" />
                            Select Image
                          </>
                        )}
                      </Button>
                    </button>
                    <Input
                      id="backgroundImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                    />
                  </>
                ) : (
                  <Card
                    className="p-4 border-2"
                    style={{
                      borderColor:
                        displayBackgroundMode === "custom"
                          ? "#E0AE3F"
                          : "#9CA3AF",
                      backgroundColor: "#F6EBD8",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle
                          className="size-6"
                          style={{
                            color:
                              displayBackgroundMode === "custom"
                                ? "#865014"
                                : "#9CA3AF",
                          }}
                        />
                        <div>
                          <p
                            className="font-medium"
                            style={{
                              color:
                                displayBackgroundMode === "custom"
                                  ? "#865014"
                                  : "#4B5563",
                            }}
                          >
                            Background Image Set
                          </p>
                          <p className="text-xs text-gray-600">
                            {displayBackgroundMode === "custom"
                              ? "Currently displayed on extended screen"
                              : "Not active - using presentation color"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeBackgroundImage}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    {/* Preview - Shows CURRENT effective background */}
                    <div className="mt-4">
                      <Label className="mb-2 block">
                        Current Extended Screen Preview
                      </Label>
                      {(() => {
                        const effectivePreview =
                          getEffectivePreviewBackground();
                        const isImage = isImageBackground(effectivePreview);
                        return (
                          <div
                            className="h-48 rounded-lg overflow-hidden border transition-all duration-300"
                            style={{
                              background: isImage
                                ? "#000000"
                                : effectivePreview,
                              backgroundImage: isImage
                                ? `url(${effectivePreview})`
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="w-full h-full bg-black/40 flex items-center justify-center">
                              <span className="text-white text-lg font-medium drop-shadow-lg">
                                Extended Screen
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="flex justify-end mt-3 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document
                              .getElementById("backgroundImageReplace")
                              ?.click()
                          }
                        >
                          Replace Image
                        </Button>
                        {displayBackgroundMode !== "custom" && (
                          <Button
                            type="button"
                            size="sm"
                            style={{
                              backgroundColor: "#865014",
                              color: "white",
                            }}
                            onClick={() =>
                              onExtendedScreenBackgroundChange(
                                extendedScreenBackground,
                              )
                            }
                          >
                            Activate Image
                          </Button>
                        )}
                      </div>
                      <Input
                        id="backgroundImageReplace"
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                        className="hidden"
                      />
                    </div>
                  </Card>
                )}

                {/* Default Background Options */}
                <div>
                  <Label className="mb-2 block">Or use a preset:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleExtendedPresetSelect("")}
                      className={`p-3 rounded border transition-colors text-center ${
                        displayBackgroundMode === "presentation" &&
                        !extendedScreenBackground
                          ? "border-[#E0AE3F] ring-2 ring-[#E0AE3F]/50"
                          : "hover:border-[#865014]"
                      }`}
                    >
                      <div className="h-20 rounded mb-2 bg-gradient-to-br from-gray-800 to-black"></div>
                      <span className="text-sm">Default Black</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleExtendedPresetSelect(
                          "linear-gradient(135deg, #865014 0%, #E0AE3F 100%)",
                        )
                      }
                      className={`p-3 rounded border transition-colors text-center ${
                        extendedScreenBackground ===
                        "linear-gradient(135deg, #865014 0%, #E0AE3F 100%)"
                          ? "border-[#E0AE3F] ring-2 ring-[#E0AE3F]/50"
                          : "hover:border-[#865014]"
                      }`}
                    >
                      <div
                        className="h-20 rounded mb-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #865014 0%, #E0AE3F 100%)",
                        }}
                      ></div>
                      <span className="text-sm">Church Gradient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleExtendedPresetSelect(
                          "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                        )
                      }
                      className={`p-3 rounded border transition-colors text-center ${
                        extendedScreenBackground ===
                        "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                          ? "border-[#E0AE3F] ring-2 ring-[#E0AE3F]/50"
                          : "hover:border-[#865014]"
                      }`}
                    >
                      <div
                        className="h-20 rounded mb-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                        }}
                      ></div>
                      <span className="text-sm">Blue Gradient</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="mb-2 font-medium">Current Display Settings</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-600">Mode:</span>{" "}
                  {displayBackgroundMode === "custom"
                    ? "Custom Image"
                    : "Presentation Color"}
                </p>
                <p>
                  <span className="text-gray-600">Active background:</span>{" "}
                  {getEffectivePreviewBackground()}
                </p>
              </div>
              <div
                className="h-20 rounded mt-3 flex items-center justify-center text-white"
                style={{
                  background: getEffectivePreviewBackground(),
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="drop-shadow-lg">Preview</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
