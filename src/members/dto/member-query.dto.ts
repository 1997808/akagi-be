import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MemberQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  take: number;

  @ApiProperty()
  @IsNotEmpty()
  groupId: number;
}
