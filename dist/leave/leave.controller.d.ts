import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    create(createLeaveDto: CreateLeaveDto): Promise<{
        message: string;
        leave: import("./entities/leave.entity").Leave;
    }>;
    getLeave(id: string): Promise<{
        leave: import("./entities/leave.entity").Leave;
    }>;
    updateStatus(id: string, status: string): Promise<{
        error: string;
        message?: undefined;
        leave?: undefined;
    } | {
        message: string;
        leave: import("./entities/leave.entity").Leave;
        error?: undefined;
    }>;
}
