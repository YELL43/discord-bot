"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketService = exports.ERootPathBucket = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
const fs = require("node:fs");
const date_tz_1 = require("../../commons/helpers/date-tz");
var ERootPathBucket;
(function (ERootPathBucket) {
    ERootPathBucket["Images"] = "images";
    ERootPathBucket["Icons"] = "icons";
    ERootPathBucket["Files"] = "files";
})(ERootPathBucket || (exports.ERootPathBucket = ERootPathBucket = {}));
let BucketService = class BucketService {
    constructor(configService) {
        this.configService = configService;
        const AWS_S3_ACCESS_KEY = this.configService.get('AWS_S3_ACCESS_KEY');
        const AWS_S3_SECRET_ACCESS_KEY = this.configService.get('AWS_S3_SECRET_ACCESS_KEY');
        const AWS_REGION = this.configService.get('AWS_REGION');
        this.aws_s3_bucket = this.configService.get('AWS_S3_BUCKET');
        this.aws_s3_bucket_host =
            this.configService.get('AWS_S3_BUCKET_HOST');
        this.s3 = new AWS.S3({
            region: AWS_REGION,
            accessKeyId: AWS_S3_ACCESS_KEY,
            secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
        });
    }
    isValidKeyRoot(value) {
        return Object.values(ERootPathBucket).includes(value);
    }
    async putFileObject(file, keyRoot = 'Images') {
        try {
            const rootPath = ERootPathBucket[keyRoot];
            const fileStream = fs.createReadStream(file.path);
            const formatDate = date_tz_1.DateTz.getDateNow('YYYYMM');
            const keyFile = `${rootPath}/${formatDate}/${file.filename}`;
            const params = {
                Bucket: this.aws_s3_bucket,
                Key: keyFile,
                Body: fileStream,
                ContentType: file.mimetype,
            };
            const data = await this.s3.upload(params).promise();
            return {
                bucket_host: this.aws_s3_bucket_host,
                location: data.Location,
                object: {
                    type: 'bucket',
                    key: data.Key,
                    filename: file.originalname,
                    rename: file.filename,
                    mimetype: file.mimetype,
                    size: file.size,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
        finally {
            this.unlinkSyncFile(file.path);
        }
    }
    unlinkSyncFile(path) {
        if (path) {
            fs.unlinkSync(path);
        }
    }
};
exports.BucketService = BucketService;
exports.BucketService = BucketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BucketService);
//# sourceMappingURL=bucket.service.js.map