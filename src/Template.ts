namespace TheDatepicker {

	interface HTMLDayButtonElement extends HTMLAnchorElement {

		day: Day;

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

	export class Template_ {

		// todo nějak hezky aby šlo snadno customizovat uspořádání prvků

		private mainElement_: HTMLElement | null = null;
		private bodyElement_: HTMLElement | null = null;
		private controlElement_: HTMLElement | null = null;
		private goBackElement_: HTMLElement | null = null;
		private goForwardElement_: HTMLElement | null = null;
		private titleElement_: HTMLElement | null = null;
		private titleContentElement_: HTMLElement | null = null;
		private resetElement_: HTMLElement | null = null;
		private closeElement_: HTMLElement | null = null;
		private monthSelect_: HTMLSelectElement | null = null;
		private monthElement_: HTMLElement | null = null;
		private yearSelect_: HTMLSelectElement | null = null;
		private yearElement_: HTMLElement | null = null;
		private monthAndYearSelect_: HTMLSelectElement | null = null;
		private monthAndYearElement_: HTMLElement | null = null;
		private weeksElements_: HTMLElement[] = [];
		private daysElements_: HTMLElement[][] = [];
		private daysButtonsElements_: HTMLDayButtonElement[][] = [];
		private daysContentsElements_: HTMLElement[][] = [];

		public constructor(
			private readonly options_: Options,
			private readonly htmlHelper_: HtmlHelper_,
			private readonly container_: HTMLElement,
			private readonly hasInput_: boolean
		) {
		}

		public render_(viewModel: ViewModel_): void {
			if (this.mainElement_ === null) {
				if (this.hasInput_ && this.options_.isHiddenOnBlur() && !viewModel.isActive_()) {
					return;
				}

				this.container_.innerHTML = '';
				this.container_.appendChild(this.createSkeleton_(viewModel));
			}

			this.updateMainElement_(viewModel);
			this.updateTopElement_(viewModel);
			this.updateTitleElement_(viewModel);
			this.updateCloseElement_(viewModel);
			this.updateResetElement_(viewModel);
			this.updateGoBackElement_(viewModel);
			this.updateGoForwardElement_(viewModel);
			this.updateMonthElement_(viewModel);
			this.updateYearElement_(viewModel);
			this.updateMonthAndYearElement_(viewModel);
			this.updateWeeksElements_(viewModel);
		}

		protected createSkeleton_(viewModel: ViewModel_): HTMLElement {
			const main = this.htmlHelper_.createDiv_('main');

			this.htmlHelper_.appendChild_(main, this.options_.getHeaderStructure_());
			main.appendChild(this.createHeaderElement_(viewModel));
			main.appendChild(this.createBodyElement_(viewModel));
			this.htmlHelper_.appendChild_(main, this.options_.getFooterStructure_());

			this.mainElement_ = main;

			return main;
		}

		protected updateMainElement_(viewModel: ViewModel_): void {
			this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? '' : 'none';
		}

		protected createBodyElement_(viewModel: ViewModel_): HTMLElement {
			const body = this.htmlHelper_.createDiv_('body');

			if (this.options_.isMonthChangeOnSwipeEnabled_()) {
				Helper_.addSwipeListener_(body, (event: TouchEvent, isRightMove: boolean): void => {
					this.slideMonth_(viewModel, event, !isRightMove);
				});
			}

			body.appendChild(this.createTableElement_(viewModel));

			this.bodyElement_ = body;

			return body;
		}

		protected createHeaderElement_(viewModel: ViewModel_): HTMLElement {
			const header = this.htmlHelper_.createDiv_('header');

			const top = this.htmlHelper_.createDiv_('top');
			header.appendChild(top);

			top.appendChild(this.createTitleElement_(viewModel));

			const control = this.htmlHelper_.createDiv_('control');
			top.appendChild(control);

			control.appendChild(this.createResetElement_(viewModel));
			control.appendChild(this.createCloseElement_(viewModel));

			const navigation = this.htmlHelper_.createDiv_('navigation');
			header.appendChild(navigation);

			navigation.appendChild(this.createGoBackElement_(viewModel));

			const state = this.htmlHelper_.createDiv_('state');
			navigation.appendChild(state);

			if (this.options_.isMonthAndYearSeparated()) {
				state.appendChild(this.createMonthElement_(viewModel));
				state.appendChild(this.createYearElement_(viewModel));
			} else {
				state.appendChild(this.createMonthAndYearElement_(viewModel));
			}

			navigation.appendChild(this.createGoForwardElement_(viewModel));

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
			const titleElement = this.htmlHelper_.createDiv_('title');
			const titleContent = this.htmlHelper_.createSpan_();
			titleElement.appendChild(titleContent);
			this.htmlHelper_.addClass_(titleContent, 'title-content');
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
			const resetElement = this.htmlHelper_.createDiv_('reset');
			const resetButton = this.htmlHelper_.createAnchor_((event: Event) => {
				viewModel.reset_(event);
			});

			resetButton.innerHTML = this.options_.getResetHtml();
			const title = this.options_.translator.translateTitle(TitleName.Reset);
			if (title !== '') {
				resetButton.title = title;
			}
			resetElement.appendChild(resetButton);
			this.resetElement_ = resetElement;

			return resetElement;
		}

		protected updateResetElement_(viewModel: ViewModel_): void {
			this.resetElement_.style.display = this.options_.isResetButtonShown() ? '' : 'none';
		}

		protected createCloseElement_(viewModel: ViewModel_): HTMLElement {
			const closeElement = this.htmlHelper_.createDiv_('close');
			const closeButton = this.htmlHelper_.createAnchor_((event: Event) => {
				viewModel.close_(event);
			});

			closeButton.innerHTML = this.options_.getCloseHtml();
			const title = this.options_.translator.translateTitle(TitleName.Close);
			if (title !== '') {
				closeButton.title = title;
			}
			closeElement.appendChild(closeButton);
			this.closeElement_ = closeElement;

			return closeElement;
		}

		protected updateCloseElement_(viewModel: ViewModel_): void {
			this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? '' : 'none';
		}

		protected createGoBackElement_(viewModel: ViewModel_): HTMLElement {
			return this.createGoElement_(viewModel, false);
		}

		protected createGoForwardElement_(viewModel: ViewModel_): HTMLElement {
			return this.createGoElement_(viewModel, true);
		}

		protected createGoElement_(viewModel: ViewModel_, directionForward: boolean): HTMLElement {
			const goElement = this.htmlHelper_.createDiv_('go');
			this.htmlHelper_.addClass_(goElement, directionForward ? 'go-next' : 'go-previous');
			const goButton = this.htmlHelper_.createAnchor_((event: Event): void => {
				this.slideMonth_(viewModel, event, directionForward);
			});

			goButton.innerHTML = directionForward ? this.options_.getGoForwardHtml() : this.options_.getGoBackHtml();
			const title = this.options_.translator.translateTitle(directionForward ? TitleName.GoForward : TitleName.GoBack);
			if (title !== '') {
				goButton.title = title;
			}
			goElement.appendChild(goButton);

			// todo možná tohle ukládání udělat nějak v createSkeleton
			if (directionForward) {
				this.goForwardElement_ = goButton;
			} else {
				this.goBackElement_ = goButton;
			}

			return goElement;
		}

		protected updateGoBackElement_(viewModel: ViewModel_): void {
			this.goBackElement_.style.visibility = viewModel.canGoBack_() ? 'visible' : 'hidden';
		}

		protected updateGoForwardElement_(viewModel: ViewModel_): void {
			this.goForwardElement_.style.visibility = viewModel.canGoForward_() ? 'visible' : 'hidden';
		}

		protected createMonthElement_(viewModel: ViewModel_): HTMLElement {
			const options: Option[] = [];
			for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
				options.push({
					value: monthNumber + '',
					label: this.translateMonth(monthNumber),
				});
			}

			const selectElement = this.htmlHelper_.createSelectInput_(options, (event: Event, monthNumber: string) => {
				const currentMonth = viewModel.getCurrentMonth_();
				const newMonth = new Date(currentMonth.getTime());
				newMonth.setMonth(parseInt(monthNumber, 10));
				if (!viewModel.goToMonth_(event, newMonth)) {
					this.monthSelect_.value = currentMonth.getMonth() + '';
				}
			});

			const monthElement = this.htmlHelper_.createDiv_('month');
			const monthContent = this.htmlHelper_.createSpan_();
			monthElement.appendChild(selectElement);
			monthElement.appendChild(monthContent);

			this.monthElement_ = monthContent;
			this.monthSelect_ = selectElement;

			return monthElement;
		}

		protected updateMonthElement_(viewModel: ViewModel_): void {
			if (this.monthElement_ === null) {
				return;
			}

			const currentMonth = viewModel.getCurrentMonth_().getMonth();
			this.monthElement_.innerText = this.translateMonth(currentMonth);

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
			const selectElement = this.htmlHelper_.createSelectInput_([], (event: Event, year: string) => {
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
					this.yearSelect_.value = currentMonth.getFullYear() + '';
				}
			});

			const yearElement = this.htmlHelper_.createDiv_('year');
			const yearContent = this.htmlHelper_.createSpan_();
			yearElement.appendChild(selectElement);
			yearElement.appendChild(yearContent);

			this.yearElement_ = yearContent;
			this.yearSelect_ = selectElement;

			return yearElement;
		}

		protected updateYearElement_(viewModel: ViewModel_): void {
			if (this.yearElement_ === null) {
				return;
			}

			const currentYear = viewModel.getCurrentMonth_().getFullYear();
			this.yearElement_.innerText = currentYear + '';

			if (!this.options_.isYearAsDropdown()) {
				this.yearSelect_.style.display = 'none';
				this.yearElement_.style.display = '';
				return;
			}

			const minYear = this.options_.getMinDate_().getFullYear();
			const maxYear = this.options_.getMaxDate_().getFullYear();
			const range = this.calculateDropdownRange_(currentYear, minYear, maxYear);

			const options = this.yearSelect_.getElementsByTagName('option');
			const diff = this.calculateDropdownDiff_(options, range, (value: string): number => {
				return parseInt(value, 10);
			});

			for (let index = 0; index < diff.remove.length; index++) {
				this.yearSelect_.removeChild(diff.remove[index]);
			}
			for (let index = diff.prepend.length - 1; index >= 0; index--) {
				this.yearSelect_.insertBefore(this.htmlHelper_.createSelectOption_(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearSelect_.firstChild);
			}
			for (let index = 0; index < diff.append.length; index++) {
				this.yearSelect_.appendChild(this.htmlHelper_.createSelectOption_(diff.append[index] + '', diff.append[index] + ''));
			}

			this.yearSelect_.value = currentYear + '';

			const showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
			this.yearSelect_.style.display = showSelect ? '' : 'none';
			this.yearElement_.style.display = showSelect ? 'none' : '';
		}

		protected createMonthAndYearElement_(viewModel: ViewModel_): HTMLElement {
			const monthAndYear = this.htmlHelper_.createDiv_('month-year');

			const selectElement = this.htmlHelper_.createSelectInput_([], (event: Event, value: string) => {
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
			});

			const monthAndYearContent = this.htmlHelper_.createSpan_();
			this.monthAndYearElement_ = monthAndYearContent;
			this.monthAndYearSelect_ = selectElement;
			monthAndYear.appendChild(monthAndYearContent);
			monthAndYear.appendChild(selectElement);

			return monthAndYear;
		}

		protected updateMonthAndYearElement_(viewModel: ViewModel_): void {
			if (this.monthAndYearElement_ === null) {
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
				this.monthAndYearSelect_.insertBefore(this.htmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
			}
			for (let index = 0; index < diff.append.length; index++) {
				const data = this.getMonthAndYearByIndex_(diff.append[index]);
				this.monthAndYearSelect_.appendChild(this.htmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
			}

			this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);

			const showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
			this.monthAndYearSelect_.style.display = showSelect ? '' : 'none';
			this.monthAndYearElement_.style.display = showSelect ? 'none' : '';
		}

		private translateMonthAndYear_(data: MonthAndYear): string {
			return this.translateMonth(data.month) + ' ' + data.year;
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

			return this.htmlHelper_.createTable_('calendar', tableHeader, tableBody);
		}

		protected createTableHeaderElement_(viewModel: ViewModel_): HTMLElement {
			const weekDays = viewModel.getWeekDays_();

			const cells = [];
			for (let index = 0; index < weekDays.length; index++) {
				const dayOfWeek = weekDays[index];
				cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
			}

			return this.htmlHelper_.createTableHeader_('calendar-header', cells as HTMLTableHeaderCellElement[]);
		}

		protected createTableHeaderCellElement_(viewModel: ViewModel_, dayOfWeek: DayOfWeek): HTMLElement {
			const headerCell = this.htmlHelper_.createTableHeaderCell_('week-day');

			if (dayOfWeek === DayOfWeek.Saturday || dayOfWeek === DayOfWeek.Sunday) {
				this.htmlHelper_.addClass_(headerCell, 'week-day--weekend');
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

			return this.htmlHelper_.createTableBody_('calendar-body', rows as HTMLTableRowElement[]);
		}

		protected updateWeeksElements_(viewModel: ViewModel_): void {
			const weeks = viewModel.getWeeks_();

			for (let weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
				const weekElement = this.weeksElements_[weekIndex];
				const week = weeks.length > weekIndex ? weeks[weekIndex] : null;

				weekElement.style.display = week !== null ? '' : 'none';

				if (week !== null) {
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
				const cell = this.htmlHelper_.createTableCell_();
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

			return this.htmlHelper_.createTableRow_('week', cells as HTMLTableCellElement[]);
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
			this.htmlHelper_.addClass_(dayElement, 'cell');
			this.options_.updateCellStructure_(dayContentElement, day);

			if (!day.isVisible) {
				dayButtonElement.removeAttribute('href');
				dayButtonElement.style.visibility = 'hidden';
				return;
			}

			this.htmlHelper_.addClass_(dayElement, 'day');
			if (day.isToday) {
				this.htmlHelper_.addClass_(dayElement, 'day--today');
			}
			if (day.isPast) {
				this.htmlHelper_.addClass_(dayElement, 'day--past');
			}
			if (day.isWeekend) {
				this.htmlHelper_.addClass_(dayElement, 'day--weekend');
			}
			if (!day.isAvailable) {
				this.htmlHelper_.addClass_(dayElement, 'day--unavailable');
			}
			if (!day.isInCurrentMonth) {
				this.htmlHelper_.addClass_(dayElement, 'day--outside');
			}
			if (day.isHighlighted) {
				this.htmlHelper_.addClass_(dayElement, 'day--highlighted');
			}
			if (day.isSelected) {
				this.htmlHelper_.addClass_(dayElement, 'day--selected');
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
			const cellButton = this.htmlHelper_.createAnchor_((event: Event) => {
				const previous = viewModel.selectedDate_;
				const isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
				if (this.options_.isHiddenOnSelect() && (isSelected || (previous !== null && cellButton.day.isEqualToDate(previous)))) {
					viewModel.close_(event);
				}
			}) as HTMLDayButtonElement;

			cellButton.onfocus = (event: FocusEvent) => {
				viewModel.highlightDay_(event || window.event, cellButton.day);
			};

			cellButton.onmouseenter = (event: MouseEvent) => {
				if (this.options_.getBeforeFocusListeners().length > 0 || this.options_.getFocusListeners().length > 0) {
					viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
				} else {
					// optimization
					viewModel.cancelHighlight_(event || window.event);
				}
			};

			cellButton.onmouseleave = (event: MouseEvent) => {
				viewModel.cancelHighlight_(event || window.event);
			};

			return cellButton;
		}

		protected createTableCellContentElement_(viewModel: ViewModel_): HTMLElement {
			const cellContent = this.options_.getCellStructure_();
			this.htmlHelper_.addClass_(cellContent, 'day-content');

			return cellContent;
		}

		private slideMonth_(viewModel: ViewModel_, event: Event, directionForward: boolean): void {
			const canGo = directionForward ? viewModel.canGoForward_() : viewModel.canGoBack_();
			if (!canGo) {
				return;
			}

			const change = (): void => {
				if (directionForward) {
					viewModel.goForward_(event);
				} else {
					viewModel.goBack_(event);
				}
			};

			if (!this.options_.isMonthChangeAnimated() || !Helper_.isCssAnimationSupported_()) {
				change();
				return;
			}

			const animationOut = directionForward
				? 'fade-out-left'
				: 'fade-out-right';
			const animationIn = directionForward
				? 'fade-in-right'
				: 'fade-in-left';

			let listenerRemover = Helper_.addEventListener_(this.bodyElement_, ListenerType_.AnimationEnd, (event: Event): void => {
				change();
				listenerRemover();
				this.bodyElement_.className = this.options_.prefixClass_('body');
				this.htmlHelper_.addClass_(this.bodyElement_, 'animated');
				this.htmlHelper_.addClass_(this.bodyElement_, animationIn);
				listenerRemover = Helper_.addEventListener_(this.bodyElement_, ListenerType_.AnimationEnd, (event: Event): void => {
					listenerRemover();
					this.bodyElement_.className = this.options_.prefixClass_('body');
				});
			});

			this.bodyElement_.className = this.options_.prefixClass_('body');
			this.htmlHelper_.addClass_(this.bodyElement_, 'animated');
			this.htmlHelper_.addClass_(this.bodyElement_, animationOut);
		}

		private translateMonth(monthNumber: number): string {
			return this.options_.isMonthShort()
				? this.options_.translator.translateMonthShort(monthNumber)
				: this.options_.translator.translateMonth(monthNumber);
		}

	}

}
