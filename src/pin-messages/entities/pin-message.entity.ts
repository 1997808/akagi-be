import { PinMessage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PinMessageEntity implements PinMessage {
  @ApiProperty()
  id: number;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  messageId: number;

  @ApiProperty()
  createdAt: Date;
}
