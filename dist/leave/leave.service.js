"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const leave_entity_1 = require("./entities/leave.entity");
let LeaveService = class LeaveService {
    constructor(leaveRepository, httpService, configService) {
        this.leaveRepository = leaveRepository;
        this.httpService = httpService;
        this.configService = configService;
        this.discordRest = new rest_1.REST({ version: '10' }).setToken(this.configService.get('DISCORD_BOT_TOKEN'));
    }
    async create(createLeaveDto) {
        const leave = this.leaveRepository.create({
            ...createLeaveDto,
            status: 'pending',
            discordChannelId: createLeaveDto.discordChannelId,
        });
        const savedLeave = await this.leaveRepository.save(leave);
        const typeMap = {
            annual: 'ลาพักร้อน',
            sick: 'ลาป่วย',
            personal: 'ลากิจ',
        };
        const discordTag = createLeaveDto.discordId ? `<@${createLeaveDto.discordId}>` : 'ไม่ระบุผู้ใช้';
        let authorName = 'ไม่ระบุชื่อ';
        let authorIcon = 'https://example.com/default-avatar.png';
        if (createLeaveDto.discordId) {
            try {
                const discordUser = await this.discordRest.get(v10_1.Routes.user(createLeaveDto.discordId));
                authorName = discordUser.global_name || discordUser.username || 'ไม่ระบุชื่อ';
                if (discordUser.avatar) {
                    authorIcon = `https://cdn.discordapp.com/avatars/${createLeaveDto.discordId}/${discordUser.avatar}.png?size=64`;
                }
            }
            catch (error) {
                console.error('Error fetching Discord user:', error);
            }
        }
        const colorMap = {
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
            const guildResponse = await this.discordRest.get(v10_1.Routes.guild(guildId));
            const queryParams = new URLSearchParams();
            queryParams.set('limit', '1000');
            const guildMembers = await this.discordRest.get(v10_1.Routes.guildMembers(guildId), { query: queryParams });
            const approvers = guildMembers.filter(member => member.roles.includes(approverRoleId));
            console.log(`Found ${approvers.length} approvers with role ${approverRoleId}`);
            const specificApproverId = '277142393789218825';
            const hasSpecificApprover = guildMembers.some(member => member.user.id === specificApproverId);
            console.log(`Specific approver ${specificApproverId} found in guild: ${hasSpecificApprover}`);
            if (hasSpecificApprover) {
                try {
                    const userDm = await this.discordRest.post(v10_1.Routes.userChannels(), {
                        body: { recipient_id: specificApproverId },
                        headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
                    });
                    console.log(`Created DM channel for user ${specificApproverId}: ${userDm.id}`);
                    await (0, rxjs_1.lastValueFrom)(this.httpService.post(`https://discord.com/api/channels/${userDm.id}/messages`, message, {
                        headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
                    }));
                    console.log(`Successfully sent DM to user ${specificApproverId}`);
                }
                catch (dmError) {
                    console.error(`Failed to send DM to user ${specificApproverId}:`, dmError.message);
                    if (dmError.message.includes('Cannot send messages to this user')) {
                        console.error('User has disabled DMs or blocked the bot.');
                    }
                }
            }
            else {
                console.error(`User ${specificApproverId} not found in guild ${guildId}`);
            }
            for (const approver of approvers) {
                try {
                    const userDm = await this.discordRest.post(v10_1.Routes.userChannels(), {
                        body: { recipient_id: approver.user.id },
                        headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
                    });
                    console.log(`Created DM channel for user ${approver.user.id}: ${userDm.id}`);
                    await (0, rxjs_1.lastValueFrom)(this.httpService.post(`https://discord.com/api/channels/${userDm.id}/messages`, message, {
                        headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
                    }));
                    console.log(`Successfully sent DM to user ${approver.user.id}`);
                }
                catch (dmError) {
                    console.error(`Failed to send DM to user ${approver.user.id}:`, dmError.message);
                    if (dmError.message.includes('Cannot send messages to this user')) {
                        console.error('User has disabled DMs or blocked the bot.');
                    }
                }
            }
        }
        catch (error) {
            console.error('Error sending Discord notification to approvers:', error);
            if (error.message.includes('Missing Access')) {
                console.error('Bot is missing GuildMembers Intent. Please enable it in Discord Developer Portal.');
            }
        }
        return savedLeave;
    }
    async getLeaveById(leaveId) {
        const leave = await this.leaveRepository.findOne({ where: { id: leaveId } });
        if (!leave) {
            throw new common_1.NotFoundException(`Leave with ID ${leaveId} not found`);
        }
        return leave;
    }
    async updateLeaveStatus(leaveId, status) {
        const leave = await this.getLeaveById(leaveId);
        leave.status = status;
        const updatedLeave = await this.leaveRepository.save(leave);
        if (leave.discordChannelId) {
            const typeMap = {
                annual: 'ลาพักร้อน',
                sick: 'ลาป่วย',
                personal: 'ลากิจ',
            };
            const colorMap = {
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
                    const discordUser = await this.discordRest.get(v10_1.Routes.user(leave.discordId));
                    authorName = discordUser.global_name || discordUser.username || 'ไม่ระบุชื่อ';
                    if (discordUser.avatar) {
                        authorIcon = `https://cdn.discordapp.com/avatars/${leave.discordId}/${discordUser.avatar}.png?size=64`;
                    }
                }
                catch (error) {
                    console.error('Error fetching Discord user for status update:', error);
                }
            }
            const formatDateForDisplay = (dateStr) => {
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
                await (0, rxjs_1.lastValueFrom)(this.httpService.post(`https://discord.com/api/channels/${statusChannelId}/messages`, message, {
                    headers: { Authorization: `Bot ${this.configService.get('DISCORD_BOT_TOKEN')}` },
                }));
            }
            catch (error) {
                console.error('Error sending status update to channel:', error);
            }
        }
        return updatedLeave;
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map