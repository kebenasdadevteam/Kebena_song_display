import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Smartphone, Monitor, Copy, Check, Wifi, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { useWebSocket } from '../hooks/useWebSocket';
import { Song } from '../types';

interface MobileControlProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong?: Song | null;
  roomId: string;
  background?: string;
  userName?: string;
}

export function MobileControl({
  isOpen,
  onClose,
  currentSong,
  roomId,
  background = '#1a1a2e',
  userName = 'User',
}: MobileControlProps) {
  const [connectedDevices, setConnectedDevices] = useState({
    control: 0,
    display: 0,
  });
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const effectiveRoomId = roomId || 'default';

  const { sendMessage, isConnected } = useWebSocket(
    'control',
    effectiveRoomId,
    (message) => {
      if (!message) return;

      if (
        message.type === 'welcome' ||
        message.type === 'device_connected' ||
        message.type === 'device_disconnected'
      ) {
        const devices = message.data?.connectedDevices;
        if (devices) {
          setConnectedDevices({
            control: devices.control ?? 0,
            display: devices.display ?? 0,
          });
        }
      }
    }
  );

  const baseUrl = window.location.origin;
  const controlUrl = `${baseUrl}/control/${effectiveRoomId}`;
  const displayUrl = `${baseUrl}/display/${effectiveRoomId}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setCopiedType(type);
      toast.success(`${type} URL copied to clipboard!`);
      setTimeout(() => {
        setCopied(false);
        setCopiedType(null);
      }, 2000);
    });
  };

  const openInNewTab = (url: string, type: string) => {
    void url;
    toast.info(`${type} popup is disabled`);
  };

  const openDisplayScreen = () => {
    void displayUrl;
    void background;
    toast.info('Display popup is disabled');
  };

  const handleSync = () => {
    if (!currentSong) {
      toast.error('No song selected to sync');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to server. Sync requires server connection.');
      return;
    }

    try {
      const syncData = {
        type: 'sync_state',
        song: currentSong,
        timestamp: new Date().toISOString(),
        roomId: effectiveRoomId,
      };

      const sent = sendMessage('sync_state', syncData);
      if (sent) {
        toast.success('Sync sent to all devices');
      } else {
        toast.error('Sync failed to send');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error('Sync failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="sticky top-0 bg-background z-20 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="size-5" style={{ color: '#865014' }} />
                Mobile Control
              </DialogTitle>
              <DialogDescription>
                Links and sync for multiple devices
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-2"
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Connection Status */}
          <div
            className="text-white p-3 rounded-lg"
            style={{ background: 'linear-gradient(to right, #865014, #E0AE3F)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="size-5" />
                <div>
                  <p className="font-medium">Room: {roomId}</p>
                  <p className="text-xs opacity-90">
                    {connectedDevices.control} control • {connectedDevices.display} display
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                />
                <span className="text-xs font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {/* Control Link */}
          <div className="border rounded-lg p-3">
            <Label className="text-xs font-medium flex items-center gap-2 mb-2">
              <Smartphone className="size-4" />
              Control Link (for phones/tablets)
            </Label>
            <div className="flex gap-2">
              <Input
                value={controlUrl}
                readOnly
                className="text-sm font-mono flex-1"
              />
              <div className="flex gap-1">
                <Button
                  onClick={() => copyToClipboard(controlUrl, 'Control')}
                  size="sm"
                  variant="outline"
                  className="h-10"
                  title="Copy URL"
                >
                  {copied && copiedType === 'Control' ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
                <Button
                  onClick={() => openInNewTab(controlUrl, 'Control')}
                  size="sm"
                  className="h-10"
                  style={{ backgroundColor: '#865014', color: 'white' }}
                  title="Open control panel"
                >
                  Open
                </Button>
              </div>
            </div>
          </div>

          {/* Display Link */}
          <div className="border rounded-lg p-3">
            <Label className="text-xs font-medium flex items-center gap-2 mb-2">
              <Monitor className="size-4" />
              Display Link (for church screen)
            </Label>
            <div className="flex gap-2">
              <Input
                value={displayUrl}
                readOnly
                className="text-sm font-mono flex-1"
              />
              <div className="flex gap-1">
                <Button
                  onClick={() => copyToClipboard(displayUrl, 'Display')}
                  size="sm"
                  variant="outline"
                  className="h-10"
                  title="Copy URL"
                >
                  {copied && copiedType === 'Display' ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
                <Button
                  onClick={openDisplayScreen}
                  size="sm"
                  className="h-10"
                  style={{ backgroundColor: '#865014', color: 'white' }}
                  title="Open display screen"
                >
                  Display
                </Button>
              </div>
            </div>
          </div>

          {/* Sync Section */}
          <div className="border rounded-lg p-3">
            <Label className="text-xs font-medium mb-3 block">
              Synchronize Devices
            </Label>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {currentSong ? (
                  <>
                    <p className="font-medium">Current Song:</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {currentSong.titleEnglish || 'Untitled'}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No song selected</p>
                )}
              </div>
              <Button
                onClick={handleSync}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!currentSong || !isConnected}
              >
                <RefreshCw className="size-4" />
                Sync
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Syncs the current song to all connected devices
            </p>
          </div>

          {/* Connection Help */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Connection Status: {isConnected ? '✅ Connected' : '⚠️ Disconnected'}
            </p>
            {!isConnected && (
              <p className="text-xs text-gray-600">
                WebSocket server not available. Sync features disabled.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
