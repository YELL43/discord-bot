"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodFileObject = void 0;
const zod_1 = require("zod");
exports.ZodFileObject = zod_1.z.object({
    type: zod_1.z.string(),
    key: zod_1.z.string(),
    filename: zod_1.z.string(),
    rename: zod_1.z.string(),
    mimetype: zod_1.z.string(),
    size: zod_1.z.number(),
});
//# sourceMappingURL=index.js.map