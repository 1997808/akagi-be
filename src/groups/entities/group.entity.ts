import { Group } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GroupEntity implements Group {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  iconURL: string;

  @ApiProperty()
  memberOwnerId: number;

  @ApiProperty()
  createdAt: Date;
}
