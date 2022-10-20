import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

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
