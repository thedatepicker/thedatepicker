import Datepicker from './Datepicker';
import Day from './Day';
import Options from './Options';
import { DayOfWeek } from './Helper';
import { YearCellData_ } from './Template';
export declare enum MoveDirection_ {
    Left = 1,
    Up = 2,
    Right = 3,
    Down = 4
}
declare class YearSelectionState {
    readonly cellsCount: number;
    readonly lowestYear: number;
    readonly maxPage: number;
    private page;
    readonly initialPage: number;
    highlightedYear: number | null;
    isHighlightedYearFocused: boolean;
    constructor(cellsCount: number, lowestYear: number, maxPage: number, page: number);
    getPage(): number;
    canShiftPage(shift: number): boolean;
    shiftPage(shift: number): boolean;
    getFirstYear(): number;
    getLastYear(): number;
    highlightYear(year: number, doFocus?: boolean): boolean;
    cancelHighlight(): boolean;
}
export default class ViewModel_ {
    private readonly options_;
    private readonly datepicker_;
    selectedDate_: Date | null;
    yearSelectionState_: YearSelectionState | null;
    isYearSelectionToggleButtonFocused_: boolean;
    private tableOfYearsSettings_;
    private readonly template_;
    private initialMonth_;
    private currentMonth_;
    private outsideDates_;
    private highlightedDay_;
    private isHighlightedDayFocused_;
    private active_;
    constructor(options_: Options, datepicker_: Datepicker);
    render_(): void;
    setActive_(event: Event | null, value: boolean): boolean;
    isActive_(): boolean;
    close_(event: Event): boolean;
    getCurrentMonth_(): Date;
    canGoDirection_(isForward: boolean): boolean;
    canGoToMonth_(month: Date): boolean;
    goDirection_(event: Event, isForward: boolean): boolean;
    goToMonth_(event: Event | null, month: Date, doCancelHighlight?: boolean): boolean;
    reset_(event: Event | null): boolean;
    selectDay_(event: Event | null, date: Day | Date | null, doUpdateMonth?: boolean, doHighlight?: boolean, canToggle?: boolean): boolean;
    canSetYearSelectionActive_(value: boolean): boolean;
    setYearSelectionActive_(value: boolean): boolean;
    selectNearestDate_(event: Event | null, date: Date): boolean;
    selectPossibleDate_(): boolean;
    selectInitialDate_(event: Event | null): boolean;
    highlightDay_(event: Event, day: Day, doUpdateMonth?: boolean, doFocus?: boolean): boolean;
    highlightFirstAvailableDay_(event: Event): boolean;
    highlightSiblingDay_(event: Event, day: Day, direction: MoveDirection_): boolean;
    cancelSelection_(event: Event | null, force?: boolean): boolean;
    cancelDayHighlight_(event: Event | null): boolean;
    highlightYear_(year: number, doFocus?: boolean): boolean;
    highlightSiblingYear_(year: number, direction: MoveDirection_): boolean;
    cancelYearHighlight_(): boolean;
    getWeekDays_(): DayOfWeek[];
    getWeeks_(): Day[][];
    getYearsRows_(): YearCellData_[][];
    private createYearSelectionState_;
    triggerKeyPress_(event: KeyboardEvent): void;
    createDay_(date: Date): Day;
    private triggerOnBeforeSelect_;
    private triggerOnSelect_;
    private triggerOnBeforeOpen_;
    private triggerOnOpen_;
    private triggerOnBeforeClose_;
    private triggerOnClose_;
    private triggerOnBeforeMonthChange_;
    private triggerOnMonthChange_;
    private triggerOnBeforeFocus_;
    private triggerOnFocus_;
    private setCurrentMonth_;
    private getOutsideDates_;
    private getInitialMonth_;
    private translateKeyCodeToMoveDirection_;
}
export {};
