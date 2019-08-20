namespace TheDatepicker {

	export class DateHelper {

		public static resetTime(date: Date): void {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}

	}

}
