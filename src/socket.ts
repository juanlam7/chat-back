import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const CORS_ORIGIN = process.env.CORS_ORIGIN!;

interface UserSocketMap {
  [userId: string]: string;
}

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [CORS_ORIGIN],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};

const userSocketMap: UserSocketMap = {};

io.on('connection', (socket: Socket) => {
  console.log('a user connected', socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId !== 'undefined') userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, io, server };
