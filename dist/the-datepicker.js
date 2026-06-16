var TheDatepicker = (() => {
  var TheDatepicker;
  ((TheDatepicker2) => {
    let DayOfWeek;
    ((DayOfWeek2) => {
      DayOfWeek2[DayOfWeek2["Monday"] = 1] = "Monday";
      DayOfWeek2[DayOfWeek2["Tuesday"] = 2] = "Tuesday";
      DayOfWeek2[DayOfWeek2["Wednesday"] = 3] = "Wednesday";
      DayOfWeek2[DayOfWeek2["Thursday"] = 4] = "Thursday";
      DayOfWeek2[DayOfWeek2["Friday"] = 5] = "Friday";
      DayOfWeek2[DayOfWeek2["Saturday"] = 6] = "Saturday";
      DayOfWeek2[DayOfWeek2["Sunday"] = 0] = "Sunday";
    })(DayOfWeek = TheDatepicker2.DayOfWeek || (TheDatepicker2.DayOfWeek = {}));
    let Month;
    ((Month2) => {
      Month2[Month2["January"] = 0] = "January";
      Month2[Month2["February"] = 1] = "February";
      Month2[Month2["March"] = 2] = "March";
      Month2[Month2["April"] = 3] = "April";
      Month2[Month2["May"] = 4] = "May";
      Month2[Month2["June"] = 5] = "June";
      Month2[Month2["July"] = 6] = "July";
      Month2[Month2["August"] = 7] = "August";
      Month2[Month2["September"] = 8] = "September";
      Month2[Month2["October"] = 9] = "October";
      Month2[Month2["November"] = 10] = "November";
      Month2[Month2["December"] = 11] = "December";
    })(Month = TheDatepicker2.Month || (TheDatepicker2.Month = {}));
    let Align;
    ((Align2) => {
      Align2[Align2["Left"] = 1] = "Left";
      Align2[Align2["Right"] = 2] = "Right";
      Align2[Align2["Center"] = 3] = "Center";
    })(Align = TheDatepicker2.Align || (TheDatepicker2.Align = {}));
    let Position;
    ((Position2) => {
      Position2[Position2["BottomRight"] = 1] = "BottomRight";
      Position2[Position2["BottomLeft"] = 2] = "BottomLeft";
      Position2[Position2["TopRight"] = 3] = "TopRight";
      Position2[Position2["TopLeft"] = 4] = "TopLeft";
    })(Position = TheDatepicker2.Position || (TheDatepicker2.Position = {}));
    let KeyCode_;
    ((KeyCode_2) => {
      KeyCode_2[KeyCode_2["Enter"] = 13] = "Enter";
      KeyCode_2[KeyCode_2["Space"] = 32] = "Space";
      KeyCode_2[KeyCode_2["Left"] = 37] = "Left";
      KeyCode_2[KeyCode_2["Up"] = 38] = "Up";
      KeyCode_2[KeyCode_2["Right"] = 39] = "Right";
      KeyCode_2[KeyCode_2["Down"] = 40] = "Down";
      KeyCode_2[KeyCode_2["Esc"] = 27] = "Esc";
    })(KeyCode_ = TheDatepicker2.KeyCode_ || (TheDatepicker2.KeyCode_ = {}));
    let ListenerType_;
    ((ListenerType_2) => {
      ListenerType_2["MouseDown"] = "mousedown";
      ListenerType_2["Focus"] = "focus";
      ListenerType_2["FocusIn"] = "focusin";
      ListenerType_2["Blur"] = "blur";
      ListenerType_2["KeyDown"] = "keydown";
      ListenerType_2["KeyUp"] = "keyup";
      ListenerType_2["KeyPress"] = "keypress";
      ListenerType_2["TouchStart"] = "touchstart";
      ListenerType_2["TouchMove"] = "touchmove";
      ListenerType_2["AnimationEnd"] = "animationend";
    })(ListenerType_ = TheDatepicker2.ListenerType_ || (TheDatepicker2.ListenerType_ = {}));
    const _Helper_ = class _Helper_ {
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
            throw new Error(parameterName + " cannot be empty.");
          }
          return null;
        }
        if (value instanceof TheDatepicker2.Day) {
          return value.getDate();
        }
        if (typeof value === "string") {
          value = value.trim ? value.trim() : value;
          if (value === "today" || value === "now") {
            return options.getToday();
          }
          if (value === "tomorrow") {
            const date2 = options.getToday();
            date2.setDate(date2.getDate() + 1);
            return date2;
          }
          if (value === "yesterday") {
            const date2 = options.getToday();
            date2.setDate(date2.getDate() - 1);
            return date2;
          }
          let date = options.getToday();
          let parsedValue = value;
          const matches = value.match(new RegExp("^\\s*([0-9]+).?\\s*(" + _Helper_.months_.join("|") + ")\\s*", "i"));
          if (matches) {
            const day = parseInt(matches[1], 10);
            let month;
            for (month = 0; month < _Helper_.months_.length; month++) {
              if (matches[2].toLowerCase() === _Helper_.months_[month]) {
                date.setMonth(month);
                date.setDate(day);
                break;
              }
            }
            parsedValue = parsedValue.substring(matches[0].length);
          }
          let sumPositive = true;
          while (parsedValue) {
            const matches2 = parsedValue.match(/^\s*([+-]?)\s*([0-9]+)\s*(day|week|month|year)s?\s*/i);
            if (!matches2) {
              break;
            }
            switch (matches2[1]) {
              case "+":
                sumPositive = true;
                break;
              case "-":
                sumPositive = false;
            }
            const amount = parseInt(matches2[2], 10) * (sumPositive ? 1 : -1);
            switch (matches2[3].toLowerCase()) {
              case "day":
              case "days":
                date.setDate(date.getDate() + amount);
                break;
              case "week":
              case "weeks":
                date.setDate(date.getDate() + amount * 7);
                break;
              case "month":
              case "months":
                date.setMonth(date.getMonth() + amount);
                break;
              case "year":
              case "years":
                date.setFullYear(date.getFullYear() + amount);
            }
            parsedValue = parsedValue.substring(matches2[0].length);
            if (!parsedValue) {
              return date;
            }
          }
          date = _Helper_.resetTime_(new Date(value));
          if (!isNaN(date.getTime())) {
            return date;
          }
        } else if (_Helper_.isValidDate_(value)) {
          const date = _Helper_.resetTime_(new Date(value.getTime()));
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
        throw new Error(
          parameterName + " was expected to be a valid Date string or valid Date or TheDatepicker.Day" + (isNullable ? " or null." : ".")
        );
      }
      static isElement_(element) {
        return typeof element === "object" && element.nodeType === 1 && typeof element.style === "object" && typeof element.ownerDocument === "object";
      }
      static isValidDate_(value) {
        return typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime());
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
          if (isPassive && _Helper_.isPassiveEventListenerSupported_()) {
            options = {
              passive: true
            };
          }
          element.addEventListener(listenerType, listener, options);
          return () => {
            element.removeEventListener(listenerType, listener);
          };
        }
        const listenerProperty = "on" + listenerType;
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
        } else {
          event.returnValue = false;
        }
      }
      static stopPropagation_(event) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else {
          event.cancelBubble = true;
        }
      }
      static checkString_(parameterName, value, checkNonEmpty = false) {
        if (!checkNonEmpty && !value) {
          return "";
        }
        if (typeof value !== "string" || checkNonEmpty && value === "") {
          throw new Error(parameterName + " was expected to be a" + (checkNonEmpty ? " non empty" : "") + " string.");
        }
        return value;
      }
      static checkNumber_(parameterName, value, min = null, max = null) {
        value = typeof value === "string" ? parseInt(value, 10) : value;
        if (typeof value !== "number" || isNaN(value) || min !== null && value < min || max !== null && value > max) {
          throw new Error(parameterName + " was expected to be a valid number" + (min !== null ? " from " + min : "") + (max !== null ? " to " + max : "") + ".");
        }
        return value;
      }
      static checkFunction_(parameterName, value, isNullable = true) {
        if (isNullable && !value) {
          return null;
        }
        if (typeof value !== "function") {
          throw new Error(parameterName + " was expected to be a function" + (isNullable ? " or null" : "") + ".");
        }
        return value;
      }
      static warnDeprecatedUsage_(deprecatedMethod, alternateMethods) {
        if (!window.console) {
          return;
        }
        for (let index = 0; index < _Helper_.deprecatedMethods_.length; index++) {
          if (deprecatedMethod === _Helper_.deprecatedMethods_[0]) {
            return;
          }
        }
        window.console.warn("TheDatepicker: " + deprecatedMethod + " is deprecated, use " + alternateMethods.join(" or "));
        _Helper_.deprecatedMethods_.push(deprecatedMethod);
      }
      static addSwipeListener_(element, listener) {
        let startPosition = null;
        let minDistance;
        _Helper_.addEventListener_(element, "touchstart" /* TouchStart */, (event) => {
          startPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          };
          minDistance = {
            x: element.offsetWidth / 5,
            y: element.offsetHeight / 5
          };
        }, true);
        _Helper_.addEventListener_(element, "touchmove" /* TouchMove */, (event) => {
          if (!startPosition) {
            return;
          }
          const diffX = event.touches[0].clientX - startPosition.x;
          const diffY = event.touches[0].clientY - startPosition.y;
          let moveDirection = null;
          if (Math.abs(diffX) > minDistance.x) {
            moveDirection = diffX > 0 ? TheDatepicker2.MoveDirection_.Right : TheDatepicker2.MoveDirection_.Left;
          } else if (Math.abs(diffY) > minDistance.x) {
            moveDirection = diffY > 0 ? TheDatepicker2.MoveDirection_.Down : TheDatepicker2.MoveDirection_.Up;
          }
          if (moveDirection) {
            listener(event, moveDirection);
            startPosition = null;
          }
        }, true);
      }
      static isCssAnimationSupported_() {
        if (_Helper_.cssAnimationSupport_ === null) {
          const fakeElement = document.createElement("div");
          _Helper_.cssAnimationSupport_ = fakeElement.style.animationName === "";
        }
        return _Helper_.cssAnimationSupport_;
      }
      static isPassiveEventListenerSupported_() {
        if (_Helper_.passiveEventListenerSupport_ === null) {
          let isSupported = false;
          try {
            const options = Object.defineProperty({}, "passive", {
              get: function() {
                isSupported = true;
                return false;
              }
            });
            window.addEventListener("test", null, options);
            window.removeEventListener("test", null, options);
          } catch (error) {
          }
          _Helper_.passiveEventListenerSupport_ = isSupported;
        }
        return _Helper_.passiveEventListenerSupport_;
      }
      static isMobile_() {
        const matchMedia = window.matchMedia || window.msMatchMedia;
        const mediaQuery = "only all and (max-width: 37.5em)";
        if (!matchMedia) {
          return false;
        }
        const result = matchMedia(mediaQuery);
        if (!result) {
          return false;
        }
        return !!result.matches;
      }
    };
    _Helper_.months_ = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december"
    ];
    _Helper_.deprecatedMethods_ = [];
    _Helper_.cssAnimationSupport_ = null;
    _Helper_.passiveEventListenerSupport_ = null;
    let Helper_ = _Helper_;
    TheDatepicker2.Helper_ = _Helper_;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    class CannotParseDateException {
    }
    TheDatepicker2.CannotParseDateException = CannotParseDateException;
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
          } else {
            throw new CannotParseDateException();
          }
        }
        return date;
      }
    }
    const _DateConverter_ = class _DateConverter_ {
      static formatDate_(date, options, format = null) {
        if (!date) {
          return null;
        }
        format = format || options.getInputFormat();
        let escapeNext = false;
        let result = "";
        for (let position = 0; position < format.length; position++) {
          const char = format.substring(position, position + 1);
          if (escapeNext) {
            result += char;
            escapeNext = false;
            continue;
          }
          if (char === _DateConverter_.escapeChar_) {
            escapeNext = true;
            continue;
          }
          const formatter = _DateConverter_.getFormatter_(char);
          if (formatter) {
            result += formatter.call(null, date, options);
            continue;
          }
          result += char;
        }
        return result;
      }
      static parseDate_(text, options) {
        if ((text.trim ? text.trim() : text) === "") {
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
          } else if (char === _DateConverter_.escapeChar_) {
            escapeNext = true;
            continue;
          } else {
            const parser = _DateConverter_.getParser_(char);
            if (parser) {
              try {
                textPosition += parser.call(null, text.substring(textPosition), dateData, options);
              } catch (error) {
                if (!(error instanceof CannotParseDateException)) {
                  throw error;
                }
                const textChar2 = text.substring(textPosition, textPosition + 1);
                if (textChar2 === " ") {
                  textPosition++;
                  position--;
                  continue;
                } else {
                  throw error;
                }
              }
              continue;
            }
          }
          const textChar = text.substring(textPosition, textPosition + 1);
          if (textChar !== char) {
            if (char === " ") {
              continue;
            }
            if (textChar === " ") {
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
        if (textChar === "" || /[0-9-]/.test(textChar)) {
          return true;
        }
        const format = options.getInputFormat();
        let escapeNext = false;
        for (let position = 0; position < format.length; position++) {
          const char = format.substring(position, position + 1);
          if (escapeNext) {
            escapeNext = false;
          } else if (char === _DateConverter_.escapeChar_) {
            escapeNext = true;
            continue;
          } else {
            const phrases = _DateConverter_.getValidPhrases_(char, options);
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
          // Day of the month (1 to 31)
          case "j":
            return _DateConverter_.formatDay_;
          // Day of the month with leading zero (01 to 31)
          case "d":
            return _DateConverter_.formatDayWithLeadingZero_;
          // Short textual representation of a day of the week (Mo through Su)
          case "D":
            return _DateConverter_.formatDayOfWeekTextual_;
          // Textual representation of a day of the week (Monday through Sunday)
          case "l":
            return _DateConverter_.formatDayOfWeekTextualFull_;
          // Numeric representation of a month (1 through 12)
          case "n":
            return _DateConverter_.formatMonth_;
          // Numeric representation of a month with leading zero (01 through 12)
          case "m":
            return _DateConverter_.formatMonthWithLeadingZero_;
          // Textual representation of a month (January through December)
          case "F":
            return _DateConverter_.formatMonthTextual_;
          // Short textual representation of a month (Jan through Dec)
          case "M":
            return _DateConverter_.formatMonthTextualShort_;
          // Full year (1999 or 2003)
          case "Y":
            return _DateConverter_.formatYear_;
          // Year, 2 digits (99 or 03)
          case "y":
            return _DateConverter_.formatYearTwoDigits_;
          default:
            return null;
        }
      }
      static formatDay_(date) {
        return date.getDate() + "";
      }
      static formatDayWithLeadingZero_(date) {
        return ("0" + date.getDate()).slice(-2);
      }
      static formatDayOfWeekTextual_(date, options) {
        return options.translator.translateDayOfWeek(date.getDay());
      }
      static formatDayOfWeekTextualFull_(date, options) {
        return options.translator.translateDayOfWeekFull(date.getDay());
      }
      static formatMonth_(date) {
        return date.getMonth() + 1 + "";
      }
      static formatMonthWithLeadingZero_(date) {
        return ("0" + (date.getMonth() + 1)).slice(-2);
      }
      static formatMonthTextual_(date, options) {
        return options.translator.translateMonth(date.getMonth());
      }
      static formatMonthTextualShort_(date, options) {
        return options.translator.translateMonthShort(date.getMonth());
      }
      static formatYear_(date) {
        return date.getFullYear() + "";
      }
      static formatYearTwoDigits_(date) {
        const year = date.getFullYear() + "";
        return year.substring(year.length - 2);
      }
      static getParser_(type) {
        switch (type) {
          case "j":
          case "d":
            return _DateConverter_.parseDay_;
          case "D":
            return _DateConverter_.parseDayOfWeekTextual_;
          case "l":
            return _DateConverter_.parseDayOfWeekTextualFull_;
          case "n":
          case "m":
            return _DateConverter_.parseMonth_;
          case "F":
            return _DateConverter_.parseMonthTextual_;
          case "M":
            return _DateConverter_.parseMonthTextualShort_;
          case "Y":
            return _DateConverter_.parseYear_;
          case "y":
            return _DateConverter_.parseYearTwoDigits_;
          default:
            return null;
        }
      }
      static parseDay_(text, dateData) {
        let took = 0;
        while (text.substring(0, 1) === "0") {
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
        return _DateConverter_.parseDayOfWeekByTranslator_(text, (dayOfWeek) => {
          return options.translator.translateDayOfWeek(dayOfWeek);
        });
      }
      static parseDayOfWeekTextualFull_(text, dateData, options) {
        return _DateConverter_.parseDayOfWeekByTranslator_(text, (dayOfWeek) => {
          return options.translator.translateDayOfWeekFull(dayOfWeek);
        });
      }
      static parseDayOfWeekByTranslator_(text, translate) {
        let maxLength = 0;
        let matchedTranslationLength = 0;
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          const translation = translate(dayOfWeek);
          maxLength = Math.max(maxLength, translation.length);
          if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase() && translation.length > matchedTranslationLength) {
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
        while (text.substring(0, 1) === "0") {
          text = text.substring(1);
          took++;
        }
        let month = text.substring(0, 2);
        if (month !== "10" && month !== "11" && month !== "12") {
          month = month.substring(0, 1);
          if (!/[1-9]/.test(month)) {
            throw new CannotParseDateException();
          }
        }
        dateData.month = parseInt(month, 10);
        return took + month.length;
      }
      static parseMonthTextual_(text, dateData, options) {
        return _DateConverter_.parseMonthByTranslator_(text, dateData, (month) => {
          return options.translator.translateMonth(month);
        });
      }
      static parseMonthTextualShort_(text, dateData, options) {
        return _DateConverter_.parseMonthByTranslator_(text, dateData, (month) => {
          return options.translator.translateMonthShort(month);
        });
      }
      static parseMonthByTranslator_(text, dateData, translate) {
        let matchedMonth = null;
        let matchedTranslationLength = 0;
        for (let month = 1; month <= 12; month++) {
          const translation = translate(month - 1);
          if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase() && translation.length > matchedTranslationLength) {
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
        if (text.substring(0, 1) === "-") {
          isNegative = true;
          text = text.substring(1);
        }
        const minDate = options.getMinDate_();
        const maxDate = options.getMaxDate_();
        const maxPositiveLength = maxDate.getFullYear() > 0 ? (maxDate.getFullYear() + "").length : 0;
        const maxNegativeLength = minDate.getFullYear() < 0 ? (-minDate.getFullYear() + "").length : 0;
        let yearLength = 0;
        while (/[0-9]/.test(text.substring(yearLength, yearLength + 1))) {
          if (isNegative && yearLength + 1 > maxNegativeLength || !isNegative && yearLength + 1 > maxPositiveLength) {
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
        const currentYear = options.getToday().getFullYear() + "";
        const yearBeginning = currentYear.substring(0, currentYear.length - 2);
        dateData.year = parseInt(yearBeginning + yearEnd, 10);
        return 2;
      }
      static getValidPhrases_(type, options) {
        switch (type) {
          case "j":
          case "d":
          case "n":
          case "m":
          case "Y":
          case "y":
            return [];
          case "D":
            return options.translator.dayOfWeekTranslations_;
          case "l":
            return options.translator.dayOfWeekFullTranslations_;
          case "F":
            return options.translator.monthTranslations_;
          case "M":
            return options.translator.monthShortTranslations_;
          default:
            return null;
        }
      }
    };
    _DateConverter_.escapeChar_ = "\\";
    let DateConverter_ = _DateConverter_;
    TheDatepicker2.DateConverter_ = _DateConverter_;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    let TitleName;
    ((TitleName2) => {
      TitleName2[TitleName2["GoBack"] = 0] = "GoBack";
      TitleName2[TitleName2["GoForward"] = 1] = "GoForward";
      TitleName2[TitleName2["Close"] = 2] = "Close";
      TitleName2[TitleName2["Reset"] = 3] = "Reset";
      TitleName2[TitleName2["Deselect"] = 4] = "Deselect";
      TitleName2[TitleName2["Month"] = 5] = "Month";
      TitleName2[TitleName2["Year"] = 6] = "Year";
      TitleName2[TitleName2["GoBackTableOfYears"] = 7] = "GoBackTableOfYears";
      TitleName2[TitleName2["GoForwardTableOfYears"] = 8] = "GoForwardTableOfYears";
    })(TitleName = TheDatepicker2.TitleName || (TheDatepicker2.TitleName = {}));
    class Translator {
      constructor() {
        this.dayOfWeekFullTranslations_ = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ];
        this.dayOfWeekTranslations_ = [
          "Su",
          "Mo",
          "Tu",
          "We",
          "Th",
          "Fr",
          "Sa"
        ];
        this.monthTranslations_ = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        this.monthShortTranslations_ = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        this.titles_ = [
          "Go to previous month",
          // GoBack
          "Go to next month",
          // GoForward
          "Close calendar",
          // Close
          "Reset calendar",
          // Reset
          "Deselect date",
          // Deselect
          "Month selection",
          // Month
          "Year selection",
          // Year
          "Show earlier years",
          // GoBackTableOfYears
          "Show later years"
          // GoForwardTableOfYears
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
        this.dayOfWeekTranslations_[TheDatepicker2.Helper_.checkNumber_("Day of week", dayOfWeek, 0, 6)] = TheDatepicker2.Helper_.checkString_("Translation", translation, true);
      }
      setDayOfWeekFullTranslation(dayOfWeek, translation) {
        this.dayOfWeekFullTranslations_[TheDatepicker2.Helper_.checkNumber_("Day of week", dayOfWeek, 0, 6)] = TheDatepicker2.Helper_.checkString_("Translation", translation, true);
      }
      setMonthTranslation(month, translation) {
        this.monthTranslations_[TheDatepicker2.Helper_.checkNumber_("Month", month, 0, 11)] = TheDatepicker2.Helper_.checkString_("Translation", translation, true);
      }
      setMonthShortTranslation(month, translation) {
        this.monthShortTranslations_[TheDatepicker2.Helper_.checkNumber_("Month", month, 0, 11)] = TheDatepicker2.Helper_.checkString_("Translation", translation, true);
      }
      setTitleTranslation(titleName, translation) {
        this.titles_[TheDatepicker2.Helper_.checkNumber_("Title", titleName, 0, this.titles_.length - 1)] = TheDatepicker2.Helper_.checkString_("Translation", translation);
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
    TheDatepicker2.Translator = Translator;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    let EventType_;
    ((EventType_2) => {
      EventType_2["BeforeSelect"] = "beforeSelect";
      EventType_2["Select"] = "select";
      EventType_2["BeforeOpen"] = "beforeOpen";
      EventType_2["Open"] = "open";
      EventType_2["BeforeClose"] = "beforeClose";
      EventType_2["Close"] = "close";
      EventType_2["BeforeMonthChange"] = "beforeMonthChange";
      EventType_2["MonthChange"] = "monthChange";
      EventType_2["Focus"] = "focus";
      EventType_2["BeforeFocus"] = "beforeFocus";
    })(EventType_ = TheDatepicker2.EventType_ || (TheDatepicker2.EventType_ = {}));
    class AvailableDateNotFoundException {
    }
    TheDatepicker2.AvailableDateNotFoundException = AvailableDateNotFoundException;
    class Options {
      constructor(translator = null, classNames = null) {
        this.hideOnBlur_ = true;
        this.hideOnSelect_ = true;
        this.minDate_ = null;
        this.maxDate_ = null;
        this.initialDate_ = null;
        this.initialMonth_ = null;
        this.initialDatePriority_ = true;
        this.firstDayOfWeek_ = 1 /* Monday */;
        this.dateAvailabilityResolvers_ = [];
        this.cellContentResolver_ = null;
        this.cellContentStructureResolver_ = null;
        this.headerStructureResolver_ = null;
        this.footerStructureResolver_ = null;
        this.cellClassesResolvers_ = [];
        this.dayModifiers_ = [];
        this.inputFormat_ = "j. n. Y";
        this.allowInputAnyChar_ = false;
        this.daysOutOfMonthVisible_ = false;
        this.fixedRowsCount_ = false;
        this.toggleSelection_ = false;
        this.allowEmpty_ = true;
        this.showDeselectButton_ = true;
        this.showResetButton_ = false;
        this.monthAsDropdown_ = true;
        this.yearAsDropdown_ = true;
        this.bindSelectedDateWithMonth_ = false;
        this.yearSelectedFromTableOfYears_ = true;
        this.tableOfYearsRowsCount_ = 6;
        this.tableOfYearsAlign_ = null;
        this.tableOfYearsOnSwipeDown_ = true;
        this.yearsOutOfTableOfYearsVisible_ = true;
        this.monthAndYearSeparated_ = true;
        this.monthShort_ = false;
        this.changeMonthOnSwipe_ = true;
        this.slideAnimation_ = true;
        this.classesPrefix_ = "the-datepicker__";
        this.darkMode_ = false;
        this.showCloseButton_ = true;
        this.closeOnEscPress_ = true;
        this.title_ = "";
        this.dropdownItemsLimit_ = 200;
        this.hideDropdownWithOneItem_ = true;
        this.goBackHtml_ = "&lt;";
        this.goForwardHtml_ = "&gt;";
        this.closeHtml_ = "&times;";
        this.resetHtml_ = "&olarr;";
        this.deselectHtml_ = "&times;";
        this.position_ = 1 /* BottomRight */;
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
        this.translator = translator || new TheDatepicker2.Translator();
        this.classNames = classNames || new TheDatepicker2.ClassNames();
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
        options.bindSelectedDateWithMonth_ = this.bindSelectedDateWithMonth_;
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
      }
      // <Date> definition (can be one of following):
      // - instance of Date
      // - string in format YYYY-MM-DD; e.g.: "2019-02-10" (months 1-based)
      // - any string which is accepted by Date constructor, e.g.: "7 September 2021"
      // - instance of TheDatepicker.Day
      // - string "now" or "today" or "tomorrow" or "yesterday"
      // - string in format "<sign><number> <unit>"
      //     where <sign> is "+" or "-" and is optional,
      //     <unit> is one of "day", "week", "month" or "year" or plural version
      //     possibly repeating
      //     e.g.: "-10 years", "+1 year 3 months 1 week"
      //     can precede with "<number>. <January through December>"
      //     e.g. "20. March -3 years"
      // Setting to true will display datepicker only when input or datepicker itself is focused,
      // otherwise datepicker will be visible always.
      // Works only when there an input exists.
      // defaults to true
      setHideOnBlur(value) {
        this.hideOnBlur_ = !!value;
      }
      // Setting to true will hide datepicker immediately after selecting a valid date.
      // Works only when the setting HideOnBlur is set to true.
      // Works only when there an input exists.
      // defaults to true
      setHideOnSelect(value) {
        this.hideOnSelect_ = !!value;
      }
      // Minimal date which can be selected (inclusive).
      // Define as <Date> (see the definition above)
      // or null for no limit.
      // defaults to no limit
      setMinDate(date) {
        const normalizedDate = TheDatepicker2.Helper_.normalizeDate_("Min date", date, true, this);
        this.checkConstraints_(normalizedDate, this.maxDate_);
        this.minDate_ = normalizedDate;
      }
      // Maximal date which can be selected (inclusive).
      // Define as <Date> (see the definition above)
      // or null for no limit.
      // defaults to no limit
      setMaxDate(date) {
        const normalizedDate = TheDatepicker2.Helper_.normalizeDate_("Max date", date, true, this);
        this.checkConstraints_(this.minDate_, normalizedDate);
        this.maxDate_ = normalizedDate;
      }
      // Month to be rendered when datepicker opened first time.
      // Define as <Date> (see the definition above)
      // or null for the current month.
      // defaults to current month
      setInitialMonth(month) {
        this.initialMonth_ = TheDatepicker2.Helper_.normalizeDate_("Initial month", month, true, this);
      }
      // Preselected date.
      // Define as <Date> (see the definition above)
      // or null for no value.
      // It's overloaded by direct input value, if any.
      // defaults to null
      setInitialDate(value) {
        this.initialDate_ = TheDatepicker2.Helper_.normalizeDate_("Initial date", value, true, this);
      }
      // Setting to true will make initial month ignored when there is any date preselected.
      // defaults to true
      setInitialDatePriority(value) {
        this.initialDatePriority_ = !!value;
      }
      // Day of week when weeks start.
      // TheDatepicker.DayOfWeek constant, e.g. TheDatepicker.DayOfWeek.Sunday
      // or integer from 0 to 6; 0 = Sunday, 1 = Monday, ... 6 = Saturday
      // defaults to Monday
      setFirstDayOfWeek(dayOfWeek) {
        this.firstDayOfWeek_ = TheDatepicker2.Helper_.checkNumber_("First day of week", dayOfWeek, 0, 6);
      }
      // Accepts callback which gets an instance of Date on input and returns boolean whether given date is available for select or not,
      // or null to make available all days.
      // deprecated, use addDateAvailabilityResolver()
      setDateAvailabilityResolver(resolver) {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("setDateAvailabilityResolver", ["addDateAvailabilityResolver"]);
        this.removeDateAvailabilityResolver();
        if (resolver) {
          this.addDateAvailabilityResolver(resolver);
        }
      }
      // Accepts callback which gets an instance of Date on input and returns boolean whether given date is available for select or not.
      // The date is available for select only if all resolvers return true.
      addDateAvailabilityResolver(resolver) {
        this.dateAvailabilityResolvers_.push(TheDatepicker2.Helper_.checkFunction_("Resolver", resolver, false));
      }
      removeDateAvailabilityResolver(resolver = null) {
        this.removeCallback_(this.dateAvailabilityResolvers_, "Resolver", resolver);
      }
      // Accepts callback which gets an instance of TheDatepicker.Day on input and returns string representing content of day cell,
      // or null for default behavior.
      // Default callback returns day number.
      setCellContentResolver(resolver) {
        this.cellContentResolver_ = TheDatepicker2.Helper_.checkFunction_("Resolver", resolver);
      }
      // Accepts two callbacks,
      // or null for default behavior.
      // First callback (init) has no arguments and returns HTMLElement instance representing empty html structure of day cell.
      // Second callback (update) gets an instance of HTMLElement created by first callback, and an instance of TheDatepicker.Day. It should update html structure by given day. Returns void.
      // Default init creates span element and default update fills it with day number.
      setCellContentStructureResolver(init, update = null) {
        init = TheDatepicker2.Helper_.checkFunction_("Resolver (init)", init);
        update = TheDatepicker2.Helper_.checkFunction_("Resolver (update)", update);
        this.cellContentStructureResolver_ = init ? {
          init,
          update
        } : null;
      }
      // Accepts callback which has no arguments and returns HTMLElement instance which will be placed as datepicker header,
      // or null for no header.
      // defaults to no header
      setHeaderStructureResolver(resolver) {
        this.headerStructureResolver_ = TheDatepicker2.Helper_.checkFunction_("Resolver", resolver);
      }
      // Accepts callback which has no arguments and returns HTMLElement instance which will be placed as datepicker footer,
      // or null for no footer.
      // defaults to no footer
      setFooterStructureResolver(resolver) {
        this.footerStructureResolver_ = TheDatepicker2.Helper_.checkFunction_("Resolver", resolver);
      }
      // Accepts callback which gets an instance of TheDatepicker.Day on input and returns array of strings representing custom classes for day cell.
      addCellClassesResolver(resolver) {
        this.cellClassesResolvers_.push(TheDatepicker2.Helper_.checkFunction_("Resolver", resolver, false));
      }
      removeCellClassesResolver(resolver = null) {
        this.removeCallback_(this.cellClassesResolvers_, "Resolver", resolver);
      }
      // Accepts callback which gets an instance of TheDatepicker.Day on input. It is designated to add arbitrary properties to the TheDatepicker.Day instance.
      addDayModifier(modifier) {
        this.dayModifiers_.push(TheDatepicker2.Helper_.checkFunction_("Modifier", modifier, false));
      }
      removeDayModifier(modifier = null) {
        this.removeCallback_(this.dayModifiers_, "Modifier", modifier);
      }
      // Format in which date is printed as an input value.
      // It accepts following placeholders:
      // "j": Day of the month; 1 to 31
      // "d": Day of the month with leading zero; 01 to 31
      // "l": Textual representation of a day of the week; Monday through Sunday
      // "D": Short textual representation of a day of the week; Mo through Su
      // "n": Numeric representation of a month; 1 through 12
      // "m": Numeric representation of a month with leading zero; 01 through 12
      // "F": Textual representation of a month; January through December
      // "M": Short textual representation of a month; Jan through Dec
      // "Y": Full year; 1999 or 2003
      // "y": Year, 2 digits; 99 or 03
      // Any other character is printed as is.
      // To print a placeholder character as normal character just put a backslash "\" before it (e.g. "\D").
      // defaults to "j. n. Y"
      setInputFormat(format) {
        this.inputFormat_ = TheDatepicker2.Helper_.checkString_("Input format", format, true);
      }
      // Setting to false will allow type only those characters which are valid by InputFormat,
      // otherwise any character can be typed.
      // defaults to false
      setAllowInputAnyChar(value) {
        this.allowInputAnyChar_ = !!value;
      }
      // Setting to false will hide days which belongs to other months.
      // defaults to false
      setDaysOutOfMonthVisible(value) {
        this.daysOutOfMonthVisible_ = !!value;
      }
      // Setting to true will always render six rows despite of current month weeks count.
      // defaults to false
      setFixedRowsCount(value) {
        this.fixedRowsCount_ = !!value;
      }
      // Setting to true will make selection toggle, so click on selected day will deselects it.
      // Works only when the setting AllowEmpty is set to true.
      // defaults to false
      setToggleSelection(value) {
        this.toggleSelection_ = !!value;
      }
      // Setting to true will render a button inside an input, which deselects selected date.
      // Works only when there an input exists.
      // Works only when the setting AllowEmpty is set to true.
      // defaults to true
      setShowDeselectButton(value) {
        this.showDeselectButton_ = !!value;
      }
      // Setting to false will disallow to deselect, in other words it always must be any day selected.
      // When there is no initial date, current date (or nearest available one) will be preselected.
      // defaults to true
      setAllowEmpty(value) {
        this.allowEmpty_ = !!value;
      }
      // Setting to true will show button for reseting datepicker to initial state.
      // defaults to false
      setShowResetButton(value) {
        this.showResetButton_ = !!value;
      }
      // Setting to true will render month as dropdown list (html select).
      // defaults to true
      setMonthAsDropdown(value) {
        this.monthAsDropdown_ = !!value;
      }
      // Setting to true will render year as dropdown list (html select).
      // defaults to true
      setYearAsDropdown(value) {
        this.yearAsDropdown_ = !!value;
      }
      // Setting to true will always keep selected date in current month.
      // defaults to false
      setBindSelectedDateWithMonth(value) {
        this.bindSelectedDateWithMonth_ = !!value;
      }
      // Setting to true will render year selection as a table of years instead of dropdown list (html select).
      // Works only when setting YearAsDropdown is set to true.
      // defaults to true
      setYearSelectedFromTableOfYears(value) {
        this.yearSelectedFromTableOfYears_ = !!value;
      }
      // Table of years rows count.
      // defaults to 6
      setTableOfYearsRowsCount(count) {
        this.tableOfYearsRowsCount_ = TheDatepicker2.Helper_.checkNumber_("Rows count", count, 1);
      }
      // Align of years in table of years.
      // TheDatepicker.Align.Left means that first available year is placed in the upper left corner of the table.
      //   Works only when setting MinDate is not null.
      // TheDatepicker.Align.Right means that last available year is placed in the lower right corner of the table.
      //   Works only when setting MaxDate is not null.
      // TheDatepicker.Align.Center means that initial year is placed in the center of the table.
      // When set to null, align is calculated as follows:
      //   If both settings MinDate and MaxDate are set to null, the TheDatepicker.Align.Center is used.
      //   If only setting MinDate is not null, the TheDatepicker.Align.Left is used.
      //   If only setting MaxDate is not null, the TheDatepicker.Align.Right is used.
      //   If both settings MinDate and MaxDate are not null, align is calculated as follows:
      //     If the difference between MinDate and the initial year is less than or equal to the difference between
      //     MaxDate and the initial year, the TheDatepicker.Align.Left is used.
      //     Otherwise, the TheDatepicker.Align.Right is used.
      // defaults to null
      setTableOfYearsAlign(align) {
        this.tableOfYearsAlign_ = align ? TheDatepicker2.Helper_.checkNumber_("Align", align, 1, 3) : null;
      }
      // Setting to true will open table of years on finger up-to-down swipe
      // and close it on finger down-to-up swipe.
      // defaults to true
      setTableOfYearsOnSwipeDown(value) {
        this.tableOfYearsOnSwipeDown_ = !!value;
      }
      // Setting to false will hide years in table of years which are not available.
      // defaults to true
      setYearsOutOfTableOfYearsVisible(value) {
        this.yearsOutOfTableOfYearsVisible_ = !!value;
      }
      // Setting to true will render month and year in header each in separate element.
      // If set to false it will be rendered as a dropdown only when both settings MonthAsDropdown and YearAsDropdown are set to true.
      // Works only when setting YearSelectedFromTableOfYears is set to false.
      // defaults to true
      setMonthAndYearSeparated(value) {
        this.monthAndYearSeparated_ = !!value;
      }
      // Setting to true will dump month name in short textual representation.
      // defaults to false
      setMonthShort(value) {
        this.monthShort_ = !!value;
      }
      // Setting to true will enable changing of month on finger left-to-right or right-to-left swipe.
      // defaults to true
      setChangeMonthOnSwipe(value) {
        this.changeMonthOnSwipe_ = !!value;
      }
      setAnimateMonthChange(value) {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("setAnimateMonthChange", ["setSlideAnimation"]);
        this.setSlideAnimation(value);
      }
      // If set to true then changing month to next/previous and open/close of table of years will become animated.
      // defaults to true
      setSlideAnimation(value) {
        this.slideAnimation_ = !!value;
      }
      // CSS classes of datepicker elements will be prefixed with given string.
      // defaults to "the-datepicker__"
      setClassesPrefix(prefix) {
        this.classesPrefix_ = TheDatepicker2.Helper_.checkString_("Prefix", prefix);
      }
      // Setting to true will render datepicker in the dark appearance.
      // Works only when there is no custom container.
      // defaults to false
      setDarkMode(value) {
        this.darkMode_ = !!value;
      }
      // Setting to true will show button for closing datepicker.
      // Works only when the setting HideOnBlur is set to true.
      // defaults to true
      setShowCloseButton(value) {
        this.showCloseButton_ = !!value;
      }
      // Setting to true will close datepicker when ESC key is pressed.
      // Works only when the setting HideOnBlur is set to true.
      // defaults to true
      setCloseOnEscPress(value) {
        this.closeOnEscPress_ = !!value;
      }
      // Sets title which is displayed in the datepicker header.
      // null for no title
      // defaults to no title
      setTitle(title) {
        this.title_ = TheDatepicker2.Helper_.checkString_("Title", title);
      }
      // Limit of number of items in dropdown list.
      // default is 200
      setDropdownItemsLimit(limit) {
        this.dropdownItemsLimit_ = TheDatepicker2.Helper_.checkNumber_("Items limit", limit, 1);
      }
      // Setting to true will show month and/or year dropdown only when there are two or more options.
      // defaults to true
      setHideDropdownWithOneItem(value) {
        this.hideDropdownWithOneItem_ = !!value;
      }
      // Sets html for go back button.
      // defaults to "&lt;"
      setGoBackHtml(html) {
        this.goBackHtml_ = TheDatepicker2.Helper_.checkString_("Html", html);
      }
      // Sets html for go forward button.
      // defaults to "&gt;"
      setGoForwardHtml(html) {
        this.goForwardHtml_ = TheDatepicker2.Helper_.checkString_("Html", html);
      }
      // Sets html for close button.
      // defaults to "&times;"
      setCloseHtml(html) {
        this.closeHtml_ = TheDatepicker2.Helper_.checkString_("Html", html);
      }
      // Sets html for reset button.
      // defaults to "&olarr;"
      setResetHtml(html) {
        this.resetHtml_ = TheDatepicker2.Helper_.checkString_("Html", html);
      }
      // Sets html for deselect button.
      // defaults to "&times;"
      setDeselectHtml(html) {
        this.deselectHtml_ = TheDatepicker2.Helper_.checkString_("Html", html);
      }
      // Position of the datepicker relative to an input.
      // TheDatepicker.Position.BottomRight means that the top left corner of the datepicker is aligned with the input,
      //   so the datepicker is placed at the bottom right position from the input.
      // TheDatepicker.Position.BottomLeft works similarly.
      // TheDatepicker.Position.TopRight -"-
      // TheDatepicker.Position.TopLeft -"-
      // Note that while PositionFixing is on, datepicker still render to the different side, when there's no enough space.
      // Works only when there is no custom container.
      // defaults to Position.BottomRight
      setPosition(position) {
        this.position_ = TheDatepicker2.Helper_.checkNumber_("Position", position, 1, 4);
      }
      // Setting to true will render datepicker to the different side of an input than normally, if there's no enough space.
      // Works only when there is no custom container and setting HideOnBlur is set to true.
      // defaults to true
      setPositionFixing(value) {
        this.positionFixing_ = !!value;
      }
      // Setting to true will render datepicker fullscreen on narrow displays (usually mobile).
      // Works only when there is no custom container.
      // Works only when the setting HideOnBlur is set to true.
      // defaults to true
      setFullScreenOnMobile(value) {
        this.fullScreenOnMobile_ = !!value;
      }
      // Setting to false will prevent displaying virtual keyboard on mobile devices.
      // Useful especially with FullScreenOnMobile set to true.
      // Works only when there an input exists.
      // defaults to false
      setKeyboardOnMobile(value) {
        this.keyboardOnMobile_ = !!value;
      }
      // Setting to true will include Aria attributes into html.
      // For more info, see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
      // defaults to true
      setIncludeAria(value) {
        this.includeAria_ = !!value;
      }
      // Sets mock/fake today.
      // Define as <Date> (see the definition above)
      // or null for real today.
      // defaults to null
      setToday(date) {
        this.today_ = TheDatepicker2.Helper_.normalizeDate_("Today", date, true, this);
      }
      // Callback to be called just before the day is selected or deselected.
      // An Event instance, a TheDatepicker.Day instance (or null when deselected) and previous selected day TheDatepicker.Day instance (or null when nothing selected before) are given on input.
      // If callback returns false, selection stops and nothing will be selected / deselected.
      onBeforeSelect(listener) {
        this.onEvent_("beforeSelect" /* BeforeSelect */, listener);
      }
      offBeforeSelect(listener = null) {
        this.offEvent_("beforeSelect" /* BeforeSelect */, listener);
      }
      // Callback to be called immediately after the day is selected or deselected.
      // An Event instance, a TheDatepicker.Day instance (or null when deselected) and previous selected day TheDatepicker.Day instance (or null when nothing selected before) are given on input.
      onSelect(listener) {
        this.onEvent_("select" /* Select */, listener);
      }
      offSelect(listener = null) {
        this.offEvent_("select" /* Select */, listener);
      }
      // Callback to be called just before the datepicker is opened.
      // An Event instance is given on input.
      // If callback returns false, action stops and datepicker will not be opened.
      onBeforeOpen(listener) {
        this.onEvent_("beforeOpen" /* BeforeOpen */, listener);
      }
      offBeforeOpen(listener = null) {
        this.offEvent_("beforeOpen" /* BeforeOpen */, listener);
      }
      // Callback to be called immediately after the datepicker is opened.
      // An Event instance is given on input.
      onOpen(listener) {
        this.onEvent_("open" /* Open */, listener);
      }
      offOpen(listener = null) {
        this.offEvent_("open" /* Open */, listener);
      }
      // Callback to be called just before the datepicker is closed.
      // An Event instance is given on input.
      // If callback returns false, action stops and datepicker will not be closed.
      onBeforeClose(listener) {
        this.onEvent_("beforeClose" /* BeforeClose */, listener);
      }
      offBeforeClose(listener = null) {
        this.offEvent_("beforeClose" /* BeforeClose */, listener);
      }
      // Callback to be called immediately after the datepicker is closed.
      // An Event instance is given on input.
      onClose(listener) {
        this.onEvent_("close" /* Close */, listener);
      }
      offClose(listener = null) {
        this.offEvent_("close" /* Close */, listener);
      }
      // Callback to be called just before the datepicker is opened or closed.
      // An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
      // If callback returns false, action stops and datepicker will not be opened / closed.
      // deprecated, use onBeforeOpen() or onBeforeClose()
      onBeforeOpenAndClose(listener) {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("onBeforeOpenAndClose", ["onBeforeOpen", "onBeforeClose"]);
        this.onBeforeOpen(listener);
        this.onBeforeClose(listener);
      }
      // deprecated, use offBeforeOpen() or offBeforeClose()
      offBeforeOpenAndClose(listener = null) {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("offBeforeOpenAndClose", ["offBeforeOpen", "offBeforeClose"]);
        this.offBeforeOpen(listener);
        this.offBeforeClose(listener);
      }
      // Callback to be called immediately after the datepicker is opened or closed.
      // An Event instance and a boolean telling whether datepicker was opened (true) or closed (false) are given on input.
      // deprecated, use onOpen() or onClose()
      onOpenAndClose(listener) {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("onOpenAndClose", ["onOpen", "onClose"]);
        this.onOpen(listener);
        this.onClose(listener);
      }
      // deprecated, use offOpen() or offClose()
      offOpenAndClose(listener = null) {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("offOpenAndClose", ["offOpen", "offClose"]);
        this.offOpen(listener);
        this.offClose(listener);
      }
      // Callback to be called just before displayed month/year is changed.
      // An Event instance, month (Date instance set to first day of month) which is going to be displayed and month (Date instance) which was displayed before are given on input.
      // If callback returns false, month will not be changed.
      onBeforeMonthChange(listener) {
        this.onEvent_("beforeMonthChange" /* BeforeMonthChange */, listener);
      }
      offBeforeMonthChange(listener = null) {
        this.offEvent_("beforeMonthChange" /* BeforeMonthChange */, listener);
      }
      // Callback to be called immediately after displayed month/year is changed.
      // An Event instance, month (Date instance set to first day of month) which is now displayed and month (Date instance) which was displayed before are given on input.
      onMonthChange(listener) {
        this.onEvent_("monthChange" /* MonthChange */, listener);
      }
      offMonthChange(listener = null) {
        this.offEvent_("monthChange" /* MonthChange */, listener);
      }
      // Callback to be called just before the day is focused or blurred.
      // An Event instance, a TheDatepicker.Day instance (or null when blurred) and previous focused day TheDatepicker.Day instance (or null when nothing focused before) are given on input.
      // If callback returns false, focus stops and nothing will be focused / blurred.
      onBeforeFocus(listener) {
        this.onEvent_("beforeFocus" /* BeforeFocus */, listener);
      }
      offBeforeFocus(listener = null) {
        this.offEvent_("beforeFocus" /* BeforeFocus */, listener);
      }
      // Callback to be called immediately after the day is focused or blurred.
      // An Event instance, a TheDatepicker.Day instance (or null when blurred) and previous focused day TheDatepicker.Day instance (or null when nothing focused before) are given on input.
      onFocus(listener) {
        this.onEvent_("focus" /* Focus */, listener);
      }
      offFocus(listener = null) {
        this.offEvent_("focus" /* Focus */, listener);
      }
      getInitialMonth() {
        const primarySource = this.initialDatePriority_ ? this.initialDate_ : this.initialMonth_;
        const secondarySource = this.initialDatePriority_ ? this.initialMonth_ : this.initialDate_;
        const initialMonth = primarySource ? new Date(primarySource.getTime()) : secondarySource ? new Date(secondarySource.getTime()) : this.getToday();
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
          return date && this.isDateInValidity(date) && this.isDateAvailable(date) ? new Date(date.getTime()) : null;
        }
        date = date ? new Date(date.getTime()) : this.getToday();
        date = this.findNearestAvailableDate(date);
        if (date) {
          return date;
        }
        throw new AvailableDateNotFoundException();
      }
      findNearestAvailableDate(date) {
        return this.calculateNearestAvailableDate_(date);
      }
      calculateNearestAvailableDate_(date, minDate = null, maxDate = null) {
        date = this.correctDate_(date);
        const defaultMinDate = this.getMinDate_().getTime();
        const defaultMaxDate = this.getMaxDate_().getTime();
        const minTimestamp = minDate ? Math.max(defaultMinDate, minDate.getTime()) : defaultMinDate;
        const maxTimestamp = maxDate ? Math.min(defaultMaxDate, maxDate.getTime()) : defaultMaxDate;
        if (this.isDateAvailable(date)) {
          const timestamp = date.getTime();
          return timestamp >= minTimestamp && timestamp <= maxTimestamp ? date : null;
        }
        let maxLoops = 1e3;
        let increasedDate = date;
        let decreasedDate = new Date(date.getTime());
        do {
          if (increasedDate) {
            increasedDate.setDate(increasedDate.getDate() + 1);
            if (increasedDate.getTime() > maxTimestamp) {
              increasedDate = null;
            } else if (this.isDateAvailable(increasedDate)) {
              return increasedDate;
            }
          }
          if (decreasedDate) {
            decreasedDate.setDate(decreasedDate.getDate() - 1);
            if (decreasedDate.getTime() < minTimestamp) {
              decreasedDate = null;
            } else if (this.isDateAvailable(decreasedDate)) {
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
      isSelectedDateBoundWithMonth() {
        return this.bindSelectedDateWithMonth_;
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
        TheDatepicker2.Helper_.warnDeprecatedUsage_("isMonthChangeAnimated", ["isSlideAnimationEnabled"]);
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
        return day.dayNumber + "";
      }
      prefixClass_(name) {
        return this.classesPrefix_ + name;
      }
      getCellStructure_() {
        if (this.cellContentStructureResolver_) {
          return this.cellContentStructureResolver_.init();
        }
        return TheDatepicker2.HtmlHelper_.createSpan_();
      }
      updateCellStructure_(element, day) {
        if (this.cellContentStructureResolver_) {
          this.cellContentStructureResolver_.update(element, day);
        } else {
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
          if (typeof classes === "string") {
            result.push(classes);
          } else if (typeof classes === "object" && classes.constructor === Array) {
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
      getPosition() {
        return this.position_;
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
        return this.today_ ? new Date(this.today_.getTime()) : TheDatepicker2.Helper_.resetTime_(/* @__PURE__ */ new Date());
      }
      getDateAvailabilityResolver() {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("getDateAvailabilityResolver", ["getDateAvailabilityResolvers"]);
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
        TheDatepicker2.Helper_.warnDeprecatedUsage_("getBeforeOpenAndCloseListeners", ["getBeforeOpenListeners", "getBeforeCloseListeners"]);
        return this.listeners_.beforeOpen.concat(this.listeners_.beforeClose);
      }
      getOpenAndCloseListeners() {
        TheDatepicker2.Helper_.warnDeprecatedUsage_("getOpenAndCloseListeners", ["getOpenListeners", "getCloseListeners"]);
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
          throw new Error("Min date cannot be higher then max date.");
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
        callback = TheDatepicker2.Helper_.checkFunction_(parameterName, callback);
        if (!callback) {
          callbacksList.splice(0, callbacksList.length);
        } else {
          const callbacks = callbacksList.slice(0);
          for (let index = callbacks.length - 1; index >= 0; index--) {
            if (callbacks[index] === callback) {
              callbacksList.splice(index, 1);
            }
          }
        }
      }
      onEvent_(eventType, listener) {
        this.listeners_[eventType].push(TheDatepicker2.Helper_.checkFunction_("Event listener", listener, false));
      }
      offEvent_(eventType, listener) {
        listener = TheDatepicker2.Helper_.checkFunction_("Event listener", listener);
        if (!listener) {
          this.listeners_[eventType] = [];
        } else {
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
    TheDatepicker2.Options = Options;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
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
        this.isWeekend = this.dayOfWeek === 6 /* Saturday */ || this.dayOfWeek === 0 /* Sunday */;
        this.createDay_ = createDay;
        this.formatDate_ = formatDate;
      }
      getDate() {
        return new Date(this.year, this.month - 1, this.dayNumber, 0, 0, 0, 0);
      }
      getFormatted() {
        return this.year + "-" + ("0" + this.month).slice(-2) + "-" + ("0" + this.dayNumber).slice(-2);
      }
      getInputFormatted(format = null) {
        return this.formatDate_(this.getDate(), TheDatepicker2.Helper_.checkString_("Format", format));
      }
      isEqualToDate(date) {
        return TheDatepicker2.Helper_.isValidDate_(date) && this.dayNumber === date.getDate() && this.month === date.getMonth() + 1 && this.year === date.getFullYear();
      }
      isEqualToDay(day) {
        return day instanceof Day && this.dayNumber === day.dayNumber && this.month === day.month && this.year === day.year;
      }
      getSibling(shift = 1) {
        const date = this.getDate();
        date.setDate(date.getDate() + TheDatepicker2.Helper_.checkNumber_("Shift", shift));
        return this.createDay_(date);
      }
    }
    TheDatepicker2.Day = Day;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    let ClassNameType;
    ((ClassNameType2) => {
      ClassNameType2[ClassNameType2["Container"] = 0] = "Container";
      ClassNameType2[ClassNameType2["ContainerOver"] = 1] = "ContainerOver";
      ClassNameType2[ClassNameType2["ContainerLeft"] = 2] = "ContainerLeft";
      ClassNameType2[ClassNameType2["ContainerResponsive"] = 3] = "ContainerResponsive";
      ClassNameType2[ClassNameType2["Main"] = 4] = "Main";
      ClassNameType2[ClassNameType2["Body"] = 5] = "Body";
      ClassNameType2[ClassNameType2["BodySwipeable"] = 6] = "BodySwipeable";
      ClassNameType2[ClassNameType2["Tables"] = 7] = "Tables";
      ClassNameType2[ClassNameType2["Header"] = 8] = "Header";
      ClassNameType2[ClassNameType2["HeaderTop"] = 9] = "HeaderTop";
      ClassNameType2[ClassNameType2["HeaderControl"] = 10] = "HeaderControl";
      ClassNameType2[ClassNameType2["HeaderNavigation"] = 11] = "HeaderNavigation";
      ClassNameType2[ClassNameType2["HeaderState"] = 12] = "HeaderState";
      ClassNameType2[ClassNameType2["HeaderMonth"] = 13] = "HeaderMonth";
      ClassNameType2[ClassNameType2["HeaderYear"] = 14] = "HeaderYear";
      ClassNameType2[ClassNameType2["HeaderMonthYear"] = 15] = "HeaderMonthYear";
      ClassNameType2[ClassNameType2["HeaderYearsToggle"] = 16] = "HeaderYearsToggle";
      ClassNameType2[ClassNameType2["Button"] = 17] = "Button";
      ClassNameType2[ClassNameType2["ButtonContent"] = 18] = "ButtonContent";
      ClassNameType2[ClassNameType2["SelectInput"] = 19] = "SelectInput";
      ClassNameType2[ClassNameType2["Deselect"] = 20] = "Deselect";
      ClassNameType2[ClassNameType2["DeselectButton"] = 21] = "DeselectButton";
      ClassNameType2[ClassNameType2["HeaderTitle"] = 22] = "HeaderTitle";
      ClassNameType2[ClassNameType2["HeaderTitleContent"] = 23] = "HeaderTitleContent";
      ClassNameType2[ClassNameType2["Reset"] = 24] = "Reset";
      ClassNameType2[ClassNameType2["Close"] = 25] = "Close";
      ClassNameType2[ClassNameType2["Go"] = 26] = "Go";
      ClassNameType2[ClassNameType2["GoNext"] = 27] = "GoNext";
      ClassNameType2[ClassNameType2["GoPrevious"] = 28] = "GoPrevious";
      ClassNameType2[ClassNameType2["Table"] = 29] = "Table";
      ClassNameType2[ClassNameType2["TableRow"] = 30] = "TableRow";
      ClassNameType2[ClassNameType2["TableCell"] = 31] = "TableCell";
      ClassNameType2[ClassNameType2["TableCellUnavailable"] = 32] = "TableCellUnavailable";
      ClassNameType2[ClassNameType2["TableCellHighlighted"] = 33] = "TableCellHighlighted";
      ClassNameType2[ClassNameType2["TableCellSelected"] = 34] = "TableCellSelected";
      ClassNameType2[ClassNameType2["CalendarTable"] = 35] = "CalendarTable";
      ClassNameType2[ClassNameType2["CalendarTableHeader"] = 36] = "CalendarTableHeader";
      ClassNameType2[ClassNameType2["CalendarTableHeaderCell"] = 37] = "CalendarTableHeaderCell";
      ClassNameType2[ClassNameType2["CalendarTableBody"] = 38] = "CalendarTableBody";
      ClassNameType2[ClassNameType2["YearsTable"] = 39] = "YearsTable";
      ClassNameType2[ClassNameType2["YearsTableBody"] = 40] = "YearsTableBody";
      ClassNameType2[ClassNameType2["WeekDayWeekend"] = 41] = "WeekDayWeekend";
      ClassNameType2[ClassNameType2["Day"] = 42] = "Day";
      ClassNameType2[ClassNameType2["DayToday"] = 43] = "DayToday";
      ClassNameType2[ClassNameType2["DayPast"] = 44] = "DayPast";
      ClassNameType2[ClassNameType2["DayWeekend"] = 45] = "DayWeekend";
      ClassNameType2[ClassNameType2["DayUnavailable"] = 46] = "DayUnavailable";
      ClassNameType2[ClassNameType2["DayOutside"] = 47] = "DayOutside";
      ClassNameType2[ClassNameType2["DayHighlighted"] = 48] = "DayHighlighted";
      ClassNameType2[ClassNameType2["DaySelected"] = 49] = "DaySelected";
      ClassNameType2[ClassNameType2["DayButton"] = 50] = "DayButton";
      ClassNameType2[ClassNameType2["DayButtonContent"] = 51] = "DayButtonContent";
      ClassNameType2[ClassNameType2["YearCellButton"] = 52] = "YearCellButton";
      ClassNameType2[ClassNameType2["YearCellButtonContent"] = 53] = "YearCellButtonContent";
      ClassNameType2[ClassNameType2["Animated"] = 54] = "Animated";
      ClassNameType2[ClassNameType2["AnimateFadeOutLeft"] = 55] = "AnimateFadeOutLeft";
      ClassNameType2[ClassNameType2["AnimateFadeInRight"] = 56] = "AnimateFadeInRight";
      ClassNameType2[ClassNameType2["AnimateFadeOutUp"] = 57] = "AnimateFadeOutUp";
      ClassNameType2[ClassNameType2["AnimateFadeInDown"] = 58] = "AnimateFadeInDown";
      ClassNameType2[ClassNameType2["AnimateFadeOutRight"] = 59] = "AnimateFadeOutRight";
      ClassNameType2[ClassNameType2["AnimateFadeInLeft"] = 60] = "AnimateFadeInLeft";
      ClassNameType2[ClassNameType2["AnimateFadeOutDown"] = 61] = "AnimateFadeOutDown";
      ClassNameType2[ClassNameType2["AnimateFadeInUp"] = 62] = "AnimateFadeInUp";
      ClassNameType2[ClassNameType2["ContainerDarkMode"] = 63] = "ContainerDarkMode";
      ClassNameType2[ClassNameType2["MainDarkMode"] = 64] = "MainDarkMode";
    })(ClassNameType = TheDatepicker2.ClassNameType || (TheDatepicker2.ClassNameType = {}));
    class ClassNames {
      constructor() {
        this.classNames_ = [
          ["container"],
          // Container
          ["container--over"],
          // ContainerOver
          ["container--left"],
          // ContainerLeft
          ["container--responsive"],
          // ContainerResponsive
          ["main"],
          // Main
          ["body"],
          // Body
          ["body--swipeable"],
          // BodySwipeable
          ["tables"],
          // Tables
          ["header"],
          // Header
          ["top"],
          // HeaderTop
          ["control"],
          // HeaderControl
          ["navigation"],
          // HeaderNavigation
          ["state"],
          // HeaderState
          ["month"],
          // HeaderMonth
          ["year"],
          // HeaderYear
          ["month-year"],
          // HeaderMonthYear
          ["year-button"],
          // HeaderYearsToggle
          ["button"],
          // Button
          ["button-content"],
          // ButtonContent
          ["select"],
          // SelectInput
          ["deselect"],
          // Deselect
          ["deselect-button"],
          // DeselectButton
          ["title"],
          // HeaderTitle
          ["title-content"],
          // HeaderTitleContent
          ["reset"],
          // Reset
          ["close"],
          // Close
          ["go"],
          // Go
          ["go-next"],
          // GoNext
          ["go-previous"],
          // GoPrevious
          ["table"],
          // Table
          ["row"],
          // TableRow
          ["cell"],
          // TableCell
          ["cell--unavailable"],
          // TableCellUnavailable
          ["cell--highlighted"],
          // TableCellHighlighted
          ["cell--selected"],
          // TableCellSelected
          ["calendar"],
          // CalendarTable
          ["calendar-header"],
          // CalendarTableHeader
          ["week-day"],
          // CalendarTableHeaderCell
          ["calendar-body"],
          // CalendarTableBody
          ["years"],
          // YearsTable
          ["years-body"],
          // YearsTableBody
          ["week-day--weekend"],
          // WeekDayWeekend
          ["day"],
          // Day
          ["day--today"],
          // DayToday
          ["day--past"],
          // DayPast
          ["day--weekend"],
          // DayWeekend
          ["day--unavailable"],
          // DayUnavailable
          ["day--outside"],
          // DayOutside
          ["day--highlighted"],
          // DayHighlighted
          ["day--selected"],
          // DaySelected
          ["day--button"],
          // DayButton
          ["day-content"],
          // DayButtonContent
          ["year-cell-button"],
          // YearCellButton
          ["year-cell-content"],
          // YearCellButtonContent
          ["animated"],
          // Animated
          ["fade-out-left"],
          // AnimateFadeOutLeft
          ["fade-in-right"],
          // AnimateFadeInRight
          ["fade-out-up"],
          // AnimateFadeOutUp
          ["fade-in-down"],
          // AnimateFadeInDown
          ["fade-out-right"],
          // AnimateFadeOutRight
          ["fade-in-left"],
          // AnimateFadeInLeft
          ["fade-out-down"],
          // AnimateFadeOutDown
          ["fade-in-up"],
          // AnimateFadeInUp
          ["container--darkmode"],
          // ContainerDarkMode
          ["main--darkmode"]
          // MainDarkMode
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
        if (type === 63 /* ContainerDarkMode */) {
          TheDatepicker2.Helper_.warnDeprecatedUsage_("ClassNameType.ContainerDarkMode", ["ClassNameType.MainDarkMode"]);
          this.setClassName(64 /* MainDarkMode */, className);
        }
        this.classNames_[this.checkType_(type)] = this.normalizeClassName_(className);
      }
      addClassName(type, className) {
        this.classNames_[this.checkType_(type)].concat(this.normalizeClassName_(className));
      }
      getClassName(type) {
        return this.classNames_[type].slice(0);
      }
      checkType_(type) {
        return TheDatepicker2.Helper_.checkNumber_("Class name type", type, 0, this.classNames_.length - 1);
      }
      normalizeClassName_(className) {
        const parameterName = "Class name";
        if (typeof className !== "object" || className.constructor !== Array) {
          className = TheDatepicker2.Helper_.checkString_(parameterName, className).split(/\s+/);
        }
        const result = [];
        for (let index = 0; index < className.length; index++) {
          const name = TheDatepicker2.Helper_.checkString_(parameterName, className[index]);
          if (name) {
            result.push(name);
          }
        }
        return result;
      }
    }
    TheDatepicker2.ClassNames = ClassNames;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    class HtmlHelper_ {
      static createDiv_(type, options) {
        const div = document.createElement("div");
        HtmlHelper_.addClass_(div, type, options);
        return div;
      }
      static createAnchor_(onClick, options, type = 17 /* Button */) {
        const anchor = document.createElement("a");
        HtmlHelper_.addClass_(anchor, type, options);
        anchor.href = "#";
        anchor.onclick = (event) => {
          event = event || window.event;
          TheDatepicker2.Helper_.preventDefault_(event);
          onClick(event);
        };
        anchor.onkeydown = (event) => {
          event = event || window.event;
          if (TheDatepicker2.Helper_.inArray_([13 /* Enter */, 32 /* Space */], event.keyCode)) {
            TheDatepicker2.Helper_.preventDefault_(event);
            onClick(event);
          }
        };
        return anchor;
      }
      static createSpan_() {
        return document.createElement("span");
      }
      static createTable_(header, body, type, options) {
        const table = document.createElement("table");
        HtmlHelper_.addClass_(table, type, options);
        if (header) {
          table.appendChild(header);
        }
        table.appendChild(body);
        return table;
      }
      static createTableHeader_(cells, type, options) {
        const tableHeader = document.createElement("thead");
        HtmlHelper_.addClass_(tableHeader, type, options);
        const row = document.createElement("tr");
        for (let index = 0; index < cells.length; index++) {
          row.appendChild(cells[index]);
        }
        tableHeader.appendChild(row);
        return tableHeader;
      }
      static createTableHeaderCell_(type, options) {
        const cell = document.createElement("th");
        cell.scope = "col";
        HtmlHelper_.addClass_(cell, type, options);
        return cell;
      }
      static createTableBody_(rows, type, options) {
        const tableBody = document.createElement("tbody");
        HtmlHelper_.addClass_(tableBody, type, options);
        for (let index = 0; index < rows.length; index++) {
          tableBody.appendChild(rows[index]);
        }
        return tableBody;
      }
      static createTableRow_(cells, options) {
        const row = document.createElement("tr");
        HtmlHelper_.addClass_(row, 30 /* TableRow */, options);
        for (let index = 0; index < cells.length; index++) {
          row.appendChild(cells[index]);
        }
        return row;
      }
      static createTableCell_() {
        return document.createElement("td");
      }
      static createSelectInput_(selectOptions, onChange, options) {
        const input = document.createElement("select");
        HtmlHelper_.addClass_(input, 19 /* SelectInput */, options);
        for (let index = 0; index < selectOptions.length; index++) {
          input.appendChild(HtmlHelper_.createSelectOption_(selectOptions[index].value, selectOptions[index].label));
        }
        input.onchange = (event) => {
          onChange(event || window.event, input.value);
        };
        input.onkeydown = (event) => {
          event = event || window.event;
          TheDatepicker2.Helper_.stopPropagation_(event);
        };
        return input;
      }
      static createSelectOption_(value, label) {
        const option = document.createElement("option");
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
        element.className += (element.className ? " " : "") + classNames.join(" ");
      }
      static appendChild_(element, child) {
        if (child) {
          element.appendChild(child);
        }
      }
    }
    TheDatepicker2.HtmlHelper_ = HtmlHelper_;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    let MoveDirection_;
    ((MoveDirection_2) => {
      MoveDirection_2[MoveDirection_2["Left"] = 1] = "Left";
      MoveDirection_2[MoveDirection_2["Up"] = 2] = "Up";
      MoveDirection_2[MoveDirection_2["Right"] = 3] = "Right";
      MoveDirection_2[MoveDirection_2["Down"] = 4] = "Down";
    })(MoveDirection_ = TheDatepicker2.MoveDirection_ || (TheDatepicker2.MoveDirection_ = {}));
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
        this.template_ = new TheDatepicker2.Template_(this.options_, datepicker_.container, !!datepicker_.input);
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
            columnsCount: this.options_.getTableOfYearsColumnsCount()
          };
        }
        this.template_.render_(this);
        this.datepicker_.updateInput_();
      }
      setActive_(event, value) {
        if (this.active_ === value) {
          return true;
        }
        if (value && !this.triggerOnBeforeOpen_(event) || !value && !this.triggerOnBeforeClose_(event)) {
          return false;
        }
        this.active_ = value;
        if ((!value && !this.setYearSelectionActive_(false) || value) && this.options_.isHiddenOnBlur()) {
          this.render_();
        }
        if (value) {
          this.triggerOnOpen_(event);
        } else {
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
        if (!TheDatepicker2.Helper_.isValidDate_(month)) {
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
        month = TheDatepicker2.Helper_.resetTime_(new Date(month.getTime()));
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
        if (this.selectedDate_ && this.options_.isSelectedDateBoundWithMonth()) {
          const maxDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
          const date = this.options_.calculateNearestAvailableDate_(
            new Date(month.getFullYear(), month.getMonth(), Math.min(this.selectedDate_.getDate(), maxDate.getDate())),
            month,
            maxDate
          );
          if (date) {
            this.selectDay_(event, date);
          }
        }
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
        if (date instanceof TheDatepicker2.Day) {
          day = date;
          date = day.getDate();
        } else {
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
        doUpdateMonth = doUpdateMonth || this.options_.isSelectedDateBoundWithMonth();
        if (!doUpdateMonth || !this.goToMonth_(event, date)) {
          this.render_();
        }
        this.triggerOnSelect_(event, day, previousDay);
        return true;
      }
      canSetYearSelectionActive_(value) {
        return !!this.yearSelectionState_ !== value && (!value || this.options_.getMinDate_().getFullYear() !== this.options_.getMaxDate_().getFullYear());
      }
      setYearSelectionActive_(value) {
        if (this.canSetYearSelectionActive_(value)) {
          this.yearSelectionState_ = value ? this.createYearSelectionState_() : null;
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
        } catch (error) {
          if (!(error instanceof TheDatepicker2.AvailableDateNotFoundException)) {
            throw error;
          }
          return this.cancelSelection_(null, true);
        }
      }
      selectInitialDate_(event) {
        try {
          return this.selectDay_(event, this.options_.getInitialDate(), false);
        } catch (error) {
          if (!(error instanceof TheDatepicker2.AvailableDateNotFoundException)) {
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
          case 1 /* Left */:
            shift = -1;
            break;
          case 2 /* Up */:
            shift = -7;
            break;
          case 3 /* Right */:
            shift = 1;
            break;
          case 4 /* Down */:
            shift = 7;
            break;
        }
        let newDay = day;
        let maxLoops = 1e3;
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
          case 1 /* Left */:
            shift = -1;
            break;
          case 2 /* Up */:
            shift = -this.tableOfYearsSettings_.columnsCount;
            break;
          case 3 /* Right */:
            shift = 1;
            break;
          case 4 /* Down */:
            shift = this.tableOfYearsSettings_.columnsCount;
            break;
        }
        const newYear = year + shift;
        if (newYear < this.options_.getMinDate_().getFullYear() || newYear > this.options_.getMaxDate_().getFullYear()) {
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
          const yearCellData = new TheDatepicker2.YearCellData_(year);
          if (year > maxYear || year < minYear) {
            yearCellData.isAvailable = false;
          } else {
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
        if (align === 1 /* Left */ && minDate === null || align === 2 /* Right */ && maxDate === null) {
          align = null;
        }
        if (!align) {
          if (minDate && maxDate) {
            const lowDiff = initialYear - minDate.getFullYear();
            const highDiff = maxDate.getFullYear() - initialYear;
            align = lowDiff > highDiff ? 2 /* Right */ : 1 /* Left */;
          } else if (minDate) {
            align = 1 /* Left */;
          } else if (maxDate) {
            align = 2 /* Right */;
          } else {
            align = 3 /* Center */;
          }
        }
        let lowestYear;
        const cellsCount = this.tableOfYearsSettings_.rowsCount * this.tableOfYearsSettings_.columnsCount;
        const minYear = this.options_.getMinDate_().getFullYear();
        const maxYear = this.options_.getMaxDate_().getFullYear();
        switch (align) {
          case 1 /* Left */:
            lowestYear = minYear;
            break;
          case 2 /* Right */:
            lowestYear = minYear - (cellsCount - (maxYear - minYear) % cellsCount - 1);
            break;
          case 3 /* Center */:
            const shift = Math.floor(this.tableOfYearsSettings_.rowsCount / 2) * this.tableOfYearsSettings_.columnsCount + Math.floor(this.tableOfYearsSettings_.columnsCount / 2);
            lowestYear = minYear - (cellsCount - (initialYear + shift - minYear) % cellsCount - 1);
            break;
          default:
            throw new Error("Invalid align: " + align);
        }
        const currentYear = this.getCurrentMonth_().getFullYear();
        const page = Math.floor((currentYear - lowestYear) / cellsCount);
        return new YearSelectionState(
          cellsCount,
          lowestYear,
          Math.floor((maxYear - lowestYear) / cellsCount),
          page
        );
      }
      triggerKeyPress_(event) {
        if (TheDatepicker2.Helper_.inArray_([37 /* Left */, 38 /* Up */, 39 /* Right */, 40 /* Down */], event.keyCode)) {
          TheDatepicker2.Helper_.preventDefault_(event);
          const moveDirection = this.translateKeyCodeToMoveDirection_(event.keyCode);
          if (this.yearSelectionState_) {
            if (this.yearSelectionState_.highlightedYear) {
              this.highlightSiblingYear_(this.yearSelectionState_.highlightedYear, moveDirection);
            } else if (this.yearSelectionState_.getPage() === this.yearSelectionState_.initialPage) {
              this.highlightSiblingYear_(this.getCurrentMonth_().getFullYear(), moveDirection);
            } else {
              this.highlightYear_(this.yearSelectionState_.getPage() === 0 ? this.yearSelectionState_.lowestYear : this.yearSelectionState_.getFirstYear());
            }
          } else {
            if (this.highlightedDay_) {
              this.highlightSiblingDay_(event, this.highlightedDay_, moveDirection);
            } else if (this.selectedDate_ && this.selectedDate_.getFullYear() === this.getCurrentMonth_().getFullYear() && this.selectedDate_.getMonth() === this.getCurrentMonth_().getMonth()) {
              this.highlightSiblingDay_(event, this.createDay_(this.selectedDate_), moveDirection);
            } else {
              this.highlightFirstAvailableDay_(event);
            }
          }
        } else if (event.keyCode === 27 /* Esc */ && this.options_.isClosedOnEscPress()) {
          if (this.yearSelectionState_) {
            this.isYearSelectionToggleButtonFocused_ = true;
            this.setYearSelectionActive_(false);
          } else {
            this.datepicker_.close(event);
          }
        }
      }
      createDay_(date) {
        date = TheDatepicker2.Helper_.resetTime_(new Date(date.getTime()));
        const today = this.options_.getToday();
        const currentMonth = this.getCurrentMonth_();
        const day = new TheDatepicker2.Day(date, (date2) => {
          return this.createDay_(date2);
        }, (date2, format = null) => {
          return TheDatepicker2.DateConverter_.formatDate_(date2, this.options_, format);
        });
        day.isToday = date.getTime() === today.getTime();
        day.isPast = date.getTime() < today.getTime();
        day.isInValidity = this.options_.isDateInValidity(date);
        day.isAvailable = day.isInValidity && this.options_.isDateAvailable(date);
        day.isInCurrentMonth = date.getMonth() === currentMonth.getMonth();
        if (day.isInCurrentMonth) {
          day.isVisible = true;
        } else if (this.options_.areDaysOutOfMonthVisible()) {
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
        return this.options_.triggerEvent_("beforeSelect" /* BeforeSelect */, (listener) => {
          return listener.call(this.datepicker_, event, day, previousDay);
        });
      }
      triggerOnSelect_(event, day, previousDay) {
        this.options_.triggerEvent_("select" /* Select */, (listener) => {
          return listener.call(this.datepicker_, event, day, previousDay);
        });
      }
      triggerOnBeforeOpen_(event) {
        return this.options_.triggerEvent_("beforeOpen" /* BeforeOpen */, (listener) => {
          return listener.call(this.datepicker_, event, true);
        });
      }
      triggerOnOpen_(event) {
        this.options_.triggerEvent_("open" /* Open */, (listener) => {
          return listener.call(this.datepicker_, event, true);
        });
      }
      triggerOnBeforeClose_(event) {
        return this.options_.triggerEvent_("beforeClose" /* BeforeClose */, (listener) => {
          return listener.call(this.datepicker_, event, false);
        });
      }
      triggerOnClose_(event) {
        this.options_.triggerEvent_("close" /* Close */, (listener) => {
          return listener.call(this.datepicker_, event, false);
        });
      }
      triggerOnBeforeMonthChange_(event, month, previousMonth) {
        return this.options_.triggerEvent_("beforeMonthChange" /* BeforeMonthChange */, (listener) => {
          return listener.call(this.datepicker_, event, month, previousMonth);
        });
      }
      triggerOnMonthChange_(event, month, previousMonth) {
        this.options_.triggerEvent_("monthChange" /* MonthChange */, (listener) => {
          return listener.call(this.datepicker_, event, month, previousMonth);
        });
      }
      triggerOnBeforeFocus_(event, day, previousDay) {
        return this.options_.triggerEvent_("beforeFocus" /* BeforeFocus */, (listener) => {
          return listener.call(this.datepicker_, event, day, previousDay);
        });
      }
      triggerOnFocus_(event, day, previousDay) {
        this.options_.triggerEvent_("focus" /* Focus */, (listener) => {
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
        const lastMonthDaysCount = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
        const prependDaysCount = (firstDateOfMonth.getDay() - firstDayOfWeek + 7) % 7;
        const prepend = [];
        for (let date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
          prepend.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
        }
        const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const appendDaysCount = 6 - (lastDateOfMonth.getDay() - firstDayOfWeek + 7) % 7;
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
          prepend,
          append
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
          case 37 /* Left */:
            return 1 /* Left */;
          case 38 /* Up */:
            return 2 /* Up */;
          case 39 /* Right */:
            return 3 /* Right */;
          case 40 /* Down */:
            return 4 /* Down */;
          default:
            throw new Error("Invalid key code: " + key);
        }
      }
    }
    TheDatepicker2.ViewModel_ = ViewModel_;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    class YearCellData_ {
      constructor(yearNumber) {
        this.yearNumber = yearNumber;
        this.isAvailable = true;
        this.isSelected = false;
        this.isHighlighted = false;
        this.isFocused = false;
      }
    }
    TheDatepicker2.YearCellData_ = YearCellData_;
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
          this.container_.innerHTML = "";
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
        const main = TheDatepicker2.HtmlHelper_.createDiv_(4 /* Main */, this.options_);
        TheDatepicker2.HtmlHelper_.appendChild_(main, this.options_.getHeaderStructure_());
        main.appendChild(this.createHeaderElement_(viewModel));
        main.appendChild(this.createBodyElement_(viewModel));
        TheDatepicker2.HtmlHelper_.appendChild_(main, this.options_.getFooterStructure_());
        this.mainElement_ = main;
        return main;
      }
      updateMainElement_(viewModel) {
        this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? "" : "none";
        this.mainElement_.className = "";
        TheDatepicker2.HtmlHelper_.addClass_(this.mainElement_, 4 /* Main */, this.options_);
        if (this.options_.isDarkModeEnabled()) {
          TheDatepicker2.HtmlHelper_.addClass_(this.mainElement_, 64 /* MainDarkMode */, this.options_);
        }
      }
      updateTableElements_(viewModel) {
        this.tableElement_.style.display = viewModel.yearSelectionState_ ? "none" : "";
        if (this.tableOfYearsElement_) {
          this.tableOfYearsElement_.style.display = viewModel.yearSelectionState_ ? "" : "none";
        }
      }
      createBodyElement_(viewModel) {
        const body = TheDatepicker2.HtmlHelper_.createDiv_(5 /* Body */, this.options_);
        const tables = TheDatepicker2.HtmlHelper_.createDiv_(7 /* Tables */, this.options_);
        body.appendChild(tables);
        if (this.options_.isMonthChangeOnSwipeEnabled() || this.options_.isTableOfYearsOnSwipeDownEnabled()) {
          TheDatepicker2.HtmlHelper_.addClass_(body, 6 /* BodySwipeable */, this.options_);
          TheDatepicker2.Helper_.addSwipeListener_(body, (event, moveDirection) => {
            let isForward = false;
            let change = null;
            switch (moveDirection) {
              case 4 /* Down */:
                isForward = true;
              // noinspection FallThroughInSwitchStatementJS
              case 2 /* Up */:
                if (this.tableOfYearsElement_ && this.options_.isTableOfYearsOnSwipeDownEnabled() && viewModel.canSetYearSelectionActive_(isForward)) {
                  change = () => {
                    viewModel.setYearSelectionActive_(isForward);
                  };
                }
                break;
              case 1 /* Left */:
                isForward = true;
              // noinspection FallThroughInSwitchStatementJS
              case 3 /* Right */:
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
        const header = TheDatepicker2.HtmlHelper_.createDiv_(8 /* Header */, this.options_);
        const top = TheDatepicker2.HtmlHelper_.createDiv_(9 /* HeaderTop */, this.options_);
        header.appendChild(top);
        top.appendChild(this.createTitleElement_(viewModel));
        const control = TheDatepicker2.HtmlHelper_.createDiv_(10 /* HeaderControl */, this.options_);
        top.appendChild(control);
        control.appendChild(this.createResetElement_(viewModel));
        control.appendChild(this.createCloseElement_(viewModel));
        const navigation = TheDatepicker2.HtmlHelper_.createDiv_(11 /* HeaderNavigation */, this.options_);
        header.appendChild(navigation);
        navigation.appendChild(this.createGoElement_(viewModel, false));
        const state = TheDatepicker2.HtmlHelper_.createDiv_(12 /* HeaderState */, this.options_);
        navigation.appendChild(state);
        if (this.options_.isMonthAndYearSeparated()) {
          state.appendChild(this.createMonthElement_(viewModel));
          state.appendChild(this.createYearElement_(viewModel));
        } else {
          state.appendChild(this.createMonthAndYearElement_(viewModel));
        }
        navigation.appendChild(this.createGoElement_(viewModel, true));
        this.controlElement_ = control;
        return header;
      }
      updateTopElement_(viewModel) {
        const isVisible = this.options_.getTitle() !== "" || this.options_.isResetButtonShown() || this.hasInput_ && this.options_.isCloseButtonShown();
        this.controlElement_.style.display = isVisible ? "" : "none";
        this.titleElement_.style.display = isVisible ? "" : "none";
      }
      createTitleElement_(viewModel) {
        const titleElement = TheDatepicker2.HtmlHelper_.createDiv_(22 /* HeaderTitle */, this.options_);
        const titleContent = TheDatepicker2.HtmlHelper_.createSpan_();
        titleElement.appendChild(titleContent);
        TheDatepicker2.HtmlHelper_.addClass_(titleContent, 23 /* HeaderTitleContent */, this.options_);
        this.titleElement_ = titleElement;
        this.titleContentElement_ = titleContent;
        return titleElement;
      }
      updateTitleElement_(viewModel) {
        const title = this.options_.getTitle();
        this.titleContentElement_.style.display = title !== "" ? "" : "none";
        this.titleContentElement_.innerText = title;
      }
      createResetElement_(viewModel) {
        const resetElement = TheDatepicker2.HtmlHelper_.createDiv_(24 /* Reset */, this.options_);
        const resetButton = TheDatepicker2.HtmlHelper_.createAnchor_((event) => {
          viewModel.reset_(event);
        }, this.options_);
        resetButton.innerHTML = this.options_.getResetHtml();
        resetElement.appendChild(resetButton);
        this.resetButton_ = resetButton;
        this.resetElement_ = resetElement;
        return resetElement;
      }
      updateResetElement_(viewModel) {
        this.resetElement_.style.display = this.options_.isResetButtonShown() ? "" : "none";
        this.updateTitle_(this.resetButton_, 3 /* Reset */);
      }
      createCloseElement_(viewModel) {
        const closeElement = TheDatepicker2.HtmlHelper_.createDiv_(25 /* Close */, this.options_);
        const closeButton = TheDatepicker2.HtmlHelper_.createAnchor_((event) => {
          viewModel.close_(event);
        }, this.options_);
        closeButton.innerHTML = this.options_.getCloseHtml();
        closeElement.appendChild(closeButton);
        this.closeButton_ = closeButton;
        this.closeElement_ = closeElement;
        return closeElement;
      }
      updateCloseElement_(viewModel) {
        this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? "" : "none";
        this.updateTitle_(this.closeButton_, 2 /* Close */);
      }
      createGoElement_(viewModel, isForward) {
        const goElement = TheDatepicker2.HtmlHelper_.createDiv_(26 /* Go */, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(goElement, isForward ? 27 /* GoNext */ : 28 /* GoPrevious */, this.options_);
        const goButton = TheDatepicker2.HtmlHelper_.createAnchor_((event) => {
          const moveDirection = isForward ? 1 /* Left */ : 3 /* Right */;
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
        } else {
          this.goBackElement_ = goButton;
        }
        return goElement;
      }
      updateGoElement_(viewModel, isForward) {
        const goElement = isForward ? this.goForwardElement_ : this.goBackElement_;
        goElement.style.visibility = viewModel.canGoDirection_(isForward) ? "visible" : "hidden";
        this.updateTitle_(
          goElement,
          viewModel.yearSelectionState_ ? isForward ? 8 /* GoForwardTableOfYears */ : 7 /* GoBackTableOfYears */ : isForward ? 1 /* GoForward */ : 0 /* GoBack */
        );
      }
      createMonthElement_(viewModel) {
        const options = [];
        for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
          options.push({
            value: monthNumber + "",
            label: this.translateMonth_(monthNumber)
          });
        }
        const selectElement = TheDatepicker2.HtmlHelper_.createSelectInput_(options, (event, monthNumber) => {
          const currentMonth = viewModel.getCurrentMonth_();
          const newMonth = new Date(currentMonth.getTime());
          newMonth.setMonth(parseInt(monthNumber, 10));
          if (!viewModel.goToMonth_(event, newMonth)) {
            this.monthSelect_.value = currentMonth.getMonth() + "";
          }
        }, this.options_);
        const monthElement = TheDatepicker2.HtmlHelper_.createDiv_(13 /* HeaderMonth */, this.options_);
        const monthContent = TheDatepicker2.HtmlHelper_.createSpan_();
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
        this.updateTitle_(this.monthSelect_, 5 /* Month */);
        if (!this.options_.isMonthAsDropdown()) {
          this.monthSelect_.style.display = "none";
          this.monthElement_.style.display = "";
          return;
        }
        let valuesCount = 0;
        for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
          const newMonth = new Date(viewModel.getCurrentMonth_().getTime());
          newMonth.setMonth(monthNumber);
          const option = this.monthSelect_.getElementsByTagName("option")[monthNumber];
          const canGoToMonth = viewModel.canGoToMonth_(newMonth);
          option.disabled = !canGoToMonth;
          option.style.display = canGoToMonth ? "" : "none";
          valuesCount += canGoToMonth ? 1 : 0;
        }
        this.monthSelect_.value = currentMonth + "";
        const showSelect = !this.options_.isDropdownWithOneItemHidden() || valuesCount > 1;
        this.monthSelect_.style.display = showSelect ? "" : "none";
        this.monthElement_.style.display = showSelect ? "none" : "";
      }
      createYearElement_(viewModel) {
        const yearElement = TheDatepicker2.HtmlHelper_.createDiv_(14 /* HeaderYear */, this.options_);
        let yearActiveElement;
        if (this.options_.isYearSelectedFromTableOfYears()) {
          yearActiveElement = TheDatepicker2.HtmlHelper_.createAnchor_(() => {
            this.slideTable_(viewModel, viewModel.yearSelectionState_ ? 2 /* Up */ : 4 /* Down */, () => {
              viewModel.setYearSelectionActive_(!viewModel.yearSelectionState_);
            });
          }, this.options_);
          TheDatepicker2.HtmlHelper_.addClass_(yearActiveElement, 16 /* HeaderYearsToggle */, this.options_);
        } else {
          yearActiveElement = TheDatepicker2.HtmlHelper_.createSelectInput_([], (event, year) => {
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
              this.yearActiveElement_.value = currentMonth.getFullYear() + "";
            }
          }, this.options_);
        }
        const yearTextElement = TheDatepicker2.HtmlHelper_.createSpan_();
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
        this.yearTextElement_.innerText = currentYear + "";
        this.updateTitle_(this.yearActiveElement_, 6 /* Year */);
        const minYear = this.options_.getMinDate_().getFullYear();
        const maxYear = this.options_.getMaxDate_().getFullYear();
        if (this.tableOfYearsElement_) {
          this.yearActiveElement_.innerText = currentYear + "";
          if (viewModel.isYearSelectionToggleButtonFocused_) {
            this.yearActiveElement_.focus();
            viewModel.isYearSelectionToggleButtonFocused_ = false;
          }
        } else if (this.options_.isYearAsDropdown()) {
          const range = this.calculateDropdownRange_(currentYear, minYear, maxYear);
          const options = this.yearActiveElement_.getElementsByTagName("option");
          const diff = this.calculateDropdownDiff_(options, range, (value) => {
            return parseInt(value, 10);
          });
          for (let index = 0; index < diff.remove.length; index++) {
            this.yearActiveElement_.removeChild(diff.remove[index]);
          }
          for (let index = diff.prepend.length - 1; index >= 0; index--) {
            this.yearActiveElement_.insertBefore(TheDatepicker2.HtmlHelper_.createSelectOption_(diff.prepend[index] + "", diff.prepend[index] + ""), this.yearActiveElement_.firstChild);
          }
          for (let index = 0; index < diff.append.length; index++) {
            this.yearActiveElement_.appendChild(TheDatepicker2.HtmlHelper_.createSelectOption_(diff.append[index] + "", diff.append[index] + ""));
          }
          this.yearActiveElement_.value = currentYear + "";
        } else {
          this.yearActiveElement_.style.display = "none";
          this.yearTextElement_.style.display = "";
          return;
        }
        const showSelect = !this.options_.isDropdownWithOneItemHidden() || minYear !== maxYear;
        this.yearActiveElement_.style.display = showSelect ? "" : "none";
        this.yearTextElement_.style.display = showSelect ? "none" : "";
      }
      createMonthAndYearElement_(viewModel) {
        const monthAndYear = TheDatepicker2.HtmlHelper_.createDiv_(15 /* HeaderMonthYear */, this.options_);
        const selectElement = TheDatepicker2.HtmlHelper_.createSelectInput_([], (event, value) => {
          const currentMonth = viewModel.getCurrentMonth_();
          let newMonth = new Date(currentMonth.getTime());
          const data = this.parseMonthAndYearOptionValue_(value);
          newMonth.setFullYear(data.year);
          newMonth.setMonth(data.month);
          if (!viewModel.goToMonth_(event, newMonth)) {
            this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_({
              month: currentMonth.getMonth(),
              year: currentMonth.getFullYear()
            });
          }
        }, this.options_);
        const monthAndYearContent = TheDatepicker2.HtmlHelper_.createSpan_();
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
          year: currentMonth.getFullYear()
        };
        const currentIndex = this.calculateMonthAndYearIndex_(currentData);
        this.monthAndYearElement_.innerText = this.translateMonthAndYear_(currentData);
        if (!this.options_.isYearAsDropdown() || !this.options_.isMonthAsDropdown()) {
          this.monthAndYearSelect_.style.display = "none";
          this.monthAndYearElement_.style.display = "";
          return;
        }
        const minDate = this.options_.getMinDate_();
        const maxDate = this.options_.getMaxDate_();
        const minIndex = minDate.getFullYear() * 12 + minDate.getMonth();
        const maxIndex = maxDate.getFullYear() * 12 + maxDate.getMonth();
        const range = this.calculateDropdownRange_(currentIndex, minIndex, maxIndex);
        const options = this.monthAndYearSelect_.getElementsByTagName("option");
        const diff = this.calculateDropdownDiff_(options, range, (value) => {
          return this.calculateMonthAndYearIndex_(this.parseMonthAndYearOptionValue_(value));
        });
        for (let index = 0; index < diff.remove.length; index++) {
          this.monthAndYearSelect_.removeChild(diff.remove[index]);
        }
        for (let index = diff.prepend.length - 1; index >= 0; index--) {
          const data = this.getMonthAndYearByIndex_(diff.prepend[index]);
          this.monthAndYearSelect_.insertBefore(TheDatepicker2.HtmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
        }
        for (let index = 0; index < diff.append.length; index++) {
          const data = this.getMonthAndYearByIndex_(diff.append[index]);
          this.monthAndYearSelect_.appendChild(TheDatepicker2.HtmlHelper_.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
        }
        this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);
        const showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
        this.monthAndYearSelect_.style.display = showSelect ? "" : "none";
        this.monthAndYearElement_.style.display = showSelect ? "none" : "";
      }
      translateMonthAndYear_(data) {
        return this.translateMonth_(data.month) + " " + data.year;
      }
      calculateMonthAndYearIndex_(data) {
        return data.year * 12 + data.month;
      }
      getMonthAndYearByIndex_(index) {
        return {
          year: Math.floor(index / 12),
          month: index % 12
        };
      }
      getMonthAndYearOptionValue_(data) {
        return data.year + "-" + data.month;
      }
      parseMonthAndYearOptionValue_(value) {
        const parts = value.split("-");
        return {
          month: parseInt(parts[1], 10),
          year: parseInt(parts[0], 10)
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
        } else if (to > max) {
          from -= to - max;
          if (from < min) {
            from = min;
          }
          to = max;
        }
        return {
          from,
          to
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
          } else if (value > lastOption) {
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
          remove
        };
      }
      createTableElement_(viewModel) {
        const tableHeader = this.createTableHeaderElement_(viewModel);
        const tableBody = this.createTableBodyElement_(viewModel);
        const table = TheDatepicker2.HtmlHelper_.createTable_(tableHeader, tableBody, 35 /* CalendarTable */, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(table, 29 /* Table */, this.options_);
        return table;
      }
      createTableHeaderElement_(viewModel) {
        const weekDays = viewModel.getWeekDays_();
        const cells = [];
        for (let index = 0; index < weekDays.length; index++) {
          const dayOfWeek = weekDays[index];
          cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
        }
        return TheDatepicker2.HtmlHelper_.createTableHeader_(cells, 36 /* CalendarTableHeader */, this.options_);
      }
      createTableHeaderCellElement_(viewModel, dayOfWeek) {
        const headerCell = TheDatepicker2.HtmlHelper_.createTableHeaderCell_(37 /* CalendarTableHeaderCell */, this.options_);
        if (dayOfWeek === 6 /* Saturday */ || dayOfWeek === 0 /* Sunday */) {
          TheDatepicker2.HtmlHelper_.addClass_(headerCell, 41 /* WeekDayWeekend */, this.options_);
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
        return TheDatepicker2.HtmlHelper_.createTableBody_(rows, 38 /* CalendarTableBody */, this.options_);
      }
      updateWeeksElements_(viewModel) {
        if (viewModel.yearSelectionState_) {
          return;
        }
        const weeks = viewModel.getWeeks_();
        for (let weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
          const weekElement = this.weeksElements_[weekIndex];
          const week = weeks.length > weekIndex ? weeks[weekIndex] : null;
          weekElement.style.display = week ? "" : "none";
          if (week) {
            for (let dayIndex = 0; dayIndex < this.daysElements_[weekIndex].length; dayIndex++) {
              this.updateDayElement_(
                viewModel,
                this.daysElements_[weekIndex][dayIndex],
                this.daysButtonsElements_[weekIndex][dayIndex],
                this.daysContentsElements_[weekIndex][dayIndex],
                week[dayIndex]
              );
            }
          }
        }
      }
      createTableRowElement_(viewModel) {
        const cells = [];
        const cellsButtons = [];
        const cellsContents = [];
        for (let index = 0; index < 7; index++) {
          const cell = TheDatepicker2.HtmlHelper_.createTableCell_();
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
        return TheDatepicker2.HtmlHelper_.createTableRow_(cells, this.options_);
      }
      updateDayElement_(viewModel, dayElement, dayButtonElement, dayContentElement, day) {
        dayButtonElement.day = day;
        dayElement.setAttribute("data-date", day.getFormatted());
        dayElement.className = "";
        TheDatepicker2.HtmlHelper_.addClass_(dayElement, 31 /* TableCell */, this.options_);
        this.options_.updateCellStructure_(dayContentElement, day);
        if (!day.isVisible) {
          dayButtonElement.removeAttribute("href");
          dayButtonElement.style.visibility = "hidden";
          return;
        }
        TheDatepicker2.HtmlHelper_.addClass_(dayElement, 42 /* Day */, this.options_);
        if (day.isToday) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 43 /* DayToday */, this.options_);
        }
        if (day.isPast) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 44 /* DayPast */, this.options_);
        }
        if (day.isWeekend) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 45 /* DayWeekend */, this.options_);
        }
        if (!day.isAvailable) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 32 /* TableCellUnavailable */, this.options_);
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 46 /* DayUnavailable */, this.options_);
        }
        if (!day.isInCurrentMonth) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 47 /* DayOutside */, this.options_);
        }
        if (day.isHighlighted) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 33 /* TableCellHighlighted */, this.options_);
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 48 /* DayHighlighted */, this.options_);
        }
        if (day.isSelected) {
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 34 /* TableCellSelected */, this.options_);
          TheDatepicker2.HtmlHelper_.addClass_(dayElement, 49 /* DaySelected */, this.options_);
        }
        const customClasses = this.options_.getCellClasses(day);
        for (let index = 0; index < customClasses.length; index++) {
          dayElement.className += " " + customClasses[index];
        }
        dayButtonElement.style.visibility = "visible";
        if (day.isAvailable) {
          dayButtonElement.href = "#";
        } else {
          dayButtonElement.removeAttribute("href");
        }
        if (day.isFocused) {
          dayButtonElement.focus();
        }
      }
      createTableCellButtonElement_(viewModel) {
        const cellButton = TheDatepicker2.HtmlHelper_.createAnchor_((event) => {
          const previous = viewModel.selectedDate_;
          const isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
          if (this.options_.isHiddenOnSelect() && (isSelected || previous && cellButton.day.isEqualToDate(previous))) {
            viewModel.close_(event);
          }
        }, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(cellButton, 50 /* DayButton */, this.options_);
        cellButton.onfocus = (event) => {
          viewModel.highlightDay_(event || window.event, cellButton.day);
        };
        cellButton.onmouseenter = (event) => {
          if (this.options_.getBeforeFocusListeners().length > 0 || this.options_.getFocusListeners().length > 0) {
            viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
          } else {
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
        TheDatepicker2.HtmlHelper_.addClass_(cellContent, 18 /* ButtonContent */, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(cellContent, 51 /* DayButtonContent */, this.options_);
        return cellContent;
      }
      createTableOfYearsElement_(viewModel) {
        const tableBody = this.createTableOfYearsBodyElement_(viewModel);
        const table = TheDatepicker2.HtmlHelper_.createTable_(null, tableBody, 39 /* YearsTable */, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(table, 29 /* Table */, this.options_);
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
        return TheDatepicker2.HtmlHelper_.createTableBody_(rows, 40 /* YearsTableBody */, this.options_);
      }
      updateTableOfYearsRowsElements_(viewModel) {
        if (!viewModel.yearSelectionState_) {
          return;
        }
        const rows = viewModel.getYearsRows_();
        for (let rowIndex = 0; rowIndex < this.yearsElements_.length; rowIndex++) {
          const cells = rows.length > rowIndex ? rows[rowIndex] : null;
          if (cells) {
            for (let columnIndex = 0; columnIndex < this.yearsElements_[rowIndex].length; columnIndex++) {
              this.updateTableOfYearsCellElement_(
                viewModel,
                this.yearsElements_[rowIndex][columnIndex],
                this.yearsButtonsElements_[rowIndex][columnIndex],
                this.yearsContentsElements_[rowIndex][columnIndex],
                cells[columnIndex]
              );
            }
          }
        }
      }
      updateTableOfYearsCellElement_(viewModel, yearElement, yearButtonElement, yearContentElement, yearCellData) {
        yearButtonElement.yearCellData = yearCellData;
        yearElement.setAttribute("data-year", yearCellData.yearNumber + "");
        yearElement.className = "";
        TheDatepicker2.HtmlHelper_.addClass_(yearElement, 31 /* TableCell */, this.options_);
        yearContentElement.innerText = yearCellData.yearNumber + "";
        if (yearCellData.isAvailable) {
          yearButtonElement.href = "#";
        } else {
          yearButtonElement.removeAttribute("href");
          if (this.options_.areYearsOutOfTableOfYearsVisible()) {
            TheDatepicker2.HtmlHelper_.addClass_(yearElement, 32 /* TableCellUnavailable */, this.options_);
          } else {
            yearButtonElement.style.visibility = "hidden";
            return;
          }
        }
        if (yearCellData.isHighlighted) {
          TheDatepicker2.HtmlHelper_.addClass_(yearElement, 33 /* TableCellHighlighted */, this.options_);
        }
        if (yearCellData.isSelected) {
          TheDatepicker2.HtmlHelper_.addClass_(yearElement, 34 /* TableCellSelected */, this.options_);
        }
        yearButtonElement.style.visibility = "visible";
        if (yearCellData.isFocused) {
          yearButtonElement.focus();
        }
      }
      createTableOfYearsRowElement_(viewModel) {
        const cells = [];
        const cellsButtons = [];
        const cellsContents = [];
        for (let index = 0; index < this.options_.getTableOfYearsColumnsCount(); index++) {
          const cell = TheDatepicker2.HtmlHelper_.createTableCell_();
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
        return TheDatepicker2.HtmlHelper_.createTableRow_(cells, this.options_);
      }
      createTableOfYearsCellButtonElement_(viewModel) {
        const cellButton = TheDatepicker2.HtmlHelper_.createAnchor_((event) => {
          const newMonth = new Date(cellButton.yearCellData.yearNumber, viewModel.getCurrentMonth_().getMonth(), 1);
          const correctMonth = this.options_.correctMonth(newMonth);
          if (correctMonth.getFullYear() === newMonth.getFullYear()) {
            viewModel.goToMonth_(event, correctMonth);
            viewModel.isYearSelectionToggleButtonFocused_ = true;
            this.slideTable_(viewModel, 2 /* Up */, () => {
              viewModel.setYearSelectionActive_(false);
            });
          }
        }, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(cellButton, 52 /* YearCellButton */, this.options_);
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
        const cellContent = TheDatepicker2.HtmlHelper_.createSpan_();
        TheDatepicker2.HtmlHelper_.addClass_(cellContent, 18 /* ButtonContent */, this.options_);
        TheDatepicker2.HtmlHelper_.addClass_(cellContent, 53 /* YearCellButtonContent */, this.options_);
        return cellContent;
      }
      slideTable_(viewModel, moveDirection, onComplete) {
        if (!this.options_.isSlideAnimationEnabled() || !TheDatepicker2.Helper_.isCssAnimationSupported_()) {
          onComplete();
          return;
        }
        const trigger = () => {
          let animationOut;
          let animationIn;
          switch (moveDirection) {
            case 1 /* Left */:
              animationOut = 55 /* AnimateFadeOutLeft */;
              animationIn = 56 /* AnimateFadeInRight */;
              break;
            case 2 /* Up */:
              animationOut = 57 /* AnimateFadeOutUp */;
              animationIn = 58 /* AnimateFadeInDown */;
              break;
            case 3 /* Right */:
              animationOut = 59 /* AnimateFadeOutRight */;
              animationIn = 60 /* AnimateFadeInLeft */;
              break;
            case 4 /* Down */:
              animationOut = 61 /* AnimateFadeOutDown */;
              animationIn = 62 /* AnimateFadeInUp */;
              break;
          }
          const originalClassName = this.tablesElement_.className;
          const animate = (type) => {
            TheDatepicker2.HtmlHelper_.addClass_(this.tablesElement_, 54 /* Animated */, this.options_);
            TheDatepicker2.HtmlHelper_.addClass_(this.tablesElement_, type, this.options_);
          };
          const onAfterSlide = () => {
            if (this.onAfterSlide_.length > 0) {
              this.onAfterSlide_.shift()();
            } else {
              this.onAfterSlide_ = null;
            }
          };
          let listenerRemover;
          const timeoutId = window.setTimeout(() => {
            listenerRemover();
            onComplete();
            onAfterSlide();
          }, 150);
          listenerRemover = TheDatepicker2.Helper_.addEventListener_(this.tablesElement_, "animationend" /* AnimationEnd */, () => {
            window.clearTimeout(timeoutId);
            onComplete();
            listenerRemover();
            this.tablesElement_.className = originalClassName;
            animate(animationIn);
            listenerRemover = TheDatepicker2.Helper_.addEventListener_(this.tablesElement_, "animationend" /* AnimationEnd */, () => {
              listenerRemover();
              this.tablesElement_.className = originalClassName;
              onAfterSlide();
            });
          });
          animate(animationOut);
        };
        if (this.onAfterSlide_) {
          this.onAfterSlide_.push(trigger);
        } else {
          this.onAfterSlide_ = [];
          trigger();
        }
      }
      translateMonth_(monthNumber) {
        return this.options_.isMonthShort() ? this.options_.translator.translateMonthShort(monthNumber) : this.options_.translator.translateMonth(monthNumber);
      }
      updateTitle_(element, titleName) {
        const title = this.options_.translator.translateTitle(titleName);
        if (title !== "") {
          element.title = title;
          if (this.options_.isAriaIncluded()) {
            element.setAttribute("aria-label", title);
          }
        } else {
          element.removeAttribute("title");
          element.removeAttribute("aria-label");
        }
      }
    }
    TheDatepicker2.Template_ = Template_;
  })(TheDatepicker || (TheDatepicker = {}));
  ((TheDatepicker2) => {
    let InitializationPhase;
    ((InitializationPhase2) => {
      InitializationPhase2[InitializationPhase2["Untouched"] = 0] = "Untouched";
      InitializationPhase2[InitializationPhase2["Waiting"] = 1] = "Waiting";
      InitializationPhase2[InitializationPhase2["Ready"] = 2] = "Ready";
      InitializationPhase2[InitializationPhase2["Initialized"] = 3] = "Initialized";
      InitializationPhase2[InitializationPhase2["Destroyed"] = 4] = "Destroyed";
    })(InitializationPhase || (InitializationPhase = {}));
    const _Datepicker = class _Datepicker {
      constructor(input, container = null, options = null) {
        this.inputClickable_ = null;
        this.inputText_ = null;
        this.initializationPhase_ = 0 /* Untouched */;
        this.inputListenerRemover_ = null;
        this.listenerRemovers_ = [];
        this.deselectElement_ = null;
        this.deselectButton_ = null;
        if (!(this instanceof _Datepicker)) {
          throw new Error('Creation must be performed by "new" keyword.');
        }
        if (input && !TheDatepicker2.Helper_.isElement_(input)) {
          throw new Error("Input was expected to be null or an HTMLElement.");
        }
        if (container && !TheDatepicker2.Helper_.isElement_(container)) {
          throw new Error("Container was expected to be null or an HTMLElement.");
        }
        if (!input && !container) {
          throw new Error("At least one of input or container is mandatory.");
        }
        if (options && !(options instanceof TheDatepicker2.Options)) {
          throw new Error("Options was expected to be an instance of Options");
        }
        _Datepicker.document_ = document;
        this.options = options ? options.clone() : new TheDatepicker2.Options();
        const duplicateError = "There is already a datepicker present on ";
        this.isContainerExternal_ = !!container;
        if (!container) {
          container = this.createContainer_();
          if (input) {
            input.parentNode.insertBefore(container, input.nextSibling);
          }
        } else {
          if (container.datepicker) {
            throw new Error(duplicateError + "container.");
          }
        }
        container.setAttribute("data-credits", "TheDatepicker - Pure JavaScript Datepicker by Slevomat.cz");
        container.setAttribute("data-url", "https://thedatepicker.github.io/thedatepicker/");
        if (input) {
          if (input.datepicker) {
            throw new Error(duplicateError + "input.");
          }
          input.datepicker = this;
          if (input && typeof HTMLInputElement !== "undefined" && input instanceof HTMLInputElement) {
            this.inputClickable_ = input;
            if (input.type === "text") {
              this.inputText_ = input;
              input.autocomplete = "off";
            }
          }
        }
        container.datepicker = this;
        this.input = input;
        this.container = container;
        this.viewModel_ = new TheDatepicker2.ViewModel_(this.options, this);
        this.triggerReady_(input);
        this.triggerReady_(container);
      }
      render() {
        switch (this.initializationPhase_) {
          case 2 /* Ready */:
            this.initListeners_();
            this.initializationPhase_ = 3 /* Initialized */;
            this.render();
            return;
          case 1 /* Waiting */:
            this.createDeselectElement_();
            if (!this.options.isHiddenOnBlur()) {
              this.open();
              return;
            }
            if (!this.viewModel_.selectPossibleDate_()) {
              this.updateInput_();
            }
            return;
          case 0 /* Untouched */:
            this.preselectFromInput_();
            this.createDeselectElement_();
            if (!this.viewModel_.selectInitialDate_(null)) {
              this.updateInput_();
            }
            if (this.inputClickable_ && this.options.isHiddenOnBlur()) {
              if (this.inputClickable_ === _Datepicker.document_.activeElement) {
                this.initializationPhase_ = 2 /* Ready */;
                this.render();
                this.open();
                return;
              }
              this.inputListenerRemover_ = TheDatepicker2.Helper_.addEventListener_(this.inputClickable_, "focus" /* Focus */, (event) => {
                this.open(event);
              });
              this.initializationPhase_ = 1 /* Waiting */;
              return;
            }
            this.initializationPhase_ = 2 /* Ready */;
            this.render();
            return;
          default:
            this.viewModel_.render_();
            return;
        }
      }
      open(event = null) {
        if (this.initializationPhase_ === 0 /* Untouched */) {
          this.render();
        }
        if (this.initializationPhase_ === 1 /* Waiting */) {
          this.initializationPhase_ = 2 /* Ready */;
          this.render();
          _Datepicker.hasClickedViewModel_ = true;
        }
        if (!_Datepicker.activateViewModel_(event, this)) {
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
        if (!_Datepicker.activateViewModel_(event, null)) {
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
        if (this.initializationPhase_ === 4 /* Destroyed */) {
          return;
        }
        for (let index = 0; index < this.listenerRemovers_.length; index++) {
          this.listenerRemovers_[index]();
        }
        this.listenerRemovers_ = [];
        if (this.isContainerExternal_) {
          this.container.innerHTML = "";
        } else {
          this.container.parentNode.removeChild(this.container);
        }
        delete this.container.datepicker;
        if (this.input) {
          if (this.inputText_) {
            this.inputText_.autocomplete = "";
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
        this.initializationPhase_ = 4 /* Destroyed */;
      }
      isDestroyed() {
        return this.initializationPhase_ === 4 /* Destroyed */;
      }
      selectDate(date, doUpdateMonth = true, event = null) {
        return this.viewModel_.selectDay_(event, TheDatepicker2.Helper_.normalizeDate_("Date", date, true, this.options), !!doUpdateMonth);
      }
      getSelectedDate() {
        return this.viewModel_.selectedDate_ ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
      }
      getSelectedDateFormatted(format = null) {
        return TheDatepicker2.DateConverter_.formatDate_(this.viewModel_.selectedDate_, this.options, TheDatepicker2.Helper_.checkString_("Format", format));
      }
      getCurrentMonth() {
        return new Date(this.viewModel_.getCurrentMonth_().getTime());
      }
      goToMonth(month, event = null) {
        return this.viewModel_.goToMonth_(event, TheDatepicker2.Helper_.normalizeDate_("Month", month, false, this.options));
      }
      parseRawInput() {
        return this.inputText_ ? TheDatepicker2.DateConverter_.parseDate_(this.inputText_.value, this.options) : null;
      }
      getHtmlInput() {
        return this.inputClickable_;
      }
      getDay(date) {
        return this.viewModel_.createDay_(TheDatepicker2.Helper_.normalizeDate_("Date", date, false, this.options));
      }
      canType_(char) {
        if (!this.inputText_ || this.options.isAllowedInputAnyChar()) {
          return true;
        }
        return TheDatepicker2.DateConverter_.isValidChar_(char, this.options);
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
        } catch (error) {
          if (!(error instanceof TheDatepicker2.CannotParseDateException)) {
            throw error;
          }
        }
        return false;
      }
      updateInput_() {
        if (!this.inputText_ || this.inputText_ === _Datepicker.document_.activeElement) {
          return;
        }
        this.inputText_.value = TheDatepicker2.DateConverter_.formatDate_(this.viewModel_.selectedDate_, this.options) || "";
        this.updateDeselectElement_();
      }
      static onDatepickerReady(element, callback = null) {
        if (!TheDatepicker2.Helper_.isElement_(element)) {
          throw new Error("Element was expected to be an HTMLElement.");
        }
        callback = TheDatepicker2.Helper_.checkFunction_("Callback", callback);
        let promise = null;
        let promiseResolve = null;
        if (typeof Promise !== "undefined") {
          promise = new Promise((resolve) => {
            promiseResolve = resolve;
          });
        }
        if (element.datepicker && element.datepicker instanceof _Datepicker) {
          element.datepicker.triggerReadyListener_(callback, element);
          if (promiseResolve) {
            promiseResolve(element.datepicker);
          }
        } else {
          _Datepicker.readyListeners_.push({
            promiseResolve,
            element,
            callback
          });
        }
        return promise;
      }
      createContainer_() {
        return TheDatepicker2.HtmlHelper_.createDiv_(0 /* Container */, this.options);
      }
      createDeselectElement_() {
        if (!this.inputText_ || !this.options.isDeselectButtonShown() || this.deselectElement_) {
          return null;
        }
        const deselectButton = TheDatepicker2.HtmlHelper_.createAnchor_((event) => {
          deselectButton.focus();
          this.viewModel_.cancelSelection_(event);
        }, this.options, 21 /* DeselectButton */);
        deselectButton.innerHTML = this.options.getDeselectHtml();
        const title = this.options.translator.translateTitle(4 /* Deselect */);
        if (title !== "") {
          deselectButton.title = title;
        }
        const deselectElement = TheDatepicker2.HtmlHelper_.createSpan_();
        TheDatepicker2.HtmlHelper_.addClass_(deselectElement, 20 /* Deselect */, this.options);
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
        this.deselectElement_.style.visibility = isVisible ? "visible" : "hidden";
      }
      preselectFromInput_() {
        if (this.inputText_) {
          try {
            const date = this.parseRawInput();
            if (date) {
              this.options.setInitialDate(date);
            }
          } catch (error) {
            if (!(error instanceof TheDatepicker2.CannotParseDateException)) {
              throw error;
            }
          }
        }
      }
      initListeners_() {
        if (!_Datepicker.areGlobalListenersInitialized_) {
          const checkMiss = (event) => {
            if (_Datepicker.hasClickedViewModel_) {
              _Datepicker.hasClickedViewModel_ = false;
            } else {
              _Datepicker.activateViewModel_(event, null);
            }
          };
          TheDatepicker2.Helper_.addEventListener_(_Datepicker.document_, "mousedown" /* MouseDown */, checkMiss);
          TheDatepicker2.Helper_.addEventListener_(_Datepicker.document_, "focusin" /* FocusIn */, checkMiss);
          TheDatepicker2.Helper_.addEventListener_(_Datepicker.document_, "keydown" /* KeyDown */, (event) => {
            if (_Datepicker.activeViewModel_) {
              _Datepicker.activeViewModel_.triggerKeyPress_(event);
            }
          });
          _Datepicker.areGlobalListenersInitialized_ = true;
        }
        this.removeInitialInputListener_();
        const hit = (event) => {
          _Datepicker.activateViewModel_(event, this);
          _Datepicker.hasClickedViewModel_ = true;
        };
        this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.container, "mousedown" /* MouseDown */, hit));
        this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.container, "focusin" /* FocusIn */, hit));
        if (this.deselectButton_) {
          const hitIfActive = (event) => {
            if (this.viewModel_.isActive_()) {
              hit(event);
            }
          };
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.deselectButton_, "mousedown" /* MouseDown */, hitIfActive));
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.deselectButton_, "focus" /* Focus */, hitIfActive));
        }
        if (this.inputClickable_) {
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.inputClickable_, "mousedown" /* MouseDown */, hit));
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.inputClickable_, "focus" /* Focus */, hit));
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.inputClickable_, "blur" /* Blur */, () => {
            this.updateInput_();
          }));
        }
        if (this.inputText_) {
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.inputText_, "keydown" /* KeyDown */, (event) => {
            TheDatepicker2.Helper_.stopPropagation_(event);
            if (event.keyCode === 27 /* Esc */ && this.options.isClosedOnEscPress()) {
              this.close(event);
            }
          }));
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.inputText_, "keyup" /* KeyUp */, (event) => {
            this.readInput_(event);
          }));
          this.listenerRemovers_.push(TheDatepicker2.Helper_.addEventListener_(this.inputText_, "keypress" /* KeyPress */, (event) => {
            const charCode = event.charCode || event.keyCode;
            if (charCode && !this.canType_(String.fromCharCode(charCode))) {
              TheDatepicker2.Helper_.preventDefault_(event);
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
        for (let index = _Datepicker.readyListeners_.length - 1; index >= 0; index--) {
          const listener = _Datepicker.readyListeners_[index];
          if (listener.element === element) {
            this.triggerReadyListener_(listener.callback, element);
            if (listener.promiseResolve) {
              listener.promiseResolve(this);
            }
            _Datepicker.readyListeners_.splice(index, 1);
          }
        }
      }
      triggerReadyListener_(callback, element) {
        if (callback) {
          callback.call(element, this, element);
        }
      }
      onActivate_() {
        if (this.initializationPhase_ === 4 /* Destroyed */) {
          return;
        }
        this.updateContainer_();
        if (this.inputText_) {
          this.inputText_.readOnly = !this.options.isKeyboardOnMobile() && TheDatepicker2.Helper_.isMobile_();
        }
      }
      updateContainer_() {
        if (this.isContainerExternal_) {
          return;
        }
        this.container.className = "";
        TheDatepicker2.HtmlHelper_.addClass_(this.container, 0 /* Container */, this.options);
        if (this.options.isDarkModeEnabled()) {
          TheDatepicker2.HtmlHelper_.addClass_(this.container, 63 /* ContainerDarkMode */, this.options);
        }
        if (this.options.isFullScreenOnMobile()) {
          TheDatepicker2.HtmlHelper_.addClass_(this.container, 3 /* ContainerResponsive */, this.options);
        }
        if (this.container.childNodes.length === 0) {
          return;
        }
        const position = this.options.getPosition();
        let locateOver = position === 3 /* TopRight */ || position === 4 /* TopLeft */;
        let locateLeft = position === 2 /* BottomLeft */ || position === 4 /* TopLeft */;
        const mainElement = this.container.childNodes[0];
        mainElement.style.position = "";
        mainElement.style.top = "";
        mainElement.style.left = "";
        const inputWidth = this.input.offsetWidth;
        const inputHeight = this.input.offsetHeight;
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        if (this.options.isPositionFixingEnabled()) {
          const document2 = _Datepicker.document_;
          const windowTop = window.scrollY || window.pageYOffset || document2.documentElement.scrollTop || document2.body.scrollTop || 0;
          const windowLeft = window.scrollX || window.pageXOffset || document2.documentElement.scrollLeft || document2.body.scrollLeft || 0;
          const isCompactMode = document2.compatMode === "CSS1Compat";
          const windowHeight = window.innerHeight || (isCompactMode ? document2.documentElement.clientHeight : document2.body.clientHeight) || 0;
          const windowWidth = window.innerWidth || (isCompactMode ? document2.documentElement.clientWidth : document2.body.clientWidth) || 0;
          const windowBottom = windowTop + windowHeight;
          const windowRight = windowLeft + windowWidth;
          const rect = this.input.getBoundingClientRect();
          const inputTop = rect.top + windowTop;
          const inputLeft = rect.left + windowLeft;
          const inputBottom = inputTop + inputHeight;
          const inputRight = inputLeft + inputWidth;
          const fitsTop = inputTop - windowTop > containerHeight;
          const fitsBottom = windowBottom - inputBottom > containerHeight;
          const fitsLeft = inputLeft - windowLeft > containerWidth - inputWidth;
          const fitsRight = windowRight - inputRight > containerWidth - inputWidth;
          locateOver = locateOver && (fitsTop || !fitsBottom) || fitsTop && !fitsBottom;
          locateLeft = locateLeft && (fitsLeft || !fitsRight) || fitsLeft && !fitsRight;
        }
        mainElement.style.position = locateOver || locateLeft ? "absolute" : "";
        if (locateOver) {
          TheDatepicker2.HtmlHelper_.addClass_(this.container, 1 /* ContainerOver */, this.options);
          mainElement.style.top = "-" + (inputHeight + containerHeight) + "px";
        }
        if (locateLeft) {
          TheDatepicker2.HtmlHelper_.addClass_(this.container, 2 /* ContainerLeft */, this.options);
          mainElement.style.left = "-" + (containerWidth - inputWidth) + "px";
        }
      }
      static setBodyClass_(enable) {
        const pageClass = "the-datepicker-page";
        const body = _Datepicker.document_.body;
        const className = body.className;
        const hasClass = className.indexOf(pageClass) > -1;
        if (!hasClass && enable) {
          body.className += (className.length > 0 ? " " : "") + pageClass;
        } else if (hasClass && !enable) {
          let search = pageClass;
          if (className.indexOf(" " + pageClass) > -1) {
            search = " " + pageClass;
          } else if (className.indexOf(pageClass + " ") > -1) {
            search = pageClass + " ";
          }
          body.className = className.replace(search, "");
        }
      }
      static activateViewModel_(event, datepicker) {
        const viewModel = datepicker ? datepicker.viewModel_ : null;
        const activeViewModel = _Datepicker.activeViewModel_;
        if (activeViewModel === viewModel) {
          return true;
        }
        if (activeViewModel && !activeViewModel.setActive_(event, false)) {
          return false;
        }
        if (_Datepicker.activeViewModel_ !== activeViewModel) {
          return true;
        }
        if (!viewModel) {
          _Datepicker.setBodyClass_(false);
          _Datepicker.activeViewModel_ = null;
          return true;
        }
        if (!viewModel.setActive_(event, true)) {
          return false;
        }
        if (_Datepicker.activeViewModel_ !== activeViewModel) {
          return true;
        }
        datepicker.onActivate_();
        _Datepicker.setBodyClass_(!datepicker.isContainerExternal_ && datepicker.options.isFullScreenOnMobile());
        _Datepicker.activeViewModel_ = viewModel;
        return true;
      }
    };
    _Datepicker.readyListeners_ = [];
    _Datepicker.areGlobalListenersInitialized_ = false;
    _Datepicker.activeViewModel_ = null;
    _Datepicker.hasClickedViewModel_ = false;
    let Datepicker = _Datepicker;
    TheDatepicker2.Datepicker = _Datepicker;
    TheDatepicker2.onDatepickerReady = Datepicker.onDatepickerReady;
  })(TheDatepicker || (TheDatepicker = {}));
})();
