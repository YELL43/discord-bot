import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Auth0VerifyTokenDto } from './dto/auth0-verify-token.dto';
import { firstValueFrom } from 'rxjs';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { TempAccessToken } from '../../entities/portals/temp-access-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class Auth0Service {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private jwtService: JwtService,
    @InjectRepository(TempAccessToken)
    private repoTempAccessToken: Repository<TempAccessToken>,
  ) {}

  private getConfigEnvironment() {
    return {
      domain: this.configService.get<string>('AUTH0_DOMAIN'),
      client_id: this.configService.get<string>('AUTH0_CLIENT_ID'),
      client_secret: this.configService.get<string>('AUTH0_CLIENT_SECRET'),
      key_secret: this.configService.get<string>('AUTH0_SECRET'),
      base_url: this.configService.get<string>('AUTH0_APP_BASE_URL'),
      jwt_secret_key: this.configService.get<string>('JWT_SECRET_KEY'),
      jwt_expires_in: this.configService.get<string>('JWT_EXPIRES_IN'),
    };
  }

  async verifyToken(body: Auth0VerifyTokenDto) {
    const env = this.getConfigEnvironment();
    const accessToken = await this.fetchAccessToken();
    const roles = await this.fetchRoles(accessToken, body.sub);

    try {
      const uuid = v4();
      const decodeAccessToken = this.jwtService.decode(accessToken);

      const payload = {
        ...body,
        uuid: uuid,
        roles: roles,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: env?.jwt_secret_key,
        expiresIn: env?.jwt_expires_in,
      });

      await this.saveTempAccessToken({
        uuid: uuid,
        email: payload.email,
        access_token: accessToken,
        expire: decodeAccessToken?.exp,
        created_by: payload.name,
        updated_by: payload.name,
      });

      return {
        access_token: accessToken,
        id_token: token,
        session_expire: decodeAccessToken?.exp,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async saveTempAccessToken(attribs: Partial<TempAccessToken>) {
    return await this.repoTempAccessToken.save(attribs);
  }

  private async fetchAccessToken(): Promise<string> {
    const serviceName = 'ACCESS_TOKEN';
    const env = this.getConfigEnvironment();

    try {
      const payloads = {
        client_id: `${env.client_id}`,
        client_secret: `${env.client_secret}`,
        audience: `${env.domain}/api/v2/`,
        grant_type: 'client_credentials',
      };

      const res = await firstValueFrom(
        this.httpService.request({
          method: 'POST',
          url: `${env.domain}/oauth/token`,
          data: payloads,
        }),
      );

      if (res.status !== 200) {
        throw new BadRequestException(
          `Bad request [${serviceName}]: ` + res.status,
        );
      }

      if (!res?.data['access_token']) {
        throw new BadRequestException('Access token not found');
      }

      return res?.data['access_token'];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async fetchRoles(accessToken: string, sub: string) {
    const serviceName = 'ROLES';
    const env = this.getConfigEnvironment();

    try {
      const res = await firstValueFrom(
        this.httpService.request({
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: 'GET',
          url: `${env.domain}/api/v2/users/${sub}/roles`,
        }),
      );

      if (res.status !== 200) {
        throw new BadRequestException(
          `Bad request [${serviceName}]: ` + res.status,
        );
      }

      const roles = ((res?.data as any[]) ?? [])?.map((e) => e?.name);
      if (roles?.length <= 0) {
        throw new BadRequestException('Roles not access');
      }

      return roles;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
