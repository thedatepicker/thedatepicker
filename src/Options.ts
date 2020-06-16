namespace TheDatepicker {

	export enum EventType_ {
		BeforeSelect = 'beforeSelect',
		Select = 'select',
		BeforeOpenAndClose = 'beforeOpenAndClose',
		OpenAndClose = 'openAndClose',
		BeforeMonthChange = 'beforeMonthChange',
		MonthChange = 'monthChange',
		Focus = 'focus',
		BeforeFocus = 'beforeFocus',
	}

	export class AvailableDateNotFoundException {

	}

	export type SelectListener = (event: Event | null, day: Day| null, previousDay: Day| null) => boolean;
	export type OpenAndCloseListener = (event: Event | null, isOpening: boolean) => boolean;
	export type MonthChangeListener = (event: Event | null, month: Date, previousMonth: Date) => boolean;
	export type FocusListener = (event: Event | null, day: Day| null, previousDay: Day| null) => boolean;
	type OneOfListener = SelectListener | OpenAndCloseListener | MonthChangeListener | FocusListener;
	type AnyListener = SelectListener & OpenAndCloseListener & MonthChangeListener & FocusListener;
	type ListenerCaller = (listener: (event: Event | null, ...props: any) => boolean) => boolean;

	interface Listeners {
		beforeSelect: SelectListener[];
		select: SelectListener[];
		beforeOpenAndClose: OpenAndCloseListener[];
		openAndClose: OpenAndCloseListener[];
		beforeMonthChange: MonthChangeListener[];
		monthChange: MonthChangeListener[];
		beforeFocus: FocusListener[];
		focus: FocusListener[];
	}

	type DateAvailabilityResolver = (date: Date) => boolean;

	type CellContentResolver = (day: Day) => string;

	type StructureResolverInit = () => HTMLElement;

	type CellContentStructureResolverUpdate = (element: HTMLElement, day: Day) => void;

	interface CellContentStructureResolver {
		init: StructureResolverInit;
		update: CellContentStructureResolverUpdate;
	}

	type CellClassesResolver = (day: Day) => string[];

	type DayModifier = (day: Day) => void;

	export class Options {

		public readonly translator: Translator;

		private readonly document_: Document;

		private hideOnBlur_ = true;
		private hideOnSelect_ = true;
		private minDate_: Date | null = null;
		private maxDate_: Date | null = null;
		private initialDate_: Date | null = null;
		private initialMonth_: Date | null = null;
		private initialDatePriority_ = true;
		private firstDayOfWeek_ = DayOfWeek.Monday;
		private dateAvailabilityResolver_: DateAvailabilityResolver | null = null;
		private cellContentResolver_: CellContentResolver | null = null;
		private cellContentStructureResolver_: CellContentStructureResolver | null = null;
		private headerStructureResolver_: StructureResolverInit | null = null;
		private footerStructureResolver_: StructureResolverInit | null = null;
		private cellClassesResolver_: CellClassesResolver | null = null;
		private cellClassesResolvers_: CellClassesResolver[] = [];
		private dayModifiers_: DayModifier[] = [];
		private inputFormat_ = 'j. n. Y';
		private daysOutOfMonthVisible_ = false;
		private fixedRowsCount_ = false;
		private toggleSelection_ = false;
		private allowEmpty_ = true;
		private showDeselectButton_ = true;
		private showResetButton_ = false;
		private monthAsDropdown_ = true;
		private yearAsDropdown_ = true;
		private monthAndYearSeparated_ = true;
		private monthShort_ = false;
		private changeMonthOnSwipe_ = true;
		private animateMonthChange_ = true;
		private classesPrefix_ = 'the-datepicker__';
		private showCloseButton_ = true;
		private title_ = '';
		private dropdownItemsLimit_ = 200;
		private hideDropdownWithOneItem_ = true;
		private goBackHtml_ = '&lt;';
		private goForwardHtml_ = '&gt;';
		private closeHtml_ = '&times;';
		private resetHtml_ = '&olarr;';
		private deselectHtml_ = '&times;';
		private positionFixing_ = true;
		private today_: Date | null = null;
		private listeners_: Listeners = {
			beforeSelect: [],
			select: [],
			beforeOpenAndClose: [],
			openAndClose: [],
			beforeMonthChange: [],
			monthChange: [],
			beforeFocus: [],
			focus: [],
		};

		public constructor(translator: Translator | null = null) {
			this.translator = translator !== null ? translator : new Translator();
			this.document_ = document;
		}

		public clone(): Options {
			const options = new Options(this.translator);

			options.hideOnBlur_ = this.hideOnBlur_;
			options.hideOnSelect_ = this.hideOnSelect_;
			options.minDate_ = this.minDate_;
			options.maxDate_ = this.maxDate_;
			options.initialDate_ = this.initialDate_;
			options.initialMonth_ = this.initialMonth_;
			options.initialDatePriority_ = this.initialDatePriority_;
			options.firstDayOfWeek_ = this.firstDayOfWeek_;
			options.dateAvailabilityResolver_ = this.dateAvailabilityResolver_;
			options.cellContentResolver_ = this.cellContentResolver_;
			options.cellContentStructureResolver_ = this.cellContentStructureResolver_;
			options.headerStructureResolver_ = this.headerStructureResolver_;
			options.footerStructureResolver_ = this.footerStructureResolver_;
			options.cellClassesResolver_ = this.cellClassesResolver_;
			options.cellClassesResolvers_ = this.cellClassesResolvers_.slice(0);
			options.dayModifiers_ = this.dayModifiers_.slice(0);
			options.inputFormat_ = this.inputFormat_;
			options.daysOutOfMonthVisible_ = this.daysOutOfMonthVisible_;
			options.fixedRowsCount_ = this.fixedRowsCount_;
			options.toggleSelection_ = this.toggleSelection_;
			options.allowEmpty_ = this.allowEmpty_;
			options.showDeselectButton_ = this.showDeselectButton_;
			options.showResetButton_ = this.showResetButton_;
			options.monthAsDropdown_ = this.monthAsDropdown_;
			options.yearAsDropdown_ = this.yearAsDropdown_;
			options.monthAndYearSeparated_ = this.monthAndYearSeparated_;
			options.monthShort_ = this.monthShort_;
			options.changeMonthOnSwipe_ = this.changeMonthOnSwipe_;
			options.animateMonthChange_ = this.animateMonthChange_;
			options.classesPrefix_ = this.classesPrefix_;
			options.showCloseButton_ = this.showCloseButton_;
			options.title_ = this.title_;
			options.dropdownItemsLimit_ = this.dropdownItemsLimit_;
			options.hideDropdownWithOneItem_ = this.hideDropdownWithOneItem_;
			options.goBackHtml_ = this.goBackHtml_;
			options.goForwardHtml_ = this.goForwardHtml_;
			options.closeHtml_ = this.closeHtml_;
			options.resetHtml_ = this.resetHtml_;
			options.deselectHtml_ = this.deselectHtml_;
			options.positionFixing_ = this.positionFixing_;
			options.listeners_.beforeSelect = this.listeners_.beforeSelect.slice(0);
			options.listeners_.select = this.listeners_.select.slice(0);
			options.listeners_.beforeOpenAndClose = this.listeners_.beforeOpenAndClose.slice(0);
			options.listeners_.openAndClose = this.listeners_.openAndClose.slice(0);
			options.listeners_.beforeMonthChange = this.listeners_.beforeMonthChange.slice(0);
			options.listeners_.monthChange = this.listeners_.monthChange.slice(0);
			options.listeners_.beforeFocus = this.listeners_.beforeFocus.slice(0);
			options.listeners_.focus = this.listeners_.focus.slice(0);

			return options
		}

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
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or instance of Day
		// or "now" or "today" or "tomorrow" or "yesterday" or string in format "<sign> <number> <unit>"
		// where <sign> is "+" or "-" and is optional, <unit> is one of "day", "month" or "year" or plural version
		// or null for no limit
		// defaults to no limit
		public setMinDate(date: Day | Date | string | null): void {
			const normalizedDate = Helper_.normalizeDate_('Min date', date, this);
			this.checkConstraints_(normalizedDate, this.maxDate_);
			this.minDate_ = normalizedDate;
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
			const normalizedDate = Helper_.normalizeDate_('Max date', date, this);
			this.checkConstraints_(this.minDate_, normalizedDate);
			this.maxDate_ = normalizedDate;
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
			this.initialMonth_ = Helper_.normalizeDate_('Initial month', month, this);
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
			this.initialDate_ = Helper_.normalizeDate_('Initial date', value, this);
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
		public setDateAvailabilityResolver(resolver: DateAvailabilityResolver | null): void {
			this.dateAvailabilityResolver_ = Helper_.checkFunction_('Resolver', resolver) as DateAvailabilityResolver;
		}

		// Accepts callback which gets an instance of Day on input and returns string representing content of day cell,
		// or null for default behavior.
		// Default callback returns day number.
		public setCellContentResolver(resolver: CellContentResolver | null): void {
			this.cellContentResolver_ = Helper_.checkFunction_('Resolver', resolver) as (CellContentResolver | null);
		}

		// Accepts two callbacks,
		// or null for default behavior.
		// First callback (init) has no arguments and returns HTMLElement instance representing empty html structure of day cell.
		// Second callback (update) gets an instance of HTMLElement created by first callback, and an instance of Day. It should update html structure by given day. Returns void.
		// Default init creates span element and default update fills it with day number.
		public setCellContentStructureResolver(init: StructureResolverInit | null, update: CellContentStructureResolverUpdate | null = null): void {
			init = Helper_.checkFunction_('Resolver (init)', init) as (StructureResolverInit | null);
			update = Helper_.checkFunction_('Resolver (update)', update) as (CellContentStructureResolverUpdate | null);

			this.cellContentStructureResolver_ = init === null ? null : {
				init,
				update,
			};
		}

		// Accepts callback which has no arguments and returns HTMLElement instance which will be placed as datepicker header,
		// or null for no header.
		// defaults to no header
		public setHeaderStructureResolver(resolver: StructureResolverInit | null): void {
			this.headerStructureResolver_ = Helper_.checkFunction_('Resolver', resolver) as (StructureResolverInit | null);
		}

		// Accepts callback which has no arguments and returns HTMLElement instance which will be placed as datepicker footer,
		// or null for no footer.
		// defaults to no footer
		public setFooterStructureResolver(resolver: StructureResolverInit | null): void {
			this.footerStructureResolver_ = Helper_.checkFunction_('Resolver', resolver) as (StructureResolverInit | null);
		}

		// Accepts callback which gets an instance of Day on input and returns array of strings representing custom classes for day cell.
		// deprecated, use addCellClassesResolver()
		public setCellClassesResolver(resolver: CellClassesResolver | null): void {
			Helper_.warnDeprecatedUsage_('setCellClassesResolver', 'addCellClassesResolver');
			this.cellClassesResolver_ = Helper_.checkFunction_('Resolver', resolver) as (CellClassesResolver | null);
		}

		// Accepts callback which gets an instance of Day on input and returns array of strings representing custom classes for day cell.
		public addCellClassesResolver(resolver: CellClassesResolver): void {
			this.cellClassesResolvers_.push(Helper_.checkFunction_('Resolver', resolver, false) as CellClassesResolver);
		}

		public removeCellClassesResolver(resolver: CellClassesResolver | null = null): void {
			resolver = Helper_.checkFunction_('Resolver', resolver) as (CellClassesResolver | null);

			if (resolver === null) {
				this.cellClassesResolvers_ = [];
			} else {
				const newResolvers: CellClassesResolver[] = [];
				for (let index = 0; index < this.cellClassesResolvers_.length; index++) {
					if (this.cellClassesResolvers_[index] !== resolver) {
						newResolvers.push(this.cellClassesResolvers_[index]);
					}
				}
				this.cellClassesResolvers_ = newResolvers;
			}
		}

		// Accepts callback which gets an instance of Day on input. It is designated to add arbitrary properties to the Day instance.
		public addDayModifier(modifier: DayModifier): void {
			this.dayModifiers_.push(Helper_.checkFunction_('Modifier', modifier, false) as DayModifier);
		}

		public removeDayModifier(modifier: DayModifier | null = null): void {
			modifier = Helper_.checkFunction_('Modifier', modifier) as (DayModifier | null);

			if (modifier === null) {
				this.dayModifiers_ = [];
			} else {
				const newModifiers: DayModifier[] = [];
				for (let index = 0; index < this.dayModifiers_.length; index++) {
					if (this.dayModifiers_[index] !== modifier) {
						newModifiers.push(this.dayModifiers_[index]);
					}
				}
				this.dayModifiers_ = newModifiers;
			}
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
			this.inputFormat_ = Helper_.checkString_('Input format', format, true);
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

		// Setting to true will render month and year in header each in separate element.
		// If set to false it will be rendered as a dropdown only when both settings MonthAsDropdown and YearAsDropdown are set to true.
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

		// If set to true then changing month to next/previous will become animated.
		// defaults to true
		public setAnimateMonthChange(value: boolean): void {
			this.animateMonthChange_ = !!value;
		}

		// CSS classes of datepicker elements will be prefixed with given string.
		// defaults to "the-datepicker__"
		public setClassesPrefix(prefix: string): void {
			this.classesPrefix_ = Helper_.checkString_('Prefix', prefix);
		}

		// Setting to true will show button for closing datepicker.
		// Works only when the setting HideOnBlur is set to true.
		// defaults to true
		public setShowCloseButton(value: boolean): void {
			this.showCloseButton_ = !!value;
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

		// Setting to true will render datepicker over the input when there's no enough space to fit it under.
		// Works only when there is no custom container and setting HideOnBlur is set to true.
		// defaults to true
		public setPositionFixing(value: boolean): void {
			this.positionFixing_ = !!value;
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
			this.today_ = Helper_.normalizeDate_('Today', date, this);
		}

		// Callback to be called just before the day is selected or deselected.
		// An Event instance, a Day instance (or null when deselected) and previous selected day Day instance (or null when nothing selected before) are given on input.
		// If callback returns false, selection stops and nothing will be selected / deselected.
		public onBeforeSelect(listener: SelectListener): void {
			this.onEvent_(EventType_.BeforeSelect, listener as AnyListener);
		}

		public offBeforeSelect(listener: SelectListener | null = null): void {
			this.offEvent_(EventType_.BeforeSelect, listener);
		}

		// Callback to be called immediately after the day is selected or deselected.
		// An Event instance, a Day instance (or null when deselected) and previous selected day Day instance (or null when nothing selected before) are given on input.
		public onSelect(listener: SelectListener): void {
			this.onEvent_(EventType_.Select, listener as AnyListener);
		}

		public offSelect(listener: SelectListener | null = null): void {
			this.offEvent_(EventType_.Select, listener);
		}

		// Callback to be called just before the datepicker is opened or closed.
		// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
		// If callback returns false, action stops and datepicker will not be opened / closed.
		public onBeforeOpenAndClose(listener: OpenAndCloseListener): void {
			this.onEvent_(EventType_.BeforeOpenAndClose, listener as AnyListener);
		}

		public offBeforeOpenAndClose(listener: OpenAndCloseListener | null = null): void {
			this.offEvent_(EventType_.BeforeOpenAndClose, listener);
		}

		// Callback to be called immediately after the datepicker is opened or closed.
		// An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
		public onOpenAndClose(listener: OpenAndCloseListener): void {
			this.onEvent_(EventType_.OpenAndClose, listener as AnyListener);
		}

		public offOpenAndClose(listener: OpenAndCloseListener | null = null): void {
			this.offEvent_(EventType_.OpenAndClose, listener);
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
		// An Event instance, a Day instance (or null when blurred) and previous focused day Day instance (or null when nothing focused before) are given on input.
		// If callback returns false, focus stops and nothing will be focused / blurred.
		public onBeforeFocus(listener: FocusListener): void {
			this.onEvent_(EventType_.BeforeFocus, listener as AnyListener);
		}

		public offBeforeFocus(listener: FocusListener | null = null): void {
			this.offEvent_(EventType_.BeforeFocus, listener);
		}

		// Callback to be called immediately after the day is selected or deselected.
		// An Event instance, a Day instance (or null when deselected) and previous selected day Day instance (or null when nothing selected before) are given on input.
		public onFocus(listener: FocusListener): void {
			this.onEvent_(EventType_.Focus, listener as AnyListener);
		}

		public offFocus(listener: FocusListener | null = null): void {
			this.offEvent_(EventType_.Focus, listener);
		}

		public getInitialMonth(): Date {
			const primarySource = this.initialDatePriority_ ? this.initialDate_ : this.initialMonth_;
			const secondarySource = this.initialDatePriority_ ? this.initialMonth_ : this.initialDate_;

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
			return this.calculateMonthCorrection_(month) === null;
		}

		public correctMonth(month: Date): Date {
			const correctMonth = this.calculateMonthCorrection_(month);
			return correctMonth !== null ? correctMonth : month;
		}

		public getInitialDate(): Date | null {
			return this.findPossibleAvailableDate(this.initialDate_);
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
				if (increasedDate !== null) {
					increasedDate.setDate(increasedDate.getDate() + 1);
					if (increasedDate.getTime() > maxDate) {
						increasedDate = null;
					} else if (this.isDateAvailable(increasedDate)) {
						return increasedDate;
					}
				}

				if (decreasedDate !== null) {
					decreasedDate.setDate(decreasedDate.getDate() - 1);
					if (decreasedDate.getTime() < minDate) {
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
			return this.calculateDateCorrection_(date) === null;
		}

		private correctDate_(date: Date): Date {
			const correctDate = this.calculateDateCorrection_(date);
			return correctDate !== null ? correctDate : date;
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

		public isMonthAndYearSeparated(): boolean {
			return this.monthAndYearSeparated_;
		}

		public isMonthShort(): boolean {
			return this.monthShort_;
		}

		public isMonthChangeOnSwipeEnabled_(): boolean {
			return this.changeMonthOnSwipe_;
		}

		public isMonthChangeAnimated(): boolean {
			return this.animateMonthChange_;
		}

		public getClassesPrefix(): string {
			return this.classesPrefix_;
		}

		public isCloseButtonShown(): boolean {
			return this.hideOnBlur_ && this.showCloseButton_;
		}

		public getTitle(): string {
			return this.title_;
		}

		public getMinDate(): Date | null {
			return this.minDate_ !== null ? new Date(this.minDate_.getTime()) : null;
		}

		public getMaxDate(): Date | null {
			return this.maxDate_ !== null ? new Date(this.maxDate_.getTime()) : null;
		}

		public getMinDate_(): Date {
			const minDate = this.getMinDate();
			if (minDate === null) {
				// Previous month is out of range
				return new Date(-271821, 4, 1);
			}

			return minDate;
		}

		public getMaxDate_(): Date {
			const maxDate = this.getMaxDate();
			if (maxDate === null) {
				// Next month is out of range
				return new Date(275760, 7, 31);
			}

			return maxDate;
		}

		public getMinMonth(): Date | null {
			if (this.minDate_ === null) {
				return null;
			}

			const minMonth = new Date(this.minDate_.getTime());
			minMonth.setDate(1);

			return minMonth;
		}

		public getMaxMonth(): Date | null {
			if (this.maxDate_ === null) {
				return null;
			}

			const maxMonth = new Date(this.maxDate_.getTime());
			maxMonth.setDate(1);

			return maxMonth;
		}

		public getMinMonth_(): Date {
			let minMonth = this.getMinMonth();
			if (minMonth === null) {
				minMonth = this.getMinDate_();
			}

			return minMonth;
		}

		public getMaxMonth_(): Date {
			let maxMonth = this.getMaxMonth();
			if (maxMonth === null) {
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
			if (this.dateAvailabilityResolver_ !== null) {
				return !!this.dateAvailabilityResolver_(new Date(date.getTime()));
			}

			return true;
		}

		public getCellContent(day: Day): string {
			if (this.cellContentResolver_ !== null) {
				return this.cellContentResolver_(day);
			}

			return day.dayNumber + '';
		}

		public prefixClass_(name: string): string {
			return this.classesPrefix_ + name;
		}

		public getCellStructure_(): HTMLElement {
			if (this.cellContentStructureResolver_ !== null) {
				return this.cellContentStructureResolver_.init();
			}

			return this.document_.createElement('span');
		}

		public updateCellStructure_(element: HTMLElement, day: Day): void {
			if (this.cellContentStructureResolver_ !== null) {
				this.cellContentStructureResolver_.update(element, day);
			} else {
				element.innerText = this.getCellContent(day);
			}
		}

		public getHeaderStructure_(): HTMLElement | null {
			return this.headerStructureResolver_ !== null ? this.headerStructureResolver_() : null;
		}

		public getFooterStructure_(): HTMLElement | null {
			return this.footerStructureResolver_ !== null ? this.footerStructureResolver_() : null;
		}

		public getCellClasses(day: Day): string[] {
			let result: string[] = [];

			if (this.cellClassesResolver_ !== null) {
				const classes = this.cellClassesResolver_(day);
				if (typeof classes === 'string') {
					result.push(classes);
				} else if (typeof classes === 'object' && classes.constructor === Array) {
					result = result.concat(classes)
				}
			}

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

		public isPositionFixingEnabled(): boolean {
			return this.hideOnBlur_ && this.positionFixing_;
		}

		public getToday(): Date {
			return this.today_ !== null ? new Date(this.today_.getTime()) : Helper_.resetTime_(new Date());
		}

		public getDateAvailabilityResolver(): DateAvailabilityResolver | null {
			return this.dateAvailabilityResolver_;
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
			return this.cellClassesResolvers_;
		}

		public getDayModifiers(): DayModifier[] {
			return this.dayModifiers_;
		}

		public getBeforeSelectListeners(): SelectListener[] {
			return this.listeners_.beforeSelect;
		}

		public getSelectListeners(): SelectListener[] {
			return this.listeners_.select;
		}

		public getBeforeOpenAndCloseListeners(): OpenAndCloseListener[] {
			return this.listeners_.beforeOpenAndClose;
		}

		public getOpenAndCloseListeners(): OpenAndCloseListener[] {
			return this.listeners_.openAndClose;
		}

		public getBeforeMonthChangeListeners(): MonthChangeListener[] {
			return this.listeners_.beforeMonthChange;
		}

		public getMonthChangeListeners(): MonthChangeListener[] {
			return this.listeners_.monthChange;
		}

		public getBeforeFocusListeners(): FocusListener[] {
			return this.listeners_.beforeFocus;
		}

		public getFocusListeners(): FocusListener[] {
			return this.listeners_.focus;
		}

		private checkConstraints_(minDate: Date | null, maxDate: Date | null): void {
			if (
				minDate !== null
				&& maxDate !== null
				&& minDate.getTime() > maxDate.getTime()
			) {
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

		private onEvent_(eventType: EventType_, listener: AnyListener) {
			this.listeners_[eventType].push(Helper_.checkFunction_('Event listener', listener, false) as AnyListener);
		}

		private offEvent_(eventType: EventType_, listener: OneOfListener | null): void {
			listener = Helper_.checkFunction_('Event listener', listener) as (OneOfListener | null);

			if (listener === null) {
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

}
