"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoleDto = exports.CredentialsSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.CredentialsSchema = zod_1.z.object({
    code: zod_1.z.string().nonempty(),
    name: zod_1.z.string().nonempty(),
    desc: zod_1.z.string().optional(),
    active: zod_1.z.boolean().optional().default(true),
});
class CreateRoleDto extends (0, nestjs_zod_1.createZodDto)(exports.CredentialsSchema) {
}
exports.CreateRoleDto = CreateRoleDto;
//# sourceMappingURL=create-role.dto.js.map