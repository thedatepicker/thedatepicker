define(["require", "exports", "./Day", "./ViewModel"], function (require, exports, Day_1, ViewModel_1) {
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
            if (value instanceof Day_1.default) {
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
                    moveDirection = diffX > 0 ? ViewModel_1.MoveDirection_.Right : ViewModel_1.MoveDirection_.Left;
                }
                else if (Math.abs(diffY) > minDistance.x) {
                    moveDirection = diffY > 0 ? ViewModel_1.MoveDirection_.Down : ViewModel_1.MoveDirection_.Up;
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
