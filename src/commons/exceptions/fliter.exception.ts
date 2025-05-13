import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
import { DateTz } from '../helpers/date-tz';
  
  @Catch(HttpException)
  export class FilterException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const status = exception.getStatus();
      const message = exception.getResponse();

      let metaOptions = {};
      if (status === HttpStatus.UNAUTHORIZED) {
        metaOptions = {
            response_force_logout: true,
        };
      }
  
      response.status(200).json({
        meta: {
            response_code:  Number(status) * 100,
            response_desc: message['message'] ?? 'Server error interpreted',
            response_datetime: DateTz.getDateNow(),
            ...metaOptions
        }
      });
    }
  }
  