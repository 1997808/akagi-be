import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@ApiBearerAuth('defaultToken')
@ApiTags('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAllMessage(@AuthUser() user: User) {
    return await this.messagesService.findAll();
  }

  @Get(':channelId/:id')
  async findByChannelFromLastMessageId(
    @AuthUser() user: User,
    @Param('channelId') channelId: string,
    @Param('id') id: string,
  ) {
    return await this.messagesService.findByChannelFromLastMessageId(
      +channelId,
      +id,
    );
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.messagesService.create(user, createMessageDto);
  }
}
