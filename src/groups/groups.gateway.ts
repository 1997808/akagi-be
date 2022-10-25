import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { serverError } from '../utils/exception';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class GroupsGateway {
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
  remove(@MessageBody() id: number) {
    return this.groupsService.remove(id);
  }
}
