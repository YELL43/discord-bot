"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordModule = void 0;
const common_1 = require("@nestjs/common");
const discord_service_1 = require("./discord.service");
const leave_module_1 = require("../leave/leave.module");
let DiscordModule = class DiscordModule {
};
exports.DiscordModule = DiscordModule;
exports.DiscordModule = DiscordModule = __decorate([
    (0, common_1.Module)({
        imports: [leave_module_1.LeaveModule],
        providers: [discord_service_1.DiscordService]
    })
], DiscordModule);
//# sourceMappingURL=discord.module.js.map