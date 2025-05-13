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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const portal_roles_entity_1 = require("../../entities/portals/portal-roles.entity");
const portal_roles_application_entity_1 = require("../../entities/portals/portal-roles-application.entity");
const console_service_1 = require("../console/console.service");
let RolesService = class RolesService {
    constructor(consoleService, dataSource, repoPortalRoles, repoPortalRolesApplication) {
        this.consoleService = consoleService;
        this.dataSource = dataSource;
        this.repoPortalRoles = repoPortalRoles;
        this.repoPortalRolesApplication = repoPortalRolesApplication;
    }
    getAppCode() {
        return '1001';
    }
    getRoleSuperAdmin() {
        return `${this.getAppCode()}_01`;
    }
    async getListApplicationsFromRole(user) {
        const appCode = this.getAppCode();
        const roles = user?.roles?.filter((r) => r.startsWith(`${appCode}_`));
        if (roles?.length <= 0) {
            throw new common_1.BadRequestException('You do not have permission to access the menu list.');
        }
        if (roles.includes(this.getRoleSuperAdmin())) {
            const fetchApp = await this.consoleService.findApplications(user?.uuid);
            return {
                isConsole: true,
                list: fetchApp,
            };
        }
        else {
            const query = await this.dataSource.query(`
        SELECT app.client_id 
        FROM portal_roles_application app
        WHERE app.portal_roles_id IN (
          SELECT ro.id FROM portal_roles ro WHERE ro.code IN(${roles?.map(e => `'${e}'`)?.join(',')}) AND active = true
        ) AND app.active = true
        GROUP BY app.client_id
      `);
            const queryRoles = query.map(role => role?.client_id);
            if (queryRoles?.length <= 0) {
                throw new common_1.BadRequestException('Roles must be specified');
            }
            const listApp = [];
            const fetchApp = await this.consoleService.findApplications(user?.uuid);
            fetchApp?.forEach(app => {
                if (queryRoles.includes(app?.client_id)) {
                    listApp.push(app);
                }
            });
            return {
                isConsole: false,
                list: listApp,
            };
        }
    }
    async findAll(query) {
        const page = Number(query?.page ?? 1);
        const limit = Number(query?.limit ?? 10);
        const sort = query?.sort ?? 'ASC';
        const [data, total] = await this.repoPortalRoles
            .createQueryBuilder()
            .orderBy('id', sort)
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            navigate: {
                total: total,
                page: page,
                limit: limit,
                pageTotal: Math.ceil(total / limit),
            },
            data: data,
        };
    }
    async addApplication(body, byUser) {
        await this.findOne(body.roles_id);
        await this.repoPortalRolesApplication
            .createQueryBuilder()
            .where('portal_roles_id = :role_id', {
            role_id: body.roles_id,
        })
            .delete()
            .execute();
        const attributes = [];
        body.applications.forEach((app) => {
            attributes.push({
                portal_roles_id: body.roles_id,
                client_id: app?.client_id,
                ...byUser,
            });
        });
        return await this.repoPortalRolesApplication
            .createQueryBuilder()
            .insert()
            .values(attributes)
            .execute();
    }
    async create(createRoleDto, byUser) {
        const model = await this.getModelBy({ code: createRoleDto.code });
        if (model) {
            throw new common_1.BadRequestException('Code duplicate key value');
        }
        return await this.repoPortalRoles.save({ ...createRoleDto, ...byUser });
    }
    async findOne(id, isApplication = false) {
        const model = await this.getModelBy({ id: id });
        if (!model) {
            throw new common_1.BadRequestException('Data not found');
        }
        if (isApplication === true) {
            const applications = await this.repoPortalRolesApplication
                .createQueryBuilder('app')
                .select(['app.id', 'app.portal_roles_id', 'app.client_id'])
                .where('app.portal_roles_id = :role_id and app.active = :isActive', {
                role_id: id,
                isActive: true,
            })
                .getMany();
            return {
                ...model,
                applications,
            };
        }
        return model;
    }
    async update(id, updateRoleDto, byUser) {
        const model = await this.findOne(id);
        return await this.repoPortalRoles.save({
            ...model,
            ...updateRoleDto,
            ...byUser,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return await this.repoPortalRoles.delete({
            id: id,
        });
    }
    async getModelBy(attrib) {
        return await this.repoPortalRoles.findOneBy({
            ...attrib,
            active: true,
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __param(2, (0, typeorm_1.InjectRepository)(portal_roles_entity_1.PortalRoles)),
    __param(3, (0, typeorm_1.InjectRepository)(portal_roles_application_entity_1.PortalRolesApplication)),
    __metadata("design:paramtypes", [console_service_1.ConsoleService,
        typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map