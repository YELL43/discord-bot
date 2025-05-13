import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";
import { PortalRolesApplication } from "./entities/portals/portal-roles-application.entity";
import { PortalRoles } from "./entities/portals/portal-roles.entity";
import { TempAccessToken } from "./entities/portals/temp-access-token.entity";
import { Logger } from "./entities/crm/logger.entity";
import { Leave } from "./leave/entities/leave.entity";

export enum EDatabaseEntity {
    crm = 'CRM',
}

export interface IConfigOptions {
    database: string;
    entities: MixedList<string | Function | EntitySchema<any>>
}

export const initialSetupConnection = (config: ConfigService, configOptions: IConfigOptions): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> => {
    const isEnabled = config.get<string>('DATABASE_ENABLE_SSL') == 'true';

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
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT')),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        synchronize: config.get<string>('DATABASE_AUTO_SYNC') === 'true',
        ...options,
        ...configOptions
    };
}

export const AppConnectionsDatabases = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return initialSetupConnection(configService, {
                database: configService.get<string>('DATABASE_NAME'),
                entities: [
                    PortalRolesApplication,
                    PortalRoles,
                    TempAccessToken,
                    Leave
                ]
            });
        },
    }),
    TypeOrmModule.forRootAsync({
        name: EDatabaseEntity.crm,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return initialSetupConnection(configService, {
                database: configService.get<string>('DATABASE_NAME_CRM'),
                entities: [
                    Logger,
                ]
            });
        },
    }),
];
