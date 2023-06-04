import Day from './Day';
import Options from './Options';
import { MoveDirection_ } from './ViewModel';

export enum DayOfWeek {
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
	Sunday = 0,
}

export enum Month {
	January = 0,
	February = 1,
	March = 2,
	April = 3,
	May = 4,
	June = 5,
	July = 6,
	August = 7,
	September = 8,
	October = 9,
	November = 10,
	December = 11,
}

export enum Align {
	Left = 1,
	Right = 2,
	Center = 3,
}

export enum Position {
	BottomRight = 1,
	BottomLeft = 2,
	TopRight = 3,
	TopLeft = 4,
}

export enum KeyCode_ {
	Enter = 13,
	Space = 32,
	Left = 37,
	Up = 38,
	Right = 39,
	Down = 40,
	Esc = 27,
}

export enum ListenerType_ {
	MouseDown = 'mousedown',
	Focus = 'focus',
	FocusIn = 'focusin',
	Blur = 'blur',
	KeyDown = 'keydown',
	KeyUp = 'keyup',
	KeyPress = 'keypress',
	TouchStart = 'touchstart',
	TouchMove = 'touchmove',
	AnimationEnd = 'animationend',
}

export default class Helper_ {

	private static readonly months_ = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december',
	];

	private static deprecatedMethods_: string[] = [];

	private static cssAnimationSupport_: boolean | null = null;

	private static passiveEventListenerSupport_: boolean | null = null;

	public static resetTime_(date: Date | null): Date | null {
		if (!date) {
			return null;
		}

		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		return date;
	}

	public static normalizeDate_(parameterName: string, value: Day | Date | string | null, isNullable: boolean, options: Options): Date | null {
		if (!value) {
			if (!isNullable) {
				throw new Error(parameterName + ' cannot be empty.');
			}

			return null;
		}

		if (value instanceof Day) {
			return value.getDate();
		}

		if (typeof value === 'string') {
			value = value.trim ? value.trim() : value;

			if (value === 'today' || value === 'now') {
				return options.getToday();
			}

			if (value === 'tomorrow') {
				const date = options.getToday();
				date.setDate(date.getDate() + 1);
				return date;
			}

			if (value === 'yesterday') {
				const date = options.getToday();
				date.setDate(date.getDate() - 1);
				return date;
			}

			let date = options.getToday();
			let parsedValue = value;
			const matches = value.match(new RegExp('^\\s*([0-9]+)\.?\\s*(' + Helper_.months_.join('|') + ')\\s*', 'i'));
			if (matches) {
				const day = parseInt(matches[1], 10);
				let month: number;
				for (month = 0; month < Helper_.months_.length; month++) {
					if (matches[2].toLowerCase() === Helper_.months_[month]) {
						date.setMonth(month);
						date.setDate(day);
						break;
					}
				}
				parsedValue = parsedValue.substring(matches[0].length);
			}

			let sumPositive = true;
			while (parsedValue) {
				const matches = parsedValue.match(/^\s*([+-]?)\s*([0-9]+)\s*(day|week|month|year)s?\s*/i);
				if (!matches) {
					break;
				}
				switch (matches[1]) {
					case '+':
						sumPositive = true;
						break;
					case '-':
						sumPositive = false;
				}
				const amount = parseInt(matches[2], 10) * (sumPositive ? 1 : -1);
				switch (matches[3].toLowerCase()) {
					case 'day':
					case 'days':
						date.setDate(date.getDate() + amount);
						break;
					case 'week':
					case 'weeks':
						date.setDate(date.getDate() + amount * 7);
						break;
					case 'month':
					case 'months':
						date.setMonth(date.getMonth() + amount);
						break;
					case 'year':
					case 'years':
						date.setFullYear(date.getFullYear() + amount);
				}
				parsedValue = parsedValue.substring(matches[0].length);
				if (!parsedValue) {
					return date;
				}
			}

			date = Helper_.resetTime_(new Date(value));
			if (!isNaN(date.getTime())) {
				return date;
			}

		} else if (Helper_.isValidDate_(value)) {
			const date = Helper_.resetTime_(new Date(value.getTime()));
			if (!isNaN(date.getTime())) {
				return date;
			}
		}

		throw new Error(
			parameterName
			+ ' was expected to be a valid Date string or valid Date or TheDatepicker.Day'
			+ (isNullable ? ' or null.' : '.')
		);
	}

	public static isElement_(element: HTMLElement): boolean {
		return typeof element === 'object'
			&& element.nodeType === 1
			&& typeof element.style === 'object'
			&& typeof element.ownerDocument === 'object';
	}

	public static isValidDate_(value: any): boolean {
		return typeof value === 'object'
			&& Object.prototype.toString.call(value) === '[object Date]'
			&& !isNaN(value.getTime());
	}

	public static inArray_(list: any[], item: any): boolean {
		for (let index = 0; index < list.length; index++) {
			if (list[index] === item) {
				return true;
			}
		}

		return false;
	}

	public static addEventListener_(element: Node, listenerType: ListenerType_, listener: (event: Event) => void, isPassive: boolean = false): () => void {
		if (element.addEventListener) {
			let options: AddEventListenerOptions;
			if (isPassive && Helper_.isPassiveEventListenerSupported_()) {
				options = {
					passive: true,
				};
			}
			element.addEventListener(listenerType, listener, options);

			return (): void => {
				element.removeEventListener(listenerType, listener);
			};
		}

		const listenerProperty = 'on' + listenerType;
		// @ts-ignore
		const originalListener = element[listenerProperty] || null;
		// @ts-ignore
		element[listenerProperty] = (event: Event): void => {
			event = event || window.event;

			if (originalListener) {
				originalListener.call(element, event);
			}

			listener(event);
		};

		return (): void => {
			// @ts-ignore
			element[listenerProperty] = originalListener;
		};
	}

	public static preventDefault_(event: Event): void {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}

	public static stopPropagation_(event: Event): void {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}

	public static checkString_(parameterName: string, value: string | null, checkNonEmpty = false): string {
		if (!checkNonEmpty && !value) {
			return '';
		}
		if (typeof value !== 'string' || (checkNonEmpty && value === '')) {
			throw new Error(parameterName + ' was expected to be a' + (checkNonEmpty ? ' non empty' : '') + ' string.');
		}
		return value;
	}

	public static checkNumber_(parameterName: string, value: number, min: number | null = null, max: number | null = null): number {
		value = typeof value === 'string' ? parseInt(value, 10) : value;
		if (typeof value !== 'number' || isNaN(value) || (min !== null && value < min) || (max !== null && value > max)) {
			throw new Error(parameterName + ' was expected to be a valid number' + (min !== null ? ' from ' + min : '') + (max !== null ? ' to ' + max : '') + '.');
		}
		return value;
	}

	public static checkFunction_<Type extends Function>(parameterName: string, value: Type | null, isNullable = true): Type | null {
		if (isNullable && !value) {
			return null;
		}
		if (typeof value !== 'function') {
			throw new Error(parameterName + ' was expected to be a function' + (isNullable ? ' or null' : '') + '.');
		}
		return value;
	}

	public static warnDeprecatedUsage_(deprecatedMethod: string, alternateMethods: string[]): void {
		if (!window.console) {
			return;
		}

		for (let index = 0; index < Helper_.deprecatedMethods_.length; index++) {
			if (deprecatedMethod === Helper_.deprecatedMethods_[0]) {
				return;
			}
		}

		window.console.warn('TheDatepicker: ' + deprecatedMethod + ' is deprecated, use ' + alternateMethods.join(' or '));
		Helper_.deprecatedMethods_.push(deprecatedMethod);
	}

	public static addSwipeListener_(element: HTMLElement, listener: (event: TouchEvent, moveDirection: MoveDirection_) => void) {
		let startPosition: { x: number; y: number } | null = null;
		let minDistance: { x: number; y: number };

		Helper_.addEventListener_(element, ListenerType_.TouchStart, (event: TouchEvent): void => {
			startPosition = {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY,
			};
			minDistance = {
				x: element.offsetWidth / 5,
				y: element.offsetHeight / 5,
			};
		}, true);

		Helper_.addEventListener_(element, ListenerType_.TouchMove, (event:TouchEvent): void => {
			if (!startPosition) {
				return;
			}

			const diffX = event.touches[0].clientX - startPosition.x;
			const diffY = event.touches[0].clientY - startPosition.y;
			let moveDirection: MoveDirection_ | null = null;
			if (Math.abs(diffX) > minDistance.x) {
				moveDirection = diffX > 0 ? MoveDirection_.Right : MoveDirection_.Left;
			} else if (Math.abs(diffY) > minDistance.x) {
				moveDirection = diffY > 0 ? MoveDirection_.Down : MoveDirection_.Up;
			}

			if (moveDirection) {
				listener(event, moveDirection);
				startPosition = null;
			}
		}, true);
	}

	public static isCssAnimationSupported_(): boolean {
		if (Helper_.cssAnimationSupport_ === null) {
			const fakeElement = document.createElement('div');
			Helper_.cssAnimationSupport_ = fakeElement.style.animationName === '';
		}

		return Helper_.cssAnimationSupport_;
	}

	public static isPassiveEventListenerSupported_(): boolean {
		if (Helper_.passiveEventListenerSupport_ === null) {
			let isSupported: boolean = false;
			try {
				const options = Object.defineProperty({}, 'passive', {
					get: function() {
						isSupported = true;
						return false;
					}
				});
				window.addEventListener('test', null, options);
				window.removeEventListener('test', null, options);
			} catch (error) {}

			Helper_.passiveEventListenerSupport_ = isSupported;
		}

		return Helper_.passiveEventListenerSupport_;
	}

	public static isMobile_(): boolean {
		// @ts-ignore
		const matchMedia = window.matchMedia || window.msMatchMedia;
		const mediaQuery = 'only all and (max-width: 37.5em)';
		if (!matchMedia) {
			return false;
		}

		const result = matchMedia(mediaQuery);
		if (!result) {
			return false;
		}

		return !!result.matches;
	}

}
