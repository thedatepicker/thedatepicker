define(["require", "exports"], function (require, exports) {
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
