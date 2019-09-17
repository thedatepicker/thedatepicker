/// <reference path="DateConverter.ts" />

namespace TheDatepicker {

	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo mělo by smysl držet identitu dní?
	// todo levý horní roh zkosený pokud to není input mode
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo static metody šětří výkon
	// todo editovatelné titulky pro ikony (deselect, goToNow, close)
	// todo při změně měsíce selectem když onBeforeGo vrátí false by se neměla změnit hodnota selectu
	// todo proč výběr data volá Template.render() tolikrát?
	// todo setActive má odlišný interface (vrací true tam kde jiný metody vrací false) - deal with it?
	// todo custom html pro jednotlivé dny bude složitější
	// todo např třída CannotParseDateException se neminifikuje
	// todo scope="col", <col>
	// todo option setMinDate apod. by mohly přijímat i undefined apod.
	// todo initialdate by mělo mít vyšší prioritu než initialMonth
	// todo poslední css zlobí ve Slv
	// todo ve FF manipulace šipkama v inputu blurne
	// todo křížek by to mohl zavřít ale nechat focus v inputu (klik do inputu by to zas otevřel)
	// todo dám minDate 1999-12-01, vyberu 1999-12-31, v inputu změnim datum na 1998-12-31, nic, změnim to zpět na 1999-12-31, vybere se mi prvního
	// todo BEM zápis CSS
	// todo fixed rows count nedrží správnou velikost pokud nejsou zobrazeny out of month
	// todo min/max month zakešovanej
	// todo třídu na wrapper
	// todo rozhodnout zda je nahoře nebo dole (další třída)
	// todo inline block měnit na none

	interface HTMLDatepickerInputElement extends HTMLInputElement {

		datepicker?: Datepicker;
		datepickerReadyListeners?: ((datepicker: Datepicker) => void)[]

	}

	interface HTMLDatepickerContainerElement extends HTMLElement {

		datepicker?: Datepicker;
		datepickerReadyListeners?: ((datepicker: Datepicker) => void)[]
		onfocusin?: (event: FocusEvent) => void;

	}

	interface DocumentInterface extends Document {

		onfocusin?: (event: FocusEvent) => void;

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

			this.options = options !== null ? options.clone() : new Options();
			this.dateConverter = new DateConverter(this.options.translator);
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

					this.updateDeselectButton();
					if (this.viewModel.selectedDate !== null && (!this.options.isDateInValidity(this.viewModel.selectedDate) || !this.options.isDateAvailable(this.viewModel.selectedDate))) {
						this.viewModel.cancelSelection(null);
					} else if (this.viewModel.selectedDate == null && !this.options.isAllowedEmpty()) {
						this.viewModel.selectDay(null, this.options.getInitialDate(), false);
					}

					return;

				case InitializationPhase.Untouched:
					this.preselectFromInput();
					this.createDeselectElement();

					this.viewModel.selectDay(null, this.options.getInitialDate(), false);
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

			if (!Datepicker.activateViewModel(event, this.viewModel)) {
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
			return this.viewModel.selectDay(event, Helper.normalizeDate('Date', date), doUpdateMonth);
		}

		public getSelectedDate(): Date | null {
			return this.viewModel.selectedDate;
		}

		public goToMonth(month: Date | string, event: Event | null = null): boolean {
			return this.viewModel.goToMonth(event, Helper.normalizeDate('Month', month));
		}

		public readInput(event: Event | null = null): boolean {
			if (this.input === null) {
				return false;
			}

			try {
				const date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
				if (date !== null) {
					return this.viewModel.selectDateSince(event, date);
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

		private createContainer(): HTMLElement {
			const container = this.document.createElement('div');
			container.style.position = 'absolute';
			container.style.zIndex = '99';

			return container;
		}

		private createDeselectElement(): HTMLElement | null {
			if (this.input === null || !this.options.isDeselectButtonShown() || !this.options.isAllowedEmpty()) {
				return null;
			}

			const deselectElement = this.document.createElement('span');
			deselectElement.style.position = 'absolute';
			const deselectButton = this.document.createElement('a');
			deselectButton.innerHTML = this.options.getDeselectHtml();
			deselectButton.style.position = 'relative';
			deselectButton.style.left = '-12px';
			deselectButton.href = '#';
			deselectButton.onclick = (event: MouseEvent) => {
				event = event || window.event as MouseEvent;
				Helper.preventDefault(event);
				this.viewModel.cancelSelection(event);
			};
			deselectElement.className = this.options.getClassesPrefix() + 'deselect';
			deselectElement.appendChild(deselectButton);

			this.input.parentNode.insertBefore(deselectElement, this.input.nextSibling);
			this.deselectElement = deselectElement;
		}

		private updateDeselectButton(): void {
			if (this.input !== null && this.deselectElement !== null) {
				const isVisible = this.options.isDeselectButtonShown() && this.options.isAllowedEmpty() && this.input.value !== '';
				this.deselectElement.style.visibility = isVisible ? 'visible' : 'hidden';
			}
		}

		private preselectFromInput(): void {
			if (this.input !== null) {
				try {
					const date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
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
					const target = event.target || event.srcElement;
					if (target !== null && target === this.input) {
						return;
					}

					if (Datepicker.activeViewModel !== null) {
						Datepicker.activeViewModel.triggerKeyPress(event, target as HTMLElement);
					}
				});

				Datepicker.areGlobalListenersInitialized = true;
			}

			this.removeInitialInputListener();

			const hit = (event: Event) => {
				Datepicker.activateViewModel(event, this.viewModel);
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

		private triggerReady(element: HTMLDatepickerInputElement | HTMLDatepickerContainerElement): void {
			if (typeof element.datepickerReadyListeners !== 'undefined') {
				for (let index = 0; index < element.datepickerReadyListeners.length; index++) {
					element.datepickerReadyListeners[index](this);
				}
			}
		}

		private static activateViewModel(event: Event | null, viewModel: ViewModel | null): boolean {
			if (Datepicker.activeViewModel === viewModel) {
				return true;
			}

			if (Datepicker.activeViewModel !== null && !Datepicker.activeViewModel.setActive(event, false)) {
				return false;
			}

			if (viewModel === null) {
				Datepicker.activeViewModel = null;
				return true;
			}

			if (!viewModel.setActive(event, true)) {
				return false;
			}

			Datepicker.activeViewModel = viewModel;

			return true;
		}

	}
}
