import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateFriendDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  type: number;

  @ApiProperty()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsOptional()
  friendId?: number;
}
