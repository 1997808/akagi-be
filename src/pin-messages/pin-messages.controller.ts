import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PinMessagesService } from './pin-messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';

@Controller('pin-messages')
@ApiBearerAuth('defaultToken')
@ApiTags('pinMessages')
@UseGuards(JwtAuthGuard)
export class PinMessagesController {
  constructor(private readonly pinMessagesService: PinMessagesService) {}

  @Get(':channelId')
  async findAllPinMessageInChannel(
    @AuthUser() user: User,
    @Param('channelId') channelId: string,
  ) {
    return await this.pinMessagesService.findChannelPinMessage(+channelId);
  }
}
