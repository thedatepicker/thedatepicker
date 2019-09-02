namespace TheDatepicker {

	export class Helper {

		public static resetTime(date: Date): void {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}

		public static isElement(element: HTMLElement): boolean {
			return typeof element === 'object'
				&& element.nodeType === 1
				&& typeof element.style === 'object'
				&& typeof element.ownerDocument === 'object';
		}

		public static inArray(list: any[], item: any): boolean {
			for (let index = 0; index < list.length; index++) {
				if (list[index] === item) {
					return true;
				}
			}

			return false;
		}

	}

}
