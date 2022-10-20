import { Message } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MessageEntity implements Message {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  memberId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
