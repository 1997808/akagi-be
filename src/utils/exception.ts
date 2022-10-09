import { HttpException, HttpStatus } from '@nestjs/common';

export const serverError = (message: string) => {
  throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
};
