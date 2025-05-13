import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { TempAccessToken } from '../../entities/portals/temp-access-token.entity';
export declare class ConsoleService {
    private configService;
    private httpService;
    private repoTempAccessToken;
    constructor(configService: ConfigService, httpService: HttpService, repoTempAccessToken: Repository<TempAccessToken>);
    private getConfigEnvironment;
    private getAccessToken;
    findApplications(uuid: string, query?: any): Promise<any[]>;
    findApplicationsById(uuid: string, clientId: string): Promise<any>;
}
