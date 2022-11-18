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
import { RolesModule } from './roles/roles.module';
import { RolesOnMembersModule } from './roles-on-members/roles-on-members.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PinMessagesModule } from './pin-messages/pin-messages.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    FriendsModule,
    GroupsModule,
    ChannelsModule,
    MembersModule,
    InvitesModule,
    MessagesModule,
    RolesModule,
    RolesOnMembersModule,
    FilesModule,
    PinMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
