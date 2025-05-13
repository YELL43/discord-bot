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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    getConfigEnvironment() {
        return {
            jwt_secret_key: this.configService.get('JWT_SECRET_KEY'),
            jwt_expires_in: this.configService.get('JWT_EXPIRES_IN'),
        };
    }
    canActivate(context) {
        const env = this.getConfigEnvironment();
        const request = context.switchToHttp().getRequest();
        const authHeader = request?.headers['authorization']?.split(' ');
        if (!authHeader || !Array.isArray(authHeader) || authHeader?.length < 2) {
            throw new common_1.BadRequestException('Invalid token or token not provided');
        }
        const [type, token] = authHeader;
        if (type !== 'Bearer') {
            throw new common_1.ForbiddenException('Invalid token type');
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: env?.jwt_secret_key,
            });
            request.auth0 = payload;
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map