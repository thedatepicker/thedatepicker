var TheDatepicker;
(function (TheDatepicker) {
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
        ClassNameType[ClassNameType["MainDarkMode"] = 64] = "MainDarkMode";
    })(ClassNameType = TheDatepicker.ClassNameType || (TheDatepicker.ClassNameType = {}));
    var ClassNames = (function () {
        function ClassNames() {
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
                ['main--darkmode'],
            ];
        }
        ClassNames.prototype.clone = function () {
            var classNames = new ClassNames();
            var index;
            for (index = 0; index < this.classNames_.length; index++) {
                classNames.classNames_ = this.classNames_.slice(0);
            }
            return classNames;
        };
        ClassNames.prototype.setClassName = function (type, className) {
            if (type === ClassNameType.ContainerDarkMode) {
                TheDatepicker.Helper_.warnDeprecatedUsage_('ClassNameType.ContainerDarkMode', ['ClassNameType.MainDarkMode']);
                this.setClassName(ClassNameType.MainDarkMode, className);
            }
            this.classNames_[this.checkType_(type)] = this.normalizeClassName_(className);
        };
        ClassNames.prototype.addClassName = function (type, className) {
            this.classNames_[this.checkType_(type)].concat(this.normalizeClassName_(className));
        };
        ClassNames.prototype.getClassName = function (type) {
            return this.classNames_[type].slice(0);
        };
        ClassNames.prototype.checkType_ = function (type) {
            return TheDatepicker.Helper_.checkNumber_('Class name type', type, 0, this.classNames_.length - 1);
        };
        ClassNames.prototype.normalizeClassName_ = function (className) {
            var parameterName = 'Class name';
            if (typeof className !== 'object' || className.constructor !== Array) {
                className = TheDatepicker.Helper_.checkString_(parameterName, className).split(/\s+/);
            }
            var result = [];
            for (var index = 0; index < className.length; index++) {
                var name_1 = TheDatepicker.Helper_.checkString_(parameterName, className[index]);
                if (name_1) {
                    result.push(name_1);
                }
            }
            return result;
        };
        return ClassNames;
    }());
    TheDatepicker.ClassNames = ClassNames;
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
    var DateConverter_ = (function () {
        function DateConverter_() {
        }
        DateConverter_.formatDate_ = function (date, options, format) {
            if (format === void 0) { format = null; }
            if (!date) {
                return null;
            }
            format = format || options.getInputFormat();
            var escapeNext = false;
            var result = '';
            for (var position = 0; position < format.length; position++) {
                var char = format.substring(position, position + 1);
                if (escapeNext) {
                    result += char;
                    escapeNext = false;
                    continue;
                }
                if (char === DateConverter_.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                var formatter = DateConverter_.getFormatter_(char);
                if (formatter) {
                    result += formatter.call(null, date, options);
                    continue;
                }
                result += char;
            }
            return result;
        };
        DateConverter_.parseDate_ = function (text, options) {
            if (text === '') {
                return null;
            }
            var format = options.getInputFormat();
            var dateData = new ParsedDateData();
            var escapeNext = false;
            var textPosition = 0;
            for (var position = 0; position < format.length; position++) {
                var char = format.substring(position, position + 1);
                if (escapeNext) {
                    escapeNext = false;
                }
                else if (char === DateConverter_.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                else {
                    var parser = DateConverter_.getParser_(char);
                    if (parser) {
                        try {
                            textPosition += parser.call(null, text.substring(textPosition), dateData, options);
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
        DateConverter_.isValidChar_ = function (textChar, options) {
            if (textChar === '' || /[0-9-]/.test(textChar)) {
                return true;
            }
            var format = options.getInputFormat();
            var escapeNext = false;
            for (var position = 0; position < format.length; position++) {
                var char = format.substring(position, position + 1);
                if (escapeNext) {
                    escapeNext = false;
                }
                else if (char === DateConverter_.escapeChar_) {
                    escapeNext = true;
                    continue;
                }
                else {
                    var phrases = DateConverter_.getValidPhrases_(char, options);
                    if (phrases) {
                        var textCharLower = textChar.toLowerCase();
                        for (var index = 0; index < phrases.length; index++) {
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
        };
        DateConverter_.getFormatter_ = function (type) {
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
        };
        DateConverter_.formatDay_ = function (date) {
            return date.getDate() + '';
        };
        DateConverter_.formatDayWithLeadingZero_ = function (date) {
            return ('0' + date.getDate()).slice(-2);
        };
        DateConverter_.formatDayOfWeekTextual_ = function (date, options) {
            return options.translator.translateDayOfWeek(date.getDay());
        };
        DateConverter_.formatDayOfWeekTextualFull_ = function (date, options) {
            return options.translator.translateDayOfWeekFull(date.getDay());
        };
        DateConverter_.formatMonth_ = function (date) {
            return (date.getMonth() + 1) + '';
        };
        DateConverter_.formatMonthWithLeadingZero_ = function (date) {
            return ('0' + (date.getMonth() + 1)).slice(-2);
        };
        DateConverter_.formatMonthTextual_ = function (date, options) {
            return options.translator.translateMonth(date.getMonth());
        };
        DateConverter_.formatMonthTextualShort_ = function (date, options) {
            return options.translator.translateMonthShort(date.getMonth());
        };
        DateConverter_.formatYear_ = function (date) {
            return date.getFullYear() + '';
        };
        DateConverter_.formatYearTwoDigits_ = function (date) {
            var year = date.getFullYear() + '';
            return year.substring(year.length - 2);
        };
        DateConverter_.getParser_ = function (type) {
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
        };
        DateConverter_.parseDay_ = function (text, dateData) {
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
        DateConverter_.parseDayOfWeekTextual_ = function (text, dateData, options) {
            return DateConverter_.parseDayOfWeekByTranslator_(text, function (dayOfWeek) {
                return options.translator.translateDayOfWeek(dayOfWeek);
            });
        };
        DateConverter_.parseDayOfWeekTextualFull_ = function (text, dateData, options) {
            return DateConverter_.parseDayOfWeekByTranslator_(text, function (dayOfWeek) {
                return options.translator.translateDayOfWeekFull(dayOfWeek);
            });
        };
        DateConverter_.parseDayOfWeekByTranslator_ = function (text, translate) {
            var maxLength = 0;
            var matchedTranslationLength = 0;
            for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                var translation = translate(dayOfWeek);
                maxLength = Math.max(maxLength, translation.length);
                if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()
                    && translation.length > matchedTranslationLength) {
                    matchedTranslationLength = translation.length;
                }
            }
            if (matchedTranslationLength > 0) {
                return matchedTranslationLength;
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
        DateConverter_.parseMonth_ = function (text, dateData) {
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
        DateConverter_.parseMonthTextual_ = function (text, dateData, options) {
            return DateConverter_.parseMonthByTranslator_(text, dateData, function (month) {
                return options.translator.translateMonth(month);
            });
        };
        DateConverter_.parseMonthTextualShort_ = function (text, dateData, options) {
            return DateConverter_.parseMonthByTranslator_(text, dateData, function (month) {
                return options.translator.translateMonthShort(month);
            });
        };
        DateConverter_.parseMonthByTranslator_ = function (text, dateData, translate) {
            var matchedMonth = null;
            var matchedTranslationLength = 0;
            for (var month = 1; month <= 12; month++) {
                var translation = translate(month - 1);
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
        };
        DateConverter_.parseYear_ = function (text, dateData, options) {
            var isNegative = false;
            if (text.substring(0, 1) === '-') {
                isNegative = true;
                text = text.substring(1);
            }
            var minDate = options.getMinDate_();
            var maxDate = options.getMaxDate_();
            var maxPositiveLength = maxDate.getFullYear() > 0 ? (maxDate.getFullYear() + '').length : 0;
            var maxNegativeLength = minDate.getFullYear() < 0 ? (-minDate.getFullYear() + '').length : 0;
            var yearLength = 0;
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
            var year = parseInt(text.substring(0, yearLength), 10);
            if (isNegative) {
                year = -year;
            }
            dateData.year = year;
            return yearLength + (isNegative ? 1 : 0);
        };
        DateConverter_.parseYearTwoDigits_ = function (text, dateData, options) {
            var yearEnd = text.substring(0, 2);
            if (!/[0-9]{2}/.test(yearEnd)) {
                throw new CannotParseDateException();
            }
            var currentYear = (options.getToday()).getFullYear() + '';
            var yearBeginning = currentYear.substring(0, currentYear.length - 2);
            dateData.year = parseInt(yearBeginning + yearEnd, 10);
            return 2;
        };
        DateConverter_.getValidPhrases_ = function (type, options) {
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
        };
        DateConverter_.escapeChar_ = '\\';
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
            if (input && !TheDatepicker.Helper_.isElement_(input)) {
                throw new Error('Input was expected to be null or an HTMLElement.');
            }
            if (container && !TheDatepicker.Helper_.isElement_(container)) {
                throw new Error('Container was expected to be null or an HTMLElement.');
            }
            if (!input && !container) {
                throw new Error('At least one of input or container is mandatory.');
            }
            if (options && !(options instanceof TheDatepicker.Options)) {
                throw new Error('Options was expected to be an instance of Options');
            }
            Datepicker.document_ = document;
            this.options = options ? options.clone() : new TheDatepicker.Options();
            var duplicateError = 'There is already a datepicker present on ';
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
            this.viewModel_ = new TheDatepicker.ViewModel_(this.options, this);
            this.triggerReady_(input);
            this.triggerReady_(container);
        }
        Datepicker.prototype.render = function () {
            var _this = this;
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
                        this.inputListenerRemover_ = TheDatepicker.Helper_.addEventListener_(this.inputClickable_, TheDatepicker.ListenerType_.Focus, function (event) {
                            _this.open(event);
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
            if (this.inputClickable_) {
                this.inputClickable_.focus();
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
            if (this.inputClickable_) {
                this.inputClickable_.blur();
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
        };
        Datepicker.prototype.isDestroyed = function () {
            return this.initializationPhase_ === InitializationPhase.Destroyed;
        };
        Datepicker.prototype.selectDate = function (date, doUpdateMonth, event) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (event === void 0) { event = null; }
            return this.viewModel_.selectDay_(event, TheDatepicker.Helper_.normalizeDate_('Date', date, true, this.options), !!doUpdateMonth);
        };
        Datepicker.prototype.getSelectedDate = function () {
            return this.viewModel_.selectedDate_ ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
        };
        Datepicker.prototype.getSelectedDateFormatted = function (format) {
            if (format === void 0) { format = null; }
            return TheDatepicker.DateConverter_.formatDate_(this.viewModel_.selectedDate_, this.options, TheDatepicker.Helper_.checkString_('Format', format));
        };
        Datepicker.prototype.getCurrentMonth = function () {
            return new Date(this.viewModel_.getCurrentMonth_().getTime());
        };
        Datepicker.prototype.goToMonth = function (month, event) {
            if (event === void 0) { event = null; }
            return this.viewModel_.goToMonth_(event, TheDatepicker.Helper_.normalizeDate_('Month', month, false, this.options));
        };
        Datepicker.prototype.parseRawInput = function () {
            return this.inputText_
                ? TheDatepicker.DateConverter_.parseDate_(this.inputText_.value, this.options)
                : null;
        };
        Datepicker.prototype.getDay = function (date) {
            return this.viewModel_.createDay_(TheDatepicker.Helper_.normalizeDate_('Date', date, false, this.options));
        };
        Datepicker.prototype.canType_ = function (char) {
            if (!this.inputText_ || this.options.isAllowedInputAnyChar()) {
                return true;
            }
            return TheDatepicker.DateConverter_.isValidChar_(char, this.options);
        };
        Datepicker.prototype.readInput_ = function (event) {
            if (event === void 0) { event = null; }
            if (!this.inputText_) {
                return false;
            }
            try {
                var date = this.parseRawInput();
                if (date ? this.viewModel_.selectNearestDate_(event, date) : this.viewModel_.cancelSelection_(event)) {
                    this.updateDeselectElement_();
                    return true;
                }
            }
            catch (error) {
                if (!(error instanceof TheDatepicker.CannotParseDateException)) {
                    throw error;
                }
            }
            return false;
        };
        Datepicker.prototype.updateInput_ = function () {
            if (!this.inputText_ || this.inputText_ === Datepicker.document_.activeElement) {
                return;
            }
            this.inputText_.value = TheDatepicker.DateConverter_.formatDate_(this.viewModel_.selectedDate_, this.options) || '';
            this.updateDeselectElement_();
        };
        Datepicker.onDatepickerReady = function (element, callback) {
            if (callback === void 0) { callback = null; }
            if (!TheDatepicker.Helper_.isElement_(element)) {
                throw new Error('Element was expected to be an HTMLElement.');
            }
            callback = TheDatepicker.Helper_.checkFunction_('Callback', callback);
            var promise = null;
            var promiseResolve = null;
            if (typeof Promise !== 'undefined') {
                promise = new Promise(function (resolve) {
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
                    promiseResolve: promiseResolve,
                    element: element,
                    callback: callback
                });
            }
            return promise;
        };
        ;
        Datepicker.prototype.createContainer_ = function () {
            return TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Container, this.options);
        };
        Datepicker.prototype.createDeselectElement_ = function () {
            var _this = this;
            if (!this.inputText_ || !this.options.isDeselectButtonShown() || this.deselectElement_) {
                return null;
            }
            var deselectButton = TheDatepicker.HtmlHelper_.createAnchor_(function (event) {
                deselectButton.focus();
                _this.viewModel_.cancelSelection_(event);
            }, this.options, TheDatepicker.ClassNameType.DeselectButton);
            deselectButton.innerHTML = this.options.getDeselectHtml();
            var title = this.options.translator.translateTitle(TheDatepicker.TitleName.Deselect);
            if (title !== '') {
                deselectButton.title = title;
            }
            var deselectElement = TheDatepicker.HtmlHelper_.createSpan_();
            TheDatepicker.HtmlHelper_.addClass_(deselectElement, TheDatepicker.ClassNameType.Deselect, this.options);
            deselectElement.appendChild(deselectButton);
            this.inputText_.parentNode.insertBefore(deselectElement, this.inputText_.nextSibling);
            this.deselectElement_ = deselectElement;
            this.deselectButton_ = deselectButton;
        };
        Datepicker.prototype.updateDeselectElement_ = function () {
            if (!this.deselectElement_) {
                return;
            }
            var isVisible = this.options.isDeselectButtonShown() && this.viewModel_.selectedDate_;
            this.deselectElement_.style.visibility = isVisible ? 'visible' : 'hidden';
        };
        Datepicker.prototype.preselectFromInput_ = function () {
            if (this.inputText_) {
                try {
                    var date = this.parseRawInput();
                    if (date) {
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
                var checkMiss = function (event) {
                    if (Datepicker.hasClickedViewModel_) {
                        Datepicker.hasClickedViewModel_ = false;
                    }
                    else {
                        Datepicker.activateViewModel_(event, null);
                    }
                };
                TheDatepicker.Helper_.addEventListener_(Datepicker.document_, TheDatepicker.ListenerType_.MouseDown, checkMiss);
                TheDatepicker.Helper_.addEventListener_(Datepicker.document_, TheDatepicker.ListenerType_.FocusIn, checkMiss);
                TheDatepicker.Helper_.addEventListener_(Datepicker.document_, TheDatepicker.ListenerType_.KeyDown, function (event) {
                    if (Datepicker.activeViewModel_) {
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
            if (this.deselectButton_) {
                var hitIfActive = function (event) {
                    if (_this.viewModel_.isActive_()) {
                        hit(event);
                    }
                };
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.deselectButton_, TheDatepicker.ListenerType_.MouseDown, hitIfActive));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.deselectButton_, TheDatepicker.ListenerType_.Focus, hitIfActive));
            }
            if (this.inputClickable_) {
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.inputClickable_, TheDatepicker.ListenerType_.MouseDown, hit));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.inputClickable_, TheDatepicker.ListenerType_.Focus, hit));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.inputClickable_, TheDatepicker.ListenerType_.Blur, function () {
                    _this.updateInput_();
                }));
            }
            if (this.inputText_) {
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.inputText_, TheDatepicker.ListenerType_.KeyDown, function (event) {
                    TheDatepicker.Helper_.stopPropagation_(event);
                    if (event.keyCode === TheDatepicker.KeyCode_.Esc && _this.options.isClosedOnEscPress()) {
                        _this.close(event);
                    }
                }));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.inputText_, TheDatepicker.ListenerType_.KeyUp, function (event) {
                    _this.readInput_(event);
                }));
                this.listenerRemovers_.push(TheDatepicker.Helper_.addEventListener_(this.inputText_, TheDatepicker.ListenerType_.KeyPress, function (event) {
                    var charCode = event.charCode || event.keyCode;
                    if (charCode && !_this.canType_(String.fromCharCode(charCode))) {
                        TheDatepicker.Helper_.preventDefault_(event);
                    }
                }));
            }
        };
        Datepicker.prototype.removeInitialInputListener_ = function () {
            if (this.inputListenerRemover_) {
                this.inputListenerRemover_();
                this.inputListenerRemover_ = null;
            }
        };
        Datepicker.prototype.triggerReady_ = function (element) {
            for (var index = Datepicker.readyListeners_.length - 1; index >= 0; index--) {
                var listener = Datepicker.readyListeners_[index];
                if (listener.element === element) {
                    this.triggerReadyListener_(listener.callback, element);
                    if (listener.promiseResolve) {
                        listener.promiseResolve(this);
                    }
                    Datepicker.readyListeners_.splice(index, 1);
                }
            }
        };
        Datepicker.prototype.triggerReadyListener_ = function (callback, element) {
            if (callback) {
                callback.call(element, this, element);
            }
        };
        Datepicker.prototype.onActivate_ = function () {
            if (this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            this.updateContainer_();
            if (this.inputText_) {
                this.inputText_.readOnly = !this.options.isKeyboardOnMobile() && TheDatepicker.Helper_.isMobile_();
            }
        };
        Datepicker.prototype.updateContainer_ = function () {
            if (this.isContainerExternal_) {
                return;
            }
            this.container.className = '';
            TheDatepicker.HtmlHelper_.addClass_(this.container, TheDatepicker.ClassNameType.Container, this.options);
            if (this.options.isDarkModeEnabled()) {
                TheDatepicker.HtmlHelper_.addClass_(this.container, TheDatepicker.ClassNameType.ContainerDarkMode, this.options);
            }
            if (this.options.isFullScreenOnMobile()) {
                TheDatepicker.HtmlHelper_.addClass_(this.container, TheDatepicker.ClassNameType.ContainerResponsive, this.options);
            }
            if (this.container.childNodes.length === 0) {
                return;
            }
            var position = this.options.getPosition();
            var locateOver = position === TheDatepicker.Position.TopRight || position === TheDatepicker.Position.TopLeft;
            var locateLeft = position === TheDatepicker.Position.BottomLeft || position === TheDatepicker.Position.TopLeft;
            var mainElement = this.container.childNodes[0];
            mainElement.style.position = '';
            mainElement.style.top = '';
            mainElement.style.left = '';
            var inputWidth = this.input.offsetWidth;
            var inputHeight = this.input.offsetHeight;
            var containerWidth = this.container.offsetWidth;
            var containerHeight = this.container.offsetHeight;
            if (this.options.isPositionFixingEnabled()) {
                var document_1 = Datepicker.document_;
                var windowTop = window.scrollY || window.pageYOffset || document_1.documentElement.scrollTop || document_1.body.scrollTop || 0;
                var windowLeft = window.scrollX || window.pageXOffset || document_1.documentElement.scrollLeft || document_1.body.scrollLeft || 0;
                var isCompactMode = document_1.compatMode === 'CSS1Compat';
                var windowHeight = window.innerHeight || (isCompactMode ? document_1.documentElement.clientHeight : document_1.body.clientHeight) || 0;
                var windowWidth = window.innerWidth || (isCompactMode ? document_1.documentElement.clientWidth : document_1.body.clientWidth) || 0;
                var windowBottom = windowTop + windowHeight;
                var windowRight = windowLeft + windowWidth;
                var rect = this.input.getBoundingClientRect();
                var inputTop = rect.top + windowTop;
                var inputLeft = rect.left + windowLeft;
                var inputBottom = inputTop + inputHeight;
                var inputRight = inputLeft + inputWidth;
                var fitsTop = inputTop - windowTop > containerHeight;
                var fitsBottom = windowBottom - inputBottom > containerHeight;
                var fitsLeft = inputLeft - windowLeft > containerWidth - inputWidth;
                var fitsRight = windowRight - inputRight > containerWidth - inputWidth;
                locateOver = (locateOver && (fitsTop || !fitsBottom)) || (fitsTop && !fitsBottom);
                locateLeft = (locateLeft && (fitsLeft || !fitsRight)) || (fitsLeft && !fitsRight);
            }
            mainElement.style.position = locateOver || locateLeft ? 'absolute' : '';
            if (locateOver) {
                TheDatepicker.HtmlHelper_.addClass_(this.container, TheDatepicker.ClassNameType.ContainerOver, this.options);
                mainElement.style.top = '-' + (inputHeight + containerHeight) + 'px';
            }
            if (locateLeft) {
                TheDatepicker.HtmlHelper_.addClass_(this.container, TheDatepicker.ClassNameType.ContainerLeft, this.options);
                mainElement.style.left = '-' + (containerWidth - inputWidth) + 'px';
            }
        };
        Datepicker.setBodyClass_ = function (enable) {
            var pageClass = 'the-datepicker-page';
            var body = Datepicker.document_.body;
            var className = body.className;
            var hasClass = className.indexOf(pageClass) > -1;
            if (!hasClass && enable) {
                body.className += (className.length > 0 ? ' ' : '') + pageClass;
            }
            else if (hasClass && !enable) {
                var search = pageClass;
                if (className.indexOf(' ' + pageClass) > -1) {
                    search = ' ' + pageClass;
                }
                else if (className.indexOf(pageClass + ' ') > -1) {
                    search = pageClass + ' ';
                }
                body.className = className.replace(search, '');
            }
        };
        Datepicker.activateViewModel_ = function (event, datepicker) {
            var viewModel = datepicker ? datepicker.viewModel_ : null;
            var activeViewModel = Datepicker.activeViewModel_;
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
        function Day(date, createDay, formatDate) {
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
            this.isWeekend = this.dayOfWeek === TheDatepicker.DayOfWeek.Saturday || this.dayOfWeek === TheDatepicker.DayOfWeek.Sunday;
            this.createDay_ = createDay;
            this.formatDate_ = formatDate;
        }
        Day.prototype.getDate = function () {
            return new Date(this.year, this.month - 1, this.dayNumber, 0, 0, 0, 0);
        };
        Day.prototype.getFormatted = function () {
            return this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.dayNumber).slice(-2);
        };
        Day.prototype.getInputFormatted = function (format) {
            if (format === void 0) { format = null; }
            return this.formatDate_(this.getDate(), TheDatepicker.Helper_.checkString_('Format', format));
        };
        Day.prototype.isEqualToDate = function (date) {
            return TheDatepicker.Helper_.isValidDate_(date)
                && this.dayNumber === date.getDate()
                && this.month === date.getMonth() + 1
                && this.year === date.getFullYear();
        };
        Day.prototype.isEqualToDay = function (day) {
            return day instanceof Day
                && this.dayNumber === day.dayNumber
                && this.month === day.month
                && this.year === day.year;
        };
        Day.prototype.getSibling = function (shift) {
            if (shift === void 0) { shift = 1; }
            var date = this.getDate();
            date.setDate(date.getDate() + TheDatepicker.Helper_.checkNumber_('Shift', shift));
            return this.createDay_(date);
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
    var Align;
    (function (Align) {
        Align[Align["Left"] = 1] = "Left";
        Align[Align["Right"] = 2] = "Right";
        Align[Align["Center"] = 3] = "Center";
    })(Align = TheDatepicker.Align || (TheDatepicker.Align = {}));
    var Position;
    (function (Position) {
        Position[Position["BottomRight"] = 1] = "BottomRight";
        Position[Position["BottomLeft"] = 2] = "BottomLeft";
        Position[Position["TopRight"] = 3] = "TopRight";
        Position[Position["TopLeft"] = 4] = "TopLeft";
    })(Position = TheDatepicker.Position || (TheDatepicker.Position = {}));
    var KeyCode_;
    (function (KeyCode_) {
        KeyCode_[KeyCode_["Enter"] = 13] = "Enter";
        KeyCode_[KeyCode_["Space"] = 32] = "Space";
        KeyCode_[KeyCode_["Left"] = 37] = "Left";
        KeyCode_[KeyCode_["Up"] = 38] = "Up";
        KeyCode_[KeyCode_["Right"] = 39] = "Right";
        KeyCode_[KeyCode_["Down"] = 40] = "Down";
        KeyCode_[KeyCode_["Esc"] = 27] = "Esc";
    })(KeyCode_ = TheDatepicker.KeyCode_ || (TheDatepicker.KeyCode_ = {}));
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
    })(ListenerType_ = TheDatepicker.ListenerType_ || (TheDatepicker.ListenerType_ = {}));
    var Helper_ = (function () {
        function Helper_() {
        }
        Helper_.resetTime_ = function (date) {
            if (!date) {
                return null;
            }
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        };
        Helper_.normalizeDate_ = function (parameterName, value, isNullable, options) {
            if (!value) {
                if (!isNullable) {
                    throw new Error(parameterName + ' cannot be empty.');
                }
                return null;
            }
            if (value instanceof TheDatepicker.Day) {
                return value.getDate();
            }
            if (typeof value === 'string') {
                value = value.trim ? value.trim() : value;
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
                var date = options.getToday();
                var parsedValue = value;
                var matches = value.match(new RegExp('^\\s*([0-9]+)\.?\\s*(' + Helper_.months_.join('|') + ')\\s*', 'i'));
                if (matches) {
                    var day = parseInt(matches[1], 10);
                    var month = void 0;
                    for (month = 0; month < Helper_.months_.length; month++) {
                        if (matches[2].toLowerCase() === Helper_.months_[month]) {
                            date.setMonth(month);
                            date.setDate(day);
                            break;
                        }
                    }
                    parsedValue = parsedValue.substring(matches[0].length);
                }
                var sumPositive = true;
                while (parsedValue) {
                    var matches_1 = parsedValue.match(/^\s*([+-]?)\s*([0-9]+)\s*(day|week|month|year)s?\s*/i);
                    if (!matches_1) {
                        break;
                    }
                    switch (matches_1[1]) {
                        case '+':
                            sumPositive = true;
                            break;
                        case '-':
                            sumPositive = false;
                    }
                    var amount = parseInt(matches_1[2], 10) * (sumPositive ? 1 : -1);
                    switch (matches_1[3].toLowerCase()) {
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
                    parsedValue = parsedValue.substring(matches_1[0].length);
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
                var date = Helper_.resetTime_(new Date(value.getTime()));
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            throw new Error(parameterName
                + ' was expected to be a valid Date string or valid Date or TheDatepicker.Day'
                + (isNullable ? ' or null.' : '.'));
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
        Helper_.addEventListener_ = function (element, listenerType, listener, isPassive) {
            if (isPassive === void 0) { isPassive = false; }
            if (element.addEventListener) {
                var options = void 0;
                if (isPassive && Helper_.isPassiveEventListenerSupported_()) {
                    options = {
                        passive: true
                    };
                }
                element.addEventListener(listenerType, listener, options);
                return function () {
                    element.removeEventListener(listenerType, listener);
                };
            }
            var listenerProperty = 'on' + listenerType;
            var originalListener = element[listenerProperty] || null;
            element[listenerProperty] = function (event) {
                event = event || window.event;
                if (originalListener) {
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
            value = typeof value === 'string' ? parseInt(value, 10) : value;
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
        Helper_.warnDeprecatedUsage_ = function (deprecatedMethod, alternateMethods) {
            if (!window.console) {
                return;
            }
            for (var index = 0; index < Helper_.deprecatedMethods_.length; index++) {
                if (deprecatedMethod === Helper_.deprecatedMethods_[0]) {
                    return;
                }
            }
            window.console.warn('TheDatepicker: ' + deprecatedMethod + ' is deprecated, use ' + alternateMethods.join(' or '));
            Helper_.deprecatedMethods_.push(deprecatedMethod);
        };
        Helper_.addSwipeListener_ = function (element, listener) {
            var startPosition = null;
            var minDistance;
            Helper_.addEventListener_(element, ListenerType_.TouchStart, function (event) {
                startPosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
                minDistance = {
                    x: element.offsetWidth / 5,
                    y: element.offsetHeight / 5
                };
            }, true);
            Helper_.addEventListener_(element, ListenerType_.TouchMove, function (event) {
                if (!startPosition) {
                    return;
                }
                var diffX = event.touches[0].clientX - startPosition.x;
                var diffY = event.touches[0].clientY - startPosition.y;
                var moveDirection = null;
                if (Math.abs(diffX) > minDistance.x) {
                    moveDirection = diffX > 0 ? TheDatepicker.MoveDirection_.Right : TheDatepicker.MoveDirection_.Left;
                }
                else if (Math.abs(diffY) > minDistance.x) {
                    moveDirection = diffY > 0 ? TheDatepicker.MoveDirection_.Down : TheDatepicker.MoveDirection_.Up;
                }
                if (moveDirection) {
                    listener(event, moveDirection);
                    startPosition = null;
                }
            }, true);
        };
        Helper_.isCssAnimationSupported_ = function () {
            if (Helper_.cssAnimationSupport_ === null) {
                var fakeElement = document.createElement('div');
                Helper_.cssAnimationSupport_ = fakeElement.style.animationName === '';
            }
            return Helper_.cssAnimationSupport_;
        };
        Helper_.isPassiveEventListenerSupported_ = function () {
            if (Helper_.passiveEventListenerSupport_ === null) {
                var isSupported_1 = false;
                try {
                    var options = Object.defineProperty({}, 'passive', {
                        get: function () {
                            isSupported_1 = true;
                            return false;
                        }
                    });
                    window.addEventListener('test', null, options);
                    window.removeEventListener('test', null, options);
                }
                catch (error) { }
                Helper_.passiveEventListenerSupport_ = isSupported_1;
            }
            return Helper_.passiveEventListenerSupport_;
        };
        Helper_.isMobile_ = function () {
            var matchMedia = window.matchMedia || window.msMatchMedia;
            var mediaQuery = 'only all and (max-width: 37.5em)';
            if (!matchMedia) {
                return false;
            }
            var result = matchMedia(mediaQuery);
            if (!result) {
                return false;
            }
            return !!result.matches;
        };
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
        return Helper_;
    }());
    TheDatepicker.Helper_ = Helper_;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var HtmlHelper_ = (function () {
        function HtmlHelper_() {
        }
        HtmlHelper_.createDiv_ = function (type, options) {
            var div = document.createElement('div');
            HtmlHelper_.addClass_(div, type, options);
            return div;
        };
        HtmlHelper_.createAnchor_ = function (onClick, options, type) {
            if (type === void 0) { type = TheDatepicker.ClassNameType.Button; }
            var anchor = document.createElement('a');
            HtmlHelper_.addClass_(anchor, type, options);
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
        HtmlHelper_.createSpan_ = function () {
            return document.createElement('span');
        };
        HtmlHelper_.createTable_ = function (header, body, type, options) {
            var table = document.createElement('table');
            HtmlHelper_.addClass_(table, type, options);
            if (header) {
                table.appendChild(header);
            }
            table.appendChild(body);
            return table;
        };
        HtmlHelper_.createTableHeader_ = function (cells, type, options) {
            var tableHeader = document.createElement('thead');
            HtmlHelper_.addClass_(tableHeader, type, options);
            var row = document.createElement('tr');
            for (var index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            tableHeader.appendChild(row);
            return tableHeader;
        };
        HtmlHelper_.createTableHeaderCell_ = function (type, options) {
            var cell = document.createElement('th');
            cell.scope = 'col';
            HtmlHelper_.addClass_(cell, type, options);
            return cell;
        };
        HtmlHelper_.createTableBody_ = function (rows, type, options) {
            var tableBody = document.createElement('tbody');
            HtmlHelper_.addClass_(tableBody, type, options);
            for (var index = 0; index < rows.length; index++) {
                tableBody.appendChild(rows[index]);
            }
            return tableBody;
        };
        HtmlHelper_.createTableRow_ = function (cells, options) {
            var row = document.createElement('tr');
            HtmlHelper_.addClass_(row, TheDatepicker.ClassNameType.TableRow, options);
            for (var index = 0; index < cells.length; index++) {
                row.appendChild(cells[index]);
            }
            return row;
        };
        HtmlHelper_.createTableCell_ = function () {
            return document.createElement('td');
        };
        HtmlHelper_.createSelectInput_ = function (selectOptions, onChange, options) {
            var input = document.createElement('select');
            HtmlHelper_.addClass_(input, TheDatepicker.ClassNameType.SelectInput, options);
            for (var index = 0; index < selectOptions.length; index++) {
                input.appendChild(HtmlHelper_.createSelectOption_(selectOptions[index].value, selectOptions[index].label));
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
        HtmlHelper_.createSelectOption_ = function (value, label) {
            var option = document.createElement('option');
            option.value = value;
            option.innerText = label;
            return option;
        };
        HtmlHelper_.addClass_ = function (element, type, options) {
            var classNames = options.classNames.getClassName(type);
            if (!classNames.length) {
                return;
            }
            for (var index = 0; index < classNames.length; index++) {
                classNames[index] = options.prefixClass_(classNames[index]);
            }
            element.className += (element.className ? ' ' : '') + classNames.join(' ');
        };
        HtmlHelper_.appendChild_ = function (element, child) {
            if (child) {
                element.appendChild(child);
            }
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
        EventType_["BeforeOpen"] = "beforeOpen";
        EventType_["Open"] = "open";
        EventType_["BeforeClose"] = "beforeClose";
        EventType_["Close"] = "close";
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
        function Options(translator, classNames) {
            if (translator === void 0) { translator = null; }
            if (classNames === void 0) { classNames = null; }
            this.hideOnBlur_ = true;
            this.hideOnSelect_ = true;
            this.minDate_ = null;
            this.maxDate_ = null;
            this.initialDate_ = null;
            this.initialMonth_ = null;
            this.initialDatePriority_ = true;
            this.firstDayOfWeek_ = TheDatepicker.DayOfWeek.Monday;
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
            this.position_ = TheDatepicker.Position.BottomRight;
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
                focus: []
            };
            this.translator = translator || new TheDatepicker.Translator();
            this.classNames = classNames || new TheDatepicker.ClassNames();
        }
        Options.prototype.clone = function () {
            var options = new Options(this.translator.clone(), this.classNames.clone());
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
            options.position_ = this.position_;
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
        };
        Options.prototype.setHideOnBlur = function (value) {
            this.hideOnBlur_ = !!value;
        };
        Options.prototype.setHideOnSelect = function (value) {
            this.hideOnSelect_ = !!value;
        };
        Options.prototype.setMinDate = function (date) {
            var normalizedDate = TheDatepicker.Helper_.normalizeDate_('Min date', date, true, this);
            this.checkConstraints_(normalizedDate, this.maxDate_);
            this.minDate_ = normalizedDate;
        };
        Options.prototype.setMaxDate = function (date) {
            var normalizedDate = TheDatepicker.Helper_.normalizeDate_('Max date', date, true, this);
            this.checkConstraints_(this.minDate_, normalizedDate);
            this.maxDate_ = normalizedDate;
        };
        Options.prototype.setInitialMonth = function (month) {
            this.initialMonth_ = TheDatepicker.Helper_.normalizeDate_('Initial month', month, true, this);
        };
        Options.prototype.setInitialDate = function (value) {
            this.initialDate_ = TheDatepicker.Helper_.normalizeDate_('Initial date', value, true, this);
        };
        Options.prototype.setInitialDatePriority = function (value) {
            this.initialDatePriority_ = !!value;
        };
        Options.prototype.setFirstDayOfWeek = function (dayOfWeek) {
            this.firstDayOfWeek_ = TheDatepicker.Helper_.checkNumber_('First day of week', dayOfWeek, 0, 6);
        };
        Options.prototype.setDateAvailabilityResolver = function (resolver) {
            TheDatepicker.Helper_.warnDeprecatedUsage_('setDateAvailabilityResolver', ['addDateAvailabilityResolver']);
            this.removeDateAvailabilityResolver();
            if (resolver) {
                this.addDateAvailabilityResolver(resolver);
            }
        };
        Options.prototype.addDateAvailabilityResolver = function (resolver) {
            this.dateAvailabilityResolvers_.push(TheDatepicker.Helper_.checkFunction_('Resolver', resolver, false));
        };
        Options.prototype.removeDateAvailabilityResolver = function (resolver) {
            if (resolver === void 0) { resolver = null; }
            this.removeCallback_(this.dateAvailabilityResolvers_, 'Resolver', resolver);
        };
        Options.prototype.setCellContentResolver = function (resolver) {
            this.cellContentResolver_ = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
        };
        Options.prototype.setCellContentStructureResolver = function (init, update) {
            if (update === void 0) { update = null; }
            init = TheDatepicker.Helper_.checkFunction_('Resolver (init)', init);
            update = TheDatepicker.Helper_.checkFunction_('Resolver (update)', update);
            this.cellContentStructureResolver_ = init ? {
                init: init,
                update: update
            } : null;
        };
        Options.prototype.setHeaderStructureResolver = function (resolver) {
            this.headerStructureResolver_ = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
        };
        Options.prototype.setFooterStructureResolver = function (resolver) {
            this.footerStructureResolver_ = TheDatepicker.Helper_.checkFunction_('Resolver', resolver);
        };
        Options.prototype.addCellClassesResolver = function (resolver) {
            this.cellClassesResolvers_.push(TheDatepicker.Helper_.checkFunction_('Resolver', resolver, false));
        };
        Options.prototype.removeCellClassesResolver = function (resolver) {
            if (resolver === void 0) { resolver = null; }
            this.removeCallback_(this.cellClassesResolvers_, 'Resolver', resolver);
        };
        Options.prototype.addDayModifier = function (modifier) {
            this.dayModifiers_.push(TheDatepicker.Helper_.checkFunction_('Modifier', modifier, false));
        };
        Options.prototype.removeDayModifier = function (modifier) {
            if (modifier === void 0) { modifier = null; }
            this.removeCallback_(this.dayModifiers_, 'Modifier', modifier);
        };
        Options.prototype.setInputFormat = function (format) {
            this.inputFormat_ = TheDatepicker.Helper_.checkString_('Input format', format, true);
        };
        Options.prototype.setAllowInputAnyChar = function (value) {
            this.allowInputAnyChar_ = !!value;
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
        Options.prototype.setYearSelectedFromTableOfYears = function (value) {
            this.yearSelectedFromTableOfYears_ = !!value;
        };
        Options.prototype.setTableOfYearsRowsCount = function (count) {
            this.tableOfYearsRowsCount_ = TheDatepicker.Helper_.checkNumber_('Rows count', count, 1);
        };
        Options.prototype.setTableOfYearsAlign = function (align) {
            this.tableOfYearsAlign_ = align ? TheDatepicker.Helper_.checkNumber_('Align', align, 1, 3) : null;
        };
        Options.prototype.setTableOfYearsOnSwipeDown = function (value) {
            this.tableOfYearsOnSwipeDown_ = !!value;
        };
        Options.prototype.setYearsOutOfTableOfYearsVisible = function (value) {
            this.yearsOutOfTableOfYearsVisible_ = !!value;
        };
        Options.prototype.setMonthAndYearSeparated = function (value) {
            this.monthAndYearSeparated_ = !!value;
        };
        Options.prototype.setMonthShort = function (value) {
            this.monthShort_ = !!value;
        };
        Options.prototype.setChangeMonthOnSwipe = function (value) {
            this.changeMonthOnSwipe_ = !!value;
        };
        Options.prototype.setAnimateMonthChange = function (value) {
            TheDatepicker.Helper_.warnDeprecatedUsage_('setAnimateMonthChange', ['setSlideAnimation']);
            this.setSlideAnimation(value);
        };
        Options.prototype.setSlideAnimation = function (value) {
            this.slideAnimation_ = !!value;
        };
        Options.prototype.setClassesPrefix = function (prefix) {
            this.classesPrefix_ = TheDatepicker.Helper_.checkString_('Prefix', prefix);
        };
        Options.prototype.setDarkMode = function (value) {
            this.darkMode_ = !!value;
        };
        Options.prototype.setShowCloseButton = function (value) {
            this.showCloseButton_ = !!value;
        };
        Options.prototype.setCloseOnEscPress = function (value) {
            this.closeOnEscPress_ = !!value;
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
        Options.prototype.setPosition = function (position) {
            this.position_ = TheDatepicker.Helper_.checkNumber_('Position', position, 1, 4);
        };
        Options.prototype.setPositionFixing = function (value) {
            this.positionFixing_ = !!value;
        };
        Options.prototype.setFullScreenOnMobile = function (value) {
            this.fullScreenOnMobile_ = !!value;
        };
        Options.prototype.setKeyboardOnMobile = function (value) {
            this.keyboardOnMobile_ = !!value;
        };
        Options.prototype.setIncludeAria = function (value) {
            this.includeAria_ = !!value;
        };
        Options.prototype.setToday = function (date) {
            this.today_ = TheDatepicker.Helper_.normalizeDate_('Today', date, true, this);
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
        Options.prototype.onBeforeOpen = function (listener) {
            this.onEvent_(EventType_.BeforeOpen, listener);
        };
        Options.prototype.offBeforeOpen = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.BeforeOpen, listener);
        };
        Options.prototype.onOpen = function (listener) {
            this.onEvent_(EventType_.Open, listener);
        };
        Options.prototype.offOpen = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.Open, listener);
        };
        Options.prototype.onBeforeClose = function (listener) {
            this.onEvent_(EventType_.BeforeClose, listener);
        };
        Options.prototype.offBeforeClose = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.BeforeClose, listener);
        };
        Options.prototype.onClose = function (listener) {
            this.onEvent_(EventType_.Close, listener);
        };
        Options.prototype.offClose = function (listener) {
            if (listener === void 0) { listener = null; }
            this.offEvent_(EventType_.Close, listener);
        };
        Options.prototype.onBeforeOpenAndClose = function (listener) {
            TheDatepicker.Helper_.warnDeprecatedUsage_('onBeforeOpenAndClose', ['onBeforeOpen', 'onBeforeClose']);
            this.onBeforeOpen(listener);
            this.onBeforeClose(listener);
        };
        Options.prototype.offBeforeOpenAndClose = function (listener) {
            if (listener === void 0) { listener = null; }
            TheDatepicker.Helper_.warnDeprecatedUsage_('offBeforeOpenAndClose', ['offBeforeOpen', 'offBeforeClose']);
            this.offBeforeOpen(listener);
            this.offBeforeClose(listener);
        };
        Options.prototype.onOpenAndClose = function (listener) {
            TheDatepicker.Helper_.warnDeprecatedUsage_('onOpenAndClose', ['onOpen', 'onClose']);
            this.onOpen(listener);
            this.onClose(listener);
        };
        Options.prototype.offOpenAndClose = function (listener) {
            if (listener === void 0) { listener = null; }
            TheDatepicker.Helper_.warnDeprecatedUsage_('offOpenAndClose', ['offOpen', 'offClose']);
            this.offOpen(listener);
            this.offClose(listener);
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
            var initialMonth = primarySource
                ? new Date(primarySource.getTime())
                : (secondarySource
                    ? new Date(secondarySource.getTime())
                    : this.getToday());
            initialMonth.setDate(1);
            return this.correctMonth(initialMonth);
        };
        Options.prototype.isMonthInValidity = function (month) {
            return !this.calculateMonthCorrection_(month);
        };
        Options.prototype.correctMonth = function (month) {
            var correctMonth = this.calculateMonthCorrection_(month);
            return correctMonth || month;
        };
        Options.prototype.getInitialDate = function () {
            return this.findPossibleAvailableDate(this.initialDate_);
        };
        Options.prototype.findPossibleAvailableDate = function (date) {
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
        };
        Options.prototype.findNearestAvailableDate = function (date) {
            date = this.correctDate_(date);
            if (this.isDateAvailable(date)) {
                return date;
            }
            var minDate = this.getMinDate_().getTime();
            var maxDate = this.getMaxDate_().getTime();
            var maxLoops = 1000;
            var increasedDate = date;
            var decreasedDate = new Date(date.getTime());
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
        };
        Options.prototype.isDateInValidity = function (date) {
            return !this.calculateDateCorrection_(date);
        };
        Options.prototype.correctDate_ = function (date) {
            var correctDate = this.calculateDateCorrection_(date);
            return correctDate || date;
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
        Options.prototype.isYearSelectedFromTableOfYears = function () {
            return this.yearAsDropdown_ && this.yearSelectedFromTableOfYears_;
        };
        Options.prototype.getTableOfYearsRowsCount = function () {
            return this.tableOfYearsRowsCount_;
        };
        Options.prototype.getTableOfYearsColumnsCount = function () {
            return 4;
        };
        Options.prototype.getTableOfYearsAlign = function () {
            return this.tableOfYearsAlign_;
        };
        Options.prototype.isTableOfYearsOnSwipeDownEnabled = function () {
            return this.tableOfYearsOnSwipeDown_;
        };
        Options.prototype.areYearsOutOfTableOfYearsVisible = function () {
            return this.yearsOutOfTableOfYearsVisible_;
        };
        Options.prototype.isMonthAndYearSeparated = function () {
            return this.isYearSelectedFromTableOfYears() || this.monthAndYearSeparated_;
        };
        Options.prototype.isMonthShort = function () {
            return this.monthShort_;
        };
        Options.prototype.isMonthChangeOnSwipeEnabled = function () {
            return this.changeMonthOnSwipe_;
        };
        Options.prototype.isMonthChangeAnimated = function () {
            TheDatepicker.Helper_.warnDeprecatedUsage_('isMonthChangeAnimated', ['isSlideAnimationEnabled']);
            return this.isSlideAnimationEnabled();
        };
        Options.prototype.isSlideAnimationEnabled = function () {
            return this.slideAnimation_;
        };
        Options.prototype.getClassesPrefix = function () {
            return this.classesPrefix_;
        };
        Options.prototype.isDarkModeEnabled = function () {
            return this.darkMode_;
        };
        Options.prototype.isCloseButtonShown = function () {
            return this.hideOnBlur_ && this.showCloseButton_;
        };
        Options.prototype.isClosedOnEscPress = function () {
            return this.hideOnBlur_ && this.closeOnEscPress_;
        };
        Options.prototype.getTitle = function () {
            return this.title_;
        };
        Options.prototype.getMinDate = function () {
            return this.minDate_ ? new Date(this.minDate_.getTime()) : null;
        };
        Options.prototype.getMaxDate = function () {
            return this.maxDate_ ? new Date(this.maxDate_.getTime()) : null;
        };
        Options.prototype.getMinDate_ = function () {
            var minDate = this.getMinDate();
            if (!minDate) {
                return new Date(-271821, 4, 1);
            }
            return minDate;
        };
        Options.prototype.getMaxDate_ = function () {
            var maxDate = this.getMaxDate();
            if (!maxDate) {
                return new Date(275760, 7, 31);
            }
            return maxDate;
        };
        Options.prototype.getMinMonth = function () {
            if (!this.minDate_) {
                return null;
            }
            var minMonth = new Date(this.minDate_.getTime());
            minMonth.setDate(1);
            return minMonth;
        };
        Options.prototype.getMaxMonth = function () {
            if (!this.maxDate_) {
                return null;
            }
            var maxMonth = new Date(this.maxDate_.getTime());
            maxMonth.setDate(1);
            return maxMonth;
        };
        Options.prototype.getMinMonth_ = function () {
            var minMonth = this.getMinMonth();
            if (!minMonth) {
                minMonth = this.getMinDate_();
            }
            return minMonth;
        };
        Options.prototype.getMaxMonth_ = function () {
            var maxMonth = this.getMaxMonth();
            if (!maxMonth) {
                maxMonth = this.getMaxDate_();
                maxMonth.setDate(1);
            }
            return maxMonth;
        };
        Options.prototype.isDropdownWithOneItemHidden = function () {
            return this.hideDropdownWithOneItem_;
        };
        Options.prototype.getDropdownItemsLimit = function () {
            return this.dropdownItemsLimit_;
        };
        Options.prototype.isDateAvailable = function (date) {
            var dateAvailabilityResolvers = this.dateAvailabilityResolvers_.slice(0);
            for (var index = 0; index < dateAvailabilityResolvers.length; index++) {
                if (!dateAvailabilityResolvers[index](new Date(date.getTime()))) {
                    return false;
                }
            }
            return true;
        };
        Options.prototype.getCellContent = function (day) {
            if (this.cellContentResolver_) {
                return this.cellContentResolver_(day);
            }
            return day.dayNumber + '';
        };
        Options.prototype.prefixClass_ = function (name) {
            return this.classesPrefix_ + name;
        };
        Options.prototype.getCellStructure_ = function () {
            if (this.cellContentStructureResolver_) {
                return this.cellContentStructureResolver_.init();
            }
            return TheDatepicker.HtmlHelper_.createSpan_();
        };
        Options.prototype.updateCellStructure_ = function (element, day) {
            if (this.cellContentStructureResolver_) {
                this.cellContentStructureResolver_.update(element, day);
            }
            else {
                element.innerText = this.getCellContent(day);
            }
        };
        Options.prototype.getHeaderStructure_ = function () {
            return this.headerStructureResolver_ ? this.headerStructureResolver_() : null;
        };
        Options.prototype.getFooterStructure_ = function () {
            return this.footerStructureResolver_ ? this.footerStructureResolver_() : null;
        };
        Options.prototype.getCellClasses = function (day) {
            var result = [];
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
        Options.prototype.isAllowedInputAnyChar = function () {
            return this.allowInputAnyChar_;
        };
        Options.prototype.getPosition = function () {
            return this.position_;
        };
        Options.prototype.isPositionFixingEnabled = function () {
            return this.hideOnBlur_ && this.positionFixing_;
        };
        Options.prototype.isFullScreenOnMobile = function () {
            return this.hideOnBlur_ && this.fullScreenOnMobile_;
        };
        Options.prototype.isKeyboardOnMobile = function () {
            return this.keyboardOnMobile_;
        };
        Options.prototype.isAriaIncluded = function () {
            return this.includeAria_;
        };
        Options.prototype.getToday = function () {
            return this.today_ ? new Date(this.today_.getTime()) : TheDatepicker.Helper_.resetTime_(new Date());
        };
        Options.prototype.getDateAvailabilityResolver = function () {
            TheDatepicker.Helper_.warnDeprecatedUsage_('getDateAvailabilityResolver', ['getDateAvailabilityResolvers']);
            return this.dateAvailabilityResolvers_.length > 0 ? this.dateAvailabilityResolvers_[0] : null;
        };
        Options.prototype.getDateAvailabilityResolvers = function () {
            return this.dateAvailabilityResolvers_.slice(0);
        };
        Options.prototype.getCellContentResolver = function () {
            return this.cellContentResolver_;
        };
        Options.prototype.getCellContentStructureResolver = function () {
            return this.cellContentStructureResolver_;
        };
        Options.prototype.getHeaderStructureResolver = function () {
            return this.headerStructureResolver_;
        };
        Options.prototype.getFooterStructureResolver = function () {
            return this.footerStructureResolver_;
        };
        Options.prototype.getCellClassesResolvers = function () {
            return this.cellClassesResolvers_.slice(0);
        };
        Options.prototype.getDayModifiers = function () {
            return this.dayModifiers_.slice(0);
        };
        Options.prototype.getBeforeSelectListeners = function () {
            return this.listeners_.beforeSelect.slice(0);
        };
        Options.prototype.getSelectListeners = function () {
            return this.listeners_.select.slice(0);
        };
        Options.prototype.getBeforeOpenListeners = function () {
            return this.listeners_.beforeOpen.slice(0);
        };
        Options.prototype.getOpenListeners = function () {
            return this.listeners_.open.slice(0);
        };
        Options.prototype.getBeforeCloseListeners = function () {
            return this.listeners_.beforeClose.slice(0);
        };
        Options.prototype.getCloseListeners = function () {
            return this.listeners_.close.slice(0);
        };
        Options.prototype.getBeforeOpenAndCloseListeners = function () {
            TheDatepicker.Helper_.warnDeprecatedUsage_('getBeforeOpenAndCloseListeners', ['getBeforeOpenListeners', 'getBeforeCloseListeners']);
            return this.listeners_.beforeOpen.concat(this.listeners_.beforeClose);
        };
        Options.prototype.getOpenAndCloseListeners = function () {
            TheDatepicker.Helper_.warnDeprecatedUsage_('getOpenAndCloseListeners', ['getOpenListeners', 'getCloseListeners']);
            return this.listeners_.open.concat(this.listeners_.close);
        };
        Options.prototype.getBeforeMonthChangeListeners = function () {
            return this.listeners_.beforeMonthChange.slice(0);
        };
        Options.prototype.getMonthChangeListeners = function () {
            return this.listeners_.monthChange.slice(0);
        };
        Options.prototype.getBeforeFocusListeners = function () {
            return this.listeners_.beforeFocus.slice(0);
        };
        Options.prototype.getFocusListeners = function () {
            return this.listeners_.focus.slice(0);
        };
        Options.prototype.checkConstraints_ = function (minDate, maxDate) {
            if (minDate && maxDate && minDate.getTime() > maxDate.getTime()) {
                throw new Error('Min date cannot be higher then max date.');
            }
        };
        Options.prototype.calculateMonthCorrection_ = function (month) {
            var minMonth = this.getMinMonth_();
            if (month.getTime() < minMonth.getTime()) {
                return minMonth;
            }
            var maxMonth = this.getMaxMonth_();
            if (month.getTime() > maxMonth.getTime()) {
                return maxMonth;
            }
            return null;
        };
        Options.prototype.calculateDateCorrection_ = function (date) {
            var minDate = this.getMinDate_();
            if (date.getTime() < minDate.getTime()) {
                return minDate;
            }
            var maxDate = this.getMaxDate_();
            if (date.getTime() > maxDate.getTime()) {
                return maxDate;
            }
            return null;
        };
        Options.prototype.removeCallback_ = function (callbacksList, parameterName, callback) {
            callback = TheDatepicker.Helper_.checkFunction_(parameterName, callback);
            if (!callback) {
                callbacksList.splice(0, callbacksList.length);
            }
            else {
                var callbacks = callbacksList.slice(0);
                for (var index = callbacks.length - 1; index >= 0; index--) {
                    if (callbacks[index] === callback) {
                        callbacksList.splice(index, 1);
                    }
                }
            }
        };
        Options.prototype.onEvent_ = function (eventType, listener) {
            this.listeners_[eventType].push(TheDatepicker.Helper_.checkFunction_('Event listener', listener, false));
        };
        Options.prototype.offEvent_ = function (eventType, listener) {
            listener = TheDatepicker.Helper_.checkFunction_('Event listener', listener);
            if (!listener) {
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
    var YearCellData_ = (function () {
        function YearCellData_(yearNumber) {
            this.yearNumber = yearNumber;
            this.isAvailable = true;
            this.isSelected = false;
            this.isHighlighted = false;
            this.isFocused = false;
        }
        return YearCellData_;
    }());
    TheDatepicker.YearCellData_ = YearCellData_;
    var Template_ = (function () {
        function Template_(options_, container_, hasInput_) {
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
            this.yearsElements_ = [];
            this.yearsButtonsElements_ = [];
            this.yearsContentsElements_ = [];
            this.onAfterSlide_ = null;
        }
        Template_.prototype.render_ = function (viewModel) {
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
        };
        Template_.prototype.createSkeleton_ = function (viewModel) {
            var main = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Main, this.options_);
            TheDatepicker.HtmlHelper_.appendChild_(main, this.options_.getHeaderStructure_());
            main.appendChild(this.createHeaderElement_(viewModel));
            main.appendChild(this.createBodyElement_(viewModel));
            TheDatepicker.HtmlHelper_.appendChild_(main, this.options_.getFooterStructure_());
            this.mainElement_ = main;
            return main;
        };
        Template_.prototype.updateMainElement_ = function (viewModel) {
            this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? '' : 'none';
            this.mainElement_.className = '';
            TheDatepicker.HtmlHelper_.addClass_(this.mainElement_, TheDatepicker.ClassNameType.Main, this.options_);
            if (this.options_.isDarkModeEnabled()) {
                TheDatepicker.HtmlHelper_.addClass_(this.mainElement_, TheDatepicker.ClassNameType.MainDarkMode, this.options_);
            }
        };
        Template_.prototype.updateTableElements_ = function (viewModel) {
            this.tableElement_.style.display = viewModel.yearSelectionState_ ? 'none' : '';
            if (this.tableOfYearsElement_) {
                this.tableOfYearsElement_.style.display = viewModel.yearSelectionState_ ? '' : 'none';
            }
        };
        Template_.prototype.createBodyElement_ = function (viewModel) {
            var _this = this;
            var body = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Body, this.options_);
            var tables = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Tables, this.options_);
            body.appendChild(tables);
            if (this.options_.isMonthChangeOnSwipeEnabled() || this.options_.isTableOfYearsOnSwipeDownEnabled()) {
                TheDatepicker.HtmlHelper_.addClass_(body, TheDatepicker.ClassNameType.BodySwipeable, this.options_);
                TheDatepicker.Helper_.addSwipeListener_(body, function (event, moveDirection) {
                    var isForward = false;
                    var change = null;
                    switch (moveDirection) {
                        case TheDatepicker.MoveDirection_.Down:
                            isForward = true;
                        case TheDatepicker.MoveDirection_.Up:
                            if (_this.tableOfYearsElement_ && _this.options_.isTableOfYearsOnSwipeDownEnabled() && viewModel.canSetYearSelectionActive_(isForward)) {
                                change = function () {
                                    viewModel.setYearSelectionActive_(isForward);
                                };
                            }
                            break;
                        case TheDatepicker.MoveDirection_.Left:
                            isForward = true;
                        case TheDatepicker.MoveDirection_.Right:
                            if (_this.options_.isMonthChangeOnSwipeEnabled() && viewModel.canGoDirection_(isForward)) {
                                change = function () {
                                    viewModel.goDirection_(event, isForward);
                                };
                            }
                    }
                    if (change) {
                        _this.slideTable_(viewModel, moveDirection, change);
                    }
                });
            }
            var tableElement = this.createTableElement_(viewModel);
            tables.appendChild(tableElement);
            this.tableElement_ = tableElement;
            if (this.options_.isYearSelectedFromTableOfYears()) {
                var tableOfYearsElement = this.createTableOfYearsElement_(viewModel);
                tables.appendChild(tableOfYearsElement);
                this.tableOfYearsElement_ = tableOfYearsElement;
            }
            this.bodyElement_ = body;
            this.tablesElement_ = tables;
            return body;
        };
        Template_.prototype.createHeaderElement_ = function (viewModel) {
            var header = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Header, this.options_);
            var top = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderTop, this.options_);
            header.appendChild(top);
            top.appendChild(this.createTitleElement_(viewModel));
            var control = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderControl, this.options_);
            top.appendChild(control);
            control.appendChild(this.createResetElement_(viewModel));
            control.appendChild(this.createCloseElement_(viewModel));
            var navigation = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderNavigation, this.options_);
            header.appendChild(navigation);
            navigation.appendChild(this.createGoElement_(viewModel, false));
            var state = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderState, this.options_);
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
        };
        Template_.prototype.updateTopElement_ = function (viewModel) {
            var isVisible = this.options_.getTitle() !== ''
                || this.options_.isResetButtonShown()
                || (this.hasInput_ && this.options_.isCloseButtonShown());
            this.controlElement_.style.display = isVisible ? '' : 'none';
            this.titleElement_.style.display = isVisible ? '' : 'none';
        };
        Template_.prototype.createTitleElement_ = function (viewModel) {
            var titleElement = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderTitle, this.options_);
            var titleContent = TheDatepicker.HtmlHelper_.createSpan_();
            titleElement.appendChild(titleContent);
            TheDatepicker.HtmlHelper_.addClass_(titleContent, TheDatepicker.ClassNameType.HeaderTitleContent, this.options_);
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
            var resetElement = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Reset, this.options_);
            var resetButton = TheDatepicker.HtmlHelper_.createAnchor_(function (event) {
                viewModel.reset_(event);
            }, this.options_);
            resetButton.innerHTML = this.options_.getResetHtml();
            resetElement.appendChild(resetButton);
            this.resetButton_ = resetButton;
            this.resetElement_ = resetElement;
            return resetElement;
        };
        Template_.prototype.updateResetElement_ = function (viewModel) {
            this.resetElement_.style.display = this.options_.isResetButtonShown() ? '' : 'none';
            this.updateTitle_(this.resetButton_, TheDatepicker.TitleName.Reset);
        };
        Template_.prototype.createCloseElement_ = function (viewModel) {
            var closeElement = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Close, this.options_);
            var closeButton = TheDatepicker.HtmlHelper_.createAnchor_(function (event) {
                viewModel.close_(event);
            }, this.options_);
            closeButton.innerHTML = this.options_.getCloseHtml();
            closeElement.appendChild(closeButton);
            this.closeButton_ = closeButton;
            this.closeElement_ = closeElement;
            return closeElement;
        };
        Template_.prototype.updateCloseElement_ = function (viewModel) {
            this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? '' : 'none';
            this.updateTitle_(this.closeButton_, TheDatepicker.TitleName.Close);
        };
        Template_.prototype.createGoElement_ = function (viewModel, isForward) {
            var _this = this;
            var goElement = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.Go, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(goElement, isForward ? TheDatepicker.ClassNameType.GoNext : TheDatepicker.ClassNameType.GoPrevious, this.options_);
            var goButton = TheDatepicker.HtmlHelper_.createAnchor_(function (event) {
                var moveDirection = isForward ? TheDatepicker.MoveDirection_.Left : TheDatepicker.MoveDirection_.Right;
                if (viewModel.canGoDirection_(isForward)) {
                    _this.slideTable_(viewModel, moveDirection, function () {
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
        };
        Template_.prototype.updateGoElement_ = function (viewModel, isForward) {
            var goElement = isForward ? this.goForwardElement_ : this.goBackElement_;
            goElement.style.visibility = viewModel.canGoDirection_(isForward) ? 'visible' : 'hidden';
            this.updateTitle_(goElement, viewModel.yearSelectionState_
                ? (isForward ? TheDatepicker.TitleName.GoForwardTableOfYears : TheDatepicker.TitleName.GoBackTableOfYears)
                : (isForward ? TheDatepicker.TitleName.GoForward : TheDatepicker.TitleName.GoBack));
        };
        Template_.prototype.createMonthElement_ = function (viewModel) {
            var _this = this;
            var options = [];
            for (var monthNumber = 0; monthNumber < 12; monthNumber++) {
                options.push({
                    value: monthNumber + '',
                    label: this.translateMonth_(monthNumber)
                });
            }
            var selectElement = TheDatepicker.HtmlHelper_.createSelectInput_(options, function (event, monthNumber) {
                var currentMonth = viewModel.getCurrentMonth_();
                var newMonth = new Date(currentMonth.getTime());
                newMonth.setMonth(parseInt(monthNumber, 10));
                if (!viewModel.goToMonth_(event, newMonth)) {
                    _this.monthSelect_.value = currentMonth.getMonth() + '';
                }
            }, this.options_);
            var monthElement = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderMonth, this.options_);
            var monthContent = TheDatepicker.HtmlHelper_.createSpan_();
            monthElement.appendChild(selectElement);
            monthElement.appendChild(monthContent);
            this.monthElement_ = monthContent;
            this.monthSelect_ = selectElement;
            return monthElement;
        };
        Template_.prototype.updateMonthElement_ = function (viewModel) {
            if (!this.monthElement_) {
                return;
            }
            var currentMonth = viewModel.getCurrentMonth_().getMonth();
            this.monthElement_.innerText = this.translateMonth_(currentMonth);
            this.updateTitle_(this.monthSelect_, TheDatepicker.TitleName.Month);
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
            var yearElement = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderYear, this.options_);
            var yearActiveElement;
            if (this.options_.isYearSelectedFromTableOfYears()) {
                yearActiveElement = TheDatepicker.HtmlHelper_.createAnchor_(function () {
                    _this.slideTable_(viewModel, viewModel.yearSelectionState_ ? TheDatepicker.MoveDirection_.Up : TheDatepicker.MoveDirection_.Down, function () {
                        viewModel.setYearSelectionActive_(!viewModel.yearSelectionState_);
                    });
                }, this.options_);
                TheDatepicker.HtmlHelper_.addClass_(yearActiveElement, TheDatepicker.ClassNameType.HeaderYearsToggle, this.options_);
            }
            else {
                yearActiveElement = TheDatepicker.HtmlHelper_.createSelectInput_([], function (event, year) {
                    var currentMonth = viewModel.getCurrentMonth_();
                    var newMonth = new Date(currentMonth.getTime());
                    newMonth.setFullYear(parseInt(year, 10));
                    var minMonth = _this.options_.getMinMonth_();
                    var maxMonth = _this.options_.getMaxMonth_();
                    if (newMonth.getTime() < minMonth.getTime()) {
                        newMonth = minMonth;
                    }
                    if (newMonth.getTime() > maxMonth.getTime()) {
                        newMonth = maxMonth;
                    }
                    if (!viewModel.goToMonth_(event, newMonth)) {
                        _this.yearActiveElement_.value = currentMonth.getFullYear() + '';
                    }
                }, this.options_);
            }
            var yearTextElement = TheDatepicker.HtmlHelper_.createSpan_();
            yearElement.appendChild(yearActiveElement);
            yearElement.appendChild(yearTextElement);
            this.yearTextElement_ = yearTextElement;
            this.yearActiveElement_ = yearActiveElement;
            return yearElement;
        };
        Template_.prototype.updateYearElement_ = function (viewModel) {
            if (!this.yearTextElement_) {
                return;
            }
            var currentYear = viewModel.getCurrentMonth_().getFullYear();
            this.yearTextElement_.innerText = currentYear + '';
            this.updateTitle_(this.yearActiveElement_, TheDatepicker.TitleName.Year);
            var minYear = this.options_.getMinDate_().getFullYear();
            var maxYear = this.options_.getMaxDate_().getFullYear();
            if (this.tableOfYearsElement_) {
                this.yearActiveElement_.innerText = currentYear + '';
                if (viewModel.isYearSelectionToggleButtonFocused_) {
                    this.yearActiveElement_.focus();
                    viewModel.isYearSelectionToggleButtonFocused_ = false;
                }
            }
            else if (this.options_.isYearAsDropdown()) {
                var range = this.calculateDropdownRange_(currentYear, minYear, maxYear);
                var options = this.yearActiveElement_.getElementsByTagName('option');
                var diff = this.calculateDropdownDiff_(options, range, function (value) {
                    return parseInt(value, 10);
                });
                for (var index = 0; index < diff.remove.length; index++) {
                    this.yearActiveElement_.removeChild(diff.remove[index]);
                }
                for (var index = diff.prepend.length - 1; index >= 0; index--) {
                    this.yearActiveElement_.insertBefore(TheDatepicker.HtmlHelper_.createSelectOption_(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearActiveElement_.firstChild);
                }
                for (var index = 0; index < diff.append.length; index++) {
                    this.yearActiveElement_.appendChild(TheDatepicker.HtmlHelper_.createSelectOption_(diff.append[index] + '', diff.append[index] + ''));
                }
                this.yearActiveElement_.value = currentYear + '';
            }
            else {
                this.yearActiveElement_.style.display = 'none';
                this.yearTextElement_.style.display = '';
                return;
            }
            var showSelect = !this.options_.isDropdownWithOneItemHidden() || minYear !== maxYear;
            this.yearActiveElement_.style.display = showSelect ? '' : 'none';
            this.yearTextElement_.style.display = showSelect ? 'none' : '';
        };
        Template_.prototype.createMonthAndYearElement_ = function (viewModel) {
            var _this = this;
            var monthAndYear = TheDatepicker.HtmlHelper_.createDiv_(TheDatepicker.ClassNameType.HeaderMonthYear, this.options_);
            var selectElement = TheDatepicker.HtmlHelper_.createSelectInput_([], function (event, value) {
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
            }, this.options_);
            var monthAndYearContent = TheDatepicker.HtmlHelper_.createSpan_();
            this.monthAndYearElement_ = monthAndYearContent;
            this.monthAndYearSelect_ = selectElement;
            monthAndYear.appendChild(monthAndYearContent);
            monthAndYear.appendChild(selectElement);
            return monthAndYear;
        };
        Template_.prototype.updateMonthAndYearElement_ = function (viewModel) {
            var _this = this;
            if (!this.monthAndYearElement_) {
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
            var minDate = this.options_.getMinDate_();
            var maxDate = this.options_.getMaxDate_();
            var minIndex = minDate.getFullYear() * 12 + minDate.getMonth();
            var maxIndex = maxDate.getFullYear() * 12 + maxDate.getMonth();
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
                this.monthAndYearSelect_.insertBefore(TheDatepicker.HtmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
            }
            for (var index = 0; index < diff.append.length; index++) {
                var data = this.getMonthAndYearByIndex_(diff.append[index]);
                this.monthAndYearSelect_.appendChild(TheDatepicker.HtmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
            }
            this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);
            var showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
            this.monthAndYearSelect_.style.display = showSelect ? '' : 'none';
            this.monthAndYearElement_.style.display = showSelect ? 'none' : '';
        };
        Template_.prototype.translateMonthAndYear_ = function (data) {
            return this.translateMonth_(data.month) + ' ' + data.year;
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
            var table = TheDatepicker.HtmlHelper_.createTable_(tableHeader, tableBody, TheDatepicker.ClassNameType.CalendarTable, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(table, TheDatepicker.ClassNameType.Table, this.options_);
            return table;
        };
        Template_.prototype.createTableHeaderElement_ = function (viewModel) {
            var weekDays = viewModel.getWeekDays_();
            var cells = [];
            for (var index = 0; index < weekDays.length; index++) {
                var dayOfWeek = weekDays[index];
                cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
            }
            return TheDatepicker.HtmlHelper_.createTableHeader_(cells, TheDatepicker.ClassNameType.CalendarTableHeader, this.options_);
        };
        Template_.prototype.createTableHeaderCellElement_ = function (viewModel, dayOfWeek) {
            var headerCell = TheDatepicker.HtmlHelper_.createTableHeaderCell_(TheDatepicker.ClassNameType.CalendarTableHeaderCell, this.options_);
            if (dayOfWeek === TheDatepicker.DayOfWeek.Saturday || dayOfWeek === TheDatepicker.DayOfWeek.Sunday) {
                TheDatepicker.HtmlHelper_.addClass_(headerCell, TheDatepicker.ClassNameType.WeekDayWeekend, this.options_);
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
            return TheDatepicker.HtmlHelper_.createTableBody_(rows, TheDatepicker.ClassNameType.CalendarTableBody, this.options_);
        };
        Template_.prototype.updateWeeksElements_ = function (viewModel) {
            if (viewModel.yearSelectionState_) {
                return;
            }
            var weeks = viewModel.getWeeks_();
            for (var weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
                var weekElement = this.weeksElements_[weekIndex];
                var week = weeks.length > weekIndex ? weeks[weekIndex] : null;
                weekElement.style.display = week ? '' : 'none';
                if (week) {
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
                var cell = TheDatepicker.HtmlHelper_.createTableCell_();
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
            return TheDatepicker.HtmlHelper_.createTableRow_(cells, this.options_);
        };
        Template_.prototype.updateDayElement_ = function (viewModel, dayElement, dayButtonElement, dayContentElement, day) {
            dayButtonElement.day = day;
            dayElement.setAttribute('data-date', day.getFormatted());
            dayElement.className = '';
            TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.TableCell, this.options_);
            this.options_.updateCellStructure_(dayContentElement, day);
            if (!day.isVisible) {
                dayButtonElement.removeAttribute('href');
                dayButtonElement.style.visibility = 'hidden';
                return;
            }
            TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.Day, this.options_);
            if (day.isToday) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DayToday, this.options_);
            }
            if (day.isPast) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DayPast, this.options_);
            }
            if (day.isWeekend) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DayWeekend, this.options_);
            }
            if (!day.isAvailable) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.TableCellUnavailable, this.options_);
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DayUnavailable, this.options_);
            }
            if (!day.isInCurrentMonth) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DayOutside, this.options_);
            }
            if (day.isHighlighted) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.TableCellHighlighted, this.options_);
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DayHighlighted, this.options_);
            }
            if (day.isSelected) {
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.TableCellSelected, this.options_);
                TheDatepicker.HtmlHelper_.addClass_(dayElement, TheDatepicker.ClassNameType.DaySelected, this.options_);
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
            var cellButton = TheDatepicker.HtmlHelper_.createAnchor_(function (event) {
                var previous = viewModel.selectedDate_;
                var isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
                if (_this.options_.isHiddenOnSelect() && (isSelected || (previous && cellButton.day.isEqualToDate(previous)))) {
                    viewModel.close_(event);
                }
            }, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(cellButton, TheDatepicker.ClassNameType.DayButton, this.options_);
            cellButton.onfocus = function (event) {
                viewModel.highlightDay_(event || window.event, cellButton.day);
            };
            cellButton.onmouseenter = function (event) {
                if (_this.options_.getBeforeFocusListeners().length > 0 || _this.options_.getFocusListeners().length > 0) {
                    viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
                }
                else {
                    viewModel.cancelDayHighlight_(event || window.event);
                }
            };
            cellButton.onmouseleave = function (event) {
                viewModel.cancelDayHighlight_(event || window.event);
            };
            return cellButton;
        };
        Template_.prototype.createTableCellContentElement_ = function (viewModel) {
            var cellContent = this.options_.getCellStructure_();
            TheDatepicker.HtmlHelper_.addClass_(cellContent, TheDatepicker.ClassNameType.ButtonContent, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(cellContent, TheDatepicker.ClassNameType.DayButtonContent, this.options_);
            return cellContent;
        };
        Template_.prototype.createTableOfYearsElement_ = function (viewModel) {
            var tableBody = this.createTableOfYearsBodyElement_(viewModel);
            var table = TheDatepicker.HtmlHelper_.createTable_(null, tableBody, TheDatepicker.ClassNameType.YearsTable, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(table, TheDatepicker.ClassNameType.Table, this.options_);
            return table;
        };
        Template_.prototype.createTableOfYearsBodyElement_ = function (viewModel) {
            this.yearsElements_ = [];
            this.yearsButtonsElements_ = [];
            this.yearsContentsElements_ = [];
            var rows = [];
            for (var index = 0; index < this.options_.getTableOfYearsRowsCount(); index++) {
                rows.push(this.createTableOfYearsRowElement_(viewModel));
            }
            return TheDatepicker.HtmlHelper_.createTableBody_(rows, TheDatepicker.ClassNameType.YearsTableBody, this.options_);
        };
        Template_.prototype.updateTableOfYearsRowsElements_ = function (viewModel) {
            if (!viewModel.yearSelectionState_) {
                return;
            }
            var rows = viewModel.getYearsRows_();
            for (var rowIndex = 0; rowIndex < this.yearsElements_.length; rowIndex++) {
                var cells = rows.length > rowIndex ? rows[rowIndex] : null;
                if (cells) {
                    for (var columnIndex = 0; columnIndex < this.yearsElements_[rowIndex].length; columnIndex++) {
                        this.updateTableOfYearsCellElement_(viewModel, this.yearsElements_[rowIndex][columnIndex], this.yearsButtonsElements_[rowIndex][columnIndex], this.yearsContentsElements_[rowIndex][columnIndex], cells[columnIndex]);
                    }
                }
            }
        };
        Template_.prototype.updateTableOfYearsCellElement_ = function (viewModel, yearElement, yearButtonElement, yearContentElement, yearCellData) {
            yearButtonElement.yearCellData = yearCellData;
            yearElement.setAttribute('data-year', yearCellData.yearNumber + '');
            yearElement.className = '';
            TheDatepicker.HtmlHelper_.addClass_(yearElement, TheDatepicker.ClassNameType.TableCell, this.options_);
            yearContentElement.innerText = yearCellData.yearNumber + '';
            if (yearCellData.isAvailable) {
                yearButtonElement.href = '#';
            }
            else {
                yearButtonElement.removeAttribute('href');
                if (this.options_.areYearsOutOfTableOfYearsVisible()) {
                    TheDatepicker.HtmlHelper_.addClass_(yearElement, TheDatepicker.ClassNameType.TableCellUnavailable, this.options_);
                }
                else {
                    yearButtonElement.style.visibility = 'hidden';
                    return;
                }
            }
            if (yearCellData.isHighlighted) {
                TheDatepicker.HtmlHelper_.addClass_(yearElement, TheDatepicker.ClassNameType.TableCellHighlighted, this.options_);
            }
            if (yearCellData.isSelected) {
                TheDatepicker.HtmlHelper_.addClass_(yearElement, TheDatepicker.ClassNameType.TableCellSelected, this.options_);
            }
            yearButtonElement.style.visibility = 'visible';
            if (yearCellData.isFocused) {
                yearButtonElement.focus();
            }
        };
        Template_.prototype.createTableOfYearsRowElement_ = function (viewModel) {
            var cells = [];
            var cellsButtons = [];
            var cellsContents = [];
            for (var index = 0; index < this.options_.getTableOfYearsColumnsCount(); index++) {
                var cell = TheDatepicker.HtmlHelper_.createTableCell_();
                var cellButton = this.createTableOfYearsCellButtonElement_(viewModel);
                var cellContent = this.createTableOfYearsCellContentElement_(viewModel);
                cells.push(cell);
                cellsButtons.push(cellButton);
                cellsContents.push(cellContent);
                cell.appendChild(cellButton);
                cellButton.appendChild(cellContent);
            }
            this.yearsElements_.push(cells);
            this.yearsButtonsElements_.push(cellsButtons);
            this.yearsContentsElements_.push(cellsContents);
            return TheDatepicker.HtmlHelper_.createTableRow_(cells, this.options_);
        };
        Template_.prototype.createTableOfYearsCellButtonElement_ = function (viewModel) {
            var _this = this;
            var cellButton = TheDatepicker.HtmlHelper_.createAnchor_(function (event) {
                var newMonth = new Date(cellButton.yearCellData.yearNumber, viewModel.getCurrentMonth_().getMonth(), 1);
                var correctMonth = _this.options_.correctMonth(newMonth);
                if (correctMonth.getFullYear() === newMonth.getFullYear()) {
                    viewModel.goToMonth_(event, correctMonth);
                    viewModel.isYearSelectionToggleButtonFocused_ = true;
                    _this.slideTable_(viewModel, TheDatepicker.MoveDirection_.Up, function () {
                        viewModel.setYearSelectionActive_(false);
                    });
                }
            }, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(cellButton, TheDatepicker.ClassNameType.YearCellButton, this.options_);
            cellButton.onfocus = function () {
                viewModel.highlightYear_(cellButton.yearCellData.yearNumber);
            };
            cellButton.onmouseenter = function () {
                viewModel.cancelYearHighlight_();
            };
            cellButton.onmouseleave = function () {
                viewModel.cancelYearHighlight_();
            };
            return cellButton;
        };
        Template_.prototype.createTableOfYearsCellContentElement_ = function (viewModel) {
            var cellContent = TheDatepicker.HtmlHelper_.createSpan_();
            TheDatepicker.HtmlHelper_.addClass_(cellContent, TheDatepicker.ClassNameType.ButtonContent, this.options_);
            TheDatepicker.HtmlHelper_.addClass_(cellContent, TheDatepicker.ClassNameType.YearCellButtonContent, this.options_);
            return cellContent;
        };
        Template_.prototype.slideTable_ = function (viewModel, moveDirection, onComplete) {
            var _this = this;
            if (!this.options_.isSlideAnimationEnabled() || !TheDatepicker.Helper_.isCssAnimationSupported_()) {
                onComplete();
                return;
            }
            var trigger = function () {
                var animationOut;
                var animationIn;
                switch (moveDirection) {
                    case TheDatepicker.MoveDirection_.Left:
                        animationOut = TheDatepicker.ClassNameType.AnimateFadeOutLeft;
                        animationIn = TheDatepicker.ClassNameType.AnimateFadeInRight;
                        break;
                    case TheDatepicker.MoveDirection_.Up:
                        animationOut = TheDatepicker.ClassNameType.AnimateFadeOutUp;
                        animationIn = TheDatepicker.ClassNameType.AnimateFadeInDown;
                        break;
                    case TheDatepicker.MoveDirection_.Right:
                        animationOut = TheDatepicker.ClassNameType.AnimateFadeOutRight;
                        animationIn = TheDatepicker.ClassNameType.AnimateFadeInLeft;
                        break;
                    case TheDatepicker.MoveDirection_.Down:
                        animationOut = TheDatepicker.ClassNameType.AnimateFadeOutDown;
                        animationIn = TheDatepicker.ClassNameType.AnimateFadeInUp;
                        break;
                }
                var originalClassName = _this.tablesElement_.className;
                var animate = function (type) {
                    TheDatepicker.HtmlHelper_.addClass_(_this.tablesElement_, TheDatepicker.ClassNameType.Animated, _this.options_);
                    TheDatepicker.HtmlHelper_.addClass_(_this.tablesElement_, type, _this.options_);
                };
                var onAfterSlide = function () {
                    if (_this.onAfterSlide_.length > 0) {
                        _this.onAfterSlide_.shift()();
                    }
                    else {
                        _this.onAfterSlide_ = null;
                    }
                };
                var listenerRemover;
                var timeoutId = window.setTimeout(function () {
                    listenerRemover();
                    onComplete();
                    onAfterSlide();
                }, 150);
                listenerRemover = TheDatepicker.Helper_.addEventListener_(_this.tablesElement_, TheDatepicker.ListenerType_.AnimationEnd, function () {
                    window.clearTimeout(timeoutId);
                    onComplete();
                    listenerRemover();
                    _this.tablesElement_.className = originalClassName;
                    animate(animationIn);
                    listenerRemover = TheDatepicker.Helper_.addEventListener_(_this.tablesElement_, TheDatepicker.ListenerType_.AnimationEnd, function () {
                        listenerRemover();
                        _this.tablesElement_.className = originalClassName;
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
        };
        Template_.prototype.translateMonth_ = function (monthNumber) {
            return this.options_.isMonthShort()
                ? this.options_.translator.translateMonthShort(monthNumber)
                : this.options_.translator.translateMonth(monthNumber);
        };
        Template_.prototype.updateTitle_ = function (element, titleName) {
            var title = this.options_.translator.translateTitle(titleName);
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
        };
        return Template_;
    }());
    TheDatepicker.Template_ = Template_;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
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
    })(TitleName = TheDatepicker.TitleName || (TheDatepicker.TitleName = {}));
    var Translator = (function () {
        function Translator() {
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
        Translator.prototype.clone = function () {
            var translator = new Translator();
            var index;
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
        };
        Translator.prototype.setDayOfWeekTranslation = function (dayOfWeek, translation) {
            this.dayOfWeekTranslations_[TheDatepicker.Helper_.checkNumber_('Day of week', dayOfWeek, 0, 6)] = TheDatepicker.Helper_.checkString_('Translation', translation, true);
        };
        Translator.prototype.setDayOfWeekFullTranslation = function (dayOfWeek, translation) {
            this.dayOfWeekFullTranslations_[TheDatepicker.Helper_.checkNumber_('Day of week', dayOfWeek, 0, 6)] = TheDatepicker.Helper_.checkString_('Translation', translation, true);
        };
        Translator.prototype.setMonthTranslation = function (month, translation) {
            this.monthTranslations_[TheDatepicker.Helper_.checkNumber_('Month', month, 0, 11)] = TheDatepicker.Helper_.checkString_('Translation', translation, true);
        };
        Translator.prototype.setMonthShortTranslation = function (month, translation) {
            this.monthShortTranslations_[TheDatepicker.Helper_.checkNumber_('Month', month, 0, 11)] = TheDatepicker.Helper_.checkString_('Translation', translation, true);
        };
        Translator.prototype.setTitleTranslation = function (titleName, translation) {
            this.titles_[TheDatepicker.Helper_.checkNumber_('Title', titleName, 0, this.titles_.length - 1)] = TheDatepicker.Helper_.checkString_('Translation', translation);
        };
        Translator.prototype.translateDayOfWeek = function (dayOfWeek) {
            return this.dayOfWeekTranslations_[dayOfWeek];
        };
        Translator.prototype.translateDayOfWeekFull = function (dayOfWeek) {
            return this.dayOfWeekFullTranslations_[dayOfWeek];
        };
        Translator.prototype.translateMonth = function (month) {
            return this.monthTranslations_[month];
        };
        Translator.prototype.translateMonthShort = function (month) {
            return this.monthShortTranslations_[month];
        };
        Translator.prototype.translateTitle = function (titleName) {
            return this.titles_[titleName];
        };
        return Translator;
    }());
    TheDatepicker.Translator = Translator;
})(TheDatepicker || (TheDatepicker = {}));
var TheDatepicker;
(function (TheDatepicker) {
    var MoveDirection_;
    (function (MoveDirection_) {
        MoveDirection_[MoveDirection_["Left"] = 1] = "Left";
        MoveDirection_[MoveDirection_["Up"] = 2] = "Up";
        MoveDirection_[MoveDirection_["Right"] = 3] = "Right";
        MoveDirection_[MoveDirection_["Down"] = 4] = "Down";
    })(MoveDirection_ = TheDatepicker.MoveDirection_ || (TheDatepicker.MoveDirection_ = {}));
    var YearSelectionState = (function () {
        function YearSelectionState(cellsCount, lowestYear, maxPage, page) {
            this.cellsCount = cellsCount;
            this.lowestYear = lowestYear;
            this.maxPage = maxPage;
            this.page = page;
            this.highlightedYear = null;
            this.isHighlightedYearFocused = false;
            this.initialPage = page;
        }
        YearSelectionState.prototype.getPage = function () {
            return this.page;
        };
        YearSelectionState.prototype.canShiftPage = function (shift) {
            var newPage = this.page + shift;
            return newPage >= 0 && newPage <= this.maxPage;
        };
        YearSelectionState.prototype.shiftPage = function (shift) {
            if (!this.canShiftPage(shift)) {
                return false;
            }
            this.page += shift;
            return true;
        };
        YearSelectionState.prototype.getFirstYear = function () {
            return this.lowestYear + this.page * this.cellsCount;
        };
        YearSelectionState.prototype.getLastYear = function () {
            return this.lowestYear + this.page * this.cellsCount + this.cellsCount - 1;
        };
        YearSelectionState.prototype.highlightYear = function (year, doFocus) {
            if (doFocus === void 0) { doFocus = true; }
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
        };
        YearSelectionState.prototype.cancelHighlight = function () {
            if (!this.highlightedYear) {
                return false;
            }
            this.highlightedYear = null;
            return true;
        };
        return YearSelectionState;
    }());
    var ViewModel_ = (function () {
        function ViewModel_(options_, datepicker_) {
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
            this.template_ = new TheDatepicker.Template_(this.options_, datepicker_.container, !!datepicker_.input);
        }
        ViewModel_.prototype.render_ = function () {
            if (this.datepicker_.isDestroyed() || this.selectPossibleDate_()) {
                return;
            }
            var correctMonth = this.options_.correctMonth(this.getCurrentMonth_());
            if (this.goToMonth_(null, correctMonth)) {
                return;
            }
            if (!this.tableOfYearsSettings_) {
                this.tableOfYearsSettings_ = {
                    rowsCount: this.options_.getTableOfYearsRowsCount(),
                    columnsCount: this.options_.getTableOfYearsColumnsCount()
                };
            }
            this.template_.render_(this);
            this.datepicker_.updateInput_();
        };
        ViewModel_.prototype.setActive_ = function (event, value) {
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
        };
        ViewModel_.prototype.isActive_ = function () {
            return this.active_;
        };
        ViewModel_.prototype.close_ = function (event) {
            return this.datepicker_.close(event);
        };
        ViewModel_.prototype.getCurrentMonth_ = function () {
            if (!this.currentMonth_) {
                this.setCurrentMonth_(this.getInitialMonth_());
            }
            return this.currentMonth_;
        };
        ViewModel_.prototype.canGoDirection_ = function (isForward) {
            var delta = isForward ? 1 : -1;
            if (this.yearSelectionState_) {
                return this.yearSelectionState_.canShiftPage(delta);
            }
            var newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() + delta);
            return this.canGoToMonth_(newMonth);
        };
        ViewModel_.prototype.canGoToMonth_ = function (month) {
            if (!TheDatepicker.Helper_.isValidDate_(month)) {
                return false;
            }
            return this.options_.isMonthInValidity(month);
        };
        ViewModel_.prototype.goDirection_ = function (event, isForward) {
            var delta = isForward ? 1 : -1;
            if (this.yearSelectionState_) {
                if (this.yearSelectionState_.shiftPage(delta)) {
                    this.render_();
                }
                return;
            }
            var newMonth = new Date(this.getCurrentMonth_().getTime());
            newMonth.setMonth(newMonth.getMonth() + delta);
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
            this.setCurrentMonth_(month);
            if (!doCancelHighlight || !this.cancelDayHighlight_(event)) {
                this.render_();
            }
            this.triggerOnMonthChange_(event, month, this.currentMonth_);
            return true;
        };
        ViewModel_.prototype.reset_ = function (event) {
            this.initialMonth_ = null;
            var isMonthChanged = this.goToMonth_(event, this.getInitialMonth_());
            var isDaySelected = this.selectInitialDate_(event);
            return isMonthChanged || isDaySelected;
        };
        ViewModel_.prototype.selectDay_ = function (event, date, doUpdateMonth, doHighlight, canToggle) {
            if (doUpdateMonth === void 0) { doUpdateMonth = true; }
            if (doHighlight === void 0) { doHighlight = false; }
            if (canToggle === void 0) { canToggle = false; }
            if (!date) {
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
            var previousDay = this.selectedDate_ ? this.createDay_(this.selectedDate_) : null;
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
        ViewModel_.prototype.canSetYearSelectionActive_ = function (value) {
            return !!this.yearSelectionState_ !== value
                && (!value
                    || this.options_.getMinDate_().getFullYear() !== this.options_.getMaxDate_().getFullYear());
        };
        ViewModel_.prototype.setYearSelectionActive_ = function (value) {
            if (this.canSetYearSelectionActive_(value)) {
                this.yearSelectionState_ = value
                    ? this.createYearSelectionState_()
                    : null;
                this.render_();
                return true;
            }
            return false;
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
            var maxDate = this.options_.getMaxDate_();
            var day = this.createDay_(new Date(this.getCurrentMonth_().getTime()));
            while (!day.isAvailable) {
                var sibling = day.getSibling();
                if (sibling.dayNumber === 1) {
                    break;
                }
                if (sibling.getDate().getTime() > maxDate.getTime()) {
                    break;
                }
                day = sibling;
            }
            return this.highlightDay_(event, day);
        };
        ViewModel_.prototype.highlightSiblingDay_ = function (event, day, direction) {
            var shift;
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
            var newDay = day;
            var maxLoops = 1000;
            do {
                newDay = newDay.getSibling(shift);
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
            if (!this.selectedDate_) {
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
        ViewModel_.prototype.cancelDayHighlight_ = function (event) {
            if (!this.highlightedDay_) {
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
        ViewModel_.prototype.highlightYear_ = function (year, doFocus) {
            if (doFocus === void 0) { doFocus = true; }
            if (this.yearSelectionState_ && this.yearSelectionState_.highlightYear(year, doFocus)) {
                this.render_();
                return true;
            }
            return false;
        };
        ViewModel_.prototype.highlightSiblingYear_ = function (year, direction) {
            var shift;
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
            var newYear = year + shift;
            if (newYear < this.options_.getMinDate_().getFullYear()
                || newYear > this.options_.getMaxDate_().getFullYear()) {
                return;
            }
            return this.highlightYear_(newYear, true);
        };
        ViewModel_.prototype.cancelYearHighlight_ = function () {
            if (this.yearSelectionState_ && this.yearSelectionState_.cancelHighlight()) {
                this.render_();
                return true;
            }
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
            var days = [];
            var currentMonth = this.getCurrentMonth_();
            var outsideDates = this.getOutsideDates_();
            for (var index = 0; index < outsideDates.prepend.length; index++) {
                var day = this.createDay_(outsideDates.prepend[index]);
                days.push(day);
            }
            var lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            var monthDaysCount = lastDateOfMonth.getDate();
            for (var date = 1; date <= monthDaysCount; date++) {
                days.push(this.createDay_(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date)));
            }
            for (var index = 0; index < outsideDates.append.length; index++) {
                var day = this.createDay_(outsideDates.append[index]);
                days.push(day);
            }
            var weeks = [];
            for (var i = 0; i < days.length; i += 7) {
                weeks.push(days.slice(i, i + 7));
            }
            this.isHighlightedDayFocused_ = false;
            return weeks;
        };
        ViewModel_.prototype.getYearsRows_ = function () {
            if (!this.yearSelectionState_) {
                return [];
            }
            var yearsData = [];
            var minYear = this.options_.getMinDate_().getFullYear();
            var maxYear = this.options_.getMaxDate_().getFullYear();
            var currentYear = this.getCurrentMonth_().getFullYear();
            var firstYear = this.yearSelectionState_.getFirstYear();
            for (var year = firstYear; year <= firstYear + this.yearSelectionState_.cellsCount; year++) {
                var yearCellData = new TheDatepicker.YearCellData_(year);
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
            var yearsRows = [];
            for (var i = 0; i < yearsData.length; i += this.tableOfYearsSettings_.columnsCount) {
                yearsRows.push(yearsData.slice(i, i + this.tableOfYearsSettings_.columnsCount));
            }
            this.yearSelectionState_.isHighlightedYearFocused;
            return yearsRows;
        };
        ViewModel_.prototype.createYearSelectionState_ = function () {
            var align = this.options_.getTableOfYearsAlign();
            var minDate = this.options_.getMinDate();
            var maxDate = this.options_.getMaxDate();
            var initialYear = this.getInitialMonth_().getFullYear();
            if ((align === TheDatepicker.Align.Left && minDate === null)
                || (align === TheDatepicker.Align.Right && maxDate === null)) {
                align = null;
            }
            if (!align) {
                if (minDate && maxDate) {
                    var lowDiff = initialYear - minDate.getFullYear();
                    var highDiff = maxDate.getFullYear() - initialYear;
                    align = lowDiff > highDiff ? TheDatepicker.Align.Right : TheDatepicker.Align.Left;
                }
                else if (minDate) {
                    align = TheDatepicker.Align.Left;
                }
                else if (maxDate) {
                    align = TheDatepicker.Align.Right;
                }
                else {
                    align = TheDatepicker.Align.Center;
                }
            }
            var lowestYear;
            var cellsCount = this.tableOfYearsSettings_.rowsCount * this.tableOfYearsSettings_.columnsCount;
            var minYear = this.options_.getMinDate_().getFullYear();
            var maxYear = this.options_.getMaxDate_().getFullYear();
            switch (align) {
                case TheDatepicker.Align.Left:
                    lowestYear = minYear;
                    break;
                case TheDatepicker.Align.Right:
                    lowestYear = minYear - (cellsCount - ((maxYear - minYear) % cellsCount) - 1);
                    break;
                case TheDatepicker.Align.Center:
                    var shift = Math.floor(this.tableOfYearsSettings_.rowsCount / 2) * this.tableOfYearsSettings_.columnsCount + Math.floor(this.tableOfYearsSettings_.columnsCount / 2);
                    lowestYear = minYear - (cellsCount - ((initialYear + shift - minYear) % cellsCount) - 1);
                    break;
                default:
                    throw new Error('Invalid align: ' + align);
            }
            var currentYear = this.getCurrentMonth_().getFullYear();
            var page = Math.floor((currentYear - lowestYear) / cellsCount);
            return new YearSelectionState(cellsCount, lowestYear, Math.floor((maxYear - lowestYear) / cellsCount), page);
        };
        ViewModel_.prototype.triggerKeyPress_ = function (event) {
            if (TheDatepicker.Helper_.inArray_([TheDatepicker.KeyCode_.Left, TheDatepicker.KeyCode_.Up, TheDatepicker.KeyCode_.Right, TheDatepicker.KeyCode_.Down], event.keyCode)) {
                TheDatepicker.Helper_.preventDefault_(event);
                var moveDirection = this.translateKeyCodeToMoveDirection_(event.keyCode);
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
            else if (event.keyCode === TheDatepicker.KeyCode_.Esc && this.options_.isClosedOnEscPress()) {
                if (this.yearSelectionState_) {
                    this.isYearSelectionToggleButtonFocused_ = true;
                    this.setYearSelectionActive_(false);
                }
                else {
                    this.datepicker_.close(event);
                }
            }
        };
        ViewModel_.prototype.createDay_ = function (date) {
            var _this = this;
            date = TheDatepicker.Helper_.resetTime_(new Date(date.getTime()));
            var today = this.options_.getToday();
            var currentMonth = this.getCurrentMonth_();
            var day = new TheDatepicker.Day(date, function (date) {
                return _this.createDay_(date);
            }, function (date, format) {
                if (format === void 0) { format = null; }
                return TheDatepicker.DateConverter_.formatDate_(date, _this.options_, format);
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
                var outsideDates = this.getOutsideDates_();
                var pendants = outsideDates.prepend.concat(outsideDates.append);
                for (var index = 0; index < pendants.length; index++) {
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
        ViewModel_.prototype.triggerOnBeforeOpen_ = function (event) {
            var _this = this;
            return this.options_.triggerEvent_(TheDatepicker.EventType_.BeforeOpen, function (listener) {
                return listener.call(_this.datepicker_, event, true);
            });
        };
        ViewModel_.prototype.triggerOnOpen_ = function (event) {
            var _this = this;
            this.options_.triggerEvent_(TheDatepicker.EventType_.Open, function (listener) {
                return listener.call(_this.datepicker_, event, true);
            });
        };
        ViewModel_.prototype.triggerOnBeforeClose_ = function (event) {
            var _this = this;
            return this.options_.triggerEvent_(TheDatepicker.EventType_.BeforeClose, function (listener) {
                return listener.call(_this.datepicker_, event, false);
            });
        };
        ViewModel_.prototype.triggerOnClose_ = function (event) {
            var _this = this;
            this.options_.triggerEvent_(TheDatepicker.EventType_.Close, function (listener) {
                return listener.call(_this.datepicker_, event, false);
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
        ViewModel_.prototype.setCurrentMonth_ = function (month) {
            this.currentMonth_ = month;
            this.outsideDates_ = null;
        };
        ViewModel_.prototype.getOutsideDates_ = function () {
            if (this.outsideDates_) {
                return this.outsideDates_;
            }
            var currentMonth = this.getCurrentMonth_();
            var firstDayOfWeek = this.options_.getFirstDayOfWeek();
            var firstDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            var lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
            var prependDaysCount = (firstDateOfMonth.getDay() - firstDayOfWeek + 7) % 7;
            var prepend = [];
            for (var date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
                prepend.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
            }
            var lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            var appendDaysCount = 6 - ((lastDateOfMonth.getDay() - firstDayOfWeek + 7) % 7);
            var append = [];
            for (var date = 1; date <= appendDaysCount; date++) {
                append.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
            }
            if (this.options_.hasFixedRowsCount()) {
                var monthDaysCount = lastDateOfMonth.getDate();
                for (var date = appendDaysCount + 1; prependDaysCount + monthDaysCount + append.length < 6 * 7; date++) {
                    append.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, date));
                }
            }
            this.outsideDates_ = {
                prepend: prepend,
                append: append
            };
            return this.outsideDates_;
        };
        ViewModel_.prototype.getInitialMonth_ = function () {
            if (!this.initialMonth_) {
                this.initialMonth_ = this.options_.getInitialMonth();
            }
            return this.initialMonth_;
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
