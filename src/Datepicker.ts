import Day from './Day';
import Options from './Options';
import { ClassNameType } from './ClassNames';
import { TitleName } from './Translator';
import DateConverter_, { CannotParseDateException } from './DateConverter';
import Helper_, { KeyCode_, ListenerType_, Position } from './Helper';
import HtmlHelper_ from './HtmlHelper';
import ViewModel_ from './ViewModel';

export interface HTMLDatepickerInputElement {

	datepicker?: Datepicker;

}

export interface HTMLDatepickerContainerElement extends HTMLElement {

	datepicker?: Datepicker;
	onfocusin?: (event: FocusEvent) => void;

}

export type HTMLDatepickerElement = (HTMLDatepickerInputElement&HTMLElement) | HTMLDatepickerContainerElement;

interface DocumentInterface extends Document {

	onfocusin?: (event: FocusEvent) => void;

}

export type ReadyListener = (datepicker: Datepicker, element: HTMLDatepickerElement) => void;

export type ReadyPromiseResolve = (datepicker: Datepicker) => void;

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

export default class Datepicker {

	public readonly options: Options;

	public input: (HTMLDatepickerInputElement&HTMLElement) | null;
	public readonly container: HTMLDatepickerContainerElement;

	private readonly isContainerExternal_: boolean;
	private readonly inputClickable_: (HTMLDatepickerInputElement&HTMLInputElement) | null = null;
	private readonly inputText_: (HTMLDatepickerInputElement&HTMLInputElement) | null = null;
	private readonly viewModel_: ViewModel_;

	private initializationPhase_ = InitializationPhase.Untouched;
	private inputListenerRemover_: (() => void) | null = null;
	private listenerRemovers_: (() => void)[] = [];
	private deselectElement_: HTMLSpanElement | null = null;
	private deselectButton_: HTMLAnchorElement | null = null;

	private static document_: DocumentInterface;
	private static readyListeners_: DatepickerReadyListener[] = [];
	private static areGlobalListenersInitialized_ = false;
	private static activeViewModel_: ViewModel_ | null = null;
	private static hasClickedViewModel_ = false;

	public constructor(
		input: (HTMLDatepickerInputElement&HTMLElement) | null,
		container: HTMLDatepickerContainerElement | null = null,
		options: Options | null = null
	) {
		if (!(this instanceof Datepicker)) {
			throw new Error('Creation must be performed by "new" keyword.');
		}
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

		Datepicker.document_ = document;
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

		this.viewModel_ = new ViewModel_(this.options, this);

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

				if (this.inputClickable_ && this.options.isHiddenOnBlur()) {
					if (this.inputClickable_ === Datepicker.document_.activeElement) {
						this.initializationPhase_ = InitializationPhase.Ready;
						this.render();
						this.open();
						return;
					}

					this.inputListenerRemover_ = Helper_.addEventListener_(this.inputClickable_, ListenerType_.Focus, (event: FocusEvent): void => {
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

		if (this.inputClickable_) {
			this.inputClickable_.focus();
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

		if (this.inputClickable_) {
			this.inputClickable_.blur();
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

	public isDestroyed(): boolean {
		return this.initializationPhase_ === InitializationPhase.Destroyed;
	}

	public selectDate(date: Date | string | null, doUpdateMonth = true, event: Event | null = null): boolean {
		return this.viewModel_.selectDay_(event, Helper_.normalizeDate_('Date', date, true, this.options), !!doUpdateMonth);
	}

	public getSelectedDate(): Date | null {
		return this.viewModel_.selectedDate_ ? new Date(this.viewModel_.selectedDate_.getTime()) : null;
	}

	public getSelectedDateFormatted(format: string | null = null): string | null {
		return DateConverter_.formatDate_(this.viewModel_.selectedDate_, this.options, Helper_.checkString_('Format', format));
	}

	public getCurrentMonth(): Date {
		return new Date(this.viewModel_.getCurrentMonth_().getTime());
	}

	public goToMonth(month: Date | string, event: Event | null = null): boolean {
		return this.viewModel_.goToMonth_(event, Helper_.normalizeDate_('Month', month, false, this.options));
	}

	public parseRawInput(): Date | null {
		return this.inputText_
			? DateConverter_.parseDate_(this.inputText_.value, this.options)
			: null;
	}

	public getDay(date: Date | string): Day {
		return this.viewModel_.createDay_(Helper_.normalizeDate_('Date', date, false, this.options));
	}

	public canType_(char: string): boolean {
		if (!this.inputText_ || this.options.isAllowedInputAnyChar()) {
			return true;
		}

		return DateConverter_.isValidChar_(char, this.options);
	}

	public readInput_(event: Event | null = null): boolean {
		if (!this.inputText_) {
			return false;
		}

		try {
			const date = this.parseRawInput();
			if (date ? this.viewModel_.selectNearestDate_(event, date) : this.viewModel_.cancelSelection_(event)) {
				this.updateDeselectElement_();
				return true;
			}

		} catch (error) {
			if (!(error instanceof CannotParseDateException)) {
				throw error;
			}
		}

		return false;
	}

	public updateInput_(): void {
		if (!this.inputText_ || this.inputText_ === Datepicker.document_.activeElement) {
			return;
		}

		this.inputText_.value = DateConverter_.formatDate_(this.viewModel_.selectedDate_, this.options) || '';

		this.updateDeselectElement_();
	}

	public static onDatepickerReady(element: HTMLDatepickerElement, callback: ReadyListener | null = null): Promise<Datepicker> | null {
		if (!Helper_.isElement_(element)) {
			throw new Error('Element was expected to be an HTMLElement.');
		}
		callback = Helper_.checkFunction_('Callback', callback);

		let promise = null;
		let promiseResolve: ReadyPromiseResolve | null = null;
		// @ts-ignore
		if (typeof Promise !== 'undefined') {
			// @ts-ignore
			promise = new Promise<Datepicker>((resolve: ReadyPromiseResolve): void => {
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
		return  HtmlHelper_.createDiv_(ClassNameType.Container, this.options);
	}

	private createDeselectElement_(): HTMLElement | null {
		if (!this.inputText_ || !this.options.isDeselectButtonShown() || this.deselectElement_) {
			return null;
		}

		const deselectButton = HtmlHelper_.createAnchor_((event: Event): void => {
			deselectButton.focus();
			this.viewModel_.cancelSelection_(event);
		}, this.options, ClassNameType.DeselectButton);

		deselectButton.innerHTML = this.options.getDeselectHtml();
		const title = this.options.translator.translateTitle(TitleName.Deselect);
		if (title !== '') {
			deselectButton.title = title;
		}

		const deselectElement = HtmlHelper_.createSpan_()
		HtmlHelper_.addClass_(deselectElement, ClassNameType.Deselect, this.options);
		deselectElement.appendChild(deselectButton);

		this.inputText_.parentNode.insertBefore(deselectElement, this.inputText_.nextSibling);
		this.deselectElement_ = deselectElement;
		this.deselectButton_ = deselectButton;
	}

	private updateDeselectElement_(): void {
		if (!this.deselectElement_) {
			return;
		}

		const isVisible = this.options.isDeselectButtonShown() && this.viewModel_.selectedDate_;
		this.deselectElement_.style.visibility = isVisible ? 'visible' : 'hidden';
	}

	private preselectFromInput_(): void {
		if (this.inputText_) {
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
			const checkMiss = (event: Event): void => {
				if (Datepicker.hasClickedViewModel_) {
					Datepicker.hasClickedViewModel_ = false;
				} else {
					Datepicker.activateViewModel_(event, null);
				}
			};

			Helper_.addEventListener_(Datepicker.document_, ListenerType_.MouseDown, checkMiss);
			Helper_.addEventListener_(Datepicker.document_, ListenerType_.FocusIn, checkMiss);
			Helper_.addEventListener_(Datepicker.document_, ListenerType_.KeyDown, (event: KeyboardEvent): void => {
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

		if (this.deselectButton_) {
			const hitIfActive = (event: Event) => {
				if (this.viewModel_.isActive_()) {
					hit(event);
				}
			};
			this.listenerRemovers_.push(Helper_.addEventListener_(this.deselectButton_, ListenerType_.MouseDown, hitIfActive));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.deselectButton_, ListenerType_.Focus, hitIfActive));
		}

		if (this.inputClickable_) {
			this.listenerRemovers_.push(Helper_.addEventListener_(this.inputClickable_, ListenerType_.MouseDown, hit));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.inputClickable_, ListenerType_.Focus, hit));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.inputClickable_, ListenerType_.Blur, (): void => {
				this.updateInput_();
			}));
		}

		if (this.inputText_) {
			this.listenerRemovers_.push(Helper_.addEventListener_(this.inputText_, ListenerType_.KeyDown, (event: KeyboardEvent): void => {
				Helper_.stopPropagation_(event);
				if (event.keyCode === KeyCode_.Esc && this.options.isClosedOnEscPress()) {
					this.close(event);
				}
			}));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.inputText_, ListenerType_.KeyUp, (event: KeyboardEvent): void => {
				this.readInput_(event);
			}));
			this.listenerRemovers_.push(Helper_.addEventListener_(this.inputText_, ListenerType_.KeyPress, (event: KeyboardEvent): void => {
				const charCode = event.charCode || event.keyCode;
				if (charCode && !this.canType_(String.fromCharCode(charCode))) {
					Helper_.preventDefault_(event);
				}
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

	private onActivate_(): void {
		if (this.initializationPhase_ === InitializationPhase.Destroyed) {
			return;
		}

		this.updateContainer_();

		if (this.inputText_) {
			this.inputText_.readOnly = !this.options.isKeyboardOnMobile() && Helper_.isMobile_();
		}
	}

	private updateContainer_(): void {
		if (this.isContainerExternal_) {
			return;
		}

		this.container.className = '';

		HtmlHelper_.addClass_(this.container, ClassNameType.Container, this.options);
		if (this.options.isDarkModeEnabled()) {
			// ContainerDarkMode is deprecated, remove this line on major release
			HtmlHelper_.addClass_(this.container, ClassNameType.ContainerDarkMode, this.options);
		}

		if (this.options.isFullScreenOnMobile()) {
			HtmlHelper_.addClass_(this.container, ClassNameType.ContainerResponsive, this.options);
		}

		if (this.container.childNodes.length === 0) {
			return;
		}

		const position = this.options.getPosition();
		let locateOver = position === Position.TopRight || position === Position.TopLeft;
		let locateLeft = position === Position.BottomLeft || position === Position.TopLeft;

		const mainElement = this.container.childNodes[0] as HTMLElement;
		mainElement.style.position = '';
		mainElement.style.top = '';
		mainElement.style.left = '';

		const inputWidth = this.input.offsetWidth;
		const inputHeight = this.input.offsetHeight;
		const containerWidth = this.container.offsetWidth;
		const containerHeight = this.container.offsetHeight;

		if (this.options.isPositionFixingEnabled()) {
			const document = Datepicker.document_;
			const windowTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			const windowLeft = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
			const isCompactMode = document.compatMode === 'CSS1Compat';
			const windowHeight = window.innerHeight || (isCompactMode ? document.documentElement.clientHeight : document.body.clientHeight) || 0;
			const windowWidth = window.innerWidth || (isCompactMode ? document.documentElement.clientWidth : document.body.clientWidth) || 0;
			const windowBottom = windowTop + windowHeight;
			const windowRight = windowLeft + windowWidth;

			const rect = this.input.getBoundingClientRect();
			const inputTop = rect.top + windowTop;
			const inputLeft = rect.left + windowLeft;
			const inputBottom = inputTop + inputHeight;
			const inputRight = inputLeft + inputWidth;

			const fitsTop = inputTop - windowTop > containerHeight;
			const fitsBottom = windowBottom - inputBottom > containerHeight;
			const fitsLeft = inputLeft - windowLeft > containerWidth - inputWidth;
			const fitsRight = windowRight - inputRight > containerWidth - inputWidth;

			locateOver = (locateOver && (fitsTop || !fitsBottom)) || (fitsTop && !fitsBottom);
			locateLeft = (locateLeft && (fitsLeft || !fitsRight)) || (fitsLeft && !fitsRight);
		}

		mainElement.style.position = locateOver || locateLeft ? 'absolute' : '';
		if (locateOver) {
			HtmlHelper_.addClass_(this.container, ClassNameType.ContainerOver, this.options);
			mainElement.style.top = '-' + (inputHeight + containerHeight) + 'px';
		}
		if (locateLeft) {
			HtmlHelper_.addClass_(this.container, ClassNameType.ContainerLeft, this.options);
			mainElement.style.left = '-' + (containerWidth - inputWidth) + 'px';
		}
	}

	private static setBodyClass_(enable: boolean) {
		const pageClass = 'the-datepicker-page';
		const body = Datepicker.document_.body;
		const className = body.className;
		const hasClass = className.indexOf(pageClass) > -1;
		if (!hasClass && enable) {
			body.className += (className.length > 0 ? ' ' : '') + pageClass;
		} else if (hasClass && !enable) {
			let search = pageClass;
			if (className.indexOf(' ' + pageClass) > -1) {
				search = ' ' + pageClass;
			} else if (className.indexOf(pageClass + ' ') > -1) {
				search = pageClass + ' ';
			}
			body.className = className.replace(search, '');
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

export const onDatepickerReady = Datepicker.onDatepickerReady;
