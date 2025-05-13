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
exports.ConsoleController = void 0;
const common_1 = require("@nestjs/common");
const console_service_1 = require("./console.service");
const jwt_auth_guard_1 = require("../../commons/guards/jwt-auth.guard");
const user_decorator_1 = require("../../commons/decorators/user.decorator");
let ConsoleController = class ConsoleController {
    constructor(consoleService) {
        this.consoleService = consoleService;
    }
    async findApplications(user, query) {
        return await this.consoleService.findApplications(user.uuid, query);
    }
    async findOne(user, id) {
        return await this.consoleService.findApplicationsById(user.uuid, id);
    }
};
exports.ConsoleController = ConsoleController;
__decorate([
    (0, common_1.Get)('applications'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConsoleController.prototype, "findApplications", null);
__decorate([
    (0, common_1.Get)('application/:id'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConsoleController.prototype, "findOne", null);
exports.ConsoleController = ConsoleController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [console_service_1.ConsoleService])
], ConsoleController);
//# sourceMappingURL=console.controller.js.map