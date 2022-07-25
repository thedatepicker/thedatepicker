export declare type CreateDay = (date: Date) => Day;
export declare type FormatDate = (date: Date) => string;
export default class Day {
    readonly dayNumber: number;
    readonly month: number;
    readonly year: number;
    readonly dayOfWeek: number;
    readonly isWeekend: boolean;
    isToday: boolean;
    isPast: boolean;
    isAvailable: boolean;
    isInValidity: boolean;
    isVisible: boolean;
    isInCurrentMonth: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    isFocused: boolean;
    private readonly createDay_;
    private readonly formatDate_;
    constructor(date: Date, createDay: CreateDay, formatDate: FormatDate);
    getDate(): Date;
    getFormatted(): string;
    getInputFormatted(): string;
    isEqualToDate(date: Date): boolean;
    isEqualToDay(day: Day): boolean;
    getSibling(shift?: number): Day;
}
