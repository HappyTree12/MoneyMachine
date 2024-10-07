import { BadRequestException } from '@nestjs/common';

export class SharedKeyCreationFailedException extends BadRequestException {
  constructor(error?: string) {
    super('error.sharedKeyCreationFailedException', error);
  }
}

export class DecryptPayloadDataFailedException extends BadRequestException {
  constructor(error?: string) {
    super('error.decryptPayloadDataFailedException', error);
  }
}

export class RegisterPhantomSessionFailedException extends BadRequestException {
  constructor(error?: string) {
    super('error.registerPhantomSessionFailedException', error);
  }
}

export class PhantomSessionNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.phantomSessionNotFoundException', error);
  }
}
