import { KickOAuthScopes } from './kick-client/kick-client.types';

export const KICK_SCOPES: KickOAuthScopes[] = [
  'user:read',
  'channel:read',
  'chat:write',
  'events:subscribe',
] as const;

const KICK_ID_BASE_URL = 'https://id.kick.com';
export const KICK_AUTH_URL = `${KICK_ID_BASE_URL}/oauth/authorize`;
export const KICK_TOKEN_URL = `${KICK_ID_BASE_URL}/oauth/token`;

export const KICK_API_URL = 'https://api.kick.com/public/v1';
export const KICK_CATEGORIES_URL = `${KICK_API_URL}/categories`;
