namespace TheDatepicker {

	export enum MoveDirection_ {
		Left = -1,
		Up = -7,
		Right = 1,
		Down = 7,
	}

	interface OutsideDates {
		prepend: Date[];
		append: Date[];
	}

	export class ViewModel_ {

		public selectedDate_: Date | null = null;

		private readonly template_: Template_;

		private currentMonth_: Date | null = null;
		private outsideDates_: OutsideDates | null = null;
		private highlightedDay_: Day | null = null;
		private isHighlightedDayFocused_ = false;
		private active_ = false;

		constructor(
			private readonly options_: Options,
			private readonly datepicker_: Datepicker,
			private readonly dateConverter_: DateConverter_
		) {
			this.template_ = new Template_(this.options_, new HtmlHelper_(this.options_), datepicker_.container, !!datepicker_.input)
		}

		public render_(): void {
			if (this.datepicker_.isDestroyed() || this.selectPossibleDate_()) {
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
			if (!this.currentMonth_) {
				this.setCurrentMonth_(this.options_.getInitialMonth());
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

			this.setCurrentMonth_(month);
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
			if (!date) {
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

			const previousDay = this.selectedDate_ ? this.createDay_(this.selectedDate_) : null;

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
			const maxDate = this.options_.getMaxDate_();
			let day = this.createDay_(new Date(this.getCurrentMonth_().getTime()));
			while (!day.isAvailable) {
				const sibling = day.getSibling();
				if (sibling.dayNumber === 1) {
					break;
				}
				if (sibling.getDate().getTime() > maxDate.getTime()) {
					break;
				}

				day = sibling;
			}

			return this.highlightDay_(event, day);
		}

		public highlightSiblingDay_(event: Event, day: Day, direction: MoveDirection_): boolean {
			let newDay = day;
			let maxLoops = 1000; // infinite loop prevention

			do {
				newDay = newDay.getSibling(direction);
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

			if (!this.selectedDate_) {
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
			if (!this.highlightedDay_) {
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
			const days = [];
			const currentMonth = this.getCurrentMonth_();
			const outsideDates = this.getOutsideDates_();

			for (let index = 0; index < outsideDates.prepend.length; index++) {
				const day = this.createDay_(outsideDates.prepend[index]);
				days.push(day);
			}

			const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
			const monthDaysCount = lastDateOfMonth.getDate();
			for (let date = 1; date <= monthDaysCount; date++) {
				days.push(this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
			}

			for (let index = 0; index < outsideDates.append.length; index++) {
				const day = this.createDay_(outsideDates.append[index]);
				days.push(day);
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

				if (this.highlightedDay_) {
					this.highlightSiblingDay_(event, this.highlightedDay_, this.translateKeyCodeToMoveDirection_(event.keyCode));
				} else if (
					this.selectedDate_
					&& this.selectedDate_.getFullYear() === this.getCurrentMonth_().getFullYear()
					&& this.selectedDate_.getMonth() === this.getCurrentMonth_().getMonth()
				) {
					this.highlightSiblingDay_(event, this.createDay_(this.selectedDate_), this.translateKeyCodeToMoveDirection_(event.keyCode));
				} else {
					this.highlightFirstAvailableDay_(event);
				}
			}
		}

		public createDay_(date: Date): Day {
			date = Helper_.resetTime_(new Date(date.getTime()));
			const today = this.options_.getToday();
			const currentMonth = this.getCurrentMonth_();

			const day = new Day(date, (date: Date): Day => {
				return this.createDay_(date);
			}, (date: Date): string => {
				return this.dateConverter_.formatDate_(this.options_.getInputFormat(), date);
			});
			day.isToday = date.getTime() === today.getTime();
			day.isPast = date.getTime() < today.getTime();
			day.isInValidity = this.options_.isDateInValidity(date);
			day.isAvailable = day.isInValidity && this.options_.isDateAvailable(date);
			day.isInCurrentMonth = date.getMonth() === currentMonth.getMonth();
			if (day.isInCurrentMonth) {
				day.isVisible = true;
			} else if (this.options_.areDaysOutOfMonthVisible()) {
				const outsideDates = this.getOutsideDates_();
				const pendants = outsideDates.prepend.concat(outsideDates.append);
				for (let index = 0; index < pendants.length; index++) {
					if (date.getTime() === pendants[index].getTime()) {
						day.isVisible = true;
						break;
					}
				}
			}

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

		private triggerOnBeforeSelect_(event: Event | null, day: Day | null, previousDay: Day | null): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeSelect, (listener: SelectListener): boolean => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private triggerOnSelect_(event: Event | null, day: Day | null, previousDay: Day | null): void {
			this.options_.triggerEvent_(EventType_.Select, (listener: SelectListener): boolean => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private triggerOnBeforeOpenAndClose_(event: Event | null, isOpening: boolean): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeOpenAndClose, (listener: OpenAndCloseListener): boolean => {
				return listener.call(this.datepicker_, event, isOpening);
			});
		}

		private triggerOnOpenAndClose_(event: Event | null, isOpening: boolean): void {
			this.options_.triggerEvent_(EventType_.OpenAndClose, (listener: OpenAndCloseListener): boolean => {
				return listener.call(this.datepicker_, event, isOpening);
			});
		}

		private triggerOnBeforeMonthChange_(event: Event | null, month: Date, previousMonth: Date): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeMonthChange, (listener: MonthChangeListener): boolean => {
				return listener.call(this.datepicker_, event, month, previousMonth);
			});
		}

		private triggerOnMonthChange_(event: Event | null, month: Date, previousMonth: Date): void {
			this.options_.triggerEvent_(EventType_.MonthChange, (listener: MonthChangeListener): boolean => {
				return listener.call(this.datepicker_, event, month, previousMonth);
			});
		}

		private triggerOnBeforeFocus_(event: Event | null, day: Day | null, previousDay: Day | null): boolean {
			return this.options_.triggerEvent_(EventType_.BeforeFocus, (listener: FocusListener): boolean => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private triggerOnFocus_(event: Event | null, day: Day | null, previousDay: Day | null): void {
			this.options_.triggerEvent_(EventType_.Focus, (listener: FocusListener): boolean => {
				return listener.call(this.datepicker_, event, day, previousDay);
			});
		}

		private setCurrentMonth_(month: Date): void
		{
			this.currentMonth_ = month;
			this.outsideDates_ = null;
		}

		private getOutsideDates_(): OutsideDates
		{
			if (this.outsideDates_) {
				return this.outsideDates_;
			}

			const currentMonth = this.getCurrentMonth_();
			const firstDayOfWeek = this.options_.getFirstDayOfWeek();
			const firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
			const lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
			const prependDaysCount = (firstDateOfMonth.getDay() - firstDayOfWeek + 7) % 7;
			const prepend = [];
			for (let date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
				prepend.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
			}

			const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
			const appendDaysCount = 6 - ((lastDateOfMonth.getDay() - firstDayOfWeek + 7) % 7);
			const append = [];
			for (let date = 1; date <= appendDaysCount; date++) {
				append.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
			}

			if (this.options_.hasFixedRowsCount()) {
				const monthDaysCount = lastDateOfMonth.getDate();
				for (let date = appendDaysCount + 1; prependDaysCount + monthDaysCount + append.length < 6 * 7; date++) {
					append.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
				}
			}

			this.outsideDates_ = {
				prepend: prepend,
				append: append,
			};

			return this.outsideDates_;
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
