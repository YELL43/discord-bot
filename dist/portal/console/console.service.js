"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const temp_access_token_entity_1 = require("../../entities/portals/temp-access-token.entity");
const rxjs_1 = require("rxjs");
let ConsoleService = class ConsoleService {
    constructor(configService, httpService, repoTempAccessToken) {
        this.configService = configService;
        this.httpService = httpService;
        this.repoTempAccessToken = repoTempAccessToken;
    }
    getConfigEnvironment() {
        return {
            domain: this.configService.get('AUTH0_DOMAIN'),
            client_id: this.configService.get('AUTH0_CLIENT_ID'),
            client_secret: this.configService.get('AUTH0_CLIENT_SECRET'),
            key_secret: this.configService.get('AUTH0_SECRET'),
            base_url: this.configService.get('AUTH0_APP_BASE_URL'),
        };
    }
    async getAccessToken(uuid) {
        const now = Math.floor(Date.now() / 1000);
        await this.repoTempAccessToken
            .createQueryBuilder()
            .delete()
            .where('expire < :now', { now })
            .execute();
        const accessToken = await this.repoTempAccessToken.findOneBy({
            uuid: uuid,
            active: true,
        });
        if (!accessToken) {
            throw new common_1.UnauthorizedException('Access Token not found or expired');
        }
        return accessToken?.access_token;
    }
    async findApplications(uuid, query = {}) {
        try {
            const serviceName = 'FIND_APPLICATIONS';
            const env = this.getConfigEnvironment();
            const accessToken = await this.getAccessToken(uuid);
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'GET',
                url: `${env.domain}/api/v2/clients`,
                params: {
                    fields: [
                        'name',
                        'client_id',
                        'app_type',
                        'description',
                        'logo_uri',
                        'initiate_login_uri'
                    ].join(','),
                    include_fields: true,
                    app_type: ['regular_web', 'spa'].join(','),
                    ...(query ?? {}),
                },
            }));
            if (res.status !== 200) {
                throw new common_1.BadRequestException(`Bad request [${serviceName}]: ` + res.status);
            }
            return res?.data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findApplicationsById(uuid, clientId) {
        try {
            const serviceName = 'FIND_APPLICATION_BY_CLIENT';
            const env = this.getConfigEnvironment();
            const accessToken = await this.getAccessToken(uuid);
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'GET',
                url: `${env.domain}/api/v2/clients/${clientId}`,
            }));
            if (res.status !== 200) {
                throw new common_1.BadRequestException(`Bad request [${serviceName}]: ` + res.status);
            }
            return res?.data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ConsoleService = ConsoleService;
exports.ConsoleService = ConsoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(temp_access_token_entity_1.TempAccessToken)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        typeorm_2.Repository])
], ConsoleService);
//# sourceMappingURL=console.service.js.map