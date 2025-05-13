"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request?.auth0 ?? null;
    if (!user) {
        throw new common_1.ForbiddenException('Decorator user is not found');
    }
    return user;
});
//# sourceMappingURL=user.decorator.js.map