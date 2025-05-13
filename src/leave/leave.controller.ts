import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async create(@Body() createLeaveDto: CreateLeaveDto) {
    const leave = await this.leaveService.create(createLeaveDto);
    return { message: 'Leave request submitted successfully', leave };
  }

  @Get(':id')
  async getLeave(@Param('id') id: string) {
    const leave = await this.leaveService.getLeaveById(id);
    return { leave };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return { error: 'Invalid status' };
    }
    const leave = await this.leaveService.updateLeaveStatus(id, status);
    return { message: `Leave status updated to ${status}`, leave };
  }
}