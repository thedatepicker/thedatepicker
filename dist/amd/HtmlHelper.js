define(["require", "exports", "./ClassNames", "./Helper"], function (require, exports, ClassNames_1, Helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HtmlHelper_ {
        static createDiv_(type, options) {
            const div = document.createElement('div');
            HtmlHelper_.addClass_(div, type, options);
            return div;
        }
        static createAnchor_(onClick, options, type = ClassNames_1.ClassNameType.Button) {
            const anchor = document.createElement('a');
            HtmlHelper_.addClass_(anchor, type, options);
            anchor.href = '#';
            anchor.onclick = (event) => {
                event = event || window.event;
                Helper_1.default.preventDefault_(event);
                onClick(event);
            };
            anchor.onkeydown = (event) => {
                event = event || window.event;
                if (Helper_1.default.inArray_([Helper_1.KeyCode_.Enter, Helper_1.KeyCode_.Space], event.keyCode)) {
                    Helper_1.default.preventDefault_(event);
                    onClick(event);
                }
            };
            return anchor;
        }
        static createSpan_() {
            return document.createElement('span');
        }
        static createTable_(header, body, type, options) {
            const table = document.createElement('table');
            HtmlHelper_.addClass_(table, type, options);
            if (header) {
                table.appendChild(header);
            }
            table.appendChild(body);
            return table;
        }
        static createTableHeader_(cells, type, options) {
            const tableHeader = document.createElement('thead');
            HtmlHelper_.addClass_(tableHeader, type, options);
            const row = document.createElement('tr');
            for (let index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            tableHeader.appendChild(row);
            return tableHeader;
        }
        static createTableHeaderCell_(type, options) {
            const cell = document.createElement('th');
            cell.scope = 'col';
            HtmlHelper_.addClass_(cell, type, options);
            return cell;
        }
        static createTableBody_(rows, type, options) {
            const tableBody = document.createElement('tbody');
            HtmlHelper_.addClass_(tableBody, type, options);
            for (let index = 0; index < rows.length; index++) {
                tableBody.appendChild(rows[index]);
            }
            return tableBody;
        }
        static createTableRow_(cells, options) {
            const row = document.createElement('tr');
            HtmlHelper_.addClass_(row, ClassNames_1.ClassNameType.TableRow, options);
            for (let index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            return row;
        }
        static createTableCell_() {
            return document.createElement('td');
        }
        static createSelectInput_(selectOptions, onChange, options) {
            const input = document.createElement('select');
            HtmlHelper_.addClass_(input, ClassNames_1.ClassNameType.SelectInput, options);
            for (let index = 0; index < selectOptions.length; index++) {
                input.appendChild(HtmlHelper_.createSelectOption_(selectOptions[index].value, selectOptions[index].label));
            }
            input.onchange = (event) => {
                onChange(event || window.event, input.value);
            };
            input.onkeydown = (event) => {
                event = event || window.event;
                Helper_1.default.stopPropagation_(event);
            };
            return input;
        }
        static createSelectOption_(value, label) {
            const option = document.createElement('option');
            option.value = value;
            option.innerText = label;
            return option;
        }
        static addClass_(element, type, options) {
            const classNames = options.classNames.getClassName(type);
            if (!classNames.length) {
                return;
            }
            for (let index = 0; index < classNames.length; index++) {
                classNames[index] = options.prefixClass_(classNames[index]);
            }
            element.className += (element.className ? ' ' : '') + classNames.join(' ');
        }
        static appendChild_(element, child) {
            if (child) {
                element.appendChild(child);
            }
        }
    }
    exports.default = HtmlHelper_;
});
