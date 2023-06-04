import Options from './Options';
export declare class CannotParseDateException {
}
export default class DateConverter_ {
    private static readonly escapeChar_;
    static formatDate_(date: Date | null, options: Options, format?: string | null): string | null;
    static parseDate_(text: string, options: Options): Date | null;
    static isValidChar_(textChar: string, options: Options): boolean;
    private static getFormatter_;
    private static formatDay_;
    private static formatDayWithLeadingZero_;
    private static formatDayOfWeekTextual_;
    private static formatDayOfWeekTextualFull_;
    private static formatMonth_;
    private static formatMonthWithLeadingZero_;
    private static formatMonthTextual_;
    private static formatMonthTextualShort_;
    private static formatYear_;
    private static formatYearTwoDigits_;
    private static getParser_;
    private static parseDay_;
    private static parseDayOfWeekTextual_;
    private static parseDayOfWeekTextualFull_;
    private static parseDayOfWeekByTranslator_;
    private static parseMonth_;
    private static parseMonthTextual_;
    private static parseMonthTextualShort_;
    private static parseMonthByTranslator_;
    private static parseYear_;
    private static parseYearTwoDigits_;
    private static getValidPhrases_;
}
