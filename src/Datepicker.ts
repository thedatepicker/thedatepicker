/// <reference path="DateConverter.ts" />

namespace TheDatepicker {

	// todo nešlo by se nějak v produkci zbavit kontrol aka addClass regulár?
	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo mělo by smysl držet identitu dní?
	// todo v IE nejde křížek
	// todo levý horní roh zkosený pokud to není input mode
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo static metody šětří výkon
	// todo onBefore dovolit rerurnovat i promisu
	// todo yearsSelectionLimits se nemění interaktivně (po zavolání .render()) + možná by to šlo vymyslet líp (např. setYearSelectItemsCount(100) a nastavovaly by se +-50 od aktuálního roku
	//      todo + optimalizace že pokud option.style.display !== 'none' tak vím že ta dylší už mení nemusím
	// todo datepicker.goToMonth() (přepošle do viewModel) + další metody
	// todo editovatelné titulky pro ikony (deselect, goToNow, close)
	// todo při změně měsíce selectem když onBeforeGo vrátí false by se neměla změnit hodnota selectu
	// todo proč výběr data volá Template.render() tolikrát?
	// todo setActive má odlišný interface (vrací true tam kde jiný metody vrací false) - deal with it?
	// todo custom html pro jednotlivé dny bude složitější
	// todo enable/disable ty selecty (month, year)
	// todo nadesignovat v relativních jednotkách ať je to hezký na všech obrazovkách?

	interface HTMLDatepickerInputElement extends HTMLInputElement {

		datepicker?: Datepicker;

	}

	interface HTMLDatepickerContainerElement extends HTMLElement {

		datepicker?: Datepicker;
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
			container: HTMLDatepickerContainerElement | null = null
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

			this.document = document;

			this.isContainerExternal = container !== null;
			if (!this.isContainerExternal) {
				container = this.createContainer();
				if (input !== null) {
					input.parentNode.insertBefore(container, input.nextSibling);
				}
			}

			if (input !== null) {
				input.datepicker = this;
				input.autocomplete = 'off';
			}
			container.datepicker = this;

			this.input = input;
			this.container = container;

			this.options = new Options();
			this.dateConverter = new DateConverter(this.options.translator);
			this.viewModel = new ViewModel(this.options, this);
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

					this.prepareDeselectButton();
					if (this.viewModel.selectedDate !== null && (!this.options.isDateInValidity(this.viewModel.selectedDate) || !this.options.isDateAvailable(this.viewModel.selectedDate))) {
						this.viewModel.cancelSelection(null);
					} else if (this.viewModel.selectedDate == null && !this.options.isAllowedEmpty()) {
						this.viewModel.selectDay(null, this.options.getInitialDate(), false);
					}

					return;

				case InitializationPhase.Untouched:
					this.preselectFromInput();

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
			}

			this.initializationPhase = InitializationPhase.Destroyed;
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

			this.prepareDeselectButton();
		}

		public selectDate(date: Date | string | null, doUpdateMonth = true, event: Event | null = null): boolean {
			try {
				return this.viewModel.selectDay(event, Helper.normalizeDate(date), doUpdateMonth);
			} catch (error) {
				if (!(error instanceof InvalidDateException)) {
					throw error;
				}

				throw new Error('Date was expected to be a valid Date string or valid instance of Date or null, ' + date + ' given.')
			}
		}

		public getSelectedDate(): Date | null {
			return this.viewModel.selectedDate;
		}

		private createContainer(): HTMLElement {
			const container = this.document.createElement('div');
			container.style.position = 'absolute';
			container.style.zIndex = '99';

			return container;
		}

		private prepareDeselectButton(): void {
			const hasDeselectButton = this.input !== null && this.options.isDeselectButtonShown() && this.options.isAllowedEmpty();

			if (this.deselectElement !== null && !hasDeselectButton) {
				this.deselectElement.parentNode.removeChild(this.deselectElement);
				this.deselectElement = null;

			} else if (this.deselectElement === null && hasDeselectButton) {
				this.deselectElement = this.document.createElement('span');
				this.deselectElement.style.position = 'absolute';
				const deselectButton = this.document.createElement('a');
				deselectButton.innerHTML = '&times;';
				deselectButton.style.position = 'relative';
				deselectButton.style.left = '-12px';
				deselectButton.href = '#';
				deselectButton.onclick = (event: MouseEvent) => {
					event.preventDefault();
					this.viewModel.cancelSelection(event);
				};
				this.deselectElement.className = this.options.getClassesPrefix() + 'deselect';
				this.deselectElement.appendChild(deselectButton);

				this.input.parentNode.insertBefore(this.deselectElement, this.input.nextSibling);
			}

			if (this.input !== null && this.deselectElement !== null) {
				this.deselectElement.style.visibility = this.input.value === '' ? 'hidden' : 'visible';
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
