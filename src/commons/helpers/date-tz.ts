import * as moment from 'moment-timezone';

export class DateTz {
  public static getTimezone() {
    return 'Asia/Bangkok';
  }

  public static getDateNow(
    format: string | '' = '',
    initialDateTime: Date = undefined,
  ) {
    const dateNow = initialDateTime || Date.now();
    return moment.tz(dateNow, DateTz.getTimezone()).format(format);
  }
}
