"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConnectionsDatabases = exports.initialSetupConnection = exports.EDatabaseEntity = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const portal_roles_application_entity_1 = require("./entities/portals/portal-roles-application.entity");
const portal_roles_entity_1 = require("./entities/portals/portal-roles.entity");
const temp_access_token_entity_1 = require("./entities/portals/temp-access-token.entity");
const logger_entity_1 = require("./entities/crm/logger.entity");
const leave_entity_1 = require("./leave/entities/leave.entity");
var EDatabaseEntity;
(function (EDatabaseEntity) {
    EDatabaseEntity["crm"] = "CRM";
})(EDatabaseEntity || (exports.EDatabaseEntity = EDatabaseEntity = {}));
const initialSetupConnection = (config, configOptions) => {
    const isEnabled = config.get('DATABASE_ENABLE_SSL') == 'true';
    let options = {};
    if (isEnabled) {
        options = {
            ssl: {
                rejectUnauthorized: false,
            },
        };
    }
    return {
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: parseInt(config.get('DATABASE_PORT')),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        synchronize: config.get('DATABASE_AUTO_SYNC') === 'true',
        ...options,
        ...configOptions
    };
};
exports.initialSetupConnection = initialSetupConnection;
exports.AppConnectionsDatabases = [
    typeorm_1.TypeOrmModule.forRootAsync({
        imports: [config_1.ConfigModule],
        inject: [config_1.ConfigService],
        useFactory: (configService) => {
            return (0, exports.initialSetupConnection)(configService, {
                database: configService.get('DATABASE_NAME'),
                entities: [
                    portal_roles_application_entity_1.PortalRolesApplication,
                    portal_roles_entity_1.PortalRoles,
                    temp_access_token_entity_1.TempAccessToken,
                    leave_entity_1.Leave
                ]
            });
        },
    }),
    typeorm_1.TypeOrmModule.forRootAsync({
        name: EDatabaseEntity.crm,
        imports: [config_1.ConfigModule],
        inject: [config_1.ConfigService],
        useFactory: (configService) => {
            return (0, exports.initialSetupConnection)(configService, {
                database: configService.get('DATABASE_NAME_CRM'),
                entities: [
                    logger_entity_1.Logger,
                ]
            });
        },
    }),
];
//# sourceMappingURL=app.database.js.map