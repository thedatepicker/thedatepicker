import ClassNames from './ClassNames';
import Day from './Day';
import Translator from './Translator';
import Helper_, { Align, DayOfWeek, Position } from './Helper';
import HtmlHelper_ from './HtmlHelper';

export enum EventType_ {
	BeforeSelect = 'beforeSelect',
	Select = 'select',
	BeforeOpen = 'beforeOpen',
	Open = 'open',
	BeforeClose = 'beforeClose',
	Close = 'close',
	BeforeMonthChange = 'beforeMonthChange',
	MonthChange = 'monthChange',
	Focus = 'focus',
	BeforeFocus = 'beforeFocus',
}

export class AvailableDateNotFoundException {

}

export type SelectListener = (event: Event | null, day: Day| null, previousDay: Day| null) => boolean;
export type OpenOrCloseListener = (event: Event | null) => boolean;
export type MonthChangeListener = (event: Event | null, month: Date, previousMonth: Date) => boolean;
export type FocusListener = (event: Event | null, day: Day| null, previousDay: Day| null) => boolean;
type OneOfListener = SelectListener | OpenOrCloseListener | MonthChangeListener | FocusListener;
type AnyListener = SelectListener & OpenOrCloseListener & MonthChangeListener & FocusListener;
type ListenerCaller = (listener: (event: Event | null, ...props: any) => boolean) => boolean;

interface Listeners {
	beforeSelect: SelectListener[];
	select: SelectListener[];
	beforeOpen: OpenOrCloseListener[];
	open: OpenOrCloseListener[];
	beforeClose: OpenOrCloseListener[];
	close: OpenOrCloseListener[];
	beforeMonthChange: MonthChangeListener[];
	monthChange: MonthChangeListener[];
	beforeFocus: FocusListener[];
	focus: FocusListener[];
}

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

export default class Options {

	public readonly translator: Translator;
	public readonly classNames: ClassNames;

	private hideOnBlur_ = true;
	private hideOnSelect_ = true;
	private minDate_: Date | null = null;
	private maxDate_: Date | null = null;
	private initialDate_: Date | null = null;
	private initialMonth_: Date | null = null;
	private initialDatePriority_ = true;
	private firstDayOfWeek_ = DayOfWeek.Monday;
	private dateAvailabilityResolvers_: DateAvailabilityResolver[] = [];
	private cellContentResolver_: CellContentResolver | null = null;
	private cellContentStructureResolver_: CellContentStructureResolver | null = null;
	private headerStructureResolver_: StructureResolverInit | null = null;
	private footerStructureResolver_: StructureResolverInit | null = null;
	private cellClassesResolvers_: CellClassesResolver[] = [];
	private dayModifiers_: DayModifier[] = [];
	private inputFormat_ = 'j. n. Y';
	private allowInputAnyChar_ = false;
	private daysOutOfMonthVisible_ = false;
	private fixedRowsCount_ = false;
	private toggleSelection_ = false;
	private allowEmpty_ = true;
	private showDeselectButton_ = true;
	private showResetButton_ = false;
	private monthAsDropdown_ = true;
	private yearAsDropdown_ = true;
	private yearSelectedFromTableOfYears_ = true;
	private tableOfYearsRowsCount_ = 6;
	private tableOfYearsAlign_: Align | null = null;
	private tableOfYearsOnSwipeDown_ = true;
	private yearsOutOfTableOfYearsVisible_ = true;
	private monthAndYearSeparated_ = true;
	private monthShort_ = false;
	private changeMonthOnSwipe_ = true;
	private slideAnimation_ = true;
	private classesPrefix_ = 'the-datepicker__';
	private darkMode_ = false;
	private showCloseButton_ = true;
	private closeOnEscPress_ = true;
	private title_ = '';
	private dropdownItemsLimit_ = 200;
	private hideDropdownWithOneItem_ = true;
	private goBackHtml_ = '&lt;';
	private goForwardHtml_ = '&gt;';
	private closeHtml_ = '&times;';
	private resetHtml_ = '&olarr;';
	private deselectHtml_ = '&times;';
	private position_ = Position.BottomRight;
	private positionFixing_ = true;
	private fullScreenOnMobile_ = true;
	private keyboardOnMobile_ = false;
	private includeAria_ = true;
	private today_: Date | null = null;
	private listeners_: Listeners = {
		beforeSelect: [],
		select: [],
		beforeOpen: [],
		open: [],
		beforeClose: [],
		close: [],
		beforeMonthChange: [],
		monthChange: [],
		beforeFocus: [],
		focus: [],
	};

	public constructor(translator: Translator | null = null, classNames: ClassNames | null = null) {
		this.translator = translator || new Translator();
		this.classNames = classNames || new ClassNames();
	}

	public clone(): Options {
		const options = new Options(this.translator.clone(), this.classNames.clone());

		options.hideOnBlur_ = this.hideOnBlur_;
		options.hideOnSelect_ = this.hideOnSelect_;
		options.minDate_ = this.minDate_;
		options.maxDate_ = this.maxDate_;
		options.initialDate_ = this.initialDate_;
		options.initialMonth_ = this.initialMonth_;
		options.initialDatePriority_ = this.initialDatePriority_;
		options.firstDayOfWeek_ = this.firstDayOfWeek_;
		options.dateAvailabilityResolvers_ = this.dateAvailabilityResolvers_.slice(0);
		options.cellContentResolver_ = this.cellContentResolver_;
		options.cellContentStructureResolver_ = this.cellContentStructureResolver_;
		options.headerStructureResolver_ = this.headerStructureResolver_;
		options.footerStructureResolver_ = this.footerStructureResolver_;
		options.cellClassesResolvers_ = this.cellClassesResolvers_.slice(0);
		options.dayModifiers_ = this.dayModifiers_.slice(0);
		options.inputFormat_ = this.inputFormat_;
		options.allowInputAnyChar_ = this.allowInputAnyChar_;
		options.daysOutOfMonthVisible_ = this.daysOutOfMonthVisible_;
		options.fixedRowsCount_ = this.fixedRowsCount_;
		options.toggleSelection_ = this.toggleSelection_;
		options.allowEmpty_ = this.allowEmpty_;
		options.showDeselectButton_ = this.showDeselectButton_;
		options.showResetButton_ = this.showResetButton_;
		options.monthAsDropdown_ = this.monthAsDropdown_;
		options.yearAsDropdown_ = this.yearAsDropdown_;
		options.yearSelectedFromTableOfYears_ = this.yearSelectedFromTableOfYears_;
		options.tableOfYearsRowsCount_ = this.tableOfYearsRowsCount_;
		options.tableOfYearsAlign_ = this.tableOfYearsAlign_;
		options.tableOfYearsOnSwipeDown_ = this.tableOfYearsOnSwipeDown_;
		options.monthAndYearSeparated_ = this.monthAndYearSeparated_;
		options.monthShort_ = this.monthShort_;
		options.changeMonthOnSwipe_ = this.changeMonthOnSwipe_;
		options.slideAnimation_ = this.slideAnimation_;
		options.classesPrefix_ = this.classesPrefix_;
		options.darkMode_ = this.darkMode_;
		options.showCloseButton_ = this.showCloseButton_;
		options.closeOnEscPress_ = this.closeOnEscPress_;
		options.title_ = this.title_;
		options.dropdownItemsLimit_ = this.dropdownItemsLimit_;
		options.hideDropdownWithOneItem_ = this.hideDropdownWithOneItem_;
		options.goBackHtml_ = this.goBackHtml_;
		options.goForwardHtml_ = this.goForwardHtml_;
		options.closeHtml_ = this.closeHtml_;
		options.resetHtml_ = this.resetHtml_;
		options.deselectHtml_ = this.deselectHtml_;
		options.position_ = this.position_;
		options.positionFixing_ = this.positionFixing_;
		options.fullScreenOnMobile_ = this.fullScreenOnMobile_;
		options.keyboardOnMobile_ = this.keyboardOnMobile_;
		options.includeAria_ = this.includeAria_;
		options.listeners_.beforeSelect = this.listeners_.beforeSelect.slice(0);
		options.listeners_.select = this.listeners_.select.slice(0);
		options.listeners_.beforeOpen = this.listeners_.beforeOpen.slice(0);
		options.listeners_.open = this.listeners_.open.slice(0);
		options.listeners_.beforeClose = this.listeners_.beforeClose.slice(0);
		options.listeners_.close = this.listeners_.close.slice(0);
		options.listeners_.beforeMonthChange = this.listeners_.beforeMonthChange.slice(0);
		options.listeners_.monthChange = this.listeners_.monthChange.slice(0);
		options.listeners_.beforeFocus = this.listeners_.beforeFocus.slice(0);
		options.listeners_.focus = this.listeners_.focus.slice(0);

		return options
	}

	// <Date> definition (can be one of following):
	// - instance of Date
	// - string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
	// - any string which is accepted by Date constructor, e.g.: "7 September 2021"
	// - instance of TheDatepicker.Day
	// - string "now" or "today" or "tomorrow" or "yesterday"
	// - string in format "<sign><number> <unit>"
    //     where <sign> is "+" or "-" and is optional,
	//     <unit> is one of "day", "week", "month" or "year" or plural version
	//     possibly repeating
	//     e.g.: "-10 years", "+1 year 3 months 1 week"
	//     can precede with "<number>. <January through December>"
	//     e.g. "20. March -3 years"

	// Setting to true will display datepicker only when input or datepicker itself is focused,
	// otherwise datepicker will be visible always.
	// Works only when there an input exists.
	// defaults to true
	public setHideOnBlur(value: boolean): void {
		this.hideOnBlur_ = !!value;
	}

	// Setting to true will hide datepicker immediately after selecting a valid date.
	// Works only when the setting HideOnBlur is set to true.
	// Works only when there an input exists.
	// defaults to true
	public setHideOnSelect(value: boolean): void {
		this.hideOnSelect_ = !!value;
	}

	// Minimal date which can be selected (inclusive).
	// Define as <Date> (see the definition above)
	// or null for no limit.
	// defaults to no limit
	public setMinDate(date: Day | Date | string | null): void {
		const normalizedDate = Helper_.normalizeDate_('Min date', date, true, this);
		this.checkConstraints_(normalizedDate, this.maxDate_);
		this.minDate_ = normalizedDate;
	}

	// Maximal date which can be selected (inclusive).
	// Define as <Date> (see the definition above)
	// or null for no limit.
	// defaults to no limit
	public setMaxDate(date: Day | Date | string | null): void {
		const normalizedDate = Helper_.normalizeDate_('Max date', date, true, this);
		this.checkConstraints_(this.minDate_, normalizedDate);
		this.maxDate_ = normalizedDate;
	}

	// Month to be rendered when datepicker opened first time.
	// Define as <Date> (see the definition above)
	// or null for the current month.
	// defaults to current month
	public setInitialMonth(month: Date | string | null): void {
		this.initialMonth_ = Helper_.normalizeDate_('Initial month', month, true, this);
	}

	// Preselected date.
	// Define as <Date> (see the definition above)
	// or null for no value.
	// It's overloaded by direct input value, if any.
	// defaults to null
	public setInitialDate(value: Day | Date | string | null): void {
		this.initialDate_ = Helper_.normalizeDate_('Initial date', value, true, this);
	}

	// Setting to true will make initial month ignored when there is any date preselected.
	// defaults to true
	public setInitialDatePriority(value: boolean): void {
		this.initialDatePriority_ = !!value;
	}

	// Day of week when weeks start.
	// TheDatepicker.DayOfWeek constant, e.g. TheDatepicker.DayOfWeek.Sunday
	// or integer from 0 to 6; 0 = Sunday, 1 = Monday, ... 6 = Saturday
	// defaults to Monday
	public setFirstDayOfWeek(dayOfWeek: DayOfWeek): void {
		this.firstDayOfWeek_ = Helper_.checkNumber_('First day of week', dayOfWeek, 0, 6);
	}

	// Accepts callback which gets an instance of Date on input and returns boolean whether given date is available for select or not,
	// or null to make available all days.
	// deprecated, use addDateAvailabilityResolver()
	public setDateAvailabilityResolver(resolver: DateAvailabilityResolver | null): void {
		Helper_.warnDeprecatedUsage_('setDateAvailabilityResolver', ['addDateAvailabilityResolver']);
		this.removeDateAvailabilityResolver();
		if (resolver) {
			this.addDateAvailabilityResolver(resolver);
		}
	}

	// Accepts callback which gets an instance of Date on input and returns boolean whether given date is available for select or not.
	// The date is available for select only if all resolvers return true.
	public addDateAvailabilityResolver(resolver: DateAvailabilityResolver): void {
		this.dateAvailabilityResolvers_.push(Helper_.checkFunction_('Resolver', resolver, false));
	}

	public removeDateAvailabilityResolver(resolver: DateAvailabilityResolver | null = null): void {
		this.removeCallback_(this.dateAvailabilityResolvers_, 'Resolver', resolver);
	}

	// Accepts callback which gets an instance of TheDatepicker.Day on input and returns string representing content of day cell,
	// or null for default behavior.
	// Default callback returns day number.
	public setCellContentResolver(resolver: CellContentResolver | null): void {
		this.cellContentResolver_ = Helper_.checkFunction_('Resolver', resolver);
	}

	// Accepts two callbacks,
	// or null for default behavior.
	// First callback (init) has no arguments and returns HTMLElement instance representing empty html structure of day cell.
	// Second callback (update) gets an instance of HTMLElement created by first callback, and an instance of TheDatepicker.Day. It should update html structure by given day. Returns void.
	// Default init creates span element and default update fills it with day number.
	public setCellContentStructureResolver(init: StructureResolverInit | null, update: CellContentStructureResolverUpdate | null = null): void {
		init = Helper_.checkFunction_('Resolver (init)', init);
		update = Helper_.checkFunction_('Resolver (update)', update);

		this.cellContentStructureResolver_ = init ? {
			init,
			update,
		} : null;
	}

	// Accepts callback which has no arguments and returns HTMLElement instance which will be placed as datepicker header,
	// or null for no header.
	// defaults to no header
	public setHeaderStructureResolver(resolver: StructureResolverInit | null): void {
		this.headerStructureResolver_ = Helper_.checkFunction_('Resolver', resolver);
	}

	// Accepts callback which has no arguments and returns HTMLElement instance which will be placed as datepicker footer,
	// or null for no footer.
	// defaults to no footer
	public setFooterStructureResolver(resolver: StructureResolverInit | null): void {
		this.footerStructureResolver_ = Helper_.checkFunction_('Resolver', resolver);
	}

	// Accepts callback which gets an instance of TheDatepicker.Day on input and returns array of strings representing custom classes for day cell.
	public addCellClassesResolver(resolver: CellClassesResolver): void {
		this.cellClassesResolvers_.push(Helper_.checkFunction_('Resolver', resolver, false));
	}

	public removeCellClassesResolver(resolver: CellClassesResolver | null = null): void {
		this.removeCallback_(this.cellClassesResolvers_, 'Resolver', resolver);
	}

	// Accepts callback which gets an instance of TheDatepicker.Day on input. It is designated to add arbitrary properties to the TheDatepicker.Day instance.
	public addDayModifier(modifier: DayModifier): void {
		this.dayModifiers_.push(Helper_.checkFunction_('Modifier', modifier, false));
	}

	public removeDayModifier(modifier: DayModifier | null = null): void {
		this.removeCallback_(this.dayModifiers_, 'Modifier', modifier);
	}

	// Format in which date is printed as an input value.
	// It accepts following placeholders:
	// "j": Day of the month; 1 to 31
	// "d": Day of the month with leading zero; 01 to 31
	// "l": Textual representation of a day of the week; Monday through Sunday
	// "D": Short textual representation of a day of the week; Mo through Su
	// "n": Numeric representation of a month; 1 through 12
	// "m": Numeric representation of a month with leading zero; 01 through 12
	// "F": Textual representation of a month; January through December
	// "M": Short textual representation of a month; Jan through Dec
	// "Y": Full year; 1999 or 2003
	// "y": Year, 2 digits; 99 or 03
	// Any other character is printed as is.
	// To print a placeholder character as normal character just put a backslash "\" before it (e.g. "\D").
	// defaults to "j. n. Y"
	public setInputFormat(format: string): void {
		this.inputFormat_ = Helper_.checkString_('Input format', format, true);
	}

	// Setting to false will allow type only those characters which are valid by InputFormat,
	// otherwise any character can be typed.
	// defaults to false
	public setAllowInputAnyChar(value: boolean): void {
		this.allowInputAnyChar_ = !!value;
	}

	// Setting to false will hide days which belongs to other months.
	// defaults to false
	public setDaysOutOfMonthVisible(value: boolean): void {
		this.daysOutOfMonthVisible_ = !!value;
	}

	// Setting to true will always render six rows despite of current month weeks count.
	// defaults to false
	public setFixedRowsCount(value: boolean): void {
		this.fixedRowsCount_ = !!value;
	}

	// Setting to true will make selection toggle, so click on selected day will deselects it.
	// Works only when the setting AllowEmpty is set to true.
	// defaults to false
	public setToggleSelection(value: boolean): void {
		this.toggleSelection_ = !!value;
	}

	// Setting to true will render a button inside an input, which deselects selected date.
	// Works only when there an input exists.
	// Works only when the setting AllowEmpty is set to true.
	// defaults to true
	public setShowDeselectButton(value: boolean): void {
		this.showDeselectButton_ = !!value;
	}

	// Setting to false will disallow to deselect, in other words it always must be any day selected.
	// When there is no initial date, current date (or nearest available one) will be preselected.
	// defaults to true
	public setAllowEmpty(value: boolean): void {
		this.allowEmpty_ = !!value;
	}

	// Setting to true will show button for reseting datepicker to initial state.
	// defaults to false
	public setShowResetButton(value: boolean): void {
		this.showResetButton_ = !!value;
	}

	// Setting to true will render month as dropdown list (html select).
	// defaults to true
	public setMonthAsDropdown(value: boolean): void {
		this.monthAsDropdown_ = !!value;
	}

	// Setting to true will render year as dropdown list (html select).
	// defaults to true
	public setYearAsDropdown(value: boolean): void {
		this.yearAsDropdown_ = !!value;
	}

	// Setting to true will render year selection as a table of years instead of dropdown list (html select).
	// Works only when setting YearAsDropdown is set to true.
	// defaults to true
	public setYearSelectedFromTableOfYears(value: boolean): void {
		this.yearSelectedFromTableOfYears_ = !!value;
	}

	// Table of years rows count.
	// defaults to 6
	public setTableOfYearsRowsCount(count: number): void {
		this.tableOfYearsRowsCount_ = Helper_.checkNumber_('Rows count', count, 1);
	}

	// Align of years in table of years.
	// TheDatepicker.Align.Left means that first available year is placed in the upper left corner of the table.
	//   Works only when setting MinDate is not null.
	// TheDatepicker.Align.Right means that last available year is placed in the lower right corner of the table.
	//   Works only when setting MaxDate is not null.
	// TheDatepicker.Align.Center means that initial year is placed in the center of the table.
	// When set to null, align is calculated as follows:
	//   If both settings MinDate and MaxDate are set to null, the TheDatepicker.Align.Center is used.
	//   If only setting MinDate is not null, the TheDatepicker.Align.Left is used.
	//   If only setting MaxDate is not null, the TheDatepicker.Align.Right is used.
	//   If both settings MinDate and MaxDate are not null, align is calculated as follows:
	//     If the difference between MinDate and the initial year is less than or equal to the difference between
	//     MaxDate and the initial year, the TheDatepicker.Align.Left is used.
	//     Otherwise, the TheDatepicker.Align.Right is used.
	// defaults to null
	public setTableOfYearsAlign(align: Align | null): void {
		this.tableOfYearsAlign_ = align ? Helper_.checkNumber_('Align', align, 1, 3) : null;
	}

	// Setting to true will open table of years on finger up-to-down swipe
	// and close it on finger down-to-up swipe.
	// defaults to true
	public setTableOfYearsOnSwipeDown(value: boolean): void {
		this.tableOfYearsOnSwipeDown_ = !!value;
	}

	// Setting to false will hide years in table of years which are not available.
	// defaults to true
	public setYearsOutOfTableOfYearsVisible(value: boolean): void {
		this.yearsOutOfTableOfYearsVisible_ = !!value;
	}

	// Setting to true will render month and year in header each in separate element.
	// If set to false it will be rendered as a dropdown only when both settings MonthAsDropdown and YearAsDropdown are set to true.
	// Works only when setting YearSelectedFromTableOfYears is set to false.
	// defaults to true
	public setMonthAndYearSeparated(value: boolean): void {
		this.monthAndYearSeparated_ = !!value;
	}

	// Setting to true will dump month name in short textual representation.
	// defaults to false
	public setMonthShort(value: boolean): void {
		this.monthShort_ = !!value;
	}

	// Setting to true will enable changing of month on finger left-to-right or right-to-left swipe.
	// defaults to true
	public setChangeMonthOnSwipe(value: boolean): void {
		this.changeMonthOnSwipe_ = !!value;
	}

	public setAnimateMonthChange(value: boolean): void {
		Helper_.warnDeprecatedUsage_('setAnimateMonthChange', ['setSlideAnimation'])
		this.setSlideAnimation(value);
	}

	// If set to true then changing month to next/previous and open/close of table of years will become animated.
	// defaults to true
	public setSlideAnimation(value: boolean): void {
		this.slideAnimation_ = !!value;
	}

	// CSS classes of datepicker elements will be prefixed with given string.
	// defaults to "the-datepicker__"
	public setClassesPrefix(prefix: string): void {
		this.classesPrefix_ = Helper_.checkString_('Prefix', prefix);
	}

	// Setting to true will render datepicker in the dark appearance.
	// Works only when there is no custom container.
	// defaults to false
	public setDarkMode(value: boolean): void {
		this.darkMode_ = !!value;
	}

	// Setting to true will show button for closing datepicker.
	// Works only when the setting HideOnBlur is set to true.
	// defaults to true
	public setShowCloseButton(value: boolean): void {
		this.showCloseButton_ = !!value;
	}

	// Setting to true will close datepicker when ESC key is pressed.
	// Works only when the setting HideOnBlur is set to true.
	// defaults to true
	public setCloseOnEscPress(value: boolean): void {
		this.closeOnEscPress_ = !!value;
	}

	// Sets title which is displayed in the datepicker header.
	// null for no title
	// defaults to no title
	public setTitle(title: string | null): void {
		this.title_ = Helper_.checkString_('Title', title);
	}

	// Limit of number of items in dropdown list.
	// default is 200
	public setDropdownItemsLimit(limit: number): void {
		this.dropdownItemsLimit_ = Helper_.checkNumber_('Items limit', limit, 1);
	}

	// Setting to true will show month and/or year dropdown only when there are two or more options.
	// defaults to true
	public setHideDropdownWithOneItem(value: boolean): void {
		this.hideDropdownWithOneItem_ = !!value;
	}

	// Sets html for go back button.
	// defaults to "&lt;"
	public setGoBackHtml(html: string): void {
		this.goBackHtml_ = Helper_.checkString_('Html', html);
	}

	// Sets html for go forward button.
	// defaults to "&gt;"
	public setGoForwardHtml(html: string): void {
		this.goForwardHtml_ = Helper_.checkString_('Html', html);
	}

	// Sets html for close button.
	// defaults to "&times;"
	public setCloseHtml(html: string): void {
		this.closeHtml_ = Helper_.checkString_('Html', html);
	}

	// Sets html for reset button.
	// defaults to "&olarr;"
	public setResetHtml(html: string): void {
		this.resetHtml_ = Helper_.checkString_('Html', html);
	}

	// Sets html for deselect button.
	// defaults to "&times;"
	public setDeselectHtml(html: string): void {
		this.deselectHtml_ = Helper_.checkString_('Html', html);
	}

	// Position of the datepicker relative to an input.
	// TheDatepicker.Position.BottomRight means that the top left corner of the datepicker is aligned with the input,
	//   so the datepicker is placed at the bottom right position from the input.
	// TheDatepicker.Position.BottomLeft works similarly.
	// TheDatepicker.Position.TopRight -"-
	// TheDatepicker.Position.TopLeft -"-
	// Works only when there is no custom container.
	// defaults to Position.BottomRight
	public setPosition(position: Position): void {
		this.position_ = Helper_.checkNumber_('Position', position, 1, 4);
	}

	// Setting to true will render datepicker to the different side of an input than normally, if there's no enough space.
	// Works only when there is no custom container and setting HideOnBlur is set to true.
	// defaults to true
	public setPositionFixing(value: boolean): void {
		this.positionFixing_ = !!value;
	}

	// Setting to true will render datepicker fullscreen on narrow displays (usually mobile).
	// Works only when there is no custom container.
	// Works only when the setting HideOnBlur is set to true.
	// defaults to true
	public setFullScreenOnMobile(value: boolean): void {
		this.fullScreenOnMobile_ = !!value;
	}

	// Setting to false will prevent displaying virtual keyboard on mobile devices.
	// Useful especially with FullScreenOnMobile set to true.
	// Works only when there an input exists.
	// defaults to false
	public setKeyboardOnMobile(value: boolean): void {
		this.keyboardOnMobile_ = !!value;
	}

	// Setting to true will include Aria attributes into html.
	// For more info, see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
	// defaults to true
	public setIncludeAria(value: boolean): void {
		this.includeAria_ = !!value;
	}

	// Sets mock/fake today.
	// Define as <Date> (see the definition above)
	// or null for real today.
	// defaults to null
	public setToday(date: Day | Date | string | null): void {
		this.today_ = Helper_.normalizeDate_('Today', date, true, this);
	}

	// Callback to be called just before the day is selected or deselected.
	// An Event instance, a TheDatepicker.Day instance (or null when deselected) and previous selected day TheDatepicker.Day instance (or null when nothing selected before) are given on input.
	// If callback returns false, selection stops and nothing will be selected / deselected.
	public onBeforeSelect(listener: SelectListener): void {
		this.onEvent_(EventType_.BeforeSelect, listener as AnyListener);
	}

	public offBeforeSelect(listener: SelectListener | null = null): void {
		this.offEvent_(EventType_.BeforeSelect, listener);
	}

	// Callback to be called immediately after the day is selected or deselected.
	// An Event instance, a TheDatepicker.Day instance (or null when deselected) and previous selected day TheDatepicker.Day instance (or null when nothing selected before) are given on input.
	public onSelect(listener: SelectListener): void {
		this.onEvent_(EventType_.Select, listener as AnyListener);
	}

	public offSelect(listener: SelectListener | null = null): void {
		this.offEvent_(EventType_.Select, listener);
	}

	// Callback to be called just before the datepicker is opened.
	// An Event instance is given on input.
	// If callback returns false, action stops and datepicker will not be opened.
	public onBeforeOpen(listener: OpenOrCloseListener): void {
		this.onEvent_(EventType_.BeforeOpen, listener as AnyListener);
	}

	public offBeforeOpen(listener: OpenOrCloseListener | null = null): void {
		this.offEvent_(EventType_.BeforeOpen, listener);
	}

	// Callback to be called immediately after the datepicker is opened.
	// An Event instance is given on input.
	public onOpen(listener: OpenOrCloseListener): void {
		this.onEvent_(EventType_.Open, listener as AnyListener);
	}

	public offOpen(listener: OpenOrCloseListener | null = null): void {
		this.offEvent_(EventType_.Open, listener);
	}

	// Callback to be called just before the datepicker is closed.
	// An Event instance is given on input.
	// If callback returns false, action stops and datepicker will not be closed.
	public onBeforeClose(listener: OpenOrCloseListener): void {
		this.onEvent_(EventType_.BeforeClose, listener as AnyListener);
	}

	public offBeforeClose(listener: OpenOrCloseListener | null = null): void {
		this.offEvent_(EventType_.BeforeClose, listener);
	}

	// Callback to be called immediately after the datepicker is closed.
	// An Event instance is given on input.
	public onClose(listener: OpenOrCloseListener): void {
		this.onEvent_(EventType_.Close, listener as AnyListener);
	}

	public offClose(listener: OpenOrCloseListener | null = null): void {
		this.offEvent_(EventType_.Close, listener);
	}

	// Callback to be called just before the datepicker is opened or closed.
	// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
	// If callback returns false, action stops and datepicker will not be opened / closed.
	// deprecated, use onBeforeOpen() or onBeforeClose()
	public onBeforeOpenAndClose(listener: OpenOrCloseListener): void {
		Helper_.warnDeprecatedUsage_('onBeforeOpenAndClose', ['onBeforeOpen', 'onBeforeClose']);
		this.onBeforeOpen(listener);
		this.onBeforeClose(listener);
	}

	// deprecated, use offBeforeOpen() or offBeforeClose()
	public offBeforeOpenAndClose(listener: OpenOrCloseListener | null = null): void {
		Helper_.warnDeprecatedUsage_('offBeforeOpenAndClose', ['offBeforeOpen', 'offBeforeClose']);
		this.offBeforeOpen(listener);
		this.offBeforeClose(listener);
	}

	// Callback to be called immediately after the datepicker is opened or closed.
	// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
	// deprecated, use onOpen() or onClose()
	public onOpenAndClose(listener: OpenOrCloseListener): void {
		Helper_.warnDeprecatedUsage_('onOpenAndClose', ['onOpen', 'onClose']);
		this.onOpen(listener);
		this.onClose(listener);
	}

	// deprecated, use offOpen() or offClose()
	public offOpenAndClose(listener: OpenOrCloseListener | null = null): void {
		Helper_.warnDeprecatedUsage_('offOpenAndClose', ['offOpen', 'offClose']);
		this.offOpen(listener);
		this.offClose(listener);
	}

	// Callback to be called just before displayed month is changed.
	// An Event instance, month (Date instance set to first day of month) which is going to be displayed and month (Date instance) which was displayed before are given on input.
	// If callback returns false, month will not be changed.
	public onBeforeMonthChange(listener: MonthChangeListener): void {
		this.onEvent_(EventType_.BeforeMonthChange, listener as AnyListener);
	}

	public offBeforeMonthChange(listener: MonthChangeListener | null = null): void {
		this.offEvent_(EventType_.BeforeMonthChange, listener);
	}

	// Callback to be called immediately after the datepicker is opened or closed.
	// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
	public onMonthChange(listener: MonthChangeListener): void {
		this.onEvent_(EventType_.MonthChange, listener as AnyListener);
	}

	public offMonthChange(listener: MonthChangeListener | null = null): void {
		this.offEvent_(EventType_.MonthChange, listener);
	}

	// Callback to be called just before the day is focused or blurred.
	// An Event instance, a TheDatepicker.Day instance (or null when blurred) and previous focused day TheDatepicker.Day instance (or null when nothing focused before) are given on input.
	// If callback returns false, focus stops and nothing will be focused / blurred.
	public onBeforeFocus(listener: FocusListener): void {
		this.onEvent_(EventType_.BeforeFocus, listener as AnyListener);
	}

	public offBeforeFocus(listener: FocusListener | null = null): void {
		this.offEvent_(EventType_.BeforeFocus, listener);
	}

	// Callback to be called immediately after the day is selected or deselected.
	// An Event instance, a TheDatepicker.Day instance (or null when deselected) and previous selected day TheDatepicker.Day instance (or null when nothing selected before) are given on input.
	public onFocus(listener: FocusListener): void {
		this.onEvent_(EventType_.Focus, listener as AnyListener);
	}

	public offFocus(listener: FocusListener | null = null): void {
		this.offEvent_(EventType_.Focus, listener);
	}

	public getInitialMonth(): Date {
		const primarySource = this.initialDatePriority_ ? this.initialDate_ : this.initialMonth_;
		const secondarySource = this.initialDatePriority_ ? this.initialMonth_ : this.initialDate_;

		const initialMonth = primarySource
			? new Date(primarySource.getTime())
			: (
				secondarySource
					? new Date(secondarySource.getTime())
					: this.getToday()
			);
		initialMonth.setDate(1);

		return this.correctMonth(initialMonth);
	}

	public isMonthInValidity(month: Date): boolean {
		return !this.calculateMonthCorrection_(month);
	}

	public correctMonth(month: Date): Date {
		const correctMonth = this.calculateMonthCorrection_(month);
		return correctMonth || month;
	}

	public getInitialDate(): Date | null {
		return this.findPossibleAvailableDate(this.initialDate_);
	}

	public findPossibleAvailableDate(date: Date | null): Date | null {
		if (this.isAllowedEmpty()) {
			return date && this.isDateInValidity(date) && this.isDateAvailable(date)
				? new Date(date.getTime())
				: null;
		}

		date = date ? new Date(date.getTime()) : this.getToday();
		date = this.findNearestAvailableDate(date);
		if (date) {
			return date;
		}

		throw new AvailableDateNotFoundException();
	}

	public findNearestAvailableDate(date: Date): Date {
		date = this.correctDate_(date);

		if (this.isDateAvailable(date)) {
			return date;
		}

		const minDate = this.getMinDate_().getTime();
		const maxDate = this.getMaxDate_().getTime();

		let maxLoops = 1000; // infinite loop prevention
		let increasedDate: Date | null = date;
		let decreasedDate: Date | null = new Date(date.getTime());
		do {
			if (increasedDate) {
				increasedDate.setDate(increasedDate.getDate() + 1);
				if (increasedDate.getTime() > maxDate) {
					increasedDate = null;
				} else if (this.isDateAvailable(increasedDate)) {
					return increasedDate;
				}
			}

			if (decreasedDate) {
				decreasedDate.setDate(decreasedDate.getDate() - 1);
				if (decreasedDate.getTime() < minDate) {
					decreasedDate = null;
				} else if (this.isDateAvailable(decreasedDate)) {
					return decreasedDate;
				}
			}

			maxLoops--;
		} while ((increasedDate || decreasedDate) && maxLoops > 0);

		return null;
	}

	public isDateInValidity(date: Date): boolean {
		return !this.calculateDateCorrection_(date);
	}

	private correctDate_(date: Date): Date {
		const correctDate = this.calculateDateCorrection_(date);
		return correctDate || date;
	}

	public getFirstDayOfWeek(): DayOfWeek {
		return this.firstDayOfWeek_;
	}

	public areDaysOutOfMonthVisible(): boolean {
		return this.daysOutOfMonthVisible_;
	}

	public hasFixedRowsCount(): boolean {
		return this.fixedRowsCount_;
	}

	public hasToggleSelection(): boolean {
		return this.allowEmpty_ && this.toggleSelection_;
	}

	public isAllowedEmpty(): boolean {
		return this.allowEmpty_;
	}

	public isDeselectButtonShown(): boolean {
		return this.allowEmpty_ && this.showDeselectButton_;
	}

	public isResetButtonShown(): boolean {
		return this.showResetButton_;
	}

	public isMonthAsDropdown(): boolean {
		return this.monthAsDropdown_;
	}

	public isYearAsDropdown(): boolean {
		return this.yearAsDropdown_;
	}

	public isYearSelectedFromTableOfYears(): boolean {
		return this.yearAsDropdown_ && this.yearSelectedFromTableOfYears_;
	}

	public getTableOfYearsRowsCount(): number {
		return this.tableOfYearsRowsCount_;
	}

	public getTableOfYearsColumnsCount(): number {
		return 4;
	}

	public getTableOfYearsAlign(): Align | null {
		return this.tableOfYearsAlign_;
	}

	public isTableOfYearsOnSwipeDownEnabled(): boolean {
		return this.tableOfYearsOnSwipeDown_;
	}

	public areYearsOutOfTableOfYearsVisible(): boolean {
		return this.yearsOutOfTableOfYearsVisible_;
	}

	public isMonthAndYearSeparated(): boolean {
		return this.isYearSelectedFromTableOfYears() || this.monthAndYearSeparated_;
	}

	public isMonthShort(): boolean {
		return this.monthShort_;
	}

	public isMonthChangeOnSwipeEnabled(): boolean {
		return this.changeMonthOnSwipe_;
	}

	public isMonthChangeAnimated(): boolean {
		Helper_.warnDeprecatedUsage_('isMonthChangeAnimated', ['isSlideAnimationEnabled'])
		return this.isSlideAnimationEnabled();
	}

	public isSlideAnimationEnabled(): boolean {
		return this.slideAnimation_;
	}

	public getClassesPrefix(): string {
		return this.classesPrefix_;
	}

	public isDarkModeEnabled(): boolean {
		return this.darkMode_;
	}

	public isCloseButtonShown(): boolean {
		return this.hideOnBlur_ && this.showCloseButton_;
	}

	public isClosedOnEscPress(): boolean {
		return this.hideOnBlur_ && this.closeOnEscPress_;
	}

	public getTitle(): string {
		return this.title_;
	}

	public getMinDate(): Date | null {
		return this.minDate_ ? new Date(this.minDate_.getTime()) : null;
	}

	public getMaxDate(): Date | null {
		return this.maxDate_ ? new Date(this.maxDate_.getTime()) : null;
	}

	public getMinDate_(): Date {
		const minDate = this.getMinDate();
		if (!minDate) {
			// Previous month is out of range
			return new Date(-271821, 4, 1);
		}

		return minDate;
	}

	public getMaxDate_(): Date {
		const maxDate = this.getMaxDate();
		if (!maxDate) {
			// Next month is out of range
			return new Date(275760, 7, 31);
		}

		return maxDate;
	}

	public getMinMonth(): Date | null {
		if (!this.minDate_) {
			return null;
		}

		const minMonth = new Date(this.minDate_.getTime());
		minMonth.setDate(1);

		return minMonth;
	}

	public getMaxMonth(): Date | null {
		if (!this.maxDate_) {
			return null;
		}

		const maxMonth = new Date(this.maxDate_.getTime());
		maxMonth.setDate(1);

		return maxMonth;
	}

	public getMinMonth_(): Date {
		let minMonth = this.getMinMonth();
		if (!minMonth) {
			minMonth = this.getMinDate_();
		}

		return minMonth;
	}

	public getMaxMonth_(): Date {
		let maxMonth = this.getMaxMonth();
		if (!maxMonth) {
			maxMonth = this.getMaxDate_();
			maxMonth.setDate(1);
		}

		return maxMonth;
	}

	public isDropdownWithOneItemHidden(): boolean {
		return this.hideDropdownWithOneItem_;
	}

	public getDropdownItemsLimit(): number {
		return this.dropdownItemsLimit_;
	}

	public isDateAvailable(date: Date): boolean {
		const dateAvailabilityResolvers = this.dateAvailabilityResolvers_.slice(0);
		for (let index = 0; index < dateAvailabilityResolvers.length; index++) {
			if (!dateAvailabilityResolvers[index](new Date(date.getTime()))) {
				return false;
			}
		}

		return true;
	}

	public getCellContent(day: Day): string {
		if (this.cellContentResolver_) {
			return this.cellContentResolver_(day);
		}

		return day.dayNumber + '';
	}

	public prefixClass_(name: string): string {
		return this.classesPrefix_ + name;
	}

	public getCellStructure_(): HTMLElement {
		if (this.cellContentStructureResolver_) {
			return this.cellContentStructureResolver_.init();
		}

		return HtmlHelper_.createSpan_();
	}

	public updateCellStructure_(element: HTMLElement, day: Day): void {
		if (this.cellContentStructureResolver_) {
			this.cellContentStructureResolver_.update(element, day);
		} else {
			element.innerText = this.getCellContent(day);
		}
	}

	public getHeaderStructure_(): HTMLElement | null {
		return this.headerStructureResolver_ ? this.headerStructureResolver_() : null;
	}

	public getFooterStructure_(): HTMLElement | null {
		return this.footerStructureResolver_ ? this.footerStructureResolver_() : null;
	}

	public getCellClasses(day: Day): string[] {
		let result: string[] = [];

		const cellClassesResolvers = this.cellClassesResolvers_.slice(0);
		for (let index = 0; index < cellClassesResolvers.length; index++) {
			const classes = cellClassesResolvers[index](day);
			if (typeof classes === 'string') {
				result.push(classes);
			} else if (typeof classes === 'object' && classes.constructor === Array) {
				result = result.concat(classes)
			}
		}

		return result;
	}

	public modifyDay(day: Day): void {
		const dayModifiers = this.dayModifiers_.slice(0);
		for (let index = 0; index < dayModifiers.length; index++) {
			dayModifiers[index](day);
		}
	}

	public getGoBackHtml(): string {
		return this.goBackHtml_;
	}

	public getGoForwardHtml(): string {
		return this.goForwardHtml_;
	}

	public getCloseHtml(): string {
		return this.closeHtml_;
	}

	public getResetHtml(): string {
		return this.resetHtml_;
	}

	public getDeselectHtml(): string {
		return this.deselectHtml_;
	}

	public isHiddenOnBlur(): boolean {
		return this.hideOnBlur_;
	}

	public isHiddenOnSelect(): boolean {
		return this.hideOnBlur_ && this.hideOnSelect_;
	}

	public getInputFormat(): string {
		return this.inputFormat_;
	}

	public isAllowedInputAnyChar(): boolean {
		return this.allowInputAnyChar_;
	}

	public getPosition(): Position {
		return this.position_;
	}

	public isPositionFixingEnabled(): boolean {
		return this.hideOnBlur_ && this.positionFixing_;
	}

	public isFullScreenOnMobile(): boolean {
		return this.hideOnBlur_ && this.fullScreenOnMobile_;
	}

	public isKeyboardOnMobile(): boolean {
		return this.keyboardOnMobile_;
	}

	public isAriaIncluded(): boolean {
		return this.includeAria_;
	}

	public getToday(): Date {
		return this.today_ ? new Date(this.today_.getTime()) : Helper_.resetTime_(new Date());
	}

	public getDateAvailabilityResolver(): DateAvailabilityResolver | null {
		Helper_.warnDeprecatedUsage_('getDateAvailabilityResolver', ['getDateAvailabilityResolvers']);
		return this.dateAvailabilityResolvers_.length > 0 ? this.dateAvailabilityResolvers_[0] : null;
	}

	public getDateAvailabilityResolvers(): DateAvailabilityResolver[] {
		return this.dateAvailabilityResolvers_.slice(0);
	}

	public getCellContentResolver(): CellContentResolver | null {
		return this.cellContentResolver_;
	}

	public getCellContentStructureResolver(): CellContentStructureResolver | null {
		return this.cellContentStructureResolver_;
	}

	public getHeaderStructureResolver(): StructureResolverInit | null {
		return this.headerStructureResolver_;
	}

	public getFooterStructureResolver(): StructureResolverInit | null {
		return this.footerStructureResolver_;
	}

	public getCellClassesResolvers(): CellClassesResolver[] {
		return this.cellClassesResolvers_.slice(0);
	}

	public getDayModifiers(): DayModifier[] {
		return this.dayModifiers_.slice(0);
	}

	public getBeforeSelectListeners(): SelectListener[] {
		return this.listeners_.beforeSelect.slice(0);
	}

	public getSelectListeners(): SelectListener[] {
		return this.listeners_.select.slice(0);
	}

	public getBeforeOpenListeners(): OpenOrCloseListener[] {
		return this.listeners_.beforeOpen.slice(0);
	}

	public getOpenListeners(): OpenOrCloseListener[] {
		return this.listeners_.open.slice(0);
	}

	public getBeforeCloseListeners(): OpenOrCloseListener[] {
		return this.listeners_.beforeClose.slice(0);
	}

	public getCloseListeners(): OpenOrCloseListener[] {
		return this.listeners_.close.slice(0);
	}

	public getBeforeOpenAndCloseListeners(): OpenOrCloseListener[] {
		Helper_.warnDeprecatedUsage_('getBeforeOpenAndCloseListeners', ['getBeforeOpenListeners', 'getBeforeCloseListeners']);
		return this.listeners_.beforeOpen.concat(this.listeners_.beforeClose);
	}

	public getOpenAndCloseListeners(): OpenOrCloseListener[] {
		Helper_.warnDeprecatedUsage_('getOpenAndCloseListeners', ['getOpenListeners', 'getCloseListeners']);
		return this.listeners_.open.concat(this.listeners_.close);
	}

	public getBeforeMonthChangeListeners(): MonthChangeListener[] {
		return this.listeners_.beforeMonthChange.slice(0);
	}

	public getMonthChangeListeners(): MonthChangeListener[] {
		return this.listeners_.monthChange.slice(0);
	}

	public getBeforeFocusListeners(): FocusListener[] {
		return this.listeners_.beforeFocus.slice(0);
	}

	public getFocusListeners(): FocusListener[] {
		return this.listeners_.focus.slice(0);
	}

	private checkConstraints_(minDate: Date | null, maxDate: Date | null): void {
		if (minDate && maxDate && minDate.getTime() > maxDate.getTime()) {
			throw new Error('Min date cannot be higher then max date.');
		}
	}

	private calculateMonthCorrection_(month: Date): Date | null {
		const minMonth = this.getMinMonth_();
		if (month.getTime() < minMonth.getTime()) {
			return minMonth;
		}

		const maxMonth = this.getMaxMonth_();
		if (month.getTime() > maxMonth.getTime()) {
			return maxMonth;
		}

		return null;
	}

	private calculateDateCorrection_(date: Date): Date | null {
		const minDate = this.getMinDate_();
		if (date.getTime() < minDate.getTime()) {
			return minDate;
		}

		const maxDate = this.getMaxDate_();
		if (date.getTime() > maxDate.getTime()) {
			return maxDate;
		}

		return null;
	}

	private removeCallback_<Type extends Function>(callbacksList: Type[], parameterName: string, callback: Type | null): void {
		callback = Helper_.checkFunction_(parameterName, callback);

		if (!callback) {
			callbacksList.splice(0, callbacksList.length);
		} else {
			const callbacks = callbacksList.slice(0);
			for (let index = callbacks.length - 1; index >= 0; index--) {
				if (callbacks[index] === callback) {
					callbacksList.splice(index, 1);
				}
			}
		}
	}

	private onEvent_(eventType: EventType_, listener: AnyListener) {
		this.listeners_[eventType].push(Helper_.checkFunction_('Event listener', listener, false));
	}

	private offEvent_(eventType: EventType_, listener: OneOfListener | null): void {
		listener = Helper_.checkFunction_('Event listener', listener);

		if (!listener) {
			this.listeners_[eventType] = [];
		} else {
			const newListeners = [];
			for (let index = 0; index < this.listeners_[eventType].length; index++) {
				if (this.listeners_[eventType][index] !== listener) {
					newListeners.push(this.listeners_[eventType][index]);
				}
			}
			this.listeners_[eventType] = newListeners as AnyListener[];
		}
	}

	public triggerEvent_(eventType: EventType_, caller: ListenerCaller): boolean {
		const listeners = this.listeners_[eventType].slice(0);
		for (let index = 0; index < listeners.length; index++) {
			if (caller(listeners[index]) === false) {
				return false;
			}
		}

		return true;
	}

}
