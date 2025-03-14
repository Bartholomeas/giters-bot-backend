import { Session } from 'express-session';

declare module 'express-session' {
  interface Session {
    state: string;
    codeVerifier: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare namespace Express {
  export interface Request {
    session: Session;
    cookies: {
      kick_access_token: string;
      kick_refresh_token: string;
    };
  }
}
