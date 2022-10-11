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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
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
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const friendRequests = await this.friendsService.sendFriendRequest(
      user,
      createFriendDto,
    );
    this.server.emit(`ADD_FRIEND`, friendRequests.userSendRequest);
    this.server.emit(`ADD_FRIEND`, friendRequests.userGetRequest);
  }

  @SubscribeMessage('acceptFriendRequest')
  async acceptFriendRequest(
    @MessageBody() updateFriendDto: UpdateFriendDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const friendRequests = await this.friendsService.acceptFriendRequest(
      user,
      updateFriendDto,
    );
    this.server.emit(`UPDATE_FRIEND`, friendRequests.userSendRequest);
    this.server.emit(`UPDATE_FRIEND`, friendRequests.userGetRequest);
  }

  @SubscribeMessage('removeFriendRequest')
  async removeFriendRequest(
    @MessageBody() updateFriendDto: UpdateFriendDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const friendRequests = await this.friendsService.removeFriendRequest(
      user,
      updateFriendDto,
    );
    this.server.emit(`REMOVE_FRIEND`, friendRequests.userSendRequest);
    this.server.emit(`REMOVE_FRIEND`, friendRequests.userGetRequest);
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
