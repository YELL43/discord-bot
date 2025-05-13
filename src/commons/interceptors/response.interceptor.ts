import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { DateTz } from '../helpers/date-tz';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: any) => {
        console.log('Handling error locally and rethrowing it...', err);

        let codeError = 30000;
        let metaOptions = {};
        if (err?.status) {
          codeError = Number(err?.status) * 100;

          if (Number(err?.status) === HttpStatus.UNAUTHORIZED) {
            metaOptions = {
                response_force_logout: true,
            };
          }
        }


        let data = {};
        const zod = this.setupZodValidateMessage(err);
        if (zod) {
          data = zod;
        }

        return of({
          meta: {
            response_code: codeError,
            response_desc: err?.message ?? 'Server error interpreted',
            response_datetime: DateTz.getDateNow(),
            ...metaOptions
          },
          ...data,
        });
      }),
      map((result) => {
        if (result?.meta?.response_code) {
          return result;
        }

        let data = {};
        if (result) {
          data = {
            data: result,
          };
        }

        return {
          meta: {
            response_code: 20000,
            response_desc: 'success',
            response_datetime: DateTz.getDateNow(),
          },
          ...data,
        };
      }),
    );
  }

  private setupZodValidateMessage(err: any) {
    let objectErrors = null;
    if (err?.response?.errors) {
      if (Array.isArray(err?.response?.errors)) {
        const validate = [];
        for (const error of err?.response?.errors) {
          validate.push(`${error?.path?.join('.')} ${error?.message}`);
        }

        if (validate?.length > 0) {
          objectErrors = {
            validate: validate,
          };
        }
      }
    }

    return objectErrors;
  }
}
