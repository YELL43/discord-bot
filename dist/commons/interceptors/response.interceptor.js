"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const date_tz_1 = require("../helpers/date-tz");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.catchError)((err) => {
            console.log('Handling error locally and rethrowing it...', err);
            let codeError = 30000;
            let metaOptions = {};
            if (err?.status) {
                codeError = Number(err?.status) * 100;
                if (Number(err?.status) === common_1.HttpStatus.UNAUTHORIZED) {
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
            return (0, rxjs_1.of)({
                meta: {
                    response_code: codeError,
                    response_desc: err?.message ?? 'Server error interpreted',
                    response_datetime: date_tz_1.DateTz.getDateNow(),
                    ...metaOptions
                },
                ...data,
            });
        }), (0, rxjs_1.map)((result) => {
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
                    response_datetime: date_tz_1.DateTz.getDateNow(),
                },
                ...data,
            };
        }));
    }
    setupZodValidateMessage(err) {
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
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map