import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Mock Sync State
let appState = null; 

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  if (appState) {
    console.log('Sending current state to new client');
    socket.emit('state_sync', appState);
  }

  socket.on('update_state', (newState) => {
    console.log('Received state update from client');
    appState = newState;
    // Broadcast to EVERYONE including the sender to ensure sync
    io.emit('state_sync', appState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// For all other routes, serve index.html (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on port ${PORT}`);
});
