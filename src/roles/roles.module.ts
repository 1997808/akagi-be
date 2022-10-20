import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGateway } from './roles.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RolesGateway, RolesService],
})
export class RolesModule {}
