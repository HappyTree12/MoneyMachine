import { BadRequestException, NotFoundException } from '@nestjs/common';

// Exception thrown when jwt token has expired
export class TokenExpiredException extends BadRequestException {
  constructor(error?: string) {
    super('error.tokenExpired', error);
  }
}

// Exception thrown when forget password session is not found in the database
export class ForgetPasswordSessionNotFound extends BadRequestException {
  constructor(error?: string) {
    super('error.forgetPasswordSessionNotFound', error);
  }
}

// Exception thrown when service fails to send email to user
export class MailerServiceException extends BadRequestException {
  constructor(error?: string) {
    super('error.mailerServiceException', error);
  }
}

// Exception thrown when forget password session service fails
export class ForgetPasswordRequestSessionFailed extends NotFoundException {
  constructor(error?: string) {
    super('error.forgetPasswordRequestSessionFailed', error);
  }
}

// Exception throw when change password service fails
export class ChangePasswordFailedException extends NotFoundException {
  constructor(error?: string) {
    super('error.changePasswordFailed', error);
  }
}
