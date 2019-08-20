/// <reference path="DayOfWeek.ts" />
/// <reference path="Month.ts" />

namespace TheDatepicker {

	export class Translator {

		public dayOfWeekTranslations = [
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
		];

		public monthTranslations = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		public setDayOfWeekTranslation(dayOfWeek: DayOfWeek, translation: string): void {
			switch (dayOfWeek) {
				case DayOfWeek.Monday:
				case DayOfWeek.Tuesday:
				case DayOfWeek.Wednesday:
				case DayOfWeek.Thursday:
				case DayOfWeek.Friday:
				case DayOfWeek.Saturday:
				case DayOfWeek.Sunday:
					this.dayOfWeekTranslations[dayOfWeek] = translation;
					break;

				default:
					throw new Error('Day of week was expected to be TheDatepicker.DayOfWeek constant, but ' + dayOfWeek + ' given.');
			}
		}

		public setMonthTranslation(month: Month, translation: string): void {
			switch (month) {
				case Month.January:
				case Month.February:
				case Month.March:
				case Month.April:
				case Month.May:
				case Month.June:
				case Month.July:
				case Month.August:
				case Month.September:
				case Month.October:
				case Month.November:
				case Month.December:
					this.monthTranslations[month] = translation;
					break;

				default:
					throw new Error('Month was expected to be TheDatepicker.Month constant, but ' + month + ' given.');
			}
		}

		public translateDayOfWeek(dayOfWeek: DayOfWeek): string {
			return this.dayOfWeekTranslations[dayOfWeek];
		}

		public translateMonth(month: Month): string {
			return this.monthTranslations[month];
		}

	}

}
