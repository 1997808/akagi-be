import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateChannelDto {
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  // type: ChannelType;

  @ApiProperty()
  @IsOptional()
  firstMessageId: number;

  @ApiProperty()
  @IsOptional()
  lastMessageId: number;

  @ApiProperty()
  @IsOptional()
  description: string;

  // groupId: number;
}
