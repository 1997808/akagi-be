import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  iconURL: string;

  @ApiProperty()
  @IsOptional()
  isPublic: boolean; //cant change if type DIRECT

  @ApiProperty()
  @IsOptional()
  memberOwnerId?: number;
}
