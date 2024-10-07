import { BadRequestException } from '@nestjs/common';

export class OtpInvalidExpiredException extends BadRequestException {
  constructor(error?: string) {
    super('error.otpInvalidExpired', error);
  }
}
