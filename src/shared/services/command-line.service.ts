import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';

import { stopProcessPsPath } from '../../constants/command';
import { OperatingSystemService } from './operating-system.service';

@Injectable()
export class CommandLineService {
  constructor(private operatingSystemService: OperatingSystemService) {}

  public executeCommandLine(command: string): string {
    return execSync(command, { shell: '/bin/bash' }).toString();
  }

  public stopProcess(processId: string): Error | null {
    try {
      let command = '';

      if (this.operatingSystemService.isWindow()) {
        if (!existsSync(stopProcessPsPath)) {
          throw new Error(`Powershell for stop process doesn't found!`);
        }

        const stopProcessPsFullPath = path.resolve(stopProcessPsPath);
        command = `powershell -executionPolicy bypass -file "${stopProcessPsFullPath}" -ProcessID ${processId}`;
      } else if (this.operatingSystemService.isLinux()) {
        command = `kill -SIGINT ${processId}`;
      } else {
        throw new Error(
          `Operating system ${this.operatingSystemService.getOperatingSystemName()} not supported`,
        );
      }

      const stdOut = this.executeCommandLine(command).replace('\n', '');

      // should not have output when process killed successfully
      if (stdOut.length > 0) {
        throw new Error(`Failed to kill process due to: ${stdOut}`);
      }

      return null;
    } catch (error) {
      return error as Error;
    }
  }
}
