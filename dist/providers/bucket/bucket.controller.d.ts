import { BucketService } from './bucket.service';
export declare class BucketController {
    private readonly bucketService;
    constructor(bucketService: BucketService);
    getFiles(): string;
    uploadFile(file: Express.Multer.File, root: string): Promise<import("./bucket.service").IFileResponse>;
}
