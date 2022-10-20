import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersGateway } from './members.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { MembersController } from './members.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MembersController],
  providers: [MembersGateway, MembersService],
  exports: [MembersService],
})
export class MembersModule {}
