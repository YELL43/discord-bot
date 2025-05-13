"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterException = void 0;
const common_1 = require("@nestjs/common");
const date_tz_1 = require("../helpers/date-tz");
let FilterException = class FilterException {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const message = exception.getResponse();
        let metaOptions = {};
        if (status === common_1.HttpStatus.UNAUTHORIZED) {
            metaOptions = {
                response_force_logout: true,
            };
        }
        response.status(200).json({
            meta: {
                response_code: Number(status) * 100,
                response_desc: message['message'] ?? 'Server error interpreted',
                response_datetime: date_tz_1.DateTz.getDateNow(),
                ...metaOptions
            }
        });
    }
};
exports.FilterException = FilterException;
exports.FilterException = FilterException = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], FilterException);
//# sourceMappingURL=fliter.exception.js.map