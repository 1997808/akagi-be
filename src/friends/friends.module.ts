import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { FriendsController } from './friends.controller';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, GroupsModule],
  controllers: [FriendsController],
  providers: [FriendsGateway, FriendsService],
})
export class FriendsModule {}
