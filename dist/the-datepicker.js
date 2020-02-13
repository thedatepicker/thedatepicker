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
    var DateConverter_ = (function () {
        function DateConverter_(options_) {
            this.options_ = options_;
            this.escapeChar_ = '\\';
        }
        DateConverter_.prototype.formatDate_ = function (format, date) {
            if (date === null) {
                return null;
            }
            var escapeNext = false;
            var result = '';
            for (var position = 0; position < format.length; position++) {
                var char = format.substring(position, position + 1);
                if (escapeNext) {
                    result += char;
                    escapeNext = false;
                    continue;
                }
                if (char === this.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                var formatter = this.getFormatter_(char);
                if (formatter !== null) {
                    result += formatter.call(this, date);
                    continue;
                }
                result += char;
            }
            return result;
        };
        DateConverter_.prototype.parseDate_ = function (format, text) {
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
                else if (char === this.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                else {
                    var parser = this.getParser_(char);
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
        DateConverter_.prototype.getFormatter_ = function (type) {
            switch (type) {
                case 'j':
                    return this.formatDay_;
                case 'd':
                    return this.formatDayWithLeadingZero_;
                case 'D':
                    return this.formatDayOfWeekTextual_;
                case 'n':
                    return this.formatMonth_;
                case 'm':
                    return this.formatMonthWithLeadingZero_;
                case 'F':
                    return this.formatMonthTextual_;
                case 'Y':
                    return this.formatYear_;
                case 'y':
                    return this.formatYearTwoDigits_;
                default:
                    return null;
            }
        };
        DateConverter_.prototype.formatDay_ = function (date) {
            return date.getDate() + '';
        };
        DateConverter_.prototype.formatDayWithLeadingZero_ = function (date) {
            return ('0' + date.getDate()).slice(-2);
        };
        DateConverter_.prototype.formatDayOfWeekTextual_ = function (date) {
            return this.options_.translator.translateDayOfWeek(date.getDay());
        };
        DateConverter_.prototype.formatMonth_ = function (date) {
            return (date.getMonth() + 1) + '';
        };
        DateConverter_.prototype.formatMonthWithLeadingZero_ = function (date) {
            return ('0' + (date.getMonth() + 1)).slice(-2);
        };
        DateConverter_.prototype.formatMonthTextual_ = function (date) {
            return this.options_.translator.translateMonth(date.getMonth());
        };
        DateConverter_.prototype.formatYear_ = function (date) {
            return date.getFullYear() + '';
        };
        DateConverter_.prototype.formatYearTwoDigits_ = function (date) {
            var year = date.getFullYear() + '';
            return year.substring(year.length - 2);
        };
        DateConverter_.prototype.getParser_ = function (type) {
            switch (type) {
                case 'j':
                case 'd':
                    return this.parseDay_;
                case 'D':
                    return this.parseDayOfWeekTextual_;
                case 'n':
                case 'm':
                    return this.parseMonth_;
                case 'F':
                    return this.parseMonthTextual_;
                case 'Y':
                    return this.parseYear_;
                case 'y':
                    return this.parseYearTwoDigits_;
                default:
                    return null;
            }
        };
        DateConverter_.prototype.parseDay_ = function (text, dateData) {
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
        DateConverter_.prototype.parseDayOfWeekTextual_ = function (text) {
            var maxLength = 0;
            for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                var translation = this.options_.translator.translateDayOfWeek(dayOfWeek);
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
        DateConverter_.prototype.parseMonth_ = function (text, dateData) {
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
        DateConverter_.prototype.parseMonthTextual_ = function (text, dateData) {
            for (var month = 1; month <= 12; month++) {
                var translation = this.options_.translator.translateMonth(month - 1);
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()) {
                    dateData.month = month;
                    return translation.length;
                }
            }
            throw new CannotParseDateException();
        };
        DateConverter_.prototype.parseYear_ = function (text, dateData) {
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
        DateConverter_.prototype.parseYearTwoDigits_ = function (text, dateData) {
            var yearEnd = text.substring(0, 2);
            if (!/[0-9]{2}/.test(yearEnd)) {
                throw new CannotParseDateException();
            }
            var currentYear = (this.options_.getToday()).getFullYear() + '';
            var yearBeginning = currentYear.substring(0, currentYear.length - 2);
            dateData.year = parseInt(yearBeginning + yearEnd, 10);
            return 2;
        };
        return DateConverter_;
    }());
    TheDatepicker.DateConverter_ = DateConverter_;
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
            this.initializationPhase_ = InitializationPhase.Untouched;
            this.inputListenerRemover_ = null;
            this.listenerRemovers_ = [];
            this.deselectElement_ = null;
            if (input !== null && !TheDatepicker.Helper_.isElement_(input)) {
                throw new Error('Input was expected to be null or an HTMLElement.');
            }
            if (container !== null && !TheDatepicker.Helper_.isElement_(container)) {
                throw new Error('Container was expected to be null or an HTMLElement.');
            }
            if (input === null && container === null) {
                throw new Error('At least one of input or container is mandatory.');
            }
            if (options !== null && !(options instanceof TheDatepicker.Options)) {
                throw new Error('Options was expected to be an instance of Options');
            }
            this.document_ = document;
            this.options = options !== null ? options.clone() : new TheDatepicker.Options();
            var duplicateError = 'There is already a datepicker present on ';
            this.isContainerExternal_ = container !== null;
            if (container === null) {
                container = this.createContainer_();
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
            }
            this.isInputTextBox_ = input !== null
                && (typeof HTMLInputElement !== 'undefined' ? input instanceof HTMLInputElement : true)
                && input.type === 'text';
            if (this.isInputTextBox_) {
                input.autocomplete = 'off';
            }
            container.datepicker = this;
            this.input = input;
            this.container = container;
            this.dateConverter_ = new TheDatepicker.DateConverter_(this.options);
            this.viewModel_ = new TheDatepicker.ViewModel_(this.options, this);
            this.triggerReady_(input);
            this.triggerReady_(container);
        }
        Datepicker.prototype.render = function () {
            var _this = this;
            switch (this.initializationPhase_) {
                case InitializationPhase.Destroyed:
                    return;
                case InitializationPhase.Initialized:
                    this.viewModel_.render_();
                    return;
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
                    if (this.input !== null && this.options.isHiddenOnBlur()) {
                        if (this.input === this.document_.activeElement) {
                            this.initializationPhase_ = InitializationPhase.Ready;
                            this.render();
                            this.open();
                            return;
                        }
                        this.inputListenerRemover_ = TheDatepicker.Helper_.addEventListener_(this.input, TheDatepicker.ListenerType_.Focus, function (event) {
                            _this.open(event);
                        });
                        this.initializationPhase_ = InitializationPhase.Waiting;
                        return;
                    }
                    this.initializationPhase_ = InitializationPhase.Ready;
                    this.render();
            }
        };
        Datepicker.prototype.open = function (event) {
            if (event === void 0) { event = null; }
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
            if (this.input !== null) {
                this.input.focus();
            }
            return true;
        };
        Datepicker.prototype.isOpened = function () {
            return this.viewModel_.isActive_();
        };
        Datepicker.prototype.close = function (event) {
            if (event === void 0) { event = null; }
            if (!this.viewModel_.isActive_()) {
                return true;
            }
            if (!Datepicker.activateViewModel_(event, null)) {
                return false;
            }
            if (this.input !== null) {
                this.input.blur();
            }
            return true;
        };
        Datepicker.prototype.reset = function (event) {
            if (event === void 0) { event = null; }
            return this.viewModel_.reset_(event);
        };
        Datepicker.prototype.destroy = function () {
            if (this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            for (var index = 0; index < this.listenerRemovers_.length; index++) {
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
            if (this.input !== null) {
                delete this.input.datepicker;
                this.removeInitialInputListener_();
                this.input = null;
            }
            if (this.deselectElement_ !== null) {
                this.deselectElement_.parentNode.removeChild(this.deselectElement_);
                this.deselectElement_ = null;
            }
            this.initializationPhase_ = InitializationPhase.Destroyed;
        };
        Datepicker.prototype.selectDate = function (date, doUpdateMonth, event) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (event === void 0) { event = null; }
            return this.viewModel_.selectDay_(event, TheDatepicker.Helper_.normalizeDate_('Date', date, this.options), doUpdateMonth);
        };
        Datepicker.prototype.getSelectedDate = function () {
            return this.viewModel_.selectedDate_ !== null ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
        };
        Datepicker.prototype.getSelectedDateFormatted = function () {
            return this.dateConverter_.formatDate_(this.options.getInputFormat(), this.viewModel_.selectedDate_);
        };
        Datepicker.prototype.getCurrentMonth = function () {
            return this.viewModel_.getCurrentMonth_();
        };
        Datepicker.prototype.goToMonth = function (month, event) {
            if (event === void 0) { event = null; }
            return this.viewModel_.goToMonth_(event, TheDatepicker.Helper_.normalizeDate_('Month', month, this.options));
        };
        Datepicker.prototype.parseRawInput = function () {
            return this.isInputTextBox_
                ? this.dateConverter_.parseDate_(this.options.getInputFormat(), this.input.value)
                : null;
        };
        Datepicker.prototype.readInput_ = function (event) {
            if (event === void 0) { event = null; }
            if (!this.isInputTextBox_) {
                return false;
            }
            try {
                var date = this.parseRawInput();
                return date !== null
                    ? this.viewModel_.selectNearestDate_(event, date)
                    : this.viewModel_.cancelSelection_(event);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.CannotParseDateException)) {
                    throw error;
                }
                return false;
            }
        };
        Datepicker.prototype.updateInput_ = function () {
            if (!this.isInputTextBox_ || this.input === this.document_.activeElement) {
                return;
            }
            this.input.value = this.dateConverter_.formatDate_(this.options.getInputFormat(), this.viewModel_.selectedDate_) || '';
            if (this.deselectElement_ !== null) {
                var isVisible = this.options.isDeselectButtonShown() && this.input.value !== '';
                this.deselectElement_.style.visibility = isVisible ? 'visible' : 'hidden';
            }
        };
        Datepicker.onDatepickerReady = function (element, callback) {
            if (callback === void 0) { callback = null; }
            var promise = null;
            var promiseResolve = null;
            if (typeof Promise !== 'undefined') {
                promise = new Promise(function (resolve) {
                    promiseResolve = resolve;
                });
            }
            if (typeof element.datepicker !== 'undefined' && element.datepicker instanceof Datepicker) {
                element.datepicker.triggerReadyListener_(callback, element);
                if (promiseResolve !== null) {
                    promiseResolve(element.datepicker);
                }
            }
            else {
                Datepicker.readyListeners_.push({
                    promiseResolve: promiseResolve,
                    element: element,
                    callback: callback
                });
            }
            return promise;
        };
        ;
        Datepicker.prototype.createContainer_ = function () {
            var container = this.document_.createElement('div');
            container.className = this.options.getClassesPrefix() + 'container';
            container.style.position = 'absolute';
            container.style.zIndex = '99';
            return container;
        };
        Datepicker.prototype.createDeselectElement_ = function () {
            var _this = this;
            if (!this.isInputTextBox_ || !this.options.isDeselectButtonShown() || this.deselectElement_ !== null) {
                return null;
            }
            var deselectElement = this.document_.createElement('span');
            deselectElement.style.position = 'absolute';
            var deselectButton = this.document_.createElement('a');
            deselectButton.innerHTML = this.options.getDeselectHtml();
            deselectButton.style.position = 'relative';
            deselectButton.style.left = '-0.8em';
            deselectButton.href = '#';
            deselectButton.onclick = function (event) {
                event = event || window.event;
                TheDatepicker.Helper_.preventDefault_(event);
                _this.viewModel_.cancelSelection_(event);
            };
            deselectElement.className = this.options.getClassesPrefix() + 'deselect';
            deselectButton.className = this.options.getClassesPrefix() + 'deselect-button';
            deselectElement.appendChild(deselectButton);
            this.input.parentNode.insertBefore(deselectElement, this.input.nextSibling);
            this.deselectElement_ = deselectElement;
        };
        Datepicker.prototype.preselectFromInput_ = function () {
            if (this.isInputTextBox_) {
                try {
                    var date = this.parseRawInput();
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
        Datepicker.prototype.initListeners_ = function () {
            var _this = this;
            if (!Datepicker.areGlobalListenersInitialized_) {
                var activeViewModel = null;
                var checkMiss = function (event) {
                    if (Datepicker.hasClickedViewModel_) {
                        Datepicker.hasClickedViewModel_ = false;
                    }
                    else {
                        Datepicker.activateViewModel_(event, null);
                    }
                };
                TheDatepicker.Helper_.addEventListener_(this.document_, TheDatepicker.ListenerType_.MouseDown, checkMiss);
                TheDatepicker.Helper_.addEventListener_(this.document_, TheDatepicker.ListenerType_.FocusIn, checkMiss);
                TheDatepicker.Helper_.addEventListener_(this.document_, TheDatepicker.ListenerType_.KeyDown, function (event) {
                    if (Datepicker.activeViewModel_ !== null) {
                        Datepicker.activeViewModel_.triggerKeyPress_(event);
                    }
                });
                Datepicker.areGlobalListenersInitialized_ = true;
            }
            this.removeInitialInputListener_();
            var hit = function (event) {
                Datepicker.activateViewModel_(event, _this);
                Datepicker.hasClickedViewModel_ = true;
            };
            this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.container, TheDatepicker.ListenerType_.MouseDown, hit));
            this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.container, TheDatepicker.ListenerType_.FocusIn, hit));
            if (this.deselectElement_ !== null) {
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.deselectElement_, TheDatepicker.ListenerType_.MouseDown, hit));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.deselectElement_, TheDatepicker.ListenerType_.FocusIn, hit));
            }
            if (this.input !== null) {
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.input, TheDatepicker.ListenerType_.MouseDown, hit));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.input, TheDatepicker.ListenerType_.Focus, hit));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.input, TheDatepicker.ListenerType_.Blur, function () {
                    _this.updateInput_();
                }));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.input, TheDatepicker.ListenerType_.KeyDown, function (event) {
                    TheDatepicker.Helper_.stopPropagation_(event);
                }));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.input, TheDatepicker.ListenerType_.KeyUp, function (event) {
                    _this.readInput_(event);
                }));
            }
        };
        Datepicker.prototype.removeInitialInputListener_ = function () {
            if (this.inputListenerRemover_ !== null) {
                this.inputListenerRemover_();
                this.inputListenerRemover_ = null;
            }
        };
        Datepicker.prototype.triggerReady_ = function (element) {
            for (var index = Datepicker.readyListeners_.length - 1; index >= 0; index--) {
                var listener = Datepicker.readyListeners_[index];
                if (listener.element === element) {
                    this.triggerReadyListener_(listener.callback, element);
                    if (listener.promiseResolve !== null) {
                        listener.promiseResolve(this);
                    }
                    Datepicker.readyListeners_.splice(index, 1);
                }
            }
        };
        Datepicker.prototype.triggerReadyListener_ = function (callback, element) {
            if (callback !== null) {
                callback.call(element, this, element);
            }
        };
        Datepicker.prototype.fixPosition_ = function () {
            if (this.isContainerExternal_ || this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            var windowTop = window.pageYOffset || this.document_.documentElement.scrollTop;
            var windowLeft = window.pageXOffset || this.document_.documentElement.scrollLeft;
            var windowHeight = window.innerHeight || Math.max(this.document_.documentElement.clientHeight, this.document_.body.clientHeight);
            var windowWidth = window.innerWidth || Math.max(this.document_.documentElement.clientWidth, this.document_.body.clientWidth);
            var windowBottom = windowTop + windowHeight;
            var windowRight = windowLeft + windowWidth;
            var inputTop = 0;
            var inputLeft = 0;
            var parentElement = this.input;
            while (parentElement !== null && !isNaN(parentElement.offsetLeft) && !isNaN(parentElement.offsetTop)) {
                inputTop += parentElement.offsetTop - (parentElement.scrollTop || 0);
                inputLeft += parentElement.offsetLeft - (parentElement.scrollLeft || 0);
                parentElement = parentElement.offsetParent;
            }
            var mainElement = null;
            if (this.options.isPositionFixingEnabled() && this.container.childNodes.length > 0) {
                mainElement = this.container.childNodes[0];
                mainElement.style.position = '';
                mainElement.style.top = '';
                mainElement.style.left = '';
            }
            var inputWidth = this.input.offsetWidth;
            var inputHeight = this.input.offsetHeight;
            var inputBottom = inputTop + inputHeight;
            var inputRight = inputLeft + inputWidth;
            var containerHeight = this.container.offsetHeight;
            var containerWidth = this.container.offsetWidth;
            var locationClass = '';
            var locateOver = inputTop - windowTop > containerHeight && windowBottom - inputBottom < containerHeight;
            var locateLeft = inputLeft - windowLeft > containerWidth - inputWidth && windowRight - inputRight < containerWidth - inputWidth;
            if (locateOver) {
                locationClass += ' ' + this.options.getClassesPrefix() + 'container--over';
            }
            if (locateLeft) {
                locationClass += ' ' + this.options.getClassesPrefix() + 'container--left';
            }
            this.container.className = this.options.getClassesPrefix() + 'container' + locationClass;
            if (mainElement !== null && (locateOver || locateLeft)) {
                if (locateOver) {
                    var moveTop = inputHeight + containerHeight;
                    mainElement.style.top = '-' + moveTop + 'px';
                }
                if (locateLeft) {
                    var moveLeft = containerWidth - inputWidth;
                    mainElement.style.left = '-' + moveLeft + 'px';
                }
                mainElement.style.position = 'absolute';
            }
        };
        Datepicker.activateViewModel_ = function (event, datepicker) {
            var viewModel = datepicker !== null ? datepicker.viewModel_ : null;
            var activeViewModel = Datepicker.activeViewModel_;
            if (activeViewModel === viewModel) {
                return true;
            }
            if (activeViewModel !== null && !activeViewModel.setActive_(event, false)) {
                return false;
            }
            if (Datepicker.activeViewModel_ !== activeViewModel) {
                return true;
            }
            if (viewModel === null) {
                Datepicker.activeViewModel_ = null;
                return true;
            }
            if (!viewModel.setActive_(event, true)) {
                return false;
            }
            if (Datepicker.activeViewModel_ !== activeViewModel) {
                return true;
            }
            datepicker.fixPosition_();
            Datepicker.activeViewModel_ = viewModel;
            return true;
        };
        Datepicker.readyListeners_ = [];
        Datepicker.areGlobalListenersInitialized_ = false;
        Datepicker.activeViewModel_ = null;
        Datepicker.hasClickedViewModel_ = false;
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
            this.isVisible = true;
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
    var KeyCode_;
    (function (KeyCode_) {
        KeyCode_[KeyCode_["Enter"] = 13] = "Enter";
        KeyCode_[KeyCode_["Space"] = 32] = "Space";
        KeyCode_[KeyCode_["Left"] = 37] = "Left";
        KeyCode_[KeyCode_["Up"] = 38] = "Up";
        KeyCode_[KeyCode_["Right"] = 39] = "Right";
        KeyCode_[KeyCode_["Down"] = 40] = "Down";
    })(KeyCode_ = TheDatepicker.KeyCode_ || (TheDatepicker.KeyCode_ = {}));
    var ListenerType_;
    (function (ListenerType_) {
        ListenerType_["MouseDown"] = "mousedown";
        ListenerType_["Focus"] = "focus";
        ListenerType_["FocusIn"] = "focusin";
        ListenerType_["Blur"] = "blur";
        ListenerType_["KeyDown"] = "keydown";
        ListenerType_["KeyUp"] = "keyup";
    })(ListenerType_ = TheDatepicker.ListenerType_ || (TheDatepicker.ListenerType_ = {}));
    var Helper_ = (function () {
        function Helper_() {
        }
        Helper_.resetTime_ = function (date) {
            if (date === null) {
                return null;
            }
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        };
        Helper_.normalizeDate_ = function (parameterName, value, options) {
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
                    return Helper_.resetTime_(date);
                }
            }
            else if (Helper_.isValidDate_(value)) {
                return Helper_.resetTime_(new Date(value.getTime()));
            }
            throw new Error(parameterName + ' was expected to be a valid Date string or valid Date or Day or null.');
        };
        Helper_.normalizeMonth_ = function (date) {
            if (date === null) {
                return null;
            }
            var month = new Date(date.getTime());
            month.setDate(1);
            return month;
        };
        Helper_.isElement_ = function (element) {
            return typeof element === 'object'
                && element.nodeType === 1
                && typeof element.style === 'object'
                && typeof element.ownerDocument === 'object';
        };
        Helper_.isValidDate_ = function (value) {
            return typeof value === 'object'
                && Object.prototype.toString.call(value) === '[object Date]'
                && !isNaN(value.getTime());
        };
        Helper_.inArray_ = function (list, item) {
            for (var index = 0; index < list.length; index++) {
                if (list[index] === item) {
                    return true;
                }
            }
            return false;
        };
        Helper_.addEventListener_ = function (element, listenerType, listener) {
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
        Helper_.preventDefault_ = function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
        };
        Helper_.stopPropagation_ = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            else {
                event.cancelBubble = true;
            }
        };
        Helper_.checkString_ = function (parameterName, value, checkNonEmpty) {
            if (checkNonEmpty === void 0) { checkNonEmpty = false; }
            if (!checkNonEmpty && !value) {
                return '';
            }
            if (typeof value !== 'string' || (checkNonEmpty && value === '')) {
                throw new Error(parameterName + ' was expected to be a' + (checkNonEmpty ? ' non empty' : '') + ' string.');
            }
            return value;
        };
        Helper_.checkNumber_ = function (parameterName, value, min, max) {
            if (min === void 0) { min = null; }
            if (max === void 0) { max = null; }
            value = typeof value === 'string' ? parseInt(value) : value;
            if (typeof value !== 'number' || isNaN(value) || (min !== null && value < min) || (max !== null && value > max)) {
                throw new Error(parameterName + ' was expected to be a valid number' + (min !== null ? ' from ' + min : '') + (max !== null ? ' to ' + max : '') + '.');
            }
            return value;
        };
        Helper_.checkFunction_ = function (parameterName, value, isNullable) {
            if (isNullable === void 0) { isNullable = true; }
            if (isNullable && !value) {
                return null;
            }
            if (typeof value !== 'function') {
                throw new Error(parameterName + ' was expected to be a function' + (isNullable ? ' or null' : '') + '.');
            }
            return value;
        };
        Helper_.warnDeprecatedUsage_ = function (deprecatedMethod, alternateMethod) {
            if (!window.console) {
                return;
            }
            for (var index = 0; index < Helper_.deprecatedMethods_.length; index++) {
                if (deprecatedMethod === Helper_.deprecatedMethods_[0]) {
                    return;
                }
            }
            window.console.warn('TheDatepicker: ' + deprecatedMethod + '() is deprecated, use ' + alternateMethod + '()');
            Helper_.deprecatedMethods_.push(deprecatedMethod);
        };
        Helper_.deprecatedMethods_ = [];
        return Helper_;
    }());
    TheDatepicker.Helper_ = Helper_;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var HtmlHelper_ = (function () {
        function HtmlHelper_(options_) {
            this.options_ = options_;
            this.document_ = document;
        }
        HtmlHelper_.prototype.createDiv_ = function (className) {
            var div = this.document_.createElement('div');
            this.addClass_(div, className);
            return div;
        };
        HtmlHelper_.prototype.createAnchor_ = function (onClick) {
            var anchor = this.document_.createElement('a');
            this.addClass_(anchor, 'button');
            anchor.href = '#';
            anchor.onclick = function (event) {
                event = event || window.event;
                TheDatepicker.Helper_.preventDefault_(event);
                onClick(event);
            };
            anchor.onkeydown = function (event) {
                event = event || window.event;
                if (TheDatepicker.Helper_.inArray_([TheDatepicker.KeyCode_.Enter, TheDatepicker.KeyCode_.Space], event.keyCode)) {
                    TheDatepicker.Helper_.preventDefault_(event);
                    onClick(event);
                }
            };
            return anchor;
        };
        HtmlHelper_.prototype.createSpan_ = function () {
            return this.document_.createElement('span');
        };
        HtmlHelper_.prototype.createTable_ = function (className, header, body) {
            var table = this.document_.createElement('table');
            this.addClass_(table, className);
            table.appendChild(header);
            table.appendChild(body);
            return table;
        };
        HtmlHelper_.prototype.createTableHeader_ = function (className, cells) {
            var tableHeader = this.document_.createElement('thead');
            this.addClass_(tableHeader, className);
            var row = this.document_.createElement('tr');
            for (var index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            tableHeader.appendChild(row);
            return tableHeader;
        };
        HtmlHelper_.prototype.createTableHeaderCell_ = function (className) {
            var cell = this.document_.createElement('th');
            cell.scope = 'col';
            this.addClass_(cell, className);
            return cell;
        };
        HtmlHelper_.prototype.createTableBody_ = function (className, rows) {
            var tableBody = this.document_.createElement('tbody');
            this.addClass_(tableBody, className);
            for (var index = 0; index < rows.length; index++) {
                tableBody.appendChild(rows[index]);
            }
            return tableBody;
        };
        HtmlHelper_.prototype.createTableRow_ = function (className, cells) {
            var row = this.document_.createElement('tr');
            for (var index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            return row;
        };
        HtmlHelper_.prototype.createTableCell_ = function () {
            return this.document_.createElement('td');
        };
        HtmlHelper_.prototype.createSelectInput_ = function (options, onChange) {
            var input = this.document_.createElement('select');
            this.addClass_(input, 'select');
            for (var index = 0; index < options.length; index++) {
                input.appendChild(this.createSelectOption_(options[index].value, options[index].label));
            }
            input.onchange = function (event) {
                onChange(event || window.event, input.value);
            };
            input.onkeydown = function (event) {
                event = event || window.event;
                TheDatepicker.Helper_.stopPropagation_(event);
            };
            return input;
        };
        HtmlHelper_.prototype.createSelectOption_ = function (value, label) {
            var option = this.document_.createElement('option');
            option.value = value;
            option.innerText = label;
            return option;
        };
        HtmlHelper_.prototype.addClass_ = function (element, className) {
            className = this.options_.getClassesPrefix() + className;
            if (element.className !== '') {
                className = ' ' + className;
            }
            element.className += className;
        };
        return HtmlHelper_;
    }());
    TheDatepicker.HtmlHelper_ = HtmlHelper_;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var EventType_;
    (function (EventType_) {
        EventType_["BeforeSelect"] = "beforeSelect";
        EventType_["Select"] = "select";
        EventType_["BeforeOpenAndClose"] = "beforeOpenAndClose";
        EventType_["OpenAndClose"] = "openAndClose";
        EventType_["BeforeMonthChange"] = "beforeMonthChange";
        EventType_["MonthChange"] = "monthChange";
        EventType_["Focus"] = "focus";
        EventType_["BeforeFocus"] = "beforeFocus";
    })(EventType_ = TheDatepicker.EventType_ || (TheDatepicker.EventType_ = {}));
    var AvailableDateNotFoundException = (function () {
        function AvailableDateNotFoundException() {
        }
        return AvailableDateNotFoundException;
    }());
    TheDatepicker.AvailableDateNotFoundException = AvailableDateNotFoundException;
    var Options = (function () {
        function Options(translator) {
            if (translator === void 0) { translator = null; }
            this.hideOnBlur_ = true;
            this.hideOnSelect_ = true;
            this.minDate_ = null;
            this.maxDate_ = null;
            this.minMonth_ = null;
            this.maxMonth_ = null;
            this.initialDate_ = null;
            this.initialMonth_ = null;
            this.initialDatePriority_ = true;
            this.firstDayOfWeek_ = TheDatepicker.DayOfWeek.Monday;
            this.dateAvailabilityResolver_ = null;
            this.cellContentResolver_ = null;
            this.cellContentStructureResolver_ = null;
            this.cellClassesResolver_ = null;
            this.cellClassesResolvers_ = [];
            this.dayModifiers_ = [];
            this.inputFormat_ = 'j. n. Y';
            this.daysOutOfMonthVisible_ = false;
            this.fixedRowsCount_ = false;
            this.toggleSelection_ = false;
            this.allowEmpty_ = true;
            this.showDeselectButton_ = true;
            this.showResetButton_ = false;
            this.monthAsDropdown_ = true;
            this.yearAsDropdown_ = true;
            this.monthAndYearSeparated_ = true;
            this.classesPrefix_ = 'the-datepicker__';
            this.showCloseButton_ = true;
            this.title_ = '';
            this.dropdownItemsLimit_ = 200;
            this.hideDropdownWithOneItem_ = true;
            this.goBackHtml_ = '&lt;';
            this.goForwardHtml_ = '&gt;';
            this.closeHtml_ = '&times;';
            this.resetHtml_ = '&olarr;';
            this.deselectHtml_ = '&times;';
            this.positionFixing_ = true;
            this.today_ = null;
            this.listeners_ = {
                beforeSelect: [],
                select: [],
                beforeOpenAndClose: [],
                openAndClose: [],
                beforeMonthChange: [],
                monthChange: [],
                beforeFocus: [],
                focus: []
            };
            this.translator = translator !== null ? translator : new TheDatepicker.Translator();
            this.document_ = document;
        }
        Options.prototype.clone = function () {
            var options = new Options(this.translator);
            options.hideOnBlur_ = this.hideOnBlur_;
            options.hideOnSelect_ = this.hideOnSelect_;
            options.minDate_ = this.minDate_;
            options.maxDate_ = this.maxDate_;
            options.minMonth_ = this.minMonth_;
            options.maxMonth_ = this.maxMonth_;
            options.initialDate_ = this.initialDate_;
            options.initialMonth_ = this.initialMonth_;
            options.initialDatePriority_ = this.initialDatePriority_;
            options.firstDayOfWeek_ = this.firstDayOfWeek_;
            options.dateAvailabilityResolver_ = this.dateAvailabilityResolver_;
            options.cellContentResolver_ = this.cellContentResolver_;
            options.cellContentStructureResolver_ = this.cellContentStructureResolver_;
            options.cellClassesResolver_ = this.cellClassesResolver_;
            options.cellClassesResolvers_ = this.cellClassesResolvers_.slice(0);
            options.dayModifiers_ = this.dayModifiers_.slice(0);
            options.inputFormat_ = this.inputFormat_;
            options.daysOutOfMonthVisible_ = this.daysOutOfMonthVisible_;
            options.fixedRowsCount_ = this.fixedRowsCount_;
            options.toggleSelection_ = this.toggleSelection_;
            options.allowEmpty_ = this.allowEmpty_;
            options.showDeselectButton_ = this.showDeselectButton_;
            options.showResetButton_ = this.showResetButton_;
            options.monthAsDropdown_ = this.monthAsDropdown_;
            options.yearAsDropdown_ = this.yearAsDropdown_;
            options.monthAndYearSeparated_ = this.monthAndYearSeparated_;
            options.classesPrefix_ = this.classesPrefix_;
            options.showCloseButton_ = this.showCloseButton_;
            options.title_ = this.title_;
            options.dropdownItemsLimit_ = this.dropdownItemsLimit_;
            options.hideDropdownWithOneItem_ = this.hideDropdownWithOneItem_;
            options.goBackHtml_ = this.goBackHtml_;
            options.goForwardHtml_ = this.goForwardHtml_;
            options.closeHtml_ = this.closeHtml_;
            options.resetHtml_ = this.resetHtml_;
            options.deselectHtml_ = this.deselectHtml_;
            options.positionFixing_ = this.positionFixing_;
            options.listeners_.beforeSelect = this.listeners_.beforeSelect.slice(0);
            options.listeners_.select = this.listeners_.select.slice(0);
            options.listeners_.beforeOpenAndClose = this.listeners_.beforeOpenAndClose.slice(0);
            options.listeners_.openAndClose = this.listeners_.openAndClose.slice(0);
            options.listeners_.beforeMonthChange = this.listeners_.beforeMonthChange.slice(0);
            options.listeners_.monthChange = this.listeners_.monthChange.slice(0);
            options.listeners_.beforeFocus = this.listeners_.beforeFocus.slice(0);
            options.listeners_.focus = this.listeners_.focus.slice(0);
            return options;
        };
        Options.prototype.setHideOnBlur = function (value) {
            this.hideOnBlur_ = !!value;
        };
        Options.prototype.setHideOnSelect = function (value) {
            this.hideOnSelect_ = !!value;
        };
        Options.prototype.setMinDate = function (date) {
            var normalizedDate = TheDatepicker.Helper_.normalizeDate_('Min date', date, this);
            this.checkConstraints_(normalizedDate, this.maxDate_);
            this.minDate_ = normalizedDate;
            this.minMonth_ = TheDatepicker.Helper_.normalizeMonth_(normalizedDate);
        };
        Options.prototype.setMaxDate = function (date) {
            var normalizedDate = TheDatepicker.Helper_.normalizeDate_('Max date', date, this);
            this.checkConstraints_(this.minDate_, normalizedDate);
            this.maxDate_ = normalizedDate;
            this.maxMonth_ = TheDatepicker.Helper_.normalizeMonth_(normalizedDate);
        };
        Options.prototype.setInitialMonth = function (month) {
            this.initialMonth_ = TheDatepicker.Helper_.normalizeDate_('Initial month', month, this);
        };
        Options.prototype.setInitialDate = function (value) {
            this.initialDate_ = TheDatepicker.Helper_.normalizeDate_('Initial date', value, this);
        };
        Options.prototype.setInitialDatePriority = function (value) {
            this.initialDatePriority_ = !!value;
        };
        Options.prototype.setFirstDayOfWeek = function (dayOfWeek) {
            this.firstDayOfWeek_ = TheDatepicker.Helper_.checkNumber_('First day of week', dayOfWeek, 0, 6);
        };
        Options.prototype.setDateAvailabilityResolver = function (resolver) {
            this.dateAvailabilityResolver_ = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
        };
        Options.prototype.setCellContentResolver = function (resolver) {
            this.cellContentResolver_ = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
        };
        Options.prototype.setCellContentStructureResolver = function (init, update) {
            if (update === void 0) { update = null; }
            init = TheDatepicker.Helper_.checkFunction_('Resolver (init)', init);
            update = TheDatepicker.Helper_.checkFunction_('Resolver (update)', update);
            this.cellContentStructureResolver_ = init === null ? null : {
                init: init,
                update: update
            };
        };
        Options.prototype.setCellClassesResolver = function (resolver) {
            TheDatepicker.Helper_.warnDeprecatedUsage_('setCellClassesResolver', 'addCellClassesResolver');
            this.cellClassesResolver_ = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
        };
        Options.prototype.addCellClassesResolver = function (resolver) {
            this.cellClassesResolvers_.push(TheDatepicker.Helper_.checkFunction_('Resolver', resolver, false));
        };
        Options.prototype.removeCellClassesResolver = function (resolver) {
            if (resolver === void 0) { resolver = null; }
            resolver = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
            if (resolver === null) {
                this.cellClassesResolvers_ = [];
            }
            else {
                var newResolvers = [];
                for (var index = 0; index < this.cellClassesResolvers_.length; index++) {
                    if (this.cellClassesResolvers_[index] !== resolver) {
                        newResolvers.push(this.cellClassesResolvers_[index]);
                    }
                }
                this.cellClassesResolvers_ = newResolvers;
            }
        };
        Options.prototype.addDayModifier = function (modifier) {
            this.dayModifiers_.push(TheDatepicker.Helper_.checkFunction_('Modifier', modifier, false));
        };
        Options.prototype.removeDayModifier = function (modifier) {
            if (modifier === void 0) { modifier = null; }
            modifier = TheDatepicker.Helper_.checkFunction_('Modifier', modifier);
            if (modifier === null) {
                this.dayModifiers_ = [];
            }
            else {
                var newModifiers = [];
                for (var index = 0; index < this.dayModifiers_.length; index++) {
                    if (this.dayModifiers_[index] !== modifier) {
                        newModifiers.push(this.dayModifiers_[index]);
                    }
                }
                this.dayModifiers_ = newModifiers;
            }
        };
        Options.prototype.setInputFormat = function (format) {
            this.inputFormat_ = TheDatepicker.Helper_.checkString_('Input format', format, true);
        };
        Options.prototype.setDaysOutOfMonthVisible = function (value) {
            this.daysOutOfMonthVisible_ = !!value;
        };
        Options.prototype.setFixedRowsCount = function (value) {
            this.fixedRowsCount_ = !!value;
        };
        Options.prototype.setToggleSelection = function (value) {
            this.toggleSelection_ = !!value;
        };
        Options.prototype.setShowDeselectButton = function (value) {
            this.showDeselectButton_ = !!value;
        };
        Options.prototype.setAllowEmpty = function (value) {
            this.allowEmpty_ = !!value;
        };
        Options.prototype.setShowResetButton = function (value) {
            this.showResetButton_ = !!value;
        };
        Options.prototype.setMonthAsDropdown = function (value) {
            this.monthAsDropdown_ = !!value;
        };
        Options.prototype.setYearAsDropdown = function (value) {
            this.yearAsDropdown_ = !!value;
        };
        Options.prototype.setMonthAndYearSeparated = function (value) {
            this.monthAndYearSeparated_ = !!value;
        };
        Options.prototype.setClassesPrefix = function (prefix) {
            this.classesPrefix_ = TheDatepicker.Helper_.checkString_('Prefix', prefix);
        };
        Options.prototype.setShowCloseButton = function (value) {
            this.showCloseButton_ = !!value;
        };
        Options.prototype.setTitle = function (title) {
            this.title_ = TheDatepicker.Helper_.checkString_('Title', title);
        };
        Options.prototype.setDropdownItemsLimit = function (limit) {
            this.dropdownItemsLimit_ = TheDatepicker.Helper_.checkNumber_('Items limit', limit, 1);
        };
        Options.prototype.setHideDropdownWithOneItem = function (value) {
            this.hideDropdownWithOneItem_ = !!value;
        };
        Options.prototype.setGoBackHtml = function (html) {
            this.goBackHtml_ = TheDatepicker.Helper_.checkString_('Html', html);
        };
        Options.prototype.setGoForwardHtml = function (html) {
            this.goForwardHtml_ = TheDatepicker.Helper_.checkString_('Html', html);
        };
        Options.prototype.setCloseHtml = function (html) {
            this.closeHtml_ = TheDatepicker.Helper_.checkString_('Html', html);
        };
        Options.prototype.setResetHtml = function (html) {
            this.resetHtml_ = TheDatepicker.Helper_.checkString_('Html', html);
        };
        Options.prototype.setDeselectHtml = function (html) {
            this.deselectHtml_ = TheDatepicker.Helper_.checkString_('Html', html);
        };
        Options.prototype.setPositionFixing = function (value) {
            this.positionFixing_ = !!value;
        };
        Options.prototype.setToday = function (date) {
            this.today_ = TheDatepicker.Helper_.normalizeDate_('Today', date, this);
        };
        Options.prototype.onBeforeSelect = function (listener) {
            this.onEvent_(EventType_.BeforeSelect, listener);
        };
        Options.prototype.offBeforeSelect = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.BeforeSelect, listener);
        };
        Options.prototype.onSelect = function (listener) {
            this.onEvent_(EventType_.Select, listener);
        };
        Options.prototype.offSelect = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.Select, listener);
        };
        Options.prototype.onBeforeOpenAndClose = function (listener) {
            this.onEvent_(EventType_.BeforeOpenAndClose, listener);
        };
        Options.prototype.offBeforeOpenAndClose = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.BeforeOpenAndClose, listener);
        };
        Options.prototype.onOpenAndClose = function (listener) {
            this.onEvent_(EventType_.OpenAndClose, listener);
        };
        Options.prototype.offOpenAndClose = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.OpenAndClose, listener);
        };
        Options.prototype.onBeforeMonthChange = function (listener) {
            this.onEvent_(EventType_.BeforeMonthChange, listener);
        };
        Options.prototype.offBeforeMonthChange = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.BeforeMonthChange, listener);
        };
        Options.prototype.onMonthChange = function (listener) {
            this.onEvent_(EventType_.MonthChange, listener);
        };
        Options.prototype.offMonthChange = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.MonthChange, listener);
        };
        Options.prototype.onBeforeFocus = function (listener) {
            this.onEvent_(EventType_.BeforeFocus, listener);
        };
        Options.prototype.offBeforeFocus = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.BeforeFocus, listener);
        };
        Options.prototype.onFocus = function (listener) {
            this.onEvent_(EventType_.Focus, listener);
        };
        Options.prototype.offFocus = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.Focus, listener);
        };
        Options.prototype.getInitialMonth = function () {
            var primarySource = this.initialDatePriority_ ? this.initialDate_ : this.initialMonth_;
            var secondarySource = this.initialDatePriority_ ? this.initialMonth_ : this.initialDate_;
            var initialMonth = primarySource !== null
                ? new Date(primarySource.getTime())
                : (secondarySource !== null
                    ? new Date(secondarySource.getTime())
                    : this.getToday());
            initialMonth.setDate(1);
            return this.correctMonth(initialMonth);
        };
        Options.prototype.isMonthInValidity = function (month) {
            return this.calculateMonthCorrection_(month) === null;
        };
        Options.prototype.correctMonth = function (month) {
            var correctMonth = this.calculateMonthCorrection_(month);
            return correctMonth !== null ? correctMonth : month;
        };
        Options.prototype.getInitialDate = function () {
            return this.findPossibleAvailableDate(this.initialDate_);
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
            date = this.correctDate_(date);
            if (this.isDateAvailable(date)) {
                return date;
            }
            var maxLoops = 1000;
            var increasedDate = date;
            var decreasedDate = new Date(date.getTime());
            do {
                if (increasedDate !== null) {
                    increasedDate.setDate(increasedDate.getDate() + 1);
                    if (this.maxDate_ !== null && increasedDate.getTime() > this.maxDate_.getTime()) {
                        increasedDate = null;
                    }
                    else if (this.isDateAvailable(increasedDate)) {
                        return increasedDate;
                    }
                }
                if (decreasedDate !== null) {
                    decreasedDate.setDate(decreasedDate.getDate() - 1);
                    if (this.minDate_ !== null && decreasedDate.getTime() < this.minDate_.getTime()) {
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
            return this.calculateDateCorrection_(date) === null;
        };
        Options.prototype.correctDate_ = function (date) {
            var correctDate = this.calculateDateCorrection_(date);
            return correctDate !== null ? correctDate : date;
        };
        Options.prototype.getFirstDayOfWeek = function () {
            return this.firstDayOfWeek_;
        };
        Options.prototype.areDaysOutOfMonthVisible = function () {
            return this.daysOutOfMonthVisible_;
        };
        Options.prototype.hasFixedRowsCount = function () {
            return this.fixedRowsCount_;
        };
        Options.prototype.hasToggleSelection = function () {
            return this.allowEmpty_ && this.toggleSelection_;
        };
        Options.prototype.isAllowedEmpty = function () {
            return this.allowEmpty_;
        };
        Options.prototype.isDeselectButtonShown = function () {
            return this.allowEmpty_ && this.showDeselectButton_;
        };
        Options.prototype.isResetButtonShown = function () {
            return this.showResetButton_;
        };
        Options.prototype.isMonthAsDropdown = function () {
            return this.monthAsDropdown_;
        };
        Options.prototype.isYearAsDropdown = function () {
            return this.yearAsDropdown_;
        };
        Options.prototype.isMonthAndYearSeparated = function () {
            return this.monthAndYearSeparated_;
        };
        Options.prototype.getClassesPrefix = function () {
            return this.classesPrefix_;
        };
        Options.prototype.isCloseButtonShown = function () {
            return this.hideOnBlur_ && this.showCloseButton_;
        };
        Options.prototype.getTitle = function () {
            return this.title_;
        };
        Options.prototype.getMinDate = function () {
            return this.minDate_;
        };
        Options.prototype.getMaxDate = function () {
            return this.maxDate_;
        };
        Options.prototype.getMinMonth = function () {
            return this.minMonth_;
        };
        Options.prototype.getMaxMonth = function () {
            return this.maxMonth_;
        };
        Options.prototype.isDropdownWithOneItemHidden = function () {
            return this.hideDropdownWithOneItem_;
        };
        Options.prototype.getDropdownItemsLimit = function () {
            return this.dropdownItemsLimit_;
        };
        Options.prototype.isDateAvailable = function (date) {
            if (this.dateAvailabilityResolver_ !== null) {
                return !!this.dateAvailabilityResolver_(new Date(date.getTime()));
            }
            return true;
        };
        Options.prototype.getCellContent = function (day) {
            if (this.cellContentResolver_ !== null) {
                return this.cellContentResolver_(day);
            }
            return day.dayNumber + '';
        };
        Options.prototype.getCellStructure_ = function () {
            if (this.cellContentStructureResolver_ !== null) {
                return this.cellContentStructureResolver_.init();
            }
            return this.document_.createElement('span');
        };
        Options.prototype.updateCellStructure_ = function (element, day) {
            if (this.cellContentStructureResolver_ !== null) {
                this.cellContentStructureResolver_.update(element, day);
            }
            else {
                element.innerText = this.getCellContent(day);
            }
        };
        Options.prototype.getCellClasses = function (day) {
            var result = [];
            if (this.cellClassesResolver_ !== null) {
                var classes = this.cellClassesResolver_(day);
                if (typeof classes === 'string') {
                    result.push(classes);
                }
                else if (typeof classes === 'object' && classes.constructor === Array) {
                    result = result.concat(classes);
                }
            }
            var cellClassesResolvers = this.cellClassesResolvers_.slice(0);
            for (var index = 0; index < cellClassesResolvers.length; index++) {
                var classes = cellClassesResolvers[index](day);
                if (typeof classes === 'string') {
                    result.push(classes);
                }
                else if (typeof classes === 'object' && classes.constructor === Array) {
                    result = result.concat(classes);
                }
            }
            return result;
        };
        Options.prototype.modifyDay = function (day) {
            var dayModifiers = this.dayModifiers_.slice(0);
            for (var index = 0; index < dayModifiers.length; index++) {
                dayModifiers[index](day);
            }
        };
        Options.prototype.getGoBackHtml = function () {
            return this.goBackHtml_;
        };
        Options.prototype.getGoForwardHtml = function () {
            return this.goForwardHtml_;
        };
        Options.prototype.getCloseHtml = function () {
            return this.closeHtml_;
        };
        Options.prototype.getResetHtml = function () {
            return this.resetHtml_;
        };
        Options.prototype.getDeselectHtml = function () {
            return this.deselectHtml_;
        };
        Options.prototype.isHiddenOnBlur = function () {
            return this.hideOnBlur_;
        };
        Options.prototype.isHiddenOnSelect = function () {
            return this.hideOnBlur_ && this.hideOnSelect_;
        };
        Options.prototype.getInputFormat = function () {
            return this.inputFormat_;
        };
        Options.prototype.isPositionFixingEnabled = function () {
            return this.hideOnBlur_ && this.positionFixing_;
        };
        Options.prototype.getToday = function () {
            return this.today_ !== null ? new Date(this.today_.getTime()) : TheDatepicker.Helper_.resetTime_(new Date());
        };
        Options.prototype.getDateAvailabilityResolver = function () {
            return this.dateAvailabilityResolver_;
        };
        Options.prototype.getCellContentResolver = function () {
            return this.cellContentResolver_;
        };
        Options.prototype.getCellContentStructureResolver = function () {
            return this.cellContentStructureResolver_;
        };
        Options.prototype.getCellClassesResolvers = function () {
            return this.cellClassesResolvers_;
        };
        Options.prototype.getDayModifiers = function () {
            return this.dayModifiers_;
        };
        Options.prototype.getBeforeSelectListeners = function () {
            return this.listeners_.beforeSelect;
        };
        Options.prototype.getSelectListeners = function () {
            return this.listeners_.select;
        };
        Options.prototype.getBeforeOpenAndCloseListeners = function () {
            return this.listeners_.beforeOpenAndClose;
        };
        Options.prototype.getOpenAndCloseListeners = function () {
            return this.listeners_.openAndClose;
        };
        Options.prototype.getBeforeMonthChangeListeners = function () {
            return this.listeners_.beforeMonthChange;
        };
        Options.prototype.getMonthChangeListeners = function () {
            return this.listeners_.monthChange;
        };
        Options.prototype.getBeforeFocusListeners = function () {
            return this.listeners_.beforeFocus;
        };
        Options.prototype.getFocusListeners = function () {
            return this.listeners_.focus;
        };
        Options.prototype.checkConstraints_ = function (minDate, maxDate) {
            if (minDate !== null
                && maxDate !== null
                && minDate.getTime() > maxDate.getTime()) {
                throw new Error('Min date cannot be higher then max date.');
            }
        };
        Options.prototype.calculateMonthCorrection_ = function (month) {
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
        Options.prototype.calculateDateCorrection_ = function (date) {
            if (this.minDate_ !== null && date.getTime() < this.minDate_.getTime()) {
                return new Date(this.minDate_.getTime());
            }
            if (this.maxDate_ !== null && date.getTime() > this.maxDate_.getTime()) {
                return new Date(this.maxDate_.getTime());
            }
            return null;
        };
        Options.prototype.onEvent_ = function (eventType, listener) {
            this.listeners_[eventType].push(TheDatepicker.Helper_.checkFunction_('Event listener', listener, false));
        };
        Options.prototype.offEvent_ = function (eventType, listener) {
            listener = TheDatepicker.Helper_.checkFunction_('Event listener', listener);
            if (listener === null) {
                this.listeners_[eventType] = [];
            }
            else {
                var newListeners = [];
                for (var index = 0; index < this.listeners_[eventType].length; index++) {
                    if (this.listeners_[eventType][index] !== listener) {
                        newListeners.push(this.listeners_[eventType][index]);
                    }
                }
                this.listeners_[eventType] = newListeners;
            }
        };
        Options.prototype.triggerEvent_ = function (eventType, caller) {
            var listeners = this.listeners_[eventType].slice(0);
            for (var index = 0; index < listeners.length; index++) {
                if (caller(listeners[index]) === false) {
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
    var Template_ = (function () {
        function Template_(options_, htmlHelper_, container_, hasInput_) {
            this.options_ = options_;
            this.htmlHelper_ = htmlHelper_;
            this.container_ = container_;
            this.hasInput_ = hasInput_;
            this.mainElement_ = null;
            this.controlElement_ = null;
            this.goBackElement_ = null;
            this.goForwardElement_ = null;
            this.titleElement_ = null;
            this.titleContentElement_ = null;
            this.resetElement_ = null;
            this.closeElement_ = null;
            this.monthSelect_ = null;
            this.monthElement_ = null;
            this.yearSelect_ = null;
            this.yearElement_ = null;
            this.monthAndYearSelect_ = null;
            this.monthAndYearElement_ = null;
            this.weeksElements_ = [];
            this.daysElements_ = [];
            this.daysButtonsElements_ = [];
            this.daysContentsElements_ = [];
        }
        Template_.prototype.render_ = function (viewModel) {
            if (this.mainElement_ === null) {
                if (this.hasInput_ && this.options_.isHiddenOnBlur() && !viewModel.isActive_()) {
                    return;
                }
                this.container_.innerHTML = '';
                this.container_.appendChild(this.createSkeleton_(viewModel));
            }
            this.updateMainElement_(viewModel);
            this.updateTopElement_(viewModel);
            this.updateTitleElement_(viewModel);
            this.updateCloseElement_(viewModel);
            this.updateResetElement_(viewModel);
            this.updateGoBackElement_(viewModel);
            this.updateGoForwardElement_(viewModel);
            this.updateMonthElement_(viewModel);
            this.updateYearElement_(viewModel);
            this.updateMonthAndYearElement_(viewModel);
            this.updateWeeksElements_(viewModel);
        };
        Template_.prototype.createSkeleton_ = function (viewModel) {
            var main = this.htmlHelper_.createDiv_('main');
            main.appendChild(this.createHeaderElement_(viewModel));
            main.appendChild(this.createBodyElement_(viewModel));
            this.mainElement_ = main;
            return main;
        };
        Template_.prototype.updateMainElement_ = function (viewModel) {
            this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? '' : 'none';
        };
        Template_.prototype.createBodyElement_ = function (viewModel) {
            var body = this.htmlHelper_.createDiv_('body');
            body.appendChild(this.createTableElement_(viewModel));
            return body;
        };
        Template_.prototype.createHeaderElement_ = function (viewModel) {
            var header = this.htmlHelper_.createDiv_('header');
            var top = this.htmlHelper_.createDiv_('top');
            header.appendChild(top);
            top.appendChild(this.createTitleElement_(viewModel));
            var control = this.htmlHelper_.createDiv_('control');
            top.appendChild(control);
            control.appendChild(this.createResetElement_(viewModel));
            control.appendChild(this.createCloseElement_(viewModel));
            var navigation = this.htmlHelper_.createDiv_('navigation');
            header.appendChild(navigation);
            navigation.appendChild(this.createGoBackElement_(viewModel));
            var state = this.htmlHelper_.createDiv_('state');
            navigation.appendChild(state);
            if (this.options_.isMonthAndYearSeparated()) {
                state.appendChild(this.createMonthElement_(viewModel));
                state.appendChild(this.createYearElement_(viewModel));
            }
            else {
                state.appendChild(this.createMonthAndYearElement_(viewModel));
            }
            navigation.appendChild(this.createGoForwardElement_(viewModel));
            this.controlElement_ = control;
            return header;
        };
        Template_.prototype.updateTopElement_ = function (viewModel) {
            var isVisible = this.options_.getTitle() !== ''
                || this.options_.isResetButtonShown()
                || (this.hasInput_ && this.options_.isCloseButtonShown());
            this.controlElement_.style.display = isVisible ? '' : 'none';
            this.titleElement_.style.display = isVisible ? '' : 'none';
        };
        Template_.prototype.createTitleElement_ = function (viewModel) {
            var titleElement = this.htmlHelper_.createDiv_('title');
            var titleContent = this.htmlHelper_.createSpan_();
            titleElement.appendChild(titleContent);
            this.htmlHelper_.addClass_(titleContent, 'title-content');
            this.titleElement_ = titleElement;
            this.titleContentElement_ = titleContent;
            return titleElement;
        };
        Template_.prototype.updateTitleElement_ = function (viewModel) {
            var title = this.options_.getTitle();
            this.titleContentElement_.style.display = title !== '' ? '' : 'none';
            this.titleContentElement_.innerText = title;
        };
        Template_.prototype.createResetElement_ = function (viewModel) {
            var resetElement = this.htmlHelper_.createDiv_('reset');
            var resetButton = this.htmlHelper_.createAnchor_(function (event) {
                viewModel.reset_(event);
            });
            resetButton.innerHTML = this.options_.getResetHtml();
            resetElement.appendChild(resetButton);
            this.resetElement_ = resetElement;
            return resetElement;
        };
        Template_.prototype.updateResetElement_ = function (viewModel) {
            this.resetElement_.style.display = this.options_.isResetButtonShown() ? '' : 'none';
        };
        Template_.prototype.createCloseElement_ = function (viewModel) {
            var closeElement = this.htmlHelper_.createDiv_('close');
            var closeButton = this.htmlHelper_.createAnchor_(function (event) {
                viewModel.close_(event);
            });
            closeButton.innerHTML = this.options_.getCloseHtml();
            closeElement.appendChild(closeButton);
            this.closeElement_ = closeElement;
            return closeElement;
        };
        Template_.prototype.updateCloseElement_ = function (viewModel) {
            this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? '' : 'none';
        };
        Template_.prototype.createGoBackElement_ = function (viewModel) {
            return this.createGoElement_(viewModel, false);
        };
        Template_.prototype.createGoForwardElement_ = function (viewModel) {
            return this.createGoElement_(viewModel, true);
        };
        Template_.prototype.createGoElement_ = function (viewModel, directionForward) {
            var goElement = this.htmlHelper_.createDiv_('go');
            this.htmlHelper_.addClass_(goElement, directionForward ? 'go-next' : 'go-previous');
            var goButton = this.htmlHelper_.createAnchor_(function (event) {
                if (directionForward) {
                    viewModel.goForward_(event);
                }
                else {
                    viewModel.goBack_(event);
                }
            });
            goButton.innerHTML = directionForward ? this.options_.getGoForwardHtml() : this.options_.getGoBackHtml();
            goElement.appendChild(goButton);
            if (directionForward) {
                this.goForwardElement_ = goButton;
            }
            else {
                this.goBackElement_ = goButton;
            }
            return goElement;
        };
        Template_.prototype.updateGoBackElement_ = function (viewModel) {
            this.goBackElement_.style.visibility = viewModel.canGoBack_() ? 'visible' : 'hidden';
        };
        Template_.prototype.updateGoForwardElement_ = function (viewModel) {
            this.goForwardElement_.style.visibility = viewModel.canGoForward_() ? 'visible' : 'hidden';
        };
        Template_.prototype.createMonthElement_ = function (viewModel) {
            var _this = this;
            var options = [];
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                options.push({
                    value: monthNumber + '',
                    label: this.options_.translator.translateMonth(monthNumber)
                });
            }
            var selectElement = this.htmlHelper_.createSelectInput_(options, function (event, monthNumber) {
                var currentMonth = viewModel.getCurrentMonth_();
                var newMonth = new Date(currentMonth.getTime());
                newMonth.setMonth(parseInt(monthNumber, 10));
                if (!viewModel.goToMonth_(event, newMonth)) {
                    _this.monthSelect_.value = currentMonth.getMonth() + '';
                }
            });
            var monthElement = this.htmlHelper_.createDiv_('month');
            var monthContent = this.htmlHelper_.createSpan_();
            monthElement.appendChild(selectElement);
            monthElement.appendChild(monthContent);
            this.monthElement_ = monthContent;
            this.monthSelect_ = selectElement;
            return monthElement;
        };
        Template_.prototype.updateMonthElement_ = function (viewModel) {
            if (this.monthElement_ === null) {
                return;
            }
            var currentMonth = viewModel.getCurrentMonth_().getMonth();
            this.monthElement_.innerText = this.options_.translator.translateMonth(currentMonth);
            if (!this.options_.isMonthAsDropdown()) {
                this.monthSelect_.style.display = 'none';
                this.monthElement_.style.display = '';
                return;
            }
            var valuesCount = 0;
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                var newMonth = new Date(viewModel.getCurrentMonth_().getTime());
                newMonth.setMonth(monthNumber);
                var option = this.monthSelect_.getElementsByTagName('option')[monthNumber];
                var canGoToMonth = viewModel.canGoToMonth_(newMonth);
                option.disabled = !canGoToMonth;
                option.style.display = canGoToMonth ? '' : 'none';
                valuesCount += canGoToMonth ? 1 : 0;
            }
            this.monthSelect_.value = currentMonth + '';
            var showSelect = !this.options_.isDropdownWithOneItemHidden() || valuesCount > 1;
            this.monthSelect_.style.display = showSelect ? '' : 'none';
            this.monthElement_.style.display = showSelect ? 'none' : '';
        };
        Template_.prototype.createYearElement_ = function (viewModel) {
            var _this = this;
            var selectElement = this.htmlHelper_.createSelectInput_([], function (event, year) {
                var currentMonth = viewModel.getCurrentMonth_();
                var newMonth = new Date(currentMonth.getTime());
                newMonth.setFullYear(parseInt(year, 10));
                var minMonth = _this.options_.getMinMonth();
                var maxMonth = _this.options_.getMaxMonth();
                if (minMonth !== null && newMonth.getTime() < minMonth.getTime()) {
                    newMonth = minMonth;
                }
                if (maxMonth !== null && newMonth.getTime() > maxMonth.getTime()) {
                    newMonth = maxMonth;
                }
                if (!viewModel.goToMonth_(event, newMonth)) {
                    _this.yearSelect_.value = currentMonth.getFullYear() + '';
                }
            });
            var yearElement = this.htmlHelper_.createDiv_('year');
            var yearContent = this.htmlHelper_.createSpan_();
            yearElement.appendChild(selectElement);
            yearElement.appendChild(yearContent);
            this.yearElement_ = yearContent;
            this.yearSelect_ = selectElement;
            return yearElement;
        };
        Template_.prototype.updateYearElement_ = function (viewModel) {
            if (this.yearElement_ === null) {
                return;
            }
            var currentYear = viewModel.getCurrentMonth_().getFullYear();
            this.yearElement_.innerText = currentYear + '';
            if (!this.options_.isYearAsDropdown()) {
                this.yearSelect_.style.display = 'none';
                this.yearElement_.style.display = '';
                return;
            }
            var minDate = this.options_.getMinDate();
            var maxDate = this.options_.getMaxDate();
            var minYear = minDate !== null ? minDate.getFullYear() : null;
            var maxYear = maxDate !== null ? maxDate.getFullYear() : null;
            var range = this.calculateDropdownRange_(currentYear, minYear, maxYear);
            var options = this.yearSelect_.getElementsByTagName('option');
            var diff = this.calculateDropdownDiff_(options, range, function (value) {
                return parseInt(value, 10);
            });
            for (var index = 0; index < diff.remove.length; index++) {
                this.yearSelect_.removeChild(diff.remove[index]);
            }
            for (var index = diff.prepend.length - 1; index >= 0; index--) {
                this.yearSelect_.insertBefore(this.htmlHelper_.createSelectOption_(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearSelect_.firstChild);
            }
            for (var index = 0; index < diff.append.length; index++) {
                this.yearSelect_.appendChild(this.htmlHelper_.createSelectOption_(diff.append[index] + '', diff.append[index] + ''));
            }
            this.yearSelect_.value = currentYear + '';
            var showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
            this.yearSelect_.style.display = showSelect ? '' : 'none';
            this.yearElement_.style.display = showSelect ? 'none' : '';
        };
        Template_.prototype.createMonthAndYearElement_ = function (viewModel) {
            var _this = this;
            var monthAndYear = this.htmlHelper_.createDiv_('month-year');
            var selectElement = this.htmlHelper_.createSelectInput_([], function (event, value) {
                var currentMonth = viewModel.getCurrentMonth_();
                var newMonth = new Date(currentMonth.getTime());
                var data = _this.parseMonthAndYearOptionValue_(value);
                newMonth.setFullYear(data.year);
                newMonth.setMonth(data.month);
                if (!viewModel.goToMonth_(event, newMonth)) {
                    _this.monthAndYearSelect_.value = _this.getMonthAndYearOptionValue_({
                        month: currentMonth.getMonth(),
                        year: currentMonth.getFullYear()
                    });
                }
            });
            var monthAndYearContent = this.htmlHelper_.createSpan_();
            this.monthAndYearElement_ = monthAndYearContent;
            this.monthAndYearSelect_ = selectElement;
            monthAndYear.appendChild(monthAndYearContent);
            monthAndYear.appendChild(selectElement);
            return monthAndYear;
        };
        Template_.prototype.updateMonthAndYearElement_ = function (viewModel) {
            var _this = this;
            if (this.monthAndYearElement_ === null) {
                return;
            }
            var currentMonth = viewModel.getCurrentMonth_();
            var currentData = {
                month: currentMonth.getMonth(),
                year: currentMonth.getFullYear()
            };
            var currentIndex = this.calculateMonthAndYearIndex_(currentData);
            this.monthAndYearElement_.innerText = this.translateMonthAndYear_(currentData);
            if (!this.options_.isYearAsDropdown() || !this.options_.isMonthAsDropdown()) {
                this.monthAndYearSelect_.style.display = 'none';
                this.monthAndYearElement_.style.display = '';
                return;
            }
            var minDate = this.options_.getMinDate();
            var maxDate = this.options_.getMaxDate();
            var minIndex = minDate !== null ? minDate.getFullYear() * 12 + minDate.getMonth() : null;
            var maxIndex = maxDate !== null ? maxDate.getFullYear() * 12 + maxDate.getMonth() : null;
            var range = this.calculateDropdownRange_(currentIndex, minIndex, maxIndex);
            var options = this.monthAndYearSelect_.getElementsByTagName('option');
            var diff = this.calculateDropdownDiff_(options, range, function (value) {
                return _this.calculateMonthAndYearIndex_(_this.parseMonthAndYearOptionValue_(value));
            });
            for (var index = 0; index < diff.remove.length; index++) {
                this.monthAndYearSelect_.removeChild(diff.remove[index]);
            }
            for (var index = diff.prepend.length - 1; index >= 0; index--) {
                var data = this.getMonthAndYearByIndex_(diff.prepend[index]);
                this.monthAndYearSelect_.insertBefore(this.htmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
            }
            for (var index = 0; index < diff.append.length; index++) {
                var data = this.getMonthAndYearByIndex_(diff.append[index]);
                this.monthAndYearSelect_.appendChild(this.htmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
            }
            this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);
            var showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
            this.monthAndYearSelect_.style.display = showSelect ? '' : 'none';
            this.monthAndYearElement_.style.display = showSelect ? 'none' : '';
        };
        Template_.prototype.translateMonthAndYear_ = function (data) {
            return this.options_.translator.translateMonth(data.month) + ' ' + data.year;
        };
        Template_.prototype.calculateMonthAndYearIndex_ = function (data) {
            return data.year * 12 + data.month;
        };
        Template_.prototype.getMonthAndYearByIndex_ = function (index) {
            return {
                year: Math.floor(index / 12),
                month: index % 12
            };
        };
        Template_.prototype.getMonthAndYearOptionValue_ = function (data) {
            return data.year + '-' + data.month;
        };
        Template_.prototype.parseMonthAndYearOptionValue_ = function (value) {
            var parts = value.split('-');
            return {
                month: parseInt(parts[1], 10),
                year: parseInt(parts[0], 10)
            };
        };
        Template_.prototype.calculateDropdownRange_ = function (current, min, max) {
            var limit = this.options_.getDropdownItemsLimit() - 1;
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
        Template_.prototype.calculateDropdownDiff_ = function (options, newRange, getNumerical) {
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
        Template_.prototype.createTableElement_ = function (viewModel) {
            var tableHeader = this.createTableHeaderElement_(viewModel);
            var tableBody = this.createTableBodyElement_(viewModel);
            return this.htmlHelper_.createTable_('calendar', tableHeader, tableBody);
        };
        Template_.prototype.createTableHeaderElement_ = function (viewModel) {
            var weekDays = viewModel.getWeekDays_();
            var cells = [];
            for (var index = 0; index < weekDays.length; index++) {
                var dayOfWeek = weekDays[index];
                cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
            }
            return this.htmlHelper_.createTableHeader_('calendar-header', cells);
        };
        Template_.prototype.createTableHeaderCellElement_ = function (viewModel, dayOfWeek) {
            var headerCell = this.htmlHelper_.createTableHeaderCell_('week-day');
            if (dayOfWeek === TheDatepicker.DayOfWeek.Saturday || dayOfWeek === TheDatepicker.DayOfWeek.Sunday) {
                this.htmlHelper_.addClass_(headerCell, 'week-day--weekend');
            }
            headerCell.innerText = this.options_.translator.translateDayOfWeek(dayOfWeek);
            return headerCell;
        };
        Template_.prototype.createTableBodyElement_ = function (viewModel) {
            this.daysElements_ = [];
            this.daysButtonsElements_ = [];
            this.daysContentsElements_ = [];
            var rows = [];
            for (var index = 0; index < 6; index++) {
                rows.push(this.createTableRowElement_(viewModel));
            }
            this.weeksElements_ = rows;
            return this.htmlHelper_.createTableBody_('calendar-body', rows);
        };
        Template_.prototype.updateWeeksElements_ = function (viewModel) {
            var weeks = viewModel.getWeeks_();
            for (var weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
                var weekElement = this.weeksElements_[weekIndex];
                var week = weeks.length > weekIndex ? weeks[weekIndex] : null;
                weekElement.style.display = week !== null ? '' : 'none';
                if (week !== null) {
                    for (var dayIndex = 0; dayIndex < this.daysElements_[weekIndex].length; dayIndex++) {
                        this.updateDayElement_(viewModel, this.daysElements_[weekIndex][dayIndex], this.daysButtonsElements_[weekIndex][dayIndex], this.daysContentsElements_[weekIndex][dayIndex], week[dayIndex]);
                    }
                }
            }
        };
        Template_.prototype.createTableRowElement_ = function (viewModel) {
            var cells = [];
            var cellsButtons = [];
            var cellsContents = [];
            for (var index = 0; index < 7; index++) {
                var cell = this.htmlHelper_.createTableCell_();
                var cellButton = this.createTableCellButtonElement_(viewModel);
                var cellContent = this.createTableCellContentElement_(viewModel);
                cells.push(cell);
                cellsButtons.push(cellButton);
                cellsContents.push(cellContent);
                cell.appendChild(cellButton);
                cellButton.appendChild(cellContent);
            }
            this.daysElements_.push(cells);
            this.daysButtonsElements_.push(cellsButtons);
            this.daysContentsElements_.push(cellsContents);
            return this.htmlHelper_.createTableRow_('week', cells);
        };
        Template_.prototype.updateDayElement_ = function (viewModel, dayElement, dayButtonElement, dayContentElement, day) {
            dayButtonElement.day = day;
            dayElement.setAttribute('data-date', day.getFormatted());
            dayElement.className = '';
            this.htmlHelper_.addClass_(dayElement, 'cell');
            this.options_.updateCellStructure_(dayContentElement, day);
            if (!day.isVisible) {
                dayButtonElement.removeAttribute('href');
                dayButtonElement.style.visibility = 'hidden';
                return;
            }
            this.htmlHelper_.addClass_(dayElement, 'day');
            if (day.isToday) {
                this.htmlHelper_.addClass_(dayElement, 'day--today');
            }
            if (day.isPast) {
                this.htmlHelper_.addClass_(dayElement, 'day--past');
            }
            if (day.isWeekend) {
                this.htmlHelper_.addClass_(dayElement, 'day--weekend');
            }
            if (!day.isAvailable) {
                this.htmlHelper_.addClass_(dayElement, 'day--unavailable');
            }
            if (!day.isInCurrentMonth) {
                this.htmlHelper_.addClass_(dayElement, 'day--outside');
            }
            if (day.isHighlighted) {
                this.htmlHelper_.addClass_(dayElement, 'day--highlighted');
            }
            if (day.isSelected) {
                this.htmlHelper_.addClass_(dayElement, 'day--selected');
            }
            var customClasses = this.options_.getCellClasses(day);
            for (var index = 0; index < customClasses.length; index++) {
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
        };
        Template_.prototype.createTableCellButtonElement_ = function (viewModel) {
            var _this = this;
            var cellButton = this.htmlHelper_.createAnchor_(function (event) {
                var previous = viewModel.selectedDate_;
                var isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
                if (_this.options_.isHiddenOnSelect() && (isSelected || (previous !== null && cellButton.day.isEqualToDate(previous)))) {
                    viewModel.close_(event);
                }
            });
            cellButton.onfocus = function (event) {
                viewModel.highlightDay_(event || window.event, cellButton.day);
            };
            cellButton.onmouseenter = function (event) {
                if (_this.options_.getBeforeFocusListeners().length > 0 || _this.options_.getFocusListeners().length > 0) {
                    viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
                }
                else {
                    viewModel.cancelHighlight_(event || window.event);
                }
            };
            cellButton.onmouseleave = function (event) {
                viewModel.cancelHighlight_(event || window.event);
            };
            return cellButton;
        };
        Template_.prototype.createTableCellContentElement_ = function (viewModel) {
            var cellContent = this.options_.getCellStructure_();
            this.htmlHelper_.addClass_(cellContent, 'day-content');
            return cellContent;
        };
        return Template_;
    }());
    TheDatepicker.Template_ = Template_;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var Translator = (function () {
        function Translator() {
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
        }
        Translator.prototype.setDayOfWeekTranslation = function (dayOfWeek, translation) {
            this.dayOfWeekTranslations_[TheDatepicker.Helper_.checkNumber_('First day of week', dayOfWeek, 0, 6)] = TheDatepicker.Helper_.checkString_('Translation', translation);
        };
        Translator.prototype.setMonthTranslation = function (month, translation) {
            this.monthTranslations_[TheDatepicker.Helper_.checkNumber_('Month', month, 0, 11)] = TheDatepicker.Helper_.checkString_('Translation', translation);
        };
        Translator.prototype.translateDayOfWeek = function (dayOfWeek) {
            return this.dayOfWeekTranslations_[dayOfWeek];
        };
        Translator.prototype.translateMonth = function (month) {
            return this.monthTranslations_[month];
        };
        return Translator;
    }());
    TheDatepicker.Translator = Translator;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var MoveDirection_;
    (function (MoveDirection_) {
        MoveDirection_[MoveDirection_["Left"] = -1] = "Left";
        MoveDirection_[MoveDirection_["Up"] = -7] = "Up";
        MoveDirection_[MoveDirection_["Right"] = 1] = "Right";
        MoveDirection_[MoveDirection_["Down"] = 7] = "Down";
    })(MoveDirection_ = TheDatepicker.MoveDirection_ || (TheDatepicker.MoveDirection_ = {}));
    var ViewModel_ = (function () {
        function ViewModel_(options_, datepicker_) {
            this.options_ = options_;
            this.datepicker_ = datepicker_;
            this.selectedDate_ = null;
            this.currentMonth_ = null;
            this.highlightedDay_ = null;
            this.isHighlightedDayFocused_ = false;
            this.active_ = false;
            this.template_ = new TheDatepicker.Template_(this.options_, new TheDatepicker.HtmlHelper_(this.options_), datepicker_.container, datepicker_.input !== null);
        }
        ViewModel_.prototype.render_ = function () {
            if (this.selectPossibleDate_()) {
                return;
            }
            var correctMonth = this.options_.correctMonth(this.getCurrentMonth_());
            if (this.goToMonth_(null, correctMonth)) {
                return;
            }
            this.template_.render_(this);
            this.datepicker_.updateInput_();
        };
        ViewModel_.prototype.setActive_ = function (event, value) {
            if (this.active_ === value) {
                return true;
            }
            if (!this.triggerOnBeforeOpenAndClose_(event, value)) {
                return false;
            }
            this.active_ = value;
            if (this.options_.isHiddenOnBlur()) {
                this.render_();
            }
            this.triggerOnOpenAndClose_(event, value);
            return true;
        };
        ViewModel_.prototype.isActive_ = function () {
            return this.active_;
        };
        ViewModel_.prototype.close_ = function (event) {
            return this.datepicker_.close(event);
        };
        ViewModel_.prototype.getCurrentMonth_ = function () {
            if (this.currentMonth_ === null) {
                this.currentMonth_ = this.options_.getInitialMonth();
            }
            return this.currentMonth_;
        };
        ViewModel_.prototype.canGoBack_ = function () {
            var newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() - 1);
            return this.canGoToMonth_(newMonth);
        };
        ViewModel_.prototype.canGoForward_ = function () {
            var newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() + 1);
            return this.canGoToMonth_(newMonth);
        };
        ViewModel_.prototype.canGoToMonth_ = function (month) {
            return this.options_.isMonthInValidity(month);
        };
        ViewModel_.prototype.goBack_ = function (event) {
            var newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() - 1);
            return this.goToMonth_(event, newMonth);
        };
        ViewModel_.prototype.goForward_ = function (event) {
            var newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() + 1);
            return this.goToMonth_(event, newMonth);
        };
        ViewModel_.prototype.goToMonth_ = function (event, month, doCancelHighlight) {
            if (doCancelHighlight === void 0) { doCancelHighlight = true; }
            month = TheDatepicker.Helper_.resetTime_(new Date(month.getTime()));
            month.setDate(1);
            if (month.getTime() === this.getCurrentMonth_().getTime() || !this.canGoToMonth_(month)) {
                return false;
            }
            if (!this.triggerOnBeforeMonthChange_(event, month, this.currentMonth_)) {
                return false;
            }
            this.currentMonth_ = month;
            if (!doCancelHighlight || !this.cancelHighlight_(event)) {
                this.render_();
            }
            this.triggerOnMonthChange_(event, month, this.currentMonth_);
            return true;
        };
        ViewModel_.prototype.reset_ = function (event) {
            var isMonthChanged = this.goToMonth_(event, this.options_.getInitialMonth());
            var isDaySelected = this.selectInitialDate_(event);
            return isMonthChanged || isDaySelected;
        };
        ViewModel_.prototype.selectDay_ = function (event, date, doUpdateMonth, doHighlight, canToggle) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (doHighlight === void 0) { doHighlight = false; }
            if (canToggle === void 0) { canToggle = false; }
            if (date === null) {
                return this.cancelSelection_(event);
            }
            var day;
            if (date instanceof TheDatepicker.Day) {
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
            var previousDay = this.selectedDate_ !== null ? this.createDay_(this.selectedDate_) : null;
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
        };
        ViewModel_.prototype.selectNearestDate_ = function (event, date) {
            return this.selectDay_(event, this.options_.findNearestAvailableDate(date));
        };
        ViewModel_.prototype.selectPossibleDate_ = function () {
            try {
                return this.selectDay_(null, this.options_.findPossibleAvailableDate(this.selectedDate_), false);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection_(null, true);
            }
        };
        ViewModel_.prototype.selectInitialDate_ = function (event) {
            try {
                return this.selectDay_(event, this.options_.getInitialDate(), false);
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection_(null, true);
            }
        };
        ViewModel_.prototype.highlightDay_ = function (event, day, doUpdateMonth, doFocus) {
            if (doUpdateMonth === void 0) { doUpdateMonth = false; }
            if (doFocus === void 0) { doFocus = true; }
            if (!day.isAvailable) {
                return false;
            }
            if (day.isEqualToDay(this.highlightedDay_)) {
                return false;
            }
            var previousDay = this.highlightedDay_;
            if (!this.triggerOnBeforeFocus_(event, day, previousDay)) {
                return false;
            }
            this.highlightedDay_ = day;
            if (doFocus) {
                this.isHighlightedDayFocused_ = true;
            }
            var date = day.getDate();
            if (!doUpdateMonth || !this.goToMonth_(event, date, false)) {
                this.render_();
            }
            this.triggerOnFocus_(event, day, previousDay);
            return true;
        };
        ViewModel_.prototype.highlightFirstAvailableDay_ = function (event) {
            var date = new Date(this.getCurrentMonth_().getTime());
            var maxDate = this.options_.getMaxDate();
            var day = this.createDay_(date);
            while (!day.isAvailable) {
                date.setDate(day.dayNumber + 1);
                if (date.getDate() === 1) {
                    break;
                }
                if (maxDate !== null && date.getTime() > maxDate.getTime()) {
                    break;
                }
                day = this.createDay_(date);
            }
            return this.highlightDay_(event, day);
        };
        ViewModel_.prototype.highlightSiblingDay_ = function (event, day, direction) {
            var newDay = day;
            var date = newDay.getDate();
            var maxLoops = 1000;
            do {
                date.setDate(newDay.dayNumber + direction);
                newDay = this.createDay_(date);
                if (!newDay.isInValidity) {
                    break;
                }
                maxLoops--;
            } while (!newDay.isAvailable && maxLoops > 0);
            return this.highlightDay_(event, newDay, true);
        };
        ViewModel_.prototype.cancelSelection_ = function (event, force) {
            if (force === void 0) { force = false; }
            if (!this.options_.isAllowedEmpty() && !force) {
                return false;
            }
            if (this.selectedDate_ === null) {
                return false;
            }
            var previousDay = this.createDay_(this.selectedDate_);
            if (!this.triggerOnBeforeSelect_(event, null, previousDay)) {
                return false;
            }
            this.selectedDate_ = null;
            this.render_();
            this.triggerOnSelect_(event, null, previousDay);
            return true;
        };
        ViewModel_.prototype.cancelHighlight_ = function (event) {
            if (this.highlightedDay_ === null) {
                return false;
            }
            var previousDay = this.highlightedDay_;
            if (!this.triggerOnBeforeFocus_(event, null, previousDay)) {
                return false;
            }
            this.highlightedDay_ = null;
            this.render_();
            this.triggerOnFocus_(event, null, previousDay);
            return true;
        };
        ViewModel_.prototype.getWeekDays_ = function () {
            var weekDays = [];
            for (var day = 0; day < 7; day++) {
                weekDays.push((this.options_.getFirstDayOfWeek() + day) % 7);
            }
            return weekDays;
        };
        ViewModel_.prototype.getWeeks_ = function () {
            var date;
            var days = [];
            var currentMonth = this.getCurrentMonth_();
            var firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            var lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
            var prependDaysCount = (firstDateOfMonth.getDay() - this.options_.getFirstDayOfWeek() + 7) % 7;
            for (date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
                var day = this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
                day.isVisible = this.options_.areDaysOutOfMonthVisible();
                day.isInCurrentMonth = false;
                days.push(day);
            }
            var lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            var monthDaysCount = lastDateOfMonth.getDate();
            for (date = 1; date <= monthDaysCount; date++) {
                days.push(this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
            }
            var appendDaysCount = 6 - ((lastDateOfMonth.getDay() - this.options_.getFirstDayOfWeek() + 7) % 7);
            for (date = 1; date <= appendDaysCount; date++) {
                var day = this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
                day.isVisible = this.options_.areDaysOutOfMonthVisible();
                day.isInCurrentMonth = false;
                days.push(day);
            }
            if (this.options_.hasFixedRowsCount()) {
                for (var date_4 = appendDaysCount + 1; days.length < 6 * 7; date_4++) {
                    var day = this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date_4));
                    day.isVisible = this.options_.areDaysOutOfMonthVisible();
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
        ViewModel_.prototype.triggerKeyPress_ = function (event) {
            if (TheDatepicker.Helper_.inArray_([TheDatepicker.KeyCode_.Left, TheDatepicker.KeyCode_.Up, TheDatepicker.KeyCode_.Right, TheDatepicker.KeyCode_.Down], event.keyCode)) {
                TheDatepicker.Helper_.preventDefault_(event);
                if (this.highlightedDay_ !== null) {
                    this.highlightSiblingDay_(event, this.highlightedDay_, this.translateKeyCodeToMoveDirection_(event.keyCode));
                }
                else if (this.selectedDate_ !== null
                    && this.selectedDate_.getFullYear() === this.getCurrentMonth_().getFullYear()
                    && this.selectedDate_.getMonth() === this.getCurrentMonth_().getMonth()) {
                    this.highlightSiblingDay_(event, this.createDay_(this.selectedDate_), this.translateKeyCodeToMoveDirection_(event.keyCode));
                }
                else {
                    this.highlightFirstAvailableDay_(event);
                }
            }
        };
        ViewModel_.prototype.triggerOnBeforeSelect_ = function (event, day, previousDay) {
            var _this = this;
            return this.options_.triggerEvent_(TheDatepicker.EventType_.BeforeSelect, function (listener) {
                return listener.call(_this.datepicker_, event, day, previousDay);
            });
        };
        ViewModel_.prototype.triggerOnSelect_ = function (event, day, previousDay) {
            var _this = this;
            this.options_.triggerEvent_(TheDatepicker.EventType_.Select, function (listener) {
                return listener.call(_this.datepicker_, event, day, previousDay);
            });
        };
        ViewModel_.prototype.triggerOnBeforeOpenAndClose_ = function (event, isOpening) {
            var _this = this;
            return this.options_.triggerEvent_(TheDatepicker.EventType_.BeforeOpenAndClose, function (listener) {
                return listener.call(_this.datepicker_, event, isOpening);
            });
        };
        ViewModel_.prototype.triggerOnOpenAndClose_ = function (event, isOpening) {
            var _this = this;
            this.options_.triggerEvent_(TheDatepicker.EventType_.OpenAndClose, function (listener) {
                return listener.call(_this.datepicker_, event, isOpening);
            });
        };
        ViewModel_.prototype.triggerOnBeforeMonthChange_ = function (event, month, previousMonth) {
            var _this = this;
            return this.options_.triggerEvent_(TheDatepicker.EventType_.BeforeMonthChange, function (listener) {
                return listener.call(_this.datepicker_, event, month, previousMonth);
            });
        };
        ViewModel_.prototype.triggerOnMonthChange_ = function (event, month, previousMonth) {
            var _this = this;
            this.options_.triggerEvent_(TheDatepicker.EventType_.MonthChange, function (listener) {
                return listener.call(_this.datepicker_, event, month, previousMonth);
            });
        };
        ViewModel_.prototype.triggerOnBeforeFocus_ = function (event, day, previousDay) {
            var _this = this;
            return this.options_.triggerEvent_(TheDatepicker.EventType_.BeforeFocus, function (listener) {
                return listener.call(_this.datepicker_, event, day, previousDay);
            });
        };
        ViewModel_.prototype.triggerOnFocus_ = function (event, day, previousDay) {
            var _this = this;
            this.options_.triggerEvent_(TheDatepicker.EventType_.Focus, function (listener) {
                return listener.call(_this.datepicker_, event, day, previousDay);
            });
        };
        ViewModel_.prototype.createDay_ = function (date) {
            date = TheDatepicker.Helper_.resetTime_(new Date(date.getTime()));
            var today = this.options_.getToday();
            var day = new TheDatepicker.Day(date);
            day.isToday = date.getTime() === today.getTime();
            day.isPast = date.getTime() < today.getTime();
            day.isInValidity = this.options_.isDateInValidity(date);
            day.isAvailable = day.isInValidity && this.options_.isDateAvailable(date);
            if (day.isAvailable) {
                if (day.isEqualToDate(this.selectedDate_)) {
                    day.isSelected = true;
                }
                if (day.isEqualToDay(this.highlightedDay_)) {
                    day.isHighlighted = true;
                    if (this.isHighlightedDayFocused_) {
                        day.isFocused = true;
                        this.isHighlightedDayFocused_ = false;
                    }
                }
            }
            this.options_.modifyDay(day);
            return day;
        };
        ViewModel_.prototype.translateKeyCodeToMoveDirection_ = function (key) {
            switch (key) {
                case TheDatepicker.KeyCode_.Left:
                    return MoveDirection_.Left;
                case TheDatepicker.KeyCode_.Up:
                    return MoveDirection_.Up;
                case TheDatepicker.KeyCode_.Right:
                    return MoveDirection_.Right;
                case TheDatepicker.KeyCode_.Down:
                    return MoveDirection_.Down;
                default:
                    throw new Error('Invalid key code: ' + key);
            }
        };
        return ViewModel_;
    }());
    TheDatepicker.ViewModel_ = ViewModel_;
})(TheDatepicker || (TheDatepicker = {}));
