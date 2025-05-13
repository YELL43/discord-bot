declare const UpdateRoleDto_base: import("nestjs-zod").ZodDto<{
    active?: boolean;
    code?: string;
    name?: string;
    desc?: string;
}, import("zod").ZodObjectDef<{
    code: import("zod").ZodOptional<import("zod").ZodString>;
    name: import("zod").ZodOptional<import("zod").ZodString>;
    desc: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodString>>;
    active: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>>;
}, "strip", import("zod").ZodTypeAny>, {
    active?: boolean;
    code?: string;
    name?: string;
    desc?: string;
}>;
export declare class UpdateRoleDto extends UpdateRoleDto_base {
}
export {};
