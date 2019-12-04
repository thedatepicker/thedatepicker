/// <reference path="Options.ts" />
/// <reference path="HtmlHelper.ts" />
/// <reference path="ViewModel.ts" />

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

	export class Template {

		// todo nějak hezky aby šlo snadno customizovat uspořádání prvků

		private mainElement: HTMLElement | null = null;
		private controlElement: HTMLElement | null = null;
		private goBackElement: HTMLElement | null = null;
		private goForwardElement: HTMLElement | null = null;
		private titleElement: HTMLElement | null = null;
		private titleContentElement: HTMLElement | null = null;
		private resetElement: HTMLElement | null = null;
		private closeElement: HTMLElement | null = null;
		private monthSelect: HTMLSelectElement | null = null;
		private monthElement: HTMLElement | null = null;
		private yearSelect: HTMLSelectElement | null = null;
		private yearElement: HTMLElement | null = null;
		private monthAndYearSelect: HTMLSelectElement | null = null;
		private monthAndYearElement: HTMLElement | null = null;
		private weeksElements: HTMLElement[] = [];
		private daysElements: HTMLElement[][] = [];
		private daysButtonsElements: HTMLDayButtonElement[][] = [];
		private daysContentsElements: HTMLElement[][] = [];

		public constructor(
			private readonly options: Options,
			private readonly htmlHelper: HtmlHelper,
			private readonly container: HTMLElement,
			private readonly hasInput: boolean
		) {
		}

		public render(viewModel: ViewModel): void {
			if (this.mainElement === null) {
				if (this.hasInput && this.options.isHiddenOnBlur() && !viewModel.isActive()) {
					return;
				}

				this.container.innerHTML = '';
				this.container.appendChild(this.createSkeleton(viewModel));
			}

			this.updateMainElement(viewModel);
			this.updateTopElement(viewModel);
			this.updateTitleElement(viewModel);
			this.updateCloseElement(viewModel);
			this.updateResetElement(viewModel);
			this.updateGoBackElement(viewModel);
			this.updateGoForwardElement(viewModel);
			this.updateMonthElement(viewModel);
			this.updateYearElement(viewModel);
			this.updateMonthAndYearElement(viewModel);
			this.updateWeeksElements(viewModel);
		}

		protected createSkeleton(viewModel: ViewModel): HTMLElement {
			const main = this.htmlHelper.createDiv('main');
			main.appendChild(this.createHeaderElement(viewModel));
			main.appendChild(this.createBodyElement(viewModel));

			this.mainElement = main;

			return main;
		}

		protected updateMainElement(viewModel: ViewModel): void {
			this.mainElement.style.display = !this.hasInput || viewModel.isActive() || !this.options.isHiddenOnBlur() ? '' : 'none';
		}

		protected createBodyElement(viewModel: ViewModel): HTMLElement {
			const body = this.htmlHelper.createDiv('body');
			body.appendChild(this.createTableElement(viewModel));

			return body;
		}

		protected createHeaderElement(viewModel: ViewModel): HTMLElement {
			const header = this.htmlHelper.createDiv('header');

			const top = this.htmlHelper.createDiv('top');
			header.appendChild(top);

			top.appendChild(this.createTitleElement(viewModel));

			const control = this.htmlHelper.createDiv('control');
			top.appendChild(control);

			control.appendChild(this.createResetElement(viewModel));
			control.appendChild(this.createCloseElement(viewModel));

			const navigation = this.htmlHelper.createDiv('navigation');
			header.appendChild(navigation);

			navigation.appendChild(this.createGoBackElement(viewModel));

			const state = this.htmlHelper.createDiv('state');
			navigation.appendChild(state);

			if (this.options.isMonthAndYearSeparated()) {
				state.appendChild(this.createMonthElement(viewModel));
				state.appendChild(this.createYearElement(viewModel));
			} else {
				state.appendChild(this.createMonthAndYearElement(viewModel));
			}

			navigation.appendChild(this.createGoForwardElement(viewModel));

			this.controlElement = control;

			return header;
		}

		protected updateTopElement(viewModel: ViewModel): void {
			const isVisible = this.options.getTitle() !== ''
				|| this.options.isResetButtonShown()
				|| (this.hasInput && this.options.isCloseButtonShown());
			this.controlElement.style.display = isVisible ? '' : 'none';
			this.titleElement.style.display = isVisible ? '' : 'none';
		}

		protected createTitleElement(viewModel: ViewModel): HTMLElement {
			const titleElement = this.htmlHelper.createDiv('title');
			const titleContent = this.htmlHelper.createSpan();
			titleElement.appendChild(titleContent);
			this.htmlHelper.addClass(titleContent, 'title-content');
			this.titleElement = titleElement;
			this.titleContentElement = titleContent;

			return titleElement;
		}

		protected updateTitleElement(viewModel: ViewModel): void {
			const title = this.options.getTitle();
			this.titleContentElement.style.display = title !== '' ? '' : 'none';
			this.titleContentElement.innerText = title;
		}

		protected createResetElement(viewModel: ViewModel): HTMLElement {
			const resetElement = this.htmlHelper.createDiv('reset');
			const resetButton = this.htmlHelper.createAnchor((event: Event) => {
				viewModel.reset(event);
			});

			resetButton.innerHTML = this.options.getResetHtml();
			resetElement.appendChild(resetButton);
			this.resetElement = resetElement;

			return resetElement;
		}

		protected updateResetElement(viewModel: ViewModel): void {
			this.resetElement.style.display = this.options.isResetButtonShown() ? '' : 'none';
		}

		protected createCloseElement(viewModel: ViewModel): HTMLElement {
			const closeElement = this.htmlHelper.createDiv('close');
			const closeButton = this.htmlHelper.createAnchor((event: Event) => {
				viewModel.close(event);
			});

			closeButton.innerHTML = this.options.getCloseHtml();
			closeElement.appendChild(closeButton);
			this.closeElement = closeElement;

			return closeElement;
		}

		protected updateCloseElement(viewModel: ViewModel): void {
			this.closeElement.style.display = this.hasInput && this.options.isCloseButtonShown() ? '' : 'none';
		}

		protected createGoBackElement(viewModel: ViewModel): HTMLElement {
			return this.createGoElement(viewModel, false);
		}

		protected createGoForwardElement(viewModel: ViewModel): HTMLElement {
			return this.createGoElement(viewModel, true);
		}

		protected createGoElement(viewModel: ViewModel, directionForward: boolean): HTMLElement {
			const goElement = this.htmlHelper.createDiv('go');
			this.htmlHelper.addClass(goElement, directionForward ? 'go-next' : 'go-previous');
			const goButton = this.htmlHelper.createAnchor((event: Event) => {
				if (directionForward) {
					viewModel.goForward(event);
				} else {
					viewModel.goBack(event);
				}
			});

			goButton.innerHTML = directionForward ? this.options.getGoForwardHtml() : this.options.getGoBackHtml();
			goElement.appendChild(goButton);

			// todo možná tohle ukládání udělat nějak v createSkeleton
			if (directionForward) {
				this.goForwardElement = goButton;
			} else {
				this.goBackElement = goButton;
			}

			return goElement;
		}

		protected updateGoBackElement(viewModel: ViewModel): void {
			this.goBackElement.style.visibility = viewModel.canGoBack() ? 'visible' : 'hidden';
		}

		protected updateGoForwardElement(viewModel: ViewModel): void {
			this.goForwardElement.style.visibility = viewModel.canGoForward() ? 'visible' : 'hidden';
		}

		protected createMonthElement(viewModel: ViewModel): HTMLElement {
			const options: SelectOption[] = [];
			for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
				options.push({
					value: monthNumber + '',
					label: this.options.translator.translateMonth(monthNumber),
				});
			}

			const selectElement = this.htmlHelper.createSelectInput(options, (event: Event, monthNumber: string) => {
				const currentMonth = viewModel.getCurrentMonth();
				const newMonth = new Date(currentMonth.getTime());
				newMonth.setMonth(parseInt(monthNumber, 10));
				if (!viewModel.goToMonth(event, newMonth)) {
					this.monthSelect.value = currentMonth.getMonth() + '';
				}
			});

			const monthElement = this.htmlHelper.createDiv('month');
			const monthContent = this.htmlHelper.createSpan();
			monthElement.appendChild(selectElement);
			monthElement.appendChild(monthContent);

			this.monthElement = monthContent;
			this.monthSelect = selectElement;

			return monthElement;
		}

		protected updateMonthElement(viewModel: ViewModel): void {
			if (this.monthElement === null) {
				return;
			}

			const currentMonth = viewModel.getCurrentMonth().getMonth();
			this.monthElement.innerText = this.options.translator.translateMonth(currentMonth);

			if (!this.options.isMonthAsDropdown()) {
				this.monthSelect.style.display = 'none';
				this.monthElement.style.display = '';
				return;
			}

			let valuesCount = 0;
			for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
				const newMonth = new Date(viewModel.getCurrentMonth().getTime());
				newMonth.setMonth(monthNumber);
				const option = this.monthSelect.getElementsByTagName('option')[monthNumber];
				const canGoToMonth = viewModel.canGoToMonth(newMonth);
				option.disabled = !canGoToMonth;
				option.style.display = canGoToMonth ? '' : 'none';
				valuesCount += canGoToMonth ? 1 : 0;
			}

			this.monthSelect.value = currentMonth + '';

			this.monthSelect.style.display = valuesCount > 1 ? '' : 'none';
			this.monthElement.style.display = valuesCount > 1 ? 'none' : '';
		}

		protected createYearElement(viewModel: ViewModel): HTMLElement {
			const selectElement = this.htmlHelper.createSelectInput([], (event: Event, year: string) => {
				const currentMonth = viewModel.getCurrentMonth();
				let newMonth = new Date(currentMonth.getTime());
				newMonth.setFullYear(parseInt(year, 10));

				const minMonth = this.options.getMinMonth();
				const maxMonth = this.options.getMaxMonth();
				if (minMonth !== null && newMonth.getTime() < minMonth.getTime()) {
					newMonth = minMonth;
				}
				if (maxMonth !== null && newMonth.getTime() > maxMonth.getTime()) {
					newMonth = maxMonth;
				}

				if (!viewModel.goToMonth(event, newMonth)) {
					this.yearSelect.value = currentMonth.getFullYear() + '';
				}
			});

			const yearElement = this.htmlHelper.createDiv('year');
			const yearContent = this.htmlHelper.createSpan();
			yearElement.appendChild(selectElement);
			yearElement.appendChild(yearContent);

			this.yearElement = yearContent;
			this.yearSelect = selectElement;

			return yearElement;
		}

		protected updateYearElement(viewModel: ViewModel): void {
			if (this.yearElement === null) {
				return;
			}

			const currentYear = viewModel.getCurrentMonth().getFullYear();
			this.yearElement.innerText = currentYear + '';

			if (!this.options.isYearAsDropdown()) {
				this.yearSelect.style.display = 'none';
				this.yearElement.style.display = '';
				return;
			}

			const minDate = this.options.getMinDate();
			const maxDate = this.options.getMaxDate();
			const minYear = minDate !== null ? minDate.getFullYear() : null;
			const maxYear = maxDate !== null ? maxDate.getFullYear() : null;
			const range = this.calculateDropdownRange(currentYear, minYear, maxYear);

			const options = this.yearSelect.getElementsByTagName('option');
			const diff = this.calculateDropdownDiff(options, range, (value: string): number => {
				return parseInt(value, 10);
			});

			for (let index = 0; index < diff.remove.length; index++) {
				this.yearSelect.removeChild(diff.remove[index]);
			}
			for (let index = diff.prepend.length - 1; index >= 0; index--) {
				this.yearSelect.insertBefore(this.htmlHelper.createSelectOption(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearSelect.firstChild);
			}
			for (let index = 0; index < diff.append.length; index++) {
				this.yearSelect.appendChild(this.htmlHelper.createSelectOption(diff.append[index] + '', diff.append[index] + ''));
			}

			this.yearSelect.value = currentYear + '';
			this.yearSelect.style.display = range.from < range.to ? '' : 'none';
			this.yearElement.style.display = range.from < range.to ? 'none' : '';
		}

		protected createMonthAndYearElement(viewModel: ViewModel): HTMLElement {
			const monthAndYear = this.htmlHelper.createDiv('month-year');

			const selectElement = this.htmlHelper.createSelectInput([], (event: Event, value: string) => {
				const currentMonth = viewModel.getCurrentMonth();
				let newMonth = new Date(currentMonth.getTime());
				const data = this.parseMonthAndYearOptionValue(value);
				newMonth.setFullYear(data.year);
				newMonth.setMonth(data.month);

				if (!viewModel.goToMonth(event, newMonth)) {
					this.monthAndYearSelect.value = this.getMonthAndYearOptionValue({
						month: currentMonth.getMonth(),
						year: currentMonth.getFullYear(),
					});
				}
			});

			const monthAndYearContent = this.htmlHelper.createSpan();
			this.monthAndYearElement = monthAndYearContent;
			this.monthAndYearSelect = selectElement;
			monthAndYear.appendChild(monthAndYearContent);
			monthAndYear.appendChild(selectElement);

			return monthAndYear;
		}

		protected updateMonthAndYearElement(viewModel: ViewModel): void {
			if (this.monthAndYearElement === null) {
				return;
			}

			const currentMonth = viewModel.getCurrentMonth();
			const currentData: MonthAndYear = {
				month: currentMonth.getMonth(),
				year: currentMonth.getFullYear(),
			};
			const currentIndex = this.calculateMonthAndYearIndex(currentData);
			this.monthAndYearElement.innerText = this.translateMonthAndYear(currentData);

			if (!this.options.isYearAsDropdown() || !this.options.isMonthAsDropdown()) {
				this.monthAndYearSelect.style.display = 'none';
				this.monthAndYearElement.style.display = '';
				return;
			}

			const minDate = this.options.getMinDate();
			const maxDate = this.options.getMaxDate();
			const minIndex = minDate !== null ? minDate.getFullYear() * 12 + minDate.getMonth() : null;
			const maxIndex = maxDate !== null ? maxDate.getFullYear() * 12 + maxDate.getMonth() : null;
			const range = this.calculateDropdownRange(currentIndex, minIndex, maxIndex);

			const options = this.monthAndYearSelect.getElementsByTagName('option');
			const diff = this.calculateDropdownDiff(options, range, (value: string): number => {
				return this.calculateMonthAndYearIndex(this.parseMonthAndYearOptionValue(value));
			});

			for (let index = 0; index < diff.remove.length; index++) {
				this.monthAndYearSelect.removeChild(diff.remove[index]);
			}
			for (let index = diff.prepend.length - 1; index >= 0; index--) {
				const data = this.getMonthAndYearByIndex(diff.prepend[index]);
				this.monthAndYearSelect.insertBefore(this.htmlHelper.createSelectOption(this.getMonthAndYearOptionValue(data), this.translateMonthAndYear(data)), this.monthAndYearSelect.firstChild);
			}
			for (let index = 0; index < diff.append.length; index++) {
				const data = this.getMonthAndYearByIndex(diff.append[index]);
				this.monthAndYearSelect.appendChild(this.htmlHelper.createSelectOption(this.getMonthAndYearOptionValue(data), this.translateMonthAndYear(data)));
			}

			this.monthAndYearSelect.value = this.getMonthAndYearOptionValue(currentData);
			this.monthAndYearSelect.style.display = range.from < range.to ? '' : 'none';
			this.monthAndYearElement.style.display = range.from < range.to ? 'none' : '';
		}

		private translateMonthAndYear(data: MonthAndYear): string {
			return this.options.translator.translateMonth(data.month) + ' ' + data.year;
		}

		private calculateMonthAndYearIndex(data: MonthAndYear): number {
			return data.year * 12 + data.month;
		}

		private getMonthAndYearByIndex(index: number): MonthAndYear {
			return {
				year: Math.floor(index / 12),
				month: index % 12,
			}
		}

		private getMonthAndYearOptionValue(data: MonthAndYear): string {
			return data.year + '-' + data.month;
		}

		private parseMonthAndYearOptionValue(value: string): MonthAndYear {
			const parts = value.split('-');
			return {
				month: parseInt(parts[1], 10),
				year: parseInt(parts[0], 10),
			}
		}

		private calculateDropdownRange(current: number, min: number | null, max: number | null): Range {
			const limit = this.options.getDropdownItemsLimit() - 1;
			const maxAppend = Math.ceil(limit / 2);
			let from = current - (limit - maxAppend);
			let to = current + maxAppend;
			if (min !== null && from < min) {
				to += min - from;
				if (max !== null && to > max) {
					to = max;
				}
				from = min;
			} else if (max !== null && to > max) {
				from -= to - max;
				if (min !== null && from < min) {
					from = min;
				}
				to = max;
			}

			return {
				from,
				to,
			};
		}

		private calculateDropdownDiff(options: HTMLCollectionOf<HTMLOptionElement>, newRange: Range, getNumerical: (value: string) => number): DropdownDiff {
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

		protected createTableElement(viewModel: ViewModel): HTMLElement {
			const tableHeader = this.createTableHeaderElement(viewModel) as HTMLTableSectionElement;
			const tableBody = this.createTableBodyElement(viewModel) as HTMLTableSectionElement;

			return this.htmlHelper.createTable('calendar', tableHeader, tableBody);
		}

		protected createTableHeaderElement(viewModel: ViewModel): HTMLElement {
			const weekDays = viewModel.getWeekDays();

			const cells = [];
			for (let index = 0; index < weekDays.length; index++) {
				const dayOfWeek = weekDays[index];
				cells.push(this.createTableHeaderCellElement(viewModel, dayOfWeek));
			}

			return this.htmlHelper.createTableHeader('calendar-header', cells as HTMLTableHeaderCellElement[]);
		}

		protected createTableHeaderCellElement(viewModel: ViewModel, dayOfWeek: DayOfWeek): HTMLElement {
			const headerCell = this.htmlHelper.createTableHeaderCell('week-day');

			if (dayOfWeek === DayOfWeek.Saturday || dayOfWeek === DayOfWeek.Sunday) {
				this.htmlHelper.addClass(headerCell, 'week-day--weekend');
			}

			headerCell.innerText = this.options.translator.translateDayOfWeek(dayOfWeek);

			return headerCell;
		}

		protected createTableBodyElement(viewModel: ViewModel): HTMLElement {
			this.daysElements = [];
			this.daysButtonsElements = [];
			this.daysContentsElements = [];

			const rows = [];
			for (let index = 0; index < 6; index++) {
				rows.push(this.createTableRowElement(viewModel));
			}
			this.weeksElements = rows;

			return this.htmlHelper.createTableBody('calendar-body', rows as HTMLTableRowElement[]);
		}

		protected updateWeeksElements(viewModel: ViewModel): void {
			const weeks = viewModel.getWeeks();

			for (let weekIndex = 0; weekIndex < this.weeksElements.length; weekIndex++) {
				const weekElement = this.weeksElements[weekIndex];
				const week = weeks.length > weekIndex ? weeks[weekIndex] : null;

				weekElement.style.display = week !== null ? '' : 'none';

				if (week !== null) {
					for (let dayIndex = 0; dayIndex < this.daysElements[weekIndex].length; dayIndex++) {
						this.updateDayElement(
							viewModel,
							this.daysElements[weekIndex][dayIndex],
							this.daysButtonsElements[weekIndex][dayIndex],
							this.daysContentsElements[weekIndex][dayIndex],
							week[dayIndex]
						);
					}
				}
			}
		}

		protected createTableRowElement(viewModel: ViewModel): HTMLElement {
			const cells = [];
			const cellsButtons = [];
			const cellsContents = [];
			for (let index = 0; index < 7; index++) {
				const cell = this.htmlHelper.createTableCell();
				const cellButton = this.createTableCellButtonElement(viewModel);
				const cellContent = this.createTableCellContentElement(viewModel);

				cells.push(cell);
				cellsButtons.push(cellButton);
				cellsContents.push(cellContent);

				cell.appendChild(cellButton);
				cellButton.appendChild(cellContent);
			}
			this.daysElements.push(cells);
			this.daysButtonsElements.push(cellsButtons);
			this.daysContentsElements.push(cellsContents);

			return this.htmlHelper.createTableRow('week', cells as HTMLTableCellElement[]);
		}

		protected updateDayElement(
			viewModel: ViewModel,
			dayElement: HTMLElement,
			dayButtonElement: HTMLDayButtonElement,
			dayContentElement: HTMLElement,
			day: Day
		): void {
			dayButtonElement.day = day;
			dayElement.setAttribute('data-date', day.getFormatted());
			dayElement.className = '';
			this.htmlHelper.addClass(dayElement, 'cell');
			this.options.updateCellStructure(dayContentElement, day);

			if (!day.isVisible) {
				dayButtonElement.removeAttribute('href');
				dayButtonElement.style.visibility = 'hidden';
				return;
			}

			this.htmlHelper.addClass(dayElement, 'day');
			if (day.isToday) {
				this.htmlHelper.addClass(dayElement, 'day--today');
			}
			if (day.isPast) {
				this.htmlHelper.addClass(dayElement, 'day--past');
			}
			if (day.isWeekend) {
				this.htmlHelper.addClass(dayElement, 'day--weekend');
			}
			if (!day.isAvailable) {
				this.htmlHelper.addClass(dayElement, 'day--unavailable');
			}
			if (!day.isInCurrentMonth) {
				this.htmlHelper.addClass(dayElement, 'day--outside');
			}
			if (day.isHighlighted) {
				this.htmlHelper.addClass(dayElement, 'day--highlighted');
			}
			if (day.isSelected) {
				this.htmlHelper.addClass(dayElement, 'day--selected');
			}
			const customClasses = this.options.getCellClasses(day);
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

		protected createTableCellButtonElement(viewModel: ViewModel): HTMLDayButtonElement {
			const cellButton = this.htmlHelper.createAnchor((event: Event) => {
				const previous = viewModel.selectedDate;
				const isSelected = viewModel.selectDay(event, cellButton.day, false, true, true);
				if (this.options.isHiddenOnSelect() && (isSelected || (previous !== null && cellButton.day.isEqualToDate(previous)))) {
					viewModel.close(event);
				}
			}) as HTMLDayButtonElement;

			cellButton.onfocus = (event: FocusEvent) => {
				viewModel.highlightDay(event || window.event, cellButton.day);
			};

			cellButton.onmouseenter = () => {
				viewModel.cancelHighlight();
			};

			cellButton.onmouseleave = () => {
				viewModel.cancelHighlight();
			};

			return cellButton;
		}

		protected createTableCellContentElement(viewModel: ViewModel): HTMLElement {
			const cellContent = this.options.getCellStructure();
			this.htmlHelper.addClass(cellContent, 'day-content');

			return cellContent;
		}

	}

}
