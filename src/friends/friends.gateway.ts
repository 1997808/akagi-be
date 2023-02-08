import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { AuthService } from '../auth/auth.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { Socket, Server } from 'socket.io';
import { wsError } from '../utils/exception';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class FriendsGateway {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() private server: Server;

  @SubscribeMessage('sendFriendRequest')
  async sendFriendRequest(
    @MessageBody() createFriendDto: CreateFriendDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const user = await this.authService.getUserFromToken(
        socket.handshake.auth.token,
      );
      const friendRequests = await this.friendsService.sendFriendRequest(
        user,
        createFriendDto,
      );
      this.server
        .to(`${friendRequests.userSendRequest.userId}`)
        .emit(`ADD_FRIEND`, friendRequests.userSendRequest);
      this.server
        .to(`${friendRequests.userGetRequest.userId}`)
        .emit(`ADD_FRIEND`, friendRequests.userGetRequest);
    } catch (err) {
      wsError(err.message);
    }
  }

  @SubscribeMessage('acceptFriendRequest')
  async acceptFriendRequest(
    @MessageBody() updateFriendDto: UpdateFriendDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const user = await this.authService.getUserFromToken(
        socket.handshake.auth.token,
      );
      const friendRequests = await this.friendsService.acceptFriendRequest(
        user,
        updateFriendDto,
      );
      this.server
        .to(`${friendRequests.userSendRequest.userId}`)
        .emit(`UPDATE_FRIEND`, friendRequests.userSendRequest);
      this.server
        .to(`${friendRequests.userGetRequest.userId}`)
        .emit(`UPDATE_FRIEND`, friendRequests.userGetRequest);
      this.server
        .to(`${friendRequests.userSendRequest.userId}`)
        .emit('GROUP_CREATED', friendRequests.group);
      this.server
        .to(`${friendRequests.userGetRequest.userId}`)
        .emit('GROUP_CREATED', friendRequests.group);
    } catch (err) {
      wsError(err.message);
    }
  }

  @SubscribeMessage('removeFriendRequest')
  async removeFriendRequest(
    @MessageBody() updateFriendDto: UpdateFriendDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const user = await this.authService.getUserFromToken(
        socket.handshake.auth.token,
      );
      const friendRequests = await this.friendsService.removeFriendRequest(
        user,
        updateFriendDto,
      );
      this.server
        .to(`${friendRequests.userSendRequest.userId}`)
        .emit(`REMOVE_FRIEND`, friendRequests.userSendRequest);
      this.server
        .to(`${friendRequests.userGetRequest.userId}`)
        .emit(`REMOVE_FRIEND`, friendRequests.userGetRequest);
    } catch (err) {
      wsError(err.message);
    }
  }

  @SubscribeMessage('findAllUserFriend')
  async findAllUserFriend(@ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    return this.friendsService.findAllUserFriend(user);
  }

  @SubscribeMessage('findOneFriend')
  findOne(@MessageBody() id: number) {
    return this.friendsService.findOne(id);
  }

  @SubscribeMessage('updateFriend')
  update(@MessageBody() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(updateFriendDto.id, updateFriendDto);
  }

  @SubscribeMessage('removeFriend')
  remove(@MessageBody() id: number) {
    return this.friendsService.remove(id);
  }
}
