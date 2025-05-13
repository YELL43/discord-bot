"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0VerifyTokenDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const CredentialsSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    email: zod_1.z.string().email().nonempty(),
    picture: zod_1.z.string().nonempty(),
    sub: zod_1.z.string().nonempty(),
});
class Auth0VerifyTokenDto extends (0, nestjs_zod_1.createZodDto)(CredentialsSchema) {
}
exports.Auth0VerifyTokenDto = Auth0VerifyTokenDto;
//# sourceMappingURL=auth0-verify-token.dto.js.map