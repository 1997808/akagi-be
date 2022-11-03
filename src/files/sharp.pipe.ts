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
      .resize(800)
      .webp({ effort: 3, quality: 60 })
      .toBuffer();
  }
}
