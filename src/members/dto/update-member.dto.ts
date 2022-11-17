import { ApiProperty } from '@nestjs/swagger';
import { MemberStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty()
  @IsOptional()
  status: MemberStatus;
}
