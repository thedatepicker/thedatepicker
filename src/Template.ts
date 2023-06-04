import Day from './Day';
import Options from './Options';
import ViewModel_ from './ViewModel';
import HtmlHelper_, { Option } from './HtmlHelper';
import { ClassNameType } from './ClassNames';
import { MoveDirection_ } from './ViewModel';
import { TitleName } from './Translator';
import Helper_, { DayOfWeek, ListenerType_ } from './Helper';

interface HTMLDayButtonElement extends HTMLAnchorElement {

	day: Day;

}

export class YearCellData_ {

	public isAvailable = true;
	public isSelected = false;
	public isHighlighted = false;
	public isFocused = false;

	public constructor(public readonly yearNumber: number) {
	}

}

interface HTMLYearButtonElement extends HTMLAnchorElement {

	yearCellData: YearCellData_;

}

interface Range {

	from: number;
	to: number;

}

interface DropdownDiff {

	prepend: number[];
	append: number[];
	remove: HTMLOptionElement[];

}

interface MonthAndYear {

	month: number;
	year: number;

}

type AfterSlideListener = () => void;

export default class Template_ {

	private mainElement_: HTMLElement | null = null;
	private bodyElement_: HTMLElement | null = null;
	private tablesElement_: HTMLElement | null = null;
	private tableElement_: HTMLElement | null = null;
	private tableOfYearsElement_: HTMLElement | null = null;
	private controlElement_: HTMLElement | null = null;
	private goBackElement_: HTMLAnchorElement | null = null;
	private goForwardElement_: HTMLAnchorElement | null = null;
	private titleElement_: HTMLElement | null = null;
	private titleContentElement_: HTMLElement | null = null;
	private resetElement_: HTMLElement | null = null;
	private resetButton_: HTMLAnchorElement | null = null;
	private closeElement_: HTMLElement | null = null;
	private closeButton_: HTMLAnchorElement | null = null;
	private monthSelect_: HTMLSelectElement | null = null;
	private monthElement_: HTMLElement | null = null;
	private yearActiveElement_: HTMLAnchorElement | HTMLSelectElement | null = null;
	private yearTextElement_: HTMLElement | null = null;
	private monthAndYearSelect_: HTMLSelectElement | null = null;
	private monthAndYearElement_: HTMLElement | null = null;
	private weeksElements_: HTMLElement[] = [];
	private daysElements_: HTMLElement[][] = [];
	private daysButtonsElements_: HTMLDayButtonElement[][] = [];
	private daysContentsElements_: HTMLElement[][] = [];
	private yearsElements_: HTMLElement[][] = [];
	private yearsButtonsElements_: HTMLYearButtonElement[][] = [];
	private yearsContentsElements_: HTMLElement[][] = [];

	private onAfterSlide_: AfterSlideListener[] | null = null;

	public constructor(
		private readonly options_: Options,
		private readonly container_: HTMLElement,
		private readonly hasInput_: boolean
	) {
	}

	public render_(viewModel: ViewModel_): void {
		if (!this.mainElement_) {
			if (this.hasInput_ && this.options_.isHiddenOnBlur() && !viewModel.isActive_()) {
				return;
			}

			this.container_.innerHTML = '';
			this.container_.appendChild(this.createSkeleton_(viewModel));
		}

		this.updateMainElement_(viewModel);
		this.updateTableElements_(viewModel);
		this.updateTopElement_(viewModel);
		this.updateTitleElement_(viewModel);
		this.updateCloseElement_(viewModel);
		this.updateResetElement_(viewModel);
		this.updateGoElement_(viewModel, false);
		this.updateGoElement_(viewModel, true);
		this.updateMonthElement_(viewModel);
		this.updateYearElement_(viewModel);
		this.updateMonthAndYearElement_(viewModel);
		this.updateWeeksElements_(viewModel);
		this.updateTableOfYearsRowsElements_(viewModel);
	}

	protected createSkeleton_(viewModel: ViewModel_): HTMLElement {
		const main = HtmlHelper_.createDiv_(ClassNameType.Main, this.options_);

		HtmlHelper_.appendChild_(main, this.options_.getHeaderStructure_());
		main.appendChild(this.createHeaderElement_(viewModel));
		main.appendChild(this.createBodyElement_(viewModel));
		HtmlHelper_.appendChild_(main, this.options_.getFooterStructure_());

		this.mainElement_ = main;

		return main;
	}

	protected updateMainElement_(viewModel: ViewModel_): void {
		this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? '' : 'none';
		this.mainElement_.className = '';
		HtmlHelper_.addClass_(this.mainElement_, ClassNameType.Main, this.options_);
		if (this.options_.isDarkModeEnabled()) {
			HtmlHelper_.addClass_(this.mainElement_, ClassNameType.MainDarkMode, this.options_);
		}
	}

	protected updateTableElements_(viewModel: ViewModel_): void {
		this.tableElement_.style.display = viewModel.yearSelectionState_ ? 'none' : '';
		if (this.tableOfYearsElement_) {
			this.tableOfYearsElement_.style.display = viewModel.yearSelectionState_ ? '' : 'none';
		}
	}

	protected createBodyElement_(viewModel: ViewModel_): HTMLElement {
		const body = HtmlHelper_.createDiv_(ClassNameType.Body, this.options_);
		const tables = HtmlHelper_.createDiv_(ClassNameType.Tables, this.options_);
		body.appendChild(tables);

		if (this.options_.isMonthChangeOnSwipeEnabled() || this.options_.isTableOfYearsOnSwipeDownEnabled()) {
			HtmlHelper_.addClass_(body, ClassNameType.BodySwipeable, this.options_);
			Helper_.addSwipeListener_(body, (event: TouchEvent, moveDirection: MoveDirection_): void => {
				let isForward = false;
				let change: (() => void) | null = null;

				switch (moveDirection) {
					case MoveDirection_.Down:
						isForward = true;
						// noinspection FallThroughInSwitchStatementJS
					case MoveDirection_.Up:
						if (this.tableOfYearsElement_ && this.options_.isTableOfYearsOnSwipeDownEnabled() && viewModel.canSetYearSelectionActive_(isForward)) {
							change = () => {
								viewModel.setYearSelectionActive_(isForward);
							};
						}
						break;
					case MoveDirection_.Left:
						isForward = true;
						// noinspection FallThroughInSwitchStatementJS
					case MoveDirection_.Right:
						if (this.options_.isMonthChangeOnSwipeEnabled() && viewModel.canGoDirection_(isForward)) {
							change = () => {
								viewModel.goDirection_(event, isForward);
							};
						}
				}

				if (change) {
					this.slideTable_(viewModel, moveDirection, change);
				}
			});
		}

		const tableElement = this.createTableElement_(viewModel);
		tables.appendChild(tableElement);
		this.tableElement_ = tableElement;

		if (this.options_.isYearSelectedFromTableOfYears()) {
			const tableOfYearsElement = this.createTableOfYearsElement_(viewModel);
			tables.appendChild(tableOfYearsElement);
			this.tableOfYearsElement_ = tableOfYearsElement;
		}

		this.bodyElement_ = body;
		this.tablesElement_ = tables;

		return body;
	}

	protected createHeaderElement_(viewModel: ViewModel_): HTMLElement {
		const header = HtmlHelper_.createDiv_(ClassNameType.Header, this.options_);

		const top = HtmlHelper_.createDiv_(ClassNameType.HeaderTop, this.options_);
		header.appendChild(top);

		top.appendChild(this.createTitleElement_(viewModel));

		const control = HtmlHelper_.createDiv_(ClassNameType.HeaderControl, this.options_);
		top.appendChild(control);

		control.appendChild(this.createResetElement_(viewModel));
		control.appendChild(this.createCloseElement_(viewModel));

		const navigation = HtmlHelper_.createDiv_(ClassNameType.HeaderNavigation, this.options_);
		header.appendChild(navigation);

		navigation.appendChild(this.createGoElement_(viewModel, false));

		const state = HtmlHelper_.createDiv_(ClassNameType.HeaderState, this.options_);
		navigation.appendChild(state);

		if (this.options_.isMonthAndYearSeparated()) {
			state.appendChild(this.createMonthElement_(viewModel));
			state.appendChild(this.createYearElement_(viewModel));
		} else {
			state.appendChild(this.createMonthAndYearElement_(viewModel));
		}

		navigation.appendChild(this.createGoElement_(viewModel, true));

		this.controlElement_ = control;

		return header;
	}

	protected updateTopElement_(viewModel: ViewModel_): void {
		const isVisible = this.options_.getTitle() !== ''
			|| this.options_.isResetButtonShown()
			|| (this.hasInput_ && this.options_.isCloseButtonShown());
		this.controlElement_.style.display = isVisible ? '' : 'none';
		this.titleElement_.style.display = isVisible ? '' : 'none';
	}

	protected createTitleElement_(viewModel: ViewModel_): HTMLElement {
		const titleElement = HtmlHelper_.createDiv_(ClassNameType.HeaderTitle, this.options_);
		const titleContent = HtmlHelper_.createSpan_();
		titleElement.appendChild(titleContent);
		HtmlHelper_.addClass_(titleContent, ClassNameType.HeaderTitleContent, this.options_);
		this.titleElement_ = titleElement;
		this.titleContentElement_ = titleContent;

		return titleElement;
	}

	protected updateTitleElement_(viewModel: ViewModel_): void {
		const title = this.options_.getTitle();
		this.titleContentElement_.style.display = title !== '' ? '' : 'none';
		this.titleContentElement_.innerText = title;
	}

	protected createResetElement_(viewModel: ViewModel_): HTMLElement {
		const resetElement = HtmlHelper_.createDiv_(ClassNameType.Reset, this.options_);
		const resetButton = HtmlHelper_.createAnchor_((event: Event): void => {
			viewModel.reset_(event);
		}, this.options_);

		resetButton.innerHTML = this.options_.getResetHtml();
		resetElement.appendChild(resetButton);
		this.resetButton_ = resetButton;
		this.resetElement_ = resetElement;

		return resetElement;
	}

	protected updateResetElement_(viewModel: ViewModel_): void {
		this.resetElement_.style.display = this.options_.isResetButtonShown() ? '' : 'none';
		this.updateTitle_(this.resetButton_, TitleName.Reset);
	}

	protected createCloseElement_(viewModel: ViewModel_): HTMLElement {
		const closeElement = HtmlHelper_.createDiv_(ClassNameType.Close, this.options_);
		const closeButton = HtmlHelper_.createAnchor_((event: Event): void => {
			viewModel.close_(event);
		}, this.options_);

		closeButton.innerHTML = this.options_.getCloseHtml();
		closeElement.appendChild(closeButton);
		this.closeButton_ = closeButton;
		this.closeElement_ = closeElement;

		return closeElement;
	}

	protected updateCloseElement_(viewModel: ViewModel_): void {
		this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? '' : 'none';
		this.updateTitle_(this.closeButton_, TitleName.Close);
	}

	protected createGoElement_(viewModel: ViewModel_, isForward: boolean): HTMLElement {
		const goElement = HtmlHelper_.createDiv_(ClassNameType.Go, this.options_);
		HtmlHelper_.addClass_(goElement, isForward ? ClassNameType.GoNext : ClassNameType.GoPrevious, this.options_);
		const goButton = HtmlHelper_.createAnchor_((event: Event): void => {
			const moveDirection = isForward ? MoveDirection_.Left : MoveDirection_.Right;
			if (viewModel.canGoDirection_(isForward)) {
				this.slideTable_(viewModel, moveDirection, (): void => {
					viewModel.goDirection_(event, isForward);
				});
			}
		}, this.options_);

		goButton.innerHTML = isForward ? this.options_.getGoForwardHtml() : this.options_.getGoBackHtml();
		goElement.appendChild(goButton);

		if (isForward) {
			this.goForwardElement_ = goButton;
		} else {
			this.goBackElement_ = goButton;
		}

		return goElement;
	}

	protected updateGoElement_(viewModel: ViewModel_, isForward: boolean): void {
		const goElement = isForward ? this.goForwardElement_ : this.goBackElement_;
		goElement.style.visibility = viewModel.canGoDirection_(isForward) ? 'visible' : 'hidden';
		this.updateTitle_(goElement, viewModel.yearSelectionState_
			? (isForward ? TitleName.GoForwardTableOfYears : TitleName.GoBackTableOfYears)
			: (isForward ? TitleName.GoForward : TitleName.GoBack)
		);
	}

	protected createMonthElement_(viewModel: ViewModel_): HTMLElement {
		const options: Option[] = [];
		for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
			options.push({
				value: monthNumber + '',
				label: this.translateMonth_(monthNumber),
			});
		}

		const selectElement = HtmlHelper_.createSelectInput_(options, (event: Event, monthNumber: string): void => {
			const currentMonth = viewModel.getCurrentMonth_();
			const newMonth = new Date(currentMonth.getTime());
			newMonth.setMonth(parseInt(monthNumber, 10));
			if (!viewModel.goToMonth_(event, newMonth)) {
				this.monthSelect_.value = currentMonth.getMonth() + '';
			}
		}, this.options_);

		const monthElement = HtmlHelper_.createDiv_(ClassNameType.HeaderMonth, this.options_);
		const monthContent = HtmlHelper_.createSpan_();
		monthElement.appendChild(selectElement);
		monthElement.appendChild(monthContent);

		this.monthElement_ = monthContent;
		this.monthSelect_ = selectElement;

		return monthElement;
	}

	protected updateMonthElement_(viewModel: ViewModel_): void {
		if (!this.monthElement_) {
			return;
		}

		const currentMonth = viewModel.getCurrentMonth_().getMonth();
		this.monthElement_.innerText = this.translateMonth_(currentMonth);
		this.updateTitle_(this.monthSelect_, TitleName.Month);

		if (!this.options_.isMonthAsDropdown()) {
			this.monthSelect_.style.display = 'none';
			this.monthElement_.style.display = '';
			return;
		}

		let valuesCount = 0;
		for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
			const newMonth = new Date(viewModel.getCurrentMonth_().getTime());
			newMonth.setMonth(monthNumber);
			const option = this.monthSelect_.getElementsByTagName('option')[monthNumber];
			const canGoToMonth = viewModel.canGoToMonth_(newMonth);
			option.disabled = !canGoToMonth;
			option.style.display = canGoToMonth ? '' : 'none';
			valuesCount += canGoToMonth ? 1 : 0;
		}

		this.monthSelect_.value = currentMonth + '';

		const showSelect = !this.options_.isDropdownWithOneItemHidden() || valuesCount > 1;
		this.monthSelect_.style.display = showSelect ? '' : 'none';
		this.monthElement_.style.display = showSelect ? 'none' : '';
	}

	protected createYearElement_(viewModel: ViewModel_): HTMLElement {
		const yearElement = HtmlHelper_.createDiv_(ClassNameType.HeaderYear, this.options_);
		let yearActiveElement: HTMLAnchorElement | HTMLSelectElement;

		if (this.options_.isYearSelectedFromTableOfYears()) {
			yearActiveElement = HtmlHelper_.createAnchor_((): void => {
				this.slideTable_(viewModel, viewModel.yearSelectionState_ ? MoveDirection_.Up : MoveDirection_.Down, (): void => {
					viewModel.setYearSelectionActive_(!viewModel.yearSelectionState_);
				});
			}, this.options_);

			HtmlHelper_.addClass_(yearActiveElement, ClassNameType.HeaderYearsToggle, this.options_);

		} else {
			yearActiveElement = HtmlHelper_.createSelectInput_([], (event: Event, year: string): void => {
				const currentMonth = viewModel.getCurrentMonth_();
				let newMonth = new Date(currentMonth.getTime());
				newMonth.setFullYear(parseInt(year, 10));

				const minMonth = this.options_.getMinMonth_();
				const maxMonth = this.options_.getMaxMonth_();
				if (newMonth.getTime() < minMonth.getTime()) {
					newMonth = minMonth;
				}
				if (newMonth.getTime() > maxMonth.getTime()) {
					newMonth = maxMonth;
				}

				if (!viewModel.goToMonth_(event, newMonth)) {
					(this.yearActiveElement_ as HTMLSelectElement).value = currentMonth.getFullYear() + '';
				}
			}, this.options_);
		}

		const yearTextElement = HtmlHelper_.createSpan_();
		yearElement.appendChild(yearActiveElement);
		yearElement.appendChild(yearTextElement);

		this.yearTextElement_ = yearTextElement;
		this.yearActiveElement_ = yearActiveElement;

		return yearElement;
	}

	protected updateYearElement_(viewModel: ViewModel_): void {
		if (!this.yearTextElement_) {
			return;
		}

		const currentYear = viewModel.getCurrentMonth_().getFullYear();
		this.yearTextElement_.innerText = currentYear + '';
		this.updateTitle_(this.yearActiveElement_, TitleName.Year);

		const minYear = this.options_.getMinDate_().getFullYear();
		const maxYear = this.options_.getMaxDate_().getFullYear();

		if (this.tableOfYearsElement_) {
			this.yearActiveElement_.innerText = currentYear + '';
			if (viewModel.isYearSelectionToggleButtonFocused_) {
				this.yearActiveElement_.focus();
				viewModel.isYearSelectionToggleButtonFocused_ = false;
			}

		} else if (this.options_.isYearAsDropdown()) {
			const range = this.calculateDropdownRange_(currentYear, minYear, maxYear);

			const options = this.yearActiveElement_.getElementsByTagName('option');
			const diff = this.calculateDropdownDiff_(options, range, (value: string): number => {
				return parseInt(value, 10);
			});

			for (let index = 0; index < diff.remove.length; index++) {
				this.yearActiveElement_.removeChild(diff.remove[index]);
			}
			for (let index = diff.prepend.length - 1; index >= 0; index--) {
				this.yearActiveElement_.insertBefore(HtmlHelper_.createSelectOption_(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearActiveElement_.firstChild);
			}
			for (let index = 0; index < diff.append.length; index++) {
				this.yearActiveElement_.appendChild(HtmlHelper_.createSelectOption_(diff.append[index] + '', diff.append[index] + ''));
			}

			(this.yearActiveElement_ as HTMLSelectElement).value = currentYear + '';

		} else {
			this.yearActiveElement_.style.display = 'none';
			this.yearTextElement_.style.display = '';
			return;
		}

		const showSelect = !this.options_.isDropdownWithOneItemHidden() || minYear !== maxYear;
		this.yearActiveElement_.style.display = showSelect ? '' : 'none';
		this.yearTextElement_.style.display = showSelect ? 'none' : '';
	}

	protected createMonthAndYearElement_(viewModel: ViewModel_): HTMLElement {
		const monthAndYear = HtmlHelper_.createDiv_(ClassNameType.HeaderMonthYear, this.options_);

		const selectElement = HtmlHelper_.createSelectInput_([], (event: Event, value: string): void => {
			const currentMonth = viewModel.getCurrentMonth_();
			let newMonth = new Date(currentMonth.getTime());
			const data = this.parseMonthAndYearOptionValue_(value);
			newMonth.setFullYear(data.year);
			newMonth.setMonth(data.month);

			if (!viewModel.goToMonth_(event, newMonth)) {
				this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_({
					month: currentMonth.getMonth(),
					year: currentMonth.getFullYear(),
				});
			}
		}, this.options_);

		const monthAndYearContent = HtmlHelper_.createSpan_();
		this.monthAndYearElement_ = monthAndYearContent;
		this.monthAndYearSelect_ = selectElement;
		monthAndYear.appendChild(monthAndYearContent);
		monthAndYear.appendChild(selectElement);

		return monthAndYear;
	}

	protected updateMonthAndYearElement_(viewModel: ViewModel_): void {
		if (!this.monthAndYearElement_) {
			return;
		}

		const currentMonth = viewModel.getCurrentMonth_();
		const currentData: MonthAndYear = {
			month: currentMonth.getMonth(),
			year: currentMonth.getFullYear(),
		};
		const currentIndex = this.calculateMonthAndYearIndex_(currentData);
		this.monthAndYearElement_.innerText = this.translateMonthAndYear_(currentData);

		if (!this.options_.isYearAsDropdown() || !this.options_.isMonthAsDropdown()) {
			this.monthAndYearSelect_.style.display = 'none';
			this.monthAndYearElement_.style.display = '';
			return;
		}

		const minDate = this.options_.getMinDate_();
		const maxDate = this.options_.getMaxDate_();
		const minIndex = minDate.getFullYear() * 12 + minDate.getMonth();
		const maxIndex = maxDate.getFullYear() * 12 + maxDate.getMonth();
		const range = this.calculateDropdownRange_(currentIndex, minIndex, maxIndex);

		const options = this.monthAndYearSelect_.getElementsByTagName('option');
		const diff = this.calculateDropdownDiff_(options, range, (value: string): number => {
			return this.calculateMonthAndYearIndex_(this.parseMonthAndYearOptionValue_(value));
		});

		for (let index = 0; index < diff.remove.length; index++) {
			this.monthAndYearSelect_.removeChild(diff.remove[index]);
		}
		for (let index = diff.prepend.length - 1; index >= 0; index--) {
			const data = this.getMonthAndYearByIndex_(diff.prepend[index]);
			this.monthAndYearSelect_.insertBefore(HtmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
		}
		for (let index = 0; index < diff.append.length; index++) {
			const data = this.getMonthAndYearByIndex_(diff.append[index]);
			this.monthAndYearSelect_.appendChild(HtmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
		}

		this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);

		const showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
		this.monthAndYearSelect_.style.display = showSelect ? '' : 'none';
		this.monthAndYearElement_.style.display = showSelect ? 'none' : '';
	}

	private translateMonthAndYear_(data: MonthAndYear): string {
		return this.translateMonth_(data.month) + ' ' + data.year;
	}

	private calculateMonthAndYearIndex_(data: MonthAndYear): number {
		return data.year * 12 + data.month;
	}

	private getMonthAndYearByIndex_(index: number): MonthAndYear {
		return {
			year: Math.floor(index / 12),
			month: index % 12,
		}
	}

	private getMonthAndYearOptionValue_(data: MonthAndYear): string {
		return data.year + '-' + data.month;
	}

	private parseMonthAndYearOptionValue_(value: string): MonthAndYear {
		const parts = value.split('-');
		return {
			month: parseInt(parts[1], 10),
			year: parseInt(parts[0], 10),
		}
	}

	private calculateDropdownRange_(current: number, min: number, max: number): Range {
		const limit = this.options_.getDropdownItemsLimit() - 1;
		const maxAppend = Math.ceil(limit / 2);
		let from = current - (limit - maxAppend);
		let to = current + maxAppend;
		if (from < min) {
			to += min - from;
			if (to > max) {
				to = max;
			}
			from = min;
		} else if (to > max) {
			from -= to - max;
			if (from < min) {
				from = min;
			}
			to = max;
		}

		return {
			from,
			to,
		};
	}

	private calculateDropdownDiff_(options: HTMLCollectionOf<HTMLOptionElement>, newRange: Range, getNumerical: (value: string) => number): DropdownDiff {
		const firstOption = options.length > 0 ? getNumerical(options[0].value) : null;
		const lastOption = options.length > 0 ? getNumerical(options[options.length - 1].value) : null;
		const prepend = [];
		const append = [];
		const remove = [];
		for (let value = newRange.from; value <= newRange.to; value++) {
			if (firstOption === null || value < firstOption) {
				prepend.push(value);
			} else if (value > lastOption) {
				append.push(value);
			}
		}
		for (let index = 0; index < options.length; index++) {
			const value = getNumerical(options[index].value);
			if (value < newRange.from || value > newRange.to) {
				remove.push(options[index]);
			}
		}

		return {
			prepend,
			append,
			remove,
		};
	}

	protected createTableElement_(viewModel: ViewModel_): HTMLElement {
		const tableHeader = this.createTableHeaderElement_(viewModel) as HTMLTableSectionElement;
		const tableBody = this.createTableBodyElement_(viewModel) as HTMLTableSectionElement;

		const table = HtmlHelper_.createTable_(tableHeader, tableBody, ClassNameType.CalendarTable, this.options_);
		HtmlHelper_.addClass_(table, ClassNameType.Table, this.options_);
		return table;
	}

	protected createTableHeaderElement_(viewModel: ViewModel_): HTMLElement {
		const weekDays = viewModel.getWeekDays_();

		const cells = [];
		for (let index = 0; index < weekDays.length; index++) {
			const dayOfWeek = weekDays[index];
			cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
		}

		return HtmlHelper_.createTableHeader_(cells as HTMLTableHeaderCellElement[], ClassNameType.CalendarTableHeader, this.options_);
	}

	protected createTableHeaderCellElement_(viewModel: ViewModel_, dayOfWeek: DayOfWeek): HTMLElement {
		const headerCell = HtmlHelper_.createTableHeaderCell_(ClassNameType.CalendarTableHeaderCell, this.options_);

		if (dayOfWeek === DayOfWeek.Saturday || dayOfWeek === DayOfWeek.Sunday) {
			HtmlHelper_.addClass_(headerCell, ClassNameType.WeekDayWeekend, this.options_);
		}

		headerCell.innerText = this.options_.translator.translateDayOfWeek(dayOfWeek);

		return headerCell;
	}

	protected createTableBodyElement_(viewModel: ViewModel_): HTMLElement {
		this.daysElements_ = [];
		this.daysButtonsElements_ = [];
		this.daysContentsElements_ = [];

		const rows = [];
		for (let index = 0; index < 6; index++) {
			rows.push(this.createTableRowElement_(viewModel));
		}
		this.weeksElements_ = rows;

		return HtmlHelper_.createTableBody_(rows as HTMLTableRowElement[], ClassNameType.CalendarTableBody, this.options_);
	}

	protected updateWeeksElements_(viewModel: ViewModel_): void {
		if (viewModel.yearSelectionState_) {
			return;
		}

		const weeks = viewModel.getWeeks_();

		for (let weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
			const weekElement = this.weeksElements_[weekIndex];
			const week = weeks.length > weekIndex ? weeks[weekIndex] : null;

			weekElement.style.display = week ? '' : 'none';

			if (week) {
				for (let dayIndex = 0; dayIndex < this.daysElements_[weekIndex].length; dayIndex++) {
					this.updateDayElement_(
						viewModel,
						this.daysElements_[weekIndex][dayIndex],
						this.daysButtonsElements_[weekIndex][dayIndex],
						this.daysContentsElements_[weekIndex][dayIndex],
						week[dayIndex]
					);
				}
			}
		}
	}

	protected createTableRowElement_(viewModel: ViewModel_): HTMLElement {
		const cells = [];
		const cellsButtons = [];
		const cellsContents = [];
		for (let index = 0; index < 7; index++) {
			const cell = HtmlHelper_.createTableCell_();
			const cellButton = this.createTableCellButtonElement_(viewModel);
			const cellContent = this.createTableCellContentElement_(viewModel);

			cells.push(cell);
			cellsButtons.push(cellButton);
			cellsContents.push(cellContent);

			cell.appendChild(cellButton);
			cellButton.appendChild(cellContent);
		}
		this.daysElements_.push(cells);
		this.daysButtonsElements_.push(cellsButtons);
		this.daysContentsElements_.push(cellsContents);

		return HtmlHelper_.createTableRow_(cells as HTMLTableCellElement[], this.options_);
	}

	protected updateDayElement_(
		viewModel: ViewModel_,
		dayElement: HTMLElement,
		dayButtonElement: HTMLDayButtonElement,
		dayContentElement: HTMLElement,
		day: Day
	): void {
		dayButtonElement.day = day;
		dayElement.setAttribute('data-date', day.getFormatted());
		dayElement.className = '';
		HtmlHelper_.addClass_(dayElement, ClassNameType.TableCell, this.options_);
		this.options_.updateCellStructure_(dayContentElement, day);

		if (!day.isVisible) {
			dayButtonElement.removeAttribute('href');
			dayButtonElement.style.visibility = 'hidden';
			return;
		}

		HtmlHelper_.addClass_(dayElement, ClassNameType.Day, this.options_);
		if (day.isToday) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.DayToday, this.options_);
		}
		if (day.isPast) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.DayPast, this.options_);
		}
		if (day.isWeekend) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.DayWeekend, this.options_);
		}
		if (!day.isAvailable) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.TableCellUnavailable, this.options_);
			HtmlHelper_.addClass_(dayElement, ClassNameType.DayUnavailable, this.options_);
		}
		if (!day.isInCurrentMonth) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.DayOutside, this.options_);
		}
		if (day.isHighlighted) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.TableCellHighlighted, this.options_);
			HtmlHelper_.addClass_(dayElement, ClassNameType.DayHighlighted, this.options_);
		}
		if (day.isSelected) {
			HtmlHelper_.addClass_(dayElement, ClassNameType.TableCellSelected, this.options_);
			HtmlHelper_.addClass_(dayElement, ClassNameType.DaySelected, this.options_);
		}
		const customClasses = this.options_.getCellClasses(day);
		for (let index = 0; index < customClasses.length; index++) {
			dayElement.className += ' ' + customClasses[index];
		}

		dayButtonElement.style.visibility = 'visible';

		if (day.isAvailable) {
			dayButtonElement.href = '#';
		} else {
			dayButtonElement.removeAttribute('href');
		}

		if (day.isFocused) {
			dayButtonElement.focus();
		}
	}

	protected createTableCellButtonElement_(viewModel: ViewModel_): HTMLDayButtonElement {
		const cellButton = HtmlHelper_.createAnchor_((event: Event): void => {
			const previous = viewModel.selectedDate_;
			const isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
			if (this.options_.isHiddenOnSelect() && (isSelected || (previous && cellButton.day.isEqualToDate(previous)))) {
				viewModel.close_(event);
			}
		}, this.options_) as HTMLDayButtonElement;

		HtmlHelper_.addClass_(cellButton, ClassNameType.DayButton, this.options_);

		cellButton.onfocus = (event: FocusEvent): void => {
			viewModel.highlightDay_(event || window.event, cellButton.day);
		};

		cellButton.onmouseenter = (event: MouseEvent): void => {
			if (this.options_.getBeforeFocusListeners().length > 0 || this.options_.getFocusListeners().length > 0) {
				viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
			} else {
				// optimization
				viewModel.cancelDayHighlight_(event || window.event);
			}
		};

		cellButton.onmouseleave = (event: MouseEvent): void => {
			viewModel.cancelDayHighlight_(event || window.event);
		};

		return cellButton;
	}

	protected createTableCellContentElement_(viewModel: ViewModel_): HTMLElement {
		const cellContent = this.options_.getCellStructure_();
		HtmlHelper_.addClass_(cellContent, ClassNameType.ButtonContent, this.options_);
		HtmlHelper_.addClass_(cellContent, ClassNameType.DayButtonContent, this.options_);

		return cellContent;
	}

	protected createTableOfYearsElement_(viewModel: ViewModel_): HTMLElement {
		const tableBody = this.createTableOfYearsBodyElement_(viewModel) as HTMLTableSectionElement;

		const table = HtmlHelper_.createTable_(null, tableBody, ClassNameType.YearsTable, this.options_);
		HtmlHelper_.addClass_(table, ClassNameType.Table, this.options_);
		return table;
	}

	protected createTableOfYearsBodyElement_(viewModel: ViewModel_): HTMLElement {
		this.yearsElements_ = [];
		this.yearsButtonsElements_ = [];
		this.yearsContentsElements_ = [];

		const rows = [];
		for (let index = 0; index < this.options_.getTableOfYearsRowsCount(); index++) {
			rows.push(this.createTableOfYearsRowElement_(viewModel));
		}

		return HtmlHelper_.createTableBody_(rows as HTMLTableRowElement[], ClassNameType.YearsTableBody, this.options_);
	}

	protected updateTableOfYearsRowsElements_(viewModel: ViewModel_): void {
		if (!viewModel.yearSelectionState_) {
			return;
		}

		const rows = viewModel.getYearsRows_();

		for (let rowIndex = 0; rowIndex < this.yearsElements_.length; rowIndex++) {
			const cells = rows.length > rowIndex ? rows[rowIndex] : null;

			if (cells) {
				for (let columnIndex = 0; columnIndex < this.yearsElements_[rowIndex].length; columnIndex++) {
					this.updateTableOfYearsCellElement_(
						viewModel,
						this.yearsElements_[rowIndex][columnIndex],
						this.yearsButtonsElements_[rowIndex][columnIndex],
						this.yearsContentsElements_[rowIndex][columnIndex],
						cells[columnIndex]
					);
				}
			}
		}
	}

	protected updateTableOfYearsCellElement_(
		viewModel: ViewModel_,
		yearElement: HTMLElement,
		yearButtonElement: HTMLYearButtonElement,
		yearContentElement: HTMLElement,
		yearCellData: YearCellData_
	): void {
		yearButtonElement.yearCellData = yearCellData;
		yearElement.setAttribute('data-year', yearCellData.yearNumber + '');
		yearElement.className = '';
		HtmlHelper_.addClass_(yearElement, ClassNameType.TableCell, this.options_);
		yearContentElement.innerText = yearCellData.yearNumber + '';

		if (yearCellData.isAvailable) {
			yearButtonElement.href = '#';
		} else {
			yearButtonElement.removeAttribute('href');
			if (this.options_.areYearsOutOfTableOfYearsVisible()) {
				HtmlHelper_.addClass_(yearElement, ClassNameType.TableCellUnavailable, this.options_);
			} else {
				yearButtonElement.style.visibility = 'hidden';
				return;
			}
		}
		if (yearCellData.isHighlighted) {
			HtmlHelper_.addClass_(yearElement, ClassNameType.TableCellHighlighted, this.options_);
		}
		if (yearCellData.isSelected) {
			HtmlHelper_.addClass_(yearElement, ClassNameType.TableCellSelected, this.options_);
		}

		yearButtonElement.style.visibility = 'visible';

		if (yearCellData.isFocused) {
			yearButtonElement.focus();
		}
	}

	protected createTableOfYearsRowElement_(viewModel: ViewModel_): HTMLElement {
		const cells = [];
		const cellsButtons = [];
		const cellsContents = [];
		for (let index = 0; index < this.options_.getTableOfYearsColumnsCount(); index++) {
			const cell = HtmlHelper_.createTableCell_();
			const cellButton = this.createTableOfYearsCellButtonElement_(viewModel);
			const cellContent = this.createTableOfYearsCellContentElement_(viewModel);

			cells.push(cell);
			cellsButtons.push(cellButton);
			cellsContents.push(cellContent);

			cell.appendChild(cellButton);
			cellButton.appendChild(cellContent);
		}
		this.yearsElements_.push(cells);
		this.yearsButtonsElements_.push(cellsButtons);
		this.yearsContentsElements_.push(cellsContents);

		return HtmlHelper_.createTableRow_(cells as HTMLTableCellElement[], this.options_);
	}

	protected createTableOfYearsCellButtonElement_(viewModel: ViewModel_): HTMLYearButtonElement {
		const cellButton = HtmlHelper_.createAnchor_((event: Event): void => {
			const newMonth = new Date(cellButton.yearCellData.yearNumber, viewModel.getCurrentMonth_().getMonth(), 1);
			const correctMonth = this.options_.correctMonth(newMonth);

			if (correctMonth.getFullYear() === newMonth.getFullYear()) {
				viewModel.goToMonth_(event, correctMonth)
				viewModel.isYearSelectionToggleButtonFocused_ = true;
				this.slideTable_(viewModel, MoveDirection_.Up, (): void => {
					viewModel.setYearSelectionActive_(false);
				});
			}
		}, this.options_) as HTMLYearButtonElement;

		HtmlHelper_.addClass_(cellButton, ClassNameType.YearCellButton, this.options_);

		cellButton.onfocus = (): void => {
			viewModel.highlightYear_(cellButton.yearCellData.yearNumber);
		};

		cellButton.onmouseenter = (): void => {
			viewModel.cancelYearHighlight_();
		};

		cellButton.onmouseleave = (): void => {
			viewModel.cancelYearHighlight_();
		};

		return cellButton;
	}

	protected createTableOfYearsCellContentElement_(viewModel: ViewModel_): HTMLElement {
		const cellContent = HtmlHelper_.createSpan_();
		HtmlHelper_.addClass_(cellContent, ClassNameType.ButtonContent, this.options_);
		HtmlHelper_.addClass_(cellContent, ClassNameType.YearCellButtonContent, this.options_);

		return cellContent;
	}

	private slideTable_(viewModel: ViewModel_, moveDirection: MoveDirection_, onComplete: () => void): void {
		if (!this.options_.isSlideAnimationEnabled() || !Helper_.isCssAnimationSupported_()) {
			onComplete();
			return;
		}

		const trigger = (): void => {
			let animationOut: ClassNameType;
			let animationIn: ClassNameType;
			switch (moveDirection) {
				case MoveDirection_.Left:
					animationOut = ClassNameType.AnimateFadeOutLeft;
					animationIn = ClassNameType.AnimateFadeInRight;
					break;
				case MoveDirection_.Up:
					animationOut = ClassNameType.AnimateFadeOutUp;
					animationIn = ClassNameType.AnimateFadeInDown;
					break;
				case MoveDirection_.Right:
					animationOut = ClassNameType.AnimateFadeOutRight;
					animationIn = ClassNameType.AnimateFadeInLeft;
					break;
				case MoveDirection_.Down:
					animationOut = ClassNameType.AnimateFadeOutDown;
					animationIn = ClassNameType.AnimateFadeInUp;
					break;
			}

			const originalClassName = this.tablesElement_.className;

			const animate = (type: ClassNameType) => {
				HtmlHelper_.addClass_(this.tablesElement_, ClassNameType.Animated, this.options_);
				HtmlHelper_.addClass_(this.tablesElement_, type, this.options_);
			};

			const onAfterSlide = (): void => {
				if (this.onAfterSlide_.length > 0) {
					this.onAfterSlide_.shift()();
				} else {
					this.onAfterSlide_ = null;
				}
			};

			let listenerRemover: () => void;
			const timeoutId = window.setTimeout(() => {
				listenerRemover();
				onComplete();
				onAfterSlide();
			}, 150);

			listenerRemover = Helper_.addEventListener_(this.tablesElement_, ListenerType_.AnimationEnd, (): void => {
				window.clearTimeout(timeoutId);
				onComplete();
				listenerRemover();
				this.tablesElement_.className = originalClassName;
				animate(animationIn);
				listenerRemover = Helper_.addEventListener_(this.tablesElement_, ListenerType_.AnimationEnd, (): void => {
					listenerRemover();
					this.tablesElement_.className = originalClassName;
					onAfterSlide();
				});
			});

			animate(animationOut);
		}

		if (this.onAfterSlide_) {
			this.onAfterSlide_.push(trigger);
		} else {
			this.onAfterSlide_ = [];
			trigger();
		}
	}

	private translateMonth_(monthNumber: number): string {
		return this.options_.isMonthShort()
			? this.options_.translator.translateMonthShort(monthNumber)
			: this.options_.translator.translateMonth(monthNumber);
	}

	private updateTitle_(element: HTMLAnchorElement | HTMLSelectElement, titleName: TitleName): void {
		const title = this.options_.translator.translateTitle(titleName);
		if (title !== '') {
			element.title = title;
			if (this.options_.isAriaIncluded()) {
				element.setAttribute('aria-label', title);
			}
		} else {
			element.removeAttribute('title');
			element.removeAttribute('aria-label');
		}
	}

}
