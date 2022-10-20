import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { ChannelsController } from './channels.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ChannelsController],
  providers: [ChannelsGateway, ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
