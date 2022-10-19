import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { ChannelsController } from './channel.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ChannelsController],
  providers: [ChannelsGateway, ChannelsService],
})
export class ChannelsModule {}
