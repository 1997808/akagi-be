import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { GroupsModule } from './groups/groups.module';
import { ChannelsModule } from './channels/channels.module';
import { MembersModule } from './members/members.module';
import { InvitesModule } from './invites/invites.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, FriendsModule, GroupsModule, ChannelsModule, MembersModule, InvitesModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
