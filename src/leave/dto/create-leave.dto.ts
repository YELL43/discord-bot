import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CredentialsSchema = z.object({
    type: z.string().nonempty(),
    startDate: z.string().nonempty(),
    endDate: z.string().nonempty(),
    reason: z.string().nonempty(),
    discordId: z.string().nonempty(),
    discordChannelId: z.string().optional(),
});

export class CreateLeaveDto extends createZodDto(CredentialsSchema) { }
