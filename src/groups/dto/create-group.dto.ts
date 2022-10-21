import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  iconURL?: string;

  @ApiProperty()
  @IsOptional()
  memberOwnerId?: number;
}
