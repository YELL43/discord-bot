import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";
export declare enum EDatabaseEntity {
    crm = "CRM"
}
export interface IConfigOptions {
    database: string;
    entities: MixedList<string | Function | EntitySchema<any>>;
}
export declare const initialSetupConnection: (config: ConfigService, configOptions: IConfigOptions) => TypeOrmModuleOptions | Promise<TypeOrmModuleOptions>;
export declare const AppConnectionsDatabases: import("@nestjs/common").DynamicModule[];
