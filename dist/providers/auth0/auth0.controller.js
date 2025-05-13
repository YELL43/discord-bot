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
exports.Auth0Controller = void 0;
const common_1 = require("@nestjs/common");
const auth0_service_1 = require("./auth0.service");
const auth0_verify_token_dto_1 = require("./dto/auth0-verify-token.dto");
const jwt_auth_guard_1 = require("../../commons/guards/jwt-auth.guard");
let Auth0Controller = class Auth0Controller {
    constructor(auth0Service) {
        this.auth0Service = auth0Service;
    }
    async verifyToken(body) {
        return await this.auth0Service.verifyToken(body);
    }
    getRoles(req) {
        return req['auth0']['roles'] ?? null;
    }
};
exports.Auth0Controller = Auth0Controller;
__decorate([
    (0, common_1.Post)('verify-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth0_verify_token_dto_1.Auth0VerifyTokenDto]),
    __metadata("design:returntype", Promise)
], Auth0Controller.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", void 0)
], Auth0Controller.prototype, "getRoles", null);
exports.Auth0Controller = Auth0Controller = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth0_service_1.Auth0Service])
], Auth0Controller);
//# sourceMappingURL=auth0.controller.js.map