import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLogger } from '../entities/system-logger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemLogger])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
