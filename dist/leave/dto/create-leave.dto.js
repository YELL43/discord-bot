"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeaveDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CredentialsSchema = zod_1.z.object({
    type: zod_1.z.string().nonempty(),
    startDate: zod_1.z.string().nonempty(),
    endDate: zod_1.z.string().nonempty(),
    reason: zod_1.z.string().nonempty(),
    discordId: zod_1.z.string().nonempty(),
    discordChannelId: zod_1.z.string().optional(),
});
class CreateLeaveDto extends (0, nestjs_zod_1.createZodDto)(CredentialsSchema) {
}
exports.CreateLeaveDto = CreateLeaveDto;
//# sourceMappingURL=create-leave.dto.js.map