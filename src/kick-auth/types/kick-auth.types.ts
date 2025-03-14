export type KickOAuthScopes =
  | 'user:read'
  | 'channel:read'
  | 'chat:write'
  | 'events:subscribe';

export interface KickAuthSearchParams extends Record<string, string> {
  grant_type: 'authorization_code';
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  response_type: 'code';
  scope: string;
  state: string;
  code: string;
  code_challenge: string;
  code_challenge_method: 'S256';
  code_verifier: string;
}

export interface KickAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  // expires_in: number;
  // scope: string;
  // token_type: 'Bearer';
}



export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expiry: string;
  expires_in: number;
  scope: string;
}

export interface KickAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}

export type TokenHintType = 'access_token' | 'refresh_token';

export interface AuthorizeParams {
  state: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  scopes: string[];
}
