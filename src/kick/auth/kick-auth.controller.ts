import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { KickAuthService } from './services/kick-auth.service';

@Controller()
export class KickAuthController {
  private readonly nodeEnv: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly kickAuthService: KickAuthService,
  ) {
    this.nodeEnv = this.configService.get('NODE_ENV') ?? 'development';
  }

  @Get('/dashboard')
  dashboard() {
    return { message: 'Dashboard siemano' };
  }

  @Get('/auth/login')
  @Redirect()
  login() {
    const { url } = this.kickAuthService.login();
    console.log('Auth url: ', { url });
    return { url, statusCode: 301 };
  }

  @Get('/auth/callback')
  @Redirect()
  async authCallback(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;
    const { accessToken, refreshToken } =
      await this.kickAuthService.getAccessToken({
        code: code as string,
        state: state as string,
      });

    res.cookie('kick_access_token', accessToken, {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.cookie('kick_refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });

    console.log({ accessToken });
    return { url: '/dashboard', statusCode: 301 };
  }

  @Delete('/auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const bearerToken = req.headers.authorization?.split(' ')[1];

    if (!bearerToken) throw new BadRequestException('No bearer token provided');

    await this.kickAuthService.logout(bearerToken);

    res.cookie('kick_access_token', '', {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
    res.cookie('kick_refresh_token', '', {
      httpOnly: true,
      secure: this.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
