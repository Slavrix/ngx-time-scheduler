import { adapterFactory as baseAdapterFactory } from 'calendar-utils/date-adapters/moment';
import { DateAdapter } from '../date-adapter';

export function adapterFactory(moment): DateAdapter {
  return {
    ...baseAdapterFactory(moment),

    addSeconds(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'seconds').toDate();
    },

    addMinutes(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'minutes').toDate();
    },

    addHours(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'hours').toDate();
    },

    addDays(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'days').toDate();
    },

    addWeeks(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'weeks').toDate();
    },

    addMonths(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'months').toDate();
    },

    addYears(date: Date | number, amount: number): Date {
      return moment(date).add(amount, 'years').toDate();
    },

    subSeconds(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'seconds').toDate();
    },

    subMinutes(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'minutes').toDate();
    },

    subHours(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'hours').toDate();
    },

    subDays(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'days').toDate();
    },

    subWeeks(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'weeks').toDate();
    },

    subMonths(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'months').toDate();
    },

    subYears(date: Date | number, amount: number): Date {
      return moment(date).subtract(amount, 'years').toDate();
    },

    getISOWeek(date: Date | number): number {
      return moment(date).isoWeek();
    },

    setDate(date: Date | number, dayOfMonth: number): Date {
      return moment(date).date(dayOfMonth).toDate();
    },

    setMonth(date: Date | number, month: number): Date {
      return moment(date).month(month).toDate();
    },

    setYear(date: Date | number, year: number): Date {
      return moment(date).year(year).toDate();
    },

    getDate(date: Date | number): number {
      return moment(date).date();
    },

    getYear(date: Date | number): number {
      return moment(date).year();
    },

    getMonth(date: Date | number): number {
      return moment(date).month();
    },

    getWeek(date: Date | number): number {
      return moment(date).week();
    },

    getDay(date: Date | number): number {
      return moment(date).day();
    },

    getHours(date: Date | number): number {
      return moment(date).hours();
    },

    getMinutes(date: Date | number): number {
      return moment(date).minutes();
    },

    getSeconds(date: Date | number): number {
      return moment(date).seconds();
    },

    max(dates: (Date | number)[]): Date {
      return moment.max(moment(dates[0]), moment(dates[1]));
    },

    min(dates: (Date | number)[]): Date {
      return moment.min(moment(dates[0]), moment(dates[1]));
    },

    format(date: Date | Number, format): string {
      return moment(date).format(format);
    },

    isBefore(date1: Date | Number, date2: Date | Number): boolean {
      return moment(date1).isBefore(date2);
    },

    isAfter(date1: Date | Number, date2: Date | Number): boolean {
      return moment(date1).isAfter(date2);
    },

    isSameDay(date1: Date | Number, date2: Date | Number): boolean {
      return moment(date1).isSame(date2, 'day');
    }
  };
}
