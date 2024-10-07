import os from 'node:os';

import { Injectable } from '@nestjs/common';

import { OsType } from '../../constants/os-type';

@Injectable()
export class OperatingSystemService {
  public getOperatingSystemName(): string {
    return os.platform();
  }

  public isWindow(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return this.getOperatingSystemName() === OsType.WINDOWS;
  }

  public isLinux(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return this.getOperatingSystemName() === OsType.LINUX;
  }

  public isMacOs(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return this.getOperatingSystemName() === OsType.MACOS;
  }
}
