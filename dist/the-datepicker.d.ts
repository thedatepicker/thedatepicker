declare namespace TheDatepicker {
    enum ClassNameType {
        Container = 0,
        ContainerOver = 1,
        ContainerLeft = 2,
        ContainerResponsive = 3,
        Main = 4,
        Body = 5,
        BodySwipeable = 6,
        Tables = 7,
        Header = 8,
        HeaderTop = 9,
        HeaderControl = 10,
        HeaderNavigation = 11,
        HeaderState = 12,
        HeaderMonth = 13,
        HeaderYear = 14,
        HeaderMonthYear = 15,
        HeaderYearsToggle = 16,
        Button = 17,
        ButtonContent = 18,
        SelectInput = 19,
        Deselect = 20,
        DeselectButton = 21,
        HeaderTitle = 22,
        HeaderTitleContent = 23,
        Reset = 24,
        Close = 25,
        Go = 26,
        GoNext = 27,
        GoPrevious = 28,
        Table = 29,
        TableRow = 30,
        TableCell = 31,
        TableCellUnavailable = 32,
        TableCellHighlighted = 33,
        TableCellSelected = 34,
        CalendarTable = 35,
        CalendarTableHeader = 36,
        CalendarTableHeaderCell = 37,
        CalendarTableBody = 38,
        YearsTable = 39,
        YearsTableBody = 40,
        WeekDayWeekend = 41,
        Day = 42,
        DayToday = 43,
        DayPast = 44,
        DayWeekend = 45,
        DayUnavailable = 46,
        DayOutside = 47,
        DayHighlighted = 48,
        DaySelected = 49,
        DayButton = 50,
        DayButtonContent = 51,
        YearCellButton = 52,
        YearCellButtonContent = 53,
        Animated = 54,
        AnimateFadeOutLeft = 55,
        AnimateFadeInRight = 56,
        AnimateFadeOutUp = 57,
        AnimateFadeInDown = 58,
        AnimateFadeOutRight = 59,
        AnimateFadeInLeft = 60,
        AnimateFadeOutDown = 61,
        AnimateFadeInUp = 62,
        ContainerDarkMode = 63,
        MainDarkMode = 64
    }
    class ClassNames {
        private classNames_;
        clone(): ClassNames;
        setClassName(type: ClassNameType, className: string | string[] | null): void;
        addClassName(type: ClassNameType, className: string | string[]): void;
        getClassName(type: ClassNameType): string[];
        private checkType_;
        private normalizeClassName_;
    }
}
declare namespace TheDatepicker {
    class CannotParseDateException {
    }
    class DateConverter_ {
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
}
declare namespace TheDatepicker {
    interface HTMLDatepickerInputElement {
        datepicker?: Datepicker;
    }
    interface HTMLDatepickerContainerElement extends HTMLElement {
        datepicker?: Datepicker;
        onfocusin?: (event: FocusEvent) => void;
    }
    type HTMLDatepickerElement = (HTMLDatepickerInputElement & HTMLElement) | HTMLDatepickerContainerElement;
    type ReadyListener = (datepicker: Datepicker, element: HTMLDatepickerElement) => void;
    type ReadyPromiseResolve = (datepicker: Datepicker) => void;
    class Datepicker {
        readonly options: Options;
        input: (HTMLDatepickerInputElement & HTMLElement) | null;
        readonly container: HTMLDatepickerContainerElement;
        private readonly isContainerExternal_;
        private readonly inputClickable_;
        private readonly inputText_;
        private readonly viewModel_;
        private initializationPhase_;
        private inputListenerRemover_;
        private listenerRemovers_;
        private deselectElement_;
        private deselectButton_;
        private static document_;
        private static readyListeners_;
        private static areGlobalListenersInitialized_;
        private static activeViewModel_;
        private static hasClickedViewModel_;
        constructor(input: (HTMLDatepickerInputElement & HTMLElement) | null, container?: HTMLDatepickerContainerElement | null, options?: Options | null);
        render(): void;
        open(event?: Event | null): boolean;
        isOpened(): boolean;
        close(event?: Event | null): boolean;
        reset(event?: Event | null): boolean;
        destroy(): void;
        isDestroyed(): boolean;
        selectDate(date: Date | string | null, doUpdateMonth?: boolean, event?: Event | null): boolean;
        getSelectedDate(): Date | null;
        getSelectedDateFormatted(format?: string | null): string | null;
        getCurrentMonth(): Date;
        goToMonth(month: Date | string, event?: Event | null): boolean;
        parseRawInput(): Date | null;
        getDay(date: Date | string): Day;
        canType_(char: string): boolean;
        readInput_(event?: Event | null): boolean;
        updateInput_(): void;
        static onDatepickerReady(element: HTMLDatepickerElement, callback?: ReadyListener | null): Promise<Datepicker> | null;
        private createContainer_;
        private createDeselectElement_;
        private updateDeselectElement_;
        private preselectFromInput_;
        private initListeners_;
        private removeInitialInputListener_;
        private triggerReady_;
        private triggerReadyListener_;
        private onActivate_;
        private updateContainer_;
        private static setBodyClass_;
        private static activateViewModel_;
    }
    const onDatepickerReady: typeof Datepicker.onDatepickerReady;
}
declare namespace TheDatepicker {
    type CreateDay = (date: Date) => Day;
    type FormatDate = (date: Date, format: string | null) => string;
    class Day {
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
        getInputFormatted(format?: string | null): string;
        isEqualToDate(date: Date): boolean;
        isEqualToDay(day: Day): boolean;
        getSibling(shift?: number): Day;
    }
}
declare namespace TheDatepicker {
    enum DayOfWeek {
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6,
        Sunday = 0
    }
    enum Month {
        January = 0,
        February = 1,
        March = 2,
        April = 3,
        May = 4,
        June = 5,
        July = 6,
        August = 7,
        September = 8,
        October = 9,
        November = 10,
        December = 11
    }
    enum Align {
        Left = 1,
        Right = 2,
        Center = 3
    }
    enum Position {
        BottomRight = 1,
        BottomLeft = 2,
        TopRight = 3,
        TopLeft = 4
    }
    enum KeyCode_ {
        Enter = 13,
        Space = 32,
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,
        Esc = 27
    }
    enum ListenerType_ {
        MouseDown = "mousedown",
        Focus = "focus",
        FocusIn = "focusin",
        Blur = "blur",
        KeyDown = "keydown",
        KeyUp = "keyup",
        KeyPress = "keypress",
        TouchStart = "touchstart",
        TouchMove = "touchmove",
        AnimationEnd = "animationend"
    }
    class Helper_ {
        private static readonly months_;
        private static deprecatedMethods_;
        private static cssAnimationSupport_;
        private static passiveEventListenerSupport_;
        static resetTime_(date: Date | null): Date | null;
        static normalizeDate_(parameterName: string, value: Day | Date | string | null, isNullable: boolean, options: Options): Date | null;
        static isElement_(element: HTMLElement): boolean;
        static isValidDate_(value: any): boolean;
        static inArray_(list: any[], item: any): boolean;
        static addEventListener_(element: Node, listenerType: ListenerType_, listener: (event: Event) => void, isPassive?: boolean): () => void;
        static preventDefault_(event: Event): void;
        static stopPropagation_(event: Event): void;
        static checkString_(parameterName: string, value: string | null, checkNonEmpty?: boolean): string;
        static checkNumber_(parameterName: string, value: number, min?: number | null, max?: number | null): number;
        static checkFunction_<Type extends Function>(parameterName: string, value: Type | null, isNullable?: boolean): Type | null;
        static warnDeprecatedUsage_(deprecatedMethod: string, alternateMethods: string[]): void;
        static addSwipeListener_(element: HTMLElement, listener: (event: TouchEvent, moveDirection: MoveDirection_) => void): void;
        static isCssAnimationSupported_(): boolean;
        static isPassiveEventListenerSupported_(): boolean;
        static isMobile_(): boolean;
    }
}
declare namespace TheDatepicker {
    interface Option {
        value: string;
        label: string;
    }
    class HtmlHelper_ {
        static createDiv_(type: ClassNameType, options: Options): HTMLDivElement;
        static createAnchor_(onClick: (event: Event) => void, options: Options, type?: ClassNameType): HTMLAnchorElement;
        static createSpan_(): HTMLSpanElement;
        static createTable_(header: HTMLTableSectionElement | null, body: HTMLTableSectionElement, type: ClassNameType, options: Options): HTMLTableElement;
        static createTableHeader_(cells: HTMLTableHeaderCellElement[], type: ClassNameType, options: Options): HTMLTableSectionElement;
        static createTableHeaderCell_(type: ClassNameType, options: Options): HTMLTableHeaderCellElement;
        static createTableBody_(rows: HTMLTableRowElement[], type: ClassNameType, options: Options): HTMLTableSectionElement;
        static createTableRow_(cells: HTMLTableCellElement[], options: Options): HTMLTableRowElement;
        static createTableCell_(): HTMLTableCellElement;
        static createSelectInput_(selectOptions: Option[], onChange: (event: Event, value: string) => void, options: Options): HTMLSelectElement;
        static createSelectOption_(value: string, label: string): HTMLOptionElement;
        static addClass_(element: HTMLElement, type: ClassNameType, options: Options): void;
        static appendChild_(element: HTMLElement, child: HTMLElement | null): void;
    }
}
declare namespace TheDatepicker {
    export enum EventType_ {
        BeforeSelect = "beforeSelect",
        Select = "select",
        BeforeOpen = "beforeOpen",
        Open = "open",
        BeforeClose = "beforeClose",
        Close = "close",
        BeforeMonthChange = "beforeMonthChange",
        MonthChange = "monthChange",
        Focus = "focus",
        BeforeFocus = "beforeFocus"
    }
    export class AvailableDateNotFoundException {
    }
    export type SelectListener = (event: Event | null, day: Day | null, previousDay: Day | null) => boolean;
    export type OpenOrCloseListener = (event: Event | null) => boolean;
    export type MonthChangeListener = (event: Event | null, month: Date, previousMonth: Date) => boolean;
    export type FocusListener = (event: Event | null, day: Day | null, previousDay: Day | null) => boolean;
    type ListenerCaller = (listener: (event: Event | null, ...props: any) => boolean) => boolean;
    export type DateAvailabilityResolver = (date: Date) => boolean;
    export type CellContentResolver = (day: Day) => string;
    export type StructureResolverInit = () => HTMLElement;
    export type CellContentStructureResolverUpdate = (element: HTMLElement, day: Day) => void;
    export interface CellContentStructureResolver {
        init: StructureResolverInit;
        update: CellContentStructureResolverUpdate;
    }
    export type CellClassesResolver = (day: Day) => string[];
    export type DayModifier = (day: Day) => void;
    export class Options {
        readonly translator: Translator;
        readonly classNames: ClassNames;
        private hideOnBlur_;
        private hideOnSelect_;
        private minDate_;
        private maxDate_;
        private initialDate_;
        private initialMonth_;
        private initialDatePriority_;
        private firstDayOfWeek_;
        private dateAvailabilityResolvers_;
        private cellContentResolver_;
        private cellContentStructureResolver_;
        private headerStructureResolver_;
        private footerStructureResolver_;
        private cellClassesResolvers_;
        private dayModifiers_;
        private inputFormat_;
        private allowInputAnyChar_;
        private daysOutOfMonthVisible_;
        private fixedRowsCount_;
        private toggleSelection_;
        private allowEmpty_;
        private showDeselectButton_;
        private showResetButton_;
        private monthAsDropdown_;
        private yearAsDropdown_;
        private yearSelectedFromTableOfYears_;
        private tableOfYearsRowsCount_;
        private tableOfYearsAlign_;
        private tableOfYearsOnSwipeDown_;
        private yearsOutOfTableOfYearsVisible_;
        private monthAndYearSeparated_;
        private monthShort_;
        private changeMonthOnSwipe_;
        private slideAnimation_;
        private classesPrefix_;
        private darkMode_;
        private showCloseButton_;
        private closeOnEscPress_;
        private title_;
        private dropdownItemsLimit_;
        private hideDropdownWithOneItem_;
        private goBackHtml_;
        private goForwardHtml_;
        private closeHtml_;
        private resetHtml_;
        private deselectHtml_;
        private position_;
        private positionFixing_;
        private fullScreenOnMobile_;
        private keyboardOnMobile_;
        private includeAria_;
        private today_;
        private listeners_;
        constructor(translator?: Translator | null, classNames?: ClassNames | null);
        clone(): Options;
        setHideOnBlur(value: boolean): void;
        setHideOnSelect(value: boolean): void;
        setMinDate(date: Day | Date | string | null): void;
        setMaxDate(date: Day | Date | string | null): void;
        setInitialMonth(month: Date | string | null): void;
        setInitialDate(value: Day | Date | string | null): void;
        setInitialDatePriority(value: boolean): void;
        setFirstDayOfWeek(dayOfWeek: DayOfWeek): void;
        setDateAvailabilityResolver(resolver: DateAvailabilityResolver | null): void;
        addDateAvailabilityResolver(resolver: DateAvailabilityResolver): void;
        removeDateAvailabilityResolver(resolver?: DateAvailabilityResolver | null): void;
        setCellContentResolver(resolver: CellContentResolver | null): void;
        setCellContentStructureResolver(init: StructureResolverInit | null, update?: CellContentStructureResolverUpdate | null): void;
        setHeaderStructureResolver(resolver: StructureResolverInit | null): void;
        setFooterStructureResolver(resolver: StructureResolverInit | null): void;
        addCellClassesResolver(resolver: CellClassesResolver): void;
        removeCellClassesResolver(resolver?: CellClassesResolver | null): void;
        addDayModifier(modifier: DayModifier): void;
        removeDayModifier(modifier?: DayModifier | null): void;
        setInputFormat(format: string): void;
        setAllowInputAnyChar(value: boolean): void;
        setDaysOutOfMonthVisible(value: boolean): void;
        setFixedRowsCount(value: boolean): void;
        setToggleSelection(value: boolean): void;
        setShowDeselectButton(value: boolean): void;
        setAllowEmpty(value: boolean): void;
        setShowResetButton(value: boolean): void;
        setMonthAsDropdown(value: boolean): void;
        setYearAsDropdown(value: boolean): void;
        setYearSelectedFromTableOfYears(value: boolean): void;
        setTableOfYearsRowsCount(count: number): void;
        setTableOfYearsAlign(align: Align | null): void;
        setTableOfYearsOnSwipeDown(value: boolean): void;
        setYearsOutOfTableOfYearsVisible(value: boolean): void;
        setMonthAndYearSeparated(value: boolean): void;
        setMonthShort(value: boolean): void;
        setChangeMonthOnSwipe(value: boolean): void;
        setAnimateMonthChange(value: boolean): void;
        setSlideAnimation(value: boolean): void;
        setClassesPrefix(prefix: string): void;
        setDarkMode(value: boolean): void;
        setShowCloseButton(value: boolean): void;
        setCloseOnEscPress(value: boolean): void;
        setTitle(title: string | null): void;
        setDropdownItemsLimit(limit: number): void;
        setHideDropdownWithOneItem(value: boolean): void;
        setGoBackHtml(html: string): void;
        setGoForwardHtml(html: string): void;
        setCloseHtml(html: string): void;
        setResetHtml(html: string): void;
        setDeselectHtml(html: string): void;
        setPosition(position: Position): void;
        setPositionFixing(value: boolean): void;
        setFullScreenOnMobile(value: boolean): void;
        setKeyboardOnMobile(value: boolean): void;
        setIncludeAria(value: boolean): void;
        setToday(date: Day | Date | string | null): void;
        onBeforeSelect(listener: SelectListener): void;
        offBeforeSelect(listener?: SelectListener | null): void;
        onSelect(listener: SelectListener): void;
        offSelect(listener?: SelectListener | null): void;
        onBeforeOpen(listener: OpenOrCloseListener): void;
        offBeforeOpen(listener?: OpenOrCloseListener | null): void;
        onOpen(listener: OpenOrCloseListener): void;
        offOpen(listener?: OpenOrCloseListener | null): void;
        onBeforeClose(listener: OpenOrCloseListener): void;
        offBeforeClose(listener?: OpenOrCloseListener | null): void;
        onClose(listener: OpenOrCloseListener): void;
        offClose(listener?: OpenOrCloseListener | null): void;
        onBeforeOpenAndClose(listener: OpenOrCloseListener): void;
        offBeforeOpenAndClose(listener?: OpenOrCloseListener | null): void;
        onOpenAndClose(listener: OpenOrCloseListener): void;
        offOpenAndClose(listener?: OpenOrCloseListener | null): void;
        onBeforeMonthChange(listener: MonthChangeListener): void;
        offBeforeMonthChange(listener?: MonthChangeListener | null): void;
        onMonthChange(listener: MonthChangeListener): void;
        offMonthChange(listener?: MonthChangeListener | null): void;
        onBeforeFocus(listener: FocusListener): void;
        offBeforeFocus(listener?: FocusListener | null): void;
        onFocus(listener: FocusListener): void;
        offFocus(listener?: FocusListener | null): void;
        getInitialMonth(): Date;
        isMonthInValidity(month: Date): boolean;
        correctMonth(month: Date): Date;
        getInitialDate(): Date | null;
        findPossibleAvailableDate(date: Date | null): Date | null;
        findNearestAvailableDate(date: Date): Date;
        isDateInValidity(date: Date): boolean;
        private correctDate_;
        getFirstDayOfWeek(): DayOfWeek;
        areDaysOutOfMonthVisible(): boolean;
        hasFixedRowsCount(): boolean;
        hasToggleSelection(): boolean;
        isAllowedEmpty(): boolean;
        isDeselectButtonShown(): boolean;
        isResetButtonShown(): boolean;
        isMonthAsDropdown(): boolean;
        isYearAsDropdown(): boolean;
        isYearSelectedFromTableOfYears(): boolean;
        getTableOfYearsRowsCount(): number;
        getTableOfYearsColumnsCount(): number;
        getTableOfYearsAlign(): Align | null;
        isTableOfYearsOnSwipeDownEnabled(): boolean;
        areYearsOutOfTableOfYearsVisible(): boolean;
        isMonthAndYearSeparated(): boolean;
        isMonthShort(): boolean;
        isMonthChangeOnSwipeEnabled(): boolean;
        isMonthChangeAnimated(): boolean;
        isSlideAnimationEnabled(): boolean;
        getClassesPrefix(): string;
        isDarkModeEnabled(): boolean;
        isCloseButtonShown(): boolean;
        isClosedOnEscPress(): boolean;
        getTitle(): string;
        getMinDate(): Date | null;
        getMaxDate(): Date | null;
        getMinDate_(): Date;
        getMaxDate_(): Date;
        getMinMonth(): Date | null;
        getMaxMonth(): Date | null;
        getMinMonth_(): Date;
        getMaxMonth_(): Date;
        isDropdownWithOneItemHidden(): boolean;
        getDropdownItemsLimit(): number;
        isDateAvailable(date: Date): boolean;
        getCellContent(day: Day): string;
        prefixClass_(name: string): string;
        getCellStructure_(): HTMLElement;
        updateCellStructure_(element: HTMLElement, day: Day): void;
        getHeaderStructure_(): HTMLElement | null;
        getFooterStructure_(): HTMLElement | null;
        getCellClasses(day: Day): string[];
        modifyDay(day: Day): void;
        getGoBackHtml(): string;
        getGoForwardHtml(): string;
        getCloseHtml(): string;
        getResetHtml(): string;
        getDeselectHtml(): string;
        isHiddenOnBlur(): boolean;
        isHiddenOnSelect(): boolean;
        getInputFormat(): string;
        isAllowedInputAnyChar(): boolean;
        getPosition(): Position;
        isPositionFixingEnabled(): boolean;
        isFullScreenOnMobile(): boolean;
        isKeyboardOnMobile(): boolean;
        isAriaIncluded(): boolean;
        getToday(): Date;
        getDateAvailabilityResolver(): DateAvailabilityResolver | null;
        getDateAvailabilityResolvers(): DateAvailabilityResolver[];
        getCellContentResolver(): CellContentResolver | null;
        getCellContentStructureResolver(): CellContentStructureResolver | null;
        getHeaderStructureResolver(): StructureResolverInit | null;
        getFooterStructureResolver(): StructureResolverInit | null;
        getCellClassesResolvers(): CellClassesResolver[];
        getDayModifiers(): DayModifier[];
        getBeforeSelectListeners(): SelectListener[];
        getSelectListeners(): SelectListener[];
        getBeforeOpenListeners(): OpenOrCloseListener[];
        getOpenListeners(): OpenOrCloseListener[];
        getBeforeCloseListeners(): OpenOrCloseListener[];
        getCloseListeners(): OpenOrCloseListener[];
        getBeforeOpenAndCloseListeners(): OpenOrCloseListener[];
        getOpenAndCloseListeners(): OpenOrCloseListener[];
        getBeforeMonthChangeListeners(): MonthChangeListener[];
        getMonthChangeListeners(): MonthChangeListener[];
        getBeforeFocusListeners(): FocusListener[];
        getFocusListeners(): FocusListener[];
        private checkConstraints_;
        private calculateMonthCorrection_;
        private calculateDateCorrection_;
        private removeCallback_;
        private onEvent_;
        private offEvent_;
        triggerEvent_(eventType: EventType_, caller: ListenerCaller): boolean;
    }
    export {};
}
declare namespace TheDatepicker {
    interface HTMLDayButtonElement extends HTMLAnchorElement {
        day: Day;
    }
    export class YearCellData_ {
        readonly yearNumber: number;
        isAvailable: boolean;
        isSelected: boolean;
        isHighlighted: boolean;
        isFocused: boolean;
        constructor(yearNumber: number);
    }
    interface HTMLYearButtonElement extends HTMLAnchorElement {
        yearCellData: YearCellData_;
    }
    export class Template_ {
        private readonly options_;
        private readonly container_;
        private readonly hasInput_;
        private mainElement_;
        private bodyElement_;
        private tablesElement_;
        private tableElement_;
        private tableOfYearsElement_;
        private controlElement_;
        private goBackElement_;
        private goForwardElement_;
        private titleElement_;
        private titleContentElement_;
        private resetElement_;
        private resetButton_;
        private closeElement_;
        private closeButton_;
        private monthSelect_;
        private monthElement_;
        private yearActiveElement_;
        private yearTextElement_;
        private monthAndYearSelect_;
        private monthAndYearElement_;
        private weeksElements_;
        private daysElements_;
        private daysButtonsElements_;
        private daysContentsElements_;
        private yearsElements_;
        private yearsButtonsElements_;
        private yearsContentsElements_;
        private onAfterSlide_;
        constructor(options_: Options, container_: HTMLElement, hasInput_: boolean);
        render_(viewModel: ViewModel_): void;
        protected createSkeleton_(viewModel: ViewModel_): HTMLElement;
        protected updateMainElement_(viewModel: ViewModel_): void;
        protected updateTableElements_(viewModel: ViewModel_): void;
        protected createBodyElement_(viewModel: ViewModel_): HTMLElement;
        protected createHeaderElement_(viewModel: ViewModel_): HTMLElement;
        protected updateTopElement_(viewModel: ViewModel_): void;
        protected createTitleElement_(viewModel: ViewModel_): HTMLElement;
        protected updateTitleElement_(viewModel: ViewModel_): void;
        protected createResetElement_(viewModel: ViewModel_): HTMLElement;
        protected updateResetElement_(viewModel: ViewModel_): void;
        protected createCloseElement_(viewModel: ViewModel_): HTMLElement;
        protected updateCloseElement_(viewModel: ViewModel_): void;
        protected createGoElement_(viewModel: ViewModel_, isForward: boolean): HTMLElement;
        protected updateGoElement_(viewModel: ViewModel_, isForward: boolean): void;
        protected createMonthElement_(viewModel: ViewModel_): HTMLElement;
        protected updateMonthElement_(viewModel: ViewModel_): void;
        protected createYearElement_(viewModel: ViewModel_): HTMLElement;
        protected updateYearElement_(viewModel: ViewModel_): void;
        protected createMonthAndYearElement_(viewModel: ViewModel_): HTMLElement;
        protected updateMonthAndYearElement_(viewModel: ViewModel_): void;
        private translateMonthAndYear_;
        private calculateMonthAndYearIndex_;
        private getMonthAndYearByIndex_;
        private getMonthAndYearOptionValue_;
        private parseMonthAndYearOptionValue_;
        private calculateDropdownRange_;
        private calculateDropdownDiff_;
        protected createTableElement_(viewModel: ViewModel_): HTMLElement;
        protected createTableHeaderElement_(viewModel: ViewModel_): HTMLElement;
        protected createTableHeaderCellElement_(viewModel: ViewModel_, dayOfWeek: DayOfWeek): HTMLElement;
        protected createTableBodyElement_(viewModel: ViewModel_): HTMLElement;
        protected updateWeeksElements_(viewModel: ViewModel_): void;
        protected createTableRowElement_(viewModel: ViewModel_): HTMLElement;
        protected updateDayElement_(viewModel: ViewModel_, dayElement: HTMLElement, dayButtonElement: HTMLDayButtonElement, dayContentElement: HTMLElement, day: Day): void;
        protected createTableCellButtonElement_(viewModel: ViewModel_): HTMLDayButtonElement;
        protected createTableCellContentElement_(viewModel: ViewModel_): HTMLElement;
        protected createTableOfYearsElement_(viewModel: ViewModel_): HTMLElement;
        protected createTableOfYearsBodyElement_(viewModel: ViewModel_): HTMLElement;
        protected updateTableOfYearsRowsElements_(viewModel: ViewModel_): void;
        protected updateTableOfYearsCellElement_(viewModel: ViewModel_, yearElement: HTMLElement, yearButtonElement: HTMLYearButtonElement, yearContentElement: HTMLElement, yearCellData: YearCellData_): void;
        protected createTableOfYearsRowElement_(viewModel: ViewModel_): HTMLElement;
        protected createTableOfYearsCellButtonElement_(viewModel: ViewModel_): HTMLYearButtonElement;
        protected createTableOfYearsCellContentElement_(viewModel: ViewModel_): HTMLElement;
        private slideTable_;
        private translateMonth_;
        private updateTitle_;
    }
    export {};
}
declare namespace TheDatepicker {
    enum TitleName {
        GoBack = 0,
        GoForward = 1,
        Close = 2,
        Reset = 3,
        Deselect = 4,
        Month = 5,
        Year = 6,
        GoBackTableOfYears = 7,
        GoForwardTableOfYears = 8
    }
    class Translator {
        dayOfWeekFullTranslations_: string[];
        dayOfWeekTranslations_: string[];
        monthTranslations_: string[];
        monthShortTranslations_: string[];
        private titles_;
        clone(): Translator;
        setDayOfWeekTranslation(dayOfWeek: DayOfWeek, translation: string): void;
        setDayOfWeekFullTranslation(dayOfWeek: DayOfWeek, translation: string): void;
        setMonthTranslation(month: Month, translation: string): void;
        setMonthShortTranslation(month: Month, translation: string): void;
        setTitleTranslation(titleName: TitleName, translation: string): void;
        translateDayOfWeek(dayOfWeek: DayOfWeek): string;
        translateDayOfWeekFull(dayOfWeek: DayOfWeek): string;
        translateMonth(month: Month): string;
        translateMonthShort(month: Month): string;
        translateTitle(titleName: TitleName): string;
    }
}
declare namespace TheDatepicker {
    export enum MoveDirection_ {
        Left = 1,
        Up = 2,
        Right = 3,
        Down = 4
    }
    class YearSelectionState {
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
    export class ViewModel_ {
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
}
