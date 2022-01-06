namespace TheDatepicker {

	export interface Option {
		value: string;
		label: string;
	}

	export class HtmlHelper_ {

		public static createDiv_(className: string, options: Options): HTMLDivElement {
			const div = document.createElement('div');
			this.addClass_(div, className, options);

			return div;
		}

		public static createAnchor_(onClick: (event: Event) => void, options: Options): HTMLAnchorElement {
			const anchor = document.createElement('a');
			this.addClass_(anchor, 'button', options);
			anchor.href = '#';

			anchor.onclick = (event: MouseEvent): void => {
				event = event || window.event as MouseEvent;
				Helper_.preventDefault_(event);
				onClick(event);
			};

			anchor.onkeydown = (event: KeyboardEvent): void => {
				event = event || window.event as KeyboardEvent;
				if (Helper_.inArray_([KeyCode_.Enter, KeyCode_.Space], event.keyCode)) {
					Helper_.preventDefault_(event);
					onClick(event);
				}
			};

			return anchor;
		}

		public static createSpan_(): HTMLSpanElement {
			return document.createElement('span');
		}

		public static createTable_(className: string, header: HTMLTableSectionElement, body: HTMLTableSectionElement, options: Options): HTMLTableElement {
			const table = document.createElement('table');
			this.addClass_(table, className, options);
			table.appendChild(header);
			table.appendChild(body);

			return table;
		}

		public static createTableHeader_(className: string, cells: HTMLTableHeaderCellElement[], options: Options): HTMLTableSectionElement {
			const tableHeader = document.createElement('thead');
			this.addClass_(tableHeader, className, options);

			const row = document.createElement('tr');
			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}
			tableHeader.appendChild(row);

			return tableHeader;
		}

		public static createTableHeaderCell_(className: string, options: Options): HTMLTableHeaderCellElement {
			const cell = document.createElement('th');
			cell.scope = 'col';
			this.addClass_(cell, className, options);

			return cell;
		}

		public static createTableBody_(className: string, rows: HTMLTableRowElement[], options: Options): HTMLTableSectionElement {
			const tableBody = document.createElement('tbody');
			this.addClass_(tableBody, className, options);

			for (let index = 0; index < rows.length; index++) {
				tableBody.appendChild(rows[index]);
			}

			return tableBody;
		}

		public static createTableRow_(className: string, cells: HTMLTableCellElement[]): HTMLTableRowElement {
			const row = document.createElement('tr');

			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}

			return row;
		}

		public static createTableCell_(): HTMLTableCellElement {
			return document.createElement('td');
		}

		public static createSelectInput_(selectOptions: Option[], onChange: (event: Event, value: string) => void, options: Options): HTMLSelectElement {
			const input = document.createElement('select');
			this.addClass_(input, 'select', options);

			for (let index = 0; index < selectOptions.length; index++) {
				input.appendChild(this.createSelectOption_(selectOptions[index].value, selectOptions[index].label));
			}

			input.onchange = (event: Event): void => {
				onChange(event || window.event, input.value);
			};

			input.onkeydown = (event: KeyboardEvent): void => {
				event = event || window.event as KeyboardEvent;
				Helper_.stopPropagation_(event);
			};

			return input;
		}

		public static createSelectOption_(value: string, label: string): HTMLOptionElement {
			const option = document.createElement('option');
			option.value = value;
			option.innerText = label;

			return option;
		}

		public static addClass_(element: HTMLElement, className: string, options: Options): void {
			className = options.prefixClass_(className);
			if (element.className !== '') {
				className = ' ' + className;
			}
			element.className += className;
		}

		public static appendChild_(element: HTMLElement, child: HTMLElement | null): void {
			if (child) {
				element.appendChild(child);
			}
		}

	}

}
