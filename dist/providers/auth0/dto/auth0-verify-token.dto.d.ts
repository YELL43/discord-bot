import { z } from 'zod';
declare const Auth0VerifyTokenDto_base: import("nestjs-zod").ZodDto<{
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
}, z.ZodObjectDef<{
    name: z.ZodString;
    email: z.ZodString;
    picture: z.ZodString;
    sub: z.ZodString;
}, "strip", z.ZodTypeAny>, {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
}>;
export declare class Auth0VerifyTokenDto extends Auth0VerifyTokenDto_base {
}
export {};
