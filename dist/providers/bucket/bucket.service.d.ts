import { ConfigService } from '@nestjs/config';
import { IFileObject } from '../../commons/types';
export declare enum ERootPathBucket {
    Images = "images",
    Icons = "icons",
    Files = "files"
}
export interface IFileResponse {
    bucket_host: string;
    location: string;
    object: IFileObject;
}
export declare class BucketService {
    private configService;
    private aws_s3_bucket;
    private aws_s3_bucket_host;
    private s3;
    constructor(configService: ConfigService);
    isValidKeyRoot(value: string): value is ERootPathBucket;
    putFileObject(file: Express.Multer.File, keyRoot?: keyof typeof ERootPathBucket): Promise<IFileResponse>;
    unlinkSyncFile(path: string): void;
}
