import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { GroupsService } from '../groups/groups.service';
import { AuthUser } from '../users/user.decorator';
import { UsersService } from '../users/users.service';
import { FilesService } from './files.service';
import { SharpIconPipe, SharpPipe } from './sharp.pipe';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
  ) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile(SharpPipe) file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @AuthUser() user: User,
    @UploadedFile(SharpPipe) image: Buffer,
  ) {
    const result = await this.filesService.uploadBufferImage(image);
    return result.public_id;
  }

  @Post('group/banner/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadGroupBanner(
    @AuthUser() user: User,
    @UploadedFile(SharpPipe) image: Buffer,
    @Param('id') id: string,
  ) {
    const result = await this.filesService.uploadBufferImage(image);
    await this.groupsService.update(+id, {
      id: +id,
      bannerURL: result.public_id,
    });
    return result.public_id;
  }

  @Post('group/icon/:id')
  @UseInterceptors(FileInterceptor('icon'))
  async uploadGroupIcon(
    @AuthUser() user: User,
    @UploadedFile(SharpIconPipe) icon: Buffer,
    @Param('id') id: string,
  ) {
    const result = await this.filesService.uploadBufferImage(icon);
    await this.groupsService.update(+id, {
      id: +id,
      iconURL: result.public_id,
    });
    return result.public_id;
  }

  @Post('user/avatar')
  @UseInterceptors(FileInterceptor('icon'))
  async uploadAvatar(
    @AuthUser() user: User,
    @UploadedFile(SharpIconPipe) icon: Buffer,
  ) {
    const result = await this.filesService.uploadBufferImage(icon);
    await this.usersService.update(user.id, { avatar: result.public_id });
    return result.public_id;
  }
}
