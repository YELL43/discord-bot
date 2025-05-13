"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWelcomeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_welcome_dto_1 = require("./create-welcome.dto");
class UpdateWelcomeDto extends (0, mapped_types_1.PartialType)(create_welcome_dto_1.CreateWelcomeDto) {
}
exports.UpdateWelcomeDto = UpdateWelcomeDto;
//# sourceMappingURL=update-welcome.dto.js.map