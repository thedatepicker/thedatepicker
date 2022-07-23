define(["require", "exports", "./Day", "./Options", "./DateConverter", "./Helper", "./Template"], function (require, exports, Day_1, Options_1, DateConverter_1, Helper_1, Template_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MoveDirection_ = void 0;
    var MoveDirection_;
    (function (MoveDirection_) {
        MoveDirection_[MoveDirection_["Left"] = 1] = "Left";
        MoveDirection_[MoveDirection_["Up"] = 2] = "Up";
        MoveDirection_[MoveDirection_["Right"] = 3] = "Right";
        MoveDirection_[MoveDirection_["Down"] = 4] = "Down";
    })(MoveDirection_ = exports.MoveDirection_ || (exports.MoveDirection_ = {}));
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
            this.template_ = new Template_1.default(this.options_, datepicker_.container, !!datepicker_.input);
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
                    columnsCount: this.options_.getTableOfYearsColumnsCount(),
                };
            }
            this.template_.render_(this);
            this.datepicker_.updateInput_();
        }
        setActive_(event, value) {
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
            if (!Helper_1.default.isValidDate_(month)) {
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
            month = Helper_1.default.resetTime_(new Date(month.getTime()));
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
            if (date instanceof Day_1.default) {
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
            const previousDay = this.selectedDate_ ? this.createDay_(this.selectedDate_) : null;
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
        }
        canSetYearSelectionActive_(value) {
            return !!this.yearSelectionState_ !== value
                && (!value
                    || this.options_.getMinDate_().getFullYear() !== this.options_.getMaxDate_().getFullYear());
        }
        setYearSelectionActive_(value) {
            if (this.canSetYearSelectionActive_(value)) {
                this.yearSelectionState_ = value
                    ? this.createYearSelectionState_()
                    : null;
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
            }
            catch (error) {
                if (!(error instanceof Options_1.AvailableDateNotFoundException)) {
                    throw error;
                }
                return this.cancelSelection_(null, true);
            }
        }
        selectInitialDate_(event) {
            try {
                return this.selectDay_(event, this.options_.getInitialDate(), false);
            }
            catch (error) {
                if (!(error instanceof Options_1.AvailableDateNotFoundException)) {
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
            let newDay = day;
            let maxLoops = 1000;
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
            const newYear = year + shift;
            if (newYear < this.options_.getMinDate_().getFullYear()
                || newYear > this.options_.getMaxDate_().getFullYear()) {
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
                const yearCellData = new Template_1.YearCellData_(year);
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
            if ((align === Helper_1.Align.Left && minDate === null)
                || (align === Helper_1.Align.Right && maxDate === null)) {
                align = null;
            }
            if (!align) {
                if (minDate && maxDate) {
                    const lowDiff = initialYear - minDate.getFullYear();
                    const highDiff = maxDate.getFullYear() - initialYear;
                    align = lowDiff > highDiff ? Helper_1.Align.Right : Helper_1.Align.Left;
                }
                else if (minDate) {
                    align = Helper_1.Align.Left;
                }
                else if (maxDate) {
                    align = Helper_1.Align.Right;
                }
                else {
                    align = Helper_1.Align.Center;
                }
            }
            let lowestYear;
            const cellsCount = this.tableOfYearsSettings_.rowsCount * this.tableOfYearsSettings_.columnsCount;
            const minYear = this.options_.getMinDate_().getFullYear();
            const maxYear = this.options_.getMaxDate_().getFullYear();
            switch (align) {
                case Helper_1.Align.Left:
                    lowestYear = minYear;
                    break;
                case Helper_1.Align.Right:
                    lowestYear = minYear - (cellsCount - ((maxYear - minYear) % cellsCount) - 1);
                    break;
                case Helper_1.Align.Center:
                    const shift = Math.floor(this.tableOfYearsSettings_.rowsCount / 2) * this.tableOfYearsSettings_.columnsCount + Math.floor(this.tableOfYearsSettings_.columnsCount / 2);
                    lowestYear = minYear - (cellsCount - ((initialYear + shift - minYear) % cellsCount) - 1);
                    break;
                default:
                    throw new Error('Invalid align: ' + align);
            }
            const currentYear = this.getCurrentMonth_().getFullYear();
            const page = Math.floor((currentYear - lowestYear) / cellsCount);
            return new YearSelectionState(cellsCount, lowestYear, Math.floor((maxYear - lowestYear) / cellsCount), page);
        }
        triggerKeyPress_(event) {
            if (Helper_1.default.inArray_([Helper_1.KeyCode_.Left, Helper_1.KeyCode_.Up, Helper_1.KeyCode_.Right, Helper_1.KeyCode_.Down], event.keyCode)) {
                Helper_1.default.preventDefault_(event);
                const moveDirection = this.translateKeyCodeToMoveDirection_(event.keyCode);
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
            else if (event.keyCode === Helper_1.KeyCode_.Esc && this.options_.isClosedOnEscPress()) {
                if (this.yearSelectionState_) {
                    this.isYearSelectionToggleButtonFocused_ = true;
                    this.setYearSelectionActive_(false);
                }
                else {
                    this.datepicker_.close(event);
                }
            }
        }
        createDay_(date) {
            date = Helper_1.default.resetTime_(new Date(date.getTime()));
            const today = this.options_.getToday();
            const currentMonth = this.getCurrentMonth_();
            const day = new Day_1.default(date, (date) => {
                return this.createDay_(date);
            }, (date) => {
                return DateConverter_1.default.formatDate_(date, this.options_);
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
            return this.options_.triggerEvent_(Options_1.EventType_.BeforeSelect, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        triggerOnSelect_(event, day, previousDay) {
            this.options_.triggerEvent_(Options_1.EventType_.Select, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        triggerOnBeforeOpen_(event) {
            return this.options_.triggerEvent_(Options_1.EventType_.BeforeOpen, (listener) => {
                return listener.call(this.datepicker_, event, true);
            });
        }
        triggerOnOpen_(event) {
            this.options_.triggerEvent_(Options_1.EventType_.Open, (listener) => {
                return listener.call(this.datepicker_, event, true);
            });
        }
        triggerOnBeforeClose_(event) {
            return this.options_.triggerEvent_(Options_1.EventType_.BeforeClose, (listener) => {
                return listener.call(this.datepicker_, event, false);
            });
        }
        triggerOnClose_(event) {
            this.options_.triggerEvent_(Options_1.EventType_.Close, (listener) => {
                return listener.call(this.datepicker_, event, false);
            });
        }
        triggerOnBeforeMonthChange_(event, month, previousMonth) {
            return this.options_.triggerEvent_(Options_1.EventType_.BeforeMonthChange, (listener) => {
                return listener.call(this.datepicker_, event, month, previousMonth);
            });
        }
        triggerOnMonthChange_(event, month, previousMonth) {
            this.options_.triggerEvent_(Options_1.EventType_.MonthChange, (listener) => {
                return listener.call(this.datepicker_, event, month, previousMonth);
            });
        }
        triggerOnBeforeFocus_(event, day, previousDay) {
            return this.options_.triggerEvent_(Options_1.EventType_.BeforeFocus, (listener) => {
                return listener.call(this.datepicker_, event, day, previousDay);
            });
        }
        triggerOnFocus_(event, day, previousDay) {
            this.options_.triggerEvent_(Options_1.EventType_.Focus, (listener) => {
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
            const lastMonthDaysCount = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)).getDate();
            const prependDaysCount = (firstDateOfMonth.getDay() - firstDayOfWeek + 7) % 7;
            const prepend = [];
            for (let date = lastMonthDaysCount - prependDaysCount + 1; date <= lastMonthDaysCount; date++) {
                prepend.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, date));
            }
            const lastDateOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
            const appendDaysCount = 6 - ((lastDateOfMonth.getDay() - firstDayOfWeek + 7) % 7);
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
                prepend: prepend,
                append: append,
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
                case Helper_1.KeyCode_.Left:
                    return MoveDirection_.Left;
                case Helper_1.KeyCode_.Up:
                    return MoveDirection_.Up;
                case Helper_1.KeyCode_.Right:
                    return MoveDirection_.Right;
                case Helper_1.KeyCode_.Down:
                    return MoveDirection_.Down;
                default:
                    throw new Error('Invalid key code: ' + key);
            }
        }
    }
    exports.default = ViewModel_;
});
