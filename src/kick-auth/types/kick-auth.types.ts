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
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: 'Bearer';
}
