import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsGateway } from './groups.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupsController } from './groups.controller';
import { ChannelsModule } from '../channels/channels.module';
import { MembersModule } from '../members/members.module';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    PrismaModule,
    ChannelsModule,
    MembersModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsGateway, GroupsService],
})
export class GroupsModule {}
