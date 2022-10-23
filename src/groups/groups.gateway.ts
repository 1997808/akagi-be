import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

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

  @SubscribeMessage('createGroup')
  async create(
    @MessageBody() createGroupDto: CreateGroupDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    return this.groupsService.create(user, createGroupDto);
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
