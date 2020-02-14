namespace TheDatepicker {

	export interface Option {
		value: string;
		label: string;
	}

	export class HtmlHelper_ {

		private readonly document_: Document;

		public constructor(private readonly options_: Options) {
			this.document_ = document;
		}

		public createDiv_(className: string): HTMLDivElement {
			const div = this.document_.createElement('div');
			this.addClass_(div, className);

			return div;
		}

		public createAnchor_(onClick: (event: Event) => void): HTMLAnchorElement {
			const anchor = this.document_.createElement('a');
			this.addClass_(anchor, 'button');
			anchor.href = '#';

			anchor.onclick = (event: MouseEvent) => {
				event = event || window.event as MouseEvent;
				Helper_.preventDefault_(event);
				onClick(event);
			};

			anchor.onkeydown = (event: KeyboardEvent) => {
				event = event || window.event as KeyboardEvent;
				if (Helper_.inArray_([KeyCode_.Enter, KeyCode_.Space], event.keyCode)) {
					Helper_.preventDefault_(event);
					onClick(event);
				}
			};

			return anchor;
		}

		public createSpan_(): HTMLSpanElement {
			return this.document_.createElement('span');
		}

		public createTable_(className: string, header: HTMLTableSectionElement, body: HTMLTableSectionElement): HTMLTableElement {
			const table = this.document_.createElement('table');
			this.addClass_(table, className);
			table.appendChild(header);
			table.appendChild(body);

			return table;
		}

		public createTableHeader_(className: string, cells: HTMLTableHeaderCellElement[]): HTMLTableSectionElement {
			const tableHeader = this.document_.createElement('thead');
			this.addClass_(tableHeader, className);

			const row = this.document_.createElement('tr');
			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}
			tableHeader.appendChild(row);

			return tableHeader;
		}

		public createTableHeaderCell_(className: string): HTMLTableHeaderCellElement {
			const cell = this.document_.createElement('th');
			cell.scope = 'col';
			this.addClass_(cell, className);

			return cell;
		}

		public createTableBody_(className: string, rows: HTMLTableRowElement[]): HTMLTableSectionElement {
			const tableBody = this.document_.createElement('tbody');
			this.addClass_(tableBody, className);

			for (let index = 0; index < rows.length; index++) {
				tableBody.appendChild(rows[index]);
			}

			return tableBody;
		}

		public createTableRow_(className: string, cells: HTMLTableCellElement[]): HTMLTableRowElement {
			const row = this.document_.createElement('tr');

			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}

			return row;
		}

		public createTableCell_(): HTMLTableCellElement {
			return this.document_.createElement('td');
		}

		public createSelectInput_(options: Option[], onChange: (event: Event, value: string) => void): HTMLSelectElement {
			const input = this.document_.createElement('select');
			this.addClass_(input, 'select');

			for (let index = 0; index < options.length; index++) {
				input.appendChild(this.createSelectOption_(options[index].value, options[index].label));
			}

			input.onchange = (event: Event) => {
				onChange(event || window.event, input.value);
			};

			input.onkeydown = (event: KeyboardEvent) => {
				event = event || window.event as KeyboardEvent;
				Helper_.stopPropagation_(event);
			};

			return input;
		}

		public createSelectOption_(value: string, label: string): HTMLOptionElement {
			const option = this.document_.createElement('option');
			option.value = value;
			option.innerText = label;

			return option;
		}

		public addClass_(element: HTMLElement, className: string): void {
			className = this.options_.prefixClass_(className);
			if (element.className !== '') {
				className = ' ' + className;
			}
			element.className += className;
		}

		public appendChild_(element: HTMLElement, child: HTMLElement | null): void {
			if (child) {
				element.appendChild(child);
			}
		}

	}

}
