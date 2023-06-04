import Datepicker from './Datepicker';
import Day from './Day';
import Options, { AvailableDateNotFoundException, EventType_, FocusListener, MonthChangeListener, OpenOrCloseListener, SelectListener } from './Options';
import DateConverter_ from './DateConverter';
import Helper_, { Align, DayOfWeek, KeyCode_ } from './Helper';
import Template_, { YearCellData_ } from './Template';

export enum MoveDirection_ {
	Left = 1,
	Up = 2,
	Right = 3,
	Down = 4,
}

interface OutsideDates {
	prepend: Date[];
	append: Date[];
}

interface TableOfYearsSettings {
	rowsCount: number,
	columnsCount: number,
}

class YearSelectionState {

	public readonly initialPage: number;

	public highlightedYear: number | null = null;
	public isHighlightedYearFocused = false;

	constructor(
		public readonly cellsCount: number,
		public readonly lowestYear: number,
		public readonly maxPage: number,
		private page: number,
	) {
		this.initialPage = page;
	}

	public getPage(): number {
		return this.page;
	}

	public canShiftPage(shift: number): boolean {
		const newPage = this.page + shift;
		return newPage >= 0 && newPage <= this.maxPage;
	}

	public shiftPage(shift: number): boolean {
		if (!this.canShiftPage(shift)) {
			return false;
		}

		this.page += shift;
		return true;
	}

	public getFirstYear(): number {
		return this.lowestYear + this.page * this.cellsCount;
	}

	public getLastYear(): number {
		return this.lowestYear + this.page * this.cellsCount + this.cellsCount - 1;
	}

	public highlightYear(year: number, doFocus = true): boolean {
		if (!this || year === this.highlightedYear) {
			return false;
		}

		this.highlightedYear = year;
		if (doFocus) {
			this.isHighlightedYearFocused = true;
		}

		if (year < this.getFirstYear()) {
			this.shiftPage(-1);
		}
		if (year > this.getLastYear()) {
			this.shiftPage(1);
		}

		return true;
	}

	public cancelHighlight(): boolean {
		if (!this.highlightedYear) {
			return false;
		}

		this.highlightedYear = null;

		return true;
	}

}

export default class ViewModel_ {

	public selectedDate_: Date | null = null;
	public yearSelectionState_: YearSelectionState | null = null;
	public isYearSelectionToggleButtonFocused_ = false;
	private tableOfYearsSettings_: TableOfYearsSettings | null = null;

	private readonly template_: Template_;

	private initialMonth_: Date | null = null;
	private currentMonth_: Date | null = null;
	private outsideDates_: OutsideDates | null = null;
	private highlightedDay_: Day | null = null;
	private isHighlightedDayFocused_ = false;
	private active_ = false;

	constructor(
		private readonly options_: Options,
		private readonly datepicker_: Datepicker,
	) {
		this.template_ = new Template_(this.options_, datepicker_.container, !!datepicker_.input)
	}

	public render_(): void {
		if (this.datepicker_.isDestroyed() || this.selectPossibleDate_()) {
			return;
		}

		const correctMonth = this.options_.correctMonth(this.getCurrentMonth_());
		if (this.goToMonth_(null, correctMonth)) {
			return;
		}

		if (!this.tableOfYearsSettings_) {
			this.tableOfYearsSettings_ = {
				rowsCount: this.options_.getTableOfYearsRowsCount(),
				columnsCount: this.options_.getTableOfYearsColumnsCount(),
			};
		}

		this.template_.render_(this);
		this.datepicker_.updateInput_();
	}

	public setActive_(event: Event | null, value: boolean): boolean {
		if (this.active_ === value) {
			return true;
		}

		if (
			(value && !this.triggerOnBeforeOpen_(event))
			|| (!value && !this.triggerOnBeforeClose_(event))
		) {
			return false
		}

		this.active_ = value;

		if (
			(
				(!value && !this.setYearSelectionActive_(false))
				|| value
			) && this.options_.isHiddenOnBlur()
		) {
			this.render_();
		}

		if (value) {
			this.triggerOnOpen_(event);
		} else {
			this.triggerOnClose_(event);
		}

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
			this.setCurrentMonth_(this.getInitialMonth_());
		}

		return this.currentMonth_;
	}

	public canGoDirection_(isForward: boolean): boolean {
		const delta = isForward ? 1 : -1;

		if (this.yearSelectionState_) {
			return this.yearSelectionState_.canShiftPage(delta);
		}

		const newMonth = new Date(this.getCurrentMonth_().getTime());
		newMonth.setMonth(newMonth.getMonth() + delta);
		return this.canGoToMonth_(newMonth);
	}

	public canGoToMonth_(month: Date): boolean {
		if (!Helper_.isValidDate_(month)) {
			return false;
		}

		return this.options_.isMonthInValidity(month);
	}

	public goDirection_(event: Event, isForward: boolean): boolean {
		const delta = isForward ? 1 : -1;

		if (this.yearSelectionState_) {
			if (this.yearSelectionState_.shiftPage(delta)) {
				this.render_();
			}
			return;
		}

		const newMonth = new Date(this.getCurrentMonth_().getTime());
		newMonth.setMonth(newMonth.getMonth() + delta);
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
		if (!doCancelHighlight || !this.cancelDayHighlight_(event)) {
			this.render_();
		}

		this.triggerOnMonthChange_(event, month, this.currentMonth_);

		return true;
	}

	public reset_(event: Event | null): boolean {
		this.initialMonth_ = null;
		const isMonthChanged = this.goToMonth_(event, this.getInitialMonth_());
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

	public canSetYearSelectionActive_(value: boolean): boolean {
		return !!this.yearSelectionState_ !== value
			&& (
				!value
				|| this.options_.getMinDate_().getFullYear() !== this.options_.getMaxDate_().getFullYear()
			);
	}

	public setYearSelectionActive_(value: boolean): boolean {
		if (this.canSetYearSelectionActive_(value)) {
			this.yearSelectionState_ = value
				? this.createYearSelectionState_()
				: null;
			this.render_();
			return true;
		}

		return false;
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
		let shift: number;
		switch (direction) {
			case MoveDirection_.Left:
				shift = -1;
				break;
			case MoveDirection_.Up:
				shift = -7;
				break;
			case MoveDirection_.Right:
				shift = 1;
				break;
			case MoveDirection_.Down:
				shift = 7;
				break;
		}

		let newDay = day;
		let maxLoops = 1000; // infinite loop prevention

		do {
			newDay = newDay.getSibling(shift);
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

	public cancelDayHighlight_(event: Event | null): boolean {
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

	public highlightYear_(year: number, doFocus = true): boolean {
		if (this.yearSelectionState_ && this.yearSelectionState_.highlightYear(year, doFocus)) {
			this.render_();
			return true;
		}

		return false;
	}

	public highlightSiblingYear_(year: number, direction: MoveDirection_): boolean {
		let shift: number;
		switch (direction) {
			case MoveDirection_.Left:
				shift = -1;
				break;
			case MoveDirection_.Up:
				shift = -this.tableOfYearsSettings_.columnsCount;
				break;
			case MoveDirection_.Right:
				shift = 1;
				break;
			case MoveDirection_.Down:
				shift = this.tableOfYearsSettings_.columnsCount;
				break;
		}

		const newYear = year + shift;
		if (
			newYear < this.options_.getMinDate_().getFullYear()
			|| newYear > this.options_.getMaxDate_().getFullYear()
		) {
			return;
		}

		return this.highlightYear_(newYear, true);
	}

	public cancelYearHighlight_(): boolean {
		if (this.yearSelectionState_ && this.yearSelectionState_.cancelHighlight()) {
			this.render_();
			return true;
		}

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

		this.isHighlightedDayFocused_ = false;

		return weeks;
	}

	public getYearsRows_(): YearCellData_[][] {
		if (!this.yearSelectionState_) {
			return [];
		}

		const yearsData = [];
		const minYear = this.options_.getMinDate_().getFullYear();
		const maxYear = this.options_.getMaxDate_().getFullYear();
		const currentYear = this.getCurrentMonth_().getFullYear();
		const firstYear = this.yearSelectionState_.getFirstYear();
		for (let year = firstYear; year <= firstYear + this.yearSelectionState_.cellsCount; year++) {
			const yearCellData = new YearCellData_(year);
			if (year > maxYear || year < minYear) {
				yearCellData.isAvailable = false;
			} else {
				if (year === currentYear) {
					yearCellData.isSelected = true;
				}
				if (year === this.yearSelectionState_.highlightedYear) {
					yearCellData.isHighlighted = true;
					if (this.yearSelectionState_.isHighlightedYearFocused) {
						yearCellData.isFocused = true;
					}
				}
			}
			yearsData.push(yearCellData);
		}

		const yearsRows = [];
		for (let i = 0; i < yearsData.length; i += this.tableOfYearsSettings_.columnsCount) {
			yearsRows.push(yearsData.slice(i, i + this.tableOfYearsSettings_.columnsCount));
		}

		this.yearSelectionState_.isHighlightedYearFocused

		return yearsRows;
	}

	private createYearSelectionState_(): YearSelectionState {
		let align = this.options_.getTableOfYearsAlign();
		const minDate = this.options_.getMinDate();
		const maxDate = this.options_.getMaxDate();
		const initialYear = this.getInitialMonth_().getFullYear();
		if (
			(align === Align.Left && minDate === null)
			|| (align === Align.Right && maxDate === null)
		) {
			align = null;
		}
		if (!align) {
			if (minDate && maxDate) {
				const lowDiff = initialYear - minDate.getFullYear();
				const highDiff = maxDate.getFullYear() - initialYear;
				align = lowDiff > highDiff ? Align.Right : Align.Left;
			} else if (minDate) {
				align = Align.Left;
			} else if (maxDate) {
				align = Align.Right;
			} else {
				align = Align.Center;
			}
		}

		let lowestYear: number;
		const cellsCount = this.tableOfYearsSettings_.rowsCount * this.tableOfYearsSettings_.columnsCount;
		const minYear = this.options_.getMinDate_().getFullYear();
		const maxYear = this.options_.getMaxDate_().getFullYear();
		switch (align) {
			case Align.Left:
				lowestYear = minYear;
				break;
			case Align.Right:
				lowestYear = minYear - (cellsCount - ((maxYear - minYear) % cellsCount) - 1);
				break;
			case Align.Center:
				const shift = Math.floor(this.tableOfYearsSettings_.rowsCount / 2) * this.tableOfYearsSettings_.columnsCount + Math.floor(this.tableOfYearsSettings_.columnsCount / 2);
				lowestYear = minYear - (cellsCount - ((initialYear + shift - minYear) % cellsCount) - 1);
				break;
			default:
				throw new Error('Invalid align: ' + align);
		}

		const currentYear = this.getCurrentMonth_().getFullYear();
		const page = Math.floor((currentYear - lowestYear) / cellsCount);

		return new YearSelectionState(
			cellsCount,
			lowestYear,
			Math.floor((maxYear - lowestYear) / cellsCount),
			page
		);
	}

	public triggerKeyPress_(event: KeyboardEvent): void {
		if (Helper_.inArray_([KeyCode_.Left, KeyCode_.Up, KeyCode_.Right, KeyCode_.Down], event.keyCode)) {
			Helper_.preventDefault_(event);
			const moveDirection = this.translateKeyCodeToMoveDirection_(event.keyCode);

			if (this.yearSelectionState_) {
				if (this.yearSelectionState_.highlightedYear) {
					this.highlightSiblingYear_(this.yearSelectionState_.highlightedYear, moveDirection);
				} else if (this.yearSelectionState_.getPage() === this.yearSelectionState_.initialPage) {
					this.highlightSiblingYear_(this.getCurrentMonth_().getFullYear(), moveDirection);
				} else {
					this.highlightYear_(this.yearSelectionState_.getPage() === 0 ? this.yearSelectionState_.lowestYear : this.yearSelectionState_.getFirstYear());
				}
			} else {
				if (this.highlightedDay_) {
					this.highlightSiblingDay_(event, this.highlightedDay_, moveDirection);
				} else if (
					this.selectedDate_
					&& this.selectedDate_.getFullYear() === this.getCurrentMonth_().getFullYear()
					&& this.selectedDate_.getMonth() === this.getCurrentMonth_().getMonth()
				) {
					this.highlightSiblingDay_(event, this.createDay_(this.selectedDate_), moveDirection);
				} else {
					this.highlightFirstAvailableDay_(event);
				}
			}
		} else if (event.keyCode === KeyCode_.Esc && this.options_.isClosedOnEscPress()) {
			if (this.yearSelectionState_) {
				this.isYearSelectionToggleButtonFocused_ = true;
				this.setYearSelectionActive_(false);
			} else {
				this.datepicker_.close(event);
			}
		}
	}

	public createDay_(date: Date): Day {
		date = Helper_.resetTime_(new Date(date.getTime()));
		const today = this.options_.getToday();
		const currentMonth = this.getCurrentMonth_();

		const day = new Day(date, (date: Date): Day => {
			return this.createDay_(date);
		}, (date: Date, format: string | null = null): string => {
			return DateConverter_.formatDate_(date, this.options_, format);
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

	private triggerOnBeforeOpen_(event: Event | null): boolean {
		return this.options_.triggerEvent_(EventType_.BeforeOpen, (listener: OpenOrCloseListener): boolean => {
			return listener.call(this.datepicker_, event, true);
		});
	}

	private triggerOnOpen_(event: Event | null): void {
		this.options_.triggerEvent_(EventType_.Open, (listener: OpenOrCloseListener): boolean => {
			return listener.call(this.datepicker_, event, true);
		});
	}

	private triggerOnBeforeClose_(event: Event | null): boolean {
		return this.options_.triggerEvent_(EventType_.BeforeClose, (listener: OpenOrCloseListener): boolean => {
			return listener.call(this.datepicker_, event, false);
		});
	}

	private triggerOnClose_(event: Event | null): void {
		this.options_.triggerEvent_(EventType_.Close, (listener: OpenOrCloseListener): boolean => {
			return listener.call(this.datepicker_, event, false);
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

	private getInitialMonth_(): Date {
		if (!this.initialMonth_) {
			this.initialMonth_ = this.options_.getInitialMonth();
		}
		return this.initialMonth_;
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
