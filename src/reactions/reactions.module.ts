import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsGateway } from './reactions.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ReactionsController } from './reactions.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReactionsController],
  providers: [ReactionsGateway, ReactionsService],
})
export class ReactionsModule {}
