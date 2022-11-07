import { ApiProperty } from '@nestjs/swagger';
import { GroupType } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  iconURL?: string;

  @ApiProperty()
  @IsNotEmpty()
  type: GroupType;

  @ApiProperty()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty()
  @IsOptional()
  memberOwnerId?: number;
}

export class CreateDirectGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  type!: GroupType;
}

export class JoinGroupByinviteTokenProps {
  @ApiProperty()
  @IsNotEmpty()
  token!: string;
}
