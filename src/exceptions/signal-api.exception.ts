import { BadRequestException } from '@nestjs/common';

export class Strategy1NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.Strategy1NotValidException', error);
  }
}

export class Strategy2NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.Strategy2NotValidException', error);
  }
}

export class Strategy3NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.Strategy3NotValidException', error);
  }
}

export class Strategy5NotValidException extends BadRequestException {
  constructor(error?: string) {
    super('error.Strategy5NotValidException', error);
  }
}

export class StrategyParamsNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.StrategyParamsNotFoundException', error);
  }
}
