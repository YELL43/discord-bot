import { z } from 'zod';
declare const CreateLeaveDto_base: import("nestjs-zod").ZodDto<{
    type?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
    discordId?: string;
    discordChannelId?: string;
}, z.ZodObjectDef<{
    type: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    reason: z.ZodString;
    discordId: z.ZodString;
    discordChannelId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny>, {
    type?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
    discordId?: string;
    discordChannelId?: string;
}>;
export declare class CreateLeaveDto extends CreateLeaveDto_base {
}
export {};
