/// <reference path="Options.ts" />
/// <reference path="HtmlHelper.ts" />
/// <reference path="ViewModel.ts" />

namespace TheDatepicker {

	interface HTMLDayContentElement extends HTMLAnchorElement {

		day: Day;

	}

	export class Template {

		// todo nějak hezky aby šlo snadno customizovat uspořádání prvků

		private readonly options: Options;
		private readonly htmlHelper: HtmlHelper;

		private containerElement: HTMLElement | null = null;
		private goBackElement: HTMLElement | null = null;
		private goForwardElement: HTMLElement | null = null;
		private titleElement: HTMLElement | null = null;
		private resetElement: HTMLElement | null = null;
		private closeElement: HTMLElement | null = null;
		private monthSelect: HTMLSelectElement | null = null;
		private monthElement: HTMLElement | null = null;
		private yearSelect: HTMLSelectElement | null = null;
		private yearElement: HTMLElement | null = null;
		private weeksElements: HTMLElement[] = [];
		private daysElements: HTMLElement[][] = [];
		private daysContentsElements: HTMLDayContentElement[][] = [];

		public constructor(options: Options, htmlHelper: HtmlHelper) {
			this.options = options;
			this.htmlHelper = htmlHelper;
		}

		public render(viewModel: ViewModel, datepicker: Datepicker): void {
			if (this.containerElement === null) {
				if (datepicker.input !== null && this.options.isHiddenOnBlur() && !viewModel.isActive()) {
					return;
				}

				datepicker.container.innerHTML = '';
				datepicker.container.appendChild(this.createSkeleton(viewModel, datepicker));
			}

			this.updateContainerElement(viewModel, datepicker.input);
			this.updateTitleElement(viewModel);
			this.updateCloseElement(viewModel, datepicker.input);
			this.updateResetElement(viewModel);
			this.updateGoBackElement(viewModel);
			this.updateGoForwardElement(viewModel);
			this.updateMonthElement(viewModel);
			this.updateYearElement(viewModel);
			this.updateWeeksElements(viewModel);
		}

		protected createSkeleton(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const container = this.htmlHelper.createDiv('container');
			container.appendChild(this.createHeaderElement(viewModel, datepicker));
			container.appendChild(this.createBodyElement(viewModel, datepicker));

			this.containerElement = container;

			return container;
		}

		protected updateContainerElement(viewModel: ViewModel, input: HTMLInputElement | null): void {
			this.containerElement.style.display = input === null || viewModel.isActive() || !this.options.isHiddenOnBlur() ? 'block' : 'none';
		}

		protected createHeaderElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const state = this.htmlHelper.createDiv('state');
			state.appendChild(this.createMonthElement(viewModel));
			state.appendChild(this.createYearElement(viewModel));

			const navigation = this.htmlHelper.createDiv('navigation');
			navigation.appendChild(this.createGoBackElement(viewModel));
			navigation.appendChild(state);
			navigation.appendChild(this.createGoForwardElement(viewModel));

			const control = this.htmlHelper.createDiv('control');
			control.appendChild(this.createTitleElement(viewModel));
			control.appendChild(this.createCloseElement(viewModel, datepicker));
			control.appendChild(this.createResetElement(viewModel));

			const header = this.htmlHelper.createDiv('header');
			header.appendChild(control);
			header.appendChild(navigation);

			return header;
		}

		protected createTitleElement(viewModel: ViewModel): HTMLElement {
			const titleElement = this.htmlHelper.createDiv('title');
			this.titleElement = titleElement;

			return titleElement;
		}

		protected updateTitleElement(viewModel: ViewModel): void {
			const title = this.options.getTitle();
			this.titleElement.style.display = title !== '' ? 'block' : 'none';
			this.titleElement.innerText = title;
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
			this.resetElement.style.display = this.options.isResetButtonShown() ? 'block' : 'none';
		}

		protected createCloseElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const closeElement = this.htmlHelper.createDiv('close');
			const closeButton = this.htmlHelper.createAnchor((event: Event) => {
				datepicker.close(event);
			});

			closeButton.innerHTML = this.options.getCloseHtml();
			closeElement.appendChild(closeButton);
			this.closeElement = closeElement;

			return closeElement;
		}

		protected updateCloseElement(viewModel: ViewModel, input: HTMLInputElement | null): void {
			this.closeElement.style.display = input !== null && this.options.isHiddenOnBlur() && this.options.isCloseButtonShown() ? 'block' : 'none';
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
					value: monthNumber,
					label: this.options.translator.translateMonth(monthNumber),
				});
			}

			const selectElement = this.htmlHelper.createSelectInput(options, (event: Event, monthNumber: number) => {
				const newMonth = new Date(viewModel.getCurrentMonth().getTime());
				newMonth.setMonth(monthNumber);
				viewModel.goToMonth(event, newMonth);
			});

			const monthElement = this.htmlHelper.createDiv('month');
			const monthSpan = this.htmlHelper.createSpan();
			monthElement.appendChild(selectElement);
			monthElement.appendChild(monthSpan);

			this.monthElement = monthSpan;
			this.monthSelect = selectElement;

			return monthElement;
		}

		protected updateMonthElement(viewModel: ViewModel): void {
			const currentMonth = viewModel.getCurrentMonth().getMonth();
			this.monthElement.innerText = this.options.translator.translateMonth(currentMonth);

			if (!this.options.isMonthAsDropdown()) {
				this.monthSelect.style.display = 'none';
				this.monthElement.style.display = 'inline';
				return;
			}

			let valuesCount = 0;
			for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
				const newMonth = new Date(viewModel.getCurrentMonth().getTime());
				newMonth.setMonth(monthNumber);
				const option = this.monthSelect.getElementsByTagName('option')[monthNumber];
				const canGoToMonth = viewModel.canGoToMonth(newMonth);
				option.disabled = !canGoToMonth;
				option.style.display = canGoToMonth ? 'inline' : 'none';
				valuesCount += canGoToMonth ? 1 : 0;
			}

			this.monthSelect.value = currentMonth.toString();

			this.monthSelect.style.display = valuesCount > 1 ? 'inline' : 'none';
			this.monthElement.style.display = valuesCount > 1 ? 'none' : 'inline';
		}

		protected createYearElement(viewModel: ViewModel): HTMLElement {
			const options: SelectOption[] = [];
			const limits = this.options.getYearsSelectionLimits();
			for (let year = limits.from; year <= limits.to; year++) {
				options.push({
					value: year,
					label: year.toString(),
				});
			}

			const selectElement = this.htmlHelper.createSelectInput(options, (event: Event, year: number) => {
				const newYear = new Date(viewModel.getCurrentMonth().getTime());
				newYear.setFullYear(year);
				viewModel.goToMonth(event, newYear);
			});

			const yearElement = this.htmlHelper.createDiv('year');
			const yearSpan = this.htmlHelper.createSpan();
			yearElement.appendChild(selectElement);
			yearElement.appendChild(yearSpan);

			this.yearElement = yearSpan;
			this.yearSelect = selectElement;

			return yearElement;
		}

		protected updateYearElement(viewModel: ViewModel): void {
			const currentYear = viewModel.getCurrentMonth().getFullYear();
			this.yearElement.innerText = currentYear.toString();

			if (!this.options.isYearAsDropdown()) {
				this.yearSelect.style.display = 'none';
				this.yearElement.style.display = 'inline';
				return;
			}

			const options = this.yearSelect.getElementsByTagName('option');
			const yearFrom = parseInt(options[0].value, 10);
			const minDate = this.options.getMinDate();
			const minYear = minDate !== null ? minDate.getFullYear() : null;
			const maxDate = this.options.getMaxDate();
			const maxYear = maxDate !== null ? maxDate.getFullYear() : null;

			// todo optimalizovat
			let valuesCount = 0;
			let includesCurrentYear = false;
			for (let index = 0; index < options.length; index++) {
				const year = yearFrom + index;
				if (year === currentYear) {
					includesCurrentYear = true;
				}

				let canGoToYear: boolean;
				if (year === minYear || year === maxYear) {
					const newYear = new Date(viewModel.getCurrentMonth().getTime());
					newYear.setFullYear(year);
					canGoToYear = viewModel.canGoToMonth(newYear);
				} else {
					canGoToYear = (minYear === null || year > minYear) && (maxYear === null || year < maxYear);
				}
				options[index].disabled = !canGoToYear;
				options[index].style.display = canGoToYear ? 'inline' : 'none';
				valuesCount += canGoToYear ? 1 : 0;
			}

			if (includesCurrentYear) {
				this.yearSelect.value = currentYear.toString();
			}

			const isSelectVisible = includesCurrentYear && valuesCount > 1;
			this.yearSelect.style.display = isSelectVisible ? 'inline' : 'none';
			this.yearElement.style.display = isSelectVisible ? 'none' : 'inline';
		}

		protected createTableElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const tableHeader = this.createTableHeaderElement(viewModel) as HTMLTableSectionElement;
			const tableBody = this.createTableBodyElement(viewModel, datepicker) as HTMLTableSectionElement;

			return this.htmlHelper.createTable('table', tableHeader, tableBody);
		}

		protected createTableHeaderElement(viewModel: ViewModel): HTMLElement {
			const weekDays = viewModel.getWeekDays();

			const cells = [];
			for (let index = 0; index < weekDays.length; index++) {
				const dayOfWeek = weekDays[index];
				cells.push(this.createTableHeaderCellElement(viewModel, dayOfWeek));
			}

			return this.htmlHelper.createTableHeader('table-header', cells as HTMLTableHeaderCellElement[]);
		}

		protected createTableHeaderCellElement(viewModel: ViewModel, dayOfWeek: DayOfWeek): HTMLElement {
			const headerCell = this.htmlHelper.createTableHeaderCell('table-header-cell');

			if (dayOfWeek === DayOfWeek.Saturday || dayOfWeek === DayOfWeek.Sunday) {
				this.htmlHelper.addClass(headerCell, 'weekend');
			}

			headerCell.innerText = this.options.translator.translateDayOfWeek(dayOfWeek);

			return headerCell;
		}

		protected createTableBodyElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			this.daysElements = [];
			this.daysContentsElements = [];

			const rows = [];
			for (let index = 0; index < 6; index++) {
				rows.push(this.createTableRowElement(viewModel, datepicker));
			}
			this.weeksElements = rows;

			return this.htmlHelper.createTableBody('table-body', rows as HTMLTableRowElement[]);
		}

		protected updateWeeksElements(viewModel: ViewModel): void {
			const weeks = viewModel.getWeeks();

			for (let weekIndex = 0; weekIndex < this.weeksElements.length; weekIndex++) {
				const weekElement = this.weeksElements[weekIndex];
				const week = weeks.length > weekIndex ? weeks[weekIndex] : null;

				weekElement.style.display = week !== null ? 'table-row' : 'none';

				if (week !== null) {
					for (let dayIndex = 0; dayIndex < this.daysElements[weekIndex].length; dayIndex++) {
						this.updateDayElement(viewModel, this.daysElements[weekIndex][dayIndex], this.daysContentsElements[weekIndex][dayIndex], week[dayIndex]);
					}
				}
			}
		}

		protected createTableRowElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const cells = [];
			const cellsContents = [];
			for (let index = 0; index < 7; index++) {
				const cell = this.htmlHelper.createTableCell();
				const cellContent = this.createTableCellContentElement(viewModel, datepicker);

				cells.push(cell);
				cellsContents.push(cellContent);

				cell.appendChild(cellContent);
			}
			this.daysElements.push(cells);
			this.daysContentsElements.push(cellsContents);

			return this.htmlHelper.createTableRow('week', cells as HTMLTableCellElement[]);
		}

		protected updateDayElement(viewModel: ViewModel, dayElement: HTMLElement, dayContentElement: HTMLDayContentElement, day: Day): void {
			dayContentElement.day = day;
			dayElement.className = '';

			if (!day.isInCurrentMonth && !this.options.areDaysOutOfMonthVisible()) {
				dayContentElement.innerText = '';
				dayContentElement.removeAttribute('href');
				dayContentElement.style.visibility = 'hidden';
				return;
			}

			this.htmlHelper.addClass(dayElement, 'day');
			if (day.isToday) {
				this.htmlHelper.addClass(dayElement, 'today');
			}
			if (day.isWeekend) {
				this.htmlHelper.addClass(dayElement, 'weekend');
			}
			if (!day.isAvailable) {
				this.htmlHelper.addClass(dayElement, 'unavailable');
			}
			if (!day.isInCurrentMonth) {
				this.htmlHelper.addClass(dayElement, 'outside');
			}
			if (day.isHighlighted) {
				this.htmlHelper.addClass(dayElement, 'highlighted');
			}
			if (day.isSelected) {
				this.htmlHelper.addClass(dayElement, 'selected');
			}
			const customClasses = this.options.getCellClasses(day);
			for (let index = 0; index < customClasses.length; index++) {
				dayElement.className += ' ' + customClasses[index];
			}

			dayContentElement.style.visibility = 'visible';
			dayContentElement.innerText = this.options.getCellContent(day);

			if (day.isAvailable) {
				dayContentElement.href = '#';
			} else {
				dayContentElement.removeAttribute('href');
			}

			if (day.isFocused) {
				dayContentElement.focus();
			}
		}

		protected createTableCellContentElement(viewModel: ViewModel, datepicker: Datepicker): HTMLDayContentElement {
			const cellContent = this.htmlHelper.createAnchor((event: Event) => {
				viewModel.selectDay(event, cellContent.day, false, true, true);
				if (this.options.isHiddenOnSelect()) {
					datepicker.close(event);
				}
			}) as HTMLDayContentElement;

			cellContent.onfocus = (event: FocusEvent) => {
				viewModel.highlightDay(event, cellContent.day);
			};

			cellContent.onmouseenter = (event: MouseEvent) => {
				viewModel.cancelHighlight();
			};

			cellContent.onmouseleave = () => {
				viewModel.cancelHighlight();
			};

			return cellContent;
		}

		protected createBodyElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const body = this.htmlHelper.createDiv('body');
			body.appendChild(this.createTableElement(viewModel, datepicker));

			return body;
		}

	}

}
