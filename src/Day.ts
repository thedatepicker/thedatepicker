namespace TheDatepicker {

	export class Day {

		public readonly dayNumber: number;
		public readonly month: number;
		public readonly year: number;
		public readonly dayOfWeek: number;
		public readonly isWeekend: boolean;

		public isToday = false;
		public isPast = false;
		public isAvailable = true;
		public isInValidity = true;
		public isVisible = true;
		public isInCurrentMonth = true;
		public isSelected = false;
		public isHighlighted = false;
		public isFocused = false;

		public constructor(date: Date) {
			this.dayNumber = date.getDate();
			this.month = date.getMonth() + 1;
			this.year = date.getFullYear();
			this.dayOfWeek = date.getDay();
			this.isWeekend = this.dayOfWeek === DayOfWeek.Saturday || this.dayOfWeek === DayOfWeek.Sunday;
		}

		public getDate(): Date {
			return new Date(this.year, this.month - 1, this.dayNumber, 0, 0, 0, 0);
		}

		public getFormatted(): string {
			return this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.dayNumber).slice(-2);
		}

		public isEqualToDate(date: Date): boolean {
			return date !== null
				&& this.dayNumber === date.getDate()
				&& this.month === date.getMonth() + 1
				&& this.year === date.getFullYear();
		}

		public isEqualToDay(day: Day): boolean {
			return day !== null
				&& this.dayNumber === day.dayNumber
				&& this.month === day.month
				&& this.year === day.year;
		}

	}

}
