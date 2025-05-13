"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBucketDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bucket_dto_1 = require("./create-bucket.dto");
class UpdateBucketDto extends (0, mapped_types_1.PartialType)(create_bucket_dto_1.CreateBucketDto) {
}
exports.UpdateBucketDto = UpdateBucketDto;
//# sourceMappingURL=update-bucket.dto.js.map