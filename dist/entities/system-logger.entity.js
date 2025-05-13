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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogger = exports.ELoggerAction = exports.ELoggerType = void 0;
const typeorm_1 = require("typeorm");
var ELoggerType;
(function (ELoggerType) {
    ELoggerType["success"] = "success";
    ELoggerType["info"] = "info";
    ELoggerType["warning"] = "warning";
    ELoggerType["error"] = "error";
})(ELoggerType || (exports.ELoggerType = ELoggerType = {}));
var ELoggerAction;
(function (ELoggerAction) {
    ELoggerAction["SIGN_IN"] = "SIGN_IN";
    ELoggerAction["SIGN_OUT"] = "SIGN_OUT";
})(ELoggerAction || (exports.ELoggerAction = ELoggerAction = {}));
let SystemLogger = class SystemLogger {
};
exports.SystemLogger = SystemLogger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SystemLogger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ELoggerType, default: ELoggerType.info }),
    __metadata("design:type", String)
], SystemLogger.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ELoggerAction }),
    __metadata("design:type", String)
], SystemLogger.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], SystemLogger.prototype, "unique_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SystemLogger.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SystemLogger.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", String)
], SystemLogger.prototype, "created_datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", String)
], SystemLogger.prototype, "updated_datetime", void 0);
exports.SystemLogger = SystemLogger = __decorate([
    (0, typeorm_1.Entity)()
], SystemLogger);
//# sourceMappingURL=system-logger.entity.js.map