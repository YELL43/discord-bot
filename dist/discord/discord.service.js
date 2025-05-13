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
var DiscordService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const discord_js_1 = require("discord.js");
const leave_service_1 = require("../leave/leave.service");
let DiscordService = DiscordService_1 = class DiscordService {
    constructor(configService, leaveService) {
        this.configService = configService;
        this.leaveService = leaveService;
        this.logger = new common_1.Logger(DiscordService_1.name);
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.DirectMessages,
            ],
        });
    }
    async onModuleInit() {
        this.client.once('ready', async () => {
            this.logger.log(`Logged in as ${this.client.user?.tag}`);
            const commands = [
                {
                    name: 'checkleave',
                    description: 'Check the status of a leave request',
                    options: [
                        {
                            name: 'id',
                            description: 'The leave request ID',
                            type: 3,
                            required: true,
                        },
                    ],
                },
            ];
            await this.client.application?.commands.set(commands, this.configService.get('DISCORD_GUILD_ID'));
            const leaveWorkChannelId = this.configService.get('DISCORD_LEAVE_WORK_CHANNEL_ID');
            this.logger.debug(`Leave Work Channel ID: ${leaveWorkChannelId}`);
            const guild = this.client.guilds.cache.get(this.configService.get('DISCORD_GUILD_ID'));
            if (guild) {
                const channel = await guild.channels.fetch(leaveWorkChannelId);
                if (channel?.type === discord_js_1.ChannelType.GuildText) {
                    const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId('request_annual')
                        .setLabel('ลาพักร้อน')
                        .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                        .setCustomId('request_sick')
                        .setLabel('ลาป่วย')
                        .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
                        .setCustomId('request_personal')
                        .setLabel('ลากิจ')
                        .setStyle(discord_js_1.ButtonStyle.Secondary));
                    const embed = new discord_js_1.EmbedBuilder()
                        .setTitle('📝 ยื่นคำขอลา')
                        .setDescription('กรุณากดปุ่มด้านล่างเพื่อยื่นคำขอลา:')
                        .setColor(0x00ff00);
                    await channel.send({ embeds: [embed], components: [buttons] });
                }
                else {
                    this.logger.error(`Leave Work channel ${leaveWorkChannelId} not found or not a text channel`);
                }
            }
            else {
                this.logger.error('Guild not found');
            }
        });
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isButton() && interaction.customId.startsWith('request_')) {
                const type = interaction.customId.split('_')[1];
                const modal = new discord_js_1.ModalBuilder()
                    .setCustomId(`leaveModal_${type}`)
                    .setTitle(`ยื่นคำขอลา - ${type === 'annual' ? 'ลาพักร้อน' : type === 'sick' ? 'ลาป่วย' : 'ลากิจ'}`);
                const startDateInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('startDate')
                    .setLabel('วันที่เริ่มลา (DD-MM-YYYY)')
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setRequired(true);
                const endDateInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('endDate')
                    .setLabel('วันที่สิ้นสุดการลา (DD-MM-YYYY)')
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setRequired(true);
                const reasonInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('เหตุผลการลา')
                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                    .setRequired(true);
                const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(startDateInput);
                const secondActionRow = new discord_js_1.ActionRowBuilder().addComponents(endDateInput);
                const thirdActionRow = new discord_js_1.ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
                await interaction.showModal(modal);
            }
            if (interaction.isModalSubmit() && interaction.customId.startsWith('leaveModal_')) {
                const type = interaction.customId.split('_')[1];
                const startDateInput = interaction.fields.getTextInputValue('startDate');
                const endDateInput = interaction.fields.getTextInputValue('endDate');
                const reason = interaction.fields.getTextInputValue('reason');
                const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
                if (!dateRegex.test(startDateInput) || !dateRegex.test(endDateInput)) {
                    await interaction.reply({ content: 'กรุณากรอกวันที่ในรูปแบบ DD-MM-YYYY (เช่น 01-05-2025)', ephemeral: true });
                    return;
                }
                const convertDateFormat = (dateStr) => {
                    const [day, month, year] = dateStr.split('-');
                    return `${year}-${month}-${day}`;
                };
                const startDate = convertDateFormat(startDateInput);
                const endDate = convertDateFormat(endDateInput);
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(endDate);
                if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
                    await interaction.reply({ content: 'วันที่ไม่ถูกต้อง กรุณาตรวจสอบวันที่ที่ระบุ', ephemeral: true });
                    return;
                }
                if (endDateObj < startDateObj) {
                    await interaction.reply({ content: 'วันที่สิ้นสุดต้องไม่มาก่อนวันที่เริ่มต้น', ephemeral: true });
                    return;
                }
                const createLeaveDto = {
                    type,
                    startDate,
                    endDate,
                    reason,
                    discordId: interaction.user.id,
                    discordChannelId: this.configService.get('DISCORD_LEAVE_STATUS_CHANNEL_ID'),
                };
                try {
                    const leave = await this.leaveService.create(createLeaveDto);
                    await interaction.reply({ content: `คำขอลา ID ${leave.id} ถูกส่งเรียบร้อยแล้ว`, ephemeral: true });
                }
                catch (error) {
                    this.logger.error('Error creating leave:', error);
                    await interaction.reply({ content: 'Error submitting leave request.', ephemeral: true });
                }
            }
            if (interaction.isCommand() && interaction.commandName === 'checkleave') {
                const commandInteraction = interaction;
                const options = commandInteraction.options;
                const leaveId = options.getString('id');
                if (!leaveId) {
                    await commandInteraction.reply({ content: 'Please provide a leave ID.', ephemeral: true });
                    return;
                }
                try {
                    const leave = await this.leaveService.getLeaveById(leaveId);
                    const typeMap = {
                        annual: 'ลาพักร้อน',
                        sick: 'ลาป่วย',
                        personal: 'ลากิจ',
                    };
                    const colorMap = {
                        annual: 0x00ff00,
                        sick: 0xff0000,
                        personal: 0xffff00,
                    };
                    const formatDateForDisplay = (dateStr) => {
                        const [year, month, day] = dateStr.split('-');
                        return `${day}-${month}-${year}`;
                    };
                    const embed = new discord_js_1.EmbedBuilder()
                        .setTitle('สถานะการลา')
                        .setDescription(`จาก: <@${leave.discordId || '1036844289826770985'}>`)
                        .addFields({ name: 'ID คำขอ', value: leave.id, inline: true }, { name: 'ประเภท', value: typeMap[leave.type] || leave.type, inline: true }, { name: 'วันเริ่มต้น', value: formatDateForDisplay(leave.startDate), inline: true }, { name: 'วันสิ้นสุด', value: formatDateForDisplay(leave.endDate), inline: true }, { name: 'เหตุผล', value: leave.reason, inline: false }, { name: 'สถานะ', value: leave.status, inline: true })
                        .setColor(colorMap[leave.type] || 0x0099ff)
                        .setTimestamp();
                    await commandInteraction.reply({ embeds: [embed], ephemeral: true });
                }
                catch (error) {
                    this.logger.error('Error fetching leave:', error);
                    await commandInteraction.reply({ content: 'Error fetching leave status.', ephemeral: true });
                }
            }
            if (interaction.isButton()) {
                const buttonInteraction = interaction;
                if (buttonInteraction.customId.startsWith('approve_') || buttonInteraction.customId.startsWith('reject_')) {
                    const member = buttonInteraction.member;
                    const guild = buttonInteraction.guild;
                    const approverRoleId = this.configService.get('DISCORD_APPROVER_ROLE_ID');
                    const approverRole = guild?.roles.cache.get(approverRoleId);
                    if (!approverRole && !guild) {
                        this.logger.warn('Interaction from DM, skipping guild-based role check');
                    }
                    else if (!member || (guild && !member.roles.cache.has(approverRoleId))) {
                        this.logger.log(`User ${buttonInteraction.user.tag} does not have leave_approver role, blocking button action`);
                        await buttonInteraction.reply({ content: 'คุณไม่มีสิทธิ์อนุมัติคำขอนี้', ephemeral: true });
                        return;
                    }
                    const [action, leaveId] = buttonInteraction.customId.split('_');
                    let status;
                    if (action === 'approve')
                        status = 'approved';
                    else if (action === 'reject')
                        status = 'rejected';
                    else
                        return;
                    try {
                        await this.leaveService.updateLeaveStatus(leaveId, status);
                        await buttonInteraction.update({ content: `สถานะการลา ID ${leaveId} ถูกอัปเดตเป็น ${status}`, components: [] });
                    }
                    catch (error) {
                        this.logger.error('Error updating leave status:', error);
                        await buttonInteraction.update({ content: 'Error updating leave status.', components: [] });
                    }
                }
            }
        });
        this.client.on('error', (error) => {
            this.logger.error('Discord Client Error:', error);
        });
        try {
            await this.client.login(this.configService.get('DISCORD_BOT_TOKEN'));
        }
        catch (error) {
            this.logger.error('Failed to login to Discord:', error);
        }
    }
};
exports.DiscordService = DiscordService;
exports.DiscordService = DiscordService = DiscordService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        leave_service_1.LeaveService])
], DiscordService);
//# sourceMappingURL=discord.service.js.map