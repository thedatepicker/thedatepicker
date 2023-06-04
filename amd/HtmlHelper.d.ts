import Options from './Options';
import { ClassNameType } from './ClassNames';
export interface Option {
    value: string;
    label: string;
}
export default class HtmlHelper_ {
    static createDiv_(type: ClassNameType, options: Options): HTMLDivElement;
    static createAnchor_(onClick: (event: Event) => void, options: Options, type?: ClassNameType): HTMLAnchorElement;
    static createSpan_(): HTMLSpanElement;
    static createTable_(header: HTMLTableSectionElement | null, body: HTMLTableSectionElement, type: ClassNameType, options: Options): HTMLTableElement;
    static createTableHeader_(cells: HTMLTableHeaderCellElement[], type: ClassNameType, options: Options): HTMLTableSectionElement;
    static createTableHeaderCell_(type: ClassNameType, options: Options): HTMLTableHeaderCellElement;
    static createTableBody_(rows: HTMLTableRowElement[], type: ClassNameType, options: Options): HTMLTableSectionElement;
    static createTableRow_(cells: HTMLTableCellElement[], options: Options): HTMLTableRowElement;
    static createTableCell_(): HTMLTableCellElement;
    static createSelectInput_(selectOptions: Option[], onChange: (event: Event, value: string) => void, options: Options): HTMLSelectElement;
    static createSelectOption_(value: string, label: string): HTMLOptionElement;
    static addClass_(element: HTMLElement, type: ClassNameType, options: Options): void;
    static appendChild_(element: HTMLElement, child: HTMLElement | null): void;
}
