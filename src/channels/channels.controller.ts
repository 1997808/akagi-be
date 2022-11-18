import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthUser } from '../users/user.decorator';
import { User } from '@prisma/client';
import { CreateChannelDto } from './dto/create-channel.dto';
import { AuthService } from '../auth/auth.service';

@Controller('channels')
@ApiBearerAuth('defaultToken')
@ApiTags('channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async findAllChannelByUser(@AuthUser() user: User) {
    return await this.channelsService.findAll();
  }

  @Get(':id')
  async findChannelById(@AuthUser() user: User, @Param('id') id: string) {
    return await this.channelsService.findOne(+id);
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return await this.channelsService.create(createChannelDto);
  }
}
