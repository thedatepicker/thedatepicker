define(["require", "exports", "./Options", "./ClassNames", "./Translator", "./DateConverter", "./Helper", "./HtmlHelper", "./ViewModel"], function (require, exports, Options_1, ClassNames_1, Translator_1, DateConverter_1, Helper_1, HtmlHelper_1, ViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onDatepickerReady = void 0;
    var InitializationPhase;
    (function (InitializationPhase) {
        InitializationPhase[InitializationPhase["Untouched"] = 0] = "Untouched";
        InitializationPhase[InitializationPhase["Waiting"] = 1] = "Waiting";
        InitializationPhase[InitializationPhase["Ready"] = 2] = "Ready";
        InitializationPhase[InitializationPhase["Initialized"] = 3] = "Initialized";
        InitializationPhase[InitializationPhase["Destroyed"] = 4] = "Destroyed";
    })(InitializationPhase || (InitializationPhase = {}));
    class Datepicker {
        constructor(input, container = null, options = null) {
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
            if (input && !Helper_1.default.isElement_(input)) {
                throw new Error('Input was expected to be null or an HTMLElement.');
            }
            if (container && !Helper_1.default.isElement_(container)) {
                throw new Error('Container was expected to be null or an HTMLElement.');
            }
            if (!input && !container) {
                throw new Error('At least one of input or container is mandatory.');
            }
            if (options && !(options instanceof Options_1.default)) {
                throw new Error('Options was expected to be an instance of Options');
            }
            Datepicker.document_ = document;
            this.options = options ? options.clone() : new Options_1.default();
            const duplicateError = 'There is already a datepicker present on ';
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
            this.viewModel_ = new ViewModel_1.default(this.options, this);
            this.triggerReady_(input);
            this.triggerReady_(container);
        }
        render() {
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
                        this.inputListenerRemover_ = Helper_1.default.addEventListener_(this.inputClickable_, Helper_1.ListenerType_.Focus, (event) => {
                            this.open(event);
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
        }
        open(event = null) {
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
        }
        isOpened() {
            return this.viewModel_.isActive_();
        }
        close(event = null) {
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
        }
        reset(event = null) {
            return this.viewModel_.reset_(event);
        }
        destroy() {
            if (this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            for (let index = 0; index < this.listenerRemovers_.length; index++) {
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
        }
        isDestroyed() {
            return this.initializationPhase_ === InitializationPhase.Destroyed;
        }
        selectDate(date, doUpdateMonth = true, event = null) {
            return this.viewModel_.selectDay_(event, Helper_1.default.normalizeDate_('Date', date, true, this.options), !!doUpdateMonth);
        }
        getSelectedDate() {
            return this.viewModel_.selectedDate_ ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
        }
        getSelectedDateFormatted() {
            return DateConverter_1.default.formatDate_(this.viewModel_.selectedDate_, this.options);
        }
        getCurrentMonth() {
            return new Date(this.viewModel_.getCurrentMonth_().getTime());
        }
        goToMonth(month, event = null) {
            return this.viewModel_.goToMonth_(event, Helper_1.default.normalizeDate_('Month', month, false, this.options));
        }
        parseRawInput() {
            return this.inputText_
                ? DateConverter_1.default.parseDate_(this.inputText_.value, this.options)
                : null;
        }
        getDay(date) {
            return this.viewModel_.createDay_(Helper_1.default.normalizeDate_('Date', date, false, this.options));
        }
        canType_(char) {
            if (!this.inputText_ || this.options.isAllowedInputAnyChar()) {
                return true;
            }
            return DateConverter_1.default.isValidChar_(char, this.options);
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
            }
            catch (error) {
                if (!(error instanceof DateConverter_1.CannotParseDateException)) {
                    throw error;
                }
            }
            return false;
        }
        updateInput_() {
            if (!this.inputText_ || this.inputText_ === Datepicker.document_.activeElement) {
                return;
            }
            this.inputText_.value = DateConverter_1.default.formatDate_(this.viewModel_.selectedDate_, this.options) || '';
            this.updateDeselectElement_();
        }
        static onDatepickerReady(element, callback = null) {
            if (!Helper_1.default.isElement_(element)) {
                throw new Error('Element was expected to be an HTMLElement.');
            }
            callback = Helper_1.default.checkFunction_('Callback', callback);
            let promise = null;
            let promiseResolve = null;
            if (typeof Promise !== 'undefined') {
                promise = new Promise((resolve) => {
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
                    promiseResolve,
                    element,
                    callback
                });
            }
            return promise;
        }
        ;
        createContainer_() {
            return HtmlHelper_1.default.createDiv_(ClassNames_1.ClassNameType.Container, this.options);
        }
        createDeselectElement_() {
            if (!this.inputText_ || !this.options.isDeselectButtonShown() || this.deselectElement_) {
                return null;
            }
            const deselectButton = HtmlHelper_1.default.createAnchor_((event) => {
                deselectButton.focus();
                this.viewModel_.cancelSelection_(event);
            }, this.options, ClassNames_1.ClassNameType.DeselectButton);
            deselectButton.innerHTML = this.options.getDeselectHtml();
            const title = this.options.translator.translateTitle(Translator_1.TitleName.Deselect);
            if (title !== '') {
                deselectButton.title = title;
            }
            const deselectElement = HtmlHelper_1.default.createSpan_();
            HtmlHelper_1.default.addClass_(deselectElement, ClassNames_1.ClassNameType.Deselect, this.options);
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
            this.deselectElement_.style.visibility = isVisible ? 'visible' : 'hidden';
        }
        preselectFromInput_() {
            if (this.inputText_) {
                try {
                    const date = this.parseRawInput();
                    if (date) {
                        this.options.setInitialDate(date);
                    }
                }
                catch (error) {
                    if (!(error instanceof DateConverter_1.CannotParseDateException)) {
                        throw error;
                    }
                }
            }
        }
        initListeners_() {
            if (!Datepicker.areGlobalListenersInitialized_) {
                const checkMiss = (event) => {
                    if (Datepicker.hasClickedViewModel_) {
                        Datepicker.hasClickedViewModel_ = false;
                    }
                    else {
                        Datepicker.activateViewModel_(event, null);
                    }
                };
                Helper_1.default.addEventListener_(Datepicker.document_, Helper_1.ListenerType_.MouseDown, checkMiss);
                Helper_1.default.addEventListener_(Datepicker.document_, Helper_1.ListenerType_.FocusIn, checkMiss);
                Helper_1.default.addEventListener_(Datepicker.document_, Helper_1.ListenerType_.KeyDown, (event) => {
                    if (Datepicker.activeViewModel_) {
                        Datepicker.activeViewModel_.triggerKeyPress_(event);
                    }
                });
                Datepicker.areGlobalListenersInitialized_ = true;
            }
            this.removeInitialInputListener_();
            const hit = (event) => {
                Datepicker.activateViewModel_(event, this);
                Datepicker.hasClickedViewModel_ = true;
            };
            this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.container, Helper_1.ListenerType_.MouseDown, hit));
            this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.container, Helper_1.ListenerType_.FocusIn, hit));
            if (this.deselectButton_) {
                const hitIfActive = (event) => {
                    if (this.viewModel_.isActive_()) {
                        hit(event);
                    }
                };
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.deselectButton_, Helper_1.ListenerType_.MouseDown, hitIfActive));
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.deselectButton_, Helper_1.ListenerType_.Focus, hitIfActive));
            }
            if (this.inputClickable_) {
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.inputClickable_, Helper_1.ListenerType_.MouseDown, hit));
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.inputClickable_, Helper_1.ListenerType_.Focus, hit));
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.inputClickable_, Helper_1.ListenerType_.Blur, () => {
                    this.updateInput_();
                }));
            }
            if (this.inputText_) {
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.inputText_, Helper_1.ListenerType_.KeyDown, (event) => {
                    Helper_1.default.stopPropagation_(event);
                    if (event.keyCode === Helper_1.KeyCode_.Esc && this.options.isClosedOnEscPress()) {
                        this.close(event);
                    }
                }));
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.inputText_, Helper_1.ListenerType_.KeyUp, (event) => {
                    this.readInput_(event);
                }));
                this.listenerRemovers_.push(Helper_1.default.addEventListener_(this.inputText_, Helper_1.ListenerType_.KeyPress, (event) => {
                    const charCode = event.charCode || event.keyCode;
                    if (charCode && !this.canType_(String.fromCharCode(charCode))) {
                        Helper_1.default.preventDefault_(event);
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
            for (let index = Datepicker.readyListeners_.length - 1; index >= 0; index--) {
                const listener = Datepicker.readyListeners_[index];
                if (listener.element === element) {
                    this.triggerReadyListener_(listener.callback, element);
                    if (listener.promiseResolve) {
                        listener.promiseResolve(this);
                    }
                    Datepicker.readyListeners_.splice(index, 1);
                }
            }
        }
        triggerReadyListener_(callback, element) {
            if (callback) {
                callback.call(element, this, element);
            }
        }
        onActivate_() {
            if (this.initializationPhase_ === InitializationPhase.Destroyed) {
                return;
            }
            this.updateContainer_();
            if (this.inputText_) {
                this.inputText_.readOnly = !this.options.isKeyboardOnMobile() && Helper_1.default.isMobile_();
            }
        }
        updateContainer_() {
            if (this.isContainerExternal_) {
                return;
            }
            const windowTop = window.pageYOffset || Datepicker.document_.documentElement.scrollTop;
            const windowLeft = window.pageXOffset || Datepicker.document_.documentElement.scrollLeft;
            let viewportHeight = null;
            let viewportWidth = null;
            if (window.visualViewport) {
                viewportHeight = window.visualViewport.height;
                viewportWidth = window.visualViewport.width;
            }
            const windowHeight = viewportHeight || window.innerHeight || Math.max(Datepicker.document_.documentElement.clientHeight, Datepicker.document_.body.clientHeight) || 0;
            const windowWidth = viewportWidth || window.innerWidth || Math.max(Datepicker.document_.documentElement.clientWidth, Datepicker.document_.body.clientWidth) || 0;
            const windowBottom = windowTop + windowHeight;
            const windowRight = windowLeft + windowWidth;
            let inputTop = 0;
            let inputLeft = 0;
            let parentElement = this.input;
            while (parentElement && !isNaN(parentElement.offsetLeft) && !isNaN(parentElement.offsetTop)) {
                inputTop += parentElement.offsetTop - (parentElement.scrollTop || 0);
                inputLeft += parentElement.offsetLeft - (parentElement.scrollLeft || 0);
                parentElement = parentElement.offsetParent;
            }
            let mainElement = null;
            if (this.options.isPositionFixingEnabled() && this.container.childNodes.length > 0) {
                mainElement = this.container.childNodes[0];
                mainElement.style.position = '';
                mainElement.style.top = '';
                mainElement.style.left = '';
            }
            const inputWidth = this.input.offsetWidth;
            const inputHeight = this.input.offsetHeight;
            const inputBottom = inputTop + inputHeight;
            const inputRight = inputLeft + inputWidth;
            const containerHeight = this.container.offsetHeight;
            const containerWidth = this.container.offsetWidth;
            this.container.className = '';
            HtmlHelper_1.default.addClass_(this.container, ClassNames_1.ClassNameType.Container, this.options);
            const locateOver = inputTop - windowTop > containerHeight && windowBottom - inputBottom < containerHeight;
            const locateLeft = inputLeft - windowLeft > containerWidth - inputWidth && windowRight - inputRight < containerWidth - inputWidth;
            if (locateOver) {
                HtmlHelper_1.default.addClass_(this.container, ClassNames_1.ClassNameType.ContainerOver, this.options);
            }
            if (locateLeft) {
                HtmlHelper_1.default.addClass_(this.container, ClassNames_1.ClassNameType.ContainerLeft, this.options);
            }
            if (this.options.isFullScreenOnMobile()) {
                HtmlHelper_1.default.addClass_(this.container, ClassNames_1.ClassNameType.ContainerResponsive, this.options);
            }
            if (this.options.isDarkModeEnabled()) {
                HtmlHelper_1.default.addClass_(this.container, ClassNames_1.ClassNameType.ContainerDarkMode, this.options);
            }
            if (mainElement && (locateOver || locateLeft)) {
                if (locateOver) {
                    const moveTop = inputHeight + containerHeight;
                    mainElement.style.top = '-' + moveTop + 'px';
                }
                if (locateLeft) {
                    const moveLeft = containerWidth - inputWidth;
                    mainElement.style.left = '-' + moveLeft + 'px';
                }
                mainElement.style.position = 'absolute';
            }
        }
        static setBodyClass_(enable) {
            const pageClass = 'the-datepicker-page';
            const body = Datepicker.document_.body;
            const className = body.className;
            const hasClass = className.indexOf(pageClass) > -1;
            if (!hasClass && enable) {
                body.className += (className.length > 0 ? ' ' : '') + pageClass;
            }
            else if (hasClass && !enable) {
                let search = pageClass;
                if (className.indexOf(' ' + pageClass) > -1) {
                    search = ' ' + pageClass;
                }
                else if (className.indexOf(pageClass + ' ') > -1) {
                    search = pageClass + ' ';
                }
                body.className = className.replace(search, '');
            }
        }
        static activateViewModel_(event, datepicker) {
            const viewModel = datepicker ? datepicker.viewModel_ : null;
            const activeViewModel = Datepicker.activeViewModel_;
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
        }
    }
    exports.default = Datepicker;
    Datepicker.readyListeners_ = [];
    Datepicker.areGlobalListenersInitialized_ = false;
    Datepicker.activeViewModel_ = null;
    Datepicker.hasClickedViewModel_ = false;
    exports.onDatepickerReady = Datepicker.onDatepickerReady;
});
