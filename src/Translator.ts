namespace TheDatepicker {

	export enum TitleName {
		GoBack,
		GoForward,
		Close,
		Reset,
	}

	export class Translator {

		private dayOfWeekFullTranslations_ = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];

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

		private monthShortTranslations_ = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		];

		private titles_ = {
			[TitleName.GoBack]: 'Previous month',
			[TitleName.GoForward]: 'Next month',
			[TitleName.Close]: 'Close',
			[TitleName.Reset]: 'Reset',
		};

		public setDayOfWeekTranslation(dayOfWeek: DayOfWeek, translation: string): void {
			this.dayOfWeekTranslations_[Helper_.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_.checkString_('Translation', translation);
		}

		public setDayOfWeekFullTranslation(dayOfWeek: DayOfWeek, translation: string): void {
			this.dayOfWeekFullTranslations_[Helper_.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_.checkString_('Translation', translation);
		}

		public setMonthTranslation(month: Month, translation: string): void {
			this.monthTranslations_[Helper_.checkNumber_('Month', month, 0, 11)] = Helper_.checkString_('Translation', translation);
		}

		public setMonthShortTranslation(month: Month, translation: string): void {
			this.monthShortTranslations_[Helper_.checkNumber_('Month', month, 0, 11)] = Helper_.checkString_('Translation', translation);
		}

		public setTitleTranslation(titleName: TitleName, translation: string): void {
			this.titles_[titleName] = Helper_.checkString_('Translation', translation);
		}

		public translateDayOfWeek(dayOfWeek: DayOfWeek): string {
			return this.dayOfWeekTranslations_[dayOfWeek];
		}

		public translateDayOfWeekFull(dayOfWeek: DayOfWeek): string {
			return this.dayOfWeekFullTranslations_[dayOfWeek];
		}

		public translateMonth(month: Month): string {
			return this.monthTranslations_[month];
		}

		public translateMonthShort(month: Month): string {
			return this.monthShortTranslations_[month];
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
