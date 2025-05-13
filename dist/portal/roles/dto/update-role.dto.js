"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleDto = void 0;
const create_role_dto_1 = require("./create-role.dto");
const nestjs_zod_1 = require("nestjs-zod");
const UpdateCredentialsSchema = create_role_dto_1.CredentialsSchema.partial();
class UpdateRoleDto extends (0, nestjs_zod_1.createZodDto)(UpdateCredentialsSchema) {
}
exports.UpdateRoleDto = UpdateRoleDto;
//# sourceMappingURL=update-role.dto.js.map