import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
} from '@nestjs/common';
import { KickAuthService } from './kick-auth.service';

@Controller('oauth/kick')
export class KickAuthController {
  constructor(private readonly kickAuthService: KickAuthService) {}

  @Get()
  @Redirect()
  initiateAuth() {
    const url = this.kickAuthService.generateAuthUrl();
    return { url, statusCode: 301 };
  }

  @Get('/xd')
  initiateAuth2() {
    throw new BadRequestException('xd hehe');
  }

  @Get('/callback')
  async handleAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    return await this.kickAuthService.handleAuthCallback({
      code,
      state,
    });
  }
}
