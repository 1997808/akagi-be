import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePinMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  channelId: number;

  @ApiProperty()
  @IsNotEmpty()
  messageId: number;
}
