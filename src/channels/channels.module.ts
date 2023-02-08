import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { ChannelsController } from './channels.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChannelsController],
  providers: [ChannelsGateway, ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
