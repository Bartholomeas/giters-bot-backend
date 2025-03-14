export interface HandleAuthDto {
  code: string;
  state: string;
}

export interface HandleAuthCallbackDto {
  code: string;
  state: string;
  codeVerifier: string;
}
