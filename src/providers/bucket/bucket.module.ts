import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'node:path';
import { v4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          const typeFile = file?.originalname?.split('.').pop();
          const filename = `${v4()}.${typeFile?.toLocaleLowerCase()}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
