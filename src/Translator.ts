namespace TheDatepicker {

	export class Translator {

		private dayOfWeekTranslations = [
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
		];

		private monthTranslations = [
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
			this.dayOfWeekTranslations[Helper.checkNumber('First day of week', dayOfWeek, 0, 6)] = Helper.checkString('Translation', translation);
		}

		public setMonthTranslation(month: Month, translation: string): void {
			this.monthTranslations[Helper.checkNumber('Month', month, 0, 11)] = Helper.checkString('Translation', translation);
		}

		public translateDayOfWeek(dayOfWeek: DayOfWeek): string {
			return this.dayOfWeekTranslations[dayOfWeek];
		}

		public translateMonth(month: Month): string {
			return this.monthTranslations[month];
		}

	}

}
