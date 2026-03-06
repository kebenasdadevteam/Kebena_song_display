import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  sender?: string;
  timestamp?: string;
}

export function useWebSocket(
  deviceType: 'control' | 'display',
  roomId: string,
  onMessage?: (message: WebSocketMessage) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const urlIndexRef = useRef(0);

  const buildWebSocketUrl = useCallback(() => {
    const envUrl = import.meta.env.VITE_WS_URL as string | undefined;
    if (envUrl && envUrl.trim().length > 0) {
      return `${envUrl.replace(/\/$/, '')}/${deviceType}/${roomId}`;
    }

    const host = window.location.hostname;
    const port = (import.meta.env.VITE_WS_PORT as string | undefined) || '8080';
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${host}:${port}/${deviceType}/${roomId}`;
  }, [deviceType, roomId]);

  const getWebSocketUrlCandidates = useCallback(() => {
    const envUrl = import.meta.env.VITE_WS_URL as string | undefined;
    const port = (import.meta.env.VITE_WS_PORT as string | undefined) || '8080';
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;

    const baseUrls = (envUrl && envUrl.trim().length > 0
      ? [envUrl.replace(/\/$/, '')]
      : []
    ).concat([
      `${protocol}://${host}:${port}`,
      `ws://localhost:${port}`,
      `ws://127.0.0.1:${port}`,
    ]);

    return baseUrls.map(
      (base) => `${base.replace(/\/$/, '')}/${deviceType}/${roomId}`
    );
  }, [deviceType, roomId]);

  const connect = useCallback(() => {
    if (!roomId || !deviceType) return;

    try {
      const urlCandidates = getWebSocketUrlCandidates();
      const currentUrl =
        urlCandidates[urlIndexRef.current] || buildWebSocketUrl();
      const ws = new WebSocket(currentUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(
          `✅ WebSocket connected as ${deviceType} to room: ${roomId}`
        );
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (onMessage) {
            onMessage(message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      const reconnectWithDelay = () => {
        setReconnectAttempts((prev) => prev + 1);
        const urlCandidates = getWebSocketUrlCandidates();
        if (urlIndexRef.current < urlCandidates.length - 1) {
          urlIndexRef.current += 1;
        }
        connect();
      };

      ws.onclose = (event) => {
        console.log(`📴 WebSocket disconnected: ${event.code} ${event.reason}`);
        setIsConnected(false);

        // Auto-reconnect after 3 seconds
        if (reconnectAttempts < 5) {
          console.log(
            `🔄 Attempting to reconnect (${reconnectAttempts + 1}/5)...`
          );
          setTimeout(reconnectWithDelay, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionError('Failed to connect');
    }
  }, [
    roomId,
    deviceType,
    onMessage,
    reconnectAttempts,
    buildWebSocketUrl,
    getWebSocketUrlCandidates,
  ]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [connect]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
      return true;
    } else {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }
  }, []);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setReconnectAttempts(0);
    urlIndexRef.current = 0;
    connect();
  }, [connect]);

  return {
    sendMessage,
    isConnected,
    connectionError,
    reconnect,
    reconnectAttempts,
  };
}
