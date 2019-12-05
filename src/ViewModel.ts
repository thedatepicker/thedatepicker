/// <reference path="Datepicker.ts" />

namespace TheDatepicker {

	export enum MoveDirection {
		Left = -1,
		Up = -7,
		Right = 1,
		Down = 7,
	}

	export class ViewModel {

		public selectedDate: Date | null = null;

		private readonly template: Template;

		private currentMonth: Date | null = null;
		private highlightedDay: Day | null = null;
		private isHighlightedDayFocused = false;
		private active = false;

		constructor(
			private readonly options: Options,
			private readonly datepicker: Datepicker
		) {
			this.template = new Template(this.options, new HtmlHelper(this.options), datepicker.container, datepicker.input !== null)
		}

		public render(): void {
			if (this.selectPossibleDate()) {
				return;
			}

			const correctMonth = this.options.correctMonth(this.getCurrentMonth());
			if (this.goToMonth(null, correctMonth)) {
				return;
			}

			this.template.render(this);
			this.datepicker.updateInput();
		}

		public setActive(event: Event | null, value: boolean): boolean {
			if (this.active === value) {
				return true;
			}

			if (!this.triggerOnBeforeOpenAndClose(event, value)) {
				return false;
			}

			this.active = value;

			if (this.options.isHiddenOnBlur()) {
				this.render();
			}

			this.triggerOnOpenAndClose(event, value);

			return true;
		}

		public isActive(): boolean {
			return this.active;
		}

		public close(event: Event): boolean {
			return this.datepicker.close(event);
		}

		public getCurrentMonth(): Date {
			if (this.currentMonth === null) {
				this.currentMonth = this.options.getInitialMonth();
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
			return this.options.isMonthInValidity(month);
		}

		public goBack(event: Event): boolean {
			const newMonth = new Date(this.getCurrentMonth().getTime());
			newMonth.setMonth(newMonth.getMonth() - 1);
			return this.goToMonth(event, newMonth);
		}

		public goForward(event: Event): boolean {
			const newMonth = new Date(this.getCurrentMonth().getTime());
			newMonth.setMonth(newMonth.getMonth() + 1);
			return this.goToMonth(event, newMonth);
		}

		public goToMonth(event: Event | null, month: Date, doCancelHighlight = true): boolean {
			month = Helper.resetTime(new Date(month.getTime()));
			month.setDate(1);

			if (month.getTime() === this.getCurrentMonth().getTime() || !this.canGoToMonth(month)) {
				return false;
			}

			if (!this.triggerOnBeforeMonthChange(event, month, this.currentMonth)) {
				return false;
			}

			this.currentMonth = month;
			if (!doCancelHighlight || !this.cancelHighlight()) {
				this.render();
			}

			this.triggerOnMonthChange(event, month, this.currentMonth);

			return true;
		}

		public reset(event: Event | null): boolean {
			const isMonthChanged = this.goToMonth(event, this.options.getInitialMonth());
			const isDaySelected = this.selectInitialDate(event);

			return isMonthChanged || isDaySelected;
		}

		public selectDay(event: Event | null, date: Day | Date | null, doUpdateMonth = true, doHighlight = false, canToggle = false): boolean {
			if (date === null) {
				return this.cancelSelection(event);
			}

			let day: Day;
			if (date instanceof Day) {
				day = date;
				date = day.getDate();
			} else {
				day = this.createDay(date);
			}

			if (!day.isAvailable) {
				return false;
			}

			if (day.isEqualToDate(this.selectedDate)) {
				if (canToggle && this.options.hasToggleSelection()) {
					return this.cancelSelection(event);
				}

				return false;
			}

			const previousDay = this.selectedDate !== null ? this.createDay(this.selectedDate) : null;

			if (!this.triggerOnBeforeSelect(event, day, previousDay)) {
				return false;
			}

			this.selectedDate = day.getDate();

			if (doHighlight) {
				this.highlightedDay = day;
				this.isHighlightedDayFocused = true;
			}

			if (!doUpdateMonth || !this.goToMonth(event, date)) {
				this.render();
			}

			this.triggerOnSelect(event, day, previousDay);

			return true;
		}

		public selectNearestDate(event: Event | null, date: Date): boolean {
			return this.selectDay(event, this.options.findNearestAvailableDate(date));
		}

		public selectPossibleDate(): boolean {
			try {
				return this.selectDay(null, this.options.findPossibleAvailableDate(this.selectedDate), false);
			} catch (error) {
				if (!(error instanceof AvailableDateNotFoundException)) {
					throw error;
				}
				return this.cancelSelection(null, true);
			}
		}

		public selectInitialDate(event: Event | null): boolean {
			try {
				return this.selectDay(event, this.options.getInitialDate(), false);
			} catch (error) {
				if (!(error instanceof AvailableDateNotFoundException)) {
					throw error;
				}
				return this.cancelSelection(null, true);
			}
		}

		public highlightDay(event: Event, day: Day, doUpdateMonth = false): boolean {
			if (!day.isAvailable) {
				return false;
			}

			if (day.isEqualToDay(this.highlightedDay)) {
				return false;
			}

			this.highlightedDay = day;
			this.isHighlightedDayFocused = true;

			const date = day.getDate();
			if (!doUpdateMonth || !this.goToMonth(event, date, false)) {
				this.render();
			}

			return true;
		}

		public highlightFirstAvailableDay(event: Event): boolean {
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

			return this.highlightDay(event, day);
		}

		public highlightSiblingDay(event: Event, day: Day, direction: MoveDirection): boolean {
			let newDay = day;
			let date = newDay.getDate();
			let maxLoops = 1000; // infinite loop prevention

			do {
				date.setDate(newDay.dayNumber + direction);
				newDay = this.createDay(date);
				if (!newDay.isInValidity) {
					break;
				}

				maxLoops--;
			} while (!newDay.isAvailable && maxLoops > 0);

			return this.highlightDay(event, newDay, true);
		}

		public cancelSelection(event: Event | null, force = false): boolean {
			if (!this.options.isAllowedEmpty() && !force) {
				return false;
			}

			if (this.selectedDate === null) {
				return false;
			}

			const previousDay = this.createDay(this.selectedDate);

			if (!this.triggerOnBeforeSelect(event, null, previousDay)) {
				return false;
			}

			this.selectedDate = null;
			this.render();

			this.triggerOnSelect(event, null, previousDay);

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
				day.isVisible = this.options.areDaysOutOfMonthVisible();
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
				day.isVisible = this.options.areDaysOutOfMonthVisible();
				day.isInCurrentMonth = false;
				days.push(day);
			}

			if (this.options.hasFixedRowsCount()) {
				for (let date = appendDaysCount + 1; days.length < 6 * 7; date++) {
					const day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
					day.isVisible = this.options.areDaysOutOfMonthVisible();
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

		public triggerKeyPress(event: KeyboardEvent): void {
			if (Helper.inArray([KeyCode.Left, KeyCode.Up, KeyCode.Right, KeyCode.Down], event.keyCode)) {
				Helper.preventDefault(event);

				if (this.highlightedDay !== null) {
					this.highlightSiblingDay(event, this.highlightedDay, this.translateKeyCodeToMoveDirection(event.keyCode));
				} else if (
					this.selectedDate !== null
					&& this.selectedDate.getFullYear() === this.getCurrentMonth().getFullYear()
					&& this.selectedDate.getMonth() === this.getCurrentMonth().getMonth()
				) {
					this.highlightSiblingDay(event, this.createDay(this.selectedDate), this.translateKeyCodeToMoveDirection(event.keyCode));
				} else {
					this.highlightFirstAvailableDay(event);
				}
			}
		}

		private triggerOnBeforeSelect(event: Event | null, day: Day | null, previousDay: Day | null): boolean {
			return this.options.triggerEvent(EventType.BeforeSelect, (listener: SelectEvent) => {
				return listener.call(this.datepicker, event, day, previousDay);
			});
		}

		private triggerOnSelect(event: Event | null, day: Day | null, previousDay: Day | null): void {
			this.options.triggerEvent(EventType.Select, (listener: SelectEvent) => {
				return listener.call(this.datepicker, event, day, previousDay);
			});
		}

		private triggerOnBeforeOpenAndClose(event: Event | null, isOpening: boolean): boolean {
			return this.options.triggerEvent(EventType.BeforeOpenAndClose, (listener: OpenAndCloseEvent) => {
				return listener.call(this.datepicker, event, isOpening);
			});
		}

		private triggerOnOpenAndClose(event: Event | null, isOpening: boolean): void {
			this.options.triggerEvent(EventType.OpenAndClose, (listener: OpenAndCloseEvent) => {
				return listener.call(this.datepicker, event, isOpening);
			});
		}

		private triggerOnBeforeMonthChange(event: Event | null, month: Date, previousMonth: Date): boolean {
			return this.options.triggerEvent(EventType.BeforeMonthChange, (listener: MonthChangeEvent) => {
				return listener.call(this.datepicker, event, month, previousMonth);
			});
		}

		private triggerOnMonthChange(event: Event | null, month: Date, previousMonth: Date): void {
			this.options.triggerEvent(EventType.MonthChange, (listener: MonthChangeEvent) => {
				return listener.call(this.datepicker, event, month, previousMonth);
			});
		}

		private createDay(date: Date): Day {
			date = Helper.resetTime(new Date(date.getTime()));
			const today = this.options.getToday();

			const day = new Day(date);
			day.isToday = date.getTime() === today.getTime();
			day.isPast = date.getTime() < today.getTime();
			day.isInValidity = this.options.isDateInValidity(date);
			day.isAvailable = day.isInValidity && this.options.isDateAvailable(date);

			if (day.isAvailable) {
				if (day.isEqualToDate(this.selectedDate)) {
					day.isSelected = true;
				}
				if (day.isEqualToDay(this.highlightedDay)) {
					day.isHighlighted = true;
					if (this.isHighlightedDayFocused) {
						day.isFocused = true;
						this.isHighlightedDayFocused = false;
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
