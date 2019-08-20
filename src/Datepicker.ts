/// <reference path="DateConverter.ts" />

namespace TheDatepicker {

	// todo nešlo by se nějak v produkci zbavit kontrol aka addClass regulár?
	// todo indexOf není v IE <= 8 (https://caniuse.com/#feat=es5)
	// todo měly by se listenery on*Select volat KDYKOLIV je vybráno datum (selectDate...)?
	// todo input.value = 'xxx' nezavolá onchange, dá se to nějak řešit?
	// todo datepicker.selectdate() by mohlo přijímat i string 2019-01-20
	// todo parser neveme "7. 8.     2001"
	// todo pokud je předvybrané datum, či je vybráno pomocí datepicker.selectDate(), a zároveň initialMonth = null, bylo by dobrý kdyby byl měsíc nastaven na vybrané datum
	// todo onMonthChange, onBefore.. (do callbacku previous + new)
	// todo jsou potřeba ty originální on* ? asi jo ale jak se to zachová např. s jquery?
	// todo asi bych se měl na lazyload vysrat ... anebo ještě líp:
	//      selectedDate, createDay... bude v Datepickeru, takže to bude moct zpracovat nezávisle
	//      asi bude jednodušší udělat nejdřív verzi kdy se to rendruje vždy
	// todo souvisí s předchozím bodem: když se pak do getInitialMonth předá currentMonth ?? selectedDate, měl by se na začátku předvybrat správný měsíc
	// todo mělo by smysl držet identitu dní?

	// todo HLAVNÍ CÍLE:
	// - upravit kde to floatuje (absolute position)
	// - základní styly
	// - onClose / onOpen

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

		private static viewModels: ViewModel[] = [];
		private static activeViewModel: ViewModel | null = null;
		private static hasClickedViewModel = false;

		public constructor(
			input: HTMLDatepickerInputElement | null,
			container: HTMLDatepickerContainerElement | null = null
		) {
			if (input !== null && !this.isElement(input)) {
				throw new Error('Input was expected to be null or an HTMLElement.');
			}
			if (container !== null && !this.isElement(container)) {
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

		public open(): void {
			if (this.initializationPhase === InitializationPhase.WaitingOnFocus) {
				this.input.focus();
				return;
			}

			if (this.viewModel === null) {
				throw new Error('Call render() first.');
			}

			this.activateViewModel(this.viewModel);
			if (this.input !== null) {
				this.input.focus();
			}
		}

		public close(): void {
			this.activateViewModel(null);
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
			if (Datepicker.viewModels.length === 0) {
				let activeViewModel: ViewModel | null = null;

				const checkMiss = () => {
					if (Datepicker.hasClickedViewModel) {
						Datepicker.hasClickedViewModel = false;
					} else {
						this.activateViewModel(null);
					}
				};

				const originalOnMousedown = this.document.onmousedown || null;
				this.document.onmousedown = (event: MouseEvent) => {
					if (originalOnMousedown !== null) {
						originalOnMousedown.call(this.document, event);
					}

					checkMiss();
				};

				if (this.document.addEventListener) {
					this.document.addEventListener('focusin', checkMiss);
				} else {
					const originalOnFocusIn = this.document.onfocusin || null;
					this.document.onfocusin = (event: FocusEvent) => {
						if (originalOnFocusIn !== null) {
							originalOnFocusIn.call(this.document, event);
						}

						checkMiss();
					};
				}

				const originalKeyDown = this.document.onkeydown || null;
				this.document.onkeydown = (event: KeyboardEvent) => {
					if (originalKeyDown !== null) {
						originalKeyDown.call(this.document, event);
					}

					const target = event.target || event.srcElement;
					if (target !== null && target === this.input) {
						return;
					}

					if (Datepicker.activeViewModel !== null) {
						Datepicker.activeViewModel.triggerKeyPress(event, target as HTMLElement);
					}
				};
			}

			Datepicker.viewModels.push(this.viewModel);

			const hit = () => {
				this.activateViewModel(this.viewModel);
				Datepicker.hasClickedViewModel = true;
			};

			const originalOnMousedown = this.container.onmousedown || null;
			this.container.onmousedown = (event: MouseEvent) => {
				if (originalOnMousedown !== null) {
					originalOnMousedown.call(this.container, event);
				}

				hit();
			};

			if (this.container.addEventListener) {
				this.container.addEventListener('focusin', hit);
			} else {
				const originalOnFocusIn = this.document.onfocusin || null;
				this.container.onfocusin = (event: FocusEvent) => {
					if (originalOnFocusIn !== null) {
						originalOnFocusIn.call(this.container, event);
					}

					hit();
				};
			}

			if (this.input !== null) {
				const originalOnMousedown = this.input.onmousedown || null;
				this.input.onmousedown = (event: MouseEvent) => {
					if (originalOnMousedown !== null) {
						originalOnMousedown.call(this.input, event);
					}

					hit();
				};

				const originalOnFocus = this.input.onfocus || null;
				this.input.onfocus = (event: FocusEvent) => {
					if (originalOnFocus !== null) {
						originalOnFocus.call(this.input, event);
					}

					hit();
				};

				const originalOnBlur = this.input.onblur || null;
				this.input.onblur = (event: FocusEvent) => {
					if (originalOnBlur !== null) {
						originalOnBlur.call(this.input, event);
					}

					this.updateInput();
				};

				const originalOnKeyUp = this.input.onkeyup || null;
				this.input.onkeyup = (event: KeyboardEvent) => {
					if (originalOnKeyUp !== null) {
						originalOnKeyUp.call(this.input, event);
					}

					this.readInput(event);
				};
			}
		}

		private activateViewModel(viewModel: ViewModel | null): void {
			if (Datepicker.activeViewModel === viewModel) {
				return;
			}

			Datepicker.activeViewModel = viewModel;
			for (let index = 0; index < Datepicker.viewModels.length; index++) {
				Datepicker.viewModels[index].setActive(Datepicker.viewModels[index] === viewModel);
			}
		}

		// todo do nějakýho helpru?
		private isElement(element: HTMLElement): boolean {
			return typeof element === 'object'
				&& element.nodeType === 1
				&& typeof element.style === 'object'
				&& typeof element.ownerDocument === 'object';
		}

	}
}
