import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { GroupsService } from './groups.service';
import {
  CreateGroupDto,
  JoinGroupByinviteTokenProps,
  UserTypingProps,
} from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { serverError } from '../utils/exception';
import { User } from '@prisma/client';

export interface UserTyping {
  user: User;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class GroupsGateway {
  userTyping: Record<number, UserTyping[]> = {};

  constructor(
    private readonly groupsService: GroupsService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('listenGroup')
  async listenGroup(
    @MessageBody() id: number,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const group = await this.groupsService.findOne(id);
    if (!group) {
      serverError(`Can not find group`);
    }
    await socket.join(`GROUP-${group.id}`);
    return this.server.to(`${user.id}`).emit('JOIN_GROUP_READY');
  }

  @SubscribeMessage('createGroup')
  async create(
    @MessageBody() createGroupDto: CreateGroupDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const group = await this.groupsService.create(user, createGroupDto);
    return this.server.to(`${user.id}`).emit('GROUP_CREATED', group);
  }

  @SubscribeMessage('findAllGroups')
  async findAll(@ConnectedSocket() socket: Socket) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    return this.groupsService.findAll(user.id);
  }

  @SubscribeMessage('findOneGroup')
  findOne(@MessageBody() id: number) {
    return this.groupsService.findOne(id);
  }

  @SubscribeMessage('updateGroup')
  update(@MessageBody() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(updateGroupDto.id, updateGroupDto);
  }

  @SubscribeMessage('removeGroup')
  async remove(@MessageBody() id: number) {
    await this.groupsService.remove(id);
    return this.server.to(`GROUP-${id}`).emit('GROUP_DELETED', id);
  }

  @SubscribeMessage('joinGroupByInviteToken')
  async joinGroupByInviteToken(
    @MessageBody() data: JoinGroupByinviteTokenProps,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    const group = await this.groupsService.joinGroupByInviteToken(
      user,
      data.token,
    );
    // todo add event member add
    // this.server.to(`${group.id}`).emit('MEMBER_ADD', group);
    return this.server.to(`${user.id}`).emit('GROUP_CREATED', group);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() data: UserTypingProps,
    @ConnectedSocket() socket: Socket,
  ) {
    const { channelId } = data;
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    // todo check really existed
    if (!channelId) {
      return;
    }
    const userTypingInChannel = await this.groupsService.handleUserTyping(
      user,
      data,
      this.userTyping[channelId],
    );

    const message = await this.groupsService.getMessageUserTyping(
      userTypingInChannel,
    );
    this.userTyping[channelId] = userTypingInChannel;
    return this.server
      .to(`CHANNEL_ACTIVE_${channelId}`)
      .emit('USER_TYPING', message);
  }
}
