import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty()
  @IsNotEmpty()
  unified: string;

  @ApiProperty()
  @IsNotEmpty()
  emoji: string;

  @ApiProperty()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty()
  @IsNotEmpty()
  messageId: number;
}
