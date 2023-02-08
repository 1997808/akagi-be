import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
