import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@WebSocketGateway()
export class MembersGateway {
  constructor(private readonly membersService: MembersService) {}

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
  update(@MessageBody() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(updateMemberDto.id, updateMemberDto);
  }

  @SubscribeMessage('removeMember')
  remove(@MessageBody() id: number) {
    return this.membersService.remove(id);
  }
}
