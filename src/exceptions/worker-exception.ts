import {
  ConflictException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

export class WorkerIsRunningException extends ConflictException {
  constructor(error?: string) {
    super('error.workerIsRunningException', error);
  }
}

export class WorkerIsNotRunningException extends ConflictException {
  constructor(error?: string) {
    super('error.workerIsNotRunningException', error);
  }
}

export class WorkerNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.workerIsNotFoundException', error);
  }
}

export class WorkerNotAbleToRun extends NotAcceptableException {
  constructor(error?: string) {
    super('error.workerIsNotAbleToRunException', error);
  }
}
