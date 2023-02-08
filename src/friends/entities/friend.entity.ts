import { Friendship } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FriendshipEntity implements Friendship {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  friendId: number;

  @ApiProperty()
  createdAt: Date;
}
