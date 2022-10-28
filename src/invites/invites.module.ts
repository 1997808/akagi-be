import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesGateway } from './invites.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InvitesGateway, InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
