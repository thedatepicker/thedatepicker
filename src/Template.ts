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
		public areDaysOutOfMonthVisible: true;

		private readonly options: Options;
		private readonly htmlHelper: HtmlHelper;

		private readonly maxWeeks = 6;
		private readonly daysInWeekCount = 7;

		private containerElement: HTMLElement | null = null;
		private goBackElement: HTMLElement | null = null;
		private goForwardElement: HTMLElement | null = null;
		private closeElement: HTMLElement | null = null;
		private monthElement: HTMLElement | null = null;
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
				const container = datepicker.getContainer();
				container.innerHTML = '';
				container.appendChild(this.createSkeleton(viewModel, datepicker));
			}

			this.updateContainerElement(viewModel);
			this.updateCloseElement(viewModel, datepicker.getInput());
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

		protected updateContainerElement(viewModel: ViewModel): void {
			this.containerElement.style.display = viewModel.isActive() || !this.options.isHiddenOnBlur() ? 'block' : 'none';
		}

		protected createHeaderElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const title = this.htmlHelper.createDiv('title');
			title.appendChild(this.createMonthElement(viewModel));
			title.appendChild(this.createYearElement(viewModel));

			const navigation = this.htmlHelper.createDiv('navigation');
			navigation.appendChild(this.createGoBackElement(viewModel));
			navigation.appendChild(title);
			navigation.appendChild(this.createGoForwardElement(viewModel));

			const header = this.htmlHelper.createDiv('header');
			header.appendChild(this.createCloseElement(viewModel, datepicker));
			header.appendChild(navigation);

			return header;
		}

		protected createCloseElement(viewModel: ViewModel, datepicker: Datepicker): HTMLElement {
			const closeElement = this.htmlHelper.createDiv('close');
			const closeButton = this.htmlHelper.createAnchor(() => {
				datepicker.close();
			});

			closeButton.onkeydown = (event: KeyboardEvent) => {
				if ([KeyCode.Enter, KeyCode.Space].indexOf(event.keyCode) > -1) {
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
			this.closeElement.style.display = input !== null && this.options.isHiddenOnBlur() ? 'block' : 'none';
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
			const goButton = this.htmlHelper.createAnchor(() => {
				if (directionForward) {
					viewModel.goForward();
				} else {
					viewModel.goBack();
				}
			});

			goButton.onkeydown = (event: KeyboardEvent) => {
				if ([KeyCode.Enter, KeyCode.Space].indexOf(event.keyCode) > -1) {
					event.preventDefault();
					if (directionForward) {
						viewModel.goForward();
					} else {
						viewModel.goBack();
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
			const monthElement = this.htmlHelper.createDiv('month');
			this.monthElement = monthElement;

			return monthElement;
		}

		protected updateMonthElement(viewModel: ViewModel): void {
			this.monthElement.innerText = this.options.getTranslator().translateMonth(viewModel.getCurrentMonth().getMonth());
		}

		protected createYearElement(viewModel: ViewModel): HTMLElement {
			// todo lepší by byl select, textově to může měnit v inputu (jenže jaký rozsah tam zobrazit? 1900 - 2100 ?)
			const yearElement = this.htmlHelper.createDiv('year');
			this.yearElement = yearElement;

			return yearElement;
		}

		protected updateYearElement(viewModel: ViewModel): void {
			this.yearElement.innerText = viewModel.getCurrentMonth().getFullYear().toString();
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
			for (let index = 0; index < this.maxWeeks; index++) {
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
			for (let index = 0; index < this.daysInWeekCount; index++) {
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

			// todo areDaysOutOfMonthVisible así do options
			if (!day.isInCurrentMonth && !this.areDaysOutOfMonthVisible) {
				dayElement.className = '';
				dayContentElement.innerHTML = '';
				dayContentElement.removeAttribute('href');
				return;
			}

			this.htmlHelper.toggleClass(dayElement, 'today', day.isToday);
			this.htmlHelper.toggleClass(dayElement, 'weekend', day.isWeekend);
			this.htmlHelper.toggleClass(dayElement, 'unavailable', !day.isAvailable);
			this.htmlHelper.toggleClass(dayElement, 'highlighted', day.isHighlighted);
			this.htmlHelper.toggleClass(dayElement, 'selected', day.isSelected);

			// todo nestačil by innerText?
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

			cellContent.onfocus = () => {
				viewModel.highlightDay(cellContent.day);
			};

			cellContent.onmouseenter = () => {
				viewModel.hoverDay(cellContent.day);
			};

			cellContent.onmouseleave = () => {
				viewModel.cancelHover();
			};

			cellContent.onkeydown = (event: KeyboardEvent) => {
				if ([KeyCode.Enter, KeyCode.Space].indexOf(event.keyCode) > -1) {
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
