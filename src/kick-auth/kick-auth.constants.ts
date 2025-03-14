import { KickOAuthScopes } from './types/kick-auth.types';

export const KICK_SCOPES: KickOAuthScopes[] = [
  'user:read',
  'channel:read',
  'chat:write',
  'events:subscribe',
] as const;

export const KICK_AUTH_URL = 'https://id.kick.com/oauth/authorize';
export const KICK_TOKEN_URL = 'https://id.kick.com/oauth/token';
