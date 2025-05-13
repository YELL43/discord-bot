import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'node:fs';
import { DateTz } from '../../commons/helpers/date-tz';
import { IFileObject } from '../../commons/types';

export enum ERootPathBucket {
  Images = 'images',
  Icons = 'icons',
  Files = 'files',
}

export interface IFileResponse {
  bucket_host: string;
  location: string;
  object: IFileObject;
}

@Injectable()
export class BucketService {
  private aws_s3_bucket: string;
  private aws_s3_bucket_host: string;
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    const AWS_S3_ACCESS_KEY =
      this.configService.get<string>('AWS_S3_ACCESS_KEY');
    const AWS_S3_SECRET_ACCESS_KEY = this.configService.get<string>(
      'AWS_S3_SECRET_ACCESS_KEY',
    );
    const AWS_REGION = this.configService.get<string>('AWS_REGION');
    this.aws_s3_bucket = this.configService.get<string>('AWS_S3_BUCKET');
    this.aws_s3_bucket_host =
      this.configService.get<string>('AWS_S3_BUCKET_HOST');

    this.s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_S3_ACCESS_KEY,
      secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
    });
  }

  isValidKeyRoot(value: string): value is ERootPathBucket {
    return Object.values(ERootPathBucket).includes(value as ERootPathBucket);
  }

  async putFileObject(
    file: Express.Multer.File,
    keyRoot: keyof typeof ERootPathBucket = 'Images',
  ): Promise<IFileResponse> {
    try {
      const rootPath = ERootPathBucket[keyRoot];
      const fileStream = fs.createReadStream(file.path);
      const formatDate = DateTz.getDateNow('YYYYMM');
      const keyFile = `${rootPath}/${formatDate}/${file.filename}`;

      const params: AWS.S3.PutObjectRequest = {
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
    } catch (error) {
      throw new BadRequestException(error);
    } finally {
      this.unlinkSyncFile(file.path);
    }
  }

  unlinkSyncFile(path: string) {
    if (path) {
      fs.unlinkSync(path);
    }
  }
}
