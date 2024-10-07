import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';

@Injectable()
export class PythonService {
  public runBybitSubAccWorker(workerId: Uuid, groupOrderId?: Uuid) {
    const args = ['--workerId', workerId];

    if (groupOrderId !== undefined) {
      args.push('--groupOrderId', groupOrderId);
    }

    // const stdioOptions = ['ignore' as IOType, 'ignore' as IOType, 'ignore' as IOType]
    const options = {
      pythonOptions: ['-u'],
      scriptPath: process.env.PYTHON_MAIN_FOLDER_PATH,
      detached: true,
      args,
    };

    // eslint-disable-next-line  @typescript-eslint/no-floating-promises
    return PythonShell.run('run.py', options);
  }
}
