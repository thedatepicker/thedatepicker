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
            this.dayOfWeekTranslations[TheDatepicker.Helper.checkNumber('First day of week', dayOfWeek, 0, 6)] = TheDatepicker.Helper.checkString('Translation', translation);
        };
        Translator.prototype.setMonthTranslation = function (month, translation) {
            this.monthTranslations[TheDatepicker.Helper.checkNumber('Month', month, 0, 11)] = TheDatepicker.Helper.checkString('Translation', translation);
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
    var ParsedDateData = (function () {
        function ParsedDateData() {
            this.day = null;
            this.month = null;
            this.year = null;
        }
        ParsedDateData.prototype.createDate = function () {
            if (this.day === null || this.month === null || this.year === null) {
                throw new CannotParseDateException();
            }
            var date = new Date(this.year, this.month - 1, this.day);
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
        };
        return ParsedDateData;
    }());
    var DateConverter = (function () {
        function DateConverter(options) {
            this.options = options;
            this.escapeChar = '\\';
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
            var dateData = new ParsedDateData();
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
                            textPosition += parser.call(this, text.substring(textPosition), dateData);
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
            return dateData.createDate();
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
            return date.getDate() + '';
        };
        DateConverter.prototype.formatDayWithLeadingZero = function (date) {
            return ('0' + date.getDate()).slice(-2);
        };
        DateConverter.prototype.formatDayOfWeekTextual = function (date) {
            return this.options.translator.translateDayOfWeek(date.getDay());
        };
        DateConverter.prototype.formatMonth = function (date) {
            return (date.getMonth() + 1) + '';
        };
        DateConverter.prototype.formatMonthWithLeadingZero = function (date) {
            return ('0' + (date.getMonth() + 1)).slice(-2);
        };
        DateConverter.prototype.formatMonthTextual = function (date) {
            return this.options.translator.translateMonth(date.getMonth());
        };
        DateConverter.prototype.formatYear = function (date) {
            return date.getFullYear() + '';
        };
        DateConverter.prototype.formatYearTwoDigits = function (date) {
            var year = date.getFullYear() + '';
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
        DateConverter.prototype.parseDay = function (text, dateData) {
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
            dateData.day = parseInt(day, 10);
            return took + day.length;
        };
        DateConverter.prototype.parseDayOfWeekTextual = function (text) {
            var maxLength = 0;
            for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                var translation = this.options.translator.translateDayOfWeek(dayOfWeek);
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
        DateConverter.prototype.parseMonth = function (text, dateData) {
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
            dateData.month = parseInt(month, 10);
            return took + month.length;
        };
        DateConverter.prototype.parseMonthTextual = function (text, dateData) {
            for (var month = 1; month <= 12; month++) {
                var translation = this.options.translator.translateMonth(month - 1);
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()) {
                    dateData.month = month;
                    return translation.length;
                }
            }
            throw new CannotParseDateException();
        };
        DateConverter.prototype.parseYear = function (text, dateData) {
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
            dateData.year = year;
            return yearLength + (isNegative ? 1 : 0);
        };
        DateConverter.prototype.parseYearTwoDigits = function (text, dateData) {
            var yearEnd = text.substring(0, 2);
            if (!/[0-9]{2}/.test(yearEnd)) {
                throw new CannotParseDateException();
            }
            var currentYear = (this.options.getToday()).getFullYear() + '';
            var yearBeginning = currentYear.substring(0, currentYear.length - 2);
            dateData.year = parseInt(yearBeginning + yearEnd, 10);
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
        InitializationPhase[InitializationPhase["Destroyed"] = 4] = "Destroyed";
    })(InitializationPhase || (InitializationPhase = {}));
    var Datepicker = (function () {
        function Datepicker(input, container, options) {
            if (container === void 0) { container = null; }
            if (options === void 0) { options = null; }
            this.initializationPhase = InitializationPhase.Untouched;
            this.inputListenerRemover = null;
            this.listenerRemovers = [];
            this.deselectElement = null;
            if (input !== null && !TheDatepicker.Helper.isElement(input)) {
                throw new Error('Input was expected to be null or an HTMLElement.');
            }
            if (container !== null && !TheDatepicker.Helper.isElement(container)) {
                throw new Error('Container was expected to be null or an HTMLElement.');
            }
            if (input === null && container === null) {
                throw new Error('At least one of input or container is mandatory.');
            }
            if (options !== null && !(options instanceof TheDatepicker.Options)) {
                throw new Error('Options was expected to be an instance of Options');
            }
            this.document = document;
            this.options = options !== null ? options.clone() : new TheDatepicker.Options();
            var duplicateError = 'There is already a datepicker present on ';
            this.isContainerExternal = container !== null;
            if (container === null) {
                container = this.createContainer();
                if (input !== null) {
                    input.parentNode.insertBefore(container, input.nextSibling);
                }
            }
            else {
                if (typeof container.datepicker !== 'undefined') {
                    throw new Error(duplicateError + 'container.');
                }
            }
            if (input !== null) {
                if (typeof input.datepicker !== 'undefined') {
                    throw new Error(duplicateError + 'input.');
                }
                input.datepicker = this;
                input.autocomplete = 'off';
            }
            container.datepicker = this;
            this.input = input;
            this.container = container;
            this.dateConverter = new TheDatepicker.DateConverter(this.options);
            this.viewModel = new TheDatepicker.ViewModel(this.options, this);
            this.triggerReady(input);
            this.triggerReady(container);
        }
        Datepicker.prototype.render = function () {
            var _this = this;
            switch (this.initializationPhase) {
                case InitializationPhase.Destroyed:
                    return;
                case InitializationPhase.Initialized:
                    this.viewModel.render();
                    return;
                case InitializationPhase.Ready:
                    this.initListeners();
                    this.initializationPhase = InitializationPhase.Initialized;
                    this.render();
                    return;
                case InitializationPhase.Waiting:
                    if (!this.options.isHiddenOnBlur()) {
                        this.open();
                        return;
                    }
                    this.viewModel.selectPossibleDate();
                    this.updateDeselectButton();
                    return;
                case InitializationPhase.Untouched:
                    this.preselectFromInput();
                    this.createDeselectElement();
                    this.viewModel.selectInitialDate(null);
                    this.updateInput();
                    if (this.input !== null && this.options.isHiddenOnBlur()) {
                        if (this.input === this.document.activeElement) {
                            this.initializationPhase = InitializationPhase.Ready;
                            this.render();
                            this.open();
                            return;
                        }
                        this.inputListenerRemover = TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.Focus, function (event) {
                            _this.open(event);
                        });
                        this.initializationPhase = InitializationPhase.Waiting;
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
                this.render();
                Datepicker.hasClickedViewModel = true;
            }
            if (!Datepicker.activateViewModel(event, this)) {
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
        Datepicker.prototype.reset = function (event) {
            if (event === void 0) { event = null; }
            return this.viewModel.reset(event);
        };
        Datepicker.prototype.destroy = function () {
            if (this.initializationPhase === InitializationPhase.Destroyed) {
                return;
            }
            for (var index = 0; index < this.listenerRemovers.length; index++) {
                this.listenerRemovers[index]();
            }
            this.listenerRemovers = [];
            if (this.isContainerExternal) {
                this.container.innerHTML = '';
            }
            else {
                this.container.parentNode.removeChild(this.container);
            }
            this.container.datepicker = null;
            if (this.input !== null) {
                this.input.datepicker = null;
                this.removeInitialInputListener();
                this.input = null;
            }
            if (this.deselectElement !== null) {
                this.deselectElement.parentNode.removeChild(this.deselectElement);
                this.deselectElement = null;
            }
            this.initializationPhase = InitializationPhase.Destroyed;
        };
        Datepicker.prototype.selectDate = function (date, doUpdateMonth, event) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (event === void 0) { event = null; }
            return this.viewModel.selectDay(event, TheDatepicker.Helper.normalizeDate('Date', date, this.options), doUpdateMonth);
        };
        Datepicker.prototype.getSelectedDate = function () {
            return this.viewModel.selectedDate !== null ? new Date(this.viewModel.selectedDate.getTime()) : null;
        };
        Datepicker.prototype.goToMonth = function (month, event) {
            if (event === void 0) { event = null; }
            return this.viewModel.goToMonth(event, TheDatepicker.Helper.normalizeDate('Month', month, this.options));
        };
        Datepicker.prototype.readInput = function (event) {
            if (event === void 0) { event = null; }
            if (this.input === null) {
                return false;
            }
            try {
                var date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
                if (date !== null) {
                    return this.viewModel.selectNearestDate(event, date);
                }
                return this.viewModel.cancelSelection(event);
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
            this.input.value = this.viewModel.selectedDate !== null
                ? this.dateConverter.formatDate(this.options.getInputFormat(), this.viewModel.selectedDate)
                : '';
            this.updateDeselectButton();
        };
        Datepicker.onDatepickerReady = function (element, callback) {
            if (typeof element.datepicker !== 'undefined' && element.datepicker instanceof Datepicker) {
                element.datepicker.triggerReadyListener(callback, element);
                return;
            }
            Datepicker.readyListeners.push({
                element: element,
                callback: callback
            });
        };
        ;
        Datepicker.prototype.createContainer = function () {
            var container = this.document.createElement('div');
            container.className = this.options.getClassesPrefix() + 'container';
            container.style.position = 'absolute';
            container.style.zIndex = '99';
            return container;
        };
        Datepicker.prototype.createDeselectElement = function () {
            var _this = this;
            if (this.input === null || !this.options.isDeselectButtonShown()) {
                return null;
            }
            var deselectElement = this.document.createElement('span');
            deselectElement.style.position = 'absolute';
            var deselectButton = this.document.createElement('a');
            deselectButton.innerHTML = this.options.getDeselectHtml();
            deselectButton.style.position = 'relative';
            deselectButton.style.left = '-0.8em';
            deselectButton.href = '#';
            deselectButton.onclick = function (event) {
                event = event || window.event;
                TheDatepicker.Helper.preventDefault(event);
                _this.viewModel.cancelSelection(event);
            };
            deselectElement.className = this.options.getClassesPrefix() + 'deselect';
            deselectButton.className = this.options.getClassesPrefix() + 'deselect-button';
            deselectElement.appendChild(deselectButton);
            this.input.parentNode.insertBefore(deselectElement, this.input.nextSibling);
            this.deselectElement = deselectElement;
        };
        Datepicker.prototype.updateDeselectButton = function () {
            if (this.input !== null && this.deselectElement !== null) {
                var isVisible = this.options.isDeselectButtonShown() && this.input.value !== '';
                this.deselectElement.style.visibility = isVisible ? 'visible' : 'hidden';
            }
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
        Datepicker.prototype.initListeners = function () {
            var _this = this;
            if (!Datepicker.areGlobalListenersInitialized) {
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
                    if (Datepicker.activeViewModel !== null) {
                        Datepicker.activeViewModel.triggerKeyPress(event);
                    }
                });
                Datepicker.areGlobalListenersInitialized = true;
            }
            this.removeInitialInputListener();
            var hit = function (event) {
                Datepicker.activateViewModel(event, _this);
                Datepicker.hasClickedViewModel = true;
            };
            this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.container, TheDatepicker.ListenerType.MouseDown, hit));
            this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.container, TheDatepicker.ListenerType.FocusIn, hit));
            if (this.deselectElement !== null) {
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.deselectElement, TheDatepicker.ListenerType.MouseDown, hit));
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.deselectElement, TheDatepicker.ListenerType.FocusIn, hit));
            }
            if (this.input !== null) {
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.MouseDown, hit));
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.Focus, hit));
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.Blur, function () {
                    _this.updateInput();
                }));
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.KeyDown, function (event) {
                    TheDatepicker.Helper.stopPropagation(event);
                }));
                this.listenerRemovers.push(TheDatepicker.Helper.addEventListener(this.input, TheDatepicker.ListenerType.KeyUp, function (event) {
                    _this.readInput(event);
                }));
            }
        };
        Datepicker.prototype.removeInitialInputListener = function () {
            if (this.inputListenerRemover !== null) {
                this.inputListenerRemover();
                this.inputListenerRemover = null;
            }
        };
        Datepicker.prototype.triggerReady = function (element) {
            for (var index = Datepicker.readyListeners.length - 1; index >= 0; index--) {
                var listener = Datepicker.readyListeners[index];
                if (listener.element === element) {
                    this.triggerReadyListener(listener.callback, element);
                    Datepicker.readyListeners.splice(index, 1);
                }
            }
        };
        Datepicker.prototype.triggerReadyListener = function (callback, element) {
            callback.call(element, this, element);
        };
        Datepicker.prototype.fixPosition = function () {
            if (this.isContainerExternal || !this.options.isPositionFixingEnabled()) {
                return;
            }
            var windowTop = window.pageYOffset || this.document.documentElement.scrollTop;
            var windowHeight = window.innerHeight || Math.max(this.document.documentElement.clientHeight, this.document.body.clientHeight);
            var windowBottom = windowTop + windowHeight;
            var inputTop = 0;
            var parentElement = this.input;
            while (parentElement !== null && !isNaN(parentElement.offsetLeft) && !isNaN(parentElement.offsetTop)) {
                inputTop += parentElement.offsetTop - parentElement.scrollTop;
                parentElement = parentElement.offsetParent;
            }
            var inputBottom = inputTop + this.input.offsetHeight;
            var containerHeight = this.container.offsetHeight;
            var locationClass = '';
            var locateOver = inputTop - windowTop > containerHeight && windowBottom - inputBottom < containerHeight;
            if (locateOver) {
                locationClass = ' ' + this.options.getClassesPrefix() + 'container--over';
            }
            this.container.className = this.options.getClassesPrefix() + 'container' + locationClass;
            var childNodes = this.container.childNodes;
            if (childNodes.length > 0) {
                var child = childNodes[0];
                if (locateOver) {
                    var move = this.input.offsetHeight + this.container.offsetHeight;
                    child.style.position = 'relative';
                    child.style.top = '-' + move + 'px';
                }
                else {
                    child.style.position = '';
                    child.style.top = '';
                }
            }
        };
        Datepicker.activateViewModel = function (event, datepicker) {
            var viewModel = datepicker !== null ? datepicker.viewModel : null;
            var activeViewModel = Datepicker.activeViewModel;
            if (activeViewModel === viewModel) {
                return true;
            }
            if (activeViewModel !== null && !activeViewModel.setActive(event, false)) {
                return false;
            }
            if (Datepicker.activeViewModel !== activeViewModel) {
                return true;
            }
            if (viewModel === null) {
                Datepicker.activeViewModel = null;
                return true;
            }
            if (!viewModel.setActive(event, true)) {
                return false;
            }
            if (Datepicker.activeViewModel !== activeViewModel) {
                return true;
            }
            datepicker.fixPosition();
            Datepicker.activeViewModel = viewModel;
            return true;
        };
        Datepicker.readyListeners = [];
        Datepicker.areGlobalListenersInitialized = false;
        Datepicker.activeViewModel = null;
        Datepicker.hasClickedViewModel = false;
        return Datepicker;
    }());
    TheDatepicker.Datepicker = Datepicker;
    TheDatepicker.onDatepickerReady = Datepicker.onDatepickerReady;
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
        Day.prototype.getFormatted = function () {
            return this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.dayNumber).slice(-2);
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
    var Helper = (function () {
        function Helper() {
        }
        Helper.resetTime = function (date) {
            if (date === null) {
                return null;
            }
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        };
        Helper.normalizeDate = function (parameterName, value, options) {
            if (!value) {
                return null;
            }
            if (value instanceof TheDatepicker.Day) {
                return value.getDate();
            }
            if (typeof value === 'string') {
                if (value === 'today' || value === 'now') {
                    return options.getToday();
                }
                if (value === 'tomorrow') {
                    var date_1 = options.getToday();
                    date_1.setDate(date_1.getDate() + 1);
                    return date_1;
                }
                if (value === 'yesterday') {
                    var date_2 = options.getToday();
                    date_2.setDate(date_2.getDate() - 1);
                    return date_2;
                }
                var matches = value.match(/^\s*([+-]?)\s*([0-9]+)\s*(day|month|year)s?\s*$/i);
                if (matches !== null) {
                    var date_3 = options.getToday();
                    var amount = parseInt(matches[2], 10) * (matches[1] === '-' ? -1 : 1);
                    switch (matches[3].toLowerCase()) {
                        case 'day':
                        case 'days':
                            date_3.setDate(date_3.getDate() + amount);
                            break;
                        case 'month':
                        case 'months':
                            date_3.setMonth(date_3.getMonth() + amount);
                            break;
                        case 'year':
                        case 'years':
                            date_3.setFullYear(date_3.getFullYear() + amount);
                            break;
                    }
                    return date_3;
                }
                var date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return Helper.resetTime(date);
                }
            }
            else if (Helper.isValidDate(value)) {
                return Helper.resetTime(new Date(value.getTime()));
            }
            throw new Error(parameterName + ' was expected to be a valid Date string or valid Date or Day or null.');
        };
        Helper.normalizeMonth = function (date) {
            if (date === null) {
                return null;
            }
            var month = new Date(date.getTime());
            month.setDate(1);
            return month;
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
                return function () {
                    element.removeEventListener(listenerType, listener);
                };
            }
            var listenerProperty = 'on' + listenerType;
            var originalListener = element[listenerProperty] || null;
            element[listenerProperty] = function (event) {
                event = event || window.event;
                if (originalListener !== null) {
                    originalListener.call(element, event);
                }
                listener(event);
            };
            return function () {
                element[listenerProperty] = originalListener;
            };
        };
        Helper.preventDefault = function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
        };
        Helper.stopPropagation = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            else {
                event.cancelBubble = true;
            }
        };
        Helper.checkString = function (parameterName, value, checkNonEmpty) {
            if (checkNonEmpty === void 0) { checkNonEmpty = false; }
            if (!checkNonEmpty && !value) {
                return '';
            }
            if (typeof value !== 'string' || (checkNonEmpty && value === '')) {
                throw new Error(parameterName + ' was expected to be a' + (checkNonEmpty ? ' non empty' : '') + ' string.');
            }
            return value;
        };
        Helper.checkNumber = function (parameterName, value, min, max) {
            if (min === void 0) { min = null; }
            if (max === void 0) { max = null; }
            value = typeof value === 'string' ? parseInt(value) : value;
            if (typeof value !== 'number' || isNaN(value) || (min !== null && value < min) || (max !== null && value > max)) {
                throw new Error(parameterName + ' was expected to be a valid number' + (min !== null ? ' from ' + min : '') + (max !== null ? ' to ' + max : '') + '.');
            }
            return value;
        };
        Helper.checkFunction = function (parameterName, value, isNullable) {
            if (isNullable === void 0) { isNullable = true; }
            if (isNullable && !value) {
                return null;
            }
            if (typeof value !== 'function') {
                throw new Error(parameterName + ' was expected to be a function' + (isNullable ? ' or null' : '') + '.');
            }
            return value;
        };
        return Helper;
    }());
    TheDatepicker.Helper = Helper;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var HtmlHelper = (function () {
        function HtmlHelper(options) {
            this.options = options;
            this.document = document;
        }
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
                event = event || window.event;
                TheDatepicker.Helper.preventDefault(event);
                onClick(event);
            };
            anchor.onkeydown = function (event) {
                event = event || window.event;
                if (TheDatepicker.Helper.inArray([TheDatepicker.KeyCode.Enter, TheDatepicker.KeyCode.Space], event.keyCode)) {
                    TheDatepicker.Helper.preventDefault(event);
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
            cell.scope = 'col';
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
        HtmlHelper.prototype.createTableCell = function () {
            return this.document.createElement('td');
        };
        HtmlHelper.prototype.createSelectInput = function (options, onChange) {
            var input = this.document.createElement('select');
            this.addClass(input, 'select');
            for (var index = 0; index < options.length; index++) {
                input.appendChild(this.createSelectOption(options[index].value, options[index].label));
            }
            input.onchange = function (event) {
                onChange(event || window.event, input.value);
            };
            input.onkeydown = function (event) {
                event = event || window.event;
                TheDatepicker.Helper.stopPropagation(event);
            };
            return input;
        };
        HtmlHelper.prototype.createSelectOption = function (value, label) {
            var option = this.document.createElement('option');
            option.value = value;
            option.innerText = label;
            return option;
        };
        HtmlHelper.prototype.addClass = function (element, className) {
            className = this.options.getClassesPrefix() + className;
            if (element.className !== '') {
                className = ' ' + className;
            }
            element.className += className;
        };
        return HtmlHelper;
    }());
    TheDatepicker.HtmlHelper = HtmlHelper;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var EventType;
    (function (EventType) {
        EventType["BeforeSelect"] = "beforeSelect";
        EventType["Select"] = "select";
        EventType["BeforeOpenAndClose"] = "beforeOpenAndClose";
        EventType["OpenAndClose"] = "openAndClose";
        EventType["MonthChange"] = "monthChange";
        EventType["BeforeMonthChange"] = "beforeMonthChange";
    })(EventType = TheDatepicker.EventType || (TheDatepicker.EventType = {}));
    var AvailableDateNotFoundException = (function () {
        function AvailableDateNotFoundException() {
        }
        return AvailableDateNotFoundException;
    }());
    TheDatepicker.AvailableDateNotFoundException = AvailableDateNotFoundException;
    var Options = (function () {
        function Options(translator) {
            if (translator === void 0) { translator = null; }
            this.hideOnBlur = true;
            this.hideOnSelect = true;
            this.minDate = null;
            this.maxDate = null;
            this.minMonth = null;
            this.maxMonth = null;
            this.initialDate = null;
            this.initialMonth = null;
            this.firstDayOfWeek = TheDatepicker.DayOfWeek.Monday;
            this.dateAvailabilityResolver = null;
            this.cellContentResolver = null;
            this.cellClassesResolver = null;
            this.inputFormat = 'j. n. Y';
            this.daysOutOfMonthVisible = false;
            this.fixedRowsCount = false;
            this.toggleSelection = false;
            this.allowEmpty = true;
            this.showDeselectButton = true;
            this.showResetButton = false;
            this.monthAsDropdown = true;
            this.yearAsDropdown = true;
            this.monthAndYearSeparated = true;
            this.classesPrefix = 'the-datepicker__';
            this.showCloseButton = true;
            this.title = '';
            this.dropdownItemsLimit = 200;
            this.goBackHtml = '&lt;';
            this.goForwardHtml = '&gt;';
            this.closeHtml = '&times;';
            this.resetHtml = '&olarr;';
            this.deselectHtml = '&times;';
            this.positionFixing = true;
            this.today = null;
            this.listeners = {
                beforeSelect: [],
                select: [],
                beforeOpenAndClose: [],
                openAndClose: [],
                monthChange: [],
                beforeMonthChange: []
            };
            this.translator = translator !== null ? translator : new TheDatepicker.Translator();
        }
        Options.prototype.clone = function () {
            var options = new Options(this.translator);
            options.hideOnBlur = this.hideOnBlur;
            options.hideOnSelect = this.hideOnSelect;
            options.minDate = this.minDate;
            options.maxDate = this.maxDate;
            options.minMonth = this.minMonth;
            options.maxMonth = this.maxMonth;
            options.initialDate = this.initialDate;
            options.initialMonth = this.initialMonth;
            options.firstDayOfWeek = this.firstDayOfWeek;
            options.dateAvailabilityResolver = this.dateAvailabilityResolver;
            options.cellContentResolver = this.cellContentResolver;
            options.cellClassesResolver = this.cellClassesResolver;
            options.inputFormat = this.inputFormat;
            options.daysOutOfMonthVisible = this.daysOutOfMonthVisible;
            options.fixedRowsCount = this.fixedRowsCount;
            options.toggleSelection = this.toggleSelection;
            options.allowEmpty = this.allowEmpty;
            options.showDeselectButton = this.showDeselectButton;
            options.showResetButton = this.showResetButton;
            options.monthAsDropdown = this.monthAsDropdown;
            options.yearAsDropdown = this.yearAsDropdown;
            options.monthAndYearSeparated = this.monthAndYearSeparated;
            options.classesPrefix = this.classesPrefix;
            options.showCloseButton = this.showCloseButton;
            options.title = this.title;
            options.dropdownItemsLimit = this.dropdownItemsLimit;
            options.goBackHtml = this.goBackHtml;
            options.goForwardHtml = this.goForwardHtml;
            options.closeHtml = this.closeHtml;
            options.resetHtml = this.resetHtml;
            options.deselectHtml = this.deselectHtml;
            options.positionFixing = this.positionFixing;
            options.listeners.beforeSelect = this.listeners.beforeSelect.slice(0);
            options.listeners.select = this.listeners.select.slice(0);
            options.listeners.beforeOpenAndClose = this.listeners.beforeOpenAndClose.slice(0);
            options.listeners.openAndClose = this.listeners.openAndClose.slice(0);
            options.listeners.monthChange = this.listeners.monthChange.slice(0);
            options.listeners.beforeMonthChange = this.listeners.beforeMonthChange.slice(0);
            return options;
        };
        Options.prototype.setHideOnBlur = function (value) {
            this.hideOnBlur = !!value;
        };
        Options.prototype.setHideOnSelect = function (value) {
            this.hideOnSelect = !!value;
        };
        Options.prototype.setMinDate = function (date) {
            var normalizedDate = TheDatepicker.Helper.normalizeDate('Min date', date, this);
            this.checkConstraints(normalizedDate, this.maxDate);
            this.minDate = normalizedDate;
            this.minMonth = TheDatepicker.Helper.normalizeMonth(normalizedDate);
        };
        Options.prototype.setMaxDate = function (date) {
            var normalizedDate = TheDatepicker.Helper.normalizeDate('Max date', date, this);
            this.checkConstraints(this.minDate, normalizedDate);
            this.maxDate = normalizedDate;
            this.maxMonth = TheDatepicker.Helper.normalizeMonth(normalizedDate);
        };
        Options.prototype.setInitialMonth = function (month) {
            this.initialMonth = TheDatepicker.Helper.normalizeDate('Initial month', month, this);
        };
        Options.prototype.setInitialDate = function (value) {
            this.initialDate = TheDatepicker.Helper.normalizeDate('Initial date', value, this);
        };
        Options.prototype.setFirstDayOfWeek = function (dayOfWeek) {
            this.firstDayOfWeek = TheDatepicker.Helper.checkNumber('First day of week', dayOfWeek, 0, 6);
        };
        Options.prototype.setDateAvailabilityResolver = function (resolver) {
            this.dateAvailabilityResolver = TheDatepicker.Helper.checkFunction('Resolver', resolver);
        };
        Options.prototype.setCellContentResolver = function (resolver) {
            this.cellContentResolver = TheDatepicker.Helper.checkFunction('Resolver', resolver);
        };
        Options.prototype.setCellClassesResolver = function (resolver) {
            this.cellClassesResolver = TheDatepicker.Helper.checkFunction('Resolver', resolver);
        };
        Options.prototype.setInputFormat = function (format) {
            this.inputFormat = TheDatepicker.Helper.checkString('Input format', format, true);
        };
        Options.prototype.setDaysOutOfMonthVisible = function (value) {
            this.daysOutOfMonthVisible = !!value;
        };
        Options.prototype.setFixedRowsCount = function (value) {
            this.fixedRowsCount = !!value;
        };
        Options.prototype.setToggleSelection = function (value) {
            this.toggleSelection = !!value;
        };
        Options.prototype.setShowDeselectButton = function (value) {
            this.showDeselectButton = !!value;
        };
        Options.prototype.setAllowEmpty = function (value) {
            this.allowEmpty = !!value;
        };
        Options.prototype.setShowResetButton = function (value) {
            this.showResetButton = !!value;
        };
        Options.prototype.setMonthAsDropdown = function (value) {
            this.monthAsDropdown = !!value;
        };
        Options.prototype.setYearAsDropdown = function (value) {
            this.yearAsDropdown = !!value;
        };
        Options.prototype.setMonthAndYearSeparated = function (value) {
            this.monthAndYearSeparated = !!value;
        };
        Options.prototype.setClassesPrefix = function (prefix) {
            this.classesPrefix = TheDatepicker.Helper.checkString('Prefix', prefix);
        };
        Options.prototype.setShowCloseButton = function (value) {
            this.showCloseButton = !!value;
        };
        Options.prototype.setTitle = function (title) {
            this.title = TheDatepicker.Helper.checkString('Title', title);
        };
        Options.prototype.setDropdownItemsLimit = function (limit) {
            this.dropdownItemsLimit = TheDatepicker.Helper.checkNumber('Items limit', limit, 1);
        };
        Options.prototype.setGoBackHtml = function (html) {
            this.goBackHtml = TheDatepicker.Helper.checkString('Html', html);
        };
        Options.prototype.setGoForwardHtml = function (html) {
            this.goForwardHtml = TheDatepicker.Helper.checkString('Html', html);
        };
        Options.prototype.setCloseHtml = function (html) {
            this.closeHtml = TheDatepicker.Helper.checkString('Html', html);
        };
        Options.prototype.setResetHtml = function (html) {
            this.resetHtml = TheDatepicker.Helper.checkString('Html', html);
        };
        Options.prototype.setDeselectHtml = function (html) {
            this.deselectHtml = TheDatepicker.Helper.checkString('Html', html);
        };
        Options.prototype.setPositionFixing = function (value) {
            this.positionFixing = !!value;
        };
        Options.prototype.setToday = function (date) {
            this.today = TheDatepicker.Helper.normalizeDate('Today', date, this);
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
        Options.prototype.onBeforeOpenAndClose = function (listener) {
            this.onEventListener(EventType.BeforeOpenAndClose, listener);
        };
        Options.prototype.offBeforeOpenAndClose = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.BeforeOpenAndClose, listener);
        };
        Options.prototype.onOpenAndClose = function (listener) {
            this.onEventListener(EventType.OpenAndClose, listener);
        };
        Options.prototype.offOpenAndClose = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.OpenAndClose, listener);
        };
        Options.prototype.onBeforeMonthChange = function (listener) {
            this.onEventListener(EventType.BeforeMonthChange, listener);
        };
        Options.prototype.offBeforeMonthChange = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.BeforeMonthChange, listener);
        };
        Options.prototype.onMonthChange = function (listener) {
            this.onEventListener(EventType.MonthChange, listener);
        };
        Options.prototype.offMonthChange = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEventListener(EventType.MonthChange, listener);
        };
        Options.prototype.getInitialMonth = function () {
            var initialMonth = this.initialDate !== null
                ? new Date(this.initialDate.getTime())
                : (this.initialMonth !== null
                    ? new Date(this.initialMonth.getTime())
                    : this.getToday());
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
            return this.findPossibleAvailableDate(this.initialDate);
        };
        Options.prototype.findPossibleAvailableDate = function (date) {
            if (this.isAllowedEmpty()) {
                return date !== null && this.isDateInValidity(date) && this.isDateAvailable(date)
                    ? new Date(date.getTime())
                    : null;
            }
            date = date !== null ? new Date(date.getTime()) : this.getToday();
            date = this.findNearestAvailableDate(date);
            if (date !== null) {
                return date;
            }
            throw new AvailableDateNotFoundException();
        };
        Options.prototype.findNearestAvailableDate = function (date) {
            date = this.correctDate(date);
            if (this.isDateAvailable(date)) {
                return date;
            }
            var maxLoops = 1000;
            var increasedDate = date;
            var decreasedDate = new Date(date.getTime());
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
            return this.allowEmpty && this.toggleSelection;
        };
        Options.prototype.isAllowedEmpty = function () {
            return this.allowEmpty;
        };
        Options.prototype.isDeselectButtonShown = function () {
            return this.allowEmpty && this.showDeselectButton;
        };
        Options.prototype.isResetButtonShown = function () {
            return this.showResetButton;
        };
        Options.prototype.isMonthAsDropdown = function () {
            return this.monthAsDropdown;
        };
        Options.prototype.isYearAsDropdown = function () {
            return this.yearAsDropdown;
        };
        Options.prototype.isMonthAndYearSeparated = function () {
            return this.monthAndYearSeparated;
        };
        Options.prototype.getClassesPrefix = function () {
            return this.classesPrefix;
        };
        Options.prototype.isCloseButtonShown = function () {
            return this.hideOnBlur && this.showCloseButton;
        };
        Options.prototype.getTitle = function () {
            return this.title;
        };
        Options.prototype.getMinDate = function () {
            return this.minDate;
        };
        Options.prototype.getMaxDate = function () {
            return this.maxDate;
        };
        Options.prototype.getMinMonth = function () {
            return this.minMonth;
        };
        Options.prototype.getMaxMonth = function () {
            return this.maxMonth;
        };
        Options.prototype.getDropdownItemsLimit = function () {
            return this.dropdownItemsLimit;
        };
        Options.prototype.isDateAvailable = function (date) {
            if (this.dateAvailabilityResolver !== null) {
                return !!this.dateAvailabilityResolver(new Date(date.getTime()));
            }
            return true;
        };
        Options.prototype.getCellContent = function (day) {
            if (this.cellContentResolver !== null) {
                return this.cellContentResolver(day);
            }
            return day.dayNumber + '';
        };
        Options.prototype.getCellClasses = function (day) {
            if (this.cellClassesResolver !== null) {
                var classes = this.cellClassesResolver(day);
                if (typeof classes === 'object' && classes.constructor === Array) {
                    return classes;
                }
            }
            return [];
        };
        Options.prototype.getGoBackHtml = function () {
            return this.goBackHtml;
        };
        Options.prototype.getGoForwardHtml = function () {
            return this.goForwardHtml;
        };
        Options.prototype.getCloseHtml = function () {
            return this.closeHtml;
        };
        Options.prototype.getResetHtml = function () {
            return this.resetHtml;
        };
        Options.prototype.getDeselectHtml = function () {
            return this.deselectHtml;
        };
        Options.prototype.isHiddenOnBlur = function () {
            return this.hideOnBlur;
        };
        Options.prototype.isHiddenOnSelect = function () {
            return this.hideOnBlur && this.hideOnSelect;
        };
        Options.prototype.getInputFormat = function () {
            return this.inputFormat;
        };
        Options.prototype.isPositionFixingEnabled = function () {
            return this.hideOnBlur && this.positionFixing;
        };
        Options.prototype.getToday = function () {
            return this.today !== null ? new Date(this.today.getTime()) : TheDatepicker.Helper.resetTime(new Date());
        };
        Options.prototype.checkConstraints = function (minDate, maxDate) {
            if (minDate !== null
                && maxDate !== null
                && minDate.getTime() > maxDate.getTime()) {
                throw new Error('Min date cannot be higher then max date.');
            }
        };
        Options.prototype.calculateMonthCorrection = function (month) {
            var minMonth = this.getMinMonth();
            if (minMonth !== null && month.getTime() < minMonth.getTime()) {
                return minMonth;
            }
            var maxMonth = this.getMaxMonth();
            if (maxMonth !== null && month.getTime() > maxMonth.getTime()) {
                return maxMonth;
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
            this.listeners[eventType].push(TheDatepicker.Helper.checkFunction('Event listener', listener, false));
        };
        Options.prototype.offEventListener = function (eventType, listener) {
            listener = TheDatepicker.Helper.checkFunction('Event listener', listener);
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
            this.selectedDate = null;
            this.currentMonth = null;
            this.highlightedDay = null;
            this.isHighlightedDayFocused = false;
            this.active = false;
            this.template = new TheDatepicker.Template(this.options, new TheDatepicker.HtmlHelper(this.options), datepicker.container, datepicker.input !== null);
        }
        ViewModel.prototype.render = function () {
            if (this.selectPossibleDate()) {
                return;
            }
            var correctMonth = this.options.correctMonth(this.getCurrentMonth());
            if (this.goToMonth(null, correctMonth)) {
                return;
            }
            this.template.render(this);
            this.datepicker.updateInput();
        };
        ViewModel.prototype.setActive = function (event, value) {
            if (this.active === value) {
                return true;
            }
            if (!this.triggerOnBeforeOpenAndClose(event, value)) {
                return false;
            }
            this.active = value;
            if (this.options.isHiddenOnBlur()) {
                this.render();
            }
            this.triggerOnOpenAndClose(event, value);
            return true;
        };
        ViewModel.prototype.isActive = function () {
            return this.active;
        };
        ViewModel.prototype.close = function (event) {
            return this.datepicker.close(event);
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
            if (!this.triggerOnBeforeMonthChange(event, month, this.currentMonth)) {
                return false;
            }
            this.currentMonth = month;
            if (!doCancelHighlight || !this.cancelHighlight()) {
                this.render();
            }
            this.triggerOnMonthChange(event, month, this.currentMonth);
            return true;
        };
        ViewModel.prototype.reset = function (event) {
            var isMonthChanged = this.goToMonth(event, this.options.getInitialMonth());
            var isDaySelected = this.selectInitialDate(event);
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
        ViewModel.prototype.selectNearestDate = function (event, date) {
            return this.selectDay(event, this.options.findNearestAvailableDate(date));
        };
        ViewModel.prototype.selectPossibleDate = function () {
            try {
                return this.selectDay(null, this.options.findPossibleAvailableDate(this.selectedDate), false);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection(null, true);
            }
        };
        ViewModel.prototype.selectInitialDate = function (event) {
            try {
                return this.selectDay(event, this.options.getInitialDate(), false);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection(null, true);
            }
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
            var maxLoops = 1000;
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
        ViewModel.prototype.cancelSelection = function (event, force) {
            if (force === void 0) { force = false; }
            if (!this.options.isAllowedEmpty() && !force) {
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
                for (var date_4 = appendDaysCount + 1; days.length < 6 * 7; date_4++) {
                    var day = this.createDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date_4));
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
        ViewModel.prototype.triggerKeyPress = function (event) {
            if (TheDatepicker.Helper.inArray([TheDatepicker.KeyCode.Left, TheDatepicker.KeyCode.Up, TheDatepicker.KeyCode.Right, TheDatepicker.KeyCode.Down], event.keyCode)) {
                TheDatepicker.Helper.preventDefault(event);
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
            var _this = this;
            return this.options.triggerEvent(TheDatepicker.EventType.BeforeSelect, function (listener) {
                return listener.call(_this.datepicker, event, day, previousDay);
            });
        };
        ViewModel.prototype.triggerOnSelect = function (event, day, previousDay) {
            var _this = this;
            this.options.triggerEvent(TheDatepicker.EventType.Select, function (listener) {
                return listener.call(_this.datepicker, event, day, previousDay);
            });
        };
        ViewModel.prototype.triggerOnBeforeOpenAndClose = function (event, isOpening) {
            var _this = this;
            return this.options.triggerEvent(TheDatepicker.EventType.BeforeOpenAndClose, function (listener) {
                return listener.call(_this.datepicker, event, isOpening);
            });
        };
        ViewModel.prototype.triggerOnOpenAndClose = function (event, isOpening) {
            var _this = this;
            this.options.triggerEvent(TheDatepicker.EventType.OpenAndClose, function (listener) {
                return listener.call(_this.datepicker, event, isOpening);
            });
        };
        ViewModel.prototype.triggerOnBeforeMonthChange = function (event, month, previousMonth) {
            var _this = this;
            return this.options.triggerEvent(TheDatepicker.EventType.BeforeMonthChange, function (listener) {
                return listener.call(_this.datepicker, event, month, previousMonth);
            });
        };
        ViewModel.prototype.triggerOnMonthChange = function (event, month, previousMonth) {
            var _this = this;
            this.options.triggerEvent(TheDatepicker.EventType.MonthChange, function (listener) {
                return listener.call(_this.datepicker, event, month, previousMonth);
            });
        };
        ViewModel.prototype.createDay = function (date) {
            date = TheDatepicker.Helper.resetTime(new Date(date.getTime()));
            var today = this.options.getToday();
            var day = new TheDatepicker.Day(date);
            day.isToday = date.getTime() === today.getTime();
            day.isPast = date.getTime() < today.getTime();
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
                        this.isHighlightedDayFocused = false;
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
        function Template(options, htmlHelper, container, hasInput) {
            this.options = options;
            this.htmlHelper = htmlHelper;
            this.container = container;
            this.hasInput = hasInput;
            this.mainElement = null;
            this.controlElement = null;
            this.goBackElement = null;
            this.goForwardElement = null;
            this.titleElement = null;
            this.titleContentElement = null;
            this.resetElement = null;
            this.closeElement = null;
            this.monthSelect = null;
            this.monthElement = null;
            this.yearSelect = null;
            this.yearElement = null;
            this.monthAndYearSelect = null;
            this.monthAndYearElement = null;
            this.weeksElements = [];
            this.daysElements = [];
            this.daysButtonsElements = [];
            this.daysContentsElements = [];
        }
        Template.prototype.render = function (viewModel) {
            if (this.mainElement === null) {
                if (this.hasInput && this.options.isHiddenOnBlur() && !viewModel.isActive()) {
                    return;
                }
                this.container.innerHTML = '';
                this.container.appendChild(this.createSkeleton(viewModel));
            }
            this.updateMainElement(viewModel);
            this.updateTopElement(viewModel);
            this.updateTitleElement(viewModel);
            this.updateCloseElement(viewModel);
            this.updateResetElement(viewModel);
            this.updateGoBackElement(viewModel);
            this.updateGoForwardElement(viewModel);
            this.updateMonthElement(viewModel);
            this.updateYearElement(viewModel);
            this.updateMonthAndYearElement(viewModel);
            this.updateWeeksElements(viewModel);
        };
        Template.prototype.createSkeleton = function (viewModel) {
            var main = this.htmlHelper.createDiv('main');
            main.appendChild(this.createHeaderElement(viewModel));
            main.appendChild(this.createBodyElement(viewModel));
            this.mainElement = main;
            return main;
        };
        Template.prototype.updateMainElement = function (viewModel) {
            this.mainElement.style.display = !this.hasInput || viewModel.isActive() || !this.options.isHiddenOnBlur() ? '' : 'none';
        };
        Template.prototype.createBodyElement = function (viewModel) {
            var body = this.htmlHelper.createDiv('body');
            body.appendChild(this.createTableElement(viewModel));
            return body;
        };
        Template.prototype.createHeaderElement = function (viewModel) {
            var header = this.htmlHelper.createDiv('header');
            var top = this.htmlHelper.createDiv('top');
            header.appendChild(top);
            top.appendChild(this.createTitleElement(viewModel));
            var control = this.htmlHelper.createDiv('control');
            top.appendChild(control);
            control.appendChild(this.createResetElement(viewModel));
            control.appendChild(this.createCloseElement(viewModel));
            var navigation = this.htmlHelper.createDiv('navigation');
            header.appendChild(navigation);
            navigation.appendChild(this.createGoBackElement(viewModel));
            var state = this.htmlHelper.createDiv('state');
            navigation.appendChild(state);
            if (this.options.isMonthAndYearSeparated()) {
                state.appendChild(this.createMonthElement(viewModel));
                state.appendChild(this.createYearElement(viewModel));
            }
            else {
                state.appendChild(this.createMonthAndYearElement(viewModel));
            }
            navigation.appendChild(this.createGoForwardElement(viewModel));
            this.controlElement = control;
            return header;
        };
        Template.prototype.updateTopElement = function (viewModel) {
            var isVisible = this.options.getTitle() !== ''
                || this.options.isResetButtonShown()
                || (this.hasInput && this.options.isCloseButtonShown());
            this.controlElement.style.display = isVisible ? '' : 'none';
            this.titleElement.style.display = isVisible ? '' : 'none';
        };
        Template.prototype.createTitleElement = function (viewModel) {
            var titleElement = this.htmlHelper.createDiv('title');
            var titleContent = this.htmlHelper.createSpan();
            titleElement.appendChild(titleContent);
            this.htmlHelper.addClass(titleContent, 'title-content');
            this.titleElement = titleElement;
            this.titleContentElement = titleContent;
            return titleElement;
        };
        Template.prototype.updateTitleElement = function (viewModel) {
            var title = this.options.getTitle();
            this.titleContentElement.style.display = title !== '' ? '' : 'none';
            this.titleContentElement.innerText = title;
        };
        Template.prototype.createResetElement = function (viewModel) {
            var resetElement = this.htmlHelper.createDiv('reset');
            var resetButton = this.htmlHelper.createAnchor(function (event) {
                viewModel.reset(event);
            });
            resetButton.innerHTML = this.options.getResetHtml();
            resetElement.appendChild(resetButton);
            this.resetElement = resetElement;
            return resetElement;
        };
        Template.prototype.updateResetElement = function (viewModel) {
            this.resetElement.style.display = this.options.isResetButtonShown() ? '' : 'none';
        };
        Template.prototype.createCloseElement = function (viewModel) {
            var closeElement = this.htmlHelper.createDiv('close');
            var closeButton = this.htmlHelper.createAnchor(function (event) {
                viewModel.close(event);
            });
            closeButton.innerHTML = this.options.getCloseHtml();
            closeElement.appendChild(closeButton);
            this.closeElement = closeElement;
            return closeElement;
        };
        Template.prototype.updateCloseElement = function (viewModel) {
            this.closeElement.style.display = this.hasInput && this.options.isCloseButtonShown() ? '' : 'none';
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
            goButton.innerHTML = directionForward ? this.options.getGoForwardHtml() : this.options.getGoBackHtml();
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
            var _this = this;
            var options = [];
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                options.push({
                    value: monthNumber + '',
                    label: this.options.translator.translateMonth(monthNumber)
                });
            }
            var selectElement = this.htmlHelper.createSelectInput(options, function (event, monthNumber) {
                var currentMonth = viewModel.getCurrentMonth();
                var newMonth = new Date(currentMonth.getTime());
                newMonth.setMonth(parseInt(monthNumber, 10));
                if (!viewModel.goToMonth(event, newMonth)) {
                    _this.monthSelect.value = currentMonth.getMonth() + '';
                }
            });
            var monthElement = this.htmlHelper.createDiv('month');
            var monthContent = this.htmlHelper.createSpan();
            monthElement.appendChild(selectElement);
            monthElement.appendChild(monthContent);
            this.monthElement = monthContent;
            this.monthSelect = selectElement;
            return monthElement;
        };
        Template.prototype.updateMonthElement = function (viewModel) {
            if (this.monthElement === null) {
                return;
            }
            var currentMonth = viewModel.getCurrentMonth().getMonth();
            this.monthElement.innerText = this.options.translator.translateMonth(currentMonth);
            if (!this.options.isMonthAsDropdown()) {
                this.monthSelect.style.display = 'none';
                this.monthElement.style.display = '';
                return;
            }
            var valuesCount = 0;
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                var newMonth = new Date(viewModel.getCurrentMonth().getTime());
                newMonth.setMonth(monthNumber);
                var option = this.monthSelect.getElementsByTagName('option')[monthNumber];
                var canGoToMonth = viewModel.canGoToMonth(newMonth);
                option.disabled = !canGoToMonth;
                option.style.display = canGoToMonth ? '' : 'none';
                valuesCount += canGoToMonth ? 1 : 0;
            }
            this.monthSelect.value = currentMonth + '';
            this.monthSelect.style.display = valuesCount > 1 ? '' : 'none';
            this.monthElement.style.display = valuesCount > 1 ? 'none' : '';
        };
        Template.prototype.createYearElement = function (viewModel) {
            var _this = this;
            var selectElement = this.htmlHelper.createSelectInput([], function (event, year) {
                var currentMonth = viewModel.getCurrentMonth();
                var newMonth = new Date(currentMonth.getTime());
                newMonth.setFullYear(parseInt(year, 10));
                var minMonth = _this.options.getMinMonth();
                var maxMonth = _this.options.getMaxMonth();
                if (minMonth !== null && newMonth.getTime() < minMonth.getTime()) {
                    newMonth = minMonth;
                }
                if (maxMonth !== null && newMonth.getTime() > maxMonth.getTime()) {
                    newMonth = maxMonth;
                }
                if (!viewModel.goToMonth(event, newMonth)) {
                    _this.yearSelect.value = currentMonth.getFullYear() + '';
                }
            });
            var yearElement = this.htmlHelper.createDiv('year');
            var yearContent = this.htmlHelper.createSpan();
            yearElement.appendChild(selectElement);
            yearElement.appendChild(yearContent);
            this.yearElement = yearContent;
            this.yearSelect = selectElement;
            return yearElement;
        };
        Template.prototype.updateYearElement = function (viewModel) {
            if (this.yearElement === null) {
                return;
            }
            var currentYear = viewModel.getCurrentMonth().getFullYear();
            this.yearElement.innerText = currentYear + '';
            if (!this.options.isYearAsDropdown()) {
                this.yearSelect.style.display = 'none';
                this.yearElement.style.display = '';
                return;
            }
            var minDate = this.options.getMinDate();
            var maxDate = this.options.getMaxDate();
            var minYear = minDate !== null ? minDate.getFullYear() : null;
            var maxYear = maxDate !== null ? maxDate.getFullYear() : null;
            var range = this.calculateDropdownRange(currentYear, minYear, maxYear);
            var options = this.yearSelect.getElementsByTagName('option');
            var diff = this.calculateDropdownDiff(options, range, function (value) {
                return parseInt(value, 10);
            });
            for (var index = 0; index < diff.remove.length; index++) {
                this.yearSelect.removeChild(diff.remove[index]);
            }
            for (var index = diff.prepend.length - 1; index >= 0; index--) {
                this.yearSelect.insertBefore(this.htmlHelper.createSelectOption(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearSelect.firstChild);
            }
            for (var index = 0; index < diff.append.length; index++) {
                this.yearSelect.appendChild(this.htmlHelper.createSelectOption(diff.append[index] + '', diff.append[index] + ''));
            }
            this.yearSelect.value = currentYear + '';
            this.yearSelect.style.display = range.from < range.to ? '' : 'none';
            this.yearElement.style.display = range.from < range.to ? 'none' : '';
        };
        Template.prototype.createMonthAndYearElement = function (viewModel) {
            var _this = this;
            var monthAndYear = this.htmlHelper.createDiv('month-year');
            var selectElement = this.htmlHelper.createSelectInput([], function (event, value) {
                var currentMonth = viewModel.getCurrentMonth();
                var newMonth = new Date(currentMonth.getTime());
                var data = _this.parseMonthAndYearOptionValue(value);
                newMonth.setFullYear(data.year);
                newMonth.setMonth(data.month);
                if (!viewModel.goToMonth(event, newMonth)) {
                    _this.monthAndYearSelect.value = _this.getMonthAndYearOptionValue({
                        month: currentMonth.getMonth(),
                        year: currentMonth.getFullYear()
                    });
                }
            });
            var monthAndYearContent = this.htmlHelper.createSpan();
            this.monthAndYearElement = monthAndYearContent;
            this.monthAndYearSelect = selectElement;
            monthAndYear.appendChild(monthAndYearContent);
            monthAndYear.appendChild(selectElement);
            return monthAndYear;
        };
        Template.prototype.updateMonthAndYearElement = function (viewModel) {
            var _this = this;
            if (this.monthAndYearElement === null) {
                return;
            }
            var currentMonth = viewModel.getCurrentMonth();
            var currentData = {
                month: currentMonth.getMonth(),
                year: currentMonth.getFullYear()
            };
            var currentIndex = this.calculateMonthAndYearIndex(currentData);
            this.monthAndYearElement.innerText = this.translateMonthAndYear(currentData);
            if (!this.options.isYearAsDropdown() || !this.options.isMonthAsDropdown()) {
                this.monthAndYearSelect.style.display = 'none';
                this.monthAndYearElement.style.display = '';
                return;
            }
            var minDate = this.options.getMinDate();
            var maxDate = this.options.getMaxDate();
            var minIndex = minDate !== null ? minDate.getFullYear() * 12 + minDate.getMonth() : null;
            var maxIndex = maxDate !== null ? maxDate.getFullYear() * 12 + maxDate.getMonth() : null;
            var range = this.calculateDropdownRange(currentIndex, minIndex, maxIndex);
            var options = this.monthAndYearSelect.getElementsByTagName('option');
            var diff = this.calculateDropdownDiff(options, range, function (value) {
                return _this.calculateMonthAndYearIndex(_this.parseMonthAndYearOptionValue(value));
            });
            for (var index = 0; index < diff.remove.length; index++) {
                this.monthAndYearSelect.removeChild(diff.remove[index]);
            }
            for (var index = diff.prepend.length - 1; index >= 0; index--) {
                var data = this.getMonthAndYearByIndex(diff.prepend[index]);
                this.monthAndYearSelect.insertBefore(this.htmlHelper.createSelectOption(this.getMonthAndYearOptionValue(data), this.translateMonthAndYear(data)), this.monthAndYearSelect.firstChild);
            }
            for (var index = 0; index < diff.append.length; index++) {
                var data = this.getMonthAndYearByIndex(diff.append[index]);
                this.monthAndYearSelect.appendChild(this.htmlHelper.createSelectOption(this.getMonthAndYearOptionValue(data), this.translateMonthAndYear(data)));
            }
            this.monthAndYearSelect.value = this.getMonthAndYearOptionValue(currentData);
            this.monthAndYearSelect.style.display = range.from < range.to ? '' : 'none';
            this.monthAndYearElement.style.display = range.from < range.to ? 'none' : '';
        };
        Template.prototype.translateMonthAndYear = function (data) {
            return this.options.translator.translateMonth(data.month) + ' ' + data.year;
        };
        Template.prototype.calculateMonthAndYearIndex = function (data) {
            return data.year * 12 + data.month;
        };
        Template.prototype.getMonthAndYearByIndex = function (index) {
            return {
                year: Math.floor(index / 12),
                month: index % 12
            };
        };
        Template.prototype.getMonthAndYearOptionValue = function (data) {
            return data.year + '-' + data.month;
        };
        Template.prototype.parseMonthAndYearOptionValue = function (value) {
            var parts = value.split('-');
            return {
                month: parseInt(parts[1], 10),
                year: parseInt(parts[0], 10)
            };
        };
        Template.prototype.calculateDropdownRange = function (current, min, max) {
            var limit = this.options.getDropdownItemsLimit() - 1;
            var maxAppend = Math.ceil(limit / 2);
            var from = current - (limit - maxAppend);
            var to = current + maxAppend;
            if (min !== null && from < min) {
                to += min - from;
                if (max !== null && to > max) {
                    to = max;
                }
                from = min;
            }
            else if (max !== null && to > max) {
                from -= to - max;
                if (min !== null && from < min) {
                    from = min;
                }
                to = max;
            }
            return {
                from: from,
                to: to
            };
        };
        Template.prototype.calculateDropdownDiff = function (options, newRange, getNumerical) {
            var firstOption = options.length > 0 ? getNumerical(options[0].value) : null;
            var lastOption = options.length > 0 ? getNumerical(options[options.length - 1].value) : null;
            var prepend = [];
            var append = [];
            var remove = [];
            for (var value = newRange.from; value <= newRange.to; value++) {
                if (firstOption === null || value < firstOption) {
                    prepend.push(value);
                }
                else if (value > lastOption) {
                    append.push(value);
                }
            }
            for (var index = 0; index < options.length; index++) {
                var value = getNumerical(options[index].value);
                if (value < newRange.from || value > newRange.to) {
                    remove.push(options[index]);
                }
            }
            return {
                prepend: prepend,
                append: append,
                remove: remove
            };
        };
        Template.prototype.createTableElement = function (viewModel) {
            var tableHeader = this.createTableHeaderElement(viewModel);
            var tableBody = this.createTableBodyElement(viewModel);
            return this.htmlHelper.createTable('calendar', tableHeader, tableBody);
        };
        Template.prototype.createTableHeaderElement = function (viewModel) {
            var weekDays = viewModel.getWeekDays();
            var cells = [];
            for (var index = 0; index < weekDays.length; index++) {
                var dayOfWeek = weekDays[index];
                cells.push(this.createTableHeaderCellElement(viewModel, dayOfWeek));
            }
            return this.htmlHelper.createTableHeader('calendar-header', cells);
        };
        Template.prototype.createTableHeaderCellElement = function (viewModel, dayOfWeek) {
            var headerCell = this.htmlHelper.createTableHeaderCell('week-day');
            if (dayOfWeek === TheDatepicker.DayOfWeek.Saturday || dayOfWeek === TheDatepicker.DayOfWeek.Sunday) {
                this.htmlHelper.addClass(headerCell, 'week-day--weekend');
            }
            headerCell.innerText = this.options.translator.translateDayOfWeek(dayOfWeek);
            return headerCell;
        };
        Template.prototype.createTableBodyElement = function (viewModel) {
            this.daysElements = [];
            this.daysButtonsElements = [];
            this.daysContentsElements = [];
            var rows = [];
            for (var index = 0; index < 6; index++) {
                rows.push(this.createTableRowElement(viewModel));
            }
            this.weeksElements = rows;
            return this.htmlHelper.createTableBody('calendar-body', rows);
        };
        Template.prototype.updateWeeksElements = function (viewModel) {
            var weeks = viewModel.getWeeks();
            for (var weekIndex = 0; weekIndex < this.weeksElements.length; weekIndex++) {
                var weekElement = this.weeksElements[weekIndex];
                var week = weeks.length > weekIndex ? weeks[weekIndex] : null;
                weekElement.style.display = week !== null ? '' : 'none';
                if (week !== null) {
                    for (var dayIndex = 0; dayIndex < this.daysElements[weekIndex].length; dayIndex++) {
                        this.updateDayElement(viewModel, this.daysElements[weekIndex][dayIndex], this.daysButtonsElements[weekIndex][dayIndex], this.daysContentsElements[weekIndex][dayIndex], week[dayIndex]);
                    }
                }
            }
        };
        Template.prototype.createTableRowElement = function (viewModel) {
            var cells = [];
            var cellsButtons = [];
            var cellsContents = [];
            for (var index = 0; index < 7; index++) {
                var cell = this.htmlHelper.createTableCell();
                var cellButton = this.createTableCellButtonElement(viewModel);
                var cellContent = this.createTableCellContentElement(viewModel);
                cells.push(cell);
                cellsButtons.push(cellButton);
                cellsContents.push(cellContent);
                cell.appendChild(cellButton);
                cellButton.appendChild(cellContent);
            }
            this.daysElements.push(cells);
            this.daysButtonsElements.push(cellsButtons);
            this.daysContentsElements.push(cellsContents);
            return this.htmlHelper.createTableRow('week', cells);
        };
        Template.prototype.updateDayElement = function (viewModel, dayElement, dayButtonElement, dayContentElement, day) {
            dayButtonElement.day = day;
            dayElement.setAttribute('data-date', day.getFormatted());
            dayElement.className = '';
            this.htmlHelper.addClass(dayElement, 'cell');
            if (!day.isInCurrentMonth && !this.options.areDaysOutOfMonthVisible()) {
                dayContentElement.innerHTML = '&nbsp;';
                dayButtonElement.removeAttribute('href');
                dayButtonElement.style.visibility = 'hidden';
                return;
            }
            this.htmlHelper.addClass(dayElement, 'day');
            if (day.isToday) {
                this.htmlHelper.addClass(dayElement, 'day--today');
            }
            if (day.isPast) {
                this.htmlHelper.addClass(dayElement, 'day--past');
            }
            if (day.isWeekend) {
                this.htmlHelper.addClass(dayElement, 'day--weekend');
            }
            if (!day.isAvailable) {
                this.htmlHelper.addClass(dayElement, 'day--unavailable');
            }
            if (!day.isInCurrentMonth) {
                this.htmlHelper.addClass(dayElement, 'day--outside');
            }
            if (day.isHighlighted) {
                this.htmlHelper.addClass(dayElement, 'day--highlighted');
            }
            if (day.isSelected) {
                this.htmlHelper.addClass(dayElement, 'day--selected');
            }
            var customClasses = this.options.getCellClasses(day);
            for (var index = 0; index < customClasses.length; index++) {
                dayElement.className += ' ' + customClasses[index];
            }
            dayButtonElement.style.visibility = 'visible';
            dayContentElement.innerText = this.options.getCellContent(day);
            if (day.isAvailable) {
                dayButtonElement.href = '#';
            }
            else {
                dayButtonElement.removeAttribute('href');
            }
            if (day.isFocused) {
                dayButtonElement.focus();
            }
        };
        Template.prototype.createTableCellButtonElement = function (viewModel) {
            var _this = this;
            var cellButton = this.htmlHelper.createAnchor(function (event) {
                var previous = viewModel.selectedDate;
                var isSelected = viewModel.selectDay(event, cellButton.day, false, true, true);
                if (_this.options.isHiddenOnSelect() && (isSelected || (previous !== null && cellButton.day.isEqualToDate(previous)))) {
                    viewModel.close(event);
                }
            });
            cellButton.onfocus = function (event) {
                viewModel.highlightDay(event || window.event, cellButton.day);
            };
            cellButton.onmouseenter = function () {
                viewModel.cancelHighlight();
            };
            cellButton.onmouseleave = function () {
                viewModel.cancelHighlight();
            };
            return cellButton;
        };
        Template.prototype.createTableCellContentElement = function (viewModel) {
            var cellContent = this.htmlHelper.createSpan();
            this.htmlHelper.addClass(cellContent, 'day-content');
            return cellContent;
        };
        return Template;
    }());
    TheDatepicker.Template = Template;
})(TheDatepicker || (TheDatepicker = {}));
