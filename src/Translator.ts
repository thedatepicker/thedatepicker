namespace TheDatepicker {

	export enum TitleName {
		GoBack,
		GoForward,
		Close,
		Reset,
	}

	export class Translator {

		private dayOfWeekTranslations_ = [
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa',
		];

		private monthTranslations_ = [
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

		private titles_ = {
			[TitleName.GoBack]: 'Previous month',
			[TitleName.GoForward]: 'Next month',
			[TitleName.Close]: 'Close',
			[TitleName.Reset]: 'Reset',
		};

		public setDayOfWeekTranslation(dayOfWeek: DayOfWeek, translation: string): void {
			this.dayOfWeekTranslations_[Helper_.checkNumber_('First day of week', dayOfWeek, 0, 6)] = Helper_.checkString_('Translation', translation);
		}

		public setMonthTranslation(month: Month, translation: string): void {
			this.monthTranslations_[Helper_.checkNumber_('Month', month, 0, 11)] = Helper_.checkString_('Translation', translation);
		}

		public setTitleTranslation(titleName: TitleName, translation: string): void {
			this.titles_[titleName] = Helper_.checkString_('Translation', translation);
		}

		public translateDayOfWeek(dayOfWeek: DayOfWeek): string {
			return this.dayOfWeekTranslations_[dayOfWeek];
		}

		public translateMonth(month: Month): string {
			return this.monthTranslations_[month];
		}

		public translateTitle(titleName: TitleName): string {
			const translation = this.titles_[titleName];
			if (typeof translation !== 'string') {
				throw new Error('Unknown title ' + titleName);
			}

			return translation;
		}

	}

}
