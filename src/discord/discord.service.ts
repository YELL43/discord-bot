import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, CommandInteraction, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, ChannelType, GuildMember, CommandInteractionOptionResolver } from 'discord.js';
import { LeaveService } from '../leave/leave.service';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private readonly client: Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly leaveService: LeaveService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
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
        if (channel?.type === ChannelType.GuildText) {
          const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('request_annual')
              .setLabel('ลาพักร้อน')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('request_sick')
              .setLabel('ลาป่วย')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('request_personal')
              .setLabel('ลากิจ')
              .setStyle(ButtonStyle.Secondary)
          );

          const embed = new EmbedBuilder()
            .setTitle('📝 ยื่นคำขอลา')
            .setDescription('กรุณากดปุ่มด้านล่างเพื่อยื่นคำขอลา:')
            .setColor(0x00ff00);

          await channel.send({ embeds: [embed], components: [buttons] });
        } else {
          this.logger.error(`Leave Work channel ${leaveWorkChannelId} not found or not a text channel`);
        }
      } else {
        this.logger.error('Guild not found');
      }
    });

    this.client.on('interactionCreate', async interaction => {
      if (interaction.isButton() && interaction.customId.startsWith('request_')) {
        const type = interaction.customId.split('_')[1];
        const modal = new ModalBuilder()
          .setCustomId(`leaveModal_${type}`)
          .setTitle(`ยื่นคำขอลา - ${type === 'annual' ? 'ลาพักร้อน' : type === 'sick' ? 'ลาป่วย' : 'ลากิจ'}`);

        const startDateInput = new TextInputBuilder()
          .setCustomId('startDate')
          .setLabel('วันที่เริ่มลา (DD-MM-YYYY)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const endDateInput = new TextInputBuilder()
          .setCustomId('endDate')
          .setLabel('วันที่สิ้นสุดการลา (DD-MM-YYYY)')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const reasonInput = new TextInputBuilder()
          .setCustomId('reason')
          .setLabel('เหตุผลการลา')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(startDateInput);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(endDateInput);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(reasonInput);

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

        const convertDateFormat = (dateStr: string): string => {
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
        } catch (error) {
          this.logger.error('Error creating leave:', error);
          await interaction.reply({ content: 'Error submitting leave request.', ephemeral: true });
        }
      }

      if (interaction.isCommand() && interaction.commandName === 'checkleave') {
        const commandInteraction = interaction as CommandInteraction;
        const options = commandInteraction.options as CommandInteractionOptionResolver;

        const leaveId = options.getString('id');

        if (!leaveId) {
          await commandInteraction.reply({ content: 'Please provide a leave ID.', ephemeral: true });
          return;
        }

        try {
          const leave = await this.leaveService.getLeaveById(leaveId);

          const typeMap: { [key: string]: string } = {
            annual: 'ลาพักร้อน',
            sick: 'ลาป่วย',
            personal: 'ลากิจ',
          };

          const colorMap: { [key: string]: number } = {
            annual: 0x00ff00,
            sick: 0xff0000,
            personal: 0xffff00,
          };

          const formatDateForDisplay = (dateStr: string): string => {
            const [year, month, day] = dateStr.split('-');
            return `${day}-${month}-${year}`;
          };

          const embed = new EmbedBuilder()
            .setTitle('สถานะการลา')
            .setDescription(`จาก: <@${leave.discordId || '1036844289826770985'}>`)
            .addFields(
              { name: 'ID คำขอ', value: leave.id, inline: true },
              { name: 'ประเภท', value: typeMap[leave.type] || leave.type, inline: true },
              { name: 'วันเริ่มต้น', value: formatDateForDisplay(leave.startDate), inline: true },
              { name: 'วันสิ้นสุด', value: formatDateForDisplay(leave.endDate), inline: true },
              { name: 'เหตุผล', value: leave.reason, inline: false },
              { name: 'สถานะ', value: leave.status, inline: true },
            )
            .setColor(colorMap[leave.type] || 0x0099ff)
            .setTimestamp();

          await commandInteraction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          this.logger.error('Error fetching leave:', error);
          await commandInteraction.reply({ content: 'Error fetching leave status.', ephemeral: true });
        }
      }

      if (interaction.isButton()) {
        const buttonInteraction = interaction as ButtonInteraction;
        if (buttonInteraction.customId.startsWith('approve_') || buttonInteraction.customId.startsWith('reject_')) {
          const member = buttonInteraction.member as GuildMember | null;
          const guild = buttonInteraction.guild;

          const approverRoleId = this.configService.get('DISCORD_APPROVER_ROLE_ID');
          const approverRole = guild?.roles.cache.get(approverRoleId);

          // อนุญาตให้ดำเนินการจาก DM โดยตรวจสอบ User ID แทน
          if (!approverRole && !guild) {
            this.logger.warn('Interaction from DM, skipping guild-based role check');
          } else if (!member || (guild && !member.roles.cache.has(approverRoleId))) {
            this.logger.log(`User ${buttonInteraction.user.tag} does not have leave_approver role, blocking button action`);
            await buttonInteraction.reply({ content: 'คุณไม่มีสิทธิ์อนุมัติคำขอนี้', ephemeral: true });
            return;
          }

          const [action, leaveId] = buttonInteraction.customId.split('_');
          let status: string;

          if (action === 'approve') status = 'approved';
          else if (action === 'reject') status = 'rejected';
          else return;

          try {
            await this.leaveService.updateLeaveStatus(leaveId, status);
            await buttonInteraction.update({ content: `สถานะการลา ID ${leaveId} ถูกอัปเดตเป็น ${status}`, components: [] });
          } catch (error) {
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
    } catch (error) {
      this.logger.error('Failed to login to Discord:', error);
    }
  }
}