import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  type: ChannelType;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
