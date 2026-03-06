import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { parseHymnalXML } from '../utils/xmlParser';
import { dualStorageService } from '../services/dualStorage';
import { Song } from '../types';

interface XMLImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (songs: Song[]) => void;
}

export function XMLImporter({ isOpen, onClose, onImportComplete }: XMLImporterProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml')) {
      toast.error('Please select an XML file');
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const xmlContent = e.target?.result as string;
          
          // Parse XML to Song objects
          const parsedSongs = parseHymnalXML(xmlContent);
          
          if (parsedSongs.length === 0) {
            toast.error('No songs found in XML file');
            setIsImporting(false);
            return;
          }

          toast.info(`Found ${parsedSongs.length} songs. Importing...`);

          // Import songs using dual storage
          const result = await dualStorageService.importSongs(parsedSongs);

          setImportStatus({
            total: parsedSongs.length,
            success: result.success,
            failed: result.failed,
          });

          if (result.success > 0) {
            toast.success(`Successfully imported ${result.success} songs!`);
            onImportComplete(parsedSongs);
          }

          if (result.failed > 0) {
            toast.error(`Failed to import ${result.failed} songs`);
          }

        } catch (error) {
          console.error('Error parsing XML:', error);
          toast.error('Error parsing XML file. Please check the format.');
        } finally {
          setIsImporting(false);
        }
      };

      reader.onerror = () => {
        toast.error('Error reading file');
        setIsImporting(false);
      };

      reader.readAsText(file);

    } catch (error) {
      console.error('Error importing XML:', error);
      toast.error('Error importing XML file');
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setImportStatus(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-5" style={{ color: '#865014' }} />
            Import Hymnal Songs from XML
          </DialogTitle>
          <DialogDescription>
            Upload the hymnal XML file to import songs into the database and local storage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!importStatus && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Select the hymnal XML file to import
              </p>
              <label htmlFor="xml-upload">
                <Button
                  asChild
                  disabled={isImporting}
                  style={{ backgroundColor: '#865014', color: 'white' }}
                >
                  <span>
                    {isImporting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="size-4 mr-2" />
                        Choose XML File
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <input
                id="xml-upload"
                type="file"
                accept=".xml"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="hidden"
              />
            </div>
          )}

          {importStatus && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-1">Import Complete!</h4>
                    <p className="text-sm text-green-700">
                      Successfully imported {importStatus.success} out of {importStatus.total} songs
                    </p>
                  </div>
                </div>
              </div>

              {importStatus.failed > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 mb-1">Some Songs Failed</h4>
                      <p className="text-sm text-red-700">
                        {importStatus.failed} songs could not be imported
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Dual Storage:</strong> Songs are saved to both local storage (always available) 
                  and database (if XAMPP is running).
                </p>
              </div>

              <Button
                onClick={handleClose}
                className="w-full"
                style={{ backgroundColor: '#865014', color: 'white' }}
              >
                Done
              </Button>
            </div>
          )}

          {isImporting && (
            <div className="text-center py-4">
              <Loader2 className="size-8 animate-spin mx-auto mb-2 text-[#865014]" />
              <p className="text-sm text-gray-600">Parsing and importing songs...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
