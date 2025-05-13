"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0Module = void 0;
const common_1 = require("@nestjs/common");
const auth0_service_1 = require("./auth0.service");
const auth0_controller_1 = require("./auth0.controller");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const temp_access_token_entity_1 = require("../../entities/portals/temp-access-token.entity");
let Auth0Module = class Auth0Module {
};
exports.Auth0Module = Auth0Module;
exports.Auth0Module = Auth0Module = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([temp_access_token_entity_1.TempAccessToken]),
            axios_1.HttpModule,
            jwt_1.JwtModule
        ],
        controllers: [auth0_controller_1.Auth0Controller],
        providers: [auth0_service_1.Auth0Service],
        exports: [auth0_service_1.Auth0Service],
    })
], Auth0Module);
//# sourceMappingURL=auth0.module.js.map