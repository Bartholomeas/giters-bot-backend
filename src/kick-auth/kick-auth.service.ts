import { BadRequestException, Injectable } from '@nestjs/common';
import {
  KICK_AUTH_URL,
  KICK_SCOPES,
  KICK_TOKEN_URL,
} from './kick-auth.constants';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import { URLSearchParams } from 'node:url';
import { HandleAuthDto } from './dto/handle-auth.dto';
import {
  KickAuthSearchParams,
  KickAuthTokenResponse,
} from './types/kick-auth.types';
import axios, { AxiosError } from 'axios';

@Injectable()
export class KickAuthService {
  private readonly kickScopes = KICK_SCOPES;
  private readonly kickAuthUrl = KICK_AUTH_URL;
  private readonly kickTokenUrl = KICK_TOKEN_URL;

  private readonly kickRedirectUrl: string;
  private readonly kickClientSecret: string;
  private readonly kickClientId: string;

  constructor(private readonly configService: ConfigService) {
    this.kickRedirectUrl = this.configService.getOrThrow('KICK_REDIRECT_URL');
    this.kickClientSecret = this.configService.getOrThrow('KICK_CLIENT_SECRET');
    this.kickClientId = this.configService.getOrThrow('KICK_CLIENT_ID');
  }

  private generateCodeVerifier(): string {
    const buffer = crypto.randomBytes(32);
    return buffer.toString('base64url');
  }

  private generateCodeChallenge(codeVerifier: string): string {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    return hash.toString('base64url');
  }

  generateAuthUrl(): string {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    const state = Buffer.from(JSON.stringify({ codeVerifier })).toString(
      'base64',
    );

    const params = new URLSearchParams({
      client_id: this.kickClientId,
      redirect_uri: this.kickRedirectUrl,
      response_type: 'code',
      scope: this.kickScopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    } as KickAuthSearchParams);

    return `${this.kickAuthUrl}?${params.toString()}`;
  }

  async handleAuthCallback({
    code,
    state,
  }: HandleAuthDto): Promise<KickAuthTokenResponse> {
    if (!code) throw new BadRequestException('No code provided');
    if (!state) throw new BadRequestException('No state provided');

    try {
      const { codeVerifier } = JSON.parse(
        Buffer.from(state, 'base64').toString(),
      ) as { codeVerifier: string };
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.kickClientId,
        client_secret: this.kickClientSecret,
        code,
        redirect_uri: this.kickRedirectUrl,
        code_verifier: codeVerifier,
      } as KickAuthSearchParams);

      const { data: token } = await axios.post<KickAuthTokenResponse>(
        this.kickTokenUrl,
        tokenParams,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return token;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new BadRequestException(err.response?.data);
      }
      throw new BadRequestException('Failed to handle auth callback');
    }
  }
}
