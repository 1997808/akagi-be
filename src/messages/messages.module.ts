import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { MessagesController } from './messages.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
