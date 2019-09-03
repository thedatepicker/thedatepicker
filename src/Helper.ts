namespace TheDatepicker {

	export enum KeyCode {
		Enter = 13,
		Space = 32,
		Left = 37,
		Up = 38,
		Right = 39,
		Down = 40,
	}

	export enum ListenerType {
		MouseDown = 'mousedown',
		Focus = 'focus',
		FocusIn = 'focusin',
		Blur = 'blur',
		KeyDown = 'keydown',
		KeyUp = 'keyup',
	}

	export class InvalidDateException {

	}

	export class Helper {

		public static resetTime(date: Date): void {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}

		public static normalizeDate(value: Date | string | null): Date | null {
			if (value === null) {
				return null;
			}

			if (typeof value === 'string') {
				const date = new Date(value);
				if (!isNaN(date.getTime())) {
					Helper.resetTime(date);
					return date;
				}

			} else if (Helper.isValidDate(value)) {
				const date = new Date(value.getTime());
				Helper.resetTime(date);
				return date;
			}

			throw new InvalidDateException();
		}

		public static isElement(element: HTMLElement): boolean {
			return typeof element === 'object'
				&& element.nodeType === 1
				&& typeof element.style === 'object'
				&& typeof element.ownerDocument === 'object';
		}

		public static isValidDate(value: any): boolean {
			return typeof value === 'object'
				&& Object.prototype.toString.call(value) === '[object Date]'
				&& !isNaN(value.getTime());
		}

		public static inArray(list: any[], item: any): boolean {
			for (let index = 0; index < list.length; index++) {
				if (list[index] === item) {
					return true;
				}
			}

			return false;
		}

		public static addEventListener(element: Node, listenerType: ListenerType, listener: (event: Event) => void): void {
			if (element.addEventListener) {
				element.addEventListener(listenerType, listener);
			} else {
				const listenerProperty = 'on' + listenerType;
				// @ts-ignore
				const originalListener = element[listenerProperty] || null;
				// @ts-ignore
				element[listenerProperty] = (event: Event) => {
					if (originalListener !== null) {
						originalListener.call(element, event);
					}

					listener(event);
				};
			}
		}

	}

}
