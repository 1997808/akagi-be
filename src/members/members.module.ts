import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersGateway } from './members.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { MembersController } from './members.controller';
import { RolesModule } from '../roles/roles.module';
import { RolesOnMembersModule } from '../roles-on-members/roles-on-members.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RolesModule, RolesOnMembersModule, AuthModule],
  controllers: [MembersController],
  providers: [MembersGateway, MembersService],
  exports: [MembersService],
})
export class MembersModule {}
