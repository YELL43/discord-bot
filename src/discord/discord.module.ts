import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { LeaveModule } from 'src/leave/leave.module';

@Module({
  imports: [LeaveModule],
  providers: [DiscordService]
})
export class DiscordModule {}
