import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const BearerToken = createParamDecorator(
  (
    data: { required?: boolean } = { required: false },
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (data?.required)
        throw new UnauthorizedException('Missing or invalid bearer token');

      return undefined;
    }

    return authHeader.split(' ')[1]?.trim();
  },
);
