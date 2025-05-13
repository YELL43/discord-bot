import { ELoggerAction, ELoggerType, SystemLogger } from '../entities/system-logger.entity';
import { Repository } from 'typeorm';
export interface ILoggerPayload<T> {
    action: keyof typeof ELoggerAction;
    username: string;
    uniqueId: string;
    data?: T;
}
export declare class LoggerService {
    private repoSystemLogger;
    constructor(repoSystemLogger: Repository<SystemLogger>);
    add<T>(type: keyof typeof ELoggerType, payload: ILoggerPayload<T>): Promise<SystemLogger>;
    info<T>(payload: ILoggerPayload<T>): Promise<SystemLogger>;
    success<T>(payload: ILoggerPayload<T>): Promise<SystemLogger>;
    warning<T>(payload: ILoggerPayload<T>): Promise<SystemLogger>;
    error<T>(payload: ILoggerPayload<T>): Promise<SystemLogger>;
}
