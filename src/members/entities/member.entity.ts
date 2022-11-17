import { Member, MemberStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MemberEntity implements Member {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: MemberStatus;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  createdAt: Date;
}
