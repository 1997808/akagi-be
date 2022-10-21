import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty()
  @IsNotEmpty()
  maxUses: number;

  @ApiProperty()
  @IsNotEmpty()
  createdByMemberId: number;

  @ApiProperty()
  @IsOptional()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
