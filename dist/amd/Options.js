define(["require", "exports", "./ClassNames", "./Translator", "./Helper", "./HtmlHelper"], function (require, exports, ClassNames_1, Translator_1, Helper_1, HtmlHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AvailableDateNotFoundException = exports.EventType_ = void 0;
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
    })(EventType_ = exports.EventType_ || (exports.EventType_ = {}));
    class AvailableDateNotFoundException {
    }
    exports.AvailableDateNotFoundException = AvailableDateNotFoundException;
    class Options {
        constructor(translator = null, classNames = null) {
            this.hideOnBlur_ = true;
            this.hideOnSelect_ = true;
            this.minDate_ = null;
            this.maxDate_ = null;
            this.initialDate_ = null;
            this.initialMonth_ = null;
            this.initialDatePriority_ = true;
            this.firstDayOfWeek_ = Helper_1.DayOfWeek.Monday;
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
                focus: [],
            };
            this.translator = translator || new Translator_1.default();
            this.classNames = classNames || new ClassNames_1.default();
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
        setHideOnBlur(value) {
            this.hideOnBlur_ = !!value;
        }
        setHideOnSelect(value) {
            this.hideOnSelect_ = !!value;
        }
        setMinDate(date) {
            const normalizedDate = Helper_1.default.normalizeDate_('Min date', date, true, this);
            this.checkConstraints_(normalizedDate, this.maxDate_);
            this.minDate_ = normalizedDate;
        }
        setMaxDate(date) {
            const normalizedDate = Helper_1.default.normalizeDate_('Max date', date, true, this);
            this.checkConstraints_(this.minDate_, normalizedDate);
            this.maxDate_ = normalizedDate;
        }
        setInitialMonth(month) {
            this.initialMonth_ = Helper_1.default.normalizeDate_('Initial month', month, true, this);
        }
        setInitialDate(value) {
            this.initialDate_ = Helper_1.default.normalizeDate_('Initial date', value, true, this);
        }
        setInitialDatePriority(value) {
            this.initialDatePriority_ = !!value;
        }
        setFirstDayOfWeek(dayOfWeek) {
            this.firstDayOfWeek_ = Helper_1.default.checkNumber_('First day of week', dayOfWeek, 0, 6);
        }
        setDateAvailabilityResolver(resolver) {
            Helper_1.default.warnDeprecatedUsage_('setDateAvailabilityResolver', ['addDateAvailabilityResolver']);
            this.removeDateAvailabilityResolver();
            if (resolver) {
                this.addDateAvailabilityResolver(resolver);
            }
        }
        addDateAvailabilityResolver(resolver) {
            this.dateAvailabilityResolvers_.push(Helper_1.default.checkFunction_('Resolver', resolver, false));
        }
        removeDateAvailabilityResolver(resolver = null) {
            this.removeCallback_(this.dateAvailabilityResolvers_, 'Resolver', resolver);
        }
        setCellContentResolver(resolver) {
            this.cellContentResolver_ = Helper_1.default.checkFunction_('Resolver', resolver);
        }
        setCellContentStructureResolver(init, update = null) {
            init = Helper_1.default.checkFunction_('Resolver (init)', init);
            update = Helper_1.default.checkFunction_('Resolver (update)', update);
            this.cellContentStructureResolver_ = init ? {
                init,
                update,
            } : null;
        }
        setHeaderStructureResolver(resolver) {
            this.headerStructureResolver_ = Helper_1.default.checkFunction_('Resolver', resolver);
        }
        setFooterStructureResolver(resolver) {
            this.footerStructureResolver_ = Helper_1.default.checkFunction_('Resolver', resolver);
        }
        addCellClassesResolver(resolver) {
            this.cellClassesResolvers_.push(Helper_1.default.checkFunction_('Resolver', resolver, false));
        }
        removeCellClassesResolver(resolver = null) {
            this.removeCallback_(this.cellClassesResolvers_, 'Resolver', resolver);
        }
        addDayModifier(modifier) {
            this.dayModifiers_.push(Helper_1.default.checkFunction_('Modifier', modifier, false));
        }
        removeDayModifier(modifier = null) {
            this.removeCallback_(this.dayModifiers_, 'Modifier', modifier);
        }
        setInputFormat(format) {
            this.inputFormat_ = Helper_1.default.checkString_('Input format', format, true);
        }
        setAllowInputAnyChar(value) {
            this.allowInputAnyChar_ = !!value;
        }
        setDaysOutOfMonthVisible(value) {
            this.daysOutOfMonthVisible_ = !!value;
        }
        setFixedRowsCount(value) {
            this.fixedRowsCount_ = !!value;
        }
        setToggleSelection(value) {
            this.toggleSelection_ = !!value;
        }
        setShowDeselectButton(value) {
            this.showDeselectButton_ = !!value;
        }
        setAllowEmpty(value) {
            this.allowEmpty_ = !!value;
        }
        setShowResetButton(value) {
            this.showResetButton_ = !!value;
        }
        setMonthAsDropdown(value) {
            this.monthAsDropdown_ = !!value;
        }
        setYearAsDropdown(value) {
            this.yearAsDropdown_ = !!value;
        }
        setYearSelectedFromTableOfYears(value) {
            this.yearSelectedFromTableOfYears_ = !!value;
        }
        setTableOfYearsRowsCount(count) {
            this.tableOfYearsRowsCount_ = Helper_1.default.checkNumber_('Rows count', count, 1);
        }
        setTableOfYearsAlign(align) {
            this.tableOfYearsAlign_ = align ? Helper_1.default.checkNumber_('Align', align, 1, 3) : null;
        }
        setTableOfYearsOnSwipeDown(value) {
            this.tableOfYearsOnSwipeDown_ = !!value;
        }
        setYearsOutOfTableOfYearsVisible(value) {
            this.yearsOutOfTableOfYearsVisible_ = !!value;
        }
        setMonthAndYearSeparated(value) {
            this.monthAndYearSeparated_ = !!value;
        }
        setMonthShort(value) {
            this.monthShort_ = !!value;
        }
        setChangeMonthOnSwipe(value) {
            this.changeMonthOnSwipe_ = !!value;
        }
        setAnimateMonthChange(value) {
            Helper_1.default.warnDeprecatedUsage_('setAnimateMonthChange', ['setSlideAnimation']);
            this.setSlideAnimation(value);
        }
        setSlideAnimation(value) {
            this.slideAnimation_ = !!value;
        }
        setClassesPrefix(prefix) {
            this.classesPrefix_ = Helper_1.default.checkString_('Prefix', prefix);
        }
        setDarkMode(value) {
            this.darkMode_ = !!value;
        }
        setShowCloseButton(value) {
            this.showCloseButton_ = !!value;
        }
        setCloseOnEscPress(value) {
            this.closeOnEscPress_ = !!value;
        }
        setTitle(title) {
            this.title_ = Helper_1.default.checkString_('Title', title);
        }
        setDropdownItemsLimit(limit) {
            this.dropdownItemsLimit_ = Helper_1.default.checkNumber_('Items limit', limit, 1);
        }
        setHideDropdownWithOneItem(value) {
            this.hideDropdownWithOneItem_ = !!value;
        }
        setGoBackHtml(html) {
            this.goBackHtml_ = Helper_1.default.checkString_('Html', html);
        }
        setGoForwardHtml(html) {
            this.goForwardHtml_ = Helper_1.default.checkString_('Html', html);
        }
        setCloseHtml(html) {
            this.closeHtml_ = Helper_1.default.checkString_('Html', html);
        }
        setResetHtml(html) {
            this.resetHtml_ = Helper_1.default.checkString_('Html', html);
        }
        setDeselectHtml(html) {
            this.deselectHtml_ = Helper_1.default.checkString_('Html', html);
        }
        setPositionFixing(value) {
            this.positionFixing_ = !!value;
        }
        setFullScreenOnMobile(value) {
            this.fullScreenOnMobile_ = !!value;
        }
        setKeyboardOnMobile(value) {
            this.keyboardOnMobile_ = !!value;
        }
        setIncludeAria(value) {
            this.includeAria_ = !!value;
        }
        setToday(date) {
            this.today_ = Helper_1.default.normalizeDate_('Today', date, true, this);
        }
        onBeforeSelect(listener) {
            this.onEvent_(EventType_.BeforeSelect, listener);
        }
        offBeforeSelect(listener = null) {
            this.offEvent_(EventType_.BeforeSelect, listener);
        }
        onSelect(listener) {
            this.onEvent_(EventType_.Select, listener);
        }
        offSelect(listener = null) {
            this.offEvent_(EventType_.Select, listener);
        }
        onBeforeOpen(listener) {
            this.onEvent_(EventType_.BeforeOpen, listener);
        }
        offBeforeOpen(listener = null) {
            this.offEvent_(EventType_.BeforeOpen, listener);
        }
        onOpen(listener) {
            this.onEvent_(EventType_.Open, listener);
        }
        offOpen(listener = null) {
            this.offEvent_(EventType_.Open, listener);
        }
        onBeforeClose(listener) {
            this.onEvent_(EventType_.BeforeClose, listener);
        }
        offBeforeClose(listener = null) {
            this.offEvent_(EventType_.BeforeClose, listener);
        }
        onClose(listener) {
            this.onEvent_(EventType_.Close, listener);
        }
        offClose(listener = null) {
            this.offEvent_(EventType_.Close, listener);
        }
        onBeforeOpenAndClose(listener) {
            Helper_1.default.warnDeprecatedUsage_('onBeforeOpenAndClose', ['onBeforeOpen', 'onBeforeClose']);
            this.onBeforeOpen(listener);
            this.onBeforeClose(listener);
        }
        offBeforeOpenAndClose(listener = null) {
            Helper_1.default.warnDeprecatedUsage_('offBeforeOpenAndClose', ['offBeforeOpen', 'offBeforeClose']);
            this.offBeforeOpen(listener);
            this.offBeforeClose(listener);
        }
        onOpenAndClose(listener) {
            Helper_1.default.warnDeprecatedUsage_('onOpenAndClose', ['onOpen', 'onClose']);
            this.onOpen(listener);
            this.onClose(listener);
        }
        offOpenAndClose(listener = null) {
            Helper_1.default.warnDeprecatedUsage_('offOpenAndClose', ['offOpen', 'offClose']);
            this.offOpen(listener);
            this.offClose(listener);
        }
        onBeforeMonthChange(listener) {
            this.onEvent_(EventType_.BeforeMonthChange, listener);
        }
        offBeforeMonthChange(listener = null) {
            this.offEvent_(EventType_.BeforeMonthChange, listener);
        }
        onMonthChange(listener) {
            this.onEvent_(EventType_.MonthChange, listener);
        }
        offMonthChange(listener = null) {
            this.offEvent_(EventType_.MonthChange, listener);
        }
        onBeforeFocus(listener) {
            this.onEvent_(EventType_.BeforeFocus, listener);
        }
        offBeforeFocus(listener = null) {
            this.offEvent_(EventType_.BeforeFocus, listener);
        }
        onFocus(listener) {
            this.onEvent_(EventType_.Focus, listener);
        }
        offFocus(listener = null) {
            this.offEvent_(EventType_.Focus, listener);
        }
        getInitialMonth() {
            const primarySource = this.initialDatePriority_ ? this.initialDate_ : this.initialMonth_;
            const secondarySource = this.initialDatePriority_ ? this.initialMonth_ : this.initialDate_;
            const initialMonth = primarySource
                ? new Date(primarySource.getTime())
                : (secondarySource
                    ? new Date(secondarySource.getTime())
                    : this.getToday());
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
        }
        findNearestAvailableDate(date) {
            date = this.correctDate_(date);
            if (this.isDateAvailable(date)) {
                return date;
            }
            const minDate = this.getMinDate_().getTime();
            const maxDate = this.getMaxDate_().getTime();
            let maxLoops = 1000;
            let increasedDate = date;
            let decreasedDate = new Date(date.getTime());
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
            Helper_1.default.warnDeprecatedUsage_('isMonthChangeAnimated', ['isSlideAnimationEnabled']);
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
            return day.dayNumber + '';
        }
        prefixClass_(name) {
            return this.classesPrefix_ + name;
        }
        getCellStructure_() {
            if (this.cellContentStructureResolver_) {
                return this.cellContentStructureResolver_.init();
            }
            return HtmlHelper_1.default.createSpan_();
        }
        updateCellStructure_(element, day) {
            if (this.cellContentStructureResolver_) {
                this.cellContentStructureResolver_.update(element, day);
            }
            else {
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
                if (typeof classes === 'string') {
                    result.push(classes);
                }
                else if (typeof classes === 'object' && classes.constructor === Array) {
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
            return this.today_ ? new Date(this.today_.getTime()) : Helper_1.default.resetTime_(new Date());
        }
        getDateAvailabilityResolver() {
            Helper_1.default.warnDeprecatedUsage_('getDateAvailabilityResolver', ['getDateAvailabilityResolvers']);
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
            Helper_1.default.warnDeprecatedUsage_('getBeforeOpenAndCloseListeners', ['getBeforeOpenListeners', 'getBeforeCloseListeners']);
            return this.listeners_.beforeOpen.concat(this.listeners_.beforeClose);
        }
        getOpenAndCloseListeners() {
            Helper_1.default.warnDeprecatedUsage_('getOpenAndCloseListeners', ['getOpenListeners', 'getCloseListeners']);
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
                throw new Error('Min date cannot be higher then max date.');
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
            callback = Helper_1.default.checkFunction_(parameterName, callback);
            if (!callback) {
                callbacksList.splice(0, callbacksList.length);
            }
            else {
                const callbacks = callbacksList.slice(0);
                for (let index = callbacks.length - 1; index >= 0; index--) {
                    if (callbacks[index] === callback) {
                        callbacksList.splice(index, 1);
                    }
                }
            }
        }
        onEvent_(eventType, listener) {
            this.listeners_[eventType].push(Helper_1.default.checkFunction_('Event listener', listener, false));
        }
        offEvent_(eventType, listener) {
            listener = Helper_1.default.checkFunction_('Event listener', listener);
            if (!listener) {
                this.listeners_[eventType] = [];
            }
            else {
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
    exports.default = Options;
});
