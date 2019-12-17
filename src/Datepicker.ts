/// <reference path="DateConverter.ts" />

namespace TheDatepicker {

	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo mělo by smysl držet identitu dní?
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo static metody šětří výkon
	// todo editovatelné titulky pro ikony (deselect, goToNow, close)
	// todo proč výběr data volá Template.render() tolikrát?
	// todo setActive má odlišný interface (vrací true tam kde jiný metody vrací false) - deal with it?
	// todo např třída CannotParseDateException se neminifikuje
	// todo pořád tam existuje mezírka kdy není hover nad žádným dnem
	// todo v IE 9 se spontáně blurne input
	// todo po kliku na deselect button by se to nemělo otevírat (pokud otevřený bylo tak zůstat otevřený)
	// todo createDay zviditelnit z venku aby si případně mohl zjistit jaké vlastnosti den má
	// todo onOpen a onClose přecejen? (společně vedle onOpenAndClose)
	// todo používat a || b místo a !== null ? a : b
	//      !a místo a === null    ??
	// todo lepší parser datumu ("1. January -30 years")
	// todo multiselect, rangeselect, multirangeselect

	interface HTMLDatepickerInputElement extends HTMLInputElement {

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
		public readonly viewModel: ViewModel;
		public readonly dateConverter: DateConverterInterface;

		public input: HTMLDatepickerInputElement | null;
		public readonly container: HTMLDatepickerContainerElement;

		private readonly document: DocumentInterface;
		private readonly isContainerExternal: boolean;

		private initializationPhase = InitializationPhase.Untouched;
		private inputListenerRemover: (() => void) | null = null;
		private listenerRemovers: (() => void)[] = [];
		private deselectElement: HTMLSpanElement | null = null;

		private static readyListeners: DatepickerReadyListener[] = [];
		private static areGlobalListenersInitialized = false;
		private static activeViewModel: ViewModel | null = null;
		private static hasClickedViewModel = false;

		public constructor(
			input: HTMLDatepickerInputElement | null,
			container: HTMLDatepickerContainerElement | null = null,
			options: Options | null = null
		) {
			if (input !== null && !Helper.isElement(input)) {
				throw new Error('Input was expected to be null or an HTMLElement.');
			}
			if (container !== null && !Helper.isElement(container)) {
				throw new Error('Container was expected to be null or an HTMLElement.');
			}
			if (input === null && container === null) {
				throw new Error('At least one of input or container is mandatory.');
			}
			if (options !== null && !(options instanceof Options)) {
				throw new Error('Options was expected to be an instance of Options');
			}

			this.document = document;
			this.options = options !== null ? options.clone() : new Options();

			const duplicateError = 'There is already a datepicker present on ';
			this.isContainerExternal = container !== null;
			if (container === null) {
				container = this.createContainer();
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
				input.autocomplete = 'off';
			}
			container.datepicker = this;

			this.input = input;
			this.container = container;

			this.dateConverter = new DateConverter(this.options);
			this.viewModel = new ViewModel(this.options, this);

			this.triggerReady(input);
			this.triggerReady(container);
		}

		public render(): void {
			switch (this.initializationPhase) {
				case InitializationPhase.Destroyed:
					return;

				case InitializationPhase.Initialized:
					this.viewModel.render();
					return;

				case InitializationPhase.Ready:
					this.initListeners();
					this.initializationPhase = InitializationPhase.Initialized;
					this.render();
					return;

				case InitializationPhase.Waiting:
					if (!this.options.isHiddenOnBlur()) {
						this.open();
						return;
					}

					this.viewModel.selectPossibleDate();
					this.updateDeselectButton();

					return;

				case InitializationPhase.Untouched:
					this.preselectFromInput();
					this.createDeselectElement();

					this.viewModel.selectInitialDate(null);
					this.updateInput();

					if (this.input !== null && this.options.isHiddenOnBlur()) {
						if (this.input === this.document.activeElement) {
							this.initializationPhase = InitializationPhase.Ready;
							this.render();
							this.open();
							return;
						}

						this.inputListenerRemover = Helper.addEventListener(this.input, ListenerType.Focus, (event: FocusEvent) => {
							this.open(event);
						});

						this.initializationPhase = InitializationPhase.Waiting;
						return;
					}

					this.initializationPhase = InitializationPhase.Ready;
					this.render();
			}
		}

		public open(event: Event | null = null): boolean {
			if (this.initializationPhase === InitializationPhase.Untouched) {
				this.render();
			}

			if (this.initializationPhase === InitializationPhase.Waiting) {
				this.initializationPhase = InitializationPhase.Ready;
				this.render();
				Datepicker.hasClickedViewModel = true;
			}

			if (!Datepicker.activateViewModel(event, this)) {
				return false;
			}

			if (this.input !== null) {
				this.input.focus();
			}

			return true;
		}

		public close(event: Event | null = null): boolean {
			if (!this.viewModel.isActive()) {
				return true;
			}

			if (!Datepicker.activateViewModel(event, null)) {
				return false;
			}

			if (this.input !== null) {
				this.input.blur();
			}

			return true;
		}

		public reset(event: Event | null = null): boolean {
			return this.viewModel.reset(event);
		}

		public destroy(): void {
			if (this.initializationPhase === InitializationPhase.Destroyed) {
				return;
			}

			for (let index = 0; index < this.listenerRemovers.length; index++) {
				this.listenerRemovers[index]();
			}
			this.listenerRemovers = [];

			if (this.isContainerExternal) {
				this.container.innerHTML = '';
			} else {
				this.container.parentNode.removeChild(this.container);
			}
			this.container.datepicker = null;

			if (this.input !== null) {
				this.input.datepicker = null;
				this.removeInitialInputListener();
				this.input = null;
			}

			if (this.deselectElement !== null) {
				this.deselectElement.parentNode.removeChild(this.deselectElement);
				this.deselectElement = null;
			}

			this.initializationPhase = InitializationPhase.Destroyed;
		}

		public selectDate(date: Date | string | null, doUpdateMonth = true, event: Event | null = null): boolean {
			return this.viewModel.selectDay(event, Helper.normalizeDate('Date', date, this.options), doUpdateMonth);
		}

		public getSelectedDate(): Date | null {
			return this.viewModel.selectedDate !== null ? new Date(this.viewModel.selectedDate.getTime()) : null;
		}

		public getCurrentMonth(): Date {
			return this.viewModel.getCurrentMonth();
		}

		public goToMonth(month: Date | string, event: Event | null = null): boolean {
			return this.viewModel.goToMonth(event, Helper.normalizeDate('Month', month, this.options));
		}

		public parseRawInput(): Date | null {
			return this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
		}

		public readInput(event: Event | null = null): boolean {
			if (this.input === null) {
				return false;
			}

			try {
				const date = this.parseRawInput();
				if (date !== null) {
					return this.viewModel.selectNearestDate(event, date);
				}
				return this.viewModel.cancelSelection(event);

			} catch (error) {
				if (!(error instanceof CannotParseDateException)) {
					throw error;
				}

				return false;
			}
		}

		public updateInput(): void {
			if (this.input === null || this.input === this.document.activeElement) {
				return;
			}

			this.input.value = this.viewModel.selectedDate !== null
				? this.dateConverter.formatDate(this.options.getInputFormat(), this.viewModel.selectedDate)
				: '';

			this.updateDeselectButton();
		}

		public static onDatepickerReady(element: HTMLDatepickerElement, callback: ReadyListener | null = null): Promise<TheDatepicker.Datepicker> | null {
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
				element.datepicker.triggerReadyListener(callback, element);
				if (promiseResolve !== null) {
					promiseResolve(element.datepicker);
				}

			} else {
				Datepicker.readyListeners.push({
					promiseResolve,
					element,
					callback
				});
			}

			return promise;
		};

		private createContainer(): HTMLElement {
			const container = this.document.createElement('div');
			container.className = this.options.getClassesPrefix() + 'container';
			container.style.position = 'absolute';
			container.style.zIndex = '99';

			return container;
		}

		private createDeselectElement(): HTMLElement | null {
			if (this.input === null || !this.options.isDeselectButtonShown()) {
				return null;
			}

			const deselectElement = this.document.createElement('span');
			deselectElement.style.position = 'absolute';
			const deselectButton = this.document.createElement('a');
			deselectButton.innerHTML = this.options.getDeselectHtml();
			deselectButton.style.position = 'relative';
			deselectButton.style.left = '-0.8em';
			deselectButton.href = '#';
			deselectButton.onclick = (event: MouseEvent) => {
				event = event || window.event as MouseEvent;
				Helper.preventDefault(event);
				this.viewModel.cancelSelection(event);
			};
			deselectElement.className = this.options.getClassesPrefix() + 'deselect';
			deselectButton.className = this.options.getClassesPrefix() + 'deselect-button';
			deselectElement.appendChild(deselectButton);

			this.input.parentNode.insertBefore(deselectElement, this.input.nextSibling);
			this.deselectElement = deselectElement;
		}

		private updateDeselectButton(): void {
			if (this.input !== null && this.deselectElement !== null) {
				const isVisible = this.options.isDeselectButtonShown() && this.input.value !== '';
				this.deselectElement.style.visibility = isVisible ? 'visible' : 'hidden';
			}
		}

		private preselectFromInput(): void {
			if (this.input !== null) {
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

		private initListeners(): void {
			if (!Datepicker.areGlobalListenersInitialized) {
				let activeViewModel: ViewModel | null = null;

				const checkMiss = (event: Event) => {
					if (Datepicker.hasClickedViewModel) {
						Datepicker.hasClickedViewModel = false;
					} else {
						Datepicker.activateViewModel(event, null);
					}
				};

				Helper.addEventListener(this.document, ListenerType.MouseDown, checkMiss);
				Helper.addEventListener(this.document, ListenerType.FocusIn, checkMiss);
				Helper.addEventListener(this.document, ListenerType.KeyDown, (event: KeyboardEvent) => {
					if (Datepicker.activeViewModel !== null) {
						Datepicker.activeViewModel.triggerKeyPress(event);
					}
				});

				Datepicker.areGlobalListenersInitialized = true;
			}

			this.removeInitialInputListener();

			const hit = (event: Event) => {
				Datepicker.activateViewModel(event, this);
				Datepicker.hasClickedViewModel = true;
			};

			this.listenerRemovers.push(Helper.addEventListener(this.container, ListenerType.MouseDown, hit));
			this.listenerRemovers.push(Helper.addEventListener(this.container, ListenerType.FocusIn, hit));

			if (this.deselectElement !== null) {
				this.listenerRemovers.push(Helper.addEventListener(this.deselectElement, ListenerType.MouseDown, hit));
				this.listenerRemovers.push(Helper.addEventListener(this.deselectElement, ListenerType.FocusIn, hit));
			}

			if (this.input !== null) {
				this.listenerRemovers.push(Helper.addEventListener(this.input, ListenerType.MouseDown, hit));
				this.listenerRemovers.push(Helper.addEventListener(this.input, ListenerType.Focus, hit));
				this.listenerRemovers.push(Helper.addEventListener(this.input, ListenerType.Blur, () => {
					this.updateInput();
				}));
				this.listenerRemovers.push(Helper.addEventListener(this.input, ListenerType.KeyDown, (event: KeyboardEvent) => {
					Helper.stopPropagation(event);
				}));
				this.listenerRemovers.push(Helper.addEventListener(this.input, ListenerType.KeyUp, (event: KeyboardEvent) => {
					this.readInput(event);
				}));
			}
		}

		private removeInitialInputListener(): void {
			if (this.inputListenerRemover !== null) {
				this.inputListenerRemover();
				this.inputListenerRemover = null;
			}
		}

		private triggerReady(element: HTMLDatepickerElement): void {
			for (let index = Datepicker.readyListeners.length - 1; index >= 0; index--) {
				const listener = Datepicker.readyListeners[index];
				if (listener.element === element) {
					this.triggerReadyListener(listener.callback, element);
					if (listener.promiseResolve !== null) {
						listener.promiseResolve(this);
					}
					Datepicker.readyListeners.splice(index, 1);
				}
			}
		}

		private triggerReadyListener(callback: ReadyListener | null, element: HTMLDatepickerElement): void {
			if (callback !== null) {
				callback.call(element, this, element);
			}
		}

		private fixPosition(): void {
			if (this.isContainerExternal || this.initializationPhase === InitializationPhase.Destroyed) {
				return;
			}

			const windowTop = window.pageYOffset || this.document.documentElement.scrollTop;
			const windowLeft = window.pageXOffset || this.document.documentElement.scrollLeft;
			const windowHeight = window.innerHeight || Math.max(this.document.documentElement.clientHeight, this.document.body.clientHeight);
			const windowWidth = window.innerWidth || Math.max(this.document.documentElement.clientWidth, this.document.body.clientWidth);
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
				locationClass += ' ' + this.options.getClassesPrefix() + 'container--over';
			}
			if (locateLeft) {
				locationClass += ' ' + this.options.getClassesPrefix() + 'container--left';
			}

			this.container.className = this.options.getClassesPrefix() + 'container' + locationClass;

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

		private static activateViewModel(event: Event | null, datepicker: Datepicker | null): boolean {
			const viewModel = datepicker !== null ? datepicker.viewModel : null;
			const activeViewModel = Datepicker.activeViewModel;

			if (activeViewModel === viewModel) {
				return true;
			}

			if (activeViewModel !== null && !activeViewModel.setActive(event, false)) {
				return false;
			}

			if (Datepicker.activeViewModel !== activeViewModel) {
				return true;
			}

			if (viewModel === null) {
				Datepicker.activeViewModel = null;
				return true;
			}

			if (!viewModel.setActive(event, true)) {
				return false;
			}

			if (Datepicker.activeViewModel !== activeViewModel) {
				return true;
			}

			datepicker.fixPosition();

			Datepicker.activeViewModel = viewModel;

			return true;
		}

	}

	export const onDatepickerReady = Datepicker.onDatepickerReady;

}
