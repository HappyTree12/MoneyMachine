import { ImATeapotException } from '@nestjs/common';

export class ExceptionNotRecognise extends ImATeapotException {
  constructor(error?: string) {
    super('error.exceptionNotRecognise', error);
  }
}
