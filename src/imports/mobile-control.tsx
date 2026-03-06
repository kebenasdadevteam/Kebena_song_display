import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Smartphone,
  Monitor,
  Copy,
  Check,
  Wifi,
  MessageSquare,
  RefreshCw,
  X,
  Bell,
  BellOff,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useWebSocket } from "../hooks/useWebSocket";
import { QRCodeCanvas } from "qrcode.react";

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
  roomId: string;
}

interface MobileControlProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong?: any;
  roomId: string | null;
  extendedBackground?: string;
  userName?: string;
}

export function MobileControl({
  isOpen,
  onClose,
  currentSong,
  roomId,
  extendedBackground = "",
  userName = "User",
}: Readonly<MobileControlProps>) {
  const [connectedDevices, setConnectedDevices] = useState({
    control: 0,
    display: 0,
  });
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatChannelRef = useRef<BroadcastChannel | null>(null);
  const clientIdRef = useRef(
    `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  );

  const effectiveRoomId = roomId || "default";
  const showChatRef = useRef(showChat);
  const showNotificationsRef = useRef(showNotifications);

  useEffect(() => {
    showChatRef.current = showChat;
  }, [showChat]);

  useEffect(() => {
    showNotificationsRef.current = showNotifications;
  }, [showNotifications]);

  const { sendMessage, isConnected } = useWebSocket(
    "control",
    effectiveRoomId,
    (message) => {
      if (!message) return;

      if (message.type === "chat_message" && message.data?.roomId) {
        if (message.data.roomId !== effectiveRoomId) return;
        if (message.data.senderId === clientIdRef.current) return;

        const newMessage: ChatMessage = {
          id: message.data.id || `${Date.now()}_${Math.random()}`,
          text: message.data.text,
          timestamp: new Date(message.data.timestamp || Date.now()),
          sender: message.data.sender || "Unknown",
          roomId: message.data.roomId,
        };

        setChatMessages((prev) => [...prev, newMessage]);

        if (!showChatRef.current && showNotificationsRef.current) {
          setHasUnreadMessages(true);
          toast.info(`New message from ${message.data.sender || "User"}`, {
            action: {
              label: "View",
              onClick: () => setShowChat(true),
            },
          });
        }
      }

      if (
        message.type === "welcome" ||
        message.type === "device_connected" ||
        message.type === "device_disconnected"
      ) {
        const devices = message.data?.connectedDevices;
        if (devices) {
          setConnectedDevices({
            control: devices.control ?? 0,
            display: devices.display ?? 0,
          });
        }
      }
    },
  );

  const baseUrl = globalThis.location.origin;
  const controlUrl = `${baseUrl}/control/${effectiveRoomId}`;
  const displayUrl = `${baseUrl}/display/${effectiveRoomId}`;

  // Local chat channel (works without server)
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    chatChannelRef.current?.close();
    chatChannelRef.current = new BroadcastChannel(
      `kebena-chat-${effectiveRoomId}`,
    );

    const handleChannelMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== "chat_message") return;
      if (data.roomId !== effectiveRoomId) return;
      if (data.senderId === clientIdRef.current) return;

      const newMessage: ChatMessage = {
        id: data.id || `${Date.now()}_${Math.random()}`,
        text: data.text,
        timestamp: new Date(data.timestamp || Date.now()),
        sender: data.sender || "Unknown",
        roomId: data.roomId,
      };

      setChatMessages((prev) => [...prev, newMessage]);

      if (!showChatRef.current && showNotificationsRef.current) {
        setHasUnreadMessages(true);
        toast.info(`New message from ${data.sender || "User"}`, {
          action: {
            label: "View",
            onClick: () => setShowChat(true),
          },
        });
      }
    };

    chatChannelRef.current.addEventListener("message", handleChannelMessage);

    return () => {
      chatChannelRef.current?.removeEventListener(
        "message",
        handleChannelMessage,
      );
      chatChannelRef.current?.close();
      chatChannelRef.current = null;
    };
  }, [effectiveRoomId]);

  // Fallback sync between tabs when BroadcastChannel is unavailable
  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") return undefined;

    const storageKey = `chat_event_${effectiveRoomId}`;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || !event.newValue) return;
      try {
        const data = JSON.parse(event.newValue);
        if (data.senderId === clientIdRef.current) return;
        if (data.roomId !== effectiveRoomId) return;

        const newMessage: ChatMessage = {
          id: data.id || `${Date.now()}_${Math.random()}`,
          text: data.text,
          timestamp: new Date(data.timestamp || Date.now()),
          sender: data.sender || "Unknown",
          roomId: data.roomId,
        };

        setChatMessages((prev) => [...prev, newMessage]);

        if (!showChatRef.current && showNotificationsRef.current) {
          setHasUnreadMessages(true);
          toast.info(`New message from ${data.sender || "User"}`, {
            action: {
              label: "View",
              onClick: () => setShowChat(true),
            },
          });
        }
      } catch {
        // ignore
      }
    };

    globalThis.addEventListener("storage", handleStorage);
    return () => globalThis.removeEventListener("storage", handleStorage);
  }, [effectiveRoomId]);

  // Load today's messages from localStorage
  useEffect(() => {
    if (!isOpen) return;

    const today = new Date().toDateString();
    const savedMessages = localStorage.getItem(
      `chat_${effectiveRoomId}_${today}`,
    );

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setChatMessages(messagesWithDates);
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    }

    return undefined;
  }, [isOpen, effectiveRoomId]);

  // Save messages to localStorage daily
  useEffect(() => {
    if (chatMessages.length === 0) return;

    const today = new Date().toDateString();
    const messagesToSave = chatMessages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    }));

    localStorage.setItem(
      `chat_${effectiveRoomId}_${today}`,
      JSON.stringify(messagesToSave),
    );
  }, [chatMessages, effectiveRoomId]);

  // Clear old messages (older than today)
  useEffect(() => {
    const today = new Date().toDateString();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`chat_${effectiveRoomId}_`) && !key.endsWith(today)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }, [effectiveRoomId]);

  // Handle incoming WebSocket messages in hook callback

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
    globalThis.open(url, "_blank", "noopener,noreferrer");
    toast.success(`Opening ${type} in new tab`);
  };

  const openDisplayScreen = () => {
    const win = globalThis.open(
      displayUrl,
      "ChurchDisplay",
      "width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no",
    );

    if (win) {
      setTimeout(() => {
        win.postMessage(
          {
            type: "SET_BACKGROUND",
            background: extendedBackground || "#000000",
          },
          globalThis.location.origin,
        );
      }, 1000);

      toast.success("Display screen opened in new window");
    } else {
      toast.error("Please allow popups to open display screen");
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const messageData = {
        type: "chat_message",
        text: messageText.trim(),
        timestamp: new Date().toISOString(),
        sender: userName,
        roomId: effectiveRoomId,
        senderId: clientIdRef.current,
      };

      // Add message locally immediately
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: messageText.trim(),
        timestamp: new Date(),
        sender: userName,
        roomId: effectiveRoomId,
      };

      setChatMessages((prev) => [...prev, newMessage]);

      // Send locally first (works without server)
      chatChannelRef.current?.postMessage(messageData);
      if (typeof BroadcastChannel === "undefined") {
        const storageKey = `chat_event_${effectiveRoomId}`;
        localStorage.setItem(storageKey, JSON.stringify(messageData));
      }

      // Send via WebSocket if connected
      if (isConnected) {
        sendMessage("chat_message", messageData);
      }

      setMessageText("");
      setHasUnreadMessages(false); // User is viewing chat if they're sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleSync = () => {
    if (!currentSong) {
      toast.error("No song selected to sync");
      return;
    }

    if (!isConnected) {
      toast.error("Not connected to server. Sync requires server connection.");
      return;
    }

    try {
      const syncData = {
        type: "sync_state",
        song: currentSong,
        timestamp: new Date().toISOString(),
        roomId: effectiveRoomId,
      };

      const sent = sendMessage("sync_state", syncData);
      if (sent) {
        toast.success("Sync sent to all devices");
      } else {
        toast.error("Sync failed to send");
      }
    } catch (error) {
      console.error("Error syncing:", error);
      toast.error("Sync failed");
    }
  };

  // Handle Enter key for message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) {
      setHasUnreadMessages(false); // Mark as read when opening
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearChat = () => {
    const today = new Date().toDateString();
    localStorage.removeItem(`chat_${effectiveRoomId}_${today}`);
    setChatMessages([]);
    toast.info("Today's chat cleared");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="sticky top-0 bg-background z-20 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="size-5 text-[#865014]" />
                Mobile Control
              </DialogTitle>
              <DialogDescription>
                Links, messaging, and sync for multiple users.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2"
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Connection Status */}
          <div className="bg-gradient-to-r from-[#865014] to-[#E0AE3F] text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="size-5" />
                <div>
                  <p className="font-medium">Room: {roomId}</p>
                  <p className="text-xs opacity-90">
                    {connectedDevices.control} control •{" "}
                    {connectedDevices.display} display
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                ></div>
                <span className="text-xs font-medium">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Control & Display Links */}
          <div className="grid grid-cols-1 gap-3">
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
                    onClick={() => copyToClipboard(controlUrl, "Control")}
                    size="sm"
                    variant="outline"
                    className="h-10"
                    title="Copy URL"
                  >
                    {copied && copiedType === "Control" ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => openInNewTab(controlUrl, "Control")}
                    size="sm"
                    style={{ backgroundColor: "#865014", color: "white" }}
                    className="h-10"
                    title="Open control panel"
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>

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
                    onClick={() => copyToClipboard(displayUrl, "Display")}
                    size="sm"
                    variant="outline"
                    className="h-10"
                    title="Copy URL"
                  >
                    {copied && copiedType === "Display" ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                  <Button
                    onClick={openDisplayScreen}
                    size="sm"
                    style={{ backgroundColor: "#865014", color: "white" }}
                    className="h-10"
                    title="Open display screen"
                  >
                    Display
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="border rounded-lg p-4 text-center">
            <Label className="text-xs font-medium mb-3 block">
              Quick Access QR Code
            </Label>
            <div className="bg-white p-3 rounded inline-block">
              <QRCodeCanvas
                value={controlUrl}
                size={180}
                level="H"
                fgColor="#865014"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Scan with phone camera to open control panel
            </p>
          </div>

          {/* Chat Room Toggle */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                <Label className="text-xs font-medium">
                  Chat Room ({chatMessages.length} messages)
                </Label>
                {hasUnreadMessages && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    New!
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title={
                    showNotifications
                      ? "Mute notifications"
                      : "Enable notifications"
                  }
                >
                  {showNotifications ? (
                    <Bell className="size-4" />
                  ) : (
                    <BellOff className="size-4" />
                  )}
                </Button>
                <Button
                  onClick={toggleChat}
                  variant={showChat ? "outline" : "default"}
                  size="sm"
                  style={
                    showChat
                      ? undefined
                      : { backgroundColor: "#865014", color: "white" }
                  }
                >
                  {showChat ? "Hide Chat" : "Show Chat"}
                </Button>
              </div>
            </div>

            {showChat && (
              <div className="space-y-3">
                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="border rounded-lg h-64 overflow-y-auto p-3 bg-gray-50"
                >
                  {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-2 rounded-lg max-w-[80%] ${
                            message.sender === userName
                              ? "bg-[#865014] text-white ml-auto"
                              : "bg-white border"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-medium">
                              {message.sender}
                            </span>
                            <span className="text-xs opacity-75">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    style={{ backgroundColor: "#865014", color: "white" }}
                    className="px-4"
                    disabled={!messageText.trim()}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>

                {/* Chat Actions */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    {chatMessages.length} messages today
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={clearChat}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500"
                    >
                      Clear Chat
                    </Button>
                    <Button
                      onClick={toggleChat}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <X className="size-3 mr-1" />
                      Close Chat
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
                      {currentSong.titleEnglish || "Untitled"}
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
                Sync to All Devices
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Syncs the current song and slide position to all connected devices
            </p>
          </div>

          {/* Connection Help */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Connection Status:{" "}
              {isConnected ? "✅ Connected" : "⚠️ Disconnected"}
            </p>
            {!isConnected && (
              <p className="text-xs text-gray-600">
                Chat works offline. Sync requires the server.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
