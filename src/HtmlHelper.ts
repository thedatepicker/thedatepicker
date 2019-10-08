namespace TheDatepicker {

	export interface SelectOption {
		value: string;
		label: string;
	}

	export class HtmlHelper {

		private readonly document: Document;

		public constructor(private readonly options: Options) {
			this.document = document;
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
				event = event || window.event as MouseEvent;
				Helper.preventDefault(event);
				onClick(event);
			};

			anchor.onkeydown = (event: KeyboardEvent) => {
				event = event || window.event as KeyboardEvent;
				if (Helper.inArray([KeyCode.Enter, KeyCode.Space], event.keyCode)) {
					Helper.preventDefault(event);
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
			cell.scope = 'col';
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

		public createTableCell(): HTMLTableCellElement {
			return this.document.createElement('td');
		}

		public createSelectInput(options: SelectOption[], onChange: (event: Event, value: string) => void): HTMLSelectElement {
			const input = this.document.createElement('select');
			this.addClass(input, 'select');

			for (let index = 0; index < options.length; index++) {
				input.appendChild(this.createSelectOption(options[index].value, options[index].label));
			}

			input.onchange = (event: Event) => {
				onChange(event || window.event, input.value);
			};

			input.onkeydown = (event: KeyboardEvent) => {
				event = event || window.event as KeyboardEvent;
				Helper.stopPropagation(event);
			};

			return input;
		}

		public createSelectOption(value: string, label: string): HTMLOptionElement {
			const option = this.document.createElement('option');
			option.value = value;
			option.innerText = label;

			return option;
		}

		public addClass(element: HTMLElement, className: string): void {
			className = this.options.getClassesPrefix() + className;
			if (element.className !== '') {
				className = ' ' + className;
			}
			element.className += className;
		}

	}

}
