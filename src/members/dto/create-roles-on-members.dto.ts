import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRolesOnMembersDto {
  @ApiProperty()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty()
  @IsNotEmpty()
  roleId: number;
}
