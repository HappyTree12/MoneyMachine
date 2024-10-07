import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { BotType } from '../../constants';
import { WorkerNotAbleToRun } from '../../exceptions/worker-exception';
import { CreateWorkerDto } from './create-worker.dto';

@Injectable()
export class BotHubService {
  constructor(private readonly httpService: HttpService) {}

  async runWorkerFromBotHub({
    workerId,
    groupOrderId,
    botType = BotType.martingale,
    isPartialMode = false,
  }: {
    workerId: Uuid;
    groupOrderId?: Uuid;
    botType?: BotType;
    isPartialMode?: boolean;
  }) {
    try {
      let microServiceLink = process.env.BOTHUB_LINK;
      const scriptPath = process.env.PYTHON_MAIN_FOLDER_PATH;

      if (microServiceLink === undefined) {
        throw new Error('Micro Service link is not defined!');
      }

      if (scriptPath === undefined) {
        throw new Error('Python Script Path is not defined!');
      }

      microServiceLink += '/v1/startWorker';

      const args = ['--workerId', workerId, '--botType', botType];

      if (groupOrderId !== undefined) {
        args.push('--groupOrderId', groupOrderId);
      }

      if (isPartialMode) {
        args.push('--partialMode', 'true');
      }

      const createWorkerDto = new CreateWorkerDto();
      createWorkerDto.scriptPath = scriptPath;
      createWorkerDto.pythonFileName = 'run.py';
      createWorkerDto.args = args;

      return await this.httpService.axiosRef.post(
        microServiceLink,
        createWorkerDto,
      );
    } catch (error_) {
      const error = (error_ as Error).message;

      throw new WorkerNotAbleToRun(error);
    }
  }
}
