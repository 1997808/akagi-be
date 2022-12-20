import { ApiProperty } from '@nestjs/swagger';
import { Reaction } from '@prisma/client';

export class ReactionEntity implements Reaction {
  @ApiProperty()
  id: number;

  @ApiProperty()
  unified: string;

  @ApiProperty()
  emoji: string;

  @ApiProperty()
  memberId: number;

  @ApiProperty()
  messageId: number;

  @ApiProperty()
  createdAt: Date;
}
