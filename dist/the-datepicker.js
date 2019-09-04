var TheDatepicker;
(function (TheDatepicker) {
    var DayOfWeek;
    (function (DayOfWeek) {
        DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
        DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
        DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
        DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
        DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
        DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
        DayOfWeek[DayOfWeek["Sunday"] = 0] = "Sunday";
    })(DayOfWeek = TheDatepicker.DayOfWeek || (TheDatepicker.DayOfWeek = {}));
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
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
    })(Month = TheDatepicker.Month || (TheDatepicker.Month = {}));
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var Translator = (function () {
        function Translator() {
            this.dayOfWeekTranslations = [
                'Su',
                'Mo',
                'Tu',
                'We',
                'Th',
                'Fr',
                'Sa',
            ];
            this.monthTranslations = [
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
        }
        Translator.prototype.setDayOfWeekTranslation = function (dayOfWeek, translation) {
            switch (dayOfWeek) {
                case TheDatepicker.DayOfWeek.Monday:
                case TheDatepicker.DayOfWeek.Tuesday:
                case TheDatepicker.DayOfWeek.Wednesday:
                case TheDatepicker.DayOfWeek.Thursday:
                case TheDatepicker.DayOfWeek.Friday:
                case TheDatepicker.DayOfWeek.Saturday:
                case TheDatepicker.DayOfWeek.Sunday:
                    this.dayOfWeekTranslations[dayOfWeek] = translation;
                    break;
                default:
                    throw new Error('Day of week was expected to be TheDatepicker.DayOfWeek constant, but ' + dayOfWeek + ' given.');
            }
        };
        Translator.prototype.setMonthTranslation = function (month, translation) {
            switch (month) {
                case TheDatepicker.Month.January:
                case TheDatepicker.Month.February:
                case TheDatepicker.Month.March:
                case TheDatepicker.Month.April:
                case TheDatepicker.Month.May:
                case TheDatepicker.Month.June:
                case TheDatepicker.Month.July:
                case TheDatepicker.Month.August:
                case TheDatepicker.Month.September:
                case TheDatepicker.Month.October:
                case TheDatepicker.Month.November:
                case TheDatepicker.Month.December:
                    this.monthTranslations[month] = translation;
                    break;
                default:
                    throw new Error('Month was expected to be TheDatepicker.Month constant, but ' + month + ' given.');
            }
        };
        Translator.prototype.translateDayOfWeek = function (dayOfWeek) {
            return this.dayOfWeekTranslations[dayOfWeek];
        };
        Translator.prototype.translateMonth = function (month) {
            return this.monthTranslations[month];
        };
        return Translator;
    }());
    TheDatepicker.Translator = Translator;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var CannotParseDateException = (function () {
        function CannotParseDateException() {
        }
        return CannotParseDateException;
    }());
    TheDatepicker.CannotParseDateException = CannotParseDateException;
    var DateConverter = (function () {
        function DateConverter(translator) {
            this.escapeChar = '\\';
            this.translator = translator;
        }
        DateConverter.prototype.formatDate = function (format, date) {
            var escapeNext = false;
            var result = '';
            for (var position = 0; position < format.length; position++) {
                var char = format.substring(position, position + 1);
                if (escapeNext) {
                    result += char;
                    escapeNext = false;
                    continue;
                }
                if (char === this.escapeChar) {
                    escapeNext = true;
                    continue;
                }
                var formatter = this.getFormatter(char);
                if (formatter !== null) {
                    result += formatter.call(this, date);
                    continue;
                }
                result += char;
            }
            return result;
        };
        DateConverter.prototype.parseDate = function (format, text) {
            if (text === '') {
                return null;
            }
            var date = new Date();
            var escapeNext = false;
            var textPosition = 0;
            for (var position = 0; position < format.length; position++) {
                var char = format.substring(position, position + 1);
                if (escapeNext) {
                    escapeNext = false;
                }
                else if (char === this.escapeChar) {
                    escapeNext = true;
                    continue;
                }
                else {
                    var parser = this.getParser(char);
                    if (parser !== null) {
                        try {
                            textPosition += parser.call(this, text.substring(textPosition), date);
                        }
                        catch (error) {
                            if (!(error instanceof CannotParseDateException)) {
                                throw error;
                            }
                            var textChar_1 = text.substring(textPosition, textPosition + 1);
                            if (textChar_1 === ' ') {
                                textPosition++;
                                position--;
                                continue;
                            }
                            else {
                                throw error;
                            }
                        }
                        if (isNaN(date.getTime())) {
                            throw new CannotParseDateException();
                        }
                        continue;
                    }
                }
                var textChar = text.substring(textPosition, textPosition + 1);
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
            return date;
        };
        DateConverter.prototype.getFormatter = function (type) {
            switch (type) {
                case 'j':
                    return this.formatDay;
                case 'd':
                    return this.formatDayWithLeadingZero;
                case 'D':
                    return this.formatDayOfWeekTextual;
                case 'n':
                    return this.formatMonth;
                case 'm':
                    return this.formatMonthWithLeadingZero;
                case 'F':
                    return this.formatMonthTextual;
                case 'Y':
                    return this.formatYear;
                case 'y':
                    return this.formatYearTwoDigits;
                default:
                    return null;
            }
        };
        DateConverter.prototype.formatDay = function (date) {
            return date.getDate().toString();
        };
        DateConverter.prototype.formatDayWithLeadingZero = function (date) {
            var day = date.getDate().toString();
            if (day.length === 1) {
                day = '0' + day;
            }
            return day;
        };
        DateConverter.prototype.formatDayOfWeekTextual = function (date) {
            return this.translator.translateDayOfWeek(date.getDay());
        };
        DateConverter.prototype.formatMonth = function (date) {
            return (date.getMonth() + 1).toString();
        };
        DateConverter.prototype.formatMonthWithLeadingZero = function (date) {
            var month = (date.getMonth() + 1).toString();
            if (month.length === 1) {
                month = '0' + month;
            }
            return month;
        };
        DateConverter.prototype.formatMonthTextual = function (date) {
            return this.translator.translateMonth(date.getMonth());
        };
        DateConverter.prototype.formatYear = function (date) {
            return date.getFullYear().toString();
        };
        DateConverter.prototype.formatYearTwoDigits = function (date) {
            var year = date.getFullYear().toString();
            return year.substring(year.length - 2);
        };
        DateConverter.prototype.getParser = function (type) {
            switch (type) {
                case 'j':
                case 'd':
                    return this.parseDay;
                case 'D':
                    return this.parseDayOfWeekTextual;
                case 'n':
                case 'm':
                    return this.parseMonth;
                case 'F':
                    return this.parseMonthTextual;
                case 'Y':
                    return this.parseYear;
                case 'y':
                    return this.parseYearTwoDigits;
                default:
                    return null;
            }
        };
        DateConverter.prototype.parseDay = function (text, date) {
            var took = 0;
            while (text.substring(0, 1) === '0') {
                text = text.substring(1);
                took++;
            }
            var day = text.substring(0, 2);
            if (!/[12][0-9]|3[01]/.test(day)) {
                day = day.substring(0, 1);
                if (!/[1-9]/.test(day)) {
                    throw new CannotParseDateException();
                }
            }
            date.setDate(parseInt(day, 10));
            return took + day.length;
        };
        DateConverter.prototype.parseDayOfWeekTextual = function (text, date) {
            var maxLength = 0;
            for (var index = 0; index < this.translator.dayOfWeekTranslations.length; index++) {
                var translation = this.translator.dayOfWeekTranslations[index];
                maxLength = Math.max(maxLength, translation.length);
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()) {
                    return translation.length;
                }
            }
            var took = 0;
            while (/[a-zA-Z]/.test(text.substring(0, 1))) {
                text = text.substring(1);
                took++;
                if (took === maxLength) {
                    break;
                }
            }
            return took;
        };
        DateConverter.prototype.parseMonth = function (text, date) {
            var took = 0;
            while (text.substring(0, 1) === '0') {
                text = text.substring(1);
                took++;
            }
            var month = text.substring(0, 2);
            if (month !== '10' && month !== '11' && month !== '12') {
                month = month.substring(0, 1);
                if (!/[1-9]/.test(month)) {
                    throw new CannotParseDateException();
                }
            }
            date.setMonth(parseInt(month, 10) - 1);
            return took + month.length;
        };
        DateConverter.prototype.parseMonthTextual = function (text, date) {
            for (var index = 0; index < this.translator.monthTranslations.length; index++) {
                var translation = this.translator.monthTranslations[index];
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()) {
                    date.setMonth(index);
                    return translation.length;
                }
            }
            throw new CannotParseDateException();
        };
        DateConverter.prototype.parseYear = function (text, date) {
            var isNegative = false;
            if (text.substring(0, 1) === '-') {
                isNegative = true;
                text = text.substring(1);
            }
            var yearLength = 0;
            while (/[0-9]/.test(text.substring(yearLength, yearLength + 1))) {
                yearLength++;
            }
            if (yearLength === 0) {
                throw new CannotParseDateException();
            }
            var year = parseInt(text.substring(0, yearLength), 10);
            if (isNegative) {
                year = -year;
            }
            date.setFullYear(year);
            return yearLength + (isNegative ? 1 : 0);
        };
        DateConverter.prototype.parseYearTwoDigits = function (text, date) {
            var yearEnd = text.substring(0, 2);
            if (!/[0-9]{2}/.test(yearEnd)) {
                throw new CannotParseDateException();
            }
            var currentYear = (new Date()).getFullYear().toString();
            var yearBeginning = currentYear.substring(0, currentYear.length - 2);
            date.setFullYear(parseInt(yearBeginning + yearEnd, 10));
            return 2;
        };
        return DateConverter;
    }());
    TheDatepicker.DateConverter = DateConverter;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var InitializationPhase;
    (function (InitializationPhase) {
        InitializationPhase[InitializationPhase["Untouched"] = 0] = "Untouched";
        InitializationPhase[InitializationPhase["Waiting"] = 1] = "Waiting";
        InitializationPhase[InitializationPhase["Ready"] = 2] = "Ready";
        InitializationPhase[InitializationPhase["Initialized"] = 3] = "Initialized";
    })(InitializationPhase || (InitializationPhase = {}));
    var Datepicker = (function () {
        function Datepicker(input, container) {
            if (container === void 0) { container = null; }
            this.initializationPhase = InitializationPhase.Untouched;
            this.originalInputOnFocus = null;
            if (input !== null && !TheDatepicker.Helper.isElement(input)) {
                throw new Error('Input was expected to be null or an HTMLElement.');
            }
            if (container !== null && !TheDatepicker.Helper.isElement(container)) {
                throw new Error('Container was expected to be null or an HTMLElement.');
            }
            if (input === null && container === null) {
                throw new Error('At least one of input or container is mandatory.');
            }
            this.document = document;
            if (container === null) {
                container = this.createContainer();
                if (input !== null) {
                    input.parentNode.insertBefore(container, input.nextSibling);
                }
            }
            if (input !== null) {
                input.datepicker = this;
                input.autocomplete = 'off';
            }
            container.datepicker = this;
            this.input = input;
            this.container = container;
            this.setOptions(new TheDatepicker.Options());
            this.setDateConverter(new TheDatepicker.DateConverter(this.options.getTranslator()));
            this.viewModel = new TheDatepicker.ViewModel(this.options, this);
        }
        Datepicker.prototype.setOptions = function (options) {
            if (!(options instanceof TheDatepicker.Options)) {
                throw new Error('Options was expected to be an instance of Options, but ' + options + ' given.');
            }
            this.options = options;
        };
        Datepicker.prototype.setDateConverter = function (dateConverter) {
            if (typeof dateConverter !== 'object' || typeof dateConverter.formatDate !== 'function' || typeof dateConverter.parseDate !== 'function') {
                throw new Error('Date converter was expected to be an instance of DateConverterInterface, but ' + dateConverter + ' given.');
            }
            this.dateConverter = dateConverter;
        };
        Datepicker.prototype.render = function () {
            switch (this.initializationPhase) {
                case InitializationPhase.Initialized:
                    this.viewModel.render();
                    return;
                case InitializationPhase.Ready:
                    this.initListeners();
                    this.initializationPhase = InitializationPhase.Initialized;
                    this.render();
                    return;
                case InitializationPhase.Waiting:
                    var selectedDate = this.viewModel.getSelectedDate();
                    if (selectedDate !== null && (!this.options.isDateInValidity(selectedDate) || !this.options.isDateAvailable(selectedDate))) {
                        this.viewModel.cancelSelection(null);
                    }
                    else if (selectedDate == null && !this.options.isAllowedEmpty()) {
                        this.viewModel.selectDay(null, this.options.getInitialDate(), false);
                    }
                    return;
                case InitializationPhase.Untouched:
                    this.preselectFromInput();
                    this.viewModel.selectDay(null, this.options.getInitialDate(), false);
                    this.updateInput();
                    if (this.input !== null && this.options.isHiddenOnBlur()) {
                        if (this.input === this.document.activeElement) {
                            this.initializationPhase = InitializationPhase.Ready;
                            this.render();
                            this.open();
                            return;
                        }
                        this.prepareLazyLoad();
                        return;
                    }
                    this.initializationPhase = InitializationPhase.Ready;
                    this.render();
            }
        };
        Datepicker.prototype.open = function (event) {
            if (event === void 0) { event = null; }
            if (this.initializationPhase === InitializationPhase.Untouched) {
                this.render();
            }
            if (this.initializationPhase === InitializationPhase.Waiting) {
                this.initializationPhase = InitializationPhase.Ready;
                this.input.onfocus = this.originalInputOnFocus;
                this.render();
                Datepicker.hasClickedViewModel = true;
                return this.open();
            }
            if (!Datepicker.activateViewModel(event, this.viewModel)) {
                return false;
            }
            if (this.input !== null) {
                this.input.focus();
            }
            return true;
        };
        Datepicker.prototype.close = function (event) {
            if (event === void 0) { event = null; }
            if (!this.viewModel.isActive()) {
                return true;
            }
            if (!Datepicker.activateViewModel(event, null)) {
                return false;
            }
            if (this.input !== null) {
                this.input.blur();
            }
            return true;
        };
        Datepicker.prototype.readInput = function (event) {
            if (event === void 0) { event = null; }
            if (this.input === null) {
                return false;
            }
            try {
                var date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
                if (date !== null) {
                    return this.viewModel.selectDateSince(event, date);
                }
                return this.viewModel.selectDay(event, null);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.CannotParseDateException)) {
                    throw error;
                }
                return false;
            }
        };
        Datepicker.prototype.updateInput = function () {
            if (this.input === null || this.input === this.document.activeElement) {
                return;
            }
            var date = this.viewModel.getSelectedDate();
            this.input.value = date !== null
                ? this.dateConverter.formatDate(this.options.getInputFormat(), date)
                : '';
        };
        Datepicker.prototype.getContainer = function () {
            return this.container;
        };
        Datepicker.prototype.getInput = function () {
            return this.input;
        };
        Datepicker.prototype.selectDate = function (date, doUpdateMonth, event) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (event === void 0) { event = null; }
            try {
                return this.viewModel.selectDay(event, TheDatepicker.Helper.normalizeDate(date), doUpdateMonth);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.InvalidDateException)) {
                    throw error;
                }
                throw new Error('Date was expected to be a valid Date string or valid instance of Date or null, ' + date + ' given.');
            }
        };
        Datepicker.prototype.getSelectedDate = function () {
            return this.viewModel.getSelectedDate();
        };
        Datepicker.prototype.createContainer = function () {
            var container = this.document.createElement('div');
            container.style.position = 'absolute';
            container.style.zIndex = '99';
            return container;
        };
        Datepicker.prototype.preselectFromInput = function () {
            if (this.input !== null) {
                try {
                    var date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
                    if (date !== null) {
                        this.options.setInitialDate(date);
                    }
                }
                catch (error) {
                    if (!(error instanceof TheDatepicker.CannotParseDateException)) {
                        throw error;
                    }
                }
            }
        };
        Datepicker.prototype.prepareLazyLoad = function () {
            var _this = this;
            this.originalInputOnFocus = this.input.onfocus || null;
            this.input.onfocus = function (event) {
                if (_this.originalInputOnFocus !== null) {
                    _this.originalInputOnFocus.call(_this.input, event);
                }
                _this.open(event);
            };
            this.initializationPhase = InitializationPhase.Waiting;
        };
        Datepicker.prototype.initListeners = function () {
            var _this = this;
            if (Datepicker.instances.length === 0) {
                var activeViewModel = null;
                var checkMiss = function (event) {
                    if (Datepicker.hasClickedViewModel) {
                        Datepicker.hasClickedViewModel = false;
                    }
                    else {
                        Datepicker.activateViewModel(event, null);
                    }
                };
                TheDatepicker.Helper.addEventListener(this.document, TheDatepicker.ListenerType.MouseDown, checkMiss);
                TheDatepicker.Helper.addEventListener(this.document, TheDatepicker.ListenerType.FocusIn, checkMiss);
                TheDatepicker.Helper.addEventListener(this.document, TheDatepicker.ListenerType.KeyDown, function (event) {
                    var target = event.target || event.srcElement;
                    if (target !== null && target === _this.input) {
                        return;
                    }
                    if (Datepicker.activeViewModel !== null) {
                        Datepicker.activeViewModel.triggerKeyPress(event, target);
                    }
                });
            }
            Datepicker.instances.push(this);
            var hit = function (event) {
                Datepicker.activateViewModel(event, _this.viewModel);
                Datepicker.hasClickedViewModel = true;
            };
            TheDatepicker.Helper.addEventListener(this.container, TheDatepicker.ListenerType.MouseDown, hit);
            TheDatepicker.Helper.addEventListener(this.container, TheDatepicker.ListenerType.FocusIn, hit);
            if (this.input !== null) {
                TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.MouseDown, hit);
                TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.Focus, hit);
                TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.Blur, function () {
                    _this.updateInput();
                });
                TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.KeyUp, function (event) {
                    _this.readInput(event);
                });
            }
        };
        Datepicker.activateViewModel = function (event, viewModel) {
            if (Datepicker.activeViewModel === viewModel) {
                return true;
            }
            if (Datepicker.activeViewModel !== null && !Datepicker.activeViewModel.setActive(event, false)) {
                return false;
            }
            if (viewModel === null) {
                Datepicker.activeViewModel = null;
                return true;
            }
            if (!viewModel.setActive(event, true)) {
                return false;
            }
            Datepicker.activeViewModel = viewModel;
            return true;
        };
        Datepicker.instances = [];
        Datepicker.activeViewModel = null;
        Datepicker.hasClickedViewModel = false;
        return Datepicker;
    }());
    TheDatepicker.Datepicker = Datepicker;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var Day = (function () {
        function Day(date) {
            this.isToday = false;
            this.isPast = false;
            this.isAvailable = true;
            this.isInValidity = true;
            this.isInCurrentMonth = true;
            this.isSelected = false;
            this.isHighlighted = false;
            this.isFocused = false;
            this.dayNumber = date.getDate();
            this.month = date.getMonth() + 1;
            this.year = date.getFullYear();
            this.dayOfWeek = date.getDay();
            this.isWeekend = this.dayOfWeek === TheDatepicker.DayOfWeek.Saturday || this.dayOfWeek === TheDatepicker.DayOfWeek.Sunday;
        }
        Day.prototype.getDate = function () {
            return new Date(this.year, this.month - 1, this.dayNumber, 0, 0, 0, 0);
        };
        Day.prototype.isEqualToDate = function (date) {
            return date !== null
                && this.dayNumber === date.getDate()
                && this.month === date.getMonth() + 1
                && this.year === date.getFullYear();
        };
        Day.prototype.isEqualToDay = function (day) {
            return day !== null
                && this.dayNumber === day.dayNumber
                && this.month === day.month
                && this.year === day.year;
        };
        return Day;
    }());
    TheDatepicker.Day = Day;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var KeyCode;
    (function (KeyCode) {
        KeyCode[KeyCode["Enter"] = 13] = "Enter";
        KeyCode[KeyCode["Space"] = 32] = "Space";
        KeyCode[KeyCode["Left"] = 37] = "Left";
        KeyCode[KeyCode["Up"] = 38] = "Up";
        KeyCode[KeyCode["Right"] = 39] = "Right";
        KeyCode[KeyCode["Down"] = 40] = "Down";
    })(KeyCode = TheDatepicker.KeyCode || (TheDatepicker.KeyCode = {}));
    var ListenerType;
    (function (ListenerType) {
        ListenerType["MouseDown"] = "mousedown";
        ListenerType["Focus"] = "focus";
        ListenerType["FocusIn"] = "focusin";
        ListenerType["Blur"] = "blur";
        ListenerType["KeyDown"] = "keydown";
        ListenerType["KeyUp"] = "keyup";
    })(ListenerType = TheDatepicker.ListenerType || (TheDatepicker.ListenerType = {}));
    var InvalidDateException = (function () {
        function InvalidDateException() {
        }
        return InvalidDateException;
    }());
    TheDatepicker.InvalidDateException = InvalidDateException;
    var Helper = (function () {
        function Helper() {
        }
        Helper.resetTime = function (date) {
            if (date === null) {
                return;
            }
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        };
        Helper.normalizeDate = function (value) {
            if (value === null) {
                return null;
            }
            if (typeof value === 'string') {
                var date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return Helper.resetTime(date);
                }
            }
            else if (Helper.isValidDate(value)) {
                return Helper.resetTime(new Date(value.getTime()));
            }
            throw new InvalidDateException();
        };
        Helper.isElement = function (element) {
            return typeof element === 'object'
                && element.nodeType === 1
                && typeof element.style === 'object'
                && typeof element.ownerDocument === 'object';
        };
        Helper.isValidDate = function (value) {
            return typeof value === 'object'
                && Object.prototype.toString.call(value) === '[object Date]'
                && !isNaN(value.getTime());
        };
        Helper.inArray = function (list, item) {
            for (var index = 0; index < list.length; index++) {
                if (list[index] === item) {
                    return true;
                }
            }
            return false;
        };
        Helper.addEventListener = function (element, listenerType, listener) {
            if (element.addEventListener) {
                element.addEventListener(listenerType, listener);
            }
            else {
                var listenerProperty = 'on' + listenerType;
                var originalListener_1 = element[listenerProperty] || null;
                element[listenerProperty] = function (event) {
                    if (originalListener_1 !== null) {
                        originalListener_1.call(element, event);
                    }
                    listener(event);
                };
            }
        };
        return Helper;
    }());
    TheDatepicker.Helper = Helper;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var HtmlHelper = (function () {
        function HtmlHelper() {
            this.classesPrefix = 'the-datepicker-';
            this.document = document;
        }
        HtmlHelper.prototype.setClassesPrefix = function (prefix) {
            if (typeof prefix !== 'string') {
                throw new Error('Classes prefix was expected to be a string, but ' + typeof prefix + ' given.');
            }
            this.classesPrefix = prefix;
        };
        HtmlHelper.prototype.createDiv = function (className) {
            var div = this.document.createElement('div');
            this.addClass(div, className);
            return div;
        };
        HtmlHelper.prototype.createAnchor = function (onClick) {
            var anchor = this.document.createElement('a');
            this.addClass(anchor, 'button');
            anchor.href = '#';
            anchor.onclick = function (event) {
                event.preventDefault();
                onClick(event);
            };
            anchor.onkeydown = function (event) {
                if (TheDatepicker.Helper.inArray([TheDatepicker.KeyCode.Enter, TheDatepicker.KeyCode.Space], event.keyCode)) {
                    event.preventDefault();
                    onClick(event);
                }
            };
            return anchor;
        };
        HtmlHelper.prototype.createSpan = function () {
            return this.document.createElement('span');
        };
        HtmlHelper.prototype.createTable = function (className, header, body) {
            var table = this.document.createElement('table');
            this.addClass(table, className);
            table.appendChild(header);
            table.appendChild(body);
            return table;
        };
        HtmlHelper.prototype.createTableHeader = function (className, cells) {
            var tableHeader = this.document.createElement('thead');
            this.addClass(tableHeader, className);
            var row = this.document.createElement('tr');
            for (var index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            tableHeader.appendChild(row);
            return tableHeader;
        };
        HtmlHelper.prototype.createTableHeaderCell = function (className) {
            var cell = this.document.createElement('th');
            this.addClass(cell, className);
            return cell;
        };
        HtmlHelper.prototype.createTableBody = function (className, rows) {
            var tableBody = this.document.createElement('tbody');
            this.addClass(tableBody, className);
            for (var index = 0; index < rows.length; index++) {
                tableBody.appendChild(rows[index]);
            }
            return tableBody;
        };
        HtmlHelper.prototype.createTableRow = function (className, cells) {
            var row = this.document.createElement('tr');
            for (var index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            return row;
        };
        HtmlHelper.prototype.createTableCell = function (className) {
            var cell = this.document.createElement('td');
            this.addClass(cell, className);
            return cell;
        };
        HtmlHelper.prototype.createSelectInput = function (options, onChange) {
            var input = this.document.createElement('select');
            this.addClass(input, 'select');
            for (var index = 0; index < options.length; index++) {
                var option = this.document.createElement('option');
                option.value = options[index].value.toString();
                option.innerText = options[index].label;
                input.appendChild(option);
            }
            input.onchange = function (event) {
                onChange(event, parseInt(input.value, 10));
            };
            input.onkeydown = function (event) {
                event.stopPropagation();
            };
            return input;
        };
        HtmlHelper.prototype.addClass = function (element, className) {
            this.toggleClass(element, className, true);
        };
        HtmlHelper.prototype.removeClass = function (element, className) {
            this.toggleClass(element, className, false);
        };
        HtmlHelper.prototype.toggleClass = function (element, className, doAdd) {
            if (!/^[a-zA-Z0-9_-]+$/.test(className)) {
                throw new Error('Invalid class name: ' + className);
            }
            className = this.classesPrefix + className;
            var wasFound = false;
            var classes = element.className.split(/\s+/);
            for (var index = 0; index < classes.length; index++) {
                if (classes[index] === '') {
                    classes.splice(index, 1);
                }
                if (classes[index] === className) {
                    if (doAdd) {
                        return;
                    }
                    else {
                        classes.splice(index, 1);
                        wasFound = true;
                    }
                }
            }
            if (doAdd) {
                classes.push(className);
            }
            else if (!wasFound) {
                return;
            }
            element.className = classes.join(' ');
        };
        return HtmlHelper;
    }());
    TheDatepicker.HtmlHelper = HtmlHelper;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var MoveDirection;
    (function (MoveDirection) {
        MoveDirection[MoveDirection["Left"] = -1] = "Left";
        MoveDirection[MoveDirection["Up"] = -7] = "Up";
        MoveDirection[MoveDirection["Right"] = 1] = "Right";
        MoveDirection[MoveDirection["Down"] = 7] = "Down";
    })(MoveDirection = TheDatepicker.MoveDirection || (TheDatepicker.MoveDirection = {}));
    var ViewModel = (function () {
        function ViewModel(options, datepicker) {
            this.options = options;
            this.datepicker = datepicker;
            this.currentMonth = null;
            this.selectedDate = null;
            this.highlightedDay = null;
            this.isHighlightedDayFocused = false;
            this.active = false;
            this.today = TheDatepicker.Helper.resetTime(new Date());
        }
        ViewModel.prototype.render = function () {
            if (this.selectedDate !== null) {
                if (!this.options.isDateInValidity(this.selectedDate) || !this.options.isDateAvailable(this.selectedDate)) {
                    if (this.selectDay(null, null, false)) {
                        return;
                    }
                }
            }
            else if (!this.options.isAllowedEmpty()) {
                if (this.selectDay(null, this.options.getInitialDate(), false)) {
                    return;
                }
            }
            var correctMonth = this.options.correctMonth(this.getCurrentMonth());
            if (this.goToMonth(null, correctMonth)) {
                return;
            }
            this.options.getTemplate().render(this, this.datepicker);
            this.datepicker.updateInput();
        };
        ViewModel.prototype.setActive = function (event, value) {
            if (this.active === value) {
                return true;
            }
            if (!this.triggerOnBeforeSwitch(event, value)) {
                return false;
            }
            this.active = value;
            if (this.options.isHiddenOnBlur()) {
                this.render();
            }
            this.triggerOnSwitch(event, value);
            return true;
        };
        ViewModel.prototype.isActive = function () {
            return this.active;
        };
        ViewModel.prototype.getCurrentMonth = function () {
            if (this.currentMonth === null) {
                this.currentMonth = this.options.getInitialMonth();
            }
            return this.currentMonth;
        };
        ViewModel.prototype.canGoBack = function () {
            var newMonth = new Date(this.getCurrentMonth().getTime());
            newMonth.setMonth(newMonth.getMonth() - 1);
            return this.canGoToMonth(newMonth);
        };
        ViewModel.prototype.canGoForward = function () {
            var newMonth = new Date(this.getCurrentMonth().getTime());
            newMonth.setMonth(newMonth.getMonth() + 1);
            return this.canGoToMonth(newMonth);
        };
        ViewModel.prototype.canGoToMonth = function (month) {
            return this.options.isMonthInValidity(month);
        };
        ViewModel.prototype.goBack = function (event) {
            var newMonth = new Date(this.getCurrentMonth().getTime());
            newMonth.setMonth(newMonth.getMonth() - 1);
            return this.goToMonth(event, newMonth);
        };
        ViewModel.prototype.goForward = function (event) {
            var newMonth = new Date(this.getCurrentMonth().getTime());
            newMonth.setMonth(newMonth.getMonth() + 1);
            return this.goToMonth(event, newMonth);
        };
        ViewModel.prototype.goToMonth = function (event, month, doCancelHighlight) {
            if (doCancelHighlight === void 0) { doCancelHighlight = true; }
            month = TheDatepicker.Helper.resetTime(new Date(month.getTime()));
            month.setDate(1);
            if (month.getTime() === this.getCurrentMonth().getTime() || !this.canGoToMonth(month)) {
                return false;
            }
            if (!this.triggerOnBeforeGo(event, month, this.currentMonth)) {
                return false;
            }
            this.currentMonth = month;
            if (!doCancelHighlight || !this.cancelHighlight()) {
                this.render();
            }
            this.triggerOnGo(event, month, this.currentMonth);
            return true;
        };
        ViewModel.prototype.reset = function (event) {
            var isMonthChanged = this.goToMonth(event, this.options.getInitialMonth());
            var isDaySelected = this.selectDay(event, this.options.getInitialDate(), false);
            return isMonthChanged || isDaySelected;
        };
        ViewModel.prototype.selectDay = function (event, date, doUpdateMonth, doHighlight, canToggle) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (doHighlight === void 0) { doHighlight = false; }
            if (canToggle === void 0) { canToggle = false; }
            if (date === null) {
                return this.cancelSelection(event);
            }
            var day;
            if (date instanceof TheDatepicker.Day) {
                day = date;
                date = day.getDate();
            }
            else {
                day = this.createDay(date);
            }
            if (!day.isAvailable) {
                return false;
            }
            if (day.isEqualToDate(this.selectedDate)) {
                if (canToggle && this.options.hasToggleSelection()) {
                    return this.cancelSelection(event);
                }
                return false;
            }
            var previousDay = this.selectedDate !== null ? this.createDay(this.selectedDate) : null;
            if (!this.triggerOnBeforeSelect(event, day, previousDay)) {
                return false;
            }
            this.selectedDate = day.getDate();
            if (doHighlight) {
                this.highlightedDay = day;
                this.isHighlightedDayFocused = true;
            }
            if (!doUpdateMonth || !this.goToMonth(event, date)) {
                this.render();
            }
            this.triggerOnSelect(event, day, previousDay);
            return true;
        };
        ViewModel.prototype.selectDateSince = function (event, date) {
            var maxDate = this.options.getMaxDate();
            var maxLoops = 100;
            var day = this.createDay(date);
            date = day.getDate();
            while (!day.isAvailable && maxLoops > 0) {
                date.setDate(day.dayNumber + 1);
                if (maxDate !== null && date.getTime() > maxDate.getTime()) {
                    break;
                }
                day = this.createDay(date);
                maxLoops--;
            }
            return this.selectDay(event, date);
        };
        ViewModel.prototype.highlightDay = function (event, day, doUpdateMonth) {
            if (doUpdateMonth === void 0) { doUpdateMonth = false; }
            if (!day.isAvailable) {
                return false;
            }
            if (day.isEqualToDay(this.highlightedDay)) {
                return false;
            }
            this.highlightedDay = day;
            this.isHighlightedDayFocused = true;
            var date = day.getDate();
            if (!doUpdateMonth || !this.goToMonth(event, date, false)) {
                this.render();
            }
            return true;
        };
        ViewModel.prototype.highlightFirstAvailableDay = function (event) {
            var date = new Date(this.getCurrentMonth().getTime());
            var maxDate = this.options.getMaxDate();
            var day = this.createDay(date);
            while (!day.isAvailable) {
                date.setDate(day.dayNumber + 1);
                if (date.getDate() === 1) {
                    break;
                }
                if (maxDate !== null && date.getTime() > maxDate.getTime()) {
                    break;
                }
                day = this.createDay(date);
            }
            return this.highlightDay(event, day);
        };
        ViewModel.prototype.highlightSiblingDay = function (event, day, direction) {
            var newDay = day;
            var date = newDay.getDate();
            var maxLoops = 100;
            do {
                date.setDate(newDay.dayNumber + direction);
                newDay = this.createDay(date);
                if (!newDay.isInValidity) {
                    break;
                }
                maxLoops--;
            } while (!newDay.isAvailable && maxLoops > 0);
            return this.highlightDay(event, newDay, true);
        };
        ViewModel.prototype.cancelSelection = function (event) {
            if (!this.options.isAllowedEmpty()) {
                return false;
            }
            if (this.selectedDate === null) {
                return false;
            }
            var previousDay = this.createDay(this.selectedDate);
            if (!this.triggerOnBeforeSelect(event, null, previousDay)) {
                return false;
            }
            this.selectedDate = null;
            this.render();
            this.triggerOnSelect(event, null, previousDay);
            return true;
        };
        ViewModel.prototype.cancelHighlight = function () {
            if (this.highlightedDay === null) {
                return false;
            }
            this.highlightedDay = null;
            this.render();
            return true;
        };
        ViewModel.prototype.getWeekDays = function () {
            var weekDays = [];
            for (var day = 0; day < 7; day++) {
                weekDays.push((this.options.getFirstDayOfWeek() + day) % 7);
            }
            return weekDays;
        };
        ViewModel.prototype.getWeeks = function () {
            var date;
            var days = [];
            var currentMonth = this.getCurrentMonth();
            var firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            var lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
            var prependDaysCount = (firstDateOfMonth.getDay() - this.options.getFirstDayOfWeek() + 7) % 7;
            for (date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
                var day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
                day.isInCurrentMonth = false;
                days.push(day);
            }
            var lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            var monthDaysCount = lastDateOfMonth.getDate();
            for (date = 1; date <= monthDaysCount; date++) {
                days.push(this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
            }
            var appendDaysCount = 6 - ((lastDateOfMonth.getDay() - this.options.getFirstDayOfWeek() + 7) % 7);
            for (date = 1; date <= appendDaysCount; date++) {
                var day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
                day.isInCurrentMonth = false;
                days.push(day);
            }
            if (this.options.hasFixedRowsCount()) {
                for (var date_1 = appendDaysCount + 1; days.length < 6 * 7; date_1++) {
                    var day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date_1));
                    day.isInCurrentMonth = false;
                    days.push(day);
                }
            }
            var weeks = [];
            for (var i = 0; i < days.length; i += 7) {
                weeks.push(days.slice(i, i + 7));
            }
            return weeks;
        };
        ViewModel.prototype.getSelectedDate = function () {
            return this.selectedDate;
        };
        ViewModel.prototype.triggerKeyPress = function (event, target) {
            if (TheDatepicker.Helper.inArray([TheDatepicker.KeyCode.Left, TheDatepicker.KeyCode.Up, TheDatepicker.KeyCode.Right, TheDatepicker.KeyCode.Down], event.keyCode)) {
                event.preventDefault();
                if (this.highlightedDay !== null) {
                    this.highlightSiblingDay(event, this.highlightedDay, this.translateKeyCodeToMoveDirection(event.keyCode));
                }
                else if (this.selectedDate !== null
                    && this.selectedDate.getFullYear() === this.getCurrentMonth().getFullYear()
                    && this.selectedDate.getMonth() === this.getCurrentMonth().getMonth()) {
                    this.highlightSiblingDay(event, this.createDay(this.selectedDate), this.translateKeyCodeToMoveDirection(event.keyCode));
                }
                else {
                    this.highlightFirstAvailableDay(event);
                }
            }
        };
        ViewModel.prototype.triggerOnBeforeSelect = function (event, day, previousDay) {
            return this.options.triggerEvent(TheDatepicker.EventType.BeforeSelect, function (listener) {
                return listener.call(day, event, day, previousDay);
            });
        };
        ViewModel.prototype.triggerOnSelect = function (event, day, previousDay) {
            this.options.triggerEvent(TheDatepicker.EventType.Select, function (listener) {
                return listener.call(day, event, day, previousDay);
            });
        };
        ViewModel.prototype.triggerOnBeforeSwitch = function (event, isOpening) {
            var _this = this;
            return this.options.triggerEvent(TheDatepicker.EventType.BeforeSwitch, function (listener) {
                return listener.call(_this.datepicker, event, isOpening);
            });
        };
        ViewModel.prototype.triggerOnSwitch = function (event, isOpening) {
            var _this = this;
            this.options.triggerEvent(TheDatepicker.EventType.Switch, function (listener) {
                return listener.call(_this.datepicker, event, isOpening);
            });
        };
        ViewModel.prototype.triggerOnBeforeGo = function (event, month, previousMonth) {
            return this.options.triggerEvent(TheDatepicker.EventType.BeforeGo, function (listener) {
                return listener.call(month, event, month, previousMonth);
            });
        };
        ViewModel.prototype.triggerOnGo = function (event, month, previousMonth) {
            this.options.triggerEvent(TheDatepicker.EventType.Go, function (listener) {
                return listener.call(month, event, month, previousMonth);
            });
        };
        ViewModel.prototype.createDay = function (date) {
            date = TheDatepicker.Helper.resetTime(new Date(date.getTime()));
            var day = new TheDatepicker.Day(date);
            day.isToday = date.getTime() === this.today.getTime();
            day.isPast = date.getTime() < this.today.getTime();
            day.isInValidity = this.options.isDateInValidity(date);
            day.isAvailable = day.isInValidity && this.options.isDateAvailable(date);
            if (day.isAvailable) {
                if (day.isEqualToDate(this.selectedDate)) {
                    day.isSelected = true;
                }
                if (day.isEqualToDay(this.highlightedDay)) {
                    day.isHighlighted = true;
                    if (this.isHighlightedDayFocused) {
                        day.isFocused = true;
                    }
                }
            }
            return day;
        };
        ViewModel.prototype.translateKeyCodeToMoveDirection = function (key) {
            switch (key) {
                case TheDatepicker.KeyCode.Left:
                    return MoveDirection.Left;
                case TheDatepicker.KeyCode.Up:
                    return MoveDirection.Up;
                case TheDatepicker.KeyCode.Right:
                    return MoveDirection.Right;
                case TheDatepicker.KeyCode.Down:
                    return MoveDirection.Down;
                default:
                    throw new Error('Invalid key code: ' + key);
            }
        };
        return ViewModel;
    }());
    TheDatepicker.ViewModel = ViewModel;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var Template = (function () {
        function Template(options, htmlHelper) {
            this.goBackHtml = '&lt;';
            this.goForwardHtml = '&gt;';
            this.closeHtml = '&times;';
            this.resetHtml = '&olarr;';
            this.containerElement = null;
            this.goBackElement = null;
            this.goForwardElement = null;
            this.resetElement = null;
            this.closeElement = null;
            this.monthSelect = null;
            this.monthElement = null;
            this.yearSelect = null;
            this.yearElement = null;
            this.weeksElements = [];
            this.daysElements = [];
            this.daysContentsElements = [];
            this.options = options;
            this.htmlHelper = htmlHelper;
        }
        Template.prototype.render = function (viewModel, datepicker) {
            if (this.containerElement === null) {
                if (datepicker.getInput() !== null && this.options.isHiddenOnBlur() && !viewModel.isActive()) {
                    return;
                }
                var container = datepicker.getContainer();
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
        };
        Template.prototype.setClassesPrefix = function (prefix) {
            this.htmlHelper.setClassesPrefix(prefix);
        };
        Template.prototype.createSkeleton = function (viewModel, datepicker) {
            var container = this.htmlHelper.createDiv('container');
            container.appendChild(this.createHeaderElement(viewModel, datepicker));
            container.appendChild(this.createBodyElement(viewModel));
            this.containerElement = container;
            return container;
        };
        Template.prototype.updateContainerElement = function (viewModel, input) {
            this.containerElement.style.display = input === null || viewModel.isActive() || !this.options.isHiddenOnBlur() ? 'block' : 'none';
        };
        Template.prototype.createHeaderElement = function (viewModel, datepicker) {
            var title = this.htmlHelper.createDiv('title');
            title.appendChild(this.createMonthElement(viewModel));
            title.appendChild(this.createYearElement(viewModel));
            var navigation = this.htmlHelper.createDiv('navigation');
            navigation.appendChild(this.createGoBackElement(viewModel));
            navigation.appendChild(title);
            navigation.appendChild(this.createGoForwardElement(viewModel));
            var control = this.htmlHelper.createDiv('control');
            control.appendChild(this.createCloseElement(viewModel, datepicker));
            control.appendChild(this.createResetElement(viewModel));
            var header = this.htmlHelper.createDiv('header');
            header.appendChild(control);
            header.appendChild(navigation);
            return header;
        };
        Template.prototype.createResetElement = function (viewModel) {
            var resetElement = this.htmlHelper.createDiv('reset');
            var resetButton = this.htmlHelper.createAnchor(function (event) {
                viewModel.reset(event);
            });
            resetButton.innerHTML = this.resetHtml;
            resetElement.appendChild(resetButton);
            this.resetElement = resetElement;
            return resetElement;
        };
        Template.prototype.updateResetElement = function (viewModel) {
            this.resetElement.style.display = this.options.isResetButtonShown() ? 'block' : 'none';
        };
        Template.prototype.createCloseElement = function (viewModel, datepicker) {
            var closeElement = this.htmlHelper.createDiv('close');
            var closeButton = this.htmlHelper.createAnchor(function (event) {
                datepicker.close(event);
            });
            closeButton.innerHTML = this.closeHtml;
            closeElement.appendChild(closeButton);
            this.closeElement = closeElement;
            return closeElement;
        };
        Template.prototype.updateCloseElement = function (viewModel, input) {
            this.closeElement.style.display = input !== null && this.options.isHiddenOnBlur() && this.options.isCloseButtonShown() ? 'block' : 'none';
        };
        Template.prototype.createGoBackElement = function (viewModel) {
            return this.createGoElement(viewModel, false);
        };
        Template.prototype.createGoForwardElement = function (viewModel) {
            return this.createGoElement(viewModel, true);
        };
        Template.prototype.createGoElement = function (viewModel, directionForward) {
            var goElement = this.htmlHelper.createDiv('go');
            this.htmlHelper.addClass(goElement, directionForward ? 'go-next' : 'go-previous');
            var goButton = this.htmlHelper.createAnchor(function (event) {
                if (directionForward) {
                    viewModel.goForward(event);
                }
                else {
                    viewModel.goBack(event);
                }
            });
            goButton.innerHTML = directionForward ? this.goForwardHtml : this.goBackHtml;
            goElement.appendChild(goButton);
            if (directionForward) {
                this.goForwardElement = goButton;
            }
            else {
                this.goBackElement = goButton;
            }
            return goElement;
        };
        Template.prototype.updateGoBackElement = function (viewModel) {
            this.goBackElement.style.visibility = viewModel.canGoBack() ? 'visible' : 'hidden';
        };
        Template.prototype.updateGoForwardElement = function (viewModel) {
            this.goForwardElement.style.visibility = viewModel.canGoForward() ? 'visible' : 'hidden';
        };
        Template.prototype.createMonthElement = function (viewModel) {
            var options = [];
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                options.push({
                    value: monthNumber,
                    label: this.options.getTranslator().translateMonth(monthNumber)
                });
            }
            var selectElement = this.htmlHelper.createSelectInput(options, function (event, monthNumber) {
                var newMonth = new Date(viewModel.getCurrentMonth().getTime());
                newMonth.setMonth(monthNumber);
                viewModel.goToMonth(event, newMonth);
            });
            var monthElement = this.htmlHelper.createDiv('month');
            var monthSpan = this.htmlHelper.createSpan();
            monthElement.appendChild(selectElement);
            monthElement.appendChild(monthSpan);
            this.monthElement = monthSpan;
            this.monthSelect = selectElement;
            return monthElement;
        };
        Template.prototype.updateMonthElement = function (viewModel) {
            var currentMonth = viewModel.getCurrentMonth().getMonth();
            var valuesCount = 0;
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                var newMonth = new Date(viewModel.getCurrentMonth().getTime());
                newMonth.setMonth(monthNumber);
                var option = this.monthSelect.getElementsByTagName('option')[monthNumber];
                var canGoToMonth = viewModel.canGoToMonth(newMonth);
                option.disabled = !canGoToMonth;
                option.style.display = canGoToMonth ? 'inline' : 'none';
                valuesCount += canGoToMonth ? 1 : 0;
            }
            this.monthSelect.value = currentMonth.toString();
            this.monthElement.innerText = this.options.getTranslator().translateMonth(currentMonth);
            this.monthSelect.style.display = valuesCount > 1 ? 'inline' : 'none';
            this.monthElement.style.display = valuesCount > 1 ? 'none' : 'inline';
        };
        Template.prototype.createYearElement = function (viewModel) {
            var options = [];
            var limits = this.options.getYearsSelectionLimits();
            for (var year = limits.from; year <= limits.to; year++) {
                options.push({
                    value: year,
                    label: year.toString()
                });
            }
            var selectElement = this.htmlHelper.createSelectInput(options, function (event, year) {
                var newYear = new Date(viewModel.getCurrentMonth().getTime());
                newYear.setFullYear(year);
                viewModel.goToMonth(event, newYear);
            });
            var yearElement = this.htmlHelper.createDiv('year');
            var yearSpan = this.htmlHelper.createSpan();
            yearElement.appendChild(selectElement);
            yearElement.appendChild(yearSpan);
            this.yearElement = yearSpan;
            this.yearSelect = selectElement;
            return yearElement;
        };
        Template.prototype.updateYearElement = function (viewModel) {
            var currentYear = viewModel.getCurrentMonth().getFullYear();
            var options = this.yearSelect.getElementsByTagName('option');
            var yearFrom = parseInt(options[0].value, 10);
            var minDate = this.options.getMinDate();
            var minYear = minDate !== null ? minDate.getFullYear() : null;
            var maxDate = this.options.getMaxDate();
            var maxYear = maxDate !== null ? maxDate.getFullYear() : null;
            var valuesCount = 0;
            var includesCurrentYear = false;
            for (var index = 0; index < options.length; index++) {
                var year = yearFrom + index;
                if (year === currentYear) {
                    includesCurrentYear = true;
                }
                var canGoToYear = void 0;
                if (year === minYear || year === maxYear) {
                    var newYear = new Date(viewModel.getCurrentMonth().getTime());
                    newYear.setFullYear(year);
                    canGoToYear = viewModel.canGoToMonth(newYear);
                }
                else {
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
            var isSelectVisible = includesCurrentYear && valuesCount > 1;
            this.yearSelect.style.display = isSelectVisible ? 'inline' : 'none';
            this.yearElement.style.display = isSelectVisible ? 'none' : 'inline';
        };
        Template.prototype.createTableElement = function (viewModel) {
            var tableHeader = this.createTableHeaderElement(viewModel);
            var tableBody = this.createTableBodyElement(viewModel);
            return this.htmlHelper.createTable('table', tableHeader, tableBody);
        };
        Template.prototype.createTableHeaderElement = function (viewModel) {
            var weekDays = viewModel.getWeekDays();
            var cells = [];
            for (var index = 0; index < weekDays.length; index++) {
                var dayOfWeek = weekDays[index];
                cells.push(this.createTableHeaderCellElement(viewModel, dayOfWeek));
            }
            return this.htmlHelper.createTableHeader('table-header', cells);
        };
        Template.prototype.createTableHeaderCellElement = function (viewModel, dayOfWeek) {
            var headerCell = this.htmlHelper.createTableHeaderCell('table-header-cell');
            if (dayOfWeek === TheDatepicker.DayOfWeek.Saturday || dayOfWeek === TheDatepicker.DayOfWeek.Sunday) {
                this.htmlHelper.addClass(headerCell, 'weekend');
            }
            headerCell.innerText = this.options.getTranslator().translateDayOfWeek(dayOfWeek);
            return headerCell;
        };
        Template.prototype.createTableBodyElement = function (viewModel) {
            this.daysElements = [];
            this.daysContentsElements = [];
            var rows = [];
            for (var index = 0; index < 6; index++) {
                rows.push(this.createTableRowElement(viewModel));
            }
            this.weeksElements = rows;
            return this.htmlHelper.createTableBody('table-body', rows);
        };
        Template.prototype.updateWeeksElements = function (viewModel) {
            var weeks = viewModel.getWeeks();
            for (var weekIndex = 0; weekIndex < this.weeksElements.length; weekIndex++) {
                var weekElement = this.weeksElements[weekIndex];
                var week = weeks.length > weekIndex ? weeks[weekIndex] : null;
                weekElement.style.display = week !== null ? 'table-row' : 'none';
                if (week !== null) {
                    for (var dayIndex = 0; dayIndex < this.daysElements[weekIndex].length; dayIndex++) {
                        this.updateDayElement(viewModel, this.daysElements[weekIndex][dayIndex], this.daysContentsElements[weekIndex][dayIndex], week[dayIndex]);
                    }
                }
            }
        };
        Template.prototype.createTableRowElement = function (viewModel) {
            var cells = [];
            var cellsContents = [];
            for (var index = 0; index < 7; index++) {
                var cell = this.htmlHelper.createTableCell('day');
                var cellContent = this.createTableCellContentElement(viewModel);
                cells.push(cell);
                cellsContents.push(cellContent);
                cell.appendChild(cellContent);
            }
            this.daysElements.push(cells);
            this.daysContentsElements.push(cellsContents);
            return this.htmlHelper.createTableRow('week', cells);
        };
        Template.prototype.updateDayElement = function (viewModel, dayElement, dayContentElement, day) {
            dayContentElement.day = day;
            if (!day.isInCurrentMonth && !this.options.areDaysOutOfMonthVisible()) {
                dayElement.className = '';
                dayContentElement.innerText = '';
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
            dayContentElement.style.visibility = 'visible';
            dayContentElement.innerText = this.options.getCellContent(day);
            if (day.isAvailable) {
                dayContentElement.href = '#';
            }
            else {
                dayContentElement.removeAttribute('href');
            }
            if (day.isFocused) {
                dayContentElement.focus();
            }
        };
        Template.prototype.createTableCellContentElement = function (viewModel) {
            var cellContent = this.htmlHelper.createAnchor(function (event) {
                viewModel.selectDay(event, cellContent.day, false, true, true);
            });
            cellContent.onfocus = function (event) {
                viewModel.highlightDay(event, cellContent.day);
            };
            cellContent.onmouseenter = function (event) {
                viewModel.cancelHighlight();
            };
            cellContent.onmouseleave = function () {
                viewModel.cancelHighlight();
            };
            return cellContent;
        };
        Template.prototype.createBodyElement = function (viewModel) {
            var body = this.htmlHelper.createDiv('body');
            body.appendChild(this.createTableElement(viewModel));
            return body;
        };
        return Template;
    }());
    TheDatepicker.Template = Template;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var EventType;
    (function (EventType) {
        EventType["BeforeSelect"] = "beforeSelect";
        EventType["Select"] = "select";
        EventType["BeforeSwitch"] = "beforeSwitch";
        EventType["Switch"] = "switch";
        EventType["Go"] = "go";
        EventType["BeforeGo"] = "beforeGo";
    })(EventType = TheDatepicker.EventType || (TheDatepicker.EventType = {}));
    var Options = (function () {
        function Options() {
            this.hideOnBlur = true;
            this.hideOnSelect = true;
            this.minDate = null;
            this.maxDate = null;
            this.initialDate = null;
            this.initialMonth = null;
            this.firstDayOfWeek = TheDatepicker.DayOfWeek.Monday;
            this.dateAvailabilityResolver = null;
            this.cellContentResolver = null;
            this.inputFormat = 'j. n. Y';
            this.daysOutOfMonthVisible = false;
            this.fixedRowsCount = false;
            this.toggleSelection = false;
            this.allowEmpty = true;
            this.showResetButton = true;
            this.showCloseButton = true;
            this.yearsSelectionLimits = {
                from: 1900,
                to: 2100
            };
            this.listeners = {
                beforeSelect: [],
                select: [],
                beforeSwitch: [],
                "switch": [],
                go: [],
                beforeGo: []
            };
            this.setTemplate(new TheDatepicker.Template(this, new TheDatepicker.HtmlHelper()));
            this.setTranslator(new TheDatepicker.Translator());
        }
        Options.prototype.setTemplate = function (template) {
            if (!(template instanceof TheDatepicker.Template)) {
                throw new Error('Template was expected to an instance of Template, but ' + template + ' given.');
            }
            this.template = template;
        };
        Options.prototype.setTranslator = function (translator) {
            if (!(translator instanceof TheDatepicker.Translator)) {
                throw new Error('Translator was expected to an instance of Translator, but ' + translator + ' given.');
            }
            this.translator = translator;
        };
        Options.prototype.setHideOnBlur = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether to hide on blur was expected to be a boolean, but ' + value + ' given.');
            }
            this.hideOnBlur = value;
        };
        Options.prototype.setHideOnSelect = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether to hide on select was expected to be a boolean, but ' + value + ' given.');
            }
            this.hideOnSelect = value;
        };
        Options.prototype.setMinDate = function (date) {
            var normalizedDate = this.normalizeDate(date, 'Min date');
            this.checkConstraints(normalizedDate, this.maxDate);
            this.minDate = normalizedDate;
        };
        Options.prototype.setMaxDate = function (date) {
            var normalizedDate = this.normalizeDate(date, 'Max date');
            this.checkConstraints(this.minDate, normalizedDate);
            this.maxDate = normalizedDate;
        };
        Options.prototype.setInitialMonth = function (month) {
            this.initialMonth = this.normalizeDate(month, 'Initial month');
        };
        Options.prototype.setInitialDate = function (value) {
            this.initialDate = this.normalizeDate(value, 'Initial date');
        };
        Options.prototype.setFirstDayOfWeek = function (dayOfWeek) {
            switch (dayOfWeek) {
                case TheDatepicker.DayOfWeek.Monday:
                case TheDatepicker.DayOfWeek.Tuesday:
                case TheDatepicker.DayOfWeek.Wednesday:
                case TheDatepicker.DayOfWeek.Thursday:
                case TheDatepicker.DayOfWeek.Friday:
                case TheDatepicker.DayOfWeek.Saturday:
                case TheDatepicker.DayOfWeek.Sunday:
                    this.firstDayOfWeek = dayOfWeek;
                    break;
                default:
                    throw new Error('First day of week was expected to be TheDatepicker.DayOfWeek constant, but ' + dayOfWeek + ' given.');
            }
        };
        Options.prototype.setDateAvailabilityResolver = function (resolver) {
            if (resolver === null) {
                this.dateAvailabilityResolver = null;
                return;
            }
            if (typeof resolver !== 'function') {
                throw new Error('Date availability resolver was expected to be function or null, but ' + typeof resolver + ' given.');
            }
            this.dateAvailabilityResolver = resolver;
        };
        Options.prototype.setCellContentResolver = function (resolver) {
            if (resolver === null) {
                this.cellContentResolver = null;
                return;
            }
            if (typeof resolver !== 'function') {
                throw new Error('Cell content resolver was expected to be function or null, but ' + typeof resolver + ' given.');
            }
            this.cellContentResolver = resolver;
        };
        Options.prototype.setInputFormat = function (format) {
            if (typeof format !== 'string' || format === '') {
                throw new Error('Input format was expected to be a non empty string, but ' + (format === '' ? 'empty string' : typeof format) + ' given.');
            }
            this.inputFormat = format;
        };
        Options.prototype.setDaysOutOfMonthVisible = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether are days out of month visible was expected to be a boolean, but ' + value + ' given.');
            }
            this.daysOutOfMonthVisible = value;
        };
        Options.prototype.setFixedRowsCount = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether has fixed rows count was expected to be a boolean, but ' + value + ' given.');
            }
            this.fixedRowsCount = value;
        };
        Options.prototype.setToggleSelection = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether has toggle selection was expected to be a boolean, but ' + value + ' given.');
            }
            this.toggleSelection = value;
        };
        Options.prototype.setAllowEmpty = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether has allowed empty was expected to be a boolean, but ' + value + ' given.');
            }
            this.allowEmpty = value;
        };
        Options.prototype.setShowResetButton = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether is reset button shown was expected to be a boolean, but ' + value + ' given.');
            }
            this.showResetButton = value;
        };
        Options.prototype.setShowCloseButton = function (value) {
            if (typeof value !== 'boolean') {
                throw new Error('Whether is close button shown was expected to be a boolean, but ' + value + ' given.');
            }
            this.showCloseButton = value;
        };
        Options.prototype.setYearsSelectionLimits = function (from, to) {
            if (typeof from !== 'number' || typeof to !== 'number') {
                throw new Error('Years selection limits was expected to be numbers, but ' + typeof from + ', ' + typeof to + ' given.');
            }
            if (isNaN(from) || isNaN(to)) {
                throw new Error('Years selection limits was expected to be numbers, but NaN given.');
            }
            if (from > to) {
                throw new Error('From cannot be higher than to, given from: ' + from + ', to: ' + to);
            }
            this.yearsSelectionLimits = {
                from: from,
                to: to
            };
        };
        Options.prototype.onBeforeSelect = function (listener) {
            this.onEventListener(EventType.BeforeSelect, listener);
        };
        Options.prototype.offBeforeSelect = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.BeforeSelect, listener);
        };
        Options.prototype.onSelect = function (listener) {
            this.onEventListener(EventType.Select, listener);
        };
        Options.prototype.offSelect = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.Select, listener);
        };
        Options.prototype.onBeforeSwitch = function (listener) {
            this.onEventListener(EventType.BeforeSwitch, listener);
        };
        Options.prototype.offBeforeSwitch = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.BeforeSwitch, listener);
        };
        Options.prototype.onSwitch = function (listener) {
            this.onEventListener(EventType.Switch, listener);
        };
        Options.prototype.offSwitch = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.Switch, listener);
        };
        Options.prototype.onBeforeGo = function (listener) {
            this.onEventListener(EventType.BeforeGo, listener);
        };
        Options.prototype.offBeforeGo = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.BeforeGo, listener);
        };
        Options.prototype.onGo = function (listener) {
            this.onEventListener(EventType.Go, listener);
        };
        Options.prototype.offGo = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.Go, listener);
        };
        Options.prototype.getTemplate = function () {
            return this.template;
        };
        Options.prototype.getTranslator = function () {
            return this.translator;
        };
        Options.prototype.getInitialMonth = function () {
            var initialMonth = this.initialMonth !== null
                ? new Date(this.initialMonth.getTime())
                : (this.initialDate !== null
                    ? new Date(this.initialDate.getTime())
                    : TheDatepicker.Helper.resetTime(new Date()));
            initialMonth.setDate(1);
            return this.correctMonth(initialMonth);
        };
        Options.prototype.isMonthInValidity = function (month) {
            return this.calculateMonthCorrection(month) === null;
        };
        Options.prototype.correctMonth = function (month) {
            var correctMonth = this.calculateMonthCorrection(month);
            return correctMonth !== null ? correctMonth : month;
        };
        Options.prototype.getInitialDate = function () {
            if (this.isAllowedEmpty()) {
                return this.initialDate !== null && this.isDateInValidity(this.initialDate) && this.isDateAvailable(this.initialDate)
                    ? this.initialDate
                    : null;
            }
            var initialDate = this.initialDate !== null ? new Date(this.initialDate.getTime()) : TheDatepicker.Helper.resetTime(new Date());
            initialDate = this.correctDate(initialDate);
            if (this.isDateAvailable(initialDate)) {
                return initialDate;
            }
            var maxLoops = 150;
            var increasedDate = initialDate;
            var decreasedDate = new Date(initialDate.getTime());
            do {
                if (increasedDate !== null) {
                    increasedDate.setDate(increasedDate.getDate() + 1);
                    if (this.maxDate !== null && increasedDate.getTime() > this.maxDate.getTime()) {
                        increasedDate = null;
                    }
                    else if (this.isDateAvailable(increasedDate)) {
                        return increasedDate;
                    }
                }
                if (decreasedDate !== null) {
                    decreasedDate.setDate(decreasedDate.getDate() - 1);
                    if (this.minDate !== null && decreasedDate.getTime() < this.minDate.getTime()) {
                        decreasedDate = null;
                    }
                    else if (this.isDateAvailable(decreasedDate)) {
                        return decreasedDate;
                    }
                }
                maxLoops--;
            } while ((increasedDate !== null || decreasedDate !== null) && maxLoops > 0);
            return null;
        };
        Options.prototype.isDateInValidity = function (date) {
            return this.calculateDateCorrection(date) === null;
        };
        Options.prototype.correctDate = function (date) {
            var correctDate = this.calculateDateCorrection(date);
            return correctDate !== null ? correctDate : date;
        };
        Options.prototype.getFirstDayOfWeek = function () {
            return this.firstDayOfWeek;
        };
        Options.prototype.areDaysOutOfMonthVisible = function () {
            return this.daysOutOfMonthVisible;
        };
        Options.prototype.hasFixedRowsCount = function () {
            return this.fixedRowsCount;
        };
        Options.prototype.hasToggleSelection = function () {
            return this.toggleSelection;
        };
        Options.prototype.isAllowedEmpty = function () {
            return this.allowEmpty;
        };
        Options.prototype.isResetButtonShown = function () {
            return this.showResetButton;
        };
        Options.prototype.isCloseButtonShown = function () {
            return this.showCloseButton;
        };
        Options.prototype.getMinDate = function () {
            return this.minDate;
        };
        Options.prototype.getMaxDate = function () {
            return this.maxDate;
        };
        Options.prototype.getYearsSelectionLimits = function () {
            return this.yearsSelectionLimits;
        };
        Options.prototype.isDateAvailable = function (date) {
            if (this.dateAvailabilityResolver !== null) {
                return this.dateAvailabilityResolver(new Date(date.getTime()));
            }
            return true;
        };
        Options.prototype.getCellContent = function (day) {
            if (this.cellContentResolver !== null) {
                return this.cellContentResolver(day);
            }
            return day.dayNumber.toString();
        };
        Options.prototype.isHiddenOnBlur = function () {
            return this.hideOnBlur;
        };
        Options.prototype.isHiddenOnSelect = function () {
            return this.hideOnSelect;
        };
        Options.prototype.getInputFormat = function () {
            return this.inputFormat;
        };
        Options.prototype.normalizeDate = function (value, parameterName) {
            try {
                return TheDatepicker.Helper.normalizeDate(value);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.InvalidDateException)) {
                    throw error;
                }
                throw new Error(parameterName + ' was expected to be a valid Date string or valid instance of Date or null, ' + value + ' given.');
            }
        };
        Options.prototype.checkConstraints = function (minDate, maxDate) {
            if (minDate !== null
                && maxDate !== null
                && minDate.getTime() > maxDate.getTime()) {
                throw new Error('Min date cannot be higher then max date, given min: ' + minDate.toString() + ', max: ' + maxDate.toString());
            }
        };
        Options.prototype.calculateMonthCorrection = function (month) {
            if (this.minDate !== null) {
                var minMonth = new Date(this.minDate.getTime());
                minMonth.setDate(1);
                if (month.getTime() < minMonth.getTime()) {
                    return minMonth;
                }
            }
            if (this.maxDate !== null) {
                var maxMonth = new Date(this.maxDate.getTime());
                maxMonth.setDate(1);
                if (month.getTime() > maxMonth.getTime()) {
                    return maxMonth;
                }
            }
            return null;
        };
        Options.prototype.calculateDateCorrection = function (date) {
            if (this.minDate !== null && date.getTime() < this.minDate.getTime()) {
                return new Date(this.minDate.getTime());
            }
            if (this.maxDate !== null && date.getTime() > this.maxDate.getTime()) {
                return new Date(this.maxDate.getTime());
            }
            return null;
        };
        Options.prototype.onEventListener = function (eventType, listener) {
            if (typeof listener !== 'function') {
                throw new Error('Event listener was expected to be function, but ' + typeof listener + ' given.');
            }
            this.listeners[eventType].push(listener);
        };
        Options.prototype.offEventListener = function (eventType, listener) {
            if (listener !== null && typeof listener !== 'function') {
                throw new Error('Event listener was expected to be function, but ' + typeof listener + ' given.');
            }
            if (listener === null) {
                this.listeners[eventType] = [];
            }
            else {
                var newListeners = [];
                for (var index = 0; index < this.listeners[eventType].length; index++) {
                    if (this.listeners[eventType][index] !== listener) {
                        newListeners.push(this.listeners[eventType][index]);
                    }
                }
                this.listeners[eventType] = newListeners;
            }
        };
        Options.prototype.triggerEvent = function (eventType, caller) {
            for (var index = 0; index < this.listeners[eventType].length; index++) {
                if (caller(this.listeners[eventType][index]) === false) {
                    return false;
                }
            }
            return true;
        };
        return Options;
    }());
    TheDatepicker.Options = Options;
})(TheDatepicker || (TheDatepicker = {}));
