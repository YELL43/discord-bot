import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Auth0Service } from './auth0.service';
import { Auth0VerifyTokenDto } from './dto/auth0-verify-token.dto';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller()
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Post('verify-token')
  async verifyToken(@Body() body: Auth0VerifyTokenDto) {
    return await this.auth0Service.verifyToken(body);
  }

  @Post('roles')
  @UseGuards(JwtAuthGuard)
  getRoles(@Req() req: Request) {
    return req['auth0']['roles'] ?? null;
  }
}
