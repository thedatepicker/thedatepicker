define(["require", "exports", "./Helper"], function (require, exports, Helper_1) {
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
