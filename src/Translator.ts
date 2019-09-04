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
			dayOfWeek = Helper.checkNumber('First day of week', dayOfWeek);
			Helper.checkString('Translation', translation);
			if (dayOfWeek < 0 || dayOfWeek > 6) {
				throw new Error('Day of week was expected to be a number from 0 to 6.')
			}
			this.dayOfWeekTranslations[dayOfWeek] = translation;
		}

		public setMonthTranslation(month: Month, translation: string): void {
			month = Helper.checkNumber('Month', month);
			Helper.checkString('Translation', translation);
			if (month < 0 || month > 11) {
				throw new Error('Month was expected to be a number from 0 to 11.')
			}
			this.monthTranslations[month] = translation;
		}

		public translateDayOfWeek(dayOfWeek: DayOfWeek): string {
			return this.dayOfWeekTranslations[dayOfWeek];
		}

		public translateMonth(month: Month): string {
			return this.monthTranslations[month];
		}

	}

}
