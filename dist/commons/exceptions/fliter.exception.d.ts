import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class FilterException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
