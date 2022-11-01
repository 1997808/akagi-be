import { Socket } from 'socket.io';

export function deleteSocketRooms(socket: Socket, text: string) {
  socket.rooms.forEach((item) => {
    if (item.includes(text)) {
      socket.rooms.delete(item);
    }
  });
}

export function deleteExactSocketRoom(socket: Socket, text: string) {
  socket.rooms.delete(text);
}
