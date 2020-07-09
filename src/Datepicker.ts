namespace TheDatepicker {

	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo mělo by smysl držet identitu dní?
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo static metody šětří výkon
	// todo editovatelný titulek pro deselect button
	// todo proč výběr data volá Template.render() tolikrát?
	// todo setActive má odlišný interface (vrací true tam kde jiný metody vrací false) - deal with it?
	// todo pořád tam existuje mezírka kdy není hover nad žádným dnem
	// todo v IE 9 se spontáně blurne input
	// todo po kliku na deselect button by se to nemělo otevírat (pokud otevřený bylo tak zůstat otevřený)
	// todo createDay zviditelnit z venku aby si případně mohl zjistit jaké vlastnosti den má
	// todo onOpen a onClose přecejen? (společně vedle onOpenAndClose)
	// todo používat a || b místo a !== null ? a : b
	//      !a místo a === null    ??
	// todo lepší parser datumu ("1. January -30 years")
	// todo multiselect, rangeselect, multirangeselect (spíše umožnist propojit více datepickerů)
	// todo favicona
	// todo nastavení css tříd - pokud nastaví null, tak se třída nepřidá
	// todo všechny definice anonymních fcí můřou mít return typehint
	// todo v optionech kterým se předává callback by bylo fajn dostat se k datepickeru (on* už se předává v this)
	// todo proč styly containeru a deselectu nemám v css?
	// todo jak do dp dostat volitelně fullscreen na malym breakpointu?
	// todo měly by další callbacky smysl vrstvit podobně jako addCellClassesResolver ?
	// todo vyhazovat vlastní instanci Error v options? (není BC problém?)
	// todo je potřeba používat typeof 'undefined'? nestačilo by jen if (x) ...? (mám na pár místech)
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
	// todo LICENSE file (issue)
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
			if (input !== null && !Helper_.isElement_(input)) {
				throw new Error('Input was expected to be null or an HTMLElement.');
			}
			if (container !== null && !Helper_.isElement_(container)) {
				throw new Error('Container was expected to be null or an HTMLElement.');
			}
			if (input === null && container === null) {
				throw new Error('At least one of input or container is mandatory.');
			}
			if (options !== null && !(options instanceof Options)) {
				throw new Error('Options was expected to be an instance of Options');
			}

			this.document_ = document;
			this.options = options !== null ? options.clone() : new Options();

			const duplicateError = 'There is already a datepicker present on ';
			this.isContainerExternal_ = container !== null;
			if (container === null) {
				container = this.createContainer_();
				if (input !== null) {
					input.parentNode.insertBefore(container, input.nextSibling);
				}
			} else {
				if (typeof container.datepicker !== 'undefined') {
					throw new Error(duplicateError + 'container.');
				}
			}

			if (input !== null) {
				if (typeof input.datepicker !== 'undefined') {
					throw new Error(duplicateError + 'input.');
				}
				input.datepicker = this;
			}

			this.isInputTextBox_ = input !== null
				&& (typeof HTMLInputElement !== 'undefined' ? input instanceof HTMLInputElement : true)
				&& (input as HTMLInputElement).type === 'text';

			if (this.isInputTextBox_) {
				(input as HTMLInputElement).autocomplete = 'off';
			}

			container.datepicker = this;

			this.input = input;
			this.container = container;

			this.dateConverter_ = new DateConverter_(this.options);
			this.viewModel_ = new ViewModel_(this.options, this);

			this.triggerReady_(input);
			this.triggerReady_(container);
		}

		public render(): void {
			switch (this.initializationPhase_) {
				case InitializationPhase.Destroyed:
					return;

				case InitializationPhase.Initialized:
					this.viewModel_.render_();
					return;

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

					if (this.input !== null && this.options.isHiddenOnBlur()) {
						if (this.input === this.document_.activeElement) {
							this.initializationPhase_ = InitializationPhase.Ready;
							this.render();
							this.open();
							return;
						}

						this.inputListenerRemover_ = Helper_.addEventListener_(this.input, ListenerType_.Focus, (event: FocusEvent) => {
							this.open(event);
						});

						this.initializationPhase_ = InitializationPhase.Waiting;
						return;
					}

					this.initializationPhase_ = InitializationPhase.Ready;
					this.render();
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

			if (this.input !== null) {
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

			if (this.input !== null) {
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

			if (this.input !== null) {
				delete this.input.datepicker;
				this.removeInitialInputListener_();
				this.input = null;
			}

			if (this.deselectElement_ !== null) {
				this.deselectElement_.parentNode.removeChild(this.deselectElement_);
				this.deselectElement_ = null;
			}

			this.initializationPhase_ = InitializationPhase.Destroyed;
		}

		public selectDate(date: Date | string | null, doUpdateMonth = true, event: Event | null = null): boolean {
			return this.viewModel_.selectDay_(event, Helper_.normalizeDate_('Date', date, this.options), !!doUpdateMonth);
		}

		public getSelectedDate(): Date | null {
			return this.viewModel_.selectedDate_ !== null ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
		}

		public getSelectedDateFormatted(): string | null {
			return this.dateConverter_.formatDate_(this.options.getInputFormat(), this.viewModel_.selectedDate_);
		}

		public getCurrentMonth(): Date {
			return new Date(this.viewModel_.getCurrentMonth_().getTime());
		}

		public goToMonth(month: Date | string, event: Event | null = null): boolean {
			return this.viewModel_.goToMonth_(event, Helper_.normalizeDate_('Month', month, this.options));
		}

		public parseRawInput(): Date | null {
			return this.isInputTextBox_
				? this.dateConverter_.parseDate_(this.options.getInputFormat(), (this.input as HTMLInputElement).value)
				: null;
		}

		public readInput_(event: Event | null = null): boolean {
			if (!this.isInputTextBox_) {
				return false;
			}

			try {
				const date = this.parseRawInput();
				return date !== null
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

			if (this.deselectElement_ !== null) {
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
				promise = new Promise<TheDatepicker.Datepicker>((resolve: ReadyPromiseResolve) => {
					promiseResolve = resolve;
				});
			}

			if (typeof element.datepicker !== 'undefined' && element.datepicker instanceof Datepicker) {
				element.datepicker.triggerReadyListener_(callback, element);
				if (promiseResolve !== null) {
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
			if (!this.isInputTextBox_ || !this.options.isDeselectButtonShown() || this.deselectElement_ !== null) {
				return null;
			}

			const deselectElement = this.document_.createElement('span');
			deselectElement.style.position = 'absolute';
			const deselectButton = this.document_.createElement('a');
			deselectButton.innerHTML = this.options.getDeselectHtml();
			deselectButton.style.position = 'relative';
			deselectButton.style.left = '-0.8em';
			deselectButton.href = '#';
			deselectButton.onclick = (event: MouseEvent) => {
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
					if (date !== null) {
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

				const checkMiss = (event: Event) => {
					if (Datepicker.hasClickedViewModel_) {
						Datepicker.hasClickedViewModel_ = false;
					} else {
						Datepicker.activateViewModel_(event, null);
					}
				};

				Helper_.addEventListener_(this.document_, ListenerType_.MouseDown, checkMiss);
				Helper_.addEventListener_(this.document_, ListenerType_.FocusIn, checkMiss);
				Helper_.addEventListener_(this.document_, ListenerType_.KeyDown, (event: KeyboardEvent) => {
					if (Datepicker.activeViewModel_ !== null) {
						Datepicker.activeViewModel_.triggerKeyPress_(event);
					}
				});

				Datepicker.areGlobalListenersInitialized_ = true;
			}

			this.removeInitialInputListener_();

			const hit = (event: Event) => {
				Datepicker.activateViewModel_(event, this);
				Datepicker.hasClickedViewModel_ = true;
			};

			this.listenerRemovers_.push(Helper_.addEventListener_(this.container, ListenerType_.MouseDown, hit));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.container, ListenerType_.FocusIn, hit));

			if (this.deselectElement_ !== null) {
				this.listenerRemovers_.push(Helper_.addEventListener_(this.deselectElement_, ListenerType_.MouseDown, hit));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.deselectElement_, ListenerType_.FocusIn, hit));
			}

			if (this.input !== null) {
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.MouseDown, hit));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.Focus, hit));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.Blur, () => {
					this.updateInput_();
				}));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.KeyDown, (event: KeyboardEvent) => {
					Helper_.stopPropagation_(event);
				}));
				this.listenerRemovers_.push(Helper_.addEventListener_(this.input, ListenerType_.KeyUp, (event: KeyboardEvent) => {
					this.readInput_(event);
				}));
			}
		}

		private removeInitialInputListener_(): void {
			if (this.inputListenerRemover_ !== null) {
				this.inputListenerRemover_();
				this.inputListenerRemover_ = null;
			}
		}

		private triggerReady_(element: HTMLDatepickerElement): void {
			for (let index = Datepicker.readyListeners_.length - 1; index >= 0; index--) {
				const listener = Datepicker.readyListeners_[index];
				if (listener.element === element) {
					this.triggerReadyListener_(listener.callback, element);
					if (listener.promiseResolve !== null) {
						listener.promiseResolve(this);
					}
					Datepicker.readyListeners_.splice(index, 1);
				}
			}
		}

		private triggerReadyListener_(callback: ReadyListener | null, element: HTMLDatepickerElement): void {
			if (callback !== null) {
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
			while(parentElement !== null && !isNaN(parentElement.offsetLeft) && !isNaN(parentElement.offsetTop)) {
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

			if (mainElement !== null && (locateOver || locateLeft)) {
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
			const viewModel = datepicker !== null ? datepicker.viewModel_ : null;
			const activeViewModel = Datepicker.activeViewModel_;

			if (activeViewModel === viewModel) {
				return true;
			}

			if (activeViewModel !== null && !activeViewModel.setActive_(event, false)) {
				return false;
			}

			if (Datepicker.activeViewModel_ !== activeViewModel) {
				return true;
			}

			if (viewModel === null) {
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
