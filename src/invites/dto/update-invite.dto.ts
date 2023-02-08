import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateInviteControllerDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  uses: number;
}

export class UpdateInviteDto {
  @ApiProperty()
  @IsNotEmpty()
  uses: number;
}
