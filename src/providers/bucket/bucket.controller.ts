import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { BucketService } from './bucket.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get()
  getFiles() {
    return 'test get list files';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('root') root: string,
  ) {
    if (!root) {
      this.bucketService.unlinkSyncFile(file?.path);
      throw new BadRequestException('Require root key');
    }

    if (!this.bucketService.isValidKeyRoot(root)) {
      this.bucketService.unlinkSyncFile(file?.path);
      throw new BadRequestException('Invalid root key');
    }

    return await this.bucketService.putFileObject(file);
  }
}
