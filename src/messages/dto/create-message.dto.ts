import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  channelId: number;

  @ApiProperty()
  @IsNotEmpty()
  memberId: number;
}
