define(["require", "exports", "./Helper"], function (require, exports, Helper_1) {
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
            return Helper_1.default.checkNumber_('Class name type', type, 0, this.classNames_.length - 1);
        }
        normalizeClassName_(className) {
            const parameterName = 'Class name';
            if (typeof className !== 'object' || className.constructor !== Array) {
                className = Helper_1.default.checkString_(parameterName, className).split(/\s+/);
            }
            const result = [];
            for (let index = 0; index < className.length; index++) {
                const name = Helper_1.default.checkString_(parameterName, className[index]);
                if (name) {
                    result.push(name);
                }
            }
            return result;
        }
    }
    exports.default = ClassNames;
});
