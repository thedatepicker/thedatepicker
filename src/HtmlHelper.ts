namespace TheDatepicker {

	export interface SelectOption {
		value: number;
		label: string;
	}

	export class HtmlHelper {

		private classesPrefix = 'the-datepicker-';

		private readonly document: Document;

		public constructor() {
			this.document = document;
		}

		public setClassesPrefix(prefix: string): void {
			if (typeof prefix !== 'string') {
				throw new Error('Classes prefix was expected to be a string, but ' + typeof prefix + ' given.');
			}

			this.classesPrefix = prefix;
		}

		public createDiv(className: string): HTMLDivElement {
			const div = this.document.createElement('div');
			this.addClass(div, className);

			return div;
		}

		public createAnchor(onClick: (event: Event) => void): HTMLAnchorElement {
			const anchor = this.document.createElement('a');
			this.addClass(anchor, 'button');
			anchor.href = '#';

			anchor.onclick = (event: MouseEvent) => {
				event.preventDefault();
				onClick(event);
			};

			anchor.onkeydown = (event: KeyboardEvent) => {
				if (Helper.inArray([KeyCode.Enter, KeyCode.Space], event.keyCode)) {
					event.preventDefault();
					onClick(event);
				}
			};

			return anchor;
		}

		public createSpan(): HTMLSpanElement {
			return this.document.createElement('span');
		}

		public createTable(className: string, header: HTMLTableSectionElement, body: HTMLTableSectionElement): HTMLTableElement {
			const table = this.document.createElement('table');
			this.addClass(table, className);
			table.appendChild(header);
			table.appendChild(body);

			return table;
		}

		public createTableHeader(className: string, cells: HTMLTableHeaderCellElement[]): HTMLTableSectionElement {
			const tableHeader = this.document.createElement('thead');
			this.addClass(tableHeader, className);

			const row = this.document.createElement('tr');
			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}
			tableHeader.appendChild(row);

			return tableHeader;
		}

		public createTableHeaderCell(className: string): HTMLTableHeaderCellElement {
			const cell = this.document.createElement('th');
			this.addClass(cell, className);

			return cell;
		}

		public createTableBody(className: string, rows: HTMLTableRowElement[]): HTMLTableSectionElement {
			const tableBody = this.document.createElement('tbody');
			this.addClass(tableBody, className);

			for (let index = 0; index < rows.length; index++) {
				tableBody.appendChild(rows[index]);
			}

			return tableBody;
		}

		public createTableRow(className: string, cells: HTMLTableCellElement[]): HTMLTableRowElement {
			const row = this.document.createElement('tr');

			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}

			return row;
		}

		public createTableCell(className: string): HTMLTableCellElement {
			const cell = this.document.createElement('td');
			this.addClass(cell, className);

			return cell;
		}

		public createSelectInput(options: SelectOption[], onChange: (event: Event, value: number) => void): HTMLSelectElement {
			const input = this.document.createElement('select');
			this.addClass(input, 'select');

			for (let index = 0; index < options.length; index++) {
				const option = this.document.createElement('option');
				option.value = options[index].value.toString();
				option.innerText = options[index].label;
				input.appendChild(option);
			}

			input.onchange = (event: Event) => {
				onChange(event, parseInt(input.value, 10));
			};

			input.onkeydown = (event: KeyboardEvent) => {
				event.stopPropagation();
			};

			return input;
		}

		public addClass(element: HTMLElement, className: string): void {
			this.toggleClass(element, className, true);
		}

		public removeClass(element: HTMLElement, className: string): void {
			this.toggleClass(element, className, false);
		}

		public toggleClass(element: HTMLElement, className: string, doAdd: boolean): void {
			if (!/^[a-zA-Z0-9_-]+$/.test(className)) {
				throw new Error('Invalid class name: ' + className);
			}

			className = this.classesPrefix + className;
			let wasFound = false;

			const classes = element.className.split(/\s+/);
			for (let index = 0; index < classes.length; index++) {
				if (classes[index] === '') {
					classes.splice(index, 1);
				}

				if (classes[index] === className) {
					if (doAdd) {
						return;
					} else {
						classes.splice(index, 1);
						wasFound = true;
					}
				}
			}

			if (doAdd) {
				classes.push(className);
			} else if (!wasFound) {
				return;
			}

			element.className = classes.join(' ');
		}

	}

}
