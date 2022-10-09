import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFriendDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
