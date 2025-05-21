declare module 'moment' {
  import { Moment } from 'moment';
  
  function moment(date?: any): Moment;
  namespace moment {
    function utc(date?: any): Moment;
    function unix(timestamp: number): Moment;
    function duration(milliseconds: number): any;
    function duration(time: number, unit: string): any;
    function isMoment(obj: any): boolean;
    function locale(locale: string): string;
    function locale(locale: string[]): string;
    
    class Moment {
      format(format?: string): string;
      fromNow(): string;
      toDate(): Date;
      toISOString(): string;
      unix(): number;
      utc(): Moment;
      local(): Moment;
      isValid(): boolean;
      add(amount: number, unit: string): Moment;
      subtract(amount: number, unit: string): Moment;
      isBefore(date: Moment | Date | string): boolean;
      isSame(date: Moment | Date | string, granularity?: string): boolean;
      isAfter(date: Moment | Date | string): boolean;
      diff(date: Moment | Date | string, unit?: string, asFloat?: boolean): number;
      startOf(unit: string): Moment;
      endOf(unit: string): Moment;
    }
  }
  
  export = moment;
} 