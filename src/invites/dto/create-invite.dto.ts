import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty()
  @IsNotEmpty()
  maxUses: number;

  @ApiProperty()
  @IsNotEmpty()
  createdByMemberId: number;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
