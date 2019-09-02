/// <reference path="Datepicker.ts" />

namespace TheDatepicker {

	// todo pořešit zda se tedy bude vracet boolean nebo ne (hoverDay, highlightDay...)

	export enum MoveDirection {
		Left = -1,
		Up = -7,
		Right = 1,
		Down = 7,
	}

	export enum KeyCode {
		Enter = 13,
		Space = 32,
		Left = 37,
		Up = 38,
		Right = 39,
		Down = 40,
	}

	export class ViewModel {

		private readonly today: Date;

		private currentMonth: Date | null;
		private selectedDate: Date | null = null;
		private highlightedDay: Day | null = null;
		private isHighlightedDayFocused = false;
		private active = false;

		constructor(
			private readonly options: Options,
			private readonly datepicker: Datepicker
		) {
			const today = new Date();
			DateHelper.resetTime(today);
			this.today = today;
		}

		public render(): void {
			if (this.selectedDate !== null) {
				const selectedDay = this.createDay(this.selectedDate);
				if (!selectedDay.isAvailable) {
					this.selectedDate = null;
				}
			}
			this.currentMonth = this.options.getInitialMonth(this.currentMonth);
			this.options.getTemplate().render(this, this.datepicker);
			this.datepicker.updateInput();
		}

		public setActive(value: boolean): void {
			if (this.active !== value) {
				this.active = value;

				if (this.options.isHiddenOnBlur()) {
					this.render();
				}
			}
		}

		public isActive(): boolean {
			return this.active;
		}

		public getCurrentMonth(): Date {
			if (this.currentMonth === null) {
				throw new Error('Call render() first.');
			}

			return this.currentMonth;
		}

		public canGoBack(): boolean {
			const newMonth = new Date(this.getCurrentMonth().getTime());
			newMonth.setMonth(newMonth.getMonth() - 1);
			return this.canGoToMonth(newMonth);
		}

		public canGoForward(): boolean {
			const newMonth = new Date(this.getCurrentMonth().getTime());
			newMonth.setMonth(newMonth.getMonth() + 1);
			return this.canGoToMonth(newMonth);
		}

		public canGoToMonth(month: Date): boolean {
			if (this.options.getMinDate() !== null) {
				const minDate = new Date(this.options.getMinDate().getTime());
				minDate.setDate(1);
				if (minDate.getTime() > month.getTime()) {
					return false;
				}
			}

			if (this.options.getMaxDate() !== null) {
				const maxDate = new Date(this.options.getMaxDate().getTime());
				maxDate.setDate(1);
				if (maxDate.getTime() < month.getTime()) {
					return false;
				}
			}

			return true;
		}

		public goBack(): void {
			const newMonth = new Date(this.getCurrentMonth().getTime());
			newMonth.setMonth(newMonth.getMonth() - 1);
			this.goToMonth(newMonth);
		}

		public goForward(): void {
			const newMonth = new Date(this.getCurrentMonth().getTime());
			newMonth.setMonth(newMonth.getMonth() + 1);
			this.goToMonth(newMonth);
		}

		public goToMonth(month: Date, doCancelHighlight = true): boolean {
			month = new Date(month.getTime());
			month.setDate(1);
			DateHelper.resetTime(month);

			if (this.canGoToMonth(month) && month.getTime() !== this.getCurrentMonth().getTime()) {
				this.currentMonth = month;
				if (!doCancelHighlight || !this.cancelHighlight()) {
					this.render();
				}

				return true;
			}

			return false;
		}

		public selectDay(event: Event, day: Day): void {
			if (!day.isAvailable) {
				return;
			}

			if (day.isEqualToDate(this.selectedDate)) {
				return;
			}

			if (!this.triggerOnBeforeSelect(event, day)) {
				return;
			}

			this.selectedDate = day.getDate();
			this.highlightedDay = day;
			this.isHighlightedDayFocused = true;

			this.render();

			this.triggerOnSelect(event, day);
		}

		public selectDate(event: Event | null, date: Date | null): boolean {
			if (date === null) {
				return this.cancelSelection(event);
			}

			const day = this.createDay(date);

			if (!day.isAvailable) {
				return false;
			}

			if (day.isEqualToDate(this.selectedDate)) {
				return false;
			}

			if (!this.triggerOnBeforeSelect(event, day)) {
				return false;
			}

			this.selectedDate = day.getDate();
			if (!this.goToMonth(date)) {
				this.render();
			}

			this.triggerOnSelect(event, day);

			return true;
		}

		public selectDateSince(event: Event | null, date: Date): void {
			const maxDate = this.options.getMaxDate();
			let maxLoops = 100; // infinite loop prevention

			let day = this.createDay(date);
			date = day.getDate();
			while (!day.isAvailable && maxLoops > 0) {
				date.setDate(day.dayNumber + 1);
				if (maxDate !== null && date.getTime() > maxDate.getTime()) {
					break;
				}

				day = this.createDay(date);
				maxLoops--;
			}

			this.selectDate(event, date);
		}

		public highlightDay(day: Day, doFocus = true, doUpdateMonth = false): boolean {
			if (!day.isAvailable) {
				return false;
			}

			if (day.isEqualToDay(this.highlightedDay)) {
				return false;
			}

			this.highlightedDay = day;
			this.isHighlightedDayFocused = doFocus;

			let isRendered = false;
			const date = day.getDate();
			if (doUpdateMonth) {
				isRendered = this.goToMonth(date, false);
			}

			if (!isRendered) {
				this.render();
			}

			return true;
		}

		public highlightFirstAvailableDay(): void {
			let date = new Date(this.getCurrentMonth().getTime());
			const maxDate = this.options.getMaxDate();

			let day = this.createDay(date);
			while (!day.isAvailable) {
				date.setDate(day.dayNumber + 1);
				if (date.getDate() === 1) {
					break;
				}
				if (maxDate !== null && date.getTime() > maxDate.getTime()) {
					break;
				}

				day = this.createDay(date);
			}

			this.highlightDay(day);
		}

		public highlightSiblingDay(day: Day, direction: MoveDirection): void {
			let newDay = day;
			let date = newDay.getDate();
			let maxLoops = 30; // infinite loop prevention

			do {
				date.setDate(newDay.dayNumber + direction);
				newDay = this.createDay(date);
				if (!newDay.isInValidity) {
					break;
				}

				maxLoops--;
			} while (!newDay.isAvailable && maxLoops > 0);

			this.highlightDay(newDay, true, true);
		}

		public hoverDay(day: Day): boolean {
			if (!this.options.isHoverEnabled()) {
				return false;
			}

			return this.highlightDay(day, false);
		}

		public cancelSelection(event: Event | null): boolean {
			if (this.selectedDate === null) {
				return false;
			}

			if (!this.triggerOnBeforeSelect(event, null)) {
				return false;
			}

			this.selectedDate = null;
			this.render();

			this.triggerOnSelect(event, null);

			return true;
		}

		public cancelHighlight(): boolean {
			if (this.highlightedDay === null) {
				return false;
			}

			this.highlightedDay = null;

			this.render();

			return true;
		}

		public cancelHover(): boolean {
			if (!this.options.isHoverEnabled()) {
				return;
			}

			this.cancelHighlight();
		}

		public getWeekDays(): DayOfWeek[] {
			const weekDays = [];
			for (let day = 0; day < 7; day++) {
				weekDays.push((this.options.getFirstDayOfWeek() + day) % 7);
			}

			return weekDays;
		}

		public getWeeks(): Day[][] {
			let date;
			const days = [];
			const currentMonth = this.getCurrentMonth();
			const firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
			const lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
			const prependDaysCount = (firstDateOfMonth.getDay() - this.options.getFirstDayOfWeek() + 7) % 7;
			for (date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
				const day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
				day.isInCurrentMonth = false;
				days.push(day);
			}

			const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
			const monthDaysCount = lastDateOfMonth.getDate();
			for (date = 1; date <= monthDaysCount; date++) {
				days.push(this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
			}

			const appendDaysCount = 6 - ((lastDateOfMonth.getDay() - this.options.getFirstDayOfWeek() + 7) % 7);
			for (date = 1; date <= appendDaysCount; date++) {
				const day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
				day.isInCurrentMonth = false;
				days.push(day);
			}

			if (this.options.hasFixedRowsCount()) {
				for (let date = appendDaysCount + 1; days.length < 6 * 7; date++) {
					const day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
					day.isInCurrentMonth = false;
					days.push(day);
				}
			}

			const weeks = [];
			for (let i = 0; i < days.length; i += 7) {
				weeks.push(days.slice(i, i + 7));
			}

			return weeks;
		}

		public getSelectedDate(): Date | null {
			return this.selectedDate;
		}

		public triggerKeyPress(event: KeyboardEvent, target: HTMLElement): void {
			if ([KeyCode.Left, KeyCode.Up, KeyCode.Right, KeyCode.Down].indexOf(event.keyCode) > -1) {
				event.preventDefault();

				if (this.highlightedDay !== null) {
					this.highlightSiblingDay(this.highlightedDay, this.translateKeyCodeToMoveDirection(event.keyCode));
				} else if (
					this.selectedDate !== null
					&& this.selectedDate.getFullYear() === this.getCurrentMonth().getFullYear()
					&& this.selectedDate.getMonth() === this.getCurrentMonth().getMonth()
				) {
					this.highlightSiblingDay(this.createDay(this.selectedDate), this.translateKeyCodeToMoveDirection(event.keyCode));
				} else {
					this.highlightFirstAvailableDay();
				}
			}
		}

		private triggerOnBeforeSelect(event: Event | null, day: Day | null): boolean {
			return this.options.triggerEvent(EventType.BeforeSelect, (listener) => {
				return listener(event, day);
			});
		}

		private triggerOnSelect(event: Event, day: Day | null): void {
			// todo v prohlížeči se vyrendrované html objeví až poté co se zavolá alert v listeneru... proč?
			this.options.triggerEvent(EventType.Select, (listener) => {
				return listener(event, day);
			});
		}

		// todo udělat customizovatelný + customizovatelný classy pro cell
		private createDay(date: Date): Day {
			date = new Date(date.getTime());
			DateHelper.resetTime(date);
			const dateTime = date.getTime();
			const todayTime = this.today.getTime();

			const day = new Day(date);
			day.isToday = dateTime === todayTime;
			day.isPast = dateTime < todayTime;
			day.isInValidity = (
				this.options.getMinDate() === null
				|| dateTime >= this.options.getMinDate().getTime()
			) && (
				this.options.getMaxDate() === null
				|| dateTime <= this.options.getMaxDate().getTime()
			);
			day.isAvailable = day.isInValidity && this.options.isDateAvailable(date);

			if (day.isAvailable) {
				if (day.isEqualToDate(this.selectedDate)) {
					day.isSelected = true;
				}
				if (day.isEqualToDay(this.highlightedDay)) {
					day.isHighlighted = true;
					if (this.isHighlightedDayFocused) {
						day.isFocused = true;
					}
				}
			}

			return day;
		}

		private translateKeyCodeToMoveDirection(key: KeyCode): MoveDirection {
			switch (key) {
				case KeyCode.Left:
					return MoveDirection.Left;
				case KeyCode.Up:
					return MoveDirection.Up;
				case KeyCode.Right:
					return MoveDirection.Right;
				case KeyCode.Down:
					return MoveDirection.Down;
				default:
					throw new Error('Invalid key code: ' + key);
			}
		}

	}

}
