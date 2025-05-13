"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const nestjs_zod_1 = require("nestjs-zod");
const response_interceptor_1 = require("./commons/interceptors/response.interceptor");
const app_routes_1 = require("./app.routes");
const logger_module_1 = require("./logger/logger.module");
const test_module_1 = require("./test/test.module");
const console_module_1 = require("./portal/console/console.module");
const welcome_module_1 = require("./portal/welcome/welcome.module");
const roles_module_1 = require("./portal/roles/roles.module");
const auth0_module_1 = require("./providers/auth0/auth0.module");
const bucket_module_1 = require("./providers/bucket/bucket.module");
const jwt_1 = require("@nestjs/jwt");
const health_check_module_1 = require("./health-check/health-check.module");
const app_database_1 = require("./app.database");
const leave_module_1 = require("./leave/leave.module");
const discord_module_1 = require("./discord/discord.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
            }),
            ...app_database_1.AppConnectionsDatabases,
            app_routes_1.AppRoutes,
            jwt_1.JwtModule,
            logger_module_1.LoggerModule,
            test_module_1.TestModule,
            auth0_module_1.Auth0Module,
            bucket_module_1.BucketModule,
            welcome_module_1.WelcomeModule,
            console_module_1.ConsoleModule,
            roles_module_1.RolesModule,
            health_check_module_1.HealthCheckModule,
            leave_module_1.LeaveModule,
            discord_module_1.DiscordModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useClass: nestjs_zod_1.ZodValidationPipe,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            app_service_1.AppService,
        ],
        exports: [jwt_1.JwtModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map