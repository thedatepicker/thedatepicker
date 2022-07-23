define(["require", "exports", "./HtmlHelper", "./ClassNames", "./ViewModel", "./Translator", "./Helper"], function (require, exports, HtmlHelper_1, ClassNames_1, ViewModel_1, Translator_1, Helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.YearCellData_ = void 0;
    class YearCellData_ {
        constructor(yearNumber) {
            this.yearNumber = yearNumber;
            this.isAvailable = true;
            this.isSelected = false;
            this.isHighlighted = false;
            this.isFocused = false;
        }
    }
    exports.YearCellData_ = YearCellData_;
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
            this.yearsRowsElements_ = [];
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
        }
        createSkeleton_(viewModel) {
            const main = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Main, this.options_);
            HtmlHelper_1.default.appendChild_(main, this.options_.getHeaderStructure_());
            main.appendChild(this.createHeaderElement_(viewModel));
            main.appendChild(this.createBodyElement_(viewModel));
            HtmlHelper_1.default.appendChild_(main, this.options_.getFooterStructure_());
            this.mainElement_ = main;
            return main;
        }
        updateMainElement_(viewModel) {
            this.mainElement_.style.display = !this.hasInput_ || viewModel.isActive_() || !this.options_.isHiddenOnBlur() ? '' : 'none';
        }
        updateTableElements_(viewModel) {
            this.tableElement_.style.display = viewModel.yearSelectionState_ ? 'none' : '';
            if (this.tableOfYearsElement_) {
                this.tableOfYearsElement_.style.display = viewModel.yearSelectionState_ ? '' : 'none';
            }
        }
        createBodyElement_(viewModel) {
            const body = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Body, this.options_);
            const tables = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Tables, this.options_);
            body.appendChild(tables);
            if (this.options_.isMonthChangeOnSwipeEnabled() || this.options_.isTableOfYearsOnSwipeDownEnabled()) {
                HtmlHelper_1.default.addClass_(body, ClassNames_1.ClassNameType.BodySwipeable, this.options_);
                Helper_1.default.addSwipeListener_(body, (event, moveDirection) => {
                    let isForward = false;
                    let change = null;
                    switch (moveDirection) {
                        case ViewModel_1.MoveDirection_.Down:
                            isForward = true;
                        case ViewModel_1.MoveDirection_.Up:
                            if (this.tableOfYearsElement_ && this.options_.isTableOfYearsOnSwipeDownEnabled() && viewModel.canSetYearSelectionActive_(isForward)) {
                                change = () => {
                                    viewModel.setYearSelectionActive_(isForward);
                                };
                            }
                            break;
                        case ViewModel_1.MoveDirection_.Left:
                            isForward = true;
                        case ViewModel_1.MoveDirection_.Right:
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
            const header = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Header, this.options_);
            const top = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderTop, this.options_);
            header.appendChild(top);
            top.appendChild(this.createTitleElement_(viewModel));
            const control = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderControl, this.options_);
            top.appendChild(control);
            control.appendChild(this.createResetElement_(viewModel));
            control.appendChild(this.createCloseElement_(viewModel));
            const navigation = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderNavigation, this.options_);
            header.appendChild(navigation);
            navigation.appendChild(this.createGoElement_(viewModel, false));
            const state = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderState, this.options_);
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
        }
        updateTopElement_(viewModel) {
            const isVisible = this.options_.getTitle() !== ''
                || this.options_.isResetButtonShown()
                || (this.hasInput_ && this.options_.isCloseButtonShown());
            this.controlElement_.style.display = isVisible ? '' : 'none';
            this.titleElement_.style.display = isVisible ? '' : 'none';
        }
        createTitleElement_(viewModel) {
            const titleElement = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderTitle, this.options_);
            const titleContent = HtmlHelper_1.default.createSpan_();
            titleElement.appendChild(titleContent);
            HtmlHelper_1.default.addClass_(titleContent, ClassNames_1.ClassNameType.HeaderTitleContent, this.options_);
            this.titleElement_ = titleElement;
            this.titleContentElement_ = titleContent;
            return titleElement;
        }
        updateTitleElement_(viewModel) {
            const title = this.options_.getTitle();
            this.titleContentElement_.style.display = title !== '' ? '' : 'none';
            this.titleContentElement_.innerText = title;
        }
        createResetElement_(viewModel) {
            const resetElement = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Reset, this.options_);
            const resetButton = HtmlHelper_1.default.createAnchor_((event) => {
                viewModel.reset_(event);
            }, this.options_);
            resetButton.innerHTML = this.options_.getResetHtml();
            resetElement.appendChild(resetButton);
            this.resetButton_ = resetButton;
            this.resetElement_ = resetElement;
            return resetElement;
        }
        updateResetElement_(viewModel) {
            this.resetElement_.style.display = this.options_.isResetButtonShown() ? '' : 'none';
            this.updateTitle_(this.resetButton_, Translator_1.TitleName.Reset);
        }
        createCloseElement_(viewModel) {
            const closeElement = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Close, this.options_);
            const closeButton = HtmlHelper_1.default.createAnchor_((event) => {
                viewModel.close_(event);
            }, this.options_);
            closeButton.innerHTML = this.options_.getCloseHtml();
            closeElement.appendChild(closeButton);
            this.closeButton_ = closeButton;
            this.closeElement_ = closeElement;
            return closeElement;
        }
        updateCloseElement_(viewModel) {
            this.closeElement_.style.display = this.hasInput_ && this.options_.isCloseButtonShown() ? '' : 'none';
            this.updateTitle_(this.closeButton_, Translator_1.TitleName.Close);
        }
        createGoElement_(viewModel, isForward) {
            const goElement = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Go, this.options_);
            HtmlHelper_1.default.addClass_(goElement, isForward ? ClassNames_1.ClassNameType.GoNext : ClassNames_1.ClassNameType.GoPrevious, this.options_);
            const goButton = HtmlHelper_1.default.createAnchor_((event) => {
                const moveDirection = isForward ? ViewModel_1.MoveDirection_.Left : ViewModel_1.MoveDirection_.Right;
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
            }
            else {
                this.goBackElement_ = goButton;
            }
            return goElement;
        }
        updateGoElement_(viewModel, isForward) {
            const goElement = isForward ? this.goForwardElement_ : this.goBackElement_;
            goElement.style.visibility = viewModel.canGoDirection_(isForward) ? 'visible' : 'hidden';
            this.updateTitle_(goElement, viewModel.yearSelectionState_
                ? (isForward ? Translator_1.TitleName.GoForwardTableOfYears : Translator_1.TitleName.GoBackTableOfYears)
                : (isForward ? Translator_1.TitleName.GoForward : Translator_1.TitleName.GoBack));
        }
        createMonthElement_(viewModel) {
            const options = [];
            for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
                options.push({
                    value: monthNumber + '',
                    label: this.translateMonth_(monthNumber),
                });
            }
            const selectElement = HtmlHelper_1.default.createSelectInput_(options, (event, monthNumber) => {
                const currentMonth = viewModel.getCurrentMonth_();
                const newMonth = new Date(currentMonth.getTime());
                newMonth.setMonth(parseInt(monthNumber, 10));
                if (!viewModel.goToMonth_(event, newMonth)) {
                    this.monthSelect_.value = currentMonth.getMonth() + '';
                }
            }, this.options_);
            const monthElement = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderMonth, this.options_);
            const monthContent = HtmlHelper_1.default.createSpan_();
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
            this.updateTitle_(this.monthSelect_, Translator_1.TitleName.Month);
            if (!this.options_.isMonthAsDropdown()) {
                this.monthSelect_.style.display = 'none';
                this.monthElement_.style.display = '';
                return;
            }
            let valuesCount = 0;
            for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
                const newMonth = new Date(viewModel.getCurrentMonth_().getTime());
                newMonth.setMonth(monthNumber);
                const option = this.monthSelect_.getElementsByTagName('option')[monthNumber];
                const canGoToMonth = viewModel.canGoToMonth_(newMonth);
                option.disabled = !canGoToMonth;
                option.style.display = canGoToMonth ? '' : 'none';
                valuesCount += canGoToMonth ? 1 : 0;
            }
            this.monthSelect_.value = currentMonth + '';
            const showSelect = !this.options_.isDropdownWithOneItemHidden() || valuesCount > 1;
            this.monthSelect_.style.display = showSelect ? '' : 'none';
            this.monthElement_.style.display = showSelect ? 'none' : '';
        }
        createYearElement_(viewModel) {
            const yearElement = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderYear, this.options_);
            let yearActiveElement;
            if (this.options_.isYearSelectedFromTableOfYears()) {
                yearActiveElement = HtmlHelper_1.default.createAnchor_(() => {
                    this.slideTable_(viewModel, viewModel.yearSelectionState_ ? ViewModel_1.MoveDirection_.Up : ViewModel_1.MoveDirection_.Down, () => {
                        viewModel.setYearSelectionActive_(!viewModel.yearSelectionState_);
                    });
                }, this.options_);
                HtmlHelper_1.default.addClass_(yearActiveElement, ClassNames_1.ClassNameType.HeaderYearsToggle, this.options_);
            }
            else {
                yearActiveElement = HtmlHelper_1.default.createSelectInput_([], (event, year) => {
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
                        this.yearActiveElement_.value = currentMonth.getFullYear() + '';
                    }
                }, this.options_);
            }
            const yearTextElement = HtmlHelper_1.default.createSpan_();
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
            this.yearTextElement_.innerText = currentYear + '';
            this.updateTitle_(this.yearActiveElement_, Translator_1.TitleName.Year);
            const minYear = this.options_.getMinDate_().getFullYear();
            const maxYear = this.options_.getMaxDate_().getFullYear();
            if (this.tableOfYearsElement_) {
                this.yearActiveElement_.innerText = currentYear + '';
                if (viewModel.isYearSelectionToggleButtonFocused_) {
                    this.yearActiveElement_.focus();
                    viewModel.isYearSelectionToggleButtonFocused_ = false;
                }
            }
            else if (this.options_.isYearAsDropdown()) {
                const range = this.calculateDropdownRange_(currentYear, minYear, maxYear);
                const options = this.yearActiveElement_.getElementsByTagName('option');
                const diff = this.calculateDropdownDiff_(options, range, (value) => {
                    return parseInt(value, 10);
                });
                for (let index = 0; index < diff.remove.length; index++) {
                    this.yearActiveElement_.removeChild(diff.remove[index]);
                }
                for (let index = diff.prepend.length - 1; index >= 0; index--) {
                    this.yearActiveElement_.insertBefore(HtmlHelper_1.default.createSelectOption_(diff.prepend[index] + '', diff.prepend[index] + ''), this.yearActiveElement_.firstChild);
                }
                for (let index = 0; index < diff.append.length; index++) {
                    this.yearActiveElement_.appendChild(HtmlHelper_1.default.createSelectOption_(diff.append[index] + '', diff.append[index] + ''));
                }
                this.yearActiveElement_.value = currentYear + '';
            }
            else {
                this.yearActiveElement_.style.display = 'none';
                this.yearTextElement_.style.display = '';
                return;
            }
            const showSelect = !this.options_.isDropdownWithOneItemHidden() || minYear !== maxYear;
            this.yearActiveElement_.style.display = showSelect ? '' : 'none';
            this.yearTextElement_.style.display = showSelect ? 'none' : '';
        }
        createMonthAndYearElement_(viewModel) {
            const monthAndYear = HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.HeaderMonthYear, this.options_);
            const selectElement = HtmlHelper_1.default.createSelectInput_([], (event, value) => {
                const currentMonth = viewModel.getCurrentMonth_();
                let newMonth = new Date(currentMonth.getTime());
                const data = this.parseMonthAndYearOptionValue_(value);
                newMonth.setFullYear(data.year);
                newMonth.setMonth(data.month);
                if (!viewModel.goToMonth_(event, newMonth)) {
                    this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_({
                        month: currentMonth.getMonth(),
                        year: currentMonth.getFullYear(),
                    });
                }
            }, this.options_);
            const monthAndYearContent = HtmlHelper_1.default.createSpan_();
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
                year: currentMonth.getFullYear(),
            };
            const currentIndex = this.calculateMonthAndYearIndex_(currentData);
            this.monthAndYearElement_.innerText = this.translateMonthAndYear_(currentData);
            if (!this.options_.isYearAsDropdown() || !this.options_.isMonthAsDropdown()) {
                this.monthAndYearSelect_.style.display = 'none';
                this.monthAndYearElement_.style.display = '';
                return;
            }
            const minDate = this.options_.getMinDate_();
            const maxDate = this.options_.getMaxDate_();
            const minIndex = minDate.getFullYear() * 12 + minDate.getMonth();
            const maxIndex = maxDate.getFullYear() * 12 + maxDate.getMonth();
            const range = this.calculateDropdownRange_(currentIndex, minIndex, maxIndex);
            const options = this.monthAndYearSelect_.getElementsByTagName('option');
            const diff = this.calculateDropdownDiff_(options, range, (value) => {
                return this.calculateMonthAndYearIndex_(this.parseMonthAndYearOptionValue_(value));
            });
            for (let index = 0; index < diff.remove.length; index++) {
                this.monthAndYearSelect_.removeChild(diff.remove[index]);
            }
            for (let index = diff.prepend.length - 1; index >= 0; index--) {
                const data = this.getMonthAndYearByIndex_(diff.prepend[index]);
                this.monthAndYearSelect_.insertBefore(HtmlHelper_1.default.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)), this.monthAndYearSelect_.firstChild);
            }
            for (let index = 0; index < diff.append.length; index++) {
                const data = this.getMonthAndYearByIndex_(diff.append[index]);
                this.monthAndYearSelect_.appendChild(HtmlHelper_1.default.createSelectOption_(this.getMonthAndYearOptionValue_(data), this.translateMonthAndYear_(data)));
            }
            this.monthAndYearSelect_.value = this.getMonthAndYearOptionValue_(currentData);
            const showSelect = !this.options_.isDropdownWithOneItemHidden() || range.from < range.to;
            this.monthAndYearSelect_.style.display = showSelect ? '' : 'none';
            this.monthAndYearElement_.style.display = showSelect ? 'none' : '';
        }
        translateMonthAndYear_(data) {
            return this.translateMonth_(data.month) + ' ' + data.year;
        }
        calculateMonthAndYearIndex_(data) {
            return data.year * 12 + data.month;
        }
        getMonthAndYearByIndex_(index) {
            return {
                year: Math.floor(index / 12),
                month: index % 12,
            };
        }
        getMonthAndYearOptionValue_(data) {
            return data.year + '-' + data.month;
        }
        parseMonthAndYearOptionValue_(value) {
            const parts = value.split('-');
            return {
                month: parseInt(parts[1], 10),
                year: parseInt(parts[0], 10),
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
            }
            else if (to > max) {
                from -= to - max;
                if (from < min) {
                    from = min;
                }
                to = max;
            }
            return {
                from,
                to,
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
                }
                else if (value > lastOption) {
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
                remove,
            };
        }
        createTableElement_(viewModel) {
            const tableHeader = this.createTableHeaderElement_(viewModel);
            const tableBody = this.createTableBodyElement_(viewModel);
            const table = HtmlHelper_1.default.createTable_(tableHeader, tableBody, ClassNames_1.ClassNameType.CalendarTable, this.options_);
            HtmlHelper_1.default.addClass_(table, ClassNames_1.ClassNameType.Table, this.options_);
            return table;
        }
        createTableHeaderElement_(viewModel) {
            const weekDays = viewModel.getWeekDays_();
            const cells = [];
            for (let index = 0; index < weekDays.length; index++) {
                const dayOfWeek = weekDays[index];
                cells.push(this.createTableHeaderCellElement_(viewModel, dayOfWeek));
            }
            return HtmlHelper_1.default.createTableHeader_(cells, ClassNames_1.ClassNameType.CalendarTableHeader, this.options_);
        }
        createTableHeaderCellElement_(viewModel, dayOfWeek) {
            const headerCell = HtmlHelper_1.default.createTableHeaderCell_(ClassNames_1.ClassNameType.CalendarTableHeaderCell, this.options_);
            if (dayOfWeek === Helper_1.DayOfWeek.Saturday || dayOfWeek === Helper_1.DayOfWeek.Sunday) {
                HtmlHelper_1.default.addClass_(headerCell, ClassNames_1.ClassNameType.WeekDayWeekend, this.options_);
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
            return HtmlHelper_1.default.createTableBody_(rows, ClassNames_1.ClassNameType.CalendarTableBody, this.options_);
        }
        updateWeeksElements_(viewModel) {
            if (viewModel.yearSelectionState_) {
                return;
            }
            const weeks = viewModel.getWeeks_();
            for (let weekIndex = 0; weekIndex < this.weeksElements_.length; weekIndex++) {
                const weekElement = this.weeksElements_[weekIndex];
                const week = weeks.length > weekIndex ? weeks[weekIndex] : null;
                weekElement.style.display = week ? '' : 'none';
                if (week) {
                    for (let dayIndex = 0; dayIndex < this.daysElements_[weekIndex].length; dayIndex++) {
                        this.updateDayElement_(viewModel, this.daysElements_[weekIndex][dayIndex], this.daysButtonsElements_[weekIndex][dayIndex], this.daysContentsElements_[weekIndex][dayIndex], week[dayIndex]);
                    }
                }
            }
        }
        createTableRowElement_(viewModel) {
            const cells = [];
            const cellsButtons = [];
            const cellsContents = [];
            for (let index = 0; index < 7; index++) {
                const cell = HtmlHelper_1.default.createTableCell_();
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
            return HtmlHelper_1.default.createTableRow_(cells, this.options_);
        }
        updateDayElement_(viewModel, dayElement, dayButtonElement, dayContentElement, day) {
            dayButtonElement.day = day;
            dayElement.setAttribute('data-date', day.getFormatted());
            dayElement.className = '';
            HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.TableCell, this.options_);
            this.options_.updateCellStructure_(dayContentElement, day);
            if (!day.isVisible) {
                dayButtonElement.removeAttribute('href');
                dayButtonElement.style.visibility = 'hidden';
                return;
            }
            HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.Day, this.options_);
            if (day.isToday) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DayToday, this.options_);
            }
            if (day.isPast) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DayPast, this.options_);
            }
            if (day.isWeekend) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DayWeekend, this.options_);
            }
            if (!day.isAvailable) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.TableCellUnavailable, this.options_);
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DayUnavailable, this.options_);
            }
            if (!day.isInCurrentMonth) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DayOutside, this.options_);
            }
            if (day.isHighlighted) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.TableCellHighlighted, this.options_);
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DayHighlighted, this.options_);
            }
            if (day.isSelected) {
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.TableCellSelected, this.options_);
                HtmlHelper_1.default.addClass_(dayElement, ClassNames_1.ClassNameType.DaySelected, this.options_);
            }
            const customClasses = this.options_.getCellClasses(day);
            for (let index = 0; index < customClasses.length; index++) {
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
        }
        createTableCellButtonElement_(viewModel) {
            const cellButton = HtmlHelper_1.default.createAnchor_((event) => {
                const previous = viewModel.selectedDate_;
                const isSelected = viewModel.selectDay_(event, cellButton.day, false, true, true);
                if (this.options_.isHiddenOnSelect() && (isSelected || (previous && cellButton.day.isEqualToDate(previous)))) {
                    viewModel.close_(event);
                }
            }, this.options_);
            HtmlHelper_1.default.addClass_(cellButton, ClassNames_1.ClassNameType.DayButton, this.options_);
            cellButton.onfocus = (event) => {
                viewModel.highlightDay_(event || window.event, cellButton.day);
            };
            cellButton.onmouseenter = (event) => {
                if (this.options_.getBeforeFocusListeners().length > 0 || this.options_.getFocusListeners().length > 0) {
                    viewModel.highlightDay_(event || window.event, cellButton.day, false, false);
                }
                else {
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
            HtmlHelper_1.default.addClass_(cellContent, ClassNames_1.ClassNameType.ButtonContent, this.options_);
            HtmlHelper_1.default.addClass_(cellContent, ClassNames_1.ClassNameType.DayButtonContent, this.options_);
            return cellContent;
        }
        createTableOfYearsElement_(viewModel) {
            const tableBody = this.createTableOfYearsBodyElement_(viewModel);
            const table = HtmlHelper_1.default.createTable_(null, tableBody, ClassNames_1.ClassNameType.YearsTable, this.options_);
            HtmlHelper_1.default.addClass_(table, ClassNames_1.ClassNameType.Table, this.options_);
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
            this.yearsRowsElements_ = rows;
            return HtmlHelper_1.default.createTableBody_(rows, ClassNames_1.ClassNameType.YearsTableBody, this.options_);
        }
        updateTableOfYearsRowsElements_(viewModel) {
            if (!viewModel.yearSelectionState_) {
                return;
            }
            const rows = viewModel.getYearsRows_();
            for (let rowIndex = 0; rowIndex < this.yearsRowsElements_.length; rowIndex++) {
                const rowElement = this.yearsRowsElements_[rowIndex];
                const cells = rows.length > rowIndex ? rows[rowIndex] : null;
                if (cells) {
                    for (let columnIndex = 0; columnIndex < this.yearsElements_[rowIndex].length; columnIndex++) {
                        this.updateTableOfYearsCellElement_(viewModel, this.yearsElements_[rowIndex][columnIndex], this.yearsButtonsElements_[rowIndex][columnIndex], this.yearsContentsElements_[rowIndex][columnIndex], cells[columnIndex]);
                    }
                }
            }
        }
        updateTableOfYearsCellElement_(viewModel, yearElement, yearButtonElement, yearContentElement, yearCellData) {
            yearButtonElement.yearCellData = yearCellData;
            yearElement.setAttribute('data-year', yearCellData.yearNumber + '');
            yearElement.className = '';
            HtmlHelper_1.default.addClass_(yearElement, ClassNames_1.ClassNameType.TableCell, this.options_);
            yearContentElement.innerText = yearCellData.yearNumber + '';
            if (yearCellData.isAvailable) {
                yearButtonElement.href = '#';
            }
            else {
                yearButtonElement.removeAttribute('href');
                if (this.options_.areYearsOutOfTableOfYearsVisible()) {
                    HtmlHelper_1.default.addClass_(yearElement, ClassNames_1.ClassNameType.TableCellUnavailable, this.options_);
                }
                else {
                    yearButtonElement.style.visibility = 'hidden';
                    return;
                }
            }
            if (yearCellData.isHighlighted) {
                HtmlHelper_1.default.addClass_(yearElement, ClassNames_1.ClassNameType.TableCellHighlighted, this.options_);
            }
            if (yearCellData.isSelected) {
                HtmlHelper_1.default.addClass_(yearElement, ClassNames_1.ClassNameType.TableCellSelected, this.options_);
            }
            yearButtonElement.style.visibility = 'visible';
            if (yearCellData.isFocused) {
                yearButtonElement.focus();
            }
        }
        createTableOfYearsRowElement_(viewModel) {
            const cells = [];
            const cellsButtons = [];
            const cellsContents = [];
            for (let index = 0; index < this.options_.getTableOfYearsColumnsCount(); index++) {
                const cell = HtmlHelper_1.default.createTableCell_();
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
            return HtmlHelper_1.default.createTableRow_(cells, this.options_);
        }
        createTableOfYearsCellButtonElement_(viewModel) {
            const cellButton = HtmlHelper_1.default.createAnchor_((event) => {
                const newMonth = new Date(cellButton.yearCellData.yearNumber, viewModel.getCurrentMonth_().getMonth(), 1);
                const correctMonth = this.options_.correctMonth(newMonth);
                if (correctMonth.getFullYear() === newMonth.getFullYear()) {
                    viewModel.goToMonth_(event, correctMonth);
                    viewModel.isYearSelectionToggleButtonFocused_ = true;
                    this.slideTable_(viewModel, ViewModel_1.MoveDirection_.Up, () => {
                        viewModel.setYearSelectionActive_(false);
                    });
                }
            }, this.options_);
            HtmlHelper_1.default.addClass_(cellButton, ClassNames_1.ClassNameType.YearCellButton, this.options_);
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
            const cellContent = HtmlHelper_1.default.createSpan_();
            HtmlHelper_1.default.addClass_(cellContent, ClassNames_1.ClassNameType.ButtonContent, this.options_);
            HtmlHelper_1.default.addClass_(cellContent, ClassNames_1.ClassNameType.YearCellButtonContent, this.options_);
            return cellContent;
        }
        slideTable_(viewModel, moveDirection, onComplete) {
            if (!this.options_.isSlideAnimationEnabled() || !Helper_1.default.isCssAnimationSupported_()) {
                onComplete();
                return;
            }
            const trigger = () => {
                let animationOut;
                let animationIn;
                switch (moveDirection) {
                    case ViewModel_1.MoveDirection_.Left:
                        animationOut = ClassNames_1.ClassNameType.AnimateFadeOutLeft;
                        animationIn = ClassNames_1.ClassNameType.AnimateFadeInRight;
                        break;
                    case ViewModel_1.MoveDirection_.Up:
                        animationOut = ClassNames_1.ClassNameType.AnimateFadeOutUp;
                        animationIn = ClassNames_1.ClassNameType.AnimateFadeInDown;
                        break;
                    case ViewModel_1.MoveDirection_.Right:
                        animationOut = ClassNames_1.ClassNameType.AnimateFadeOutRight;
                        animationIn = ClassNames_1.ClassNameType.AnimateFadeInLeft;
                        break;
                    case ViewModel_1.MoveDirection_.Down:
                        animationOut = ClassNames_1.ClassNameType.AnimateFadeOutDown;
                        animationIn = ClassNames_1.ClassNameType.AnimateFadeInUp;
                        break;
                }
                const originalClassName = this.tablesElement_.className;
                const animate = (type) => {
                    HtmlHelper_1.default.addClass_(this.tablesElement_, ClassNames_1.ClassNameType.Animated, this.options_);
                    HtmlHelper_1.default.addClass_(this.tablesElement_, type, this.options_);
                };
                const onAfterSlide = () => {
                    if (this.onAfterSlide_.length > 0) {
                        this.onAfterSlide_.shift()();
                    }
                    else {
                        this.onAfterSlide_ = null;
                    }
                };
                let listenerRemover;
                const timeoutId = window.setTimeout(() => {
                    listenerRemover();
                    onComplete();
                    onAfterSlide();
                }, 150);
                listenerRemover = Helper_1.default.addEventListener_(this.tablesElement_, Helper_1.ListenerType_.AnimationEnd, () => {
                    window.clearTimeout(timeoutId);
                    onComplete();
                    listenerRemover();
                    this.tablesElement_.className = originalClassName;
                    animate(animationIn);
                    listenerRemover = Helper_1.default.addEventListener_(this.tablesElement_, Helper_1.ListenerType_.AnimationEnd, () => {
                        listenerRemover();
                        this.tablesElement_.className = originalClassName;
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
        }
        translateMonth_(monthNumber) {
            return this.options_.isMonthShort()
                ? this.options_.translator.translateMonthShort(monthNumber)
                : this.options_.translator.translateMonth(monthNumber);
        }
        updateTitle_(element, titleName) {
            const title = this.options_.translator.translateTitle(titleName);
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
        }
    }
    exports.default = Template_;
});
