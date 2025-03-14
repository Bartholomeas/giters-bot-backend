import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandleAuthDto } from './dto/handle-auth.dto';
import { TokenHintType } from './types/kick-auth.types';
import { AxiosError } from 'axios';
import { KickClient } from './kick.client';

@Injectable()
export class KickAuthService {
  private readonly kickClient: KickClient;

  constructor(private readonly configService: ConfigService) {
    this.kickClient = new KickClient(this.configService);
  }

  login(): {
    url: string;
    state: string;
    codeVerifier: string;
  } {
    return this.kickClient.getAuthorizationUrl();
  }

  async getAccessToken({ code, state }: HandleAuthDto): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const { accessToken, refreshToken, expiresIn } =
      await this.kickClient.getAccessToken(code, state);
    return { accessToken, refreshToken, expiresIn };
  }

  async logout(token: string, tokenHintType?: TokenHintType): Promise<void> {
    try {
      await this.kickClient.revokeToken(token, tokenHintType);
    } catch (error) {
      if (error instanceof AxiosError)
        throw new BadRequestException(error?.message);
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw new BadRequestException('Failed to revoke token');
    }
  }
}
