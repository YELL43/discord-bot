"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginTestDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CredentialsSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty(),
    password: zod_1.z.string().nonempty(),
});
class LoginTestDto extends (0, nestjs_zod_1.createZodDto)(CredentialsSchema) {
}
exports.LoginTestDto = LoginTestDto;
//# sourceMappingURL=login-test.dto.js.map