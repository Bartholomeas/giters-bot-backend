export class KickApiError extends Error {
  constructor(message: string, status: number) {
    super(message);
    this.name = 'KickApiError';
    // this.status = status;
  }
}

export class UnauthorizedError extends KickApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends KickApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
