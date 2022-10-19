import { Member } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MemberEntity implements Member {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  createdAt: Date;
}
