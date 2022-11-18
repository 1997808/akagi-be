import { Module } from '@nestjs/common';
import { PinMessagesService } from './pin-messages.service';
import { PinMessagesGateway } from './pin-messages.gateway';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PinMessagesController } from './pin-messages.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PinMessagesController],
  providers: [PinMessagesGateway, PinMessagesService],
})
export class PinMessagesModule {}
