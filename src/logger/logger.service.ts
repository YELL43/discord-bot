import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ELoggerAction,
  ELoggerType,
  SystemLogger,
} from '../entities/system-logger.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export interface ILoggerPayload<T> {
  action: keyof typeof ELoggerAction;
  username: string;
  uniqueId: string;
  data?: T;
}

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(SystemLogger)
    private repoSystemLogger: Repository<SystemLogger>,
  ) {}

  async add<T>(type: keyof typeof ELoggerType, payload: ILoggerPayload<T>) {
    const eType = ELoggerType[type];
    if (!eType) {
      throw new BadRequestException('Invalid logger type');
    }

    const eAction = ELoggerAction[payload?.action];
    if (!eAction) {
      throw new BadRequestException('Invalid logger action');
    }

    const attribs = this.repoSystemLogger.create({
      type: eType,
      action: eAction,
      unique_id: payload.uniqueId,
      username: payload?.username,
      data: payload?.data ?? null,
    });

    return await this.repoSystemLogger.save(attribs);
  }

  async info<T>(payload: ILoggerPayload<T>) {
    return await this.add<T>('info', payload);
  }

  async success<T>(payload: ILoggerPayload<T>) {
    return await this.add<T>('success', payload);
  }

  async warning<T>(payload: ILoggerPayload<T>) {
    return await this.add<T>('warning', payload);
  }

  async error<T>(payload: ILoggerPayload<T>) {
    return await this.add<T>('error', payload);
  }
}
