import { Invite } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// todo create token random unique for group
export class InviteEntity implements Invite {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uses: number;

  @ApiProperty()
  maxUses: number;

  @ApiProperty()
  token: string;

  @ApiProperty()
  createdByMemberId: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  createdAt: Date;
}
