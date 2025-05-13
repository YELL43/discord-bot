"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntoApplicationDto = exports.CredentialsSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.CredentialsSchema = zod_1.z.object({
    roles_id: zod_1.z.number(),
    applications: zod_1.z
        .array(zod_1.z.object({
        client_id: zod_1.z.string(),
    }))
        .min(1),
});
class IntoApplicationDto extends (0, nestjs_zod_1.createZodDto)(exports.CredentialsSchema) {
}
exports.IntoApplicationDto = IntoApplicationDto;
//# sourceMappingURL=into-application.dto.js.map