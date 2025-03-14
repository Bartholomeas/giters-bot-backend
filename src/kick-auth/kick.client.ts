import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import {
  KICK_AUTH_URL,
  KICK_SCOPES,
  KICK_TOKEN_URL,
} from './kick-auth.constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  KickAuthSearchParams,
  KickAuthTokenResponse,
  TokenHintType,
  TokenResponse,
} from './types/kick-auth.types';

@Injectable()
export class KickClient {
  private readonly kickBaseUrl = 'https://id.kick.com';

  private readonly kickAuthUrl: string = KICK_AUTH_URL;
  private readonly kickTokenUrl: string = KICK_TOKEN_URL;
  private readonly kickScopes = KICK_SCOPES;

  private readonly kickRedirectUrl: string;
  private readonly kickClientId: string;
  private readonly kickClientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.kickRedirectUrl = this.configService.getOrThrow('KICK_REDIRECT_URL');
    this.kickClientId = this.configService.getOrThrow('KICK_CLIENT_ID');
    this.kickClientSecret = this.configService.getOrThrow('KICK_CLIENT_SECRET');
  }

  generateCodeVerifier(length: number = 128): string {
    const buffer = crypto.randomBytes(length);
    return buffer
      .toString('base64url')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);

    // const buffer = crypto.randomBytes(length);
    // return buffer.toString('base64url');
  }

  generateCodeChallenge(verifier: string): string {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
    // return crypto
    //   .createHash('sha256')
    //   .update(verifier)
    //   .digest('base64')
    //   .replace(/\+/g, '-')
    //   .replace(/\//g, '_')
    //   .replace(/=/g, '');
  }

  getAuthorizationUrl(): {
    url: string;
    state: string;
    codeVerifier: string;
  } {
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
    });

    return {
      url: `${this.kickAuthUrl}?${params.toString()}`,
      state,
      codeVerifier,
    };
  }

  async getAccessToken(
    code: string,
    state: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
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

      const {
        data: { access_token, refresh_token, expires_in },
      } = await axios.post<KickAuthTokenResponse>(
        this.kickTokenUrl,
        tokenParams.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      };
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new BadRequestException(err.response?.data);
      }
      throw new BadRequestException('Failed to handle auth callback');
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.kickClientId,
        client_secret: this.kickClientSecret,
        refresh_token: refreshToken,
      });
      const { data } = await axios.post<TokenResponse>(
        `${this.kickBaseUrl}/oauth/token`,
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError)
        throw new BadRequestException(error?.message);
      else if (error instanceof Error)
        throw new BadRequestException(error?.message);
      throw error;
    }
  }

  async revokeToken(
    token: string,
    tokenHintType?: TokenHintType,
  ): Promise<void> {
    const params = new URLSearchParams({ token });
    if (tokenHintType) {
      params.append('token_hint_type', tokenHintType);
    }

    await axios.post(`${this.kickBaseUrl}/oauth/revoke?${params.toString()}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
