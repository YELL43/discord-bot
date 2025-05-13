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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const system_logger_entity_1 = require("../entities/system-logger.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let LoggerService = class LoggerService {
    constructor(repoSystemLogger) {
        this.repoSystemLogger = repoSystemLogger;
    }
    async add(type, payload) {
        const eType = system_logger_entity_1.ELoggerType[type];
        if (!eType) {
            throw new common_1.BadRequestException('Invalid logger type');
        }
        const eAction = system_logger_entity_1.ELoggerAction[payload?.action];
        if (!eAction) {
            throw new common_1.BadRequestException('Invalid logger action');
        }
        const attribs = this.repoSystemLogger.create({
            type: eType,
            action: eAction,
            unique_id: payload.uniqueId,
            username: payload?.username,
            data: payload?.data ?? null,
        });
        return await this.repoSystemLogger.save(attribs);
    }
    async info(payload) {
        return await this.add('info', payload);
    }
    async success(payload) {
        return await this.add('success', payload);
    }
    async warning(payload) {
        return await this.add('warning', payload);
    }
    async error(payload) {
        return await this.add('error', payload);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(system_logger_entity_1.SystemLogger)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], LoggerService);
//# sourceMappingURL=logger.service.js.map