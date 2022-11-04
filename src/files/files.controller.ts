import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { SharpIconPipe, SharpPipe } from './sharp.pipe';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile(SharpPipe) file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile(SharpPipe) image: Buffer) {
    return await (
      await this.filesService.uploadBufferImage(image)
    ).public_id;
  }

  @Post('icon')
  @UseInterceptors(FileInterceptor('icon'))
  async uploadIcon(@UploadedFile(SharpIconPipe) icon: Buffer) {
    return await (
      await this.filesService.uploadBufferImage(icon)
    ).public_id;
    // return await this.filesService.uploadBufferImage(icon);
  }
}
