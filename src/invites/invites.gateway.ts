import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';

@WebSocketGateway()
export class InvitesGateway {
  constructor(private readonly invitesService: InvitesService) {}

  @SubscribeMessage('createInvite')
  create(@MessageBody() createInviteDto: CreateInviteDto) {
    return this.invitesService.create(createInviteDto);
  }

  @SubscribeMessage('findAllInvites')
  findAll() {
    return this.invitesService.findAll();
  }

  @SubscribeMessage('findOneInvite')
  findOne(@MessageBody() id: number) {
    return this.invitesService.findOne(id);
  }

  @SubscribeMessage('updateInvite')
  update(@MessageBody() updateInviteDto: UpdateInviteDto) {
    return this.invitesService.update(updateInviteDto.id, updateInviteDto);
  }

  @SubscribeMessage('removeInvite')
  remove(@MessageBody() id: number) {
    return this.invitesService.remove(id);
  }
}
