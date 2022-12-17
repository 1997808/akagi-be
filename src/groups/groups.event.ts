import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupsService } from './groups.service';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsListener {
  constructor(private readonly groupsService: GroupsService) {}

  @OnEvent('member.join')
  async handleMemberJoin(event: UpdateGroupDto) {
    return await this.groupsService.updateGroupMemberCount(
      event.id,
      event.memberCount,
    );
  }
}
