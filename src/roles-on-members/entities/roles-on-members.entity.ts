import { RolesOnMembers } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RolesOnMembersEntity implements RolesOnMembers {
  @ApiProperty()
  memberId: number;

  @ApiProperty()
  roleId: number;

  @ApiProperty()
  assignedAt: Date;
}
