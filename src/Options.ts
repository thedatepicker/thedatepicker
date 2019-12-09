/// <reference path="Translator.ts" />
/// <reference path="Day.ts" />
/// <reference path="Helper.ts" />

namespace TheDatepicker {

	export enum EventType {
		BeforeSelect = 'beforeSelect',
		Select = 'select',
		BeforeOpenAndClose = 'beforeOpenAndClose',
		OpenAndClose = 'openAndClose',
		MonthChange = 'monthChange',
		BeforeMonthChange = 'beforeMonthChange',
	}

	export class AvailableDateNotFoundException {

	}

	export type SelectEvent = (event: Event | null, day: Day| null, previousDay: Day| null) => boolean;
	export type OpenAndCloseEvent = (event: Event | null, isOpening: boolean) => boolean;
	export type MonthChangeEvent = (event: Event | null, month: Date, previousMonth: Date) => boolean;
	type OneOfEvent = SelectEvent | OpenAndCloseEvent | MonthChangeEvent;
	type AnyEvent = SelectEvent & OpenAndCloseEvent & MonthChangeEvent;
	type EventCaller = (listener: (event: Event | null, ...props: any) => boolean) => boolean;

	interface Listeners {
		beforeSelect: SelectEvent[];
		select: SelectEvent[];
		beforeOpenAndClose: OpenAndCloseEvent[];
		openAndClose: OpenAndCloseEvent[];
		monthChange: MonthChangeEvent[];
		beforeMonthChange: MonthChangeEvent[];
	}

	type DateAvailabilityResolver = (date: Date) => boolean;

	type CellContentResolver = (day: Day) => string;

	type CellContentStructureResolverInit = () => HTMLElement;

	type CellContentStructureResolverUpdate = (element: HTMLElement, day: Day) => void;

	interface CellContentStructureResolver {
		init: CellContentStructureResolverInit;
		update: CellContentStructureResolverUpdate;
	}

	type CellClassesResolver = (day: Day) => string[];

	export class Options {

		public readonly translator: Translator;

		private readonly document: Document;

		private hideOnBlur = true;
		private hideOnSelect = true;
		private minDate: Date | null = null;
		private maxDate: Date | null = null;
		private minMonth: Date | null = null;
		private maxMonth: Date | null = null;
		private initialDate: Date | null = null;
		private initialMonth: Date | null = null;
		private initialDatePriority = true;
		private firstDayOfWeek = DayOfWeek.Monday;
		private dateAvailabilityResolver: DateAvailabilityResolver | null = null;
		private cellContentResolver: CellContentResolver | null = null;
		private cellContentStructureResolver: CellContentStructureResolver | null = null;
		private cellClassesResolver: CellClassesResolver | null = null;
		private inputFormat = 'j. n. Y';
		private daysOutOfMonthVisible = false;
		private fixedRowsCount = false;
		private toggleSelection = false;
		private allowEmpty = true;
		private showDeselectButton = true;
		private showResetButton = false;
		private monthAsDropdown = true;
		private yearAsDropdown = true;
		private monthAndYearSeparated = true;
		private classesPrefix = 'the-datepicker__';
		private showCloseButton = true;
		private title = '';
		private dropdownItemsLimit = 200;
		private goBackHtml = '&lt;';
		private goForwardHtml = '&gt;';
		private closeHtml = '&times;';
		private resetHtml = '&olarr;';
		private deselectHtml = '&times;';
		private positionFixing = true;
		private today: Date | null = null;
		private listeners: Listeners = {
			beforeSelect: [],
			select: [],
			beforeOpenAndClose: [],
			openAndClose: [],
			monthChange: [],
			beforeMonthChange: [],
		};

		public constructor(translator: Translator | null = null) {
			this.translator = translator !== null ? translator : new Translator();
			this.document = document;
		}

		public clone(): Options {
			const options = new Options(this.translator);

			options.hideOnBlur = this.hideOnBlur;
			options.hideOnSelect = this.hideOnSelect;
			options.minDate = this.minDate;
			options.maxDate = this.maxDate;
			options.minMonth = this.minMonth;
			options.maxMonth = this.maxMonth;
			options.initialDate = this.initialDate;
			options.initialMonth = this.initialMonth;
			options.initialDatePriority = this.initialDatePriority;
			options.firstDayOfWeek = this.firstDayOfWeek;
			options.dateAvailabilityResolver = this.dateAvailabilityResolver;
			options.cellContentResolver = this.cellContentResolver;
			options.cellContentStructureResolver = this.cellContentStructureResolver;
			options.cellClassesResolver = this.cellClassesResolver;
			options.inputFormat = this.inputFormat;
			options.daysOutOfMonthVisible = this.daysOutOfMonthVisible;
			options.fixedRowsCount = this.fixedRowsCount;
			options.toggleSelection = this.toggleSelection;
			options.allowEmpty = this.allowEmpty;
			options.showDeselectButton = this.showDeselectButton;
			options.showResetButton = this.showResetButton;
			options.monthAsDropdown = this.monthAsDropdown;
			options.yearAsDropdown = this.yearAsDropdown;
			options.monthAndYearSeparated = this.monthAndYearSeparated;
			options.classesPrefix = this.classesPrefix;
			options.showCloseButton = this.showCloseButton;
			options.title = this.title;
			options.dropdownItemsLimit = this.dropdownItemsLimit;
			options.goBackHtml = this.goBackHtml;
			options.goForwardHtml = this.goForwardHtml;
			options.closeHtml = this.closeHtml;
			options.resetHtml = this.resetHtml;
			options.deselectHtml = this.deselectHtml;
			options.positionFixing = this.positionFixing;
			options.listeners.beforeSelect = this.listeners.beforeSelect.slice(0);
			options.listeners.select = this.listeners.select.slice(0);
			options.listeners.beforeOpenAndClose = this.listeners.beforeOpenAndClose.slice(0);
			options.listeners.openAndClose = this.listeners.openAndClose.slice(0);
			options.listeners.monthChange = this.listeners.monthChange.slice(0);
			options.listeners.beforeMonthChange = this.listeners.beforeMonthChange.slice(0);

			return options
		}

		// Setting to true will display datepicker only when input or datepicker itself is focused,
		// otherwise datepicker will be visible always.
		// Works only when there an input exists.
		// defaults to true
		public setHideOnBlur(value: boolean): void {
			this.hideOnBlur = !!value;
		}

		// Setting to true will hide datepicker immediately after selecting a valid date.
		// Works only when the setting HideOnBlur is set to true.
		// Works only when there an input exists.
		// defaults to true
		public setHideOnSelect(value: boolean): void {
			this.hideOnSelect = !!value;
		}

		// Minimal date which can be selected (inclusive).
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or instance of Day
		// or "now" or "today" or "tomorrow" or "yesterday" or string in format "<sign> <number> <unit>"
		// where <sign> is "+" or "-" and is optional, <unit> is one of "day", "month" or "year" or plural version
		// or null for no limit
		// defaults to no limit
		public setMinDate(date: Day | Date | string | null): void {
			const normalizedDate = Helper.normalizeDate('Min date', date, this);
			this.checkConstraints(normalizedDate, this.maxDate);
			this.minDate = normalizedDate;
			this.minMonth = Helper.normalizeMonth(normalizedDate);
		}

		// Maximal date which can be selected (inclusive).
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or instance of Day
		// or "now" or "today" or "tomorrow" or "yesterday" or string in format "<sign> <number> <unit>"
		// where <sign> is "+" or "-" and is optional, <unit> is one of "day", "month" or "year" or plural version
		// or null for no limit
		// defaults to no limit
		public setMaxDate(date: Day | Date | string | null): void {
			const normalizedDate = Helper.normalizeDate('Max date', date, this);
			this.checkConstraints(this.minDate, normalizedDate);
			this.maxDate = normalizedDate;
			this.maxMonth = Helper.normalizeMonth(normalizedDate);
		}

		// Month to be rendered when datepicker opened first time.
		// string in format YYYY-MM; e.g.: "2019-02" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "September 2021"
		// or instance of Date
		// or "now" or "today" or "tomorrow" or "yesterday" or string in format "<sign> <number> <unit>"
		// where <sign> is "+" or "-" and is optional, <unit> is one of "month" or "year" or plural version
		// or null for current month
		// defaults to current month
		public setInitialMonth(month: Date | string | null): void {
			this.initialMonth = Helper.normalizeDate('Initial month', month, this);
		}

		// Preselected date.
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or instance of Day
		// or "now" or "today" or "tomorrow" or "yesterday" or string in format "<sign> <number> <unit>"
		// where <sign> is "+" or "-" and is optional, <unit> is one of "day", "month" or "year" or plural version
		// or null for no value
		// It's overloaded by direct input value, if any.
		// defaults to null
		public setInitialDate(value: Day | Date | string | null): void {
			this.initialDate = Helper.normalizeDate('Initial date', value, this);
		}

		// Setting to true will make initial month ignored when there is any date preselected.
		// defaults to true
		public setInitialDatePriority(value: boolean): void {
			this.initialDatePriority = !!value;
		}

		// Day of week when weeks start.
		// TheDatepicker.DayOfWeek constant, e.g. TheDatepicker.DayOfWeek.Sunday
		// or integer from 0 to 6; 0 = Sunday, 1 = Monday, ... 6 = Saturday
		// defaults to Monday
		public setFirstDayOfWeek(dayOfWeek: DayOfWeek): void {
			this.firstDayOfWeek = Helper.checkNumber('First day of week', dayOfWeek, 0, 6);
		}

		// Accepts callback which gets an instance of Date on input and returns boolean whether given date is available for select or not,
		// or null to make available all days.
		public setDateAvailabilityResolver(resolver: DateAvailabilityResolver | null): void {
			this.dateAvailabilityResolver = Helper.checkFunction('Resolver', resolver) as DateAvailabilityResolver;
		}

		// Accepts callback which gets an instance of Day on input and returns string representing content of day cell,
		// or null for default behavior.
		// Default callback returns day number.
		public setCellContentResolver(resolver: CellContentResolver | null): void {
			this.cellContentResolver = Helper.checkFunction('Resolver', resolver) as (CellContentResolver | null);
		}

		// Accepts two callbacks,
		// or null for default behavior.
		// First callback (init) has no arguments and returns HTMLElement instance representing empty html structure of day cell.
		// Second callback (update) gets an instance of HTMLElement created by first callback, and an instance of Day. It should update html structure by given day. Returns void.
		// Default init creates span element and default update fills it with day number.
		public setCellContentStructureResolver(init: CellContentStructureResolverInit | null, update: CellContentStructureResolverUpdate | null = null): void {
			init = Helper.checkFunction('Resolver (init)', init) as (CellContentStructureResolverInit | null);
			update = Helper.checkFunction('Resolver (update)', update) as (CellContentStructureResolverUpdate | null);

			this.cellContentStructureResolver = init === null ? null : {
				init,
				update,
			};
		}

		// Accepts callback which gets an instance of Day on input and returns array of strings representing custom classes for day cell.
		public setCellClassesResolver(resolver: CellClassesResolver | null): void {
			this.cellClassesResolver = Helper.checkFunction('Resolver', resolver) as (CellClassesResolver | null);
		}

		// Format in which date is printed as an input value.
		// It accepts following placeholders:
		// "j": Day of the month; 1 to 31
		// "d": Day of the month with leading zero; 01 to 31
		// "D": Textual representation of a day of the week; Mo through Su
		// "n": Numeric representation of a month; 1 through 12
		// "m": Numeric representation of a month with leading zero; 01 through 12
		// "F": Textual representation of a month; January through December
		// "Y": Full year; 1999 or 2003
		// "y": Year, 2 digits; 99 or 03
		// Any other character is printed as is.
		// To print a placeholder character as normal character just put a backslash "\" before it (e.g. "\D").
		// Works only when there an input exists.
		// defaults to "j. n. Y"
		public setInputFormat(format: string): void {
			this.inputFormat = Helper.checkString('Input format', format, true);
		}

		// Setting to false will hide days which belongs to other months.
		// defaults to false
		public setDaysOutOfMonthVisible(value: boolean): void {
			this.daysOutOfMonthVisible = !!value;
		}

		// Setting to true will always render six rows despite of current month weeks count.
		// defaults to false
		public setFixedRowsCount(value: boolean): void {
			this.fixedRowsCount = !!value;
		}

		// Setting to true will make selection toggle, so click on selected day will deselects it.
		// Works only when the setting AllowEmpty is set to true.
		// defaults to false
		public setToggleSelection(value: boolean): void {
			this.toggleSelection = !!value;
		}

		// Setting to true will render a button inside an input, which deselects selected date.
		// Works only when there an input exists.
		// Works only when the setting AllowEmpty is set to true.
		// defaults to true
		public setShowDeselectButton(value: boolean): void {
			this.showDeselectButton = !!value;
		}

		// Setting to false will disallow to deselect, in other words it always must be any day selected.
		// When there is no initial date, current date (or nearest available one) will be preselected.
		// defaults to true
		public setAllowEmpty(value: boolean): void {
			this.allowEmpty = !!value;
		}

		// Setting to true will show button for reseting datepicker to initial state.
		// defaults to false
		public setShowResetButton(value: boolean): void {
			this.showResetButton = !!value;
		}

		// Setting to true will render month as dropdown list (html select).
		// defaults to true
		public setMonthAsDropdown(value: boolean): void {
			this.monthAsDropdown = !!value;
		}

		// Setting to true will render year as dropdown list (html select).
		// defaults to true
		public setYearAsDropdown(value: boolean): void {
			this.yearAsDropdown = !!value;
		}

		// Setting to true will render month and year in header each in separate element.
		// It will be rendered as a dropdown only when both settings MonthAsDropdown and YearAsDropdown are set to true.
		// defaults to true
		public setMonthAndYearSeparated(value: boolean): void {
			this.monthAndYearSeparated = !!value;
		}

		// CSS classes of datepicker elements will be prefixed with given string.
		// defaults to "the-datepicker__"
		public setClassesPrefix(prefix: string): void {
			this.classesPrefix = Helper.checkString('Prefix', prefix);
		}

		// Setting to true will show button for closing datepicker.
		// Works only when the setting HideOnBlur is set to true.
		// defaults to true
		public setShowCloseButton(value: boolean): void {
			this.showCloseButton = !!value;
		}

		// Sets title which is displayed in the datepicker header.
		// null for no title
		// defaults to no title
		public setTitle(title: string | null): void {
			this.title = Helper.checkString('Title', title);
		}

		// Limit of number of items in dropdown list.
		// Default is 200.
		public setDropdownItemsLimit(limit: number): void {
			this.dropdownItemsLimit = Helper.checkNumber('Items limit', limit, 1);
		}

		// Sets html for go back button.
		// Defaults to "&lt;"
		public setGoBackHtml(html: string): void {
			this.goBackHtml = Helper.checkString('Html', html);
		}

		// Sets html for go forward button.
		// Defaults to "&gt;"
		public setGoForwardHtml(html: string): void {
			this.goForwardHtml = Helper.checkString('Html', html);
		}

		// Sets html for close button.
		// Defaults to "&times;"
		public setCloseHtml(html: string): void {
			this.closeHtml = Helper.checkString('Html', html);
		}

		// Sets html for reset button.
		// Defaults to "&olarr;"
		public setResetHtml(html: string): void {
			this.resetHtml = Helper.checkString('Html', html);
		}

		// Sets html for deselect button.
		// Defaults to "&times;"
		public setDeselectHtml(html: string): void {
			this.deselectHtml = Helper.checkString('Html', html);
		}

		// Setting to true will render datepicker over the input when there's no enough space to fit it under.
		// Works only when there is no custom container and setting HideOnBlur is set to true.
		// defaults to true
		public setPositionFixing(value: boolean): void {
			this.positionFixing = !!value;
		}

		// Sets mock/fake today.
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or instance of Day
		// or "now" or "today" or "tomorrow" or "yesterday" or string in format "<sign> <number> <unit>"
		// where <sign> is "+" or "-" and is optional, <unit> is one of "day", "month" or "year" or plural version
		// null for real today
		// defaults to null
		public setToday(date: Day | Date | string | null): void {
			this.today = Helper.normalizeDate('Today', date, this);
		}

		// Callback to be called just before the day is selected or deselected.
		// An Event instance, a Day instance (or null when deselected) and previous selected day Day instance (or null when nothing selected before) are given on input.
		// If callback returns false, selection stops and nothing will be selected / deselected.
		public onBeforeSelect(listener: SelectEvent): void {
			this.onEventListener(EventType.BeforeSelect, listener as AnyEvent);
		}

		public offBeforeSelect(listener: SelectEvent | null = null): void {
			this.offEventListener(EventType.BeforeSelect, listener);
		}

		// Callback to be called immediately after the day is selected or deselected.
		// An Event instance, a Day instance (or null when deselected) and previous selected day Day instance (or null when nothing selected before) are given on input.
		public onSelect(listener: SelectEvent): void {
			this.onEventListener(EventType.Select, listener as AnyEvent);
		}

		public offSelect(listener: SelectEvent | null = null): void {
			this.offEventListener(EventType.Select, listener);
		}

		// Callback to be called just before the datepicker is opened or closed.
		// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
		// If callback returns false, action stops and datepicker will not be opened / closed.
		public onBeforeOpenAndClose(listener: OpenAndCloseEvent): void {
			this.onEventListener(EventType.BeforeOpenAndClose, listener as AnyEvent);
		}

		public offBeforeOpenAndClose(listener: OpenAndCloseEvent | null = null): void {
			this.offEventListener(EventType.BeforeOpenAndClose, listener);
		}

		// Callback to be called immediately after the datepicker is opened or closed.
		// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
		public onOpenAndClose(listener: OpenAndCloseEvent): void {
			this.onEventListener(EventType.OpenAndClose, listener as AnyEvent);
		}

		public offOpenAndClose(listener: OpenAndCloseEvent | null = null): void {
			this.offEventListener(EventType.OpenAndClose, listener);
		}

		// Callback to be called just before displayed month is changed.
		// An Event instance, month (Date instance set to first day of month) which is going to be displayed and month (Date instance) which was displayed before are given on input.
		// If callback returns false, month will not be changed.
		public onBeforeMonthChange(listener: MonthChangeEvent): void {
			this.onEventListener(EventType.BeforeMonthChange, listener as AnyEvent);
		}

		public offBeforeMonthChange(listener: MonthChangeEvent | null = null): void {
			this.offEventListener(EventType.BeforeMonthChange, listener);
		}

		// Callback to be called immediately after the datepicker is opened or closed.
		// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
		public onMonthChange(listener: MonthChangeEvent): void {
			this.onEventListener(EventType.MonthChange, listener as AnyEvent);
		}

		public offMonthChange(listener: MonthChangeEvent | null = null): void {
			this.offEventListener(EventType.MonthChange, listener);
		}

		public getInitialMonth(): Date {
			const primarySource = this.initialDatePriority ? this.initialDate : this.initialMonth;
			const secondarySource = this.initialDatePriority ? this.initialMonth : this.initialDate;

			const initialMonth = primarySource !== null
				? new Date(primarySource.getTime())
				: (
					secondarySource !== null
						? new Date(secondarySource.getTime())
						: this.getToday()
				);
			initialMonth.setDate(1);

			return this.correctMonth(initialMonth);
		}

		public isMonthInValidity(month: Date): boolean {
			return this.calculateMonthCorrection(month) === null;
		}

		public correctMonth(month: Date): Date {
			const correctMonth = this.calculateMonthCorrection(month);
			return correctMonth !== null ? correctMonth : month;
		}

		public getInitialDate(): Date | null {
			return this.findPossibleAvailableDate(this.initialDate);
		}

		public findPossibleAvailableDate(date: Date | null): Date | null {
			if (this.isAllowedEmpty()) {
				return date !== null && this.isDateInValidity(date) && this.isDateAvailable(date)
					? new Date(date.getTime())
					: null;
			}

			date = date !== null ? new Date(date.getTime()) : this.getToday();
			date = this.findNearestAvailableDate(date);
			if (date !== null) {
				return date;
			}

			throw new AvailableDateNotFoundException();
		}

		public findNearestAvailableDate(date: Date): Date {
			date = this.correctDate(date);

			if (this.isDateAvailable(date)) {
				return date;
			}

			let maxLoops = 1000; // infinite loop prevention
			let increasedDate: Date | null = date;
			let decreasedDate: Date | null = new Date(date.getTime());
			do {
				if (increasedDate !== null) {
					increasedDate.setDate(increasedDate.getDate() + 1);
					if (this.maxDate !== null && increasedDate.getTime() > this.maxDate.getTime()) {
						increasedDate = null;
					} else if (this.isDateAvailable(increasedDate)) {
						return increasedDate;
					}
				}

				if (decreasedDate !== null) {
					decreasedDate.setDate(decreasedDate.getDate() - 1);
					if (this.minDate !== null && decreasedDate.getTime() < this.minDate.getTime()) {
						decreasedDate = null;
					} else if (this.isDateAvailable(decreasedDate)) {
						return decreasedDate;
					}
				}

				maxLoops--;
			} while ((increasedDate !== null || decreasedDate !== null) && maxLoops > 0);

			return null;
		}

		public isDateInValidity(date: Date): boolean {
			return this.calculateDateCorrection(date) === null;
		}

		private correctDate(date: Date): Date {
			const correctDate = this.calculateDateCorrection(date);
			return correctDate !== null ? correctDate : date;
		}

		public getFirstDayOfWeek(): DayOfWeek {
			return this.firstDayOfWeek;
		}

		public areDaysOutOfMonthVisible(): boolean {
			return this.daysOutOfMonthVisible;
		}

		public hasFixedRowsCount(): boolean {
			return this.fixedRowsCount;
		}

		public hasToggleSelection(): boolean {
			return this.allowEmpty && this.toggleSelection;
		}

		public isAllowedEmpty(): boolean {
			return this.allowEmpty;
		}

		public isDeselectButtonShown(): boolean {
			return this.allowEmpty && this.showDeselectButton;
		}

		public isResetButtonShown(): boolean {
			return this.showResetButton;
		}

		public isMonthAsDropdown(): boolean {
			return this.monthAsDropdown;
		}

		public isYearAsDropdown(): boolean {
			return this.yearAsDropdown;
		}

		public isMonthAndYearSeparated(): boolean {
			return this.monthAndYearSeparated;
		}

		public getClassesPrefix(): string {
			return this.classesPrefix;
		}

		public isCloseButtonShown(): boolean {
			return this.hideOnBlur && this.showCloseButton;
		}

		public getTitle(): string {
			return this.title;
		}

		public getMinDate(): Date | null {
			return this.minDate;
		}

		public getMaxDate(): Date | null {
			return this.maxDate;
		}

		public getMinMonth(): Date | null {
			return this.minMonth;
		}

		public getMaxMonth(): Date | null {
			return this.maxMonth;
		}

		public getDropdownItemsLimit(): number {
			return this.dropdownItemsLimit;
		}

		public isDateAvailable(date: Date): boolean {
			if (this.dateAvailabilityResolver !== null) {
				return !!this.dateAvailabilityResolver(new Date(date.getTime()));
			}

			return true;
		}

		public getCellContent(day: Day): string {
			if (this.cellContentResolver !== null) {
				return this.cellContentResolver(day);
			}

			return day.dayNumber + '';
		}

		public getCellStructure(): HTMLElement {
			if (this.cellContentStructureResolver !== null) {
				return this.cellContentStructureResolver.init();
			}

			return this.document.createElement('span');
		}

		public updateCellStructure(element: HTMLElement, day: Day): void {
			if (this.cellContentStructureResolver !== null) {
				this.cellContentStructureResolver.update(element, day);
			} else {
				element.innerText = this.getCellContent(day);
			}
		}

		public getCellClasses(day: Day): string[] {
			if (this.cellClassesResolver !== null) {
				const classes = this.cellClassesResolver(day);
				if (typeof classes === 'object' && classes.constructor === Array) {
					return classes;
				}
			}

			return [];
		}

		public getGoBackHtml(): string {
			return this.goBackHtml;
		}

		public getGoForwardHtml(): string {
			return this.goForwardHtml;
		}

		public getCloseHtml(): string {
			return this.closeHtml;
		}

		public getResetHtml(): string {
			return this.resetHtml;
		}

		public getDeselectHtml(): string {
			return this.deselectHtml;
		}

		public isHiddenOnBlur(): boolean {
			return this.hideOnBlur;
		}

		public isHiddenOnSelect(): boolean {
			return this.hideOnBlur && this.hideOnSelect;
		}

		public getInputFormat(): string {
			return this.inputFormat;
		}

		public isPositionFixingEnabled(): boolean {
			return this.hideOnBlur && this.positionFixing;
		}

		public getToday(): Date {
			return this.today !== null ? new Date(this.today.getTime()) : Helper.resetTime(new Date());
		}

		private checkConstraints(minDate: Date | null, maxDate: Date | null): void {
			if (
				minDate !== null
				&& maxDate !== null
				&& minDate.getTime() > maxDate.getTime()
			) {
				throw new Error('Min date cannot be higher then max date.');
			}
		}

		private calculateMonthCorrection(month: Date): Date | null {
			const minMonth = this.getMinMonth();
			if (minMonth !== null && month.getTime() < minMonth.getTime()) {
				return minMonth;
			}

			const maxMonth = this.getMaxMonth();
			if (maxMonth !== null && month.getTime() > maxMonth.getTime()) {
				return maxMonth;
			}

			return null;
		}

		private calculateDateCorrection(date: Date): Date | null {
			if (this.minDate !== null && date.getTime() < this.minDate.getTime()) {
				return new Date(this.minDate.getTime());
			}

			if (this.maxDate !== null && date.getTime() > this.maxDate.getTime()) {
				return new Date(this.maxDate.getTime());
			}

			return null;
		}

		private onEventListener(eventType: EventType, listener: AnyEvent) {
			this.listeners[eventType].push(Helper.checkFunction('Event listener', listener, false) as AnyEvent);
		}

		private offEventListener(eventType: EventType, listener: OneOfEvent | null): void {
			listener = Helper.checkFunction('Event listener', listener) as (OneOfEvent | null);

			if (listener === null) {
				this.listeners[eventType] = [];
			} else {
				const newListeners = [];
				for (let index = 0; index < this.listeners[eventType].length; index++) {
					if (this.listeners[eventType][index] !== listener) {
						newListeners.push(this.listeners[eventType][index]);
					}
				}
				this.listeners[eventType] = newListeners as AnyEvent[];
			}
		}

		public triggerEvent(eventType: EventType, caller: EventCaller): boolean {
			for (let index = 0; index < this.listeners[eventType].length; index++) {
				if (caller(this.listeners[eventType][index]) === false) {
					return false;
				}
			}

			return true;
		}

	}

}
