namespace TheDatepicker {

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

	export enum KeyCode_ {
		Enter = 13,
		Space = 32,
		Left = 37,
		Up = 38,
		Right = 39,
		Down = 40,
	}

	export enum ListenerType_ {
		MouseDown = 'mousedown',
		Focus = 'focus',
		FocusIn = 'focusin',
		Blur = 'blur',
		KeyDown = 'keydown',
		KeyUp = 'keyup',
		TouchStart = 'touchstart',
		TouchMove = 'touchmove',
		AnimationEnd = 'animationend',
	}

	export class Helper_ {

		private static deprecatedMethods_: string[] = [];

		private static cssAnimationSupport_: boolean | null = null;

		public static resetTime_(date: Date | null): Date | null {
			if (date === null) {
				return null;
			}

			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);

			return date;
		}

		public static normalizeDate_(parameterName: string, value: Day | Date | string | null, options: Options): Date | null {
			if (!value) {
				return null;
			}

			if (value instanceof Day) {
				return value.getDate();
			}

			if (typeof value === 'string') {
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

				const matches = value.match(/^\s*([+-]?)\s*([0-9]+)\s*(day|month|year)s?\s*$/i);
				if (matches !== null) {
					const date = options.getToday();
					const amount = parseInt(matches[2], 10) * (matches[1] === '-' ? -1 : 1);
					switch (matches[3].toLowerCase()) {
						case 'day':
						case 'days':
							date.setDate(date.getDate() + amount);
							break;
						case 'month':
						case 'months':
							date.setMonth(date.getMonth() + amount);
							break;
						case 'year':
						case 'years':
							date.setFullYear(date.getFullYear() + amount);
							break;
					}
					return date;
				}

				const date = Helper_.resetTime_(new Date(value));
				if (!isNaN(date.getTime())) {
					return date;
				}

			} else if (Helper_.isValidDate_(value)) {
				const date = Helper_.resetTime_(new Date(value.getTime()));
				if (!isNaN(date.getTime())) {
					return date;
				}
			}

			throw new Error(parameterName + ' was expected to be a valid Date string or valid Date or Day or null.');
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

		public static addEventListener_(element: Node, listenerType: ListenerType_, listener: (event: Event) => void): () => void {
			if (element.addEventListener) {
				element.addEventListener(listenerType, listener);

				return () => {
					element.removeEventListener(listenerType, listener);
				};
			}

			const listenerProperty = 'on' + listenerType;
			// @ts-ignore
			const originalListener = element[listenerProperty] || null;
			// @ts-ignore
			element[listenerProperty] = (event: Event) => {
				event = event || window.event;

				if (originalListener !== null) {
					originalListener.call(element, event);
				}

				listener(event);
			};

			return () => {
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
			value = typeof value === 'string' ? parseInt(value) : value;
			if (typeof value !== 'number' || isNaN(value) || (min !== null && value < min) || (max !== null && value > max)) {
				throw new Error(parameterName + ' was expected to be a valid number' + (min !== null ? ' from ' + min : '') + (max !== null ? ' to ' + max : '') + '.');
			}
			return value;
		}

		public static checkFunction_(parameterName: string, value: Function | null, isNullable = true): Function | null {
			if (isNullable && !value) {
				return null;
			}
			if (typeof value !== 'function') {
				throw new Error(parameterName + ' was expected to be a function' + (isNullable ? ' or null' : '') + '.');
			}
			return value;
		}

		public static warnDeprecatedUsage_(deprecatedMethod: string, alternateMethod: string): void {
			if (!window.console) {
				return;
			}

			for (let index = 0; index < Helper_.deprecatedMethods_.length; index++) {
				if (deprecatedMethod === Helper_.deprecatedMethods_[0]) {
					return;
				}
			}

			window.console.warn('TheDatepicker: ' + deprecatedMethod + '() is deprecated, use ' + alternateMethod + '()');
			Helper_.deprecatedMethods_.push(deprecatedMethod);
		}

		public static addSwipeListener_(element: HTMLElement, listener: (event: TouchEvent, isRightMove: boolean) => void) {
			let startPosition: number | null = null;
			let minDistance: number | null = null;

			Helper_.addEventListener_(element, ListenerType_.TouchStart, (event: TouchEvent) => {
				startPosition = event.touches[0].clientX;
				minDistance = element.offsetWidth / 5;
			});

			Helper_.addEventListener_(element, ListenerType_.TouchMove, (event:TouchEvent) => {
				if (startPosition === null) {
					return;
				}

				const diff = event.touches[0].clientX - startPosition;
				if (Math.abs(diff) > minDistance) {
					listener(event, diff > 0);
					startPosition = null;
				}
			});
		}

		public static isCssAnimationSupported_(): boolean {
			if (Helper_.cssAnimationSupport_ === null) {
				const fakeElement = document.createElement('div');
				Helper_.cssAnimationSupport_ = fakeElement.style.animationName === '';
			}

			return Helper_.cssAnimationSupport_;
		}

	}

}
