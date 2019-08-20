/// <reference path="Template.ts" />
/// <reference path="Translator.ts" />
/// <reference path="DayOfWeek.ts" />
/// <reference path="Month.ts" />
/// <reference path="Day.ts" />
/// <reference path="DateHelper.ts" />

namespace TheDatepicker {

	export enum EventType {
		BeforeSelect = 'beforeSelect',
		Select = 'select',
	}

	type SelectEvent = (event: Event | null, day: Day| null) => boolean;
	type EventCaller = (listener: (event: Event | null, ...props: any) => boolean) => boolean;

	interface Listeners {
		beforeSelect: SelectEvent[]
		select: SelectEvent[]
	}

	type DateAvailabilityResolver = (date: Date) => boolean;

	export class Options {

		private template: Template;
		private translator: Translator;
		private hideOnBlur = true;
		private hideOnSelect = true;
		private minDate: Date | null = null;
		private maxDate: Date | null = null;
		private initialMonth: Date | null = null;
		private firstDayOfWeek = DayOfWeek.Monday;
		private dateAvailabilityResolver: DateAvailabilityResolver | null = null;
		private inputFormat = 'j. n. Y';
		private hoverEnabled = true;
		private listeners: Listeners = {
			beforeSelect: [],
			select: [],
		};

		public constructor() {
			this.setTemplate(new Template(this, new HtmlHelper()));
			this.setTranslator(new Translator());
		}

		public setTemplate(template: Template): void {
			if (!(template instanceof Template)) {
				throw new Error('Template was expected to an instance of Template, but ' + template + ' given.');
			}

			this.template = template;
		}

		public setTranslator(translator: Translator): void {
			if (!(translator instanceof Translator)) {
				throw new Error('Translator was expected to an instance of Translator, but ' + translator + ' given.');
			}

			this.translator = translator;
		}

		// Setting to true will display datepicker only when input or datepicker itself is focused,
		// otherwise datepicker will be visible always.
		// Works only when there an input exists.
		// defaults to true
		public setHideOnBlur(value: boolean): void {
			if (typeof value !== 'boolean') {
				throw new Error('Whether to hide on blur was expected to boolean, but ' + value + ' given.');
			}

			this.hideOnBlur = value;
		}

		// Setting to true will hide datepicker immediately after selecting a valid date.
		// Works only when the setting HideOnBlur is set to true.
		// Works only when there an input exists.
		// defaults to true
		public setHideOnSelect(value: boolean): void {
			if (typeof value !== 'boolean') {
				throw new Error('Whether to hide on select was expected to boolean, but ' + value + ' given.');
			}

			this.hideOnSelect = value;
		}

		// Minimal date which can be selected (inclusive).
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or null for no limit
		// defaults to no limit
		public setMinDate(date: Date | string | null): void {
			const normalizedDate = this.normalizeDate(date, 'Min date');
			this.checkConstraints(normalizedDate, this.maxDate);
			this.minDate = normalizedDate;
		}

		// Maximal date which can be selected (inclusive).
		// string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or null for no limit
		// defaults to no limit
		public setMaxDate(date: Date | string | null): void {
			const normalizedDate = this.normalizeDate(date, 'Max date');
			this.checkConstraints(this.minDate, normalizedDate);
			this.maxDate = normalizedDate;
		}

		// Month to be rendered when you open datepicker first time.
		// string in format YYYY-MM; e.g.: "2019-02" (months 1-based)
		// or any string which is accepted by Date constructor, e.g.: "7 September 2021"
		// or instance of Date
		// or null for current month
		// defaults to current month
		public setInitialMonth(month: Date | string | null): void {
			this.initialMonth = this.normalizeDate(month, 'Initial month');
		}

		// Day of week when weeks start.
		// TheDatepicker.DayOfWeek constant, e.g. TheDatepicker.DayOfWeek.Sunday
		// or integer from 0 to 6; 0 = Sunday, 1 = Monday, ... 6 = Saturday
		// defaults to Monday
		public setFirstDayOfWeek(dayOfWeek: DayOfWeek): void {
			switch (dayOfWeek) {
				case DayOfWeek.Monday:
				case DayOfWeek.Tuesday:
				case DayOfWeek.Wednesday:
				case DayOfWeek.Thursday:
				case DayOfWeek.Friday:
				case DayOfWeek.Saturday:
				case DayOfWeek.Sunday:
					this.firstDayOfWeek = dayOfWeek;
					break;

				default:
					throw new Error('First day of week was expected to be TheDatepicker.DayOfWeek constant, but ' + dayOfWeek + ' given.');
			}
		}

		// Accepts callback which gets an instance of Date on input and returns boolean whether given date is available for select or not,
		// or null to make available all days.
		public setDateAvailabilityResolver(resolver: DateAvailabilityResolver | null): void
		{
			if (resolver === null) {
				this.dateAvailabilityResolver = null;
			}

			if (typeof resolver !== 'function') {
				throw new Error('Date availability resolver was expected to be function or null, but ' + typeof resolver + ' given.');
			}

			this.dateAvailabilityResolver = resolver;
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
			if (typeof format !== 'string' || format === '') {
				throw new Error('Input format was expected to be a non empty string, but ' + (format === '' ? 'empty string' : typeof format) + ' given.');
			}

			this.inputFormat = format;
		}

		// Setting to true enables hover effect on available days of the calendar.
		// defaults to true
		public setHoverEnabled(value: boolean): void {
			if (typeof value !== 'boolean') {
				throw new Error('Whether is hover enabled was expected to boolean, but ' + value + ' given.');
			}

			this.hoverEnabled = value;
		}

		// Callback to be called just before the day is selected or deselected.
		// An Event instance and a Day instance (or null when deselected) are given on input.
		// If callback returns false, selection stops and nothing will be selected / deselected.
		public onBeforeSelect(listener: SelectEvent) {
			if (typeof listener !== 'function') {
				throw new Error('Event listener was expected to be function, but ' + typeof listener + ' given.');
			}

			this.listeners.beforeSelect.push(listener);
		}

		public offBeforeSelect(listener: SelectEvent | null): void {
			this.offEventListener(EventType.BeforeSelect, listener);
		}

		// Callback to be called immediately after the day is selected or deselected.
		// An Event instance and a Day instance (or null when deselected) are given on input.
		public onSelect(listener: SelectEvent) {
			if (typeof listener !== 'function') {
				throw new Error('Event listener was expected to be function, but ' + typeof listener + ' given.');
			}

			this.listeners.select.push(listener);
		}

		public offSelect(listener: SelectEvent | null): void {
			this.offEventListener(EventType.Select, listener);
		}

		public getTemplate(): Template {
			return this.template;
		}

		public getTranslator(): Translator {
			return this.translator;
		}

		public getInitialMonth(currentMonth: Date | null = null): Date {
			const initialMonth = currentMonth !== null
				? new Date(currentMonth.getTime())
				: (
					this.initialMonth !== null
						? new Date(this.initialMonth.getTime())
						: new Date()
				);
			initialMonth.setDate(1);
			DateHelper.resetTime(initialMonth);

			if (this.minDate !== null) {
				const minDate = new Date(this.minDate.getTime());
				minDate.setDate(1);
				if (initialMonth < minDate) {
					return minDate;
				}
			}

			if (this.maxDate !== null) {
				const maxDate = new Date(this.maxDate.getTime());
				maxDate.setDate(1);
				if (initialMonth > maxDate) {
					return maxDate;
				}
			}

			return initialMonth;
		}

		public getFirstDayOfWeek(): DayOfWeek {
			return this.firstDayOfWeek;
		}

		public isHoverEnabled(): boolean {
			return this.hoverEnabled;
		}

		public getMinDate(): Date | null {
			return this.minDate;
		}

		public getMaxDate(): Date | null {
			return this.maxDate;
		}

		public isDateAvailable(date: Date): boolean {
			if (this.dateAvailabilityResolver !== null) {
				return this.dateAvailabilityResolver(date);
			}

			return true;
		}

		public isHiddenOnBlur(): boolean {
			return this.hideOnBlur;
		}

		public isHiddenOnSelect(): boolean {
			return this.hideOnSelect;
		}

		public getInputFormat(): string {
			return this.inputFormat;
		}

		private normalizeDate(value: Date | string | null, parameterName: string): Date | null {
			if (value === null) {
				return null;
			}

			if (typeof value === 'string') {
				const date = new Date(value);
				if (!isNaN(date.getTime())) {
					DateHelper.resetTime(date);
					return date;
				}

			} else if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
				const date = new Date(value.getTime());
				DateHelper.resetTime(date);
				return date;
			}

			throw new Error(parameterName + ' was expected to be a valid Date string or valid instance of Date or null, ' + value + ' given.');
		}

		private checkConstraints(minDate: Date | null, maxDate: Date | null): void {
			if (
				minDate !== null
				&& maxDate !== null
				&& minDate.getTime() > maxDate.getTime()
			) {
				throw new Error('Min date cannot be higher then max date, given min: ' + minDate.toString() + ', max: ' + maxDate.toString());
			}
		}

		private offEventListener(eventType: EventType, listener: SelectEvent | null): void
		{
			if (listener === null) {
				this.listeners[eventType] = [];
			} else {
				const newListeners = [];
				for (let index = 0; index < this.listeners[eventType].length; index++) {
					if (this.listeners[eventType][index] !== listener) {
						newListeners.push(this.listeners[eventType][index]);
					}
				}
				this.listeners[eventType] = newListeners;
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
