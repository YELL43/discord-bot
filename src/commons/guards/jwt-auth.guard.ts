import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUserAuth0Jwt } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private getConfigEnvironment() {
    return {
      jwt_secret_key: this.configService.get<string>('JWT_SECRET_KEY'),
      jwt_expires_in: this.configService.get<string>('JWT_EXPIRES_IN'),
    };
  }

  canActivate(context: ExecutionContext): boolean {
    const env = this.getConfigEnvironment();
    const request = context.switchToHttp().getRequest();
    const authHeader = request?.headers['authorization']?.split(' ');
    if (!authHeader || !Array.isArray(authHeader) || authHeader?.length < 2) {
      throw new BadRequestException('Invalid token or token not provided');
    }
    const [type, token] = authHeader;

    if (type !== 'Bearer') {
      throw new ForbiddenException('Invalid token type');
    }

    try {
      const payload = this.jwtService.verify<IUserAuth0Jwt>(token, {
        secret: env?.jwt_secret_key,
      });
      request.auth0 = payload;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
