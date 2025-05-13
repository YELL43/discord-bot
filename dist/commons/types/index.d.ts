import { z } from 'zod';
export interface IFileObject {
    type: 'bucket' | string;
    key: string;
    filename: string;
    rename: string;
    mimetype: string;
    size: number;
}
export declare const ZodFileObject: z.ZodObject<{
    type: z.ZodString;
    key: z.ZodString;
    filename: z.ZodString;
    rename: z.ZodString;
    mimetype: z.ZodString;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type?: string;
    key?: string;
    filename?: string;
    rename?: string;
    mimetype?: string;
    size?: number;
}, {
    type?: string;
    key?: string;
    filename?: string;
    rename?: string;
    mimetype?: string;
    size?: number;
}>;
export interface IUserAuth0Jwt {
    uuid: string;
    name: string;
    email: string;
    picture: string;
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
}
export interface IQueryParamsDefault {
    page: number;
    limit: number;
}
export type TQueryParams<T extends object = object> = T & IQueryParamsDefault;
export interface IResponseManyAndCount<T> {
    navigate: {
        total: number;
        page: number;
        limit: number;
        pageTotal: number;
    };
    data: T;
}
