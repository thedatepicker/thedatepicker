namespace TheDatepicker {

	export interface Option {
		value: string;
		label: string;
	}

	export class HtmlHelper_ {

		public static createDiv_(type: ClassNameType, options: Options): HTMLDivElement {
			const div = document.createElement('div');
			HtmlHelper_.addClass_(div, type, options);

			return div;
		}

		public static createAnchor_(onClick: (event: Event) => void, options: Options, type: ClassNameType = ClassNameType.Button): HTMLAnchorElement {
			const anchor = document.createElement('a');
			HtmlHelper_.addClass_(anchor, type, options);
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

		public static createTable_(header: HTMLTableSectionElement | null, body: HTMLTableSectionElement, type: ClassNameType, options: Options): HTMLTableElement {
			const table = document.createElement('table');
			HtmlHelper_.addClass_(table, type, options);
			if (header) {
				table.appendChild(header);
			}
			table.appendChild(body);

			return table;
		}

		public static createTableHeader_(cells: HTMLTableHeaderCellElement[], type: ClassNameType, options: Options): HTMLTableSectionElement {
			const tableHeader = document.createElement('thead');
			HtmlHelper_.addClass_(tableHeader, type, options);

			const row = document.createElement('tr');
			for (let index = 0; index < cells.length; index++) {
				row.appendChild(cells[index]);
			}
			tableHeader.appendChild(row);

			return tableHeader;
		}

		public static createTableHeaderCell_(type: ClassNameType, options: Options): HTMLTableHeaderCellElement {
			const cell = document.createElement('th');
			cell.scope = 'col';
			HtmlHelper_.addClass_(cell, type, options);

			return cell;
		}

		public static createTableBody_(rows: HTMLTableRowElement[], type: ClassNameType, options: Options): HTMLTableSectionElement {
			const tableBody = document.createElement('tbody');
			HtmlHelper_.addClass_(tableBody, type, options);

			for (let index = 0; index < rows.length; index++) {
				tableBody.appendChild(rows[index]);
			}

			return tableBody;
		}

		public static createTableRow_(cells: HTMLTableCellElement[], options: Options): HTMLTableRowElement {
			const row = document.createElement('tr');
			HtmlHelper_.addClass_(row, ClassNameType.TableRow, options)

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
			HtmlHelper_.addClass_(input, ClassNameType.SelectInput, options);

			for (let index = 0; index < selectOptions.length; index++) {
				input.appendChild(HtmlHelper_.createSelectOption_(selectOptions[index].value, selectOptions[index].label));
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

		public static addClass_(element: HTMLElement, type: ClassNameType, options: Options): void {
			const classNames = options.classNames.getClassName(type);
			if (!classNames.length) {
				return;
			}
			for (let index = 0; index < classNames.length; index++) {
				classNames[index] = options.prefixClass_(classNames[index]);
			}
			element.className += (element.className ? ' ' : '') + classNames.join(' ');
		}

		public static appendChild_(element: HTMLElement, child: HTMLElement | null): void {
			if (child) {
				element.appendChild(child);
			}
		}

	}

}
