define("Day", ["require", "exports", "Helper"], function (require, exports, Helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Day {
        constructor(date, createDay, formatDate) {
            this.isToday = false;
            this.isPast = false;
            this.isAvailable = true;
            this.isInValidity = true;
            this.isVisible = false;
            this.isInCurrentMonth = false;
            this.isSelected = false;
            this.isHighlighted = false;
            this.isFocused = false;
            this.dayNumber = date.getDate();
            this.month = date.getMonth() + 1;
            this.year = date.getFullYear();
            this.dayOfWeek = date.getDay();
            this.isWeekend = this.dayOfWeek === Helper_1.DayOfWeek.Saturday || this.dayOfWeek === Helper_1.DayOfWeek.Sunday;
            this.createDay_ = createDay;
            this.formatDate_ = formatDate;
        }
        getDate() {
            return new Date(this.year, this.month - 1, this.dayNumber, 0, 0, 0, 0);
        }
        getFormatted() {
            return this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.dayNumber).slice(-2);
        }
        getInputFormatted() {
            return this.formatDate_(this.getDate());
        }
        isEqualToDate(date) {
            return Helper_1.default.isValidDate_(date)
                && this.dayNumber === date.getDate()
                && this.month === date.getMonth() + 1
                && this.year === date.getFullYear();
        }
        isEqualToDay(day) {
            return day instanceof Day
                && this.dayNumber === day.dayNumber
                && this.month === day.month
                && this.year === day.year;
        }
        getSibling(shift = 1) {
            const date = this.getDate();
            date.setDate(date.getDate() + Helper_1.default.checkNumber_('Shift', shift));
            return this.createDay_(date);
        }
    }
    exports.default = Day;
});
define("Translator", ["require", "exports", "Helper"], function (require, exports, Helper_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TitleName = void 0;
    var TitleName;
    (function (TitleName) {
        TitleName[TitleName["GoBack"] = 0] = "GoBack";
        TitleName[TitleName["GoForward"] = 1] = "GoForward";
        TitleName[TitleName["Close"] = 2] = "Close";
        TitleName[TitleName["Reset"] = 3] = "Reset";
        TitleName[TitleName["Deselect"] = 4] = "Deselect";
        TitleName[TitleName["Month"] = 5] = "Month";
        TitleName[TitleName["Year"] = 6] = "Year";
        TitleName[TitleName["GoBackTableOfYears"] = 7] = "GoBackTableOfYears";
        TitleName[TitleName["GoForwardTableOfYears"] = 8] = "GoForwardTableOfYears";
    })(TitleName = exports.TitleName || (exports.TitleName = {}));
    class Translator {
        constructor() {
            this.dayOfWeekFullTranslations_ = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ];
            this.dayOfWeekTranslations_ = [
                'Su',
                'Mo',
                'Tu',
                'We',
                'Th',
                'Fr',
                'Sa',
            ];
            this.monthTranslations_ = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            this.monthShortTranslations_ = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];
            this.titles_ = [
                'Go to previous month',
                'Go to next month',
                'Close calendar',
                'Reset calendar',
                'Deselect date',
                'Month selection',
                'Year selection',
                'Show earlier years',
                'Show later years',
            ];
        }
        clone() {
            const translator = new Translator();
            let index;
            for (index = 0; index < this.dayOfWeekFullTranslations_.length; index++) {
                translator.dayOfWeekFullTranslations_ = this.dayOfWeekFullTranslations_.slice(0);
            }
            for (index = 0; index < this.dayOfWeekTranslations_.length; index++) {
                translator.dayOfWeekTranslations_ = this.dayOfWeekTranslations_.slice(0);
            }
            for (index = 0; index < this.monthTranslations_.length; index++) {
                translator.monthTranslations_ = this.monthTranslations_.slice(0);
            }
            for (index = 0; index < this.monthShortTranslations_.length; index++) {
                translator.monthShortTranslations_ = this.monthShortTranslations_.slice(0);
            }
            for (index = 0; index < this.titles_.length; index++) {
                translator.titles_ = this.titles_.slice(0);
            }
            return translator;
        }
        setDayOfWeekTranslation(dayOfWeek, translation) {
            this.dayOfWeekTranslations_[Helper_2.default.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_2.default.checkString_('Translation', translation, true);
        }
        setDayOfWeekFullTranslation(dayOfWeek, translation) {
            this.dayOfWeekFullTranslations_[Helper_2.default.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_2.default.checkString_('Translation', translation, true);
        }
        setMonthTranslation(month, translation) {
            this.monthTranslations_[Helper_2.default.checkNumber_('Month', month, 0, 11)] = Helper_2.default.checkString_('Translation', translation, true);
        }
        setMonthShortTranslation(month, translation) {
            this.monthShortTranslations_[Helper_2.default.checkNumber_('Month', month, 0, 11)] = Helper_2.default.checkString_('Translation', translation, true);
        }
        setTitleTranslation(titleName, translation) {
            this.titles_[Helper_2.default.checkNumber_('Title', titleName, 0, this.titles_.length - 1)] = Helper_2.default.checkString_('Translation', translation);
        }
        translateDayOfWeek(dayOfWeek) {
            return this.dayOfWeekTranslations_[dayOfWeek];
        }
        translateDayOfWeekFull(dayOfWeek) {
            return this.dayOfWeekFullTranslations_[dayOfWeek];
        }
        translateMonth(month) {
            return this.monthTranslations_[month];
        }
        translateMonthShort(month) {
            return this.monthShortTranslations_[month];
        }
        translateTitle(titleName) {
            return this.titles_[titleName];
        }
    }
    exports.default = Translator;
});
define("HtmlHelper", ["require", "exports", "ClassNames", "Helper"], function (require, exports, ClassNames_1, Helper_3) {
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
                Helper_3.default.preventDefault_(event);
                onClick(event);
            };
            anchor.onkeydown = (event) => {
                event = event || window.event;
                if (Helper_3.default.inArray_([Helper_3.KeyCode_.Enter, Helper_3.KeyCode_.Space], event.keyCode)) {
                    Helper_3.default.preventDefault_(event);
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
                Helper_3.default.stopPropagation_(event);
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
define("Options", ["require", "exports", "ClassNames", "Translator", "Helper", "HtmlHelper"], function (require, exports, ClassNames_2, Translator_1, Helper_4, HtmlHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AvailableDateNotFoundException = exports.EventType_ = void 0;
    var EventType_;
    (function (EventType_) {
        EventType_["BeforeSelect"] = "beforeSelect";
        EventType_["Select"] = "select";
        EventType_["BeforeOpen"] = "beforeOpen";
        EventType_["Open"] = "open";
        EventType_["BeforeClose"] = "beforeClose";
        EventType_["Close"] = "close";
        EventType_["BeforeMonthChange"] = "beforeMonthChange";
        EventType_["MonthChange"] = "monthChange";
        EventType_["Focus"] = "focus";
        EventType_["BeforeFocus"] = "beforeFocus";
    })(EventType_ = exports.EventType_ || (exports.EventType_ = {}));
    class AvailableDateNotFoundException {
    }
    exports.AvailableDateNotFoundException = AvailableDateNotFoundException;
    class Options {
        constructor(translator = null, classNames = null) {
            this.hideOnBlur_ = true;
            this.hideOnSelect_ = true;
            this.minDate_ = null;
            this.maxDate_ = null;
            this.initialDate_ = null;
            this.initialMonth_ = null;
            this.initialDatePriority_ = true;
            this.firstDayOfWeek_ = Helper_4.DayOfWeek.Monday;
            this.dateAvailabilityResolvers_ = [];
            this.cellContentResolver_ = null;
            this.cellContentStructureResolver_ = null;
            this.headerStructureResolver_ = null;
            this.footerStructureResolver_ = null;
            this.cellClassesResolvers_ = [];
            this.dayModifiers_ = [];
            this.inputFormat_ = 'j. n. Y';
            this.allowInputAnyChar_ = false;
            this.daysOutOfMonthVisible_ = false;
            this.fixedRowsCount_ = false;
            this.toggleSelection_ = false;
            this.allowEmpty_ = true;
            this.showDeselectButton_ = true;
            this.showResetButton_ = false;
            this.monthAsDropdown_ = true;
            this.yearAsDropdown_ = true;
            this.yearSelectedFromTableOfYears_ = true;
            this.tableOfYearsRowsCount_ = 6;
            this.tableOfYearsAlign_ = null;
            this.tableOfYearsOnSwipeDown_ = true;
            this.yearsOutOfTableOfYearsVisible_ = true;
            this.monthAndYearSeparated_ = true;
            this.monthShort_ = false;
            this.changeMonthOnSwipe_ = true;
            this.slideAnimation_ = true;
            this.classesPrefix_ = 'the-datepicker__';
            this.darkMode_ = false;
            this.showCloseButton_ = true;
            this.closeOnEscPress_ = true;
            this.title_ = '';
            this.dropdownItemsLimit_ = 200;
            this.hideDropdownWithOneItem_ = true;
            this.goBackHtml_ = '&lt;';
            this.goForwardHtml_ = '&gt;';
            this.closeHtml_ = '&times;';
            this.resetHtml_ = '&olarr;';
            this.deselectHtml_ = '&times;';
            this.positionFixing_ = true;
            this.fullScreenOnMobile_ = true;
            this.keyboardOnMobile_ = false;
            this.includeAria_ = true;
            this.today_ = null;
            this.listeners_ = {
                beforeSelect: [],
                select: [],
                beforeOpen: [],
                open: [],
                beforeClose: [],
                close: [],
                beforeMonthChange: [],
                monthChange: [],
                beforeFocus: [],
                focus: [],
            };
            this.translator = translator || new Translator_1.default();
            this.classNames = classNames || new ClassNames_2.default();
        }
        clone() {
            const options = new Options(this.translator.clone(), this.classNames.clone());
            options.hideOnBlur_ = this.hideOnBlur_;
            options.hideOnSelect_ = this.hideOnSelect_;
            options.minDate_ = this.minDate_;
            options.maxDate_ = this.maxDate_;
            options.initialDate_ = this.initialDate_;
            options.initialMonth_ = this.initialMonth_;
            options.initialDatePriority_ = this.initialDatePriority_;
            options.firstDayOfWeek_ = this.firstDayOfWeek_;
            options.dateAvailabilityResolvers_ = this.dateAvailabilityResolvers_.slice(0);
            options.cellContentResolver_ = this.cellContentResolver_;
            options.cellContentStructureResolver_ = this.cellContentStructureResolver_;
            options.headerStructureResolver_ = this.headerStructureResolver_;
            options.footerStructureResolver_ = this.footerStructureResolver_;
            options.cellClassesResolvers_ = this.cellClassesResolvers_.slice(0);
            options.dayModifiers_ = this.dayModifiers_.slice(0);
            options.inputFormat_ = this.inputFormat_;
            options.allowInputAnyChar_ = this.allowInputAnyChar_;
            options.daysOutOfMonthVisible_ = this.daysOutOfMonthVisible_;
            options.fixedRowsCount_ = this.fixedRowsCount_;
            options.toggleSelection_ = this.toggleSelection_;
            options.allowEmpty_ = this.allowEmpty_;
            options.showDeselectButton_ = this.showDeselectButton_;
            options.showResetButton_ = this.showResetButton_;
            options.monthAsDropdown_ = this.monthAsDropdown_;
            options.yearAsDropdown_ = this.yearAsDropdown_;
            options.yearSelectedFromTableOfYears_ = this.yearSelectedFromTableOfYears_;
            options.tableOfYearsRowsCount_ = this.tableOfYearsRowsCount_;
            options.tableOfYearsAlign_ = this.tableOfYearsAlign_;
            options.tableOfYearsOnSwipeDown_ = this.tableOfYearsOnSwipeDown_;
            options.monthAndYearSeparated_ = this.monthAndYearSeparated_;
            options.monthShort_ = this.monthShort_;
            options.changeMonthOnSwipe_ = this.changeMonthOnSwipe_;
            options.slideAnimation_ = this.slideAnimation_;
            options.classesPrefix_ = this.classesPrefix_;
            options.darkMode_ = this.darkMode_;
            options.showCloseButton_ = this.showCloseButton_;
            options.closeOnEscPress_ = this.closeOnEscPress_;
            options.title_ = this.title_;
            options.dropdownItemsLimit_ = this.dropdownItemsLimit_;
            options.hideDropdownWithOneItem_ = this.hideDropdownWithOneItem_;
            options.goBackHtml_ = this.goBackHtml_;
            options.goForwardHtml_ = this.goForwardHtml_;
            options.closeHtml_ = this.closeHtml_;
            options.resetHtml_ = this.resetHtml_;
            options.deselectHtml_ = this.deselectHtml_;
            options.positionFixing_ = this.positionFixing_;
            options.fullScreenOnMobile_ = this.fullScreenOnMobile_;
            options.keyboardOnMobile_ = this.keyboardOnMobile_;
            options.includeAria_ = this.includeAria_;
            options.listeners_.beforeSelect = this.listeners_.beforeSelect.slice(0);
            options.listeners_.select = this.listeners_.select.slice(0);
            options.listeners_.beforeOpen = this.listeners_.beforeOpen.slice(0);
            options.listeners_.open = this.listeners_.open.slice(0);
            options.listeners_.beforeClose = this.listeners_.beforeClose.slice(0);
            options.listeners_.close = this.listeners_.close.slice(0);
            options.listeners_.beforeMonthChange = this.listeners_.beforeMonthChange.slice(0);
            options.listeners_.monthChange = this.listeners_.monthChange.slice(0);
            options.listeners_.beforeFocus = this.listeners_.beforeFocus.slice(0);
            options.listeners_.focus = this.listeners_.focus.slice(0);
            return options;
        }
        setHideOnBlur(value) {
            this.hideOnBlur_ = !!value;
        }
        setHideOnSelect(value) {
            this.hideOnSelect_ = !!value;
        }
        setMinDate(date) {
            const normalizedDate = Helper_4.default.normalizeDate_('Min date', date, true, this);
            this.checkConstraints_(normalizedDate, this.maxDate_);
            this.minDate_ = normalizedDate;
        }
        setMaxDate(date) {
            const normalizedDate = Helper_4.default.normalizeDate_('Max date', date, true, this);
            this.checkConstraints_(this.minDate_, normalizedDate);
            this.maxDate_ = normalizedDate;
        }
        setInitialMonth(month) {
            this.initialMonth_ = Helper_4.default.normalizeDate_('Initial month', month, true, this);
        }
        setInitialDate(value) {
            this.initialDate_ = Helper_4.default.normalizeDate_('Initial date', value, true, this);
        }
        setInitialDatePriority(value) {
            this.initialDatePriority_ = !!value;
        }
        setFirstDayOfWeek(dayOfWeek) {
            this.firstDayOfWeek_ = Helper_4.default.checkNumber_('First day of week', dayOfWeek, 0, 6);
        }
        setDateAvailabilityResolver(resolver) {
            Helper_4.default.warnDeprecatedUsage_('setDateAvailabilityResolver', ['addDateAvailabilityResolver']);
            this.removeDateAvailabilityResolver();
            if (resolver) {
                this.addDateAvailabilityResolver(resolver);
            }
        }
        addDateAvailabilityResolver(resolver) {
            this.dateAvailabilityResolvers_.push(Helper_4.default.checkFunction_('Resolver', resolver, false));
        }
        removeDateAvailabilityResolver(resolver = null) {
            this.removeCallback_(this.dateAvailabilityResolvers_, 'Resolver', resolver);
        }
        setCellContentResolver(resolver) {
            this.cellContentResolver_ = Helper_4.default.checkFunction_('Resolver', resolver);
        }
        setCellContentStructureResolver(init, update = null) {
            init = Helper_4.default.checkFunction_('Resolver (init)', init);
            update = Helper_4.default.checkFunction_('Resolver (update)', update);
            this.cellContentStructureResolver_ = init ? {
                init,
                update,
            } : null;
        }
        setHeaderStructureResolver(resolver) {
            this.headerStructureResolver_ = Helper_4.default.checkFunction_('Resolver', resolver);
        }
        setFooterStructureResolver(resolver) {
            this.footerStructureResolver_ = Helper_4.default.checkFunction_('Resolver', resolver);
        }
        addCellClassesResolver(resolver) {
            this.cellClassesResolvers_.push(Helper_4.default.checkFunction_('Resolver', resolver, false));
        }
        removeCellClassesResolver(resolver = null) {
            this.removeCallback_(this.cellClassesResolvers_, 'Resolver', resolver);
        }
        addDayModifier(modifier) {
            this.dayModifiers_.push(Helper_4.default.checkFunction_('Modifier', modifier, false));
        }
        removeDayModifier(modifier = null) {
            this.removeCallback_(this.dayModifiers_, 'Modifier', modifier);
        }
        setInputFormat(format) {
            this.inputFormat_ = Helper_4.default.checkString_('Input format', format, true);
        }
        setAllowInputAnyChar(value) {
            this.allowInputAnyChar_ = !!value;
        }
        setDaysOutOfMonthVisible(value) {
            this.daysOutOfMonthVisible_ = !!value;
        }
        setFixedRowsCount(value) {
            this.fixedRowsCount_ = !!value;
        }
        setToggleSelection(value) {
            this.toggleSelection_ = !!value;
        }
        setShowDeselectButton(value) {
            this.showDeselectButton_ = !!value;
        }
        setAllowEmpty(value) {
            this.allowEmpty_ = !!value;
        }
        setShowResetButton(value) {
            this.showResetButton_ = !!value;
        }
        setMonthAsDropdown(value) {
            this.monthAsDropdown_ = !!value;
        }
        setYearAsDropdown(value) {
            this.yearAsDropdown_ = !!value;
        }
        setYearSelectedFromTableOfYears(value) {
            this.yearSelectedFromTableOfYears_ = !!value;
        }
        setTableOfYearsRowsCount(count) {
            this.tableOfYearsRowsCount_ = Helper_4.default.checkNumber_('Rows count', count, 1);
        }
        setTableOfYearsAlign(align) {
            this.tableOfYearsAlign_ = align ? Helper_4.default.checkNumber_('Align', align, 1, 3) : null;
        }
        setTableOfYearsOnSwipeDown(value) {
            this.tableOfYearsOnSwipeDown_ = !!value;
        }
        setYearsOutOfTableOfYearsVisible(value) {
            this.yearsOutOfTableOfYearsVisible_ = !!value;
        }
        setMonthAndYearSeparated(value) {
            this.monthAndYearSeparated_ = !!value;
        }
        setMonthShort(value) {
            this.monthShort_ = !!value;
        }
        setChangeMonthOnSwipe(value) {
            this.changeMonthOnSwipe_ = !!value;
        }
        setAnimateMonthChange(value) {
            Helper_4.default.warnDeprecatedUsage_('setAnimateMonthChange', ['setSlideAnimation']);
            this.setSlideAnimation(value);
        }
        setSlideAnimation(value) {
            this.slideAnimation_ = !!value;
        }
        setClassesPrefix(prefix) {
            this.classesPrefix_ = Helper_4.default.checkString_('Prefix', prefix);
        }
        setDarkMode(value) {
            this.darkMode_ = !!value;
        }
        setShowCloseButton(value) {
            this.showCloseButton_ = !!value;
        }
        setCloseOnEscPress(value) {
            this.closeOnEscPress_ = !!value;
        }
        setTitle(title) {
            this.title_ = Helper_4.default.checkString_('Title', title);
        }
        setDropdownItemsLimit(limit) {
            this.dropdownItemsLimit_ = Helper_4.default.checkNumber_('Items limit', limit, 1);
        }
        setHideDropdownWithOneItem(value) {
            this.hideDropdownWithOneItem_ = !!value;
        }
        setGoBackHtml(html) {
            this.goBackHtml_ = Helper_4.default.checkString_('Html', html);
        }
        setGoForwardHtml(html) {
            this.goForwardHtml_ = Helper_4.default.checkString_('Html', html);
        }
        setCloseHtml(html) {
            this.closeHtml_ = Helper_4.default.checkString_('Html', html);
        }
        setResetHtml(html) {
            this.resetHtml_ = Helper_4.default.checkString_('Html', html);
        }
        setDeselectHtml(html) {
            this.deselectHtml_ = Helper_4.default.checkString_('Html', html);
        }
        setPositionFixing(value) {
            this.positionFixing_ = !!value;
        }
        setFullScreenOnMobile(value) {
            this.fullScreenOnMobile_ = !!value;
        }
        setKeyboardOnMobile(value) {
            this.keyboardOnMobile_ = !!value;
        }
        setIncludeAria(value) {
            this.includeAria_ = !!value;
        }
        setToday(date) {
            this.today_ = Helper_4.default.normalizeDate_('Today', date, true, this);
        }
        onBeforeSelect(listener) {
            this.onEvent_(EventType_.BeforeSelect, listener);
        }
        offBeforeSelect(listener = null) {
            this.offEvent_(EventType_.BeforeSelect, listener);
        }
        onSelect(listener) {
            this.onEvent_(EventType_.Select, listener);
        }
        offSelect(listener = null) {
            this.offEvent_(EventType_.Select, listener);
        }
        onBeforeOpen(listener) {
            this.onEvent_(EventType_.BeforeOpen, listener);
        }
        offBeforeOpen(listener = null) {
            this.offEvent_(EventType_.BeforeOpen, listener);
        }
        onOpen(listener) {
            this.onEvent_(EventType_.Open, listener);
        }
        offOpen(listener = null) {
            this.offEvent_(EventType_.Open, listener);
        }
        onBeforeClose(listener) {
            this.onEvent_(EventType_.BeforeClose, listener);
        }
        offBeforeClose(listener = null) {
            this.offEvent_(EventType_.BeforeClose, listener);
        }
        onClose(listener) {
            this.onEvent_(EventType_.Close, listener);
        }
        offClose(listener = null) {
            this.offEvent_(EventType_.Close, listener);
        }
        onBeforeOpenAndClose(listener) {
            Helper_4.default.warnDeprecatedUsage_('onBeforeOpenAndClose', ['onBeforeOpen', 'onBeforeClose']);
            this.onBeforeOpen(listener);
            this.onBeforeClose(listener);
        }
        offBeforeOpenAndClose(listener = null) {
            Helper_4.default.warnDeprecatedUsage_('offBeforeOpenAndClose', ['offBeforeOpen', 'offBeforeClose']);
            this.offBeforeOpen(listener);
            this.offBeforeClose(listener);
        }
        onOpenAndClose(listener) {
            Helper_4.default.warnDeprecatedUsage_('onOpenAndClose', ['onOpen', 'onClose']);
            this.onOpen(listener);
            this.onClose(listener);
        }
        offOpenAndClose(listener = null) {
            Helper_4.default.warnDeprecatedUsage_('offOpenAndClose', ['offOpen', 'offClose']);
            this.offOpen(listener);
            this.offClose(listener);
        }
        onBeforeMonthChange(listener) {
            this.onEvent_(EventType_.BeforeMonthChange, listener);
        }
        offBeforeMonthChange(listener = null) {
            this.offEvent_(EventType_.BeforeMonthChange, listener);
        }
        onMonthChange(listener) {
            this.onEvent_(EventType_.MonthChange, listener);
        }
        offMonthChange(listener = null) {
            this.offEvent_(EventType_.MonthChange, listener);
        }
        onBeforeFocus(listener) {
            this.onEvent_(EventType_.BeforeFocus, listener);
        }
        offBeforeFocus(listener = null) {
            this.offEvent_(EventType_.BeforeFocus, listener);
        }
        onFocus(listener) {
            this.onEvent_(EventType_.Focus, listener);
        }
        offFocus(listener = null) {
            this.offEvent_(EventType_.Focus, listener);
        }
        getInitialMonth() {
            const primarySource = this.initialDatePriority_ ? this.initialDate_ : this.initialMonth_;
            const secondarySource = this.initialDatePriority_ ? this.initialMonth_ : this.initialDate_;
            const initialMonth = primarySource
                ? new Date(primarySource.getTime())
                : (secondarySource
                    ? new Date(secondarySource.getTime())
                    : this.getToday());
            initialMonth.setDate(1);
            return this.correctMonth(initialMonth);
        }
        isMonthInValidity(month) {
            return !this.calculateMonthCorrection_(month);
        }
        correctMonth(month) {
            const correctMonth = this.calculateMonthCorrection_(month);
            return correctMonth || month;
        }
        getInitialDate() {
            return this.findPossibleAvailableDate(this.initialDate_);
        }
        findPossibleAvailableDate(date) {
            if (this.isAllowedEmpty()) {
                return date && this.isDateInValidity(date) && this.isDateAvailable(date)
                    ? new Date(date.getTime())
                    : null;
            }
            date = date ? new Date(date.getTime()) : this.getToday();
            date = this.findNearestAvailableDate(date);
            if (date) {
                return date;
            }
            throw new AvailableDateNotFoundException();
        }
        findNearestAvailableDate(date) {
            date = this.correctDate_(date);
            if (this.isDateAvailable(date)) {
                return date;
            }
            const minDate = this.getMinDate_().getTime();
            const maxDate = this.getMaxDate_().getTime();
            let maxLoops = 1000;
            let increasedDate = date;
            let decreasedDate = new Date(date.getTime());
            do {
                if (increasedDate) {
                    increasedDate.setDate(increasedDate.getDate() + 1);
                    if (increasedDate.getTime() > maxDate) {
                        increasedDate = null;
                    }
                    else if (this.isDateAvailable(increasedDate)) {
                        return increasedDate;
                    }
                }
                if (decreasedDate) {
                    decreasedDate.setDate(decreasedDate.getDate() - 1);
                    if (decreasedDate.getTime() < minDate) {
                        decreasedDate = null;
                    }
                    else if (this.isDateAvailable(decreasedDate)) {
                        return decreasedDate;
                    }
                }
                maxLoops--;
            } while ((increasedDate || decreasedDate) && maxLoops > 0);
            return null;
        }
        isDateInValidity(date) {
            return !this.calculateDateCorrection_(date);
        }
        correctDate_(date) {
            const correctDate = this.calculateDateCorrection_(date);
            return correctDate || date;
        }
        getFirstDayOfWeek() {
            return this.firstDayOfWeek_;
        }
        areDaysOutOfMonthVisible() {
            return this.daysOutOfMonthVisible_;
        }
        hasFixedRowsCount() {
            return this.fixedRowsCount_;
        }
        hasToggleSelection() {
            return this.allowEmpty_ && this.toggleSelection_;
        }
        isAllowedEmpty() {
            return this.allowEmpty_;
        }
        isDeselectButtonShown() {
            return this.allowEmpty_ && this.showDeselectButton_;
        }
        isResetButtonShown() {
            return this.showResetButton_;
        }
        isMonthAsDropdown() {
            return this.monthAsDropdown_;
        }
        isYearAsDropdown() {
            return this.yearAsDropdown_;
        }
        isYearSelectedFromTableOfYears() {
            return this.yearAsDropdown_ && this.yearSelectedFromTableOfYears_;
        }
        getTableOfYearsRowsCount() {
            return this.tableOfYearsRowsCount_;
        }
        getTableOfYearsColumnsCount() {
            return 4;
        }
        getTableOfYearsAlign() {
            return this.tableOfYearsAlign_;
        }
        isTableOfYearsOnSwipeDownEnabled() {
            return this.tableOfYearsOnSwipeDown_;
        }
        areYearsOutOfTableOfYearsVisible() {
            return this.yearsOutOfTableOfYearsVisible_;
        }
        isMonthAndYearSeparated() {
            return this.isYearSelectedFromTableOfYears() || this.monthAndYearSeparated_;
        }
        isMonthShort() {
            return this.monthShort_;
        }
        isMonthChangeOnSwipeEnabled() {
            return this.changeMonthOnSwipe_;
        }
        isMonthChangeAnimated() {
            Helper_4.default.warnDeprecatedUsage_('isMonthChangeAnimated', ['isSlideAnimationEnabled']);
            return this.isSlideAnimationEnabled();
        }
        isSlideAnimationEnabled() {
            return this.slideAnimation_;
        }
        getClassesPrefix() {
            return this.classesPrefix_;
        }
        isDarkModeEnabled() {
            return this.darkMode_;
        }
        isCloseButtonShown() {
            return this.hideOnBlur_ && this.showCloseButton_;
        }
        isClosedOnEscPress() {
            return this.hideOnBlur_ && this.closeOnEscPress_;
        }
        getTitle() {
            return this.title_;
        }
        getMinDate() {
            return this.minDate_ ? new Date(this.minDate_.getTime()) : null;
        }
        getMaxDate() {
            return this.maxDate_ ? new Date(this.maxDate_.getTime()) : null;
        }
        getMinDate_() {
            const minDate = this.getMinDate();
            if (!minDate) {
                return new Date(-271821, 4, 1);
            }
            return minDate;
        }
        getMaxDate_() {
            const maxDate = this.getMaxDate();
            if (!maxDate) {
                return new Date(275760, 7, 31);
            }
            return maxDate;
        }
        getMinMonth() {
            if (!this.minDate_) {
                return null;
            }
            const minMonth = new Date(this.minDate_.getTime());
            minMonth.setDate(1);
            return minMonth;
        }
        getMaxMonth() {
            if (!this.maxDate_) {
                return null;
            }
            const maxMonth = new Date(this.maxDate_.getTime());
            maxMonth.setDate(1);
            return maxMonth;
        }
        getMinMonth_() {
            let minMonth = this.getMinMonth();
            if (!minMonth) {
                minMonth = this.getMinDate_();
            }
            return minMonth;
        }
        getMaxMonth_() {
            let maxMonth = this.getMaxMonth();
            if (!maxMonth) {
                maxMonth = this.getMaxDate_();
                maxMonth.setDate(1);
            }
            return maxMonth;
        }
        isDropdownWithOneItemHidden() {
            return this.hideDropdownWithOneItem_;
        }
        getDropdownItemsLimit() {
            return this.dropdownItemsLimit_;
        }
        isDateAvailable(date) {
            const dateAvailabilityResolvers = this.dateAvailabilityResolvers_.slice(0);
            for (let index = 0; index < dateAvailabilityResolvers.length; index++) {
                if (!dateAvailabilityResolvers[index](new Date(date.getTime()))) {
                    return false;
                }
            }
            return true;
        }
        getCellContent(day) {
            if (this.cellContentResolver_) {
                return this.cellContentResolver_(day);
            }
            return day.dayNumber + '';
        }
        prefixClass_(name) {
            return this.classesPrefix_ + name;
        }
        getCellStructure_() {
            if (this.cellContentStructureResolver_) {
                return this.cellContentStructureResolver_.init();
            }
            return HtmlHelper_1.default.createSpan_();
        }
        updateCellStructure_(element, day) {
            if (this.cellContentStructureResolver_) {
                this.cellContentStructureResolver_.update(element, day);
            }
            else {
                element.innerText = this.getCellContent(day);
            }
        }
        getHeaderStructure_() {
            return this.headerStructureResolver_ ? this.headerStructureResolver_() : null;
        }
        getFooterStructure_() {
            return this.footerStructureResolver_ ? this.footerStructureResolver_() : null;
        }
        getCellClasses(day) {
            let result = [];
            const cellClassesResolvers = this.cellClassesResolvers_.slice(0);
            for (let index = 0; index < cellClassesResolvers.length; index++) {
                const classes = cellClassesResolvers[index](day);
                if (typeof classes === 'string') {
                    result.push(classes);
                }
                else if (typeof classes === 'object' && classes.constructor === Array) {
                    result = result.concat(classes);
                }
            }
            return result;
        }
        modifyDay(day) {
            const dayModifiers = this.dayModifiers_.slice(0);
            for (let index = 0; index < dayModifiers.length; index++) {
                dayModifiers[index](day);
            }
        }
        getGoBackHtml() {
            return this.goBackHtml_;
        }
        getGoForwardHtml() {
            return this.goForwardHtml_;
        }
        getCloseHtml() {
            return this.closeHtml_;
        }
        getResetHtml() {
            return this.resetHtml_;
        }
        getDeselectHtml() {
            return this.deselectHtml_;
        }
        isHiddenOnBlur() {
            return this.hideOnBlur_;
        }
        isHiddenOnSelect() {
            return this.hideOnBlur_ && this.hideOnSelect_;
        }
        getInputFormat() {
            return this.inputFormat_;
        }
        isAllowedInputAnyChar() {
            return this.allowInputAnyChar_;
        }
        isPositionFixingEnabled() {
            return this.hideOnBlur_ && this.positionFixing_;
        }
        isFullScreenOnMobile() {
            return this.hideOnBlur_ && this.fullScreenOnMobile_;
        }
        isKeyboardOnMobile() {
            return this.keyboardOnMobile_;
        }
        isAriaIncluded() {
            return this.includeAria_;
        }
        getToday() {
            return this.today_ ? new Date(this.today_.getTime()) : Helper_4.default.resetTime_(new Date());
        }
        getDateAvailabilityResolver() {
            Helper_4.default.warnDeprecatedUsage_('getDateAvailabilityResolver', ['getDateAvailabilityResolvers']);
            return this.dateAvailabilityResolvers_.length > 0 ? this.dateAvailabilityResolvers_[0] : null;
        }
        getDateAvailabilityResolvers() {
            return this.dateAvailabilityResolvers_.slice(0);
        }
        getCellContentResolver() {
            return this.cellContentResolver_;
        }
        getCellContentStructureResolver() {
            return this.cellContentStructureResolver_;
        }
        getHeaderStructureResolver() {
            return this.headerStructureResolver_;
        }
        getFooterStructureResolver() {
            return this.footerStructureResolver_;
        }
        getCellClassesResolvers() {
            return this.cellClassesResolvers_.slice(0);
        }
        getDayModifiers() {
            return this.dayModifiers_.slice(0);
        }
        getBeforeSelectListeners() {
            return this.listeners_.beforeSelect.slice(0);
        }
        getSelectListeners() {
            return this.listeners_.select.slice(0);
        }
        getBeforeOpenListeners() {
            return this.listeners_.beforeOpen.slice(0);
        }
        getOpenListeners() {
            return this.listeners_.open.slice(0);
        }
        getBeforeCloseListeners() {
            return this.listeners_.beforeClose.slice(0);
        }
        getCloseListeners() {
            return this.listeners_.close.slice(0);
        }
        getBeforeOpenAndCloseListeners() {
            Helper_4.default.warnDeprecatedUsage_('getBeforeOpenAndCloseListeners', ['getBeforeOpenListeners', 'getBeforeCloseListeners']);
            return this.listeners_.beforeOpen.concat(this.listeners_.beforeClose);
        }
        getOpenAndCloseListeners() {
            Helper_4.default.warnDeprecatedUsage_('getOpenAndCloseListeners', ['getOpenListeners', 'getCloseListeners']);
            return this.listeners_.open.concat(this.listeners_.close);
        }
        getBeforeMonthChangeListeners() {
            return this.listeners_.beforeMonthChange.slice(0);
        }
        getMonthChangeListeners() {
            return this.listeners_.monthChange.slice(0);
        }
        getBeforeFocusListeners() {
            return this.listeners_.beforeFocus.slice(0);
        }
        getFocusListeners() {
            return this.listeners_.focus.slice(0);
        }
        checkConstraints_(minDate, maxDate) {
            if (minDate && maxDate && minDate.getTime() > maxDate.getTime()) {
                throw new Error('Min date cannot be higher then max date.');
            }
        }
        calculateMonthCorrection_(month) {
            const minMonth = this.getMinMonth_();
            if (month.getTime() < minMonth.getTime()) {
                return minMonth;
            }
            const maxMonth = this.getMaxMonth_();
            if (month.getTime() > maxMonth.getTime()) {
                return maxMonth;
            }
            return null;
        }
        calculateDateCorrection_(date) {
            const minDate = this.getMinDate_();
            if (date.getTime() < minDate.getTime()) {
                return minDate;
            }
            const maxDate = this.getMaxDate_();
            if (date.getTime() > maxDate.getTime()) {
                return maxDate;
            }
            return null;
        }
        removeCallback_(callbacksList, parameterName, callback) {
            callback = Helper_4.default.checkFunction_(parameterName, callback);
            if (!callback) {
                callbacksList.splice(0, callbacksList.length);
            }
            else {
                const callbacks = callbacksList.slice(0);
                for (let index = callbacks.length - 1; index >= 0; index--) {
                    if (callbacks[index] === callback) {
                        callbacksList.splice(index, 1);
                    }
                }
            }
        }
        onEvent_(eventType, listener) {
            this.listeners_[eventType].push(Helper_4.default.checkFunction_('Event listener', listener, false));
        }
        offEvent_(eventType, listener) {
            listener = Helper_4.default.checkFunction_('Event listener', listener);
            if (!listener) {
                this.listeners_[eventType] = [];
            }
            else {
                const newListeners = [];
                for (let index = 0; index < this.listeners_[eventType].length; index++) {
                    if (this.listeners_[eventType][index] !== listener) {
                        newListeners.push(this.listeners_[eventType][index]);
                    }
                }
                this.listeners_[eventType] = newListeners;
            }
        }
        triggerEvent_(eventType, caller) {
            const listeners = this.listeners_[eventType].slice(0);
            for (let index = 0; index < listeners.length; index++) {
                if (caller(listeners[index]) === false) {
                    return false;
                }
            }
            return true;
        }
    }
    exports.default = Options;
});
define("DateConverter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CannotParseDateException = void 0;
    class CannotParseDateException {
    }
    exports.CannotParseDateException = CannotParseDateException;
    class ParsedDateData {
        constructor() {
            this.day = null;
            this.month = null;
            this.year = null;
        }
        createDate() {
            if (this.day === null || this.month === null || this.year === null) {
                throw new CannotParseDateException();
            }
            let date = new Date(this.year, this.month - 1, this.day);
            if (isNaN(date.getTime())) {
                throw new CannotParseDateException();
            }
            while (date.getDate() !== this.day || date.getMonth() !== this.month - 1 || date.getFullYear() !== this.year) {
                if (this.day > 28) {
                    this.day--;
                    date = new Date(this.year, this.month - 1, this.day);
                }
                else {
                    throw new CannotParseDateException();
                }
            }
            return date;
        }
    }
    class DateConverter_ {
        static formatDate_(date, options) {
            if (!date) {
                return null;
            }
            const format = options.getInputFormat();
            let escapeNext = false;
            let result = '';
            for (let position = 0; position < format.length; position++) {
                const char = format.substring(position, position + 1);
                if (escapeNext) {
                    result += char;
                    escapeNext = false;
                    continue;
                }
                if (char === DateConverter_.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                const formatter = DateConverter_.getFormatter_(char);
                if (formatter) {
                    result += formatter.call(null, date, options);
                    continue;
                }
                result += char;
            }
            return result;
        }
        static parseDate_(text, options) {
            if (text === '') {
                return null;
            }
            const format = options.getInputFormat();
            const dateData = new ParsedDateData();
            let escapeNext = false;
            let textPosition = 0;
            for (let position = 0; position < format.length; position++) {
                const char = format.substring(position, position + 1);
                if (escapeNext) {
                    escapeNext = false;
                }
                else if (char === DateConverter_.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                else {
                    const parser = DateConverter_.getParser_(char);
                    if (parser) {
                        try {
                            textPosition += parser.call(null, text.substring(textPosition), dateData, options);
                        }
                        catch (error) {
                            if (!(error instanceof CannotParseDateException)) {
                                throw error;
                            }
                            const textChar = text.substring(textPosition, textPosition + 1);
                            if (textChar === ' ') {
                                textPosition++;
                                position--;
                                continue;
                            }
                            else {
                                throw error;
                            }
                        }
                        continue;
                    }
                }
                const textChar = text.substring(textPosition, textPosition + 1);
                if (textChar !== char) {
                    if (char === ' ') {
                        continue;
                    }
                    if (textChar === ' ') {
                        textPosition++;
                        position--;
                        continue;
                    }
                    throw new CannotParseDateException();
                }
                textPosition++;
            }
            return dateData.createDate();
        }
        static isValidChar_(textChar, options) {
            if (textChar === '' || /[0-9-]/.test(textChar)) {
                return true;
            }
            const format = options.getInputFormat();
            let escapeNext = false;
            for (let position = 0; position < format.length; position++) {
                const char = format.substring(position, position + 1);
                if (escapeNext) {
                    escapeNext = false;
                }
                else if (char === DateConverter_.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                else {
                    const phrases = DateConverter_.getValidPhrases_(char, options);
                    if (phrases) {
                        const textCharLower = textChar.toLowerCase();
                        for (let index = 0; index < phrases.length; index++) {
                            if (phrases[index].toLowerCase().indexOf(textCharLower) > -1) {
                                return true;
                            }
                        }
                        continue;
                    }
                }
                if (textChar === char) {
                    return true;
                }
            }
            return false;
        }
        static getFormatter_(type) {
            switch (type) {
                case 'j':
                    return DateConverter_.formatDay_;
                case 'd':
                    return DateConverter_.formatDayWithLeadingZero_;
                case 'D':
                    return DateConverter_.formatDayOfWeekTextual_;
                case 'l':
                    return DateConverter_.formatDayOfWeekTextualFull_;
                case 'n':
                    return DateConverter_.formatMonth_;
                case 'm':
                    return DateConverter_.formatMonthWithLeadingZero_;
                case 'F':
                    return DateConverter_.formatMonthTextual_;
                case 'M':
                    return DateConverter_.formatMonthTextualShort_;
                case 'Y':
                    return DateConverter_.formatYear_;
                case 'y':
                    return DateConverter_.formatYearTwoDigits_;
                default:
                    return null;
            }
        }
        static formatDay_(date) {
            return date.getDate() + '';
        }
        static formatDayWithLeadingZero_(date) {
            return ('0' + date.getDate()).slice(-2);
        }
        static formatDayOfWeekTextual_(date, options) {
            return options.translator.translateDayOfWeek(date.getDay());
        }
        static formatDayOfWeekTextualFull_(date, options) {
            return options.translator.translateDayOfWeekFull(date.getDay());
        }
        static formatMonth_(date) {
            return (date.getMonth() + 1) + '';
        }
        static formatMonthWithLeadingZero_(date) {
            return ('0' + (date.getMonth() + 1)).slice(-2);
        }
        static formatMonthTextual_(date, options) {
            return options.translator.translateMonth(date.getMonth());
        }
        static formatMonthTextualShort_(date, options) {
            return options.translator.translateMonthShort(date.getMonth());
        }
        static formatYear_(date) {
            return date.getFullYear() + '';
        }
        static formatYearTwoDigits_(date) {
            const year = date.getFullYear() + '';
            return year.substring(year.length - 2);
        }
        static getParser_(type) {
            switch (type) {
                case 'j':
                case 'd':
                    return DateConverter_.parseDay_;
                case 'D':
                    return DateConverter_.parseDayOfWeekTextual_;
                case 'l':
                    return DateConverter_.parseDayOfWeekTextualFull_;
                case 'n':
                case 'm':
                    return DateConverter_.parseMonth_;
                case 'F':
                    return DateConverter_.parseMonthTextual_;
                case 'M':
                    return DateConverter_.parseMonthTextualShort_;
                case 'Y':
                    return DateConverter_.parseYear_;
                case 'y':
                    return DateConverter_.parseYearTwoDigits_;
                default:
                    return null;
            }
        }
        static parseDay_(text, dateData) {
            let took = 0;
            while (text.substring(0, 1) === '0') {
                text = text.substring(1);
                took++;
            }
            let day = text.substring(0, 2);
            if (!/[12][0-9]|3[01]/.test(day)) {
                day = day.substring(0, 1);
                if (!/[1-9]/.test(day)) {
                    throw new CannotParseDateException();
                }
            }
            dateData.day = parseInt(day, 10);
            return took + day.length;
        }
        static parseDayOfWeekTextual_(text, dateData, options) {
            return DateConverter_.parseDayOfWeekByTranslator_(text, (dayOfWeek) => {
                return options.translator.translateDayOfWeek(dayOfWeek);
            });
        }
        static parseDayOfWeekTextualFull_(text, dateData, options) {
            return DateConverter_.parseDayOfWeekByTranslator_(text, (dayOfWeek) => {
                return options.translator.translateDayOfWeekFull(dayOfWeek);
            });
        }
        static parseDayOfWeekByTranslator_(text, translate) {
            let maxLength = 0;
            let matchedTranslationLength = 0;
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                const translation = translate(dayOfWeek);
                maxLength = Math.max(maxLength, translation.length);
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()
                    && translation.length > matchedTranslationLength) {
                    matchedTranslationLength = translation.length;
                }
            }
            if (matchedTranslationLength > 0) {
                return matchedTranslationLength;
            }
            let took = 0;
            while (/[a-zA-Z]/.test(text.substring(0, 1))) {
                text = text.substring(1);
                took++;
                if (took === maxLength) {
                    break;
                }
            }
            return took;
        }
        static parseMonth_(text, dateData) {
            let took = 0;
            while (text.substring(0, 1) === '0') {
                text = text.substring(1);
                took++;
            }
            let month = text.substring(0, 2);
            if (month !== '10' && month !== '11' && month !== '12') {
                month = month.substring(0, 1);
                if (!/[1-9]/.test(month)) {
                    throw new CannotParseDateException();
                }
            }
            dateData.month = parseInt(month, 10);
            return took + month.length;
        }
        static parseMonthTextual_(text, dateData, options) {
            return DateConverter_.parseMonthByTranslator_(text, dateData, (month) => {
                return options.translator.translateMonth(month);
            });
        }
        static parseMonthTextualShort_(text, dateData, options) {
            return DateConverter_.parseMonthByTranslator_(text, dateData, (month) => {
                return options.translator.translateMonthShort(month);
            });
        }
        static parseMonthByTranslator_(text, dateData, translate) {
            let matchedMonth = null;
            let matchedTranslationLength = 0;
            for (let month = 1; month <= 12; month++) {
                const translation = translate(month - 1);
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()
                    && translation.length > matchedTranslationLength) {
                    matchedMonth = month;
                    matchedTranslationLength = translation.length;
                }
            }
            if (matchedMonth === null) {
                throw new CannotParseDateException();
            }
            dateData.month = matchedMonth;
            return matchedTranslationLength;
        }
        static parseYear_(text, dateData, options) {
            let isNegative = false;
            if (text.substring(0, 1) === '-') {
                isNegative = true;
                text = text.substring(1);
            }
            const minDate = options.getMinDate_();
            const maxDate = options.getMaxDate_();
            const maxPositiveLength = maxDate.getFullYear() > 0 ? (maxDate.getFullYear() + '').length : 0;
            const maxNegativeLength = minDate.getFullYear() < 0 ? (-minDate.getFullYear() + '').length : 0;
            let yearLength = 0;
            while (/[0-9]/.test(text.substring(yearLength, yearLength + 1))) {
                if ((isNegative && yearLength + 1 > maxNegativeLength)
                    || (!isNegative && yearLength + 1 > maxPositiveLength)) {
                    break;
                }
                yearLength++;
            }
            if (yearLength === 0) {
                throw new CannotParseDateException();
            }
            let year = parseInt(text.substring(0, yearLength), 10);
            if (isNegative) {
                year = -year;
            }
            dateData.year = year;
            return yearLength + (isNegative ? 1 : 0);
        }
        static parseYearTwoDigits_(text, dateData, options) {
            const yearEnd = text.substring(0, 2);
            if (!/[0-9]{2}/.test(yearEnd)) {
                throw new CannotParseDateException();
            }
            const currentYear = (options.getToday()).getFullYear() + '';
            const yearBeginning = currentYear.substring(0, currentYear.length - 2);
            dateData.year = parseInt(yearBeginning + yearEnd, 10);
            return 2;
        }
        static getValidPhrases_(type, options) {
            switch (type) {
                case 'j':
                case 'd':
                case 'n':
                case 'm':
                case 'Y':
                case 'y':
                    return [];
                case 'D':
                    return options.translator.dayOfWeekTranslations_;
                case 'l':
                    return options.translator.dayOfWeekFullTranslations_;
                case 'F':
                    return options.translator.monthTranslations_;
                case 'M':
                    return options.translator.monthShortTranslations_;
                default:
                    return null;
            }
        }
    }
    exports.default = DateConverter_;
    DateConverter_.escapeChar_ = '\\';
});
define("Datepicker", ["require", "exports", "Options", "ClassNames", "Translator", "DateConverter", "Helper", "HtmlHelper", "ViewModel"], function (require, exports, Options_1, ClassNames_3, Translator_2, DateConverter_1, Helper_5, HtmlHelper_2, ViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onDatepickerReady = void 0;
    var InitializationPhase;
    (function (InitializationPhase) {
        InitializationPhase[InitializationPhase["Untouched"] = 0] = "Untouched";
        InitializationPhase[InitializationPhase["Waiting"] = 1] = "Waiting";
        InitializationPhase[InitializationPhase["Ready"] = 2] = "Ready";
        InitializationPhase[InitializationPhase["Initialized"] = 3] = "Initialized";
        InitializationPhase[InitializationPhase["Destroyed"] = 4] = "Destroyed";
    })(InitializationPhase || (InitializationPhase = {}));
    class Datepicker {
        constructor(input, container = null, options = null) {
            this.inputClickable_ = null;
            this.inputText_ = null;
            this.initializationPhase_ = InitializationPhase.Untouched;
            this.inputListenerRemover_ = null;
            this.listenerRemovers_ = [];
            this.deselectElement_ = null;
            this.deselectButton_ = null;
            if (!(this instanceof Datepicker)) {
                throw new Error('Creation must be performed by "new" keyword.');
            }
            if (input && !Helper_5.default.isElement_(input)) {
                throw new Error('Input was expected to be null or an HTMLElement.');
            }
            if (container && !Helper_5.default.isElement_(container)) {
                throw new Error('Container was expected to be null or an HTMLElement.');
            }
            if (!input && !container) {
                throw new Error('At least one of input or container is mandatory.');
            }
            if (options && !(options instanceof Options_1.default)) {
                throw new Error('Options was expected to be an instance of Options');
            }
            Datepicker.document_ = document;
            this.options = options ? options.clone() : new Options_1.default();
            const duplicateError = 'There is already a datepicker present on ';
            this.isContainerExternal_ = !!container;
            if (!container) {
                container = this.createContainer_();
                if (input) {
                    input.parentNode.insertBefore(container, input.nextSibling);
                }
            }
            else {
                if (container.datepicker) {
                    throw new Error(duplicateError + 'container.');
                }
            }
            container.setAttribute('data-credits', 'TheDatepicker - Pure JavaScript Datepicker by Slevomat.cz');
            container.setAttribute('data-url', 'https://thedatepicker.github.io/thedatepicker/');
            if (input) {
                if (input.datepicker) {
                    throw new Error(duplicateError + 'input.');
                }
                input.datepicker = this;
                if (input && typeof HTMLInputElement !== 'undefined' && input instanceof HTMLInputElement) {
                    this.inputClickable_ = input;
                    if (input.type === 'text') {
                        this.inputText_ = input;
                        input.autocomplete = 'off';
                    }
                }
            }
            container.datepicker = this;
            this.input = input;
            this.container = container;
            this.viewModel_ = new ViewModel_1.default(this.options, this);
            this.triggerReady_(input);
            this.triggerReady_(container);
        }
        render() {
            switch (this.initializationPhase_) {
                case InitializationPhase.Ready:
                    this.initListeners_();
                    this.initializationPhase_ = InitializationPhase.Initialized;
                    this.render();
                    return;
                case InitializationPhase.Waiting:
                    this.createDeselectElement_();
                    if (!this.options.isHiddenOnBlur()) {
                        this.open();
                        return;
                    }
                    if (!this.viewModel_.selectPossibleDate_()) {
                        this.updateInput_();
                    }
                    return;
                case InitializationPhase.Untouched:
                    this.preselectFromInput_();
                    this.createDeselectElement_();
                    if (!this.viewModel_.selectInitialDate_(null)) {
                        this.updateInput_();
                    }
                    if (this.inputClickable_ && this.options.isHiddenOnBlur()) {
                        if (this.inputClickable_ === Datepicker.document_.activeElement) {
                            this.initializationPhase_ = InitializationPhase.Ready;
                            this.render();
                            this.open();
                            return;
                        }
                        this.inputListenerRemover_ = Helper_5.default.addEventListener_(this.inputClickable_, Helper_5.ListenerType_.Focus, (event) => {
                            this.open(event);
                        });
                        this.initializationPhase_ = InitializationPhase.Waiting;
                        return;
                    }
                    this.initializationPhase_ = InitializationPhase.Ready;
                    this.render();
                    return;
                default:
                    this.viewModel_.render_();
                    return;
            }
        }
        open(event = null) {
            if (this.initializationPhase_ === InitializationPhase.Untouched) {
                this.render();
            }
            if (this.initializationPhase_ === InitializationPhase.Waiting) {
                this.initializationPhase_ = InitializationPhase.Ready;
                this.render();
                Datepicker.hasClickedViewModel_ = true;
            }
            if (!Datepicker.activateViewModel_(event, this)) {
                return false;
            }
            if (this.inputClickable_) {
                this.inputClickable_.focus();
            }
            return true;
        }
        isOpened() {
            return this.viewModel_.isActive_();
        }
        close(event = null) {
            if (!this.viewModel_.isActive_()) {
                return true;
            }
            if (!Datepicker.activateViewModel_(event, null)) {
                return false;
            }
            if (this.inputClickable_) {
                this.inputClickable_.blur();
            }
            return true;
        }
        reset(event = null) {
            return this.viewModel_.reset_(event);
        }
        destroy() {
            if (this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            for (let index = 0; index < this.listenerRemovers_.length; index++) {
                this.listenerRemovers_[index]();
            }
            this.listenerRemovers_ = [];
            if (this.isContainerExternal_) {
                this.container.innerHTML = '';
            }
            else {
                this.container.parentNode.removeChild(this.container);
            }
            delete this.container.datepicker;
            if (this.input) {
                if (this.inputText_) {
                    this.inputText_.autocomplete = '';
                    this.inputText_.readOnly = false;
                }
                delete this.input.datepicker;
                this.removeInitialInputListener_();
                this.input = null;
            }
            if (this.deselectElement_) {
                this.deselectElement_.parentNode.removeChild(this.deselectElement_);
                this.deselectElement_ = null;
            }
            this.initializationPhase_ = InitializationPhase.Destroyed;
        }
        isDestroyed() {
            return this.initializationPhase_ === InitializationPhase.Destroyed;
        }
        selectDate(date, doUpdateMonth = true, event = null) {
            return this.viewModel_.selectDay_(event, Helper_5.default.normalizeDate_('Date', date, true, this.options), !!doUpdateMonth);
        }
        getSelectedDate() {
            return this.viewModel_.selectedDate_ ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
        }
        getSelectedDateFormatted() {
            return DateConverter_1.default.formatDate_(this.viewModel_.selectedDate_, this.options);
        }
        getCurrentMonth() {
            return new Date(this.viewModel_.getCurrentMonth_().getTime());
        }
        goToMonth(month, event = null) {
            return this.viewModel_.goToMonth_(event, Helper_5.default.normalizeDate_('Month', month, false, this.options));
        }
        parseRawInput() {
            return this.inputText_
                ? DateConverter_1.default.parseDate_(this.inputText_.value, this.options)
                : null;
        }
        getDay(date) {
            return this.viewModel_.createDay_(Helper_5.default.normalizeDate_('Date', date, false, this.options));
        }
        canType_(char) {
            if (!this.inputText_ || this.options.isAllowedInputAnyChar()) {
                return true;
            }
            return DateConverter_1.default.isValidChar_(char, this.options);
        }
        readInput_(event = null) {
            if (!this.inputText_) {
                return false;
            }
            try {
                const date = this.parseRawInput();
                if (date ? this.viewModel_.selectNearestDate_(event, date) : this.viewModel_.cancelSelection_(event)) {
                    this.updateDeselectElement_();
                    return true;
                }
            }
            catch (error) {
                if (!(error instanceof DateConverter_1.CannotParseDateException)) {
                    throw error;
                }
            }
            return false;
        }
        updateInput_() {
            if (!this.inputText_ || this.inputText_ === Datepicker.document_.activeElement) {
                return;
            }
            this.inputText_.value = DateConverter_1.default.formatDate_(this.viewModel_.selectedDate_, this.options) || '';
            this.updateDeselectElement_();
        }
        static onDatepickerReady(element, callback = null) {
            if (!Helper_5.default.isElement_(element)) {
                throw new Error('Element was expected to be an HTMLElement.');
            }
            callback = Helper_5.default.checkFunction_('Callback', callback);
            let promise = null;
            let promiseResolve = null;
            if (typeof Promise !== 'undefined') {
                promise = new Promise((resolve) => {
                    promiseResolve = resolve;
                });
            }
            if (element.datepicker && element.datepicker instanceof Datepicker) {
                element.datepicker.triggerReadyListener_(callback, element);
                if (promiseResolve) {
                    promiseResolve(element.datepicker);
                }
            }
            else {
                Datepicker.readyListeners_.push({
                    promiseResolve,
                    element,
                    callback
                });
            }
            return promise;
        }
        ;
        createContainer_() {
            return HtmlHelper_2.default.createDiv_(ClassNames_3.ClassNameType.Container, this.options);
        }
        createDeselectElement_() {
            if (!this.inputText_ || !this.options.isDeselectButtonShown() || this.deselectElement_) {
                return null;
            }
            const deselectButton = HtmlHelper_2.default.createAnchor_((event) => {
                deselectButton.focus();
                this.viewModel_.cancelSelection_(event);
            }, this.options, ClassNames_3.ClassNameType.DeselectButton);
            deselectButton.innerHTML = this.options.getDeselectHtml();
            const title = this.options.translator.translateTitle(Translator_2.TitleName.Deselect);
            if (title !== '') {
                deselectButton.title = title;
            }
            const deselectElement = HtmlHelper_2.default.createSpan_();
            HtmlHelper_2.default.addClass_(deselectElement, ClassNames_3.ClassNameType.Deselect, this.options);
            deselectElement.appendChild(deselectButton);
            this.inputText_.parentNode.insertBefore(deselectElement, this.inputText_.nextSibling);
            this.deselectElement_ = deselectElement;
            this.deselectButton_ = deselectButton;
        }
        updateDeselectElement_() {
            if (!this.deselectElement_) {
                return;
            }
            const isVisible = this.options.isDeselectButtonShown() && this.viewModel_.selectedDate_;
            this.deselectElement_.style.visibility = isVisible ? 'visible' : 'hidden';
        }
        preselectFromInput_() {
            if (this.inputText_) {
                try {
                    const date = this.parseRawInput();
                    if (date) {
                        this.options.setInitialDate(date);
                    }
                }
                catch (error) {
                    if (!(error instanceof DateConverter_1.CannotParseDateException)) {
                        throw error;
                    }
                }
            }
        }
        initListeners_() {
            if (!Datepicker.areGlobalListenersInitialized_) {
                const checkMiss = (event) => {
                    if (Datepicker.hasClickedViewModel_) {
                        Datepicker.hasClickedViewModel_ = false;
                    }
                    else {
                        Datepicker.activateViewModel_(event, null);
                    }
                };
                Helper_5.default.addEventListener_(Datepicker.document_, Helper_5.ListenerType_.MouseDown, checkMiss);
                Helper_5.default.addEventListener_(Datepicker.document_, Helper_5.ListenerType_.FocusIn, checkMiss);
                Helper_5.default.addEventListener_(Datepicker.document_, Helper_5.ListenerType_.KeyDown, (event) => {
                    if (Datepicker.activeViewModel_) {
                        Datepicker.activeViewModel_.triggerKeyPress_(event);
                    }
                });
                Datepicker.areGlobalListenersInitialized_ = true;
            }
            this.removeInitialInputListener_();
            const hit = (event) => {
                Datepicker.activateViewModel_(event, this);
                Datepicker.hasClickedViewModel_ = true;
            };
            this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.container, Helper_5.ListenerType_.MouseDown, hit));
            this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.container, Helper_5.ListenerType_.FocusIn, hit));
            if (this.deselectButton_) {
                const hitIfActive = (event) => {
                    if (this.viewModel_.isActive_()) {
                        hit(event);
                    }
                };
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.deselectButton_, Helper_5.ListenerType_.MouseDown, hitIfActive));
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.deselectButton_, Helper_5.ListenerType_.Focus, hitIfActive));
            }
            if (this.inputClickable_) {
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.inputClickable_, Helper_5.ListenerType_.MouseDown, hit));
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.inputClickable_, Helper_5.ListenerType_.Focus, hit));
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.inputClickable_, Helper_5.ListenerType_.Blur, () => {
                    this.updateInput_();
                }));
            }
            if (this.inputText_) {
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.inputText_, Helper_5.ListenerType_.KeyDown, (event) => {
                    Helper_5.default.stopPropagation_(event);
                    if (event.keyCode === Helper_5.KeyCode_.Esc && this.options.isClosedOnEscPress()) {
                        this.close(event);
                    }
                }));
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.inputText_, Helper_5.ListenerType_.KeyUp, (event) => {
                    this.readInput_(event);
                }));
                this.listenerRemovers_.push(Helper_5.default.addEventListener_(this.inputText_, Helper_5.ListenerType_.KeyPress, (event) => {
                    const charCode = event.charCode || event.keyCode;
                    if (charCode && !this.canType_(String.fromCharCode(charCode))) {
                        Helper_5.default.preventDefault_(event);
                    }
                }));
            }
        }
        removeInitialInputListener_() {
            if (this.inputListenerRemover_) {
                this.inputListenerRemover_();
                this.inputListenerRemover_ = null;
            }
        }
        triggerReady_(element) {
            for (let index = Datepicker.readyListeners_.length - 1; index >= 0; index--) {
                const listener = Datepicker.readyListeners_[index];
                if (listener.element === element) {
                    this.triggerReadyListener_(listener.callback, element);
                    if (listener.promiseResolve) {
                        listener.promiseResolve(this);
                    }
                    Datepicker.readyListeners_.splice(index, 1);
                }
            }
        }
        triggerReadyListener_(callback, element) {
            if (callback) {
                callback.call(element, this, element);
            }
        }
        onActivate_() {
            if (this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            this.updateContainer_();
            if (this.inputText_) {
                this.inputText_.readOnly = !this.options.isKeyboardOnMobile() && Helper_5.default.isMobile_();
            }
        }
        updateContainer_() {
            if (this.isContainerExternal_) {
                return;
            }
            const windowTop = window.pageYOffset || Datepicker.document_.documentElement.scrollTop;
            const windowLeft = window.pageXOffset || Datepicker.document_.documentElement.scrollLeft;
            let viewportHeight = null;
            let viewportWidth = null;
            if (window.visualViewport) {
                viewportHeight = window.visualViewport.height;
                viewportWidth = window.visualViewport.width;
            }
            const windowHeight = viewportHeight || window.innerHeight || Math.max(Datepicker.document_.documentElement.clientHeight, Datepicker.document_.body.clientHeight) || 0;
            const windowWidth = viewportWidth || window.innerWidth || Math.max(Datepicker.document_.documentElement.clientWidth, Datepicker.document_.body.clientWidth) || 0;
            const windowBottom = windowTop + windowHeight;
            const windowRight = windowLeft + windowWidth;
            let inputTop = 0;
            let inputLeft = 0;
            let parentElement = this.input;
            while (parentElement && !isNaN(parentElement.offsetLeft) && !isNaN(parentElement.offsetTop)) {
                inputTop += parentElement.offsetTop - (parentElement.scrollTop || 0);
                inputLeft += parentElement.offsetLeft - (parentElement.scrollLeft || 0);
                parentElement = parentElement.offsetParent;
            }
            let mainElement = null;
            if (this.options.isPositionFixingEnabled() && this.container.childNodes.length > 0) {
                mainElement = this.container.childNodes[0];
                mainElement.style.position = '';
                mainElement.style.top = '';
                mainElement.style.left = '';
            }
            const inputWidth = this.input.offsetWidth;
            const inputHeight = this.input.offsetHeight;
            const inputBottom = inputTop + inputHeight;
            const inputRight = inputLeft + inputWidth;
            const containerHeight = this.container.offsetHeight;
            const containerWidth = this.container.offsetWidth;
            this.container.className = '';
            HtmlHelper_2.default.addClass_(this.container, ClassNames_3.ClassNameType.Container, this.options);
            const locateOver = inputTop - windowTop > containerHeight && windowBottom - inputBottom < containerHeight;
            const locateLeft = inputLeft - windowLeft > containerWidth - inputWidth && windowRight - inputRight < containerWidth - inputWidth;
            if (locateOver) {
                HtmlHelper_2.default.addClass_(this.container, ClassNames_3.ClassNameType.ContainerOver, this.options);
            }
            if (locateLeft) {
                HtmlHelper_2.default.addClass_(this.container, ClassNames_3.ClassNameType.ContainerLeft, this.options);
            }
            if (this.options.isFullScreenOnMobile()) {
                HtmlHelper_2.default.addClass_(this.container, ClassNames_3.ClassNameType.ContainerResponsive, this.options);
            }
            if (this.options.isDarkModeEnabled()) {
                HtmlHelper_2.default.addClass_(this.container, ClassNames_3.ClassNameType.ContainerDarkMode, this.options);
            }
            if (mainElement && (locateOver || locateLeft)) {
                if (locateOver) {
                    const moveTop = inputHeight + containerHeight;
                    mainElement.style.top = '-' + moveTop + 'px';
                }
                if (locateLeft) {
                    const moveLeft = containerWidth - inputWidth;
                    mainElement.style.left = '-' + moveLeft + 'px';
                }
                mainElement.style.position = 'absolute';
            }
        }
        static setBodyClass_(enable) {
            const pageClass = 'the-datepicker-page';
            const body = Datepicker.document_.body;
            const className = body.className;
            const hasClass = className.indexOf(pageClass) > -1;
            if (!hasClass && enable) {
                body.className += (className.length > 0 ? ' ' : '') + pageClass;
            }
            else if (hasClass && !enable) {
                let search = pageClass;
                if (className.indexOf(' ' + pageClass) > -1) {
                    search = ' ' + pageClass;
                }
                else if (className.indexOf(pageClass + ' ') > -1) {
                    search = pageClass + ' ';
                }
                body.className = className.replace(search, '');
            }
        }
        static activateViewModel_(event, datepicker) {
            const viewModel = datepicker ? datepicker.viewModel_ : null;
            const activeViewModel = Datepicker.activeViewModel_;
            if (activeViewModel === viewModel) {
                return true;
            }
            if (activeViewModel && !activeViewModel.setActive_(event, false)) {
                return false;
            }
            if (Datepicker.activeViewModel_ !== activeViewModel) {
                return true;
            }
            if (!viewModel) {
                Datepicker.setBodyClass_(false);
                Datepicker.activeViewModel_ = null;
                return true;
            }
            if (!viewModel.setActive_(event, true)) {
                return false;
            }
            if (Datepicker.activeViewModel_ !== activeViewModel) {
                return true;
            }
            datepicker.onActivate_();
            Datepicker.setBodyClass_(!datepicker.isContainerExternal_ && datepicker.options.isFullScreenOnMobile());
            Datepicker.activeViewModel_ = viewModel;
            return true;
        }
    }
    exports.default = Datepicker;
    Datepicker.readyListeners_ = [];
    Datepicker.areGlobalListenersInitialized_ = false;
    Datepicker.activeViewModel_ = null;
    Datepicker.hasClickedViewModel_ = false;
    exports.onDatepickerReady = Datepicker.onDatepickerReady;
});
define("Template", ["require", "exports", "HtmlHelper", "ClassNames", "ViewModel", "Translator", "Helper"], function (require, exports, HtmlHelper_3, ClassNames_4, ViewModel_2, Translator_3, Helper_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YearCellData_ = void 0;
    class YearCellData_ {
        constructor(yearNumber) {
            this.yearNumber = yearNumber;
            this.isAvailable = true;
            this.isSelected = false;
            this.isHighlighted = false;
            this.isFocused = false;
        }
    }
    exports.YearCellData_ = YearCellData_;
    class Template_ {
        constructor(options_, container_, hasInput_) {
            this.options_ = options_;
            this.container_ = container_;
            this.hasInput_ = hasInput_;
            this.mainElement_ = null;
            this.bodyElement_ = null;
            this.tablesElement_ = null;
            this.tableElement_ = null;
            this.tableOfYearsElement_ = null;
            this.controlElement_ = null;
            this.goBackElement_ = null;
            this.goForwardElement_ = null;
            this.titleElement_ = null;
            this.titleContentElement_ = null;
            this.resetElement_ = null;
            this.resetButton_ = null;
            this.closeElement_ = null;
            this.closeButton_ = null;
            this.monthSelect_ = null;
            this.monthElement_ = null;
            this.yearActiveElement_ = null;
            this.yearTextElement_ = null;
            this.monthAndYearSelect_ = null;
            this.monthAndYearElement_ = null;
            this.weeksElements_ = [];
            this.daysElements_ = [];
            this.daysButtonsElements_ = [];
            this.daysContentsElements_ = [];
            this.yearsRowsElements_ = [];
            this.yearsElements_ = [];
            this.yearsButtonsElements_ = [];
            this.yearsContentsElements_ = [];
            this.onAfterSlide_ = null;
        }
        render_(viewModel) {
            if (!this.mainElement_) {
                if (this.hasInput_ && this.options_.isHiddenOnBlur() && !viewModel.isActive_()) {
                    return;
                }
                this.container_.innerHTML = '';
                this.container_.appendChild(this.createSkeleton_(viewModel));
            }
            this.updateMainElement_(viewModel);
            this.updateTableElements_(viewModel);
            this.updateTopElement_(viewModel);
            this.updateTitleElement_(viewModel);
            this.updateCloseElement_(viewModel);
            this.updateResetElement_(viewModel);
            this.updateGoElement_(viewModel, false);
            this.updateGoElement_(viewModel, true);
            this.updateMonthElement_(viewModel);
            this.updateYearElement_(viewModel);
            this.updateMonthAndYearElement_(viewModel);
            this.updateWeeksElements_(viewModel);
            this.updateTableOfYearsRowsElements_(viewModel);
        }
        createSkeleton_(viewModel) {
            const main = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Main, this.options_);
            HtmlHelper_3.default.appendChild_(main, this.options_.getHeaderStructure_());
            main.appendChild(this.createHeaderElement_(viewModel));
            main.appendChild(this.createBodyElement_(viewModel));
            HtmlHelper_3.default.appendChild_(main, this.options_.getFooterStructure_());
            this.mainElement_ = main;
            return main;
        }
        updateMainElement_(viewModel) {
            this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? '' : 'none';
        }
        updateTableElements_(viewModel) {
            this.tableElement_.style.display = viewModel.yearSelectionState_ ? 'none' : '';
            if (this.tableOfYearsElement_) {
                this.tableOfYearsElement_.style.display = viewModel.yearSelectionState_ ? '' : 'none';
            }
        }
        createBodyElement_(viewModel) {
            const body = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Body, this.options_);
            const tables = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Tables, this.options_);
            body.appendChild(tables);
            if (this.options_.isMonthChangeOnSwipeEnabled() || this.options_.isTableOfYearsOnSwipeDownEnabled()) {
                HtmlHelper_3.default.addClass_(body, ClassNames_4.ClassNameType.BodySwipeable, this.options_);
                Helper_6.default.addSwipeListener_(body, (event, moveDirection) => {
                    let isForward = false;
                    let change = null;
                    switch (moveDirection) {
                        case ViewModel_2.MoveDirection_.Down:
                            isForward = true;
                        case ViewModel_2.MoveDirection_.Up:
                            if (this.tableOfYearsElement_ && this.options_.isTableOfYearsOnSwipeDownEnabled() && viewModel.canSetYearSelectionActive_(isForward)) {
                                change = () => {
                                    viewModel.setYearSelectionActive_(isForward);
                                };
                            }
                            break;
                        case ViewModel_2.MoveDirection_.Left:
                            isForward = true;
                        case ViewModel_2.MoveDirection_.Right:
                            if (this.options_.isMonthChangeOnSwipeEnabled() && viewModel.canGoDirection_(isForward)) {
                                change = () => {
                                    viewModel.goDirection_(event, isForward);
                                };
                            }
                    }
                    if (change) {
                        this.slideTable_(viewModel, moveDirection, change);
                    }
                });
            }
            const tableElement = this.createTableElement_(viewModel);
            tables.appendChild(tableElement);
            this.tableElement_ = tableElement;
            if (this.options_.isYearSelectedFromTableOfYears()) {
                const tableOfYearsElement = this.createTableOfYearsElement_(viewModel);
                tables.appendChild(tableOfYearsElement);
                this.tableOfYearsElement_ = tableOfYearsElement;
            }
            this.bodyElement_ = body;
            this.tablesElement_ = tables;
            return body;
        }
        createHeaderElement_(viewModel) {
            const header = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Header, this.options_);
            const top = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderTop, this.options_);
            header.appendChild(top);
            top.appendChild(this.createTitleElement_(viewModel));
            const control = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderControl, this.options_);
            top.appendChild(control);
            control.appendChild(this.createResetElement_(viewModel));
            control.appendChild(this.createCloseElement_(viewModel));
            const navigation = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderNavigation, this.options_);
            header.appendChild(navigation);
            navigation.appendChild(this.createGoElement_(viewModel, false));
            const state = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderState, this.options_);
            navigation.appendChild(state);
            if (this.options_.isMonthAndYearSeparated()) {
                state.appendChild(this.createMonthElement_(viewModel));
                state.appendChild(this.createYearElement_(viewModel));
            }
            else {
                state.appendChild(this.createMonthAndYearElement_(viewModel));
            }
            navigation.appendChild(this.createGoElement_(viewModel, true));
            this.controlElement_ = control;
            return header;
        }
        updateTopElement_(viewModel) {
            const isVisible = this.options_.getTitle() !== ''
                || this.options_.isResetButtonShown()
                || (this.hasInput_ && this.options_.isCloseButtonShown());
            this.controlElement_.style.display = isVisible ? '' : 'none';
            this.titleElement_.style.display = isVisible ? '' : 'none';
        }
        createTitleElement_(viewModel) {
            const titleElement = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderTitle, this.options_);
            const titleContent = HtmlHelper_3.default.createSpan_();
            titleElement.appendChild(titleContent);
            HtmlHelper_3.default.addClass_(titleContent, ClassNames_4.ClassNameType.HeaderTitleContent, this.options_);
            this.titleElement_ = titleElement;
            this.titleContentElement_ = titleContent;
            return titleElement;
        }
        updateTitleElement_(viewModel) {
            const title = this.options_.getTitle();
            this.titleContentElement_.style.display = title !== '' ? '' : 'none';
            this.titleContentElement_.innerText = title;
        }
        createResetElement_(viewModel) {
            const resetElement = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Reset, this.options_);
            const resetButton = HtmlHelper_3.default.createAnchor_((event) => {
                viewModel.reset_(event);
            }, this.options_);
            resetButton.innerHTML = this.options_.getResetHtml();
            resetElement.appendChild(resetButton);
            this.resetButton_ = resetButton;
            this.resetElement_ = resetElement;
            return resetElement;
        }
        updateResetElement_(viewModel) {
            this.resetElement_.style.display = this.options_.isResetButtonShown() ? '' : 'none';
            this.updateTitle_(this.resetButton_, Translator_3.TitleName.Reset);
        }
        createCloseElement_(viewModel) {
            const closeElement = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Close, this.options_);
            const closeButton = HtmlHelper_3.default.createAnchor_((event) => {
                viewModel.close_(event);
            }, this.options_);
            closeButton.innerHTML = this.options_.getCloseHtml();
            closeElement.appendChild(closeButton);
            this.closeButton_ = closeButton;
            this.closeElement_ = closeElement;
            return closeElement;
        }
        updateCloseElement_(viewModel) {
            this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? '' : 'none';
            this.updateTitle_(this.closeButton_, Translator_3.TitleName.Close);
        }
        createGoElement_(viewModel, isForward) {
            const goElement = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.Go, this.options_);
            HtmlHelper_3.default.addClass_(goElement, isForward ? ClassNames_4.ClassNameType.GoNext : ClassNames_4.ClassNameType.GoPrevious, this.options_);
            const goButton = HtmlHelper_3.default.createAnchor_((event) => {
                const moveDirection = isForward ? ViewModel_2.MoveDirection_.Left : ViewModel_2.MoveDirection_.Right;
                if (viewModel.canGoDirection_(isForward)) {
                    this.slideTable_(viewModel, moveDirection, () => {
                        viewModel.goDirection_(event, isForward);
                    });
                }
            }, this.options_);
            goButton.innerHTML = isForward ? this.options_.getGoForwardHtml() : this.options_.getGoBackHtml();
            goElement.appendChild(goButton);
            if (isForward) {
                this.goForwardElement_ = goButton;
            }
            else {
                this.goBackElement_ = goButton;
            }
            return goElement;
        }
        updateGoElement_(viewModel, isForward) {
            const goElement = isForward ? this.goForwardElement_ : this.goBackElement_;
            goElement.style.visibility = viewModel.canGoDirection_(isForward) ? 'visible' : 'hidden';
            this.updateTitle_(goElement, viewModel.yearSelectionState_
                ? (isForward ? Translator_3.TitleName.GoForwardTableOfYears : Translator_3.TitleName.GoBackTableOfYears)
                : (isForward ? Translator_3.TitleName.GoForward : Translator_3.TitleName.GoBack));
        }
        createMonthElement_(viewModel) {
            const options = [];
            for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
                options.push({
                    value: monthNumber + '',
                    label: this.translateMonth_(monthNumber),
                });
            }
            const selectElement = HtmlHelper_3.default.createSelectInput_(options, (event, monthNumber) => {
                const currentMonth = viewModel.getCurrentMonth_();
                const newMonth = new Date(currentMonth.getTime());
                newMonth.setMonth(parseInt(monthNumber, 10));
                if (!viewModel.goToMonth_(event, newMonth)) {
                    this.monthSelect_.value = currentMonth.getMonth() + '';
                }
            }, this.options_);
            const monthElement = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderMonth, this.options_);
            const monthContent = HtmlHelper_3.default.createSpan_();
            monthElement.appendChild(selectElement);
            monthElement.appendChild(monthContent);
            this.monthElement_ = monthContent;
            this.monthSelect_ = selectElement;
            return monthElement;
        }
        updateMonthElement_(viewModel) {
            if (!this.monthElement_) {
                return;
            }
            const currentMonth = viewModel.getCurrentMonth_().getMonth();
            this.monthElement_.innerText = this.translateMonth_(currentMonth);
            this.updateTitle_(this.monthSelect_, Translator_3.TitleName.Month);
            if (!this.options_.isMonthAsDropdown()) {
                this.monthSelect_.style.display = 'none';
                this.monthElement_.style.display = '';
                return;
            }
            let valuesCount = 0;
            for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
                const newMonth = new Date(viewModel.getCurrentMonth_().getTime());
                newMonth.setMonth(monthNumber);
                const option = this.monthSelect_.getElementsByTagName('option')[monthNumber];
                const canGoToMonth = viewModel.canGoToMonth_(newMonth);
                option.disabled = !canGoToMonth;
                option.style.display = canGoToMonth ? '' : 'none';
                valuesCount += canGoToMonth ? 1 : 0;
            }
            this.monthSelect_.value = currentMonth + '';
            const showSelect = !this.options_.isDropdownWithOneItemHidden() || valuesCount > 1;
            this.monthSelect_.style.display = showSelect ? '' : 'none';
            this.monthElement_.style.display = showSelect ? 'none' : '';
        }
        createYearElement_(viewModel) {
            const yearElement = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderYear, this.options_);
            let yearActiveElement;
            if (this.options_.isYearSelectedFromTableOfYears()) {
                yearActiveElement = HtmlHelper_3.default.createAnchor_(() => {
                    this.slideTable_(viewModel, viewModel.yearSelectionState_ ? ViewModel_2.MoveDirection_.Up : ViewModel_2.MoveDirection_.Down, () => {
                        viewModel.setYearSelectionActive_(!viewModel.yearSelectionState_);
                    });
                }, this.options_);
                HtmlHelper_3.default.addClass_(yearActiveElement, ClassNames_4.ClassNameType.HeaderYearsToggle, this.options_);
            }
            else {
                yearActiveElement = HtmlHelper_3.default.createSelectInput_([], (event, year) => {
                    const currentMonth = viewModel.getCurrentMonth_();
                    let newMonth = new Date(currentMonth.getTime());
                    newMonth.setFullYear(parseInt(year, 10));
                    const minMonth = this.options_.getMinMonth_();
                    const maxMonth = this.options_.getMaxMonth_();
                    if (newMonth.getTime() < minMonth.getTime()) {
                        newMonth = minMonth;
                    }
                    if (newMonth.getTime() > maxMonth.getTime()) {
                        newMonth = maxMonth;
                    }
                    if (!viewModel.goToMonth_(event, newMonth)) {
                        this.yearActiveElement_.value = currentMonth.getFullYear() + '';
                    }
                }, this.options_);
            }
            const yearTextElement = HtmlHelper_3.default.createSpan_();
            yearElement.appendChild(yearActiveElement);
            yearElement.appendChild(yearTextElement);
            this.yearTextElement_ = yearTextElement;
            this.yearActiveElement_ = yearActiveElement;
            return yearElement;
        }
        updateYearElement_(viewModel) {
            if (!this.yearTextElement_) {
                return;
            }
            const currentYear = viewModel.getCurrentMonth_().getFullYear();
            this.yearTextElement_.innerText = currentYear + '';
            this.updateTitle_(this.yearActiveElement_, Translator_3.TitleName.Year);
            const minYear = this.options_.getMinDate_().getFullYear();
            const maxYear = this.options_.getMaxDate_().getFullYear();
            if (this.tableOfYearsElement_) {
                this.yearActiveElement_.innerText = currentYear + '';
                if (viewModel.isYearSelectionToggleButtonFocused_) {
                    this.yearActiveElement_.focus();
                    viewModel.isYearSelectionToggleButtonFocused_ = false;
                }
            }
            else if (this.options_.isYearAsDropdown()) {
                const range = this.calculateDropdownRange_(currentYear, minYear, maxYear);
                const options = this.yearActiveElement_.getElementsByTagName('option');
                const diff = this.calculateDropdownDiff_(options, range, (value) => {
                    return parseInt(value, 10);
                });
                for (let index = 0; index < diff.remove.length; index++) {
                    this.yearActiveElement_.removeChild(diff.remove[index]);
                }
                for (let index = diff.prepend.length - 1; index >= 0; index--) {
                    this.yearActiveElement_.insertBefore(HtmlHelper_3.default.createSelectOption_(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearActiveElement_.firstChild);
                }
                for (let index = 0; index < diff.append.length; index++) {
                    this.yearActiveElement_.appendChild(HtmlHelper_3.default.createSelectOption_(diff.append[index] + '', diff.append[index] + ''));
                }
                this.yearActiveElement_.value = currentYear + '';
            }
            else {
                this.yearActiveElement_.style.display = 'none';
                this.yearTextElement_.style.display = '';
                return;
            }
            const showSelect = !this.options_.isDropdownWithOneItemHidden() || minYear !== maxYear;
            this.yearActiveElement_.style.display = showSelect ? '' : 'none';
            this.yearTextElement_.style.display = showSelect ? 'none' : '';
        }
        createMonthAndYearElement_(viewModel) {
            const monthAndYear = HtmlHelper_3.default.createDiv_(ClassNames_4.ClassNameType.HeaderMonthYear, this.options_);
            const selectElement = HtmlHelper_3.default.createSelectInput_([], (event, value) => {
                const currentMonth = viewModel.getCurrentMonth_();
                let newMonth = new Date(currentMonth.getTime());
                const data = this.parseMonthAndYearOptionValue_(value);
                newMonth.setFullYear(data.year);
                newMonth.setMonth(data.month);
                if (!viewModel.goToMonth_(event, newMonth)) {
                    this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_({
                        month: currentMonth.getMonth(),
                        year: currentMonth.getFullYear(),
                    });
                }
            }, this.options_);
            const monthAndYearContent = HtmlHelper_3.default.createSpan_();
            this.monthAndYearElement_ = monthAndYearContent;
            this.monthAndYearSelect_ = selectElement;
            monthAndYear.appendChild(monthAndYearContent);
            monthAndYear.appendChild(selectElement);
            return monthAndYear;
        }
        updateMonthAndYearElement_(viewModel) {
            if (!this.monthAndYearElement_) {
                return;
            }
            const currentMonth = viewModel.getCurrentMonth_();
            const currentData = {
                month: currentMonth.getMonth(),
                year: currentMonth.getFullYear(),
            };
            const currentIndex = this.calculateMonthAndYearIndex_(currentData);
            this.monthAndYearElement_.innerText = this.translateMonthAndYear_(currentData);
            if (!this.options_.isYearAsDropdown() || !this.options_.isMonthAsDropdown()) {
                this.monthAndYearSelect_.style.display = 'none';
                this.monthAndYearElement_.style.display = '';
                return;
            }
            const minDate = this.options_.getMinDate_();
            const maxDate = this.options_.getMaxDate_();
            const minIndex = minDate.getFullYear() * 12 + minDate.getMonth();
            const maxIndex = maxDate.getFullYear() * 12 + maxDate.getMonth();
            const range = this.calculateDropdownRange_(currentIndex, minIndex, maxIndex);
            const options = this.monthAndYearSelect_.getElementsByTagName('option');
            const diff = this.calculateDropdownDiff_(options, range, (value) => {
                return this.calculateMonthAndYearIndex_(this.parseMonthAndYearOptionValue_(value));
            });
            for (let index = 0; index < diff.remove.length; index++) {
                this.monthAndYearSelect_.removeChild(diff.remove[index]);
            }
            for (let index = diff.prepend.length - 1; index >= 0; index--) {
                const data = this.getMonthAndYearByIndex_(diff.prepend[index]);
                this.monthAndYearSelect_.insertBefore(HtmlHelper_3.default.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
            }
            for (let index = 0; index < diff.append.length; index++) {
                const data = this.getMonthAndYearByIndex_(diff.append[index]);
                this.monthAndYearSelect_.appendChild(HtmlHelper_3.default.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
            }
            this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);
            const showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
            this.monthAndYearSelect_.style.display = showSelect ? '' : 'none';
            this.monthAndYearElement_.style.display = showSelect ? 'none' : '';
        }
        translateMonthAndYear_(data) {
            return this.translateMonth_(data.month) + ' ' + data.year;
        }
        calculateMonthAndYearIndex_(data) {
            return data.year * 12 + data.month;
        }
        getMonthAndYearByIndex_(index) {
            return {
                year: Math.floor(index / 12),
                month: index % 12,
            };
        }
        getMonthAndYearOptionValue_(data) {
            return data.year + '-' + data.month;
        }
        parseMonthAndYearOptionValue_(value) {
            const parts = value.split('-');
            return {
                month: parseInt(parts[1], 10),
                year: parseInt(parts[0], 10),
            };
        }
        calculateDropdownRange_(current, min, max) {
            const limit = this.options_.getDropdownItemsLimit() - 1;
            const maxAppend = Math.ceil(limit / 2);
            let from = current - (limit - maxAppend);
            let to = current + maxAppend;
            if (from < min) {
                to += min - from;
                if (to > max) {
                    to = max;
                }
                from = min;
            }
            else if (to > max) {
                from -= to - max;
                if (from < min) {
                    from = min;
                }
                to = max;
            }
            return {
                from,
                to,
            };
        }
        calculateDropdownDiff_(options, newRange, getNumerical) {
            const firstOption = options.length > 0 ? getNumerical(options[0].value) : null;
            const lastOption = options.length > 0 ? getNumerical(options[options.length - 1].value) : null;
            const prepend = [];
            const append = [];
            const remove = [];
            for (let value = newRange.from; value <= newRange.to; value++) {
                if (firstOption === null || value < firstOption) {
                    prepend.push(value);
                }
                else if (value > lastOption) {
                    append.push(value);
                }
            }
            for (let index = 0; index < options.length; index++) {
                const value = getNumerical(options[index].value);
                if (value < newRange.from || value > newRange.to) {
                    remove.push(options[index]);
                }
            }
            return {
                prepend,
                append,
                remove,
            };
        }
        createTableElement_(viewModel) {
            const tableHeader = this.createTableHeaderElement_(viewModel);
            const tableBody = this.createTableBodyElement_(viewModel);
            const table = HtmlHelper_3.default.createTable_(tableHeader, tableBody, ClassNames_4.ClassNameType.CalendarTable, this.options_);
            HtmlHelper_3.default.addClass_(table, ClassNames_4.ClassNameType.Table, this.options_);
            return table;
        }
        createTableHeaderElement_(viewModel) {
            const weekDays = viewModel.getWeekDays_();
            const cells = [];
            for (let index = 0; index < weekDays.length; index++) {
                const dayOfWeek = weekDays[index];
                cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
            }
            return HtmlHelper_3.default.createTableHeader_(cells, ClassNames_4.ClassNameType.CalendarTableHeader, this.options_);
        }
        createTableHeaderCellElement_(viewModel, dayOfWeek) {
            const headerCell = HtmlHelper_3.default.createTableHeaderCell_(ClassNames_4.ClassNameType.CalendarTableHeaderCell, this.options_);
            if (dayOfWeek === Helper_6.DayOfWeek.Saturday || dayOfWeek === Helper_6.DayOfWeek.Sunday) {
                HtmlHelper_3.default.addClass_(headerCell, ClassNames_4.ClassNameType.WeekDayWeekend, this.options_);
            }
            headerCell.innerText = this.options_.translator.translateDayOfWeek(dayOfWeek);
            return headerCell;
        }
        createTableBodyElement_(viewModel) {
            this.daysElements_ = [];
            this.daysButtonsElements_ = [];
            this.daysContentsElements_ = [];
            const rows = [];
            for (let index = 0; index < 6; index++) {
                rows.push(this.createTableRowElement_(viewModel));
            }
            this.weeksElements_ = rows;
            return HtmlHelper_3.default.createTableBody_(rows, ClassNames_4.ClassNameType.CalendarTableBody, this.options_);
        }
        updateWeeksElements_(viewModel) {
            if (viewModel.yearSelectionState_) {
                return;
            }
            const weeks = viewModel.getWeeks_();
            for (let weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
                const weekElement = this.weeksElements_[weekIndex];
                const week = weeks.length > weekIndex ? weeks[weekIndex] : null;
                weekElement.style.display = week ? '' : 'none';
                if (week) {
                    for (let dayIndex = 0; dayIndex < this.daysElements_[weekIndex].length; dayIndex++) {
                        this.updateDayElement_(viewModel, this.daysElements_[weekIndex][dayIndex], this.daysButtonsElements_[weekIndex][dayIndex], this.daysContentsElements_[weekIndex][dayIndex], week[dayIndex]);
                    }
                }
            }
        }
        createTableRowElement_(viewModel) {
            const cells = [];
            const cellsButtons = [];
            const cellsContents = [];
            for (let index = 0; index < 7; index++) {
                const cell = HtmlHelper_3.default.createTableCell_();
                const cellButton = this.createTableCellButtonElement_(viewModel);
                const cellContent = this.createTableCellContentElement_(viewModel);
                cells.push(cell);
                cellsButtons.push(cellButton);
                cellsContents.push(cellContent);
                cell.appendChild(cellButton);
                cellButton.appendChild(cellContent);
            }
            this.daysElements_.push(cells);
            this.daysButtonsElements_.push(cellsButtons);
            this.daysContentsElements_.push(cellsContents);
            return HtmlHelper_3.default.createTableRow_(cells, this.options_);
        }
        updateDayElement_(viewModel, dayElement, dayButtonElement, dayContentElement, day) {
            dayButtonElement.day = day;
            dayElement.setAttribute('data-date', day.getFormatted());
            dayElement.className = '';
            HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.TableCell, this.options_);
            this.options_.updateCellStructure_(dayContentElement, day);
            if (!day.isVisible) {
                dayButtonElement.removeAttribute('href');
                dayButtonElement.style.visibility = 'hidden';
                return;
            }
            HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.Day, this.options_);
            if (day.isToday) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DayToday, this.options_);
            }
            if (day.isPast) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DayPast, this.options_);
            }
            if (day.isWeekend) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DayWeekend, this.options_);
            }
            if (!day.isAvailable) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.TableCellUnavailable, this.options_);
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DayUnavailable, this.options_);
            }
            if (!day.isInCurrentMonth) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DayOutside, this.options_);
            }
            if (day.isHighlighted) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.TableCellHighlighted, this.options_);
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DayHighlighted, this.options_);
            }
            if (day.isSelected) {
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.TableCellSelected, this.options_);
                HtmlHelper_3.default.addClass_(dayElement, ClassNames_4.ClassNameType.DaySelected, this.options_);
            }
            const customClasses = this.options_.getCellClasses(day);
            for (let index = 0; index < customClasses.length; index++) {
                dayElement.className += ' ' + customClasses[index];
            }
            dayButtonElement.style.visibility = 'visible';
            if (day.isAvailable) {
                dayButtonElement.href = '#';
            }
            else {
                dayButtonElement.removeAttribute('href');
            }
            if (day.isFocused) {
                dayButtonElement.focus();
            }
        }
        createTableCellButtonElement_(viewModel) {
            const cellButton = HtmlHelper_3.default.createAnchor_((event) => {
                const previous = viewModel.selectedDate_;
                const isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
                if (this.options_.isHiddenOnSelect() && (isSelected || (previous && cellButton.day.isEqualToDate(previous)))) {
                    viewModel.close_(event);
                }
            }, this.options_);
            HtmlHelper_3.default.addClass_(cellButton, ClassNames_4.ClassNameType.DayButton, this.options_);
            cellButton.onfocus = (event) => {
                viewModel.highlightDay_(event || window.event, cellButton.day);
            };
            cellButton.onmouseenter = (event) => {
                if (this.options_.getBeforeFocusListeners().length > 0 || this.options_.getFocusListeners().length > 0) {
                    viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
                }
                else {
                    viewModel.cancelDayHighlight_(event || window.event);
                }
            };
            cellButton.onmouseleave = (event) => {
                viewModel.cancelDayHighlight_(event || window.event);
            };
            return cellButton;
        }
        createTableCellContentElement_(viewModel) {
            const cellContent = this.options_.getCellStructure_();
            HtmlHelper_3.default.addClass_(cellContent, ClassNames_4.ClassNameType.ButtonContent, this.options_);
            HtmlHelper_3.default.addClass_(cellContent, ClassNames_4.ClassNameType.DayButtonContent, this.options_);
            return cellContent;
        }
        createTableOfYearsElement_(viewModel) {
            const tableBody = this.createTableOfYearsBodyElement_(viewModel);
            const table = HtmlHelper_3.default.createTable_(null, tableBody, ClassNames_4.ClassNameType.YearsTable, this.options_);
            HtmlHelper_3.default.addClass_(table, ClassNames_4.ClassNameType.Table, this.options_);
            return table;
        }
        createTableOfYearsBodyElement_(viewModel) {
            this.yearsElements_ = [];
            this.yearsButtonsElements_ = [];
            this.yearsContentsElements_ = [];
            const rows = [];
            for (let index = 0; index < this.options_.getTableOfYearsRowsCount(); index++) {
                rows.push(this.createTableOfYearsRowElement_(viewModel));
            }
            this.yearsRowsElements_ = rows;
            return HtmlHelper_3.default.createTableBody_(rows, ClassNames_4.ClassNameType.YearsTableBody, this.options_);
        }
        updateTableOfYearsRowsElements_(viewModel) {
            if (!viewModel.yearSelectionState_) {
                return;
            }
            const rows = viewModel.getYearsRows_();
            for (let rowIndex = 0; rowIndex < this.yearsRowsElements_.length; rowIndex++) {
                const rowElement = this.yearsRowsElements_[rowIndex];
                const cells = rows.length > rowIndex ? rows[rowIndex] : null;
                if (cells) {
                    for (let columnIndex = 0; columnIndex < this.yearsElements_[rowIndex].length; columnIndex++) {
                        this.updateTableOfYearsCellElement_(viewModel, this.yearsElements_[rowIndex][columnIndex], this.yearsButtonsElements_[rowIndex][columnIndex], this.yearsContentsElements_[rowIndex][columnIndex], cells[columnIndex]);
                    }
                }
            }
        }
        updateTableOfYearsCellElement_(viewModel, yearElement, yearButtonElement, yearContentElement, yearCellData) {
            yearButtonElement.yearCellData = yearCellData;
            yearElement.setAttribute('data-year', yearCellData.yearNumber + '');
            yearElement.className = '';
            HtmlHelper_3.default.addClass_(yearElement, ClassNames_4.ClassNameType.TableCell, this.options_);
            yearContentElement.innerText = yearCellData.yearNumber + '';
            if (yearCellData.isAvailable) {
                yearButtonElement.href = '#';
            }
            else {
                yearButtonElement.removeAttribute('href');
                if (this.options_.areYearsOutOfTableOfYearsVisible()) {
                    HtmlHelper_3.default.addClass_(yearElement, ClassNames_4.ClassNameType.TableCellUnavailable, this.options_);
                }
                else {
                    yearButtonElement.style.visibility = 'hidden';
                    return;
                }
            }
            if (yearCellData.isHighlighted) {
                HtmlHelper_3.default.addClass_(yearElement, ClassNames_4.ClassNameType.TableCellHighlighted, this.options_);
            }
            if (yearCellData.isSelected) {
                HtmlHelper_3.default.addClass_(yearElement, ClassNames_4.ClassNameType.TableCellSelected, this.options_);
            }
            yearButtonElement.style.visibility = 'visible';
            if (yearCellData.isFocused) {
                yearButtonElement.focus();
            }
        }
        createTableOfYearsRowElement_(viewModel) {
            const cells = [];
            const cellsButtons = [];
            const cellsContents = [];
            for (let index = 0; index < this.options_.getTableOfYearsColumnsCount(); index++) {
                const cell = HtmlHelper_3.default.createTableCell_();
                const cellButton = this.createTableOfYearsCellButtonElement_(viewModel);
                const cellContent = this.createTableOfYearsCellContentElement_(viewModel);
                cells.push(cell);
                cellsButtons.push(cellButton);
                cellsContents.push(cellContent);
                cell.appendChild(cellButton);
                cellButton.appendChild(cellContent);
            }
            this.yearsElements_.push(cells);
            this.yearsButtonsElements_.push(cellsButtons);
            this.yearsContentsElements_.push(cellsContents);
            return HtmlHelper_3.default.createTableRow_(cells, this.options_);
        }
        createTableOfYearsCellButtonElement_(viewModel) {
            const cellButton = HtmlHelper_3.default.createAnchor_((event) => {
                const newMonth = new Date(cellButton.yearCellData.yearNumber, viewModel.getCurrentMonth_().getMonth(), 1);
                const correctMonth = this.options_.correctMonth(newMonth);
                if (correctMonth.getFullYear() === newMonth.getFullYear()) {
                    viewModel.goToMonth_(event, correctMonth);
                    viewModel.isYearSelectionToggleButtonFocused_ = true;
                    this.slideTable_(viewModel, ViewModel_2.MoveDirection_.Up, () => {
                        viewModel.setYearSelectionActive_(false);
                    });
                }
            }, this.options_);
            HtmlHelper_3.default.addClass_(cellButton, ClassNames_4.ClassNameType.YearCellButton, this.options_);
            cellButton.onfocus = () => {
                viewModel.highlightYear_(cellButton.yearCellData.yearNumber);
            };
            cellButton.onmouseenter = () => {
                viewModel.cancelYearHighlight_();
            };
            cellButton.onmouseleave = () => {
                viewModel.cancelYearHighlight_();
            };
            return cellButton;
        }
        createTableOfYearsCellContentElement_(viewModel) {
            const cellContent = HtmlHelper_3.default.createSpan_();
            HtmlHelper_3.default.addClass_(cellContent, ClassNames_4.ClassNameType.ButtonContent, this.options_);
            HtmlHelper_3.default.addClass_(cellContent, ClassNames_4.ClassNameType.YearCellButtonContent, this.options_);
            return cellContent;
        }
        slideTable_(viewModel, moveDirection, onComplete) {
            if (!this.options_.isSlideAnimationEnabled() || !Helper_6.default.isCssAnimationSupported_()) {
                onComplete();
                return;
            }
            const trigger = () => {
                let animationOut;
                let animationIn;
                switch (moveDirection) {
                    case ViewModel_2.MoveDirection_.Left:
                        animationOut = ClassNames_4.ClassNameType.AnimateFadeOutLeft;
                        animationIn = ClassNames_4.ClassNameType.AnimateFadeInRight;
                        break;
                    case ViewModel_2.MoveDirection_.Up:
                        animationOut = ClassNames_4.ClassNameType.AnimateFadeOutUp;
                        animationIn = ClassNames_4.ClassNameType.AnimateFadeInDown;
                        break;
                    case ViewModel_2.MoveDirection_.Right:
                        animationOut = ClassNames_4.ClassNameType.AnimateFadeOutRight;
                        animationIn = ClassNames_4.ClassNameType.AnimateFadeInLeft;
                        break;
                    case ViewModel_2.MoveDirection_.Down:
                        animationOut = ClassNames_4.ClassNameType.AnimateFadeOutDown;
                        animationIn = ClassNames_4.ClassNameType.AnimateFadeInUp;
                        break;
                }
                const originalClassName = this.tablesElement_.className;
                const animate = (type) => {
                    HtmlHelper_3.default.addClass_(this.tablesElement_, ClassNames_4.ClassNameType.Animated, this.options_);
                    HtmlHelper_3.default.addClass_(this.tablesElement_, type, this.options_);
                };
                const onAfterSlide = () => {
                    if (this.onAfterSlide_.length > 0) {
                        this.onAfterSlide_.shift()();
                    }
                    else {
                        this.onAfterSlide_ = null;
                    }
                };
                let listenerRemover;
                const timeoutId = window.setTimeout(() => {
                    listenerRemover();
                    onComplete();
                    onAfterSlide();
                }, 150);
                listenerRemover = Helper_6.default.addEventListener_(this.tablesElement_, Helper_6.ListenerType_.AnimationEnd, () => {
                    window.clearTimeout(timeoutId);
                    onComplete();
                    listenerRemover();
                    this.tablesElement_.className = originalClassName;
                    animate(animationIn);
                    listenerRemover = Helper_6.default.addEventListener_(this.tablesElement_, Helper_6.ListenerType_.AnimationEnd, () => {
                        listenerRemover();
                        this.tablesElement_.className = originalClassName;
                        onAfterSlide();
                    });
                });
                animate(animationOut);
            };
            if (this.onAfterSlide_) {
                this.onAfterSlide_.push(trigger);
            }
            else {
                this.onAfterSlide_ = [];
                trigger();
            }
        }
        translateMonth_(monthNumber) {
            return this.options_.isMonthShort()
                ? this.options_.translator.translateMonthShort(monthNumber)
                : this.options_.translator.translateMonth(monthNumber);
        }
        updateTitle_(element, titleName) {
            const title = this.options_.translator.translateTitle(titleName);
            if (title !== '') {
                element.title = title;
                if (this.options_.isAriaIncluded()) {
                    element.setAttribute('aria-label', title);
                }
            }
            else {
                element.removeAttribute('title');
                element.removeAttribute('aria-label');
            }
        }
    }
    exports.default = Template_;
});
define("ViewModel", ["require", "exports", "Day", "Options", "DateConverter", "Helper", "Template"], function (require, exports, Day_1, Options_2, DateConverter_2, Helper_7, Template_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MoveDirection_ = void 0;
    var MoveDirection_;
    (function (MoveDirection_) {
        MoveDirection_[MoveDirection_["Left"] = 1] = "Left";
        MoveDirection_[MoveDirection_["Up"] = 2] = "Up";
        MoveDirection_[MoveDirection_["Right"] = 3] = "Right";
        MoveDirection_[MoveDirection_["Down"] = 4] = "Down";
    })(MoveDirection_ = exports.MoveDirection_ || (exports.MoveDirection_ = {}));
    class YearSelectionState {
        constructor(cellsCount, lowestYear, maxPage, page) {
            this.cellsCount = cellsCount;
            this.lowestYear = lowestYear;
            this.maxPage = maxPage;
            this.page = page;
            this.highlightedYear = null;
            this.isHighlightedYearFocused = false;
            this.initialPage = page;
        }
        getPage() {
            return this.page;
        }
        canShiftPage(shift) {
            const newPage = this.page + shift;
            return newPage >= 0 && newPage <= this.maxPage;
        }
        shiftPage(shift) {
            if (!this.canShiftPage(shift)) {
                return false;
            }
            this.page += shift;
            return true;
        }
        getFirstYear() {
            return this.lowestYear + this.page * this.cellsCount;
        }
        getLastYear() {
            return this.lowestYear + this.page * this.cellsCount + this.cellsCount - 1;
        }
        highlightYear(year, doFocus = true) {
            if (!this || year === this.highlightedYear) {
                return false;
            }
            this.highlightedYear = year;
            if (doFocus) {
                this.isHighlightedYearFocused = true;
            }
            if (year < this.getFirstYear()) {
                this.shiftPage(-1);
            }
            if (year > this.getLastYear()) {
                this.shiftPage(1);
            }
            return true;
        }
        cancelHighlight() {
            if (!this.highlightedYear) {
                return false;
            }
            this.highlightedYear = null;
            return true;
        }
    }
    class ViewModel_ {
        constructor(options_, datepicker_) {
            this.options_ = options_;
            this.datepicker_ = datepicker_;
            this.selectedDate_ = null;
            this.yearSelectionState_ = null;
            this.isYearSelectionToggleButtonFocused_ = false;
            this.tableOfYearsSettings_ = null;
            this.initialMonth_ = null;
            this.currentMonth_ = null;
            this.outsideDates_ = null;
            this.highlightedDay_ = null;
            this.isHighlightedDayFocused_ = false;
            this.active_ = false;
            this.template_ = new Template_1.default(this.options_, datepicker_.container, !!datepicker_.input);
        }
        render_() {
            if (this.datepicker_.isDestroyed() || this.selectPossibleDate_()) {
                return;
            }
            const correctMonth = this.options_.correctMonth(this.getCurrentMonth_());
            if (this.goToMonth_(null, correctMonth)) {
                return;
            }
            if (!this.tableOfYearsSettings_) {
                this.tableOfYearsSettings_ = {
                    rowsCount: this.options_.getTableOfYearsRowsCount(),
                    columnsCount: this.options_.getTableOfYearsColumnsCount(),
                };
            }
            this.template_.render_(this);
            this.datepicker_.updateInput_();
        }
        setActive_(event, value) {
            if (this.active_ === value) {
                return true;
            }
            if ((value && !this.triggerOnBeforeOpen_(event))
                || (!value && !this.triggerOnBeforeClose_(event))) {
                return false;
            }
            this.active_ = value;
            if (((!value && !this.setYearSelectionActive_(false))
                || value) && this.options_.isHiddenOnBlur()) {
                this.render_();
            }
            if (value) {
                this.triggerOnOpen_(event);
            }
            else {
                this.triggerOnClose_(event);
            }
            return true;
        }
        isActive_() {
            return this.active_;
        }
        close_(event) {
            return this.datepicker_.close(event);
        }
        getCurrentMonth_() {
            if (!this.currentMonth_) {
                this.setCurrentMonth_(this.getInitialMonth_());
            }
            return this.currentMonth_;
        }
        canGoDirection_(isForward) {
            const delta = isForward ? 1 : -1;
            if (this.yearSelectionState_) {
                return this.yearSelectionState_.canShiftPage(delta);
            }
            const newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() + delta);
            return this.canGoToMonth_(newMonth);
        }
        canGoToMonth_(month) {
            if (!Helper_7.default.isValidDate_(month)) {
                return false;
            }
            return this.options_.isMonthInValidity(month);
        }
        goDirection_(event, isForward) {
            const delta = isForward ? 1 : -1;
            if (this.yearSelectionState_) {
                if (this.yearSelectionState_.shiftPage(delta)) {
                    this.render_();
                }
                return;
            }
            const newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() + delta);
            return this.goToMonth_(event, newMonth);
        }
        goToMonth_(event, month, doCancelHighlight = true) {
            month = Helper_7.default.resetTime_(new Date(month.getTime()));
            month.setDate(1);
            if (month.getTime() === this.getCurrentMonth_().getTime() || !this.canGoToMonth_(month)) {
                return false;
            }
            if (!this.triggerOnBeforeMonthChange_(event, month, this.currentMonth_)) {
                return false;
            }
            this.setCurrentMonth_(month);
            if (!doCancelHighlight || !this.cancelDayHighlight_(event)) {
                this.render_();
            }
            this.triggerOnMonthChange_(event, month, this.currentMonth_);
            return true;
        }
        reset_(event) {
            this.initialMonth_ = null;
            const isMonthChanged = this.goToMonth_(event, this.getInitialMonth_());
            const isDaySelected = this.selectInitialDate_(event);
            return isMonthChanged || isDaySelected;
        }
        selectDay_(event, date, doUpdateMonth = true, doHighlight = false, canToggle = false) {
            if (!date) {
                return this.cancelSelection_(event);
            }
            let day;
            if (date instanceof Day_1.default) {
                day = date;
                date = day.getDate();
            }
            else {
                day = this.createDay_(date);
            }
            if (!day.isAvailable) {
                return false;
            }
            if (day.isEqualToDate(this.selectedDate_)) {
                if (canToggle && this.options_.hasToggleSelection()) {
                    return this.cancelSelection_(event);
                }
                return false;
            }
            const previousDay = this.selectedDate_ ? this.createDay_(this.selectedDate_) : null;
            if (!this.triggerOnBeforeSelect_(event, day, previousDay)) {
                return false;
            }
            this.selectedDate_ = day.getDate();
            if (doHighlight) {
                this.highlightDay_(event, day);
            }
            if (!doUpdateMonth || !this.goToMonth_(event, date)) {
                this.render_();
            }
            this.triggerOnSelect_(event, day, previousDay);
            return true;
        }
        canSetYearSelectionActive_(value) {
            return !!this.yearSelectionState_ !== value
                && (!value
                    || this.options_.getMinDate_().getFullYear() !== this.options_.getMaxDate_().getFullYear());
        }
        setYearSelectionActive_(value) {
            if (this.canSetYearSelectionActive_(value)) {
                this.yearSelectionState_ = value
                    ? this.createYearSelectionState_()
                    : null;
                this.render_();
                return true;
            }
            return false;
        }
        selectNearestDate_(event, date) {
            return this.selectDay_(event, this.options_.findNearestAvailableDate(date));
        }
        selectPossibleDate_() {
            try {
                return this.selectDay_(null, this.options_.findPossibleAvailableDate(this.selectedDate_), false);
            }
            catch (error) {
                if (!(error instanceof Options_2.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection_(null, true);
            }
        }
        selectInitialDate_(event) {
            try {
                return this.selectDay_(event, this.options_.getInitialDate(), false);
            }
            catch (error) {
                if (!(error instanceof Options_2.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection_(null, true);
            }
        }
        highlightDay_(event, day, doUpdateMonth = false, doFocus = true) {
            if (!day.isAvailable) {
                return false;
            }
            if (day.isEqualToDay(this.highlightedDay_)) {
                return false;
            }
            const previousDay = this.highlightedDay_;
            if (!this.triggerOnBeforeFocus_(event, day, previousDay)) {
                return false;
            }
            this.highlightedDay_ = day;
            if (doFocus) {
                this.isHighlightedDayFocused_ = true;
            }
            const date = day.getDate();
            if (!doUpdateMonth || !this.goToMonth_(event, date, false)) {
                this.render_();
            }
            this.triggerOnFocus_(event, day, previousDay);
            return true;
        }
        highlightFirstAvailableDay_(event) {
            const maxDate = this.options_.getMaxDate_();
            let day = this.createDay_(new Date(this.getCurrentMonth_().getTime()));
            while (!day.isAvailable) {
                const sibling = day.getSibling();
                if (sibling.dayNumber === 1) {
                    break;
                }
                if (sibling.getDate().getTime() > maxDate.getTime()) {
                    break;
                }
                day = sibling;
            }
            return this.highlightDay_(event, day);
        }
        highlightSiblingDay_(event, day, direction) {
            let shift;
            switch (direction) {
                case MoveDirection_.Left:
                    shift = -1;
                    break;
                case MoveDirection_.Up:
                    shift = -7;
                    break;
                case MoveDirection_.Right:
                    shift = 1;
                    break;
                case MoveDirection_.Down:
                    shift = 7;
                    break;
            }
            let newDay = day;
            let maxLoops = 1000;
            do {
                newDay = newDay.getSibling(shift);
                if (!newDay.isInValidity) {
                    break;
                }
                maxLoops--;
            } while (!newDay.isAvailable && maxLoops > 0);
            return this.highlightDay_(event, newDay, true);
        }
        cancelSelection_(event, force = false) {
            if (!this.options_.isAllowedEmpty() && !force) {
                return false;
            }
            if (!this.selectedDate_) {
                return false;
            }
            const previousDay = this.createDay_(this.selectedDate_);
            if (!this.triggerOnBeforeSelect_(event, null, previousDay)) {
                return false;
            }
            this.selectedDate_ = null;
            this.render_();
            this.triggerOnSelect_(event, null, previousDay);
            return true;
        }
        cancelDayHighlight_(event) {
            if (!this.highlightedDay_) {
                return false;
            }
            const previousDay = this.highlightedDay_;
            if (!this.triggerOnBeforeFocus_(event, null, previousDay)) {
                return false;
            }
            this.highlightedDay_ = null;
            this.render_();
            this.triggerOnFocus_(event, null, previousDay);
            return true;
        }
        highlightYear_(year, doFocus = true) {
            if (this.yearSelectionState_ && this.yearSelectionState_.highlightYear(year, doFocus)) {
                this.render_();
                return true;
            }
            return false;
        }
        highlightSiblingYear_(year, direction) {
            let shift;
            switch (direction) {
                case MoveDirection_.Left:
                    shift = -1;
                    break;
                case MoveDirection_.Up:
                    shift = -this.tableOfYearsSettings_.columnsCount;
                    break;
                case MoveDirection_.Right:
                    shift = 1;
                    break;
                case MoveDirection_.Down:
                    shift = this.tableOfYearsSettings_.columnsCount;
                    break;
            }
            const newYear = year + shift;
            if (newYear < this.options_.getMinDate_().getFullYear()
                || newYear > this.options_.getMaxDate_().getFullYear()) {
                return;
            }
            return this.highlightYear_(newYear, true);
        }
        cancelYearHighlight_() {
            if (this.yearSelectionState_ && this.yearSelectionState_.cancelHighlight()) {
                this.render_();
                return true;
            }
            return true;
        }
        getWeekDays_() {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                weekDays.push((this.options_.getFirstDayOfWeek() + day) % 7);
            }
            return weekDays;
        }
        getWeeks_() {
            const days = [];
            const currentMonth = this.getCurrentMonth_();
            const outsideDates = this.getOutsideDates_();
            for (let index = 0; index < outsideDates.prepend.length; index++) {
                const day = this.createDay_(outsideDates.prepend[index]);
                days.push(day);
            }
            const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            const monthDaysCount = lastDateOfMonth.getDate();
            for (let date = 1; date <= monthDaysCount; date++) {
                days.push(this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
            }
            for (let index = 0; index < outsideDates.append.length; index++) {
                const day = this.createDay_(outsideDates.append[index]);
                days.push(day);
            }
            const weeks = [];
            for (let i = 0; i < days.length; i += 7) {
                weeks.push(days.slice(i, i + 7));
            }
            this.isHighlightedDayFocused_ = false;
            return weeks;
        }
        getYearsRows_() {
            if (!this.yearSelectionState_) {
                return [];
            }
            const yearsData = [];
            const minYear = this.options_.getMinDate_().getFullYear();
            const maxYear = this.options_.getMaxDate_().getFullYear();
            const currentYear = this.getCurrentMonth_().getFullYear();
            const firstYear = this.yearSelectionState_.getFirstYear();
            for (let year = firstYear; year <= firstYear + this.yearSelectionState_.cellsCount; year++) {
                const yearCellData = new Template_1.YearCellData_(year);
                if (year > maxYear || year < minYear) {
                    yearCellData.isAvailable = false;
                }
                else {
                    if (year === currentYear) {
                        yearCellData.isSelected = true;
                    }
                    if (year === this.yearSelectionState_.highlightedYear) {
                        yearCellData.isHighlighted = true;
                        if (this.yearSelectionState_.isHighlightedYearFocused) {
                            yearCellData.isFocused = true;
                        }
                    }
                }
                yearsData.push(yearCellData);
            }
            const yearsRows = [];
            for (let i = 0; i < yearsData.length; i += this.tableOfYearsSettings_.columnsCount) {
                yearsRows.push(yearsData.slice(i, i + this.tableOfYearsSettings_.columnsCount));
            }
            this.yearSelectionState_.isHighlightedYearFocused;
            return yearsRows;
        }
        createYearSelectionState_() {
            let align = this.options_.getTableOfYearsAlign();
            const minDate = this.options_.getMinDate();
            const maxDate = this.options_.getMaxDate();
            const initialYear = this.getInitialMonth_().getFullYear();
            if ((align === Helper_7.Align.Left && minDate === null)
                || (align === Helper_7.Align.Right && maxDate === null)) {
                align = null;
            }
            if (!align) {
                if (minDate && maxDate) {
                    const lowDiff = initialYear - minDate.getFullYear();
                    const highDiff = maxDate.getFullYear() - initialYear;
                    align = lowDiff > highDiff ? Helper_7.Align.Right : Helper_7.Align.Left;
                }
                else if (minDate) {
                    align = Helper_7.Align.Left;
                }
                else if (maxDate) {
                    align = Helper_7.Align.Right;
                }
                else {
                    align = Helper_7.Align.Center;
                }
            }
            let lowestYear;
            const cellsCount = this.tableOfYearsSettings_.rowsCount * this.tableOfYearsSettings_.columnsCount;
            const minYear = this.options_.getMinDate_().getFullYear();
            const maxYear = this.options_.getMaxDate_().getFullYear();
            switch (align) {
                case Helper_7.Align.Left:
                    lowestYear = minYear;
                    break;
                case Helper_7.Align.Right:
                    lowestYear = minYear - (cellsCount - ((maxYear - minYear) % cellsCount) - 1);
                    break;
                case Helper_7.Align.Center:
                    const shift = Math.floor(this.tableOfYearsSettings_.rowsCount / 2) * this.tableOfYearsSettings_.columnsCount + Math.floor(this.tableOfYearsSettings_.columnsCount / 2);
                    lowestYear = minYear - (cellsCount - ((initialYear + shift - minYear) % cellsCount) - 1);
                    break;
                default:
                    throw new Error('Invalid align: ' + align);
            }
            const currentYear = this.getCurrentMonth_().getFullYear();
            const page = Math.floor((currentYear - lowestYear) / cellsCount);
            return new YearSelectionState(cellsCount, lowestYear, Math.floor((maxYear - lowestYear) / cellsCount), page);
        }
        triggerKeyPress_(event) {
            if (Helper_7.default.inArray_([Helper_7.KeyCode_.Left, Helper_7.KeyCode_.Up, Helper_7.KeyCode_.Right, Helper_7.KeyCode_.Down], event.keyCode)) {
                Helper_7.default.preventDefault_(event);
                const moveDirection = this.translateKeyCodeToMoveDirection_(event.keyCode);
                if (this.yearSelectionState_) {
                    if (this.yearSelectionState_.highlightedYear) {
                        this.highlightSiblingYear_(this.yearSelectionState_.highlightedYear, moveDirection);
                    }
                    else if (this.yearSelectionState_.getPage() === this.yearSelectionState_.initialPage) {
                        this.highlightSiblingYear_(this.getCurrentMonth_().getFullYear(), moveDirection);
                    }
                    else {
                        this.highlightYear_(this.yearSelectionState_.getPage() === 0 ? this.yearSelectionState_.lowestYear : this.yearSelectionState_.getFirstYear());
                    }
                }
                else {
                    if (this.highlightedDay_) {
                        this.highlightSiblingDay_(event, this.highlightedDay_, moveDirection);
                    }
                    else if (this.selectedDate_
                        && this.selectedDate_.getFullYear() === this.getCurrentMonth_().getFullYear()
                        && this.selectedDate_.getMonth() === this.getCurrentMonth_().getMonth()) {
                        this.highlightSiblingDay_(event, this.createDay_(this.selectedDate_), moveDirection);
                    }
                    else {
                        this.highlightFirstAvailableDay_(event);
                    }
                }
            }
            else if (event.keyCode === Helper_7.KeyCode_.Esc && this.options_.isClosedOnEscPress()) {
                if (this.yearSelectionState_) {
                    this.isYearSelectionToggleButtonFocused_ = true;
                    this.setYearSelectionActive_(false);
                }
                else {
                    this.datepicker_.close(event);
                }
            }
        }
        createDay_(date) {
            date = Helper_7.default.resetTime_(new Date(date.getTime()));
            const today = this.options_.getToday();
            const currentMonth = this.getCurrentMonth_();
            const day = new Day_1.default(date, (date) => {
                return this.createDay_(date);
            }, (date) => {
                return DateConverter_2.default.formatDate_(date, this.options_);
            });
            day.isToday = date.getTime() === today.getTime();
            day.isPast = date.getTime() < today.getTime();
            day.isInValidity = this.options_.isDateInValidity(date);
            day.isAvailable = day.isInValidity && this.options_.isDateAvailable(date);
            day.isInCurrentMonth = date.getMonth() === currentMonth.getMonth();
            if (day.isInCurrentMonth) {
                day.isVisible = true;
            }
            else if (this.options_.areDaysOutOfMonthVisible()) {
                const outsideDates = this.getOutsideDates_();
                const pendants = outsideDates.prepend.concat(outsideDates.append);
                for (let index = 0; index < pendants.length; index++) {
                    if (date.getTime() === pendants[index].getTime()) {
                        day.isVisible = true;
                        break;
                    }
                }
            }
            if (day.isAvailable) {
                if (day.isEqualToDate(this.selectedDate_)) {
                    day.isSelected = true;
                }
                if (day.isEqualToDay(this.highlightedDay_)) {
                    day.isHighlighted = true;
                    if (this.isHighlightedDayFocused_) {
                        day.isFocused = true;
                    }
                }
            }
            this.options_.modifyDay(day);
            return day;
        }
        triggerOnBeforeSelect_(event, day, previousDay) {
            return this.options_.triggerEvent_(Options_2.EventType_.BeforeSelect, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        triggerOnSelect_(event, day, previousDay) {
            this.options_.triggerEvent_(Options_2.EventType_.Select, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        triggerOnBeforeOpen_(event) {
            return this.options_.triggerEvent_(Options_2.EventType_.BeforeOpen, (listener) => {
                return listener.call(this.datepicker_, event, true);
            });
        }
        triggerOnOpen_(event) {
            this.options_.triggerEvent_(Options_2.EventType_.Open, (listener) => {
                return listener.call(this.datepicker_, event, true);
            });
        }
        triggerOnBeforeClose_(event) {
            return this.options_.triggerEvent_(Options_2.EventType_.BeforeClose, (listener) => {
                return listener.call(this.datepicker_, event, false);
            });
        }
        triggerOnClose_(event) {
            this.options_.triggerEvent_(Options_2.EventType_.Close, (listener) => {
                return listener.call(this.datepicker_, event, false);
            });
        }
        triggerOnBeforeMonthChange_(event, month, previousMonth) {
            return this.options_.triggerEvent_(Options_2.EventType_.BeforeMonthChange, (listener) => {
                return listener.call(this.datepicker_, event, month, previousMonth);
            });
        }
        triggerOnMonthChange_(event, month, previousMonth) {
            this.options_.triggerEvent_(Options_2.EventType_.MonthChange, (listener) => {
                return listener.call(this.datepicker_, event, month, previousMonth);
            });
        }
        triggerOnBeforeFocus_(event, day, previousDay) {
            return this.options_.triggerEvent_(Options_2.EventType_.BeforeFocus, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        triggerOnFocus_(event, day, previousDay) {
            this.options_.triggerEvent_(Options_2.EventType_.Focus, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        setCurrentMonth_(month) {
            this.currentMonth_ = month;
            this.outsideDates_ = null;
        }
        getOutsideDates_() {
            if (this.outsideDates_) {
                return this.outsideDates_;
            }
            const currentMonth = this.getCurrentMonth_();
            const firstDayOfWeek = this.options_.getFirstDayOfWeek();
            const firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
            const prependDaysCount = (firstDateOfMonth.getDay() - firstDayOfWeek + 7) % 7;
            const prepend = [];
            for (let date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
                prepend.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
            }
            const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            const appendDaysCount = 6 - ((lastDateOfMonth.getDay() - firstDayOfWeek + 7) % 7);
            const append = [];
            for (let date = 1; date <= appendDaysCount; date++) {
                append.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
            }
            if (this.options_.hasFixedRowsCount()) {
                const monthDaysCount = lastDateOfMonth.getDate();
                for (let date = appendDaysCount + 1; prependDaysCount + monthDaysCount + append.length < 6 * 7; date++) {
                    append.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
                }
            }
            this.outsideDates_ = {
                prepend: prepend,
                append: append,
            };
            return this.outsideDates_;
        }
        getInitialMonth_() {
            if (!this.initialMonth_) {
                this.initialMonth_ = this.options_.getInitialMonth();
            }
            return this.initialMonth_;
        }
        translateKeyCodeToMoveDirection_(key) {
            switch (key) {
                case Helper_7.KeyCode_.Left:
                    return MoveDirection_.Left;
                case Helper_7.KeyCode_.Up:
                    return MoveDirection_.Up;
                case Helper_7.KeyCode_.Right:
                    return MoveDirection_.Right;
                case Helper_7.KeyCode_.Down:
                    return MoveDirection_.Down;
                default:
                    throw new Error('Invalid key code: ' + key);
            }
        }
    }
    exports.default = ViewModel_;
});
define("Helper", ["require", "exports", "Day", "ViewModel"], function (require, exports, Day_2, ViewModel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListenerType_ = exports.KeyCode_ = exports.Align = exports.Month = exports.DayOfWeek = void 0;
    var DayOfWeek;
    (function (DayOfWeek) {
        DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
        DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
        DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
        DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
        DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
        DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
        DayOfWeek[DayOfWeek["Sunday"] = 0] = "Sunday";
    })(DayOfWeek = exports.DayOfWeek || (exports.DayOfWeek = {}));
    var Month;
    (function (Month) {
        Month[Month["January"] = 0] = "January";
        Month[Month["February"] = 1] = "February";
        Month[Month["March"] = 2] = "March";
        Month[Month["April"] = 3] = "April";
        Month[Month["May"] = 4] = "May";
        Month[Month["June"] = 5] = "June";
        Month[Month["July"] = 6] = "July";
        Month[Month["August"] = 7] = "August";
        Month[Month["September"] = 8] = "September";
        Month[Month["October"] = 9] = "October";
        Month[Month["November"] = 10] = "November";
        Month[Month["December"] = 11] = "December";
    })(Month = exports.Month || (exports.Month = {}));
    var Align;
    (function (Align) {
        Align[Align["Left"] = 1] = "Left";
        Align[Align["Right"] = 2] = "Right";
        Align[Align["Center"] = 3] = "Center";
    })(Align = exports.Align || (exports.Align = {}));
    var KeyCode_;
    (function (KeyCode_) {
        KeyCode_[KeyCode_["Enter"] = 13] = "Enter";
        KeyCode_[KeyCode_["Space"] = 32] = "Space";
        KeyCode_[KeyCode_["Left"] = 37] = "Left";
        KeyCode_[KeyCode_["Up"] = 38] = "Up";
        KeyCode_[KeyCode_["Right"] = 39] = "Right";
        KeyCode_[KeyCode_["Down"] = 40] = "Down";
        KeyCode_[KeyCode_["Esc"] = 27] = "Esc";
    })(KeyCode_ = exports.KeyCode_ || (exports.KeyCode_ = {}));
    var ListenerType_;
    (function (ListenerType_) {
        ListenerType_["MouseDown"] = "mousedown";
        ListenerType_["Focus"] = "focus";
        ListenerType_["FocusIn"] = "focusin";
        ListenerType_["Blur"] = "blur";
        ListenerType_["KeyDown"] = "keydown";
        ListenerType_["KeyUp"] = "keyup";
        ListenerType_["KeyPress"] = "keypress";
        ListenerType_["TouchStart"] = "touchstart";
        ListenerType_["TouchMove"] = "touchmove";
        ListenerType_["AnimationEnd"] = "animationend";
    })(ListenerType_ = exports.ListenerType_ || (exports.ListenerType_ = {}));
    class Helper_ {
        static resetTime_(date) {
            if (!date) {
                return null;
            }
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        }
        static normalizeDate_(parameterName, value, isNullable, options) {
            if (!value) {
                if (!isNullable) {
                    throw new Error(parameterName + ' cannot be empty.');
                }
                return null;
            }
            if (value instanceof Day_2.default) {
                return value.getDate();
            }
            if (typeof value === 'string') {
                value = value.trim ? value.trim() : value;
                if (value === 'today' || value === 'now') {
                    return options.getToday();
                }
                if (value === 'tomorrow') {
                    const date = options.getToday();
                    date.setDate(date.getDate() + 1);
                    return date;
                }
                if (value === 'yesterday') {
                    const date = options.getToday();
                    date.setDate(date.getDate() - 1);
                    return date;
                }
                let date = options.getToday();
                let parsedValue = value;
                const matches = value.match(new RegExp('^\\s*([0-9]+)\.?\\s*(' + Helper_.months_.join('|') + ')\\s*', 'i'));
                if (matches) {
                    const day = parseInt(matches[1], 10);
                    let month;
                    for (month = 0; month < Helper_.months_.length; month++) {
                        if (matches[2].toLowerCase() === Helper_.months_[month]) {
                            date.setMonth(month);
                            date.setDate(day);
                            break;
                        }
                    }
                    parsedValue = parsedValue.substring(matches[0].length);
                }
                let sumPositive = true;
                while (parsedValue) {
                    const matches = parsedValue.match(/^\s*([+-]?)\s*([0-9]+)\s*(day|week|month|year)s?\s*/i);
                    if (!matches) {
                        break;
                    }
                    switch (matches[1]) {
                        case '+':
                            sumPositive = true;
                            break;
                        case '-':
                            sumPositive = false;
                    }
                    const amount = parseInt(matches[2], 10) * (sumPositive ? 1 : -1);
                    switch (matches[3].toLowerCase()) {
                        case 'day':
                        case 'days':
                            date.setDate(date.getDate() + amount);
                            break;
                        case 'week':
                        case 'weeks':
                            date.setDate(date.getDate() + amount * 7);
                            break;
                        case 'month':
                        case 'months':
                            date.setMonth(date.getMonth() + amount);
                            break;
                        case 'year':
                        case 'years':
                            date.setFullYear(date.getFullYear() + amount);
                    }
                    parsedValue = parsedValue.substring(matches[0].length);
                    if (!parsedValue) {
                        return date;
                    }
                }
                date = Helper_.resetTime_(new Date(value));
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            else if (Helper_.isValidDate_(value)) {
                const date = Helper_.resetTime_(new Date(value.getTime()));
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            throw new Error(parameterName
                + ' was expected to be a valid Date string or valid Date or TheDatepicker.Day'
                + (isNullable ? ' or null.' : '.'));
        }
        static isElement_(element) {
            return typeof element === 'object'
                && element.nodeType === 1
                && typeof element.style === 'object'
                && typeof element.ownerDocument === 'object';
        }
        static isValidDate_(value) {
            return typeof value === 'object'
                && Object.prototype.toString.call(value) === '[object Date]'
                && !isNaN(value.getTime());
        }
        static inArray_(list, item) {
            for (let index = 0; index < list.length; index++) {
                if (list[index] === item) {
                    return true;
                }
            }
            return false;
        }
        static addEventListener_(element, listenerType, listener, isPassive = false) {
            if (element.addEventListener) {
                let options;
                if (isPassive && Helper_.isPassiveEventListenerSupported_()) {
                    options = {
                        passive: true,
                    };
                }
                element.addEventListener(listenerType, listener, options);
                return () => {
                    element.removeEventListener(listenerType, listener);
                };
            }
            const listenerProperty = 'on' + listenerType;
            const originalListener = element[listenerProperty] || null;
            element[listenerProperty] = (event) => {
                event = event || window.event;
                if (originalListener) {
                    originalListener.call(element, event);
                }
                listener(event);
            };
            return () => {
                element[listenerProperty] = originalListener;
            };
        }
        static preventDefault_(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
        }
        static stopPropagation_(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            else {
                event.cancelBubble = true;
            }
        }
        static checkString_(parameterName, value, checkNonEmpty = false) {
            if (!checkNonEmpty && !value) {
                return '';
            }
            if (typeof value !== 'string' || (checkNonEmpty && value === '')) {
                throw new Error(parameterName + ' was expected to be a' + (checkNonEmpty ? ' non empty' : '') + ' string.');
            }
            return value;
        }
        static checkNumber_(parameterName, value, min = null, max = null) {
            value = typeof value === 'string' ? parseInt(value, 10) : value;
            if (typeof value !== 'number' || isNaN(value) || (min !== null && value < min) || (max !== null && value > max)) {
                throw new Error(parameterName + ' was expected to be a valid number' + (min !== null ? ' from ' + min : '') + (max !== null ? ' to ' + max : '') + '.');
            }
            return value;
        }
        static checkFunction_(parameterName, value, isNullable = true) {
            if (isNullable && !value) {
                return null;
            }
            if (typeof value !== 'function') {
                throw new Error(parameterName + ' was expected to be a function' + (isNullable ? ' or null' : '') + '.');
            }
            return value;
        }
        static warnDeprecatedUsage_(deprecatedMethod, alternateMethods) {
            if (!window.console) {
                return;
            }
            for (let index = 0; index < Helper_.deprecatedMethods_.length; index++) {
                if (deprecatedMethod === Helper_.deprecatedMethods_[0]) {
                    return;
                }
            }
            for (let index = 0; index < alternateMethods.length; index++) {
                alternateMethods[index] += '()';
            }
            window.console.warn('TheDatepicker: ' + deprecatedMethod + '() is deprecated, use ' + alternateMethods.join(' or '));
            Helper_.deprecatedMethods_.push(deprecatedMethod);
        }
        static addSwipeListener_(element, listener) {
            let startPosition = null;
            let minDistance;
            Helper_.addEventListener_(element, ListenerType_.TouchStart, (event) => {
                startPosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                };
                minDistance = {
                    x: element.offsetWidth / 5,
                    y: element.offsetHeight / 5,
                };
            }, true);
            Helper_.addEventListener_(element, ListenerType_.TouchMove, (event) => {
                if (!startPosition) {
                    return;
                }
                const diffX = event.touches[0].clientX - startPosition.x;
                const diffY = event.touches[0].clientY - startPosition.y;
                let moveDirection = null;
                if (Math.abs(diffX) > minDistance.x) {
                    moveDirection = diffX > 0 ? ViewModel_3.MoveDirection_.Right : ViewModel_3.MoveDirection_.Left;
                }
                else if (Math.abs(diffY) > minDistance.x) {
                    moveDirection = diffY > 0 ? ViewModel_3.MoveDirection_.Down : ViewModel_3.MoveDirection_.Up;
                }
                if (moveDirection) {
                    listener(event, moveDirection);
                    startPosition = null;
                }
            }, true);
        }
        static isCssAnimationSupported_() {
            if (Helper_.cssAnimationSupport_ === null) {
                const fakeElement = document.createElement('div');
                Helper_.cssAnimationSupport_ = fakeElement.style.animationName === '';
            }
            return Helper_.cssAnimationSupport_;
        }
        static isPassiveEventListenerSupported_() {
            if (Helper_.passiveEventListenerSupport_ === null) {
                let isSupported = false;
                try {
                    const options = Object.defineProperty({}, 'passive', {
                        get: function () {
                            isSupported = true;
                            return false;
                        }
                    });
                    window.addEventListener('test', null, options);
                    window.removeEventListener('test', null, options);
                }
                catch (error) { }
                Helper_.passiveEventListenerSupport_ = isSupported;
            }
            return Helper_.passiveEventListenerSupport_;
        }
        static isMobile_() {
            const matchMedia = window.matchMedia || window.msMatchMedia;
            const mediaQuery = 'only all and (max-width: 37.5em)';
            if (!matchMedia) {
                return false;
            }
            const result = matchMedia(mediaQuery);
            if (!result) {
                return false;
            }
            return !!result.matches;
        }
    }
    exports.default = Helper_;
    Helper_.months_ = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
    ];
    Helper_.deprecatedMethods_ = [];
    Helper_.cssAnimationSupport_ = null;
    Helper_.passiveEventListenerSupport_ = null;
});
define("ClassNames", ["require", "exports", "Helper"], function (require, exports, Helper_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassNameType = void 0;
    var ClassNameType;
    (function (ClassNameType) {
        ClassNameType[ClassNameType["Container"] = 0] = "Container";
        ClassNameType[ClassNameType["ContainerOver"] = 1] = "ContainerOver";
        ClassNameType[ClassNameType["ContainerLeft"] = 2] = "ContainerLeft";
        ClassNameType[ClassNameType["ContainerResponsive"] = 3] = "ContainerResponsive";
        ClassNameType[ClassNameType["Main"] = 4] = "Main";
        ClassNameType[ClassNameType["Body"] = 5] = "Body";
        ClassNameType[ClassNameType["BodySwipeable"] = 6] = "BodySwipeable";
        ClassNameType[ClassNameType["Tables"] = 7] = "Tables";
        ClassNameType[ClassNameType["Header"] = 8] = "Header";
        ClassNameType[ClassNameType["HeaderTop"] = 9] = "HeaderTop";
        ClassNameType[ClassNameType["HeaderControl"] = 10] = "HeaderControl";
        ClassNameType[ClassNameType["HeaderNavigation"] = 11] = "HeaderNavigation";
        ClassNameType[ClassNameType["HeaderState"] = 12] = "HeaderState";
        ClassNameType[ClassNameType["HeaderMonth"] = 13] = "HeaderMonth";
        ClassNameType[ClassNameType["HeaderYear"] = 14] = "HeaderYear";
        ClassNameType[ClassNameType["HeaderMonthYear"] = 15] = "HeaderMonthYear";
        ClassNameType[ClassNameType["HeaderYearsToggle"] = 16] = "HeaderYearsToggle";
        ClassNameType[ClassNameType["Button"] = 17] = "Button";
        ClassNameType[ClassNameType["ButtonContent"] = 18] = "ButtonContent";
        ClassNameType[ClassNameType["SelectInput"] = 19] = "SelectInput";
        ClassNameType[ClassNameType["Deselect"] = 20] = "Deselect";
        ClassNameType[ClassNameType["DeselectButton"] = 21] = "DeselectButton";
        ClassNameType[ClassNameType["HeaderTitle"] = 22] = "HeaderTitle";
        ClassNameType[ClassNameType["HeaderTitleContent"] = 23] = "HeaderTitleContent";
        ClassNameType[ClassNameType["Reset"] = 24] = "Reset";
        ClassNameType[ClassNameType["Close"] = 25] = "Close";
        ClassNameType[ClassNameType["Go"] = 26] = "Go";
        ClassNameType[ClassNameType["GoNext"] = 27] = "GoNext";
        ClassNameType[ClassNameType["GoPrevious"] = 28] = "GoPrevious";
        ClassNameType[ClassNameType["Table"] = 29] = "Table";
        ClassNameType[ClassNameType["TableRow"] = 30] = "TableRow";
        ClassNameType[ClassNameType["TableCell"] = 31] = "TableCell";
        ClassNameType[ClassNameType["TableCellUnavailable"] = 32] = "TableCellUnavailable";
        ClassNameType[ClassNameType["TableCellHighlighted"] = 33] = "TableCellHighlighted";
        ClassNameType[ClassNameType["TableCellSelected"] = 34] = "TableCellSelected";
        ClassNameType[ClassNameType["CalendarTable"] = 35] = "CalendarTable";
        ClassNameType[ClassNameType["CalendarTableHeader"] = 36] = "CalendarTableHeader";
        ClassNameType[ClassNameType["CalendarTableHeaderCell"] = 37] = "CalendarTableHeaderCell";
        ClassNameType[ClassNameType["CalendarTableBody"] = 38] = "CalendarTableBody";
        ClassNameType[ClassNameType["YearsTable"] = 39] = "YearsTable";
        ClassNameType[ClassNameType["YearsTableBody"] = 40] = "YearsTableBody";
        ClassNameType[ClassNameType["WeekDayWeekend"] = 41] = "WeekDayWeekend";
        ClassNameType[ClassNameType["Day"] = 42] = "Day";
        ClassNameType[ClassNameType["DayToday"] = 43] = "DayToday";
        ClassNameType[ClassNameType["DayPast"] = 44] = "DayPast";
        ClassNameType[ClassNameType["DayWeekend"] = 45] = "DayWeekend";
        ClassNameType[ClassNameType["DayUnavailable"] = 46] = "DayUnavailable";
        ClassNameType[ClassNameType["DayOutside"] = 47] = "DayOutside";
        ClassNameType[ClassNameType["DayHighlighted"] = 48] = "DayHighlighted";
        ClassNameType[ClassNameType["DaySelected"] = 49] = "DaySelected";
        ClassNameType[ClassNameType["DayButton"] = 50] = "DayButton";
        ClassNameType[ClassNameType["DayButtonContent"] = 51] = "DayButtonContent";
        ClassNameType[ClassNameType["YearCellButton"] = 52] = "YearCellButton";
        ClassNameType[ClassNameType["YearCellButtonContent"] = 53] = "YearCellButtonContent";
        ClassNameType[ClassNameType["Animated"] = 54] = "Animated";
        ClassNameType[ClassNameType["AnimateFadeOutLeft"] = 55] = "AnimateFadeOutLeft";
        ClassNameType[ClassNameType["AnimateFadeInRight"] = 56] = "AnimateFadeInRight";
        ClassNameType[ClassNameType["AnimateFadeOutUp"] = 57] = "AnimateFadeOutUp";
        ClassNameType[ClassNameType["AnimateFadeInDown"] = 58] = "AnimateFadeInDown";
        ClassNameType[ClassNameType["AnimateFadeOutRight"] = 59] = "AnimateFadeOutRight";
        ClassNameType[ClassNameType["AnimateFadeInLeft"] = 60] = "AnimateFadeInLeft";
        ClassNameType[ClassNameType["AnimateFadeOutDown"] = 61] = "AnimateFadeOutDown";
        ClassNameType[ClassNameType["AnimateFadeInUp"] = 62] = "AnimateFadeInUp";
        ClassNameType[ClassNameType["ContainerDarkMode"] = 63] = "ContainerDarkMode";
    })(ClassNameType = exports.ClassNameType || (exports.ClassNameType = {}));
    class ClassNames {
        constructor() {
            this.classNames_ = [
                ['container'],
                ['container--over'],
                ['container--left'],
                ['container--responsive'],
                ['main'],
                ['body'],
                ['body--swipeable'],
                ['tables'],
                ['header'],
                ['top'],
                ['control'],
                ['navigation'],
                ['state'],
                ['month'],
                ['year'],
                ['month-year'],
                ['year-button'],
                ['button'],
                ['button-content'],
                ['select'],
                ['deselect'],
                ['deselect-button'],
                ['title'],
                ['title-content'],
                ['reset'],
                ['close'],
                ['go'],
                ['go-next'],
                ['go-previous'],
                ['table'],
                ['row'],
                ['cell'],
                ['cell--unavailable'],
                ['cell--highlighted'],
                ['cell--selected'],
                ['calendar'],
                ['calendar-header'],
                ['week-day'],
                ['calendar-body'],
                ['years'],
                ['years-body'],
                ['week-day--weekend'],
                ['day'],
                ['day--today'],
                ['day--past'],
                ['day--weekend'],
                ['day--unavailable'],
                ['day--outside'],
                ['day--highlighted'],
                ['day--selected'],
                ['day--button'],
                ['day-content'],
                ['year-cell-button'],
                ['year-cell-content'],
                ['animated'],
                ['fade-out-left'],
                ['fade-in-right'],
                ['fade-out-up'],
                ['fade-in-down'],
                ['fade-out-right'],
                ['fade-in-left'],
                ['fade-out-down'],
                ['fade-in-up'],
                ['container--darkmode'],
            ];
        }
        clone() {
            const classNames = new ClassNames();
            let index;
            for (index = 0; index < this.classNames_.length; index++) {
                classNames.classNames_ = this.classNames_.slice(0);
            }
            return classNames;
        }
        setClassName(type, className) {
            this.classNames_[this.checkType_(type)] = this.normalizeClassName_(className);
        }
        addClassName(type, className) {
            this.classNames_[this.checkType_(type)].concat(this.normalizeClassName_(className));
        }
        getClassName(type) {
            return this.classNames_[type].slice(0);
        }
        checkType_(type) {
            return Helper_8.default.checkNumber_('Class name type', type, 0, this.classNames_.length - 1);
        }
        normalizeClassName_(className) {
            const parameterName = 'Class name';
            if (typeof className !== 'object' || className.constructor !== Array) {
                className = Helper_8.default.checkString_(parameterName, className).split(/\s+/);
            }
            const result = [];
            for (let index = 0; index < className.length; index++) {
                const name = Helper_8.default.checkString_(parameterName, className[index]);
                if (name) {
                    result.push(name);
                }
            }
            return result;
        }
    }
    exports.default = ClassNames;
});
