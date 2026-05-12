import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Initially empty, the first client to connect will populate it if they have mock data
let appState = null; 

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  if (appState) {
    socket.emit('state_sync', appState);
  }

  socket.on('update_state', (newState) => {
    appState = newState;
    socket.broadcast.emit('state_sync', appState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mock Sync Server running on port ${PORT}`);
});
