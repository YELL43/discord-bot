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
exports.Auth0Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const rxjs_1 = require("rxjs");
const uuid_1 = require("uuid");
const typeorm_1 = require("@nestjs/typeorm");
const temp_access_token_entity_1 = require("../../entities/portals/temp-access-token.entity");
const typeorm_2 = require("typeorm");
let Auth0Service = class Auth0Service {
    constructor(configService, httpService, jwtService, repoTempAccessToken) {
        this.configService = configService;
        this.httpService = httpService;
        this.jwtService = jwtService;
        this.repoTempAccessToken = repoTempAccessToken;
    }
    getConfigEnvironment() {
        return {
            domain: this.configService.get('AUTH0_DOMAIN'),
            client_id: this.configService.get('AUTH0_CLIENT_ID'),
            client_secret: this.configService.get('AUTH0_CLIENT_SECRET'),
            key_secret: this.configService.get('AUTH0_SECRET'),
            base_url: this.configService.get('AUTH0_APP_BASE_URL'),
            jwt_secret_key: this.configService.get('JWT_SECRET_KEY'),
            jwt_expires_in: this.configService.get('JWT_EXPIRES_IN'),
        };
    }
    async verifyToken(body) {
        const env = this.getConfigEnvironment();
        const accessToken = await this.fetchAccessToken();
        const roles = await this.fetchRoles(accessToken, body.sub);
        try {
            const uuid = (0, uuid_1.v4)();
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
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async saveTempAccessToken(attribs) {
        return await this.repoTempAccessToken.save(attribs);
    }
    async fetchAccessToken() {
        const serviceName = 'ACCESS_TOKEN';
        const env = this.getConfigEnvironment();
        try {
            const payloads = {
                client_id: `${env.client_id}`,
                client_secret: `${env.client_secret}`,
                audience: `${env.domain}/api/v2/`,
                grant_type: 'client_credentials',
            };
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                method: 'POST',
                url: `${env.domain}/oauth/token`,
                data: payloads,
            }));
            if (res.status !== 200) {
                throw new common_1.BadRequestException(`Bad request [${serviceName}]: ` + res.status);
            }
            if (!res?.data['access_token']) {
                throw new common_1.BadRequestException('Access token not found');
            }
            return res?.data['access_token'];
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async fetchRoles(accessToken, sub) {
        const serviceName = 'ROLES';
        const env = this.getConfigEnvironment();
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'GET',
                url: `${env.domain}/api/v2/users/${sub}/roles`,
            }));
            if (res.status !== 200) {
                throw new common_1.BadRequestException(`Bad request [${serviceName}]: ` + res.status);
            }
            const roles = (res?.data ?? [])?.map((e) => e?.name);
            if (roles?.length <= 0) {
                throw new common_1.BadRequestException('Roles not access');
            }
            return roles;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.Auth0Service = Auth0Service;
exports.Auth0Service = Auth0Service = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(temp_access_token_entity_1.TempAccessToken)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService,
        jwt_1.JwtService,
        typeorm_2.Repository])
], Auth0Service);
//# sourceMappingURL=auth0.service.js.map