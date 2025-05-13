import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeaveService } from '../leave/leave.service';
export declare class DiscordService implements OnModuleInit {
    private readonly configService;
    private readonly leaveService;
    private readonly logger;
    private readonly client;
    constructor(configService: ConfigService, leaveService: LeaveService);
    onModuleInit(): Promise<void>;
}
