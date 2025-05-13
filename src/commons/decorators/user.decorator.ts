import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IUserAuth0Jwt } from '../types';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request?.auth0 ?? null;

    if (!user) {
      throw new ForbiddenException('Decorator user is not found');
    }

    return user as IUserAuth0Jwt;
  },
);
