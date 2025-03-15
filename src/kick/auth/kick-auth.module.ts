import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KickAuthController } from './kick-auth.controller';
import { KickAuthService } from './services/kick-auth.service';

@Module({
  imports: [ConfigModule],
  providers: [KickAuthService],
  controllers: [KickAuthController],
})
export class KickAuthModule {}
