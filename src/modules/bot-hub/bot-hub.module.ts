import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotHubService } from './bot-hub.service';

@Module({
  imports: [HttpModule],
  providers: [BotHubService],
})
export class BotHubModule {}
