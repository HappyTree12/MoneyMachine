import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BybitPairingService } from '../bybit-pairing/bybit-pairing.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly bybitPairingService: BybitPairingService) {}

  // async onApplicationBootstrap() {
  //   await this.handleCron();
  // }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const inverse = await this.bybitPairingService.updatePairing({
      category: 'inverse',
    });

    const linear = await this.bybitPairingService.updatePairing({
      category: 'linear',
    });

    const totalUpdated = inverse.updated + linear.updated;
    const totalDeleted = inverse.deleted + linear.deleted;
    this.logger.log(
      `Updated ${totalUpdated} inverse pairings and deleted ${totalDeleted} pairings.`,
    );
  }
}
