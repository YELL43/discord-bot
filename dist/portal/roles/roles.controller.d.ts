import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUserAuth0Jwt, TQueryParams } from '../../commons/types';
import { IntoApplicationDto } from './dto/into-application.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    listApplication(user: IUserAuth0Jwt): Promise<{
        isConsole: boolean;
        list: any[];
    }>;
    findCode(): {
        code: string;
    };
    findOne(id: string): Promise<import("../../entities/portals/portal-roles.entity").PortalRoles | {
        applications: import("../../entities/portals/portal-roles-application.entity").PortalRolesApplication[];
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
    findAll(query: TQueryParams): Promise<import("../../commons/types").IResponseManyAndCount<Partial<import("../../entities/portals/portal-roles.entity").PortalRoles>[]>>;
    addApplication(user: IUserAuth0Jwt, body: IntoApplicationDto): Promise<import("typeorm").InsertResult>;
    create(user: IUserAuth0Jwt, createRoleDto: CreateRoleDto): Promise<{
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
    } & import("../../entities/portals/portal-roles.entity").PortalRoles>;
    update(user: IUserAuth0Jwt, id: string, updateRoleDto: UpdateRoleDto): Promise<({
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
        applications: import("../../entities/portals/portal-roles-application.entity").PortalRolesApplication[];
    }) & import("../../entities/portals/portal-roles.entity").PortalRoles>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
