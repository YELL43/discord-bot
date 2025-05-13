import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Auth0VerifyTokenDto } from './dto/auth0-verify-token.dto';
import { TempAccessToken } from '../../entities/portals/temp-access-token.entity';
import { Repository } from 'typeorm';
export declare class Auth0Service {
    private configService;
    private httpService;
    private jwtService;
    private repoTempAccessToken;
    constructor(configService: ConfigService, httpService: HttpService, jwtService: JwtService, repoTempAccessToken: Repository<TempAccessToken>);
    private getConfigEnvironment;
    verifyToken(body: Auth0VerifyTokenDto): Promise<{
        access_token: string;
        id_token: string;
        session_expire: any;
    }>;
    private saveTempAccessToken;
    private fetchAccessToken;
    private fetchRoles;
}
