import { Module } from '@nestjs/common';
import { KickAuthService } from './kick-auth.service';
import { ConfigModule } from '@nestjs/config';
import { KickAuthController } from './kick-auth.controller';

@Module({
  imports: [ConfigModule],
  providers: [KickAuthService],
  controllers: [KickAuthController],
})
export class KickAuthModule {}
