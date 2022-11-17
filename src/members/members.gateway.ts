import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberMessageDto } from './dto/update-member-message.dto';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class MembersGateway {
  constructor(
    private readonly membersService: MembersService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('createMember')
  create(@MessageBody() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @SubscribeMessage('findAllMembers')
  findAll() {
    return this.membersService.findAll();
  }

  @SubscribeMessage('findOneMember')
  findOne(@MessageBody() id: number) {
    return this.membersService.findOne(id);
  }

  @SubscribeMessage('updateMember')
  update(@MessageBody() updateMemberMessageDto: UpdateMemberMessageDto) {
    return this.membersService.update(
      updateMemberMessageDto.id,
      updateMemberMessageDto,
    );
  }

  @SubscribeMessage('removeMember')
  remove(@MessageBody() id: number) {
    return this.membersService.remove(id);
  }

  @SubscribeMessage('memberLeaveGroup')
  async memberLeaveGroup(
    @MessageBody() id: number,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromToken(
      socket.handshake.auth.token,
    );
    if (!user) {
      return;
    }
    if (!(await this.membersService.canUserKickMember(user, id))) {
      return;
    }
    const memberLeave = await this.membersService.memberLeaveGroup(id);
    console.log(memberLeave);
    const group = await this.membersService.findGroupByMemberId(memberLeave.id);
    console.log(group);

    this.server
      .to(`GROUP_ACTIVE_${memberLeave.groupId}`)
      .emit('MEMBER_LEAVE', memberLeave);
    this.server.to(`${memberLeave.userId}`).emit('GROUP_DELETED', group);
  }
}
