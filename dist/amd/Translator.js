define(["require", "exports", "./Helper"], function (require, exports, Helper_1) {
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
            this.dayOfWeekTranslations_[Helper_1.default.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_1.default.checkString_('Translation', translation, true);
        }
        setDayOfWeekFullTranslation(dayOfWeek, translation) {
            this.dayOfWeekFullTranslations_[Helper_1.default.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_1.default.checkString_('Translation', translation, true);
        }
        setMonthTranslation(month, translation) {
            this.monthTranslations_[Helper_1.default.checkNumber_('Month', month, 0, 11)] = Helper_1.default.checkString_('Translation', translation, true);
        }
        setMonthShortTranslation(month, translation) {
            this.monthShortTranslations_[Helper_1.default.checkNumber_('Month', month, 0, 11)] = Helper_1.default.checkString_('Translation', translation, true);
        }
        setTitleTranslation(titleName, translation) {
            this.titles_[Helper_1.default.checkNumber_('Title', titleName, 0, this.titles_.length - 1)] = Helper_1.default.checkString_('Translation', translation);
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
