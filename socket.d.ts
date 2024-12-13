import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    userId?: string; // or `number` depending on your `id` type
  }
}
