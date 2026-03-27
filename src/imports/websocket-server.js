import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { parse } from "node:url";

const server = createServer();
const wss = new WebSocketServer({ server });

// Store rooms and connections
const rooms = new Map();

// Store active song per room
const activeSongs = new Map();

wss.on("connection", (ws, req) => {
  const parsedUrl = parse(req.url, true);
  const pathParts = parsedUrl.pathname.split("/");
  const roomId = pathParts[2] || "default";
  const deviceType = pathParts[1] || "unknown"; // control, display, or unknown

  console.log(`📱 New ${deviceType} connection to room: ${roomId}`);

  // Initialize room if not exists
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map()); // Use Map for device type grouping
    console.log(`🏠 Created new room: ${roomId}`);
  }

  const room = rooms.get(roomId);

  // Store WebSocket with device type
  ws.deviceType = deviceType;
  ws.roomId = roomId;

  if (!room.has(deviceType)) {
    room.set(deviceType, new Set());
  }

  const deviceSet = room.get(deviceType);

  // Keep exactly one active display per room while allowing multiple controls.
  if (deviceType === "display" && deviceSet.size > 0) {
    deviceSet.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(4000, "Display replaced by a new display client");
      }
    });
    deviceSet.clear();
  }

  deviceSet.add(ws);

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "welcome",
      data: {
        roomId,
        deviceType,
        connectedDevices: Array.from(room.entries()).reduce(
          (acc, [type, devices]) => {
            acc[type] = devices.size;
            return acc;
          },
          {},
        ),
      },
    }),
  );

  // Send current song if exists
  if (activeSongs.has(roomId)) {
    ws.send(
      JSON.stringify({
        type: "current_song",
        data: activeSongs.get(roomId),
      }),
    );
  }

  // Notify other devices of new connection
  broadcastToRoom(roomId, ws, {
    type: "device_connected",
    data: {
      deviceType,
      roomId,
      connectedDevices: Array.from(room.entries()).reduce(
        (acc, [type, devices]) => {
          acc[type] = devices.size;
          return acc;
        },
        {},
      ),
    },
  });

  // Handle messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 [${roomId}] ${deviceType}: ${data.type}`);

      // Handle song selection
      if (data.type === "select_song") {
        activeSongs.set(roomId, {
          song: data.data.song,
          currentSlide: 0,
          totalSlides: data.data.song.lyrics.length,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle slide changes
      if (data.type === "change_slide" && activeSongs.has(roomId)) {
        const current = activeSongs.get(roomId);
        activeSongs.set(roomId, {
          ...current,
          currentSlide: data.data.slideIndex,
        });
      }

      // Handle song clear
      if (data.type === "clear_song") {
        activeSongs.delete(roomId);
      }

      // Broadcast to all other devices in the room
      broadcastToRoom(roomId, ws, data);
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    const room = rooms.get(roomId);
    const deviceSet = room?.get(deviceType);
    if (deviceSet) {
      deviceSet.delete(ws);

      // Remove empty device sets
      if (deviceSet.size === 0) {
        room.delete(deviceType);
      }

      // Remove empty rooms
      if (room.size === 0) {
        rooms.delete(roomId);
        activeSongs.delete(roomId);
        console.log(`🗑️ Removed empty room: ${roomId}`);
      } else {
        // Notify remaining devices
        broadcastToRoom(roomId, ws, {
          type: "device_disconnected",
          data: {
            deviceType,
            roomId,
            connectedDevices: Array.from(room.entries()).reduce(
              (acc, [type, devices]) => {
                acc[type] = devices.size;
                return acc;
              },
              {},
            ),
          },
        });
      }
    }

    console.log(`📴 ${deviceType} disconnected from room ${roomId}`);
  });

  ws.on("error", (error) => {
    console.error(`❌ WebSocket error in room ${roomId}:`, error);
  });
});

// Helper function to broadcast to all devices in a room except sender
function broadcastToRoom(roomId, senderSocket, message) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach((devices, deviceType) => {
    devices.forEach((client) => {
      if (client !== senderSocket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
}

// WebSocket heartbeat
setInterval(() => {
  rooms.forEach((room, roomId) => {
    room.forEach((devices, deviceType) => {
      devices.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "heartbeat",
              data: {
                timestamp: new Date().toISOString(),
                roomId,
                deviceType,
              },
            }),
          );
        }
      });
    });
  });
}, 30000);

server.listen(8080, () => {
  console.log("=======================================");
  console.log("📡 WebSocket Server Running on port 8080");
  console.log("=======================================");
  console.log("URL Structure:");
  console.log("- Control: ws://localhost:8080/control/{roomId}");
  console.log("- Display: ws://localhost:8080/display/{roomId}");
  console.log("=======================================");
});

// Handle server shutdown
process.on("SIGINT", () => {
  console.log("\n📴 Shutting down WebSocket server...");
  wss.close(() => {
    console.log("✅ WebSocket server closed");
    process.exit(0);
  });
});
