/// <reference path="DateConverter.ts" />

namespace TheDatepicker {

	// todo nešlo by se nějak v produkci zbavit kontrol aka addClass regulár?
	// todo datepicker.selectdate() by mohlo přijímat i string 2019-01-20 + kontrola že je to datum
	// todo pokud je předvybrané datum, či je vybráno pomocí datepicker.selectDate(), a zároveň initialMonth = null, bylo by dobrý kdyby byl měsíc nastaven na vybrané datum
	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo asi bych se měl na lazyload vysrat ... anebo ještě líp:
	//      selectedDate, createDay... bude v Datepickeru, takže to bude moct zpracovat nezávisle
	//      asi bude jednodušší udělat nejdřív verzi kdy se to rendruje vždy
	// todo souvisí s předchozím bodem: když se pak do getInitialMonth předá currentMonth ?? selectedDate, měl by se na začátku předvybrat správný měsíc
	// todo mělo by smysl držet identitu dní?
	// todo nastavovat z-index
	// todo křížek enter / space
	// todo kurzor mizí z inputu při parseDate
	// todo v IE nejde křížek
	// todo levý horní roh zkosený pokud to není input mode
	// todo proč nejde  export const MaxRows = 6; export const DaysInWeekCount = 7;
	// todo předat do listenerů (on*) nějaké this?
	// todo toggle mode (klik na selected ho odvybere)
	// todo no empty mode? (vždy musí být něco vybráno)
	// todo option zda zobrazovat křížek
	// todo static metody šětří výkon
	// todo onBefore dovolit rerurnovat i promisu
	// todo selectedDate, currentMonth v Datepickeru?
	// todo volitelně tlačítko které tě přesune na aktuální měsíc (je-li dostupný, jinak se tlačítko nezobrazí)
	// todo šipky by mohly na selectech (month, year) měnit hodnotu selectu
	// todo yearsSelectionLimits se nemění interaktivně (po zavolání .render()) + možná by to šlo vymyslet líp (např. setYearSelectItemsCount(100) a nastavovaly by se +-50 od aktuálního roku
	//      todo + optimalizace že pokud option.style.display !== 'none' tak vím že ta dylší už mení nemusím
	// todo datepicker.goToMonth()
	// todo nějak se to s těma selectama rozšířilo

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
		WaitingOnFocus,
		Ready,
	}

	export class Datepicker {

		private readonly document: DocumentInterface;
		private readonly input: HTMLDatepickerInputElement | null;
		private readonly container: HTMLDatepickerContainerElement;

		private initializationPhase = InitializationPhase.Untouched;
		private originalInputOnFocus: ((event: FocusEvent) => void) | null = null

		private options: Options;
		private dateConverter: DateConverterInterface;
		private viewModel: ViewModel | null = null;

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
			}
			container.datepicker = this;

			this.input = input;
			this.container = container;

			this.setOptions(new Options());
			this.setDateConverter(new DateConverter(this.options.getTranslator()));
		}

		public setOptions(options: Options): void {
			if (!(options instanceof Options)) {
				throw new Error('Options was expected to be an instance of Options, but ' + options + ' given.');
			}

			this.options = options;
		}

		public setDateConverter(dateConverter: DateConverterInterface): void {
			if (typeof dateConverter.formatDate !== 'function' || typeof dateConverter.parseDate !== 'function') {
				throw new Error('Date converter was expected to be an instance of DateConverterInterface, but ' + dateConverter + ' given.');
			}

			this.dateConverter = dateConverter;
		}

		public render(): void {
			if (this.viewModel !== null) {
				this.viewModel.render();
				return;
			}

			if (this.initializationPhase === InitializationPhase.Ready) {
				this.viewModel = new ViewModel(this.options, this);
				this.initListeners();
				let date: Date | null = null;
				if (this.input !== null) {
					try {
						date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
					} catch (error) {
						if (!(error instanceof CannotParseDateException)) {
							throw error;
						}
					}
				}
				this.render();
				this.selectDate(date);
				if (this.input === this.document.activeElement) {
					this.open();
				}
				return;
			}

			if (this.initializationPhase === InitializationPhase.WaitingOnFocus) {
				return;
			}

			if (
				this.input !== null
				&& this.options.isHiddenOnBlur()
				&& this.input.value === ''
				&& this.input !== this.document.activeElement
			) {
				this.originalInputOnFocus = this.input.onfocus || null;
				this.input.onfocus = (event: FocusEvent) => {
					if (this.originalInputOnFocus !== null) {
						this.originalInputOnFocus.call(this.input, event);
					}

					this.initializationPhase = InitializationPhase.Ready;
					this.input.onfocus = this.originalInputOnFocus;
					this.render();
					Datepicker.hasClickedViewModel = true;
					this.open();
				};

				this.initializationPhase = InitializationPhase.WaitingOnFocus;

				return;
			}

			this.initializationPhase = InitializationPhase.Ready;
			this.render();
		}

		public open(): boolean {
			if (this.initializationPhase === InitializationPhase.WaitingOnFocus) {
				this.input.focus();
				// todo zde opět nevím co vrátit
				return;
			}

			if (this.viewModel === null) {
				throw new Error('Call render() first.');
			}

			if (!Datepicker.activateViewModel(null, this.viewModel)) {
				return false;
			}

			if (this.input !== null) {
				this.input.focus();
			}

			return true;
		}

		public close(): boolean {
			if (this.viewModel === null) {
				throw new Error('Call render() first.');
			}

			if (!this.viewModel.isActive()) {
				return true;
			}

			if (!Datepicker.activateViewModel(null, null)) {
				return false;
			}

			if (this.input !== null) {
				this.input.blur();
			}

			return true;
		}

		public readInput(event: KeyboardEvent | null): void {
			if (this.input === null || this.viewModel === null) {
				return;
			}

			try {
				const date = this.dateConverter.parseDate(this.options.getInputFormat(), this.input.value);
				if (date !== null) {
					this.viewModel.selectDateSince(event, date);
				} else {
					this.viewModel.selectDate(event, null);
				}
			} catch (error) {
				if (!(error instanceof CannotParseDateException)) {
					throw error;
				}
			}
		}

		public updateInput(): void {
			if (this.input === null || this.viewModel === null || this.input === this.document.activeElement) {
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

		public selectDate(date: Date | null): boolean {
			if (date !== null && !Helper.isValidDate(date)) {
				throw new Error('Date ' + date  + ' is invalid.');
			}

			if (this.initializationPhase === InitializationPhase.WaitingOnFocus) {
				this.input.onfocus = this.originalInputOnFocus;
				this.initializationPhase = InitializationPhase.Ready;
				this.render();
				// todo co tady mám vrátit?
				return;
			}

			if (this.viewModel === null) {
				throw new Error('Call render() first.');
			}

			return this.viewModel.selectDate(null, date);
		}

		public getSelectedDate(): Date | null {
			if (this.viewModel === null) {
				throw new Error('Call render() first.');
			}

			return this.viewModel.getSelectedDate();
		}

		private createContainer(): HTMLElement {
			const container = this.document.createElement('div');
			container.style.position = 'absolute';
			container.style.zIndex = '99';

			return container;
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
