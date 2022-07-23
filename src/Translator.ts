import Helper_, { DayOfWeek, Month } from './Helper';

export enum TitleName {
	GoBack,
	GoForward,
	Close,
	Reset,
	Deselect,
	Month,
	Year,
	GoBackTableOfYears,
	GoForwardTableOfYears,
}

export default class Translator {

	public dayOfWeekFullTranslations_ = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	public dayOfWeekTranslations_ = [
		'Su',
		'Mo',
		'Tu',
		'We',
		'Th',
		'Fr',
		'Sa',
	];

	public monthTranslations_ = [
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

	public monthShortTranslations_ = [
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

	private titles_ = [
		'Go to previous month', // GoBack
		'Go to next month', // GoForward
		'Close calendar', // Close
		'Reset calendar', // Reset
		'Deselect date', // Deselect
		'Month selection', // Month
		'Year selection', // Year
		'Show earlier years', // GoBackTableOfYears
		'Show later years', // GoForwardTableOfYears
	];

	public clone(): Translator {
		const translator = new Translator();
		let index;
		for (index = 0; index < this.dayOfWeekFullTranslations_.length; index++) {
			translator.dayOfWeekFullTranslations_ = this.dayOfWeekFullTranslations_.slice(0);
		}
		for (index = 0; index < this.dayOfWeekTranslations_.length; index++) {
			translator.dayOfWeekTranslations_ = this.dayOfWeekTranslations_.slice(0);
		}
		for (index = 0; index < this.monthTranslations_.length; index++) {
			translator.monthTranslations_ = this.monthTranslations_.slice(0);
		}
		for (index = 0; index < this.monthShortTranslations_.length; index++) {
			translator.monthShortTranslations_ = this.monthShortTranslations_.slice(0);
		}
		for (index = 0; index < this.titles_.length; index++) {
			translator.titles_ = this.titles_.slice(0);
		}
		return translator;
	}

	public setDayOfWeekTranslation(dayOfWeek: DayOfWeek, translation: string): void {
		this.dayOfWeekTranslations_[Helper_.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_.checkString_('Translation', translation, true);
	}

	public setDayOfWeekFullTranslation(dayOfWeek: DayOfWeek, translation: string): void {
		this.dayOfWeekFullTranslations_[Helper_.checkNumber_('Day of week', dayOfWeek, 0, 6)] = Helper_.checkString_('Translation', translation, true);
	}

	public setMonthTranslation(month: Month, translation: string): void {
		this.monthTranslations_[Helper_.checkNumber_('Month', month, 0, 11)] = Helper_.checkString_('Translation', translation, true);
	}

	public setMonthShortTranslation(month: Month, translation: string): void {
		this.monthShortTranslations_[Helper_.checkNumber_('Month', month, 0, 11)] = Helper_.checkString_('Translation', translation, true);
	}

	public setTitleTranslation(titleName: TitleName, translation: string): void {
		this.titles_[Helper_.checkNumber_('Title', titleName, 0, this.titles_.length - 1)] = Helper_.checkString_('Translation', translation);
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
		return this.titles_[titleName];
	}

}
