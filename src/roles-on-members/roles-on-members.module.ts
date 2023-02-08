import { Module } from '@nestjs/common';
import { RolesOnMembersService } from './roles-on-members.service';
import { RolesOnMembersGateway } from './roles-on-members.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RolesOnMembersGateway, RolesOnMembersService],
  exports: [RolesOnMembersService],
})
export class RolesOnMembersModule {}
