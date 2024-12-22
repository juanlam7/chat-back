import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';

import cors from 'cors';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';

import './db';

import { app, server } from './socket';

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({ origin: CORS_ORIGIN, methods: ['GET', 'POST'], credentials: true }),
);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
