import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [UsersModule, GroupsModule],
  controllers: [FilesController],
  providers: [CloudinaryProvider, FilesService],
})
export class FilesModule {}
