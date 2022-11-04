import { Injectable, PipeTransform } from '@nestjs/common';
// import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<any> {
    // console.log(image);
    // const originalName = path.parse(image.originalname).name;
    // const filename = Date.now() + '-' + originalName + '.webp';

    return await sharp(image.buffer)
      .resize({
        width: 640,
        height: 360,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ effort: 3, quality: 50 })
      .toBuffer();
  }
}

@Injectable()
export class SharpIconPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<any> {
    return await sharp(image.buffer)
      .resize({ width: 48, height: 48 })
      .webp({ effort: 3, quality: 50 })
      .toBuffer();
  }
}
