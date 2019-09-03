/// <reference path="DateConverter.ts" />

namespace TheDatepicker {

	// todo nešlo by se nějak v produkci zbavit kontrol aka addClass regulár?
	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo mělo by smysl držet identitu dní?
	// todo nastavovat z-index
	// todo v IE nejde křížek
	// todo levý horní roh zkosený pokud to není input mode
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo toggle mode (klik na selected ho odvybere)
	// todo no empty mode? (vždy musí být něco vybráno)
	// todo static metody šětří výkon
	// todo onBefore dovolit rerurnovat i promisu
	// todo selectedDate, currentMonth v Datepickeru?
	// todo volitelně tlačítko které tě přesune na aktuální měsíc (je-li dostupný, jinak se tlačítko nezobrazí)
	// todo šipky by mohly na selectech (month, year) měnit hodnotu selectu
	// todo yearsSelectionLimits se nemění interaktivně (po zavolání .render()) + možná by to šlo vymyslet líp (např. setYearSelectItemsCount(100) a nastavovaly by se +-50 od aktuálního roku
	//      todo + optimalizace že pokud option.style.display !== 'none' tak vím že ta dylší už mení nemusím
	// todo datepicker.goToMonth() (přepošle do viewModel)
	// todo editovatelné titulky pro ikony (deselect, goToNow, close)
	// todo fičura resetování nabádá k options.setDefaultDate() + to asi bude spolupracovat s setDeselectEnabled() :-)
	// todo při změně měsíce selectem když onBeforeGo vrátí false by se neměla změnit hodnota selectu
	// todo proč výběr data volá Template.render() tolikrát?
	// todo setActive má odlišný interface (vrací true tam kde jiný metody vrací false) - deal with it?
	// todo custom html pro jednotlivé dny bude složitější
	// todo destroy()
	// todo enable/disable ty selecty (month, year)

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
	}

	export class Datepicker {

		private readonly document: DocumentInterface;
		private readonly input: HTMLDatepickerInputElement | null;
		private readonly container: HTMLDatepickerContainerElement;
		private readonly viewModel: ViewModel;

		private initializationPhase = InitializationPhase.Untouched;
		private originalInputOnFocus: ((event: FocusEvent) => void) | null = null;

		private options: Options;
		private dateConverter: DateConverterInterface;

		private static instances: Datepicker[] = [];
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

			if (container === null) {
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

			this.setOptions(new Options());
			this.setDateConverter(new DateConverter(this.options.getTranslator()));

			this.viewModel = new ViewModel(this.options, this);
		}

		public setOptions(options: Options): void {
			if (!(options instanceof Options)) {
				throw new Error('Options was expected to be an instance of Options, but ' + options + ' given.');
			}

			this.options = options;
		}

		public setDateConverter(dateConverter: DateConverterInterface): void {
			if (typeof dateConverter !== 'object' || typeof dateConverter.formatDate !== 'function' || typeof dateConverter.parseDate !== 'function') {
				throw new Error('Date converter was expected to be an instance of DateConverterInterface, but ' + dateConverter + ' given.');
			}

			this.dateConverter = dateConverter;
		}

		public render(): void {
			switch (this.initializationPhase) {
				case InitializationPhase.Initialized:
					this.viewModel.render();
					return;

				case InitializationPhase.Ready:
					this.initListeners();
					this.initializationPhase = InitializationPhase.Initialized;
					this.render();
					return;

				case InitializationPhase.Waiting:
					const selectedDate = this.viewModel.getSelectedDate();
					if (selectedDate !== null && (!this.options.isDateInValidity(selectedDate) || !this.options.isDateAvailable(selectedDate))) {
						this.viewModel.cancelSelection(null);
					}

					return;

				case InitializationPhase.Untouched:
					this.preselectFromInput();

					const initialDate = this.options.getInitialDate();
					this.viewModel.selectDay(null, this.options.getInitialDate(), false);
					this.updateInput();

					if (this.input !== null && this.options.isHiddenOnBlur()) {
						if (this.input === this.document.activeElement) {
							this.initializationPhase = InitializationPhase.Ready;
							this.render();
							this.open();
							return;
						}

						this.prepareLazyLoad();
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
				this.input.onfocus = this.originalInputOnFocus;
				this.render();
				Datepicker.hasClickedViewModel = true;
				return this.open();
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

		public readInput(event: Event | null = null): boolean {
			if (this.input === null) {
				return false;
			}

			try {
				const date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
				if (date !== null) {
					return this.viewModel.selectDateSince(event, date);
				}
				return this.viewModel.selectDay(event, null);

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

			const date = this.viewModel.getSelectedDate();
			this.input.value = date !== null
				? this.dateConverter.formatDate(this.options.getInputFormat(), date)
				: '';
		}

		public getContainer(): HTMLDatepickerContainerElement {
			return this.container;
		}

		public getInput(): HTMLDatepickerInputElement | null {
			return this.input;
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
			return this.viewModel.getSelectedDate();
		}

		private createContainer(): HTMLElement {
			const container = this.document.createElement('div');
			container.style.position = 'absolute';
			container.style.zIndex = '99';

			return container;
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

		private prepareLazyLoad(): void {
			this.originalInputOnFocus = this.input.onfocus || null;
			this.input.onfocus = (event: FocusEvent) => {
				if (this.originalInputOnFocus !== null) {
					this.originalInputOnFocus.call(this.input, event);
				}

				this.open(event);
			};

			this.initializationPhase = InitializationPhase.Waiting;
		}

		private initListeners(): void {
			if (Datepicker.instances.length === 0) {
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
			}

			Datepicker.instances.push(this);

			const hit = (event: Event) => {
				Datepicker.activateViewModel(event, this.viewModel);
				Datepicker.hasClickedViewModel = true;
			};

			Helper.addEventListener(this.container, ListenerType.MouseDown, hit);
			Helper.addEventListener(this.container, ListenerType.FocusIn, hit);

			if (this.input !== null) {
				Helper.addEventListener(this.input, ListenerType.MouseDown, hit);
				Helper.addEventListener(this.input, ListenerType.Focus, hit);
				Helper.addEventListener(this.input, ListenerType.Blur, () => {
					this.updateInput();
				});
				Helper.addEventListener(this.input, ListenerType.KeyUp, (event: KeyboardEvent) => {
					this.readInput(event);
				});
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
