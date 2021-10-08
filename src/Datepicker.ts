namespace TheDatepicker {

	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo static metody šětří výkon
	// todo proč výběr data volá Template.render() tolikrát?
	// todo setActive má odlišný interface (vrací true tam kde jiný metody vrací false) - deal with it?
	// todo pořád tam existuje mezírka kdy není hover nad žádným dnem
	// todo v IE 9 se spontáně blurne input
	// todo po kliku na deselect button by se to nemělo otevírat (pokud otevřený bylo tak zůstat otevřený)
	// todo onOpen a onClose přecejen? (společně vedle onOpenAndClose)
	// todo lepší parser datumu ("1. January -30 years")
	// todo multiselect, rangeselect, multirangeselect (spíše umožnist propojit více datepickerů)
	// todo favicona
	// todo nastavení css tříd - pokud nastaví null, tak se třída nepřidá
	// todo v optionech kterým se předává callback by bylo fajn dostat se k datepickeru (on* už se předává v this)
	// todo proč styly containeru a deselectu nemám v css?
	// todo jak do dp dostat volitelně fullscreen na malym breakpointu?
	// todo vyhazovat vlastní instanci Error v options? (není BC problém?)
	// todo DateConverter apod. by se nemusely instanciovat pro každý dp (musely by se zbavit stavu - options)
	// todo volání options v kodu dp by mohlo být minifikovaný
	// todo HtmlHelper jako static třída
	// todo spoustu opakujících se volání přes helper aby se neminifikovaný volaly jen jednou (stojí to ale za to volání navíc?)
	// todo fix position by mělo počítat window bez scrollbarů, ale nevim jak to spolehlivě získat
	// todo setShowWeekDays, setShowNavigation (jde to udělat přes css)?
	// todo setVerticalLayout (tabulka převrácená o 90°)?
	// todo setWeekDayContentStructureResolver
	// todo setGoButtonContentStructureResolver ...
	// todo ARIA ?
	// todo zbavit se ts-ignore (https://stackoverflow.com/questions/32408306/how-to-use-es6-promises-with-typescript)
	// todo další formátery? https://www.php.net/manual/en/function.date.php
	// todo testy

	interface HTMLDatepickerInputElement extends HTMLElement {

		datepicker?: Datepicker;

	}

	interface HTMLDatepickerContainerElement extends HTMLElement {

		datepicker?: Datepicker;
		onfocusin?: (event: FocusEvent) => void;

	}

	type HTMLDatepickerElement = HTMLDatepickerInputElement | HTMLDatepickerContainerElement;

	interface DocumentInterface extends Document {

		onfocusin?: (event: FocusEvent) => void;

	}

	type ReadyListener = (datepicker: TheDatepicker.Datepicker, element: HTMLDatepickerElement) => void;

	type ReadyPromiseResolve = (datepicker: TheDatepicker.Datepicker) => void;

	interface DatepickerReadyListener {

		promiseResolve: ReadyPromiseResolve | null;
		element: HTMLDatepickerElement;
		callback: ReadyListener | null;

	}

	enum InitializationPhase {
		Untouched,
		Waiting,
		Ready,
		Initialized,
		Destroyed,
	}

	export class Datepicker {

		public readonly options: Options;

		public input: HTMLDatepickerInputElement | null;
		public readonly container: HTMLDatepickerContainerElement;

		private readonly document_: DocumentInterface;
		private readonly isContainerExternal_: boolean;
		private readonly isInputTextBox_: boolean;
		private readonly viewModel_: ViewModel_;
		private readonly dateConverter_: DateConverter_;

		private initializationPhase_ = InitializationPhase.Untouched;
		private inputListenerRemover_: (() => void) | null = null;
		private listenerRemovers_: (() => void)[] = [];
		private deselectElement_: HTMLSpanElement | null = null;

		private static readyListeners_: DatepickerReadyListener[] = [];
		private static areGlobalListenersInitialized_ = false;
		private static activeViewModel_: ViewModel_ | null = null;
		private static hasClickedViewModel_ = false;

		public constructor(
			input: HTMLDatepickerInputElement | null,
			container: HTMLDatepickerContainerElement | null = null,
			options: Options | null = null
		) {
			if (input && !Helper_.isElement_(input)) {
				throw new Error('Input was expected to be null or an HTMLElement.');
			}
			if (container && !Helper_.isElement_(container)) {
				throw new Error('Container was expected to be null or an HTMLElement.');
			}
			if (!input && !container) {
				throw new Error('At least one of input or container is mandatory.');
			}
			if (options && !(options instanceof Options)) {
				throw new Error('Options was expected to be an instance of Options');
			}

			this.document_ = document;
			this.options = options ? options.clone() : new Options();

			const duplicateError = 'There is already a datepicker present on ';
			this.isContainerExternal_ = !!container;
			if (!container) {
				container = this.createContainer_();
				if (input) {
					input.parentNode.insertBefore(container, input.nextSibling);
				}
			} else {
				if (container.datepicker) {
					throw new Error(duplicateError + 'container.');
				}
			}

			if (input) {
				if (input.datepicker) {
					throw new Error(duplicateError + 'input.');
				}
				input.datepicker = this;
			}

			this.isInputTextBox_ = input
				&& (typeof HTMLInputElement !== 'undefined' ? input instanceof HTMLInputElement : true)
				&& (input as HTMLInputElement).type === 'text';

			if (this.isInputTextBox_) {
				(input as HTMLInputElement).autocomplete = 'off';
			}

			container.datepicker = this;

			this.input = input;
			this.container = container;

			this.dateConverter_ = new DateConverter_(this.options);
			this.viewModel_ = new ViewModel_(this.options, this, this.dateConverter_);

			this.triggerReady_(input);
			this.triggerReady_(container);
		}

		public render(): void {
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

					if (this.input && this.options.isHiddenOnBlur()) {
						if (this.input === this.document_.activeElement) {
							this.initializationPhase_ = InitializationPhase.Ready;
							this.render();
							this.open();
							return;
						}

						this.inputListenerRemover_ = Helper_.addEventListener_(this.input, ListenerType_.Focus, (event: FocusEvent): void => {
							this.open(event);
						});

						this.initializationPhase_ = InitializationPhase.Waiting;
						return;
					}

					this.initializationPhase_ = InitializationPhase.Ready;
					this.render();

				default:
					this.viewModel_.render_();
					return;
			}
		}

		public open(event: Event | null = null): boolean {
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

			if (this.input) {
				this.input.focus();
			}

			return true;
		}

		public isOpened(): boolean {
			return this.viewModel_.isActive_();
		}

		public close(event: Event | null = null): boolean {
			if (!this.viewModel_.isActive_()) {
				return true;
			}

			if (!Datepicker.activateViewModel_(event, null)) {
				return false;
			}

			if (this.input) {
				this.input.blur();
			}

			return true;
		}

		public reset(event: Event | null = null): boolean {
			return this.viewModel_.reset_(event);
		}

		public destroy(): void {
			if (this.initializationPhase_ === InitializationPhase.Destroyed) {
				return;
			}

			for (let index = 0; index < this.listenerRemovers_.length; index++) {
				this.listenerRemovers_[index]();
			}
			this.listenerRemovers_ = [];

			if (this.isContainerExternal_) {
				this.container.innerHTML = '';
			} else {
				this.container.parentNode.removeChild(this.container);
			}
			delete this.container.datepicker;

			if (this.input) {
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

		public isDestroyed(): boolean {
			return this.initializationPhase_ === InitializationPhase.Destroyed;
		}

		public selectDate(date: Date | string | null, doUpdateMonth = true, event: Event | null = null): boolean {
			return this.viewModel_.selectDay_(event, Helper_.normalizeDate_('Date', date, true, this.options), !!doUpdateMonth);
		}

		public getSelectedDate(): Date | null {
			return this.viewModel_.selectedDate_ ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
		}

		public getSelectedDateFormatted(): string | null {
			return this.dateConverter_.formatDate_(this.options.getInputFormat(), this.viewModel_.selectedDate_);
		}

		public getCurrentMonth(): Date {
			return new Date(this.viewModel_.getCurrentMonth_().getTime());
		}

		public goToMonth(month: Date | string, event: Event | null = null): boolean {
			return this.viewModel_.goToMonth_(event, Helper_.normalizeDate_('Month', month, false, this.options));
		}

		public parseRawInput(): Date | null {
			return this.isInputTextBox_
				? this.dateConverter_.parseDate_(this.options.getInputFormat(), (this.input as HTMLInputElement).value)
				: null;
		}

		public getDay(date: Date | string): Day {
			return this.viewModel_.createDay_(Helper_.normalizeDate_('Date', date, false, this.options));
		}

		public readInput_(event: Event | null = null): boolean {
			if (!this.isInputTextBox_) {
				return false;
			}

			try {
				const date = this.parseRawInput();
				return date
					? this.viewModel_.selectNearestDate_(event, date)
					: this.viewModel_.cancelSelection_(event);

			} catch (error) {
				if (!(error instanceof CannotParseDateException)) {
					throw error;
				}

				return false;
			}
		}

		public updateInput_(): void {
			if (!this.isInputTextBox_ || this.input === this.document_.activeElement) {
				return;
			}

			(this.input as HTMLInputElement).value = this.dateConverter_.formatDate_(this.options.getInputFormat(), this.viewModel_.selectedDate_) || '';

			if (this.deselectElement_) {
				const isVisible = this.options.isDeselectButtonShown() && (this.input as HTMLInputElement).value !== '';
				this.deselectElement_.style.visibility = isVisible ? 'visible' : 'hidden';
			}
		}

		public static onDatepickerReady(element: HTMLDatepickerElement, callback: ReadyListener | null = null): Promise<TheDatepicker.Datepicker> | null {
			if (!Helper_.isElement_(element)) {
				throw new Error('Element was expected to be an HTMLElement.');
			}
			callback = Helper_.checkFunction_('Callback', callback) as (ReadyListener | null);

			let promise = null;
			let promiseResolve: ReadyPromiseResolve | null = null;
			// @ts-ignore
			if (typeof Promise !== 'undefined') {
				// @ts-ignore
				promise = new Promise<TheDatepicker.Datepicker>((resolve: ReadyPromiseResolve): void => {
					promiseResolve = resolve;
				});
			}

			if (element.datepicker && element.datepicker instanceof Datepicker) {
				element.datepicker.triggerReadyListener_(callback, element);
				if (promiseResolve) {
					promiseResolve(element.datepicker);
				}

			} else {
				Datepicker.readyListeners_.push({
					promiseResolve,
					element,
					callback
				});
			}

			return promise;
		};

		private createContainer_(): HTMLElement {
			const container = this.document_.createElement('div');
			container.className = this.options.prefixClass_('container');
			container.style.position = 'absolute';
			container.style.zIndex = '99';

			return container;
		}

		private createDeselectElement_(): HTMLElement | null {
			if (!this.isInputTextBox_ || !this.options.isDeselectButtonShown() || this.deselectElement_) {
				return null;
			}

			const deselectElement = this.document_.createElement('span');
			deselectElement.style.position = 'absolute';
			const deselectButton = this.document_.createElement('a');
			deselectButton.innerHTML = this.options.getDeselectHtml();
			const title = this.options.translator.translateTitle(TitleName.Deselect);
			if (title !== '') {
				deselectButton.title = title;
			}
			deselectButton.style.position = 'relative';
			deselectButton.style.left = '-0.8em';
			deselectButton.href = '#';
			deselectButton.onclick = (event: MouseEvent): void => {
				event = event || window.event as MouseEvent;
				Helper_.preventDefault_(event);
				this.viewModel_.cancelSelection_(event);
			};
			deselectElement.className = this.options.prefixClass_('deselect');
			deselectButton.className = this.options.prefixClass_('deselect-button');
			deselectElement.appendChild(deselectButton);

			this.input.parentNode.insertBefore(deselectElement, this.input.nextSibling);
			this.deselectElement_ = deselectElement;
		}

		private preselectFromInput_(): void {
			if (this.isInputTextBox_) {
				try {
					const date = this.parseRawInput();
					if (date) {
						this.options.setInitialDate(date);
					}
				} catch (error) {
					if (!(error instanceof CannotParseDateException)) {
						throw error;
					}
				}
			}
		}

		private initListeners_(): void {
			if (!Datepicker.areGlobalListenersInitialized_) {
				let activeViewModel: ViewModel_ | null = null;

				const checkMiss = (event: Event): void => {
					if (Datepicker.hasClickedViewModel_) {
						Datepicker.hasClickedViewModel_ = false;
					} else {
						Datepicker.activateViewModel_(event, null);
					}
				};

				Helper_.addEventListener_(this.document_, ListenerType_.MouseDown, checkMiss);
				Helper_.addEventListener_(this.document_, ListenerType_.FocusIn, checkMiss);
				Helper_.addEventListener_(this.document_, ListenerType_.KeyDown, (event: KeyboardEvent): void => {
					if (Datepicker.activeViewModel_) {
						Datepicker.activeViewModel_.triggerKeyPress_(event);
					}
				});

				Datepicker.areGlobalListenersInitialized_ = true;
			}

			this.removeInitialInputListener_();

			const hit = (event: Event): void => {
				Datepicker.activateViewModel_(event, this);
				Datepicker.hasClickedViewModel_ = true;
			};

			this.listenerRemovers_.push(Helper_.addEventListener_(this.container, ListenerType_.MouseDown, hit));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.container, ListenerType_.FocusIn, hit));

			if (this.deselectElement_) {
				this.listenerRemovers_.push(Helper_.addEventListener_(this.deselectElement_, ListenerType_.MouseDown, hit));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.deselectElement_, ListenerType_.FocusIn, hit));
			}

			if (this.input) {
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.MouseDown, hit));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.Focus, hit));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.Blur, (): void => {
					this.updateInput_();
				}));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.KeyDown, (event: KeyboardEvent): void => {
					Helper_.stopPropagation_(event);
				}));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.KeyUp, (event: KeyboardEvent): void => {
					this.readInput_(event);
				}));
			}
		}

		private removeInitialInputListener_(): void {
			if (this.inputListenerRemover_) {
				this.inputListenerRemover_();
				this.inputListenerRemover_ = null;
			}
		}

		private triggerReady_(element: HTMLDatepickerElement): void {
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

		private triggerReadyListener_(callback: ReadyListener | null, element: HTMLDatepickerElement): void {
			if (callback) {
				callback.call(element, this, element);
			}
		}

		private fixPosition_(): void {
			if (this.isContainerExternal_ || this.initializationPhase_ === InitializationPhase.Destroyed) {
				return;
			}

			const windowTop = window.pageYOffset || this.document_.documentElement.scrollTop;
			const windowLeft = window.pageXOffset || this.document_.documentElement.scrollLeft;
			let viewportHeight = null;
			let viewportWidth = null;
			if ((window as any).visualViewport) {
				viewportHeight = (window as any).visualViewport.height;
				viewportWidth = (window as any).visualViewport.width;
			}
			const windowHeight = viewportHeight || window.innerHeight || Math.max(this.document_.documentElement.clientHeight, this.document_.body.clientHeight) || 0;
			const windowWidth = viewportWidth || window.innerWidth || Math.max(this.document_.documentElement.clientWidth, this.document_.body.clientWidth) || 0;
			const windowBottom = windowTop + windowHeight;
			const windowRight = windowLeft + windowWidth;

			let inputTop = 0;
			let inputLeft = 0;
			let parentElement: HTMLElement = this.input;
			while (parentElement && !isNaN(parentElement.offsetLeft) && !isNaN(parentElement.offsetTop)) {
				inputTop += parentElement.offsetTop - (parentElement.scrollTop || 0);
				inputLeft += parentElement.offsetLeft - (parentElement.scrollLeft || 0);
				parentElement = parentElement.offsetParent as HTMLElement;
			}

			let mainElement: HTMLElement | null = null;
			if (this.options.isPositionFixingEnabled() && this.container.childNodes.length > 0) {
				mainElement = this.container.childNodes[0] as HTMLElement;
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

			let locationClass = '';
			const locateOver = inputTop - windowTop > containerHeight && windowBottom - inputBottom < containerHeight;
			const locateLeft = inputLeft - windowLeft > containerWidth - inputWidth && windowRight - inputRight < containerWidth - inputWidth;
			if (locateOver) {
				locationClass += ' ' + this.options.prefixClass_('container--over');
			}
			if (locateLeft) {
				locationClass += ' ' + this.options.prefixClass_('container--left');
			}

			this.container.className = this.options.prefixClass_('container') + locationClass;

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

		private static activateViewModel_(event: Event | null, datepicker: Datepicker | null): boolean {
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
				Datepicker.activeViewModel_ = null;
				return true;
			}

			if (!viewModel.setActive_(event, true)) {
				return false;
			}

			if (Datepicker.activeViewModel_ !== activeViewModel) {
				return true;
			}

			datepicker.fixPosition_();

			Datepicker.activeViewModel_ = viewModel;

			return true;
		}

	}

	export const onDatepickerReady = Datepicker.onDatepickerReady;

}
