import { Group, GroupType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GroupEntity implements Group {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  iconURL: string;

  @ApiProperty()
  type: GroupType;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  memberOwnerId: number;

  @ApiProperty()
  createdAt: Date;
}
