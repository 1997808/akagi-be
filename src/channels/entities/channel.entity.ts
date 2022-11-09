import { Channel, ChannelType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import Peer from 'simple-peer';

export class ChannelEntity implements Channel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  firstMessageId: number;

  @ApiProperty()
  lastMessageId: number;

  @ApiProperty()
  type: ChannelType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  createdAt: Date;
}

export class JoinActiveChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}

export class JoinVoiceChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  pid: string;
}

export class DisplayMediaDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  pid: string;

  @ApiProperty()
  @IsNotEmpty()
  value: boolean;
}

export class SendingSignalDto {
  @ApiProperty()
  @IsNotEmpty()
  userToSignal: string;

  @ApiProperty()
  @IsNotEmpty()
  signal: string | Peer.SignalData;

  @ApiProperty()
  @IsNotEmpty()
  callerID: string;
}
