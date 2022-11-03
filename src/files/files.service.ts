import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  create() {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }
}
