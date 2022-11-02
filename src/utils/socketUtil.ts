import { Socket } from 'socket.io';

export function deleteSocketRooms(socket: Socket, text: string) {
  socket.rooms.forEach((item) => {
    if (item.includes(text)) {
      socket.rooms.delete(item);
    }
  });
}

export function checkHasSocketRoom(socket: Socket, text: string) {
  return socket.rooms.has(text);
}

export function deleteExactSocketRoom(socket: Socket, text: string) {
  socket.rooms.delete(text);
}
