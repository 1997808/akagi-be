import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMemberMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsOptional()
  status: MemberStatus;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
