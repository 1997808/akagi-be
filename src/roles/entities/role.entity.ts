import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RoleEntity implements Role {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  permissions: number[];

  @ApiProperty()
  createdAt: Date;
}
