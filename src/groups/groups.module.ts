import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsGateway } from './groups.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupsController } from './groups.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsGateway, GroupsService],
})
export class GroupsModule {}
