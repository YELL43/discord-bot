import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Leave } from './entities/leave.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';
export declare class LeaveService {
    private leaveRepository;
    private httpService;
    private configService;
    private readonly discordRest;
    constructor(leaveRepository: Repository<Leave>, httpService: HttpService, configService: ConfigService);
    create(createLeaveDto: CreateLeaveDto): Promise<Leave>;
    getLeaveById(leaveId: string): Promise<Leave>;
    updateLeaveStatus(leaveId: string, status: string): Promise<Leave>;
}
