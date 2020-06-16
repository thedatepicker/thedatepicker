namespace TheDatepicker {

	export enum MoveDirection_ {
		Left = -1,
		Up = -7,
		Right = 1,
		Down = 7,
	}

	export class ViewModel_ {

		public selectedDate_: Date | null = null;

		private readonly template_: Template_;

		private currentMonth_: Date | null = null;
		private highlightedDay_: Day | null = null;
		private isHighlightedDayFocused_ = false;
		private active_ = false;

		constructor(
			private readonly options_: Options,
			private readonly datepicker_: Datepicker
		) {
			this.template_ = new Template_(this.options_, new HtmlHelper_(this.options_), datepicker_.container, datepicker_.input !== null)
		}

		public render_(): void {
			if (this.selectPossibleDate_()) {
				return;
			}

			const correctMonth = this.options_.correctMonth(this.getCurrentMonth_());
			if (this.goToMonth_(null, correctMonth)) {
				return;
			}

			this.template_.render_(this);
			this.datepicker_.updateInput_();
		}

		public setActive_(event: Event | null, value: boolean): boolean {
			if (this.active_ === value) {
				return true;
			}

			if (!this.triggerOnBeforeOpenAndClose_(event, value)) {
				return false;
			}

			this.active_ = value;

			if (this.options_.isHiddenOnBlur()) {
				this.render_();
			}

			this.triggerOnOpenAndClose_(event, value);

			return true;
		}

		public isActive_(): boolean {
			return this.active_;
		}

		public close_(event: Event): boolean {
			return this.datepicker_.close(event);
		}

		public getCurrentMonth_(): Date {
			if (this.currentMonth_ === null) {
				this.currentMonth_ = this.options_.getInitialMonth();
			}

			return this.currentMonth_;
		}

		public canGoBack_(): boolean {
			const newMonth = new Date(this.getCurrentMonth_().getTime());
			newMonth.setMonth(newMonth.getMonth() - 1);
			return this.canGoToMonth_(newMonth);
		}

		public canGoForward_(): boolean {
			const newMonth = new Date(this.getCurrentMonth_().getTime());
			newMonth.setMonth(newMonth.getMonth() + 1);
			return this.canGoToMonth_(newMonth);
		}

		public canGoToMonth_(month: Date): boolean {
			if (!Helper_.isValidDate_(month)) {
				return false;
			}

			return this.options_.isMonthInValidity(month);
		}

		public goBack_(event: Event): boolean {
			const newMonth = new Date(this.getCurrentMonth_().getTime());
			newMonth.setMonth(newMonth.getMonth() - 1);
			return this.goToMonth_(event, newMonth);
		}

		public goForward_(event: Event): boolean {
			const newMonth = new Date(this.getCurrentMonth_().getTime());
			newMonth.setMonth(newMonth.getMonth() + 1);
			return this.goToMonth_(event, newMonth);
		}

		public goToMonth_(event: Event | null, month: Date, doCancelHighlight = true): boolean {
			month = Helper_.resetTime_(new Date(month.getTime()));
			month.setDate(1);

			if (month.getTime() === this.getCurrentMonth_().getTime() || !this.canGoToMonth_(month)) {
				return false;
			}

			if (!this.triggerOnBeforeMonthChange_(event, month, this.currentMonth_)) {
				return false;
			}

			this.currentMonth_ = month;
			if (!doCancelHighlight || !this.cancelHighlight_(event)) {
				this.render_();
			}

			this.triggerOnMonthChange_(event, month, this.currentMonth_);

			return true;
		}

		public reset_(event: Event | null): boolean {
			const isMonthChanged = this.goToMonth_(event, this.options_.getInitialMonth());
			const isDaySelected = this.selectInitialDate_(event);

			return isMonthChanged || isDaySelected;
		}

		public selectDay_(event: Event | null, date: Day | Date | null, doUpdateMonth = true, doHighlight = false, canToggle = false): boolean {
			if (date === null) {
				return this.cancelSelection_(event);
			}

			let day: Day;
			if (date instanceof Day) {
				day = date;
				date = day.getDate();
			} else {
				day = this.createDay_(date);
			}

			if (!day.isAvailable) {
				return false;
			}

			if (day.isEqualToDate(this.selectedDate_)) {
				if (canToggle && this.options_.hasToggleSelection()) {
					return this.cancelSelection_(event);
				}

				return false;
			}

			const previousDay = this.selectedDate_ !== null ? this.createDay_(this.selectedDate_) : null;

			if (!this.triggerOnBeforeSelect_(event, day, previousDay)) {
				return false;
			}

			this.selectedDate_ = day.getDate();

			if (doHighlight) {
				this.highlightDay_(event, day);
			}

			if (!doUpdateMonth || !this.goToMonth_(event, date)) {
				this.render_();
			}

			this.triggerOnSelect_(event, day, previousDay);

			return true;
		}

		public selectNearestDate_(event: Event | null, date: Date): boolean {
			return this.selectDay_(event, this.options_.findNearestAvailableDate(date));
		}

		public selectPossibleDate_(): boolean {
			try {
				return this.selectDay_(null, this.options_.findPossibleAvailableDate(this.selectedDate_), false);
			} catch (error) {
				if (!(error instanceof AvailableDateNotFoundException)) {
					throw error;
				}
				return this.cancelSelection_(null, true);
			}
		}

		public selectInitialDate_(event: Event | null): boolean {
			try {
				return this.selectDay_(event, this.options_.getInitialDate(), false);
			} catch (error) {
				if (!(error instanceof AvailableDateNotFoundException)) {
					throw error;
				}
				return this.cancelSelection_(null, true);
			}
		}

		public highlightDay_(event: Event, day: Day, doUpdateMonth = false, doFocus = true): boolean {
			if (!day.isAvailable) {
				return false;
			}

			if (day.isEqualToDay(this.highlightedDay_)) {
				return false;
			}

			const previousDay = this.highlightedDay_;

			if (!this.triggerOnBeforeFocus_(event, day, previousDay)) {
				return false;
			}

			this.highlightedDay_ = day;
			if (doFocus) {
				this.isHighlightedDayFocused_ = true;
			}

			const date = day.getDate();
			if (!doUpdateMonth || !this.goToMonth_(event, date, false)) {
				this.render_();
			}

			this.triggerOnFocus_(event, day, previousDay);

			return true;
		}

		public highlightFirstAvailableDay_(event: Event): boolean {
			let date = new Date(this.getCurrentMonth_().getTime());
			const maxDate = this.options_.getMaxDate_();

			let day = this.createDay_(date);
			while (!day.isAvailable) {
				date.setDate(day.dayNumber + 1);
				if (date.getDate() === 1) {
					break;
				}
				if (date.getTime() > maxDate.getTime()) {
					break;
				}

				day = this.createDay_(date);
			}

			return this.highlightDay_(event, day);
		}

		public highlightSiblingDay_(event: Event, day: Day, direction: MoveDirection_): boolean {
			let newDay = day;
			let date = newDay.getDate();
			let maxLoops = 1000; // infinite loop prevention

			do {
				date.setDate(newDay.dayNumber + direction);
				newDay = this.createDay_(date);
				if (!newDay.isInValidity) {
					break;
				}

				maxLoops--;
			} while (!newDay.isAvailable && maxLoops > 0);

			return this.highlightDay_(event, newDay, true);
		}

		public cancelSelection_(event: Event | null, force = false): boolean {
			if (!this.options_.isAllowedEmpty() && !force) {
				return false;
			}

			if (this.selectedDate_ === null) {
				return false;
			}

			const previousDay = this.createDay_(this.selectedDate_);

			if (!this.triggerOnBeforeSelect_(event, null, previousDay)) {
				return false;
			}

			this.selectedDate_ = null;
			this.render_();

			this.triggerOnSelect_(event, null, previousDay);

			return true;
		}

		public cancelHighlight_(event: Event | null): boolean {
			if (this.highlightedDay_ === null) {
				return false;
			}

			const previousDay = this.highlightedDay_;

			if (!this.triggerOnBeforeFocus_(event, null, previousDay)) {
				return false;
			}

			this.highlightedDay_ = null;
			this.render_();

			this.triggerOnFocus_(event, null, previousDay);

			return true;
		}

		public getWeekDays_(): DayOfWeek[] {
			const weekDays = [];
			for (let day = 0; day < 7; day++) {
				weekDays.push((this.options_.getFirstDayOfWeek() + day) % 7);
			}

			return weekDays;
		}

		public getWeeks_(): Day[][] {
			let date;
			const days = [];
			const currentMonth = this.getCurrentMonth_();
			const firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
			const lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
			const prependDaysCount = (firstDateOfMonth.getDay() - this.options_.getFirstDayOfWeek() + 7) % 7;
			for (date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
				const day = this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
				day.isVisible = this.options_.areDaysOutOfMonthVisible();
				day.isInCurrentMonth = false;
				days.push(day);
			}

			const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
			const monthDaysCount = lastDateOfMonth.getDate();
			for (date = 1; date <= monthDaysCount; date++) {
				days.push(this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
			}

			const appendDaysCount = 6 - ((lastDateOfMonth.getDay() - this.options_.getFirstDayOfWeek() + 7) % 7);
			for (date = 1; date <= appendDaysCount; date++) {
				const day = this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
				day.isVisible = this.options_.areDaysOutOfMonthVisible();
				day.isInCurrentMonth = false;
				days.push(day);
			}

			if (this.options_.hasFixedRowsCount()) {
				for (let date = appendDaysCount + 1; days.length < 6 * 7; date++) {
					const day = this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
					day.isVisible = this.options_.areDaysOutOfMonthVisible();
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

		public triggerKeyPress_(event: KeyboardEvent): void {
			if (Helper_.inArray_([KeyCode_.Left, KeyCode_.Up, KeyCode_.Right, KeyCode_.Down], event.keyCode)) {
				Helper_.preventDefault_(event);

				if (this.highlightedDay_ !== null) {
					this.highlightSiblingDay_(event, this.highlightedDay_, this.translateKeyCodeToMoveDirection_(event.keyCode));
				} else if (
					this.selectedDate_ !== null
					&& this.selectedDate_.getFullYear() === this.getCurrentMonth_().getFullYear()
					&& this.selectedDate_.getMonth() === this.getCurrentMonth_().getMonth()
				) {
					this.highlightSiblingDay_(event, this.createDay_(this.selectedDate_), this.translateKeyCodeToMoveDirection_(event.keyCode));
				} else {
					this.highlightFirstAvailableDay_(event);
				}
			}
		}

		private triggerOnBeforeSelect_(event: Event | null, day: Day | null, previousDay: Day | null): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeSelect, (listener: SelectListener) => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private triggerOnSelect_(event: Event | null, day: Day | null, previousDay: Day | null): void {
			this.options_.triggerEvent_(EventType_.Select, (listener: SelectListener) => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private triggerOnBeforeOpenAndClose_(event: Event | null, isOpening: boolean): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeOpenAndClose, (listener: OpenAndCloseListener) => {
				return listener.call(this.datepicker_, event, isOpening);
			});
		}

		private triggerOnOpenAndClose_(event: Event | null, isOpening: boolean): void {
			this.options_.triggerEvent_(EventType_.OpenAndClose, (listener: OpenAndCloseListener) => {
				return listener.call(this.datepicker_, event, isOpening);
			});
		}

		private triggerOnBeforeMonthChange_(event: Event | null, month: Date, previousMonth: Date): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeMonthChange, (listener: MonthChangeListener) => {
				return listener.call(this.datepicker_, event, month, previousMonth);
			});
		}

		private triggerOnMonthChange_(event: Event | null, month: Date, previousMonth: Date): void {
			this.options_.triggerEvent_(EventType_.MonthChange, (listener: MonthChangeListener) => {
				return listener.call(this.datepicker_, event, month, previousMonth);
			});
		}

		private triggerOnBeforeFocus_(event: Event | null, day: Day | null, previousDay: Day | null): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeFocus, (listener: FocusListener) => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private triggerOnFocus_(event: Event | null, day: Day | null, previousDay: Day | null): void {
			this.options_.triggerEvent_(EventType_.Focus, (listener: FocusListener) => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private createDay_(date: Date): Day {
			date = Helper_.resetTime_(new Date(date.getTime()));
			const today = this.options_.getToday();

			const day = new Day(date);
			day.isToday = date.getTime() === today.getTime();
			day.isPast = date.getTime() < today.getTime();
			day.isInValidity = this.options_.isDateInValidity(date);
			day.isAvailable = day.isInValidity && this.options_.isDateAvailable(date);

			if (day.isAvailable) {
				if (day.isEqualToDate(this.selectedDate_)) {
					day.isSelected = true;
				}
				if (day.isEqualToDay(this.highlightedDay_)) {
					day.isHighlighted = true;
					if (this.isHighlightedDayFocused_) {
						day.isFocused = true;
						this.isHighlightedDayFocused_ = false;
					}
				}
			}

			this.options_.modifyDay(day);

			return day;
		}

		private translateKeyCodeToMoveDirection_(key: KeyCode_): MoveDirection_ {
			switch (key) {
				case KeyCode_.Left:
					return MoveDirection_.Left;
				case KeyCode_.Up:
					return MoveDirection_.Up;
				case KeyCode_.Right:
					return MoveDirection_.Right;
				case KeyCode_.Down:
					return MoveDirection_.Down;
				default:
					throw new Error('Invalid key code: ' + key);
			}
		}

	}

}
