import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserEntity } from '../user/user.entity';
import { CreateForgetPasswordHandler } from './command/create-forget-password.command';
import { ForgetPasswordController } from './forget-password.controller';
import { ForgetPasswordEntity } from './forget-password.entity';
import { ForgetPasswordService } from './forget-password.service';

const handlers = [CreateForgetPasswordHandler];

@Module({
  controllers: [ForgetPasswordController],
  providers: [ForgetPasswordService, ...handlers],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forFeature([ForgetPasswordEntity, UserEntity]),
  ],
})
export class ForgetPasswordModule {}
