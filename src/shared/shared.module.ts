import { Global, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { CommandLineService } from './services/command-line.service';
import { EncryptionService } from './services/encryption.service';
import { GeneratorService } from './services/generator.service';
import { OperatingSystemService } from './services/operating-system.service';
import { PythonService } from './services/python.service';
import { ValidatorService } from './services/validator.service';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  AwsS3Service,
  GeneratorService,
  EncryptionService,
  CommandLineService,
  OperatingSystemService,
  PythonService,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
