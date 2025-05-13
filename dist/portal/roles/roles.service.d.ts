import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DataSource, Repository } from 'typeorm';
import { PortalRoles } from '../../entities/portals/portal-roles.entity';
import { IResponseManyAndCount, IUserAuth0Jwt, TQueryParams } from '../../commons/types';
import { IntoApplicationDto } from './dto/into-application.dto';
import { PortalRolesApplication } from '../../entities/portals/portal-roles-application.entity';
import { ConsoleService } from '../console/console.service';
export declare class RolesService {
    private readonly consoleService;
    private dataSource;
    private repoPortalRoles;
    private repoPortalRolesApplication;
    constructor(consoleService: ConsoleService, dataSource: DataSource, repoPortalRoles: Repository<PortalRoles>, repoPortalRolesApplication: Repository<PortalRolesApplication>);
    getAppCode(): string;
    getRoleSuperAdmin(): string;
    getListApplicationsFromRole(user: IUserAuth0Jwt): Promise<{
        isConsole: boolean;
        list: any[];
    }>;
    findAll(query: TQueryParams & {
        sort?: 'ASC' | 'DESC';
    }): Promise<IResponseManyAndCount<Partial<PortalRoles>[]>>;
    addApplication(body: IntoApplicationDto, byUser: Partial<PortalRoles>): Promise<import("typeorm").InsertResult>;
    create(createRoleDto: CreateRoleDto, byUser: Partial<PortalRoles>): Promise<{
        id?: number;
        code?: string;
        name?: string;
        desc?: string;
        options?: object;
        active?: boolean;
        created_by?: string;
        updated_by?: string;
        created_datetime?: string;
        updated_datetime?: string;
    } & PortalRoles>;
    findOne(id: number, isApplication?: boolean): Promise<PortalRoles | {
        applications: PortalRolesApplication[];
        id: number;
        code: string;
        name: string;
        desc: string;
        options: object;
        active: boolean;
        created_by: string;
        updated_by: string;
        created_datetime: string;
        updated_datetime: string;
    }>;
    update(id: number, updateRoleDto: UpdateRoleDto, byUser?: Partial<PortalRoles>): Promise<({
        id: number;
        code: string;
        name: string;
        desc: string;
        options: object;
        active: boolean;
        created_by: string;
        updated_by: string;
        created_datetime: string;
        updated_datetime: string;
    } | {
        id: number;
        code: string;
        name: string;
        desc: string;
        options: object;
        active: boolean;
        created_by: string;
        updated_by: string;
        created_datetime: string;
        updated_datetime: string;
        applications: PortalRolesApplication[];
    }) & PortalRoles>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    private getModelBy;
}
