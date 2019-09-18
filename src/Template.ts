/// <reference path="Options.ts" />
/// <reference path="HtmlHelper.ts" />
/// <reference path="ViewModel.ts" />

namespace TheDatepicker {

	interface HTMLDayButtonElement extends HTMLAnchorElement {

		day: Day;

	}

	export class Template {

		// todo nějak hezky aby šlo snadno customizovat uspořádání prvků

		private readonly options: Options;
		private readonly htmlHelper: HtmlHelper;

		private containerElement: HTMLElement | null = null;
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
		private weeksElements: HTMLElement[] = [];
		private daysElements: HTMLElement[][] = [];
		private daysButtonsElements: HTMLDayButtonElement[][] = [];
		private daysContentsElements: HTMLElement[][] = [];

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
			this.updateTopElement(viewModel, datepicker.input);
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
			this.containerElement.style.display = input === null || viewModel.isActive() || !this.options.isHiddenOnBlur() ? '' : 'none';
		}

		protected createHeaderElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const header = this.htmlHelper.createDiv('header');

			const top = this.htmlHelper.createDiv('top');
			header.appendChild(top);

			top.appendChild(this.createTitleElement(viewModel));

			const control = this.htmlHelper.createDiv('control');
			top.appendChild(control);

			control.appendChild(this.createResetElement(viewModel));
			control.appendChild(this.createCloseElement(viewModel, datepicker));

			const navigation = this.htmlHelper.createDiv('navigation');
			header.appendChild(navigation);

			navigation.appendChild(this.createGoBackElement(viewModel));

			const state = this.htmlHelper.createDiv('state');
			navigation.appendChild(state);

			state.appendChild(this.createMonthElement(viewModel));
			state.appendChild(this.createYearElement(viewModel));

			navigation.appendChild(this.createGoForwardElement(viewModel));

			this.controlElement = control;

			return header;
		}

		protected updateTopElement(viewModel: ViewModel, input: HTMLInputElement | null): void {
			const isVisible = this.options.getTitle() !== ''
				|| this.options.isResetButtonShown()
				|| (input !== null && this.options.isCloseButtonShown());
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
			this.closeElement.style.display = input !== null && this.options.isCloseButtonShown() ? '' : 'none';
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
			const monthContent = this.htmlHelper.createSpan();
			monthElement.appendChild(selectElement);
			monthElement.appendChild(monthContent);

			this.monthElement = monthContent;
			this.monthSelect = selectElement;

			return monthElement;
		}

		protected updateMonthElement(viewModel: ViewModel): void {
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

			this.monthSelect.value = currentMonth.toString();

			this.monthSelect.style.display = valuesCount > 1 ? '' : 'none';
			this.monthElement.style.display = valuesCount > 1 ? 'none' : '';
		}

		protected createYearElement(viewModel: ViewModel): HTMLElement {
			const selectElement = this.htmlHelper.createSelectInput([], (event: Event, year: number) => {
				let newMonth = new Date(viewModel.getCurrentMonth().getTime());
				newMonth.setFullYear(year);

				const minMonth = this.options.getMinMonth();
				const maxMonth = this.options.getMaxMonth();
				if (minMonth !== null && newMonth.getTime() < minMonth.getTime()) {
					newMonth = minMonth;
				}
				if (maxMonth !== null && newMonth.getTime() > maxMonth.getTime()) {
					newMonth = maxMonth;
				}

				viewModel.goToMonth(event, newMonth);
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
			const currentYear = viewModel.getCurrentMonth().getFullYear();
			this.yearElement.innerText = currentYear.toString();

			if (!this.options.isYearAsDropdown()) {
				this.yearSelect.style.display = 'none';
				this.yearElement.style.display = '';
				return;
			}

			const minDate = this.options.getMinDate();
			const maxDate = this.options.getMaxDate();
			const minYear = minDate !== null ? minDate.getFullYear() : null;
			const maxYear = maxDate !== null ? maxDate.getFullYear() : null;
			const limit = this.options.getYearDropdownItemsLimit() - 1;
			const maxAppend = Math.ceil(limit / 2);
			let from = currentYear - (limit - maxAppend);
			let to = currentYear + maxAppend;
			if (minYear !== null && from < minYear) {
				to += minYear - from;
				if (maxYear !== null && to > maxYear) {
					to = maxYear;
				}
				from = minYear;
			} else if (maxYear !== null && to > maxYear) {
				from -= to - maxYear;
				if (minYear !== null && from < minYear) {
					from = minYear;
				}
				to = maxYear;
			}

			const options = this.yearSelect.getElementsByTagName('option');
			const firstOption = options.length > 0 ? parseInt(options[0].value, 10) : null;
			const lastOption = options.length > 0 ? parseInt(options[options.length - 1].value, 10) : null;
			const prepend = [];
			const append = [];
			const remove = [];
			for (let year = from; year <= to; year++) {
				if (firstOption === null || year < firstOption) {
					prepend.push(year);
				} else if (year > lastOption) {
					append.push(year);
				}
			}
			for (let index = 0; index < options.length; index++) {
				const year = parseInt(options[index].value, 10);
				if (year < from || year > to) {
					remove.push(options[index]);
				}
			}

			for (let index = 0; index < remove.length; index++) {
				this.yearSelect.removeChild(remove[index]);
			}
			for (let index = prepend.length - 1; index >= 0; index--) {
				this.yearSelect.insertBefore(this.htmlHelper.createSelectOption(prepend[index], prepend[index].toString()), this.yearSelect.firstChild);
			}
			for (let index = 0; index < append.length; index++) {
				this.yearSelect.appendChild(this.htmlHelper.createSelectOption(append[index], append[index].toString()));
			}

			this.yearSelect.value = currentYear.toString();

			this.yearSelect.style.display = from < to ? '' : 'none';
			this.yearElement.style.display = from < to ? 'none' : '';
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
			this.daysButtonsElements = [];
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

		protected createTableRowElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const cells = [];
			const cellsButtons = [];
			const cellsContents = [];
			for (let index = 0; index < 7; index++) {
				const cell = this.htmlHelper.createTableCell();
				const cellButton = this.createTableCellButtonElement(viewModel, datepicker);
				const cellContent = this.createTableCellContentElement(viewModel, datepicker);

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
			dayElement.className = '';
			this.htmlHelper.addClass(dayElement, 'cell');

			if (!day.isInCurrentMonth && !this.options.areDaysOutOfMonthVisible()) {
				dayContentElement.innerText = '';
				dayButtonElement.removeAttribute('href');
				dayButtonElement.style.visibility = 'hidden';
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

			dayButtonElement.style.visibility = 'visible';
			dayContentElement.innerText = this.options.getCellContent(day);

			if (day.isAvailable) {
				dayButtonElement.href = '#';
			} else {
				dayButtonElement.removeAttribute('href');
			}

			if (day.isFocused) {
				dayButtonElement.focus();
			}
		}

		protected createTableCellButtonElement(viewModel: ViewModel, datepicker: Datepicker): HTMLDayButtonElement {
			const cellButton = this.htmlHelper.createAnchor((event: Event) => {
				viewModel.selectDay(event, cellButton.day, false, true, true);
				if (this.options.isHiddenOnSelect()) {
					datepicker.close(event);
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

		protected createTableCellContentElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const cellContent = this.htmlHelper.createSpan();
			this.htmlHelper.addClass(cellContent, 'day-content');

			return cellContent;
		}

		protected createBodyElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const body = this.htmlHelper.createDiv('body');
			body.appendChild(this.createTableElement(viewModel, datepicker));

			return body;
		}

	}

}
