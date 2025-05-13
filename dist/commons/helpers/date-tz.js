"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTz = void 0;
const moment = require("moment-timezone");
class DateTz {
    static getTimezone() {
        return 'Asia/Bangkok';
    }
    static getDateNow(format = '', initialDateTime = undefined) {
        const dateNow = initialDateTime || Date.now();
        return moment.tz(dateNow, DateTz.getTimezone()).format(format);
    }
}
exports.DateTz = DateTz;
//# sourceMappingURL=date-tz.js.map