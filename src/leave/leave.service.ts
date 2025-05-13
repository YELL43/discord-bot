import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Leave } from './entities/leave.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeaveService {
  private readonly discordRest: REST;

  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.discordRest = new REST({ version: '10' }).setToken(
      this.configService.get('DISCORD_BOT_TOKEN'),
    );
  }

  async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    const leave = this.leaveRepository.create({
      ...createLeaveDto,
      status: 'pending',
      discordChannelId: createLeaveDto.discordChannelId,
    });
    const savedLeave = await this.leaveRepository.save(leave);

    const typeMap: { [key: string]: string } = {
      annual: 'ลาพักร้อน',
      sick: 'ลาป่วย',
      personal: 'ลากิจ',
    };
    const discordTag = createLeaveDto.discordId ? `<@${createLeaveDto.discordId}>` : 'ไม่ระบุผู้ใช้';
    let authorName = 'ไม่ระบุชื่อ';
    let authorIcon = 'https://example.com/default-avatar.png';

    if (createLeaveDto.discordId) {
      try {
        const discordUser = await this.discordRest.get(Routes.user(createLeaveDto.discordId)) as any;
        authorName = discordUser.global_name || discordUser.username || 'ไม่ระบุชื่อ';
        if (discordUser.avatar) {
          authorIcon = `https://cdn.discordapp.com/avatars/${createLeaveDto.discordId}/${discordUser.avatar}.png?size=64`;
        }
      } catch (error) {
        console.error('Error fetching Discord user:', error);
      }
    }

    const colorMap: { [key: string]: number } = {
      annual: 0x00ff00,
      sick: 0xff0000,
      personal: 0xffff00,
    };

    const message = {
      embeds: [
        {
          title: '📋 คำขอลาใหม่',
          description: `จาก: ${discordTag}\nช่อง: <#${createLeaveDto.discordChannelId}>`,
          author: {
            name: authorName,
            icon_url: authorIcon,
          },
          fields: [
            { name: 'ID คำขอ', value: savedLeave.id, inline: true },
            { name: 'ประเภท', value: typeMap[createLeaveDto.type] || createLeaveDto.type, inline: true },
            { name: 'วันเริ่มต้น', value: savedLeave.startDate, inline: true },
            { name: 'วันสิ้นสุด', value: savedLeave.endDate, inline: true },
            { name: 'เหตุผล', value: savedLeave.reason, inline: false },
            { name: 'สถานะ', value: savedLeave.status, inline: true },
          ],
          color: colorMap[createLeaveDto.type] || 0x0099ff,
          timestamp: new Date().toISOString(),
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: `approve_${savedLeave.id}`,
              label: 'อนุมัติ',
              style: 3,
            },
            {
              type: 2,
              custom_id: `reject_${savedLeave.id}`,
              label: 'ปฏิเสธ',
              style: 4,
            },
          ],
        },
      ],
    };

    try {
      const guildId = this.configService.get('DISCORD_GUILD_ID');
      const approverRoleId = this.configService.get('DISCORD_APPROVER_ROLE_ID');

      const guildResponse = await this.discordRest.get(Routes.guild(guildId)) as any;
      const queryParams = new URLSearchParams();
      queryParams.set('limit', '1000');
      const guildMembers = await this.discordRest.get(Routes.guildMembers(guildId), { query: queryParams }) as any[];

      const approvers = guildMembers.filter(member => member.roles.includes(approverRoleId));
      console.log(`Found ${approvers.length} approvers with role ${approverRoleId}`);

      // เพิ่มการส่ง DM ไปยัง User ID ที่ระบุโดยตรง
      const specificApproverId = '277142393789218825'; // User ID ที่ระบุ
      const hasSpecificApprover = guildMembers.some(member => member.user.id === specificApproverId);
      console.log(`Specific approver ${specificApproverId} found in guild: ${hasSpecificApprover}`);

      if (hasSpecificApprover) {
        try {
          const userDm = await this.discordRest.post(Routes.userChannels(), {
            body: { recipient_id: specificApproverId },
            headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
          }) as any;
          console.log(`Created DM channel for user ${specificApproverId}: ${userDm.id}`);

          await lastValueFrom(
            this.httpService.post(`https://discord.com/api/channels/${userDm.id}/messages`, message, {
              headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
            }),
          );
          console.log(`Successfully sent DM to user ${specificApproverId}`);
        } catch (dmError) {
          console.error(`Failed to send DM to user ${specificApproverId}:`, dmError.message);
          if (dmError.message.includes('Cannot send messages to this user')) {
            console.error('User has disabled DMs or blocked the bot.');
          }
        }
      } else {
        console.error(`User ${specificApproverId} not found in guild ${guildId}`);
      }

      // ส่ง DM ไปยัง Approvers ที่มี Role (ถ้ายังต้องการ)
      for (const approver of approvers) {
        try {
          const userDm = await this.discordRest.post(Routes.userChannels(), {
            body: { recipient_id: approver.user.id },
            headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
          }) as any;
          console.log(`Created DM channel for user ${approver.user.id}: ${userDm.id}`);

          await lastValueFrom(
            this.httpService.post(`https://discord.com/api/channels/${userDm.id}/messages`, message, {
              headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
            }),
          );
          console.log(`Successfully sent DM to user ${approver.user.id}`);
        } catch (dmError) {
          console.error(`Failed to send DM to user ${approver.user.id}:`, dmError.message);
          if (dmError.message.includes('Cannot send messages to this user')) {
            console.error('User has disabled DMs or blocked the bot.');
          }
        }
      }
    } catch (error) {
      console.error('Error sending Discord notification to approvers:', error);
      if (error.message.includes('Missing Access')) {
        console.error('Bot is missing GuildMembers Intent. Please enable it in Discord Developer Portal.');
      }
    }

    return savedLeave;
  }

  async getLeaveById(leaveId: string): Promise<Leave> {
    const leave = await this.leaveRepository.findOne({ where: { id: leaveId } });
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${leaveId} not found`);
    }
    return leave;
  }

  async updateLeaveStatus(leaveId: string, status: string): Promise<Leave> {
    const leave = await this.getLeaveById(leaveId);
    leave.status = status;
    const updatedLeave = await this.leaveRepository.save(leave);

    if (leave.discordChannelId) {
      const typeMap: { [key: string]: string } = {
        annual: 'ลาพักร้อน',
        sick: 'ลาป่วย',
        personal: 'ลากิจ',
      };

      const colorMap: { [key: string]: number } = {
        annual: 0x00ff00,
        sick: 0xff0000,
        personal: 0xffff00,
        approved: 0x00ff00,
        rejected: 0xff0000,
      };

      let authorName = 'ไม่ระบุชื่อ';
      let authorIcon = 'https://example.com/default-avatar.png';

      if (leave.discordId) {
        try {
          const discordUser = await this.discordRest.get(Routes.user(leave.discordId)) as any;
          authorName = discordUser.global_name || discordUser.username || 'ไม่ระบุชื่อ';
          if (discordUser.avatar) {
            authorIcon = `https://cdn.discordapp.com/avatars/${leave.discordId}/${discordUser.avatar}.png?size=64`;
          }
        } catch (error) {
          console.error('Error fetching Discord user for status update:', error);
        }
      }

      const formatDateForDisplay = (dateStr: string): string => {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
      };

      const statusMessage = status === 'approved' ? '✅ ถูกอนุมัติ' : '❌ ถูกปฏิเสธ';
      const message = {
        embeds: [
          {
            title: '📊 ผลการพิจารณาคำขอลา',
            description: `**ผู้ยื่นคำขอ**: <@${leave.discordId}>`,
            author: {
              name: authorName,
              icon_url: authorIcon,
            },
            thumbnail: {
              url: status === 'approved'
                ? 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
                : 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
            },
            fields: [
              { name: '🆔 ID คำขอ', value: leave.id, inline: true },
              { name: '📋 ประเภท', value: typeMap[leave.type] || leave.type, inline: true },
              { name: '\u200B', value: '\u200B', inline: false },
              { name: '📅 วันเริ่มต้น', value: formatDateForDisplay(leave.startDate), inline: true },
              { name: '📅 วันสิ้นสุด', value: formatDateForDisplay(leave.endDate), inline: true },
              { name: '\u200B', value: '\u200B', inline: false },
              { name: '📝 เหตุผล', value: leave.reason, inline: false },
              { name: '🔄 สถานะ', value: statusMessage, inline: false },
            ],
            color: colorMap[status] || 0x0099ff,
            footer: {
              text: `พิจารณาเมื่อ: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`,
              icon_url: 'https://cdn-icons-png.flaticon.com/512/223/223108.png',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const statusChannelId = this.configService.get('DISCORD_LEAVE_STATUS_CHANNEL_ID');
      try {
        await lastValueFrom(
          this.httpService.post(`https://discord.com/api/channels/${statusChannelId}/messages`, message, {
            headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
          }),
        );
      } catch (error) {
        console.error('Error sending status update to channel:', error);
      }
    }

    return updatedLeave;
  }
}