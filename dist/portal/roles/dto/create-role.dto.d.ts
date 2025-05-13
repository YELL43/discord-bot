import { z } from 'zod';
export declare const CredentialsSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    active?: boolean;
    code?: string;
    name?: string;
    desc?: string;
}, {
    active?: boolean;
    code?: string;
    name?: string;
    desc?: string;
}>;
declare const CreateRoleDto_base: import("nestjs-zod").ZodDto<{
    active?: boolean;
    code?: string;
    name?: string;
    desc?: string;
}, z.ZodObjectDef<{
    code: z.ZodString;
    name: z.ZodString;
    desc: z.ZodOptional<z.ZodString>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny>, {
    active?: boolean;
    code?: string;
    name?: string;
    desc?: string;
}>;
export declare class CreateRoleDto extends CreateRoleDto_base {
}
export {};
