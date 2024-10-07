import { BadRequestException } from '@nestjs/common';

export class Martingale2NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.martingale2NotValid', error);
  }
}

export class Martingale1NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.martingale1NotValid', error);
  }
}

export class Martingale3NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.martingale3NotValid', error);
  }
}
