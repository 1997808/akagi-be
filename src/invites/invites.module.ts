import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesGateway } from './invites.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { InvitesController } from './invites.controller';

@Module({
  imports: [PrismaModule],
  controllers: [InvitesController],
  providers: [InvitesGateway, InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
