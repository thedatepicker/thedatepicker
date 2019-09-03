/// <reference path="Options.ts" />
/// <reference path="HtmlHelper.ts" />
/// <reference path="ViewModel.ts" />

namespace TheDatepicker {

	interface HTMLDayContentElement extends HTMLAnchorElement {

		day: Day;

	}

	export class Template {

		// todo nějak hezky aby šlo snadno customizovat uspořádání prvků
		// todo sjednotit goBackHtml & getCellHtml
		public goBackHtml = '&lt;';
		public goForwardHtml = '&gt;';
		public closeHtml = '&times;';
		public resetHtml = '&olarr;';

		private readonly options: Options;
		private readonly htmlHelper: HtmlHelper;

		private containerElement: HTMLElement | null = null;
		private goBackElement: HTMLElement | null = null;
		private goForwardElement: HTMLElement | null = null;
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
			// todo customizovat CSS třídy
			this.options = options;
			this.htmlHelper = htmlHelper;
		}

		public render(viewModel: ViewModel, datepicker: Datepicker): void {
			if (this.containerElement === null) {
				if (datepicker.getInput() !== null && this.options.isHiddenOnBlur() && !viewModel.isActive()) {
					return;
				}

				const container = datepicker.getContainer();
				container.innerHTML = '';
				container.appendChild(this.createSkeleton(viewModel, datepicker));
			}

			this.updateContainerElement(viewModel, datepicker.getInput());
			this.updateCloseElement(viewModel, datepicker.getInput());
			this.updateResetElement(viewModel);
			this.updateGoBackElement(viewModel);
			this.updateGoForwardElement(viewModel);
			this.updateMonthElement(viewModel);
			this.updateYearElement(viewModel);
			this.updateWeeksElements(viewModel);
		}

		public setClassesPrefix(prefix: string): void {
			this.htmlHelper.setClassesPrefix(prefix);
		}

		public getCellHtml(viewModel: ViewModel, day: Day): string {
			return day.dayNumber.toString();
		}

		protected createSkeleton(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const container = this.htmlHelper.createDiv('container');
			container.appendChild(this.createHeaderElement(viewModel, datepicker));
			container.appendChild(this.createBodyElement(viewModel));

			this.containerElement = container;

			return container;
		}

		protected updateContainerElement(viewModel: ViewModel, input: HTMLInputElement | null): void {
			this.containerElement.style.display = input === null || viewModel.isActive() || !this.options.isHiddenOnBlur() ? 'block' : 'none';
		}

		protected createHeaderElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const title = this.htmlHelper.createDiv('title');
			title.appendChild(this.createMonthElement(viewModel));
			title.appendChild(this.createYearElement(viewModel));

			const navigation = this.htmlHelper.createDiv('navigation');
			navigation.appendChild(this.createGoBackElement(viewModel));
			navigation.appendChild(title);
			navigation.appendChild(this.createGoForwardElement(viewModel));

			const control = this.htmlHelper.createDiv('control');
			control.appendChild(this.createCloseElement(viewModel, datepicker));
			control.appendChild(this.createResetElement(viewModel));

			const header = this.htmlHelper.createDiv('header');
			header.appendChild(control);
			header.appendChild(navigation);

			return header;
		}

		protected createResetElement(viewModel: ViewModel): HTMLElement {
			const resetElement = this.htmlHelper.createDiv('reset');
			const resetButton = this.htmlHelper.createAnchor((event: MouseEvent) => {
				viewModel.reset(event);
			});

			resetButton.onkeydown = (event: KeyboardEvent) => {
				if (Helper.inArray([KeyCode.Enter, KeyCode.Space], event.keyCode)) {
					event.preventDefault();
					viewModel.reset(event);
				}
			};

			resetButton.innerHTML = this.resetHtml;
			resetElement.appendChild(resetButton);
			this.resetElement = resetElement;

			return resetElement;
		}

		protected updateResetElement(viewModel: ViewModel): void {
			this.resetElement.style.display = this.options.isResetButtonShown() ? 'block' : 'none';
			// todo visibility hidden pokud je v resetovaném stavu
		}

		protected createCloseElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const closeElement = this.htmlHelper.createDiv('close');
			const closeButton = this.htmlHelper.createAnchor(() => {
				datepicker.close();
			});

			closeButton.onkeydown = (event: KeyboardEvent) => {
				if (Helper.inArray([KeyCode.Enter, KeyCode.Space], event.keyCode)) {
					event.preventDefault();
					datepicker.close();
				}
			};

			closeButton.innerHTML = this.closeHtml;
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
			const goButton = this.htmlHelper.createAnchor((event: MouseEvent) => {
				if (directionForward) {
					viewModel.goForward(event);
				} else {
					viewModel.goBack(event);
				}
			});

			goButton.onkeydown = (event: KeyboardEvent) => {
				if (Helper.inArray([KeyCode.Enter, KeyCode.Space], event.keyCode)) {
					event.preventDefault();
					if (directionForward) {
						viewModel.goForward(event);
					} else {
						viewModel.goBack(event);
					}
				}
			};

			goButton.innerHTML = directionForward ? this.goForwardHtml : this.goBackHtml;
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
					label: this.options.getTranslator().translateMonth(monthNumber),
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
			this.monthElement.innerText = this.options.getTranslator().translateMonth(currentMonth);

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
			const options = this.yearSelect.getElementsByTagName('option');
			const yearFrom = parseInt(options[0].value, 10);
			const minDate = this.options.getMinDate();
			const minYear = minDate !== null ? minDate.getFullYear() : null;
			const maxDate = this.options.getMaxDate();
			const maxYear = maxDate !== null ? maxDate.getFullYear() : null;

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
			this.yearElement.innerText = currentYear.toString();

			const isSelectVisible = includesCurrentYear && valuesCount > 1;
			this.yearSelect.style.display = isSelectVisible ? 'inline' : 'none';
			this.yearElement.style.display = isSelectVisible ? 'none' : 'inline';
		}

		protected createTableElement(viewModel: ViewModel): HTMLElement {
			const tableHeader = this.createTableHeaderElement(viewModel) as HTMLTableSectionElement;
			const tableBody = this.createTableBodyElement(viewModel) as HTMLTableSectionElement;

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

			headerCell.innerText = this.options.getTranslator().translateDayOfWeek(dayOfWeek);

			return headerCell;
		}

		protected createTableBodyElement(viewModel: ViewModel): HTMLElement {
			this.daysElements = [];
			this.daysContentsElements = [];

			const rows = [];
			for (let index = 0; index < 6; index++) {
				rows.push(this.createTableRowElement(viewModel));
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

		protected createTableRowElement(viewModel: ViewModel): HTMLElement {
			const cells = [];
			const cellsContents = [];
			for (let index = 0; index < 7; index++) {
				const cell = this.htmlHelper.createTableCell('day');
				const cellContent = this.createTableCellContentElement(viewModel);

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

			if (!day.isInCurrentMonth && !this.options.areDaysOutOfMonthVisible()) {
				dayElement.className = '';
				dayContentElement.innerHTML = '';
				dayContentElement.removeAttribute('href');
				dayContentElement.style.visibility = 'hidden';
				return;
			}

			this.htmlHelper.toggleClass(dayElement, 'today', day.isToday);
			this.htmlHelper.toggleClass(dayElement, 'weekend', day.isWeekend);
			this.htmlHelper.toggleClass(dayElement, 'unavailable', !day.isAvailable);
			this.htmlHelper.toggleClass(dayElement, 'outside', !day.isInCurrentMonth);
			this.htmlHelper.toggleClass(dayElement, 'highlighted', day.isHighlighted);
			this.htmlHelper.toggleClass(dayElement, 'selected', day.isSelected);

			// todo nestačil by innerText?
			dayContentElement.style.visibility = 'visible';
			dayContentElement.innerHTML = this.getCellHtml(viewModel, day);

			if (day.isAvailable) {
				dayContentElement.href = '#';
			} else {
				dayContentElement.removeAttribute('href');
			}

			if (day.isFocused) {
				dayContentElement.focus();
			}
		}

		protected createTableCellContentElement(viewModel: ViewModel): HTMLDayContentElement {
			const cellContent = this.htmlHelper.createAnchor((event: MouseEvent) => {
				viewModel.selectDay(event, cellContent.day);
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

			cellContent.onkeydown = (event: KeyboardEvent) => {
				if (Helper.inArray([KeyCode.Enter, KeyCode.Space], event.keyCode)) {
					event.preventDefault();
					viewModel.selectDay(event, cellContent.day);
				}
			};

			return cellContent;
		}

		protected createBodyElement(viewModel: ViewModel): HTMLElement {
			const body = this.htmlHelper.createDiv('body');
			body.appendChild(this.createTableElement(viewModel));

			return body;
		}

	}

}
