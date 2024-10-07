import {
  BadGatewayException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

export class BybitApiRequestNotAcceptableException extends NotAcceptableException {
  constructor(error?: string) {
    super('error.bybitApiRequestNotAccpetable', error);
  }
}

export class BybitSubAccWorkerNotAcceptableException extends NotAcceptableException {
  constructor(error?: string) {
    super('error.bybitSubAccWorkerNotAccpetable', error);
  }
}

export class BybitApiNotValidException extends NotAcceptableException {
  constructor(error?: string) {
    super('error.bybitApiNotValid', error);
  }
}

export class BybitApiNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.bybitApiNotFound', error);
  }
}

export class BybitApiServerTimeNotMatch extends BadGatewayException {
  constructor(error?: string) {
    super('error.bybitApiServerTimeNotMatch', error);
  }
}

// Exception thrown when 'v5/market/instruments-info' api returns an error
export class BybitApiInstrumentInfoException extends NotFoundException {
  constructor(error?: string) {
    super('error.bybitApiInstrumentInfo', error);
  }
}
