import { z } from 'zod';
export declare const CredentialsSchema: z.ZodObject<{
    roles_id: z.ZodNumber;
    applications: z.ZodArray<z.ZodObject<{
        client_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        client_id?: string;
    }, {
        client_id?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    applications?: {
        client_id?: string;
    }[];
    roles_id?: number;
}, {
    applications?: {
        client_id?: string;
    }[];
    roles_id?: number;
}>;
declare const IntoApplicationDto_base: import("nestjs-zod").ZodDto<{
    applications?: {
        client_id?: string;
    }[];
    roles_id?: number;
}, z.ZodObjectDef<{
    roles_id: z.ZodNumber;
    applications: z.ZodArray<z.ZodObject<{
        client_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        client_id?: string;
    }, {
        client_id?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny>, {
    applications?: {
        client_id?: string;
    }[];
    roles_id?: number;
}>;
export declare class IntoApplicationDto extends IntoApplicationDto_base {
}
export {};
