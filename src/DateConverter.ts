import Options from './Options';
import { DayOfWeek, Month } from './Helper';

export class CannotParseDateException {

}

class ParsedDateData {

	public day: number | null = null;
	public month: number | null = null;
	public year: number | null = null;

	public createDate(): Date {
		if (this.day === null || this.month === null || this.year === null) {
			throw new CannotParseDateException();
		}

		let date = new Date(this.year, this.month - 1, this.day);
		if (isNaN(date.getTime())) {
			throw new CannotParseDateException();
		}

		while (date.getDate() !== this.day || date.getMonth() !== this.month - 1 || date.getFullYear() !== this.year) {
			if (this.day > 28) {
				this.day--;
				date = new Date(this.year, this.month - 1, this.day);
			} else {
				throw new CannotParseDateException();
			}
		}

		return date;
	}

}

export default class DateConverter_ {

	private static readonly escapeChar_ = '\\';

	public static formatDate_(date: Date | null, options: Options, format: string | null = null): string | null {
		if (!date) {
			return null;
		}

		format = format || options.getInputFormat();
		let escapeNext = false;
		let result = '';
		for (let position = 0; position < format.length; position++) {
			const char = format.substring(position, position + 1);

			if (escapeNext) {
				result += char;
				escapeNext = false;
				continue;
			}

			if (char === DateConverter_.escapeChar_) {
				escapeNext = true;
				continue;
			}

			const formatter = DateConverter_.getFormatter_(char);
			if (formatter) {
				result += formatter.call(null, date, options);
				continue;
			}

			result += char;
		}

		return result;
	}

	public static parseDate_(text: string, options: Options): Date | null {
		if (text === '') {
			return null;
		}

		const format = options.getInputFormat();
		const dateData = new ParsedDateData();
		let escapeNext = false;
		let textPosition = 0;
		for (let position = 0; position < format.length; position++) {
			const char = format.substring(position, position + 1);

			if (escapeNext) {
				escapeNext = false;

			} else if (char === DateConverter_.escapeChar_) {
				escapeNext = true;
				continue;

			} else {
				const parser = DateConverter_.getParser_(char);
				if (parser) {
					try {
						textPosition += parser.call(null, text.substring(textPosition), dateData, options);
					} catch (error) {
						if (!(error instanceof CannotParseDateException)) {
							throw error;
						}

						const textChar = text.substring(textPosition, textPosition + 1);
						if (textChar === ' ') {
							textPosition++;
							position--;
							continue;
						} else {
							throw error;
						}
					}
					continue;
				}
			}

			const textChar = text.substring(textPosition, textPosition + 1);
			if (textChar !== char) {
				if (char === ' ') {
					continue;
				}
				if (textChar === ' ') {
					textPosition++;
					position--;
					continue;
				}

				throw new CannotParseDateException();
			}
			textPosition++;
		}

		return dateData.createDate();
	}

	public static isValidChar_(textChar: string, options: Options): boolean {
		if (textChar === '' || /[0-9-]/.test(textChar)) {
			return true;
		}

		const format = options.getInputFormat();
		let escapeNext = false;
		for (let position = 0; position < format.length; position++) {
			const char = format.substring(position, position + 1);

			if (escapeNext) {
				escapeNext = false;

			} else if (char === DateConverter_.escapeChar_) {
				escapeNext = true;
				continue;

			} else {
				const phrases = DateConverter_.getValidPhrases_(char, options);
				if (phrases) {
					const textCharLower = textChar.toLowerCase();
					for (let index = 0; index < phrases.length; index++) {
						if (phrases[index].toLowerCase().indexOf(textCharLower) > -1) {
							return true;
						}
					}
					continue;
				}
			}

			if (textChar === char) {
				return true;
			}
		}

		return false;
	}

	private static getFormatter_(type: string): ((date: Date, options: Options) => string) | null {
		switch (type) {
			// Day of the month (1 to 31)
			case 'j':
				return DateConverter_.formatDay_;

			// Day of the month with leading zero (01 to 31)
			case 'd':
				return DateConverter_.formatDayWithLeadingZero_;

			// Short textual representation of a day of the week (Mo through Su)
			case 'D':
				return DateConverter_.formatDayOfWeekTextual_;

			// Textual representation of a day of the week (Monday through Sunday)
			case 'l':
				return DateConverter_.formatDayOfWeekTextualFull_;

			// Numeric representation of a month (1 through 12)
			case 'n':
				return DateConverter_.formatMonth_;

			// Numeric representation of a month with leading zero (01 through 12)
			case 'm':
				return DateConverter_.formatMonthWithLeadingZero_;

			// Textual representation of a month (January through December)
			case 'F':
				return DateConverter_.formatMonthTextual_;

			// Short textual representation of a month (Jan through Dec)
			case 'M':
				return DateConverter_.formatMonthTextualShort_;

			// Full year (1999 or 2003)
			case 'Y':
				return DateConverter_.formatYear_;

			// Year, 2 digits (99 or 03)
			case 'y':
				return DateConverter_.formatYearTwoDigits_;

			default:
				return null;
		}
	}

	private static formatDay_(date: Date): string {
		return date.getDate() + '';
	}

	private static formatDayWithLeadingZero_(date: Date): string {
		return ('0' + date.getDate()).slice(-2);
	}

	private static formatDayOfWeekTextual_(date: Date, options: Options): string {
		return options.translator.translateDayOfWeek(date.getDay());
	}

	private static formatDayOfWeekTextualFull_(date: Date, options: Options): string {
		return options.translator.translateDayOfWeekFull(date.getDay());
	}

	private static formatMonth_(date: Date): string {
		return (date.getMonth() + 1) + '';
	}

	private static formatMonthWithLeadingZero_(date: Date): string {
		return ('0' + (date.getMonth() + 1)).slice(-2);
	}

	private static formatMonthTextual_(date: Date, options: Options): string {
		return options.translator.translateMonth(date.getMonth());
	}

	private static formatMonthTextualShort_(date: Date, options: Options): string {
		return options.translator.translateMonthShort(date.getMonth());
	}

	private static formatYear_(date: Date): string {
		return date.getFullYear() + '';
	}

	private static formatYearTwoDigits_(date: Date): string {
		const year = date.getFullYear() + '';
		return year.substring(year.length - 2);
	}

	private static getParser_(type: string): ((text: string, dateData: ParsedDateData, options: Options) => number) | null {
		switch (type) {
			case 'j':
			case 'd':
				return DateConverter_.parseDay_;

			case 'D':
				return DateConverter_.parseDayOfWeekTextual_;

			case 'l':
				return DateConverter_.parseDayOfWeekTextualFull_;

			case 'n':
			case 'm':
				return DateConverter_.parseMonth_;

			case 'F':
				return DateConverter_.parseMonthTextual_;

			case 'M':
				return DateConverter_.parseMonthTextualShort_;

			case 'Y':
				return DateConverter_.parseYear_;

			case 'y':
				return DateConverter_.parseYearTwoDigits_;

			default:
				return null;
		}
	}

	private static parseDay_(text: string, dateData: ParsedDateData): number {
		let took = 0;
		while (text.substring(0, 1) === '0') {
			text = text.substring(1);
			took++;
		}

		let day = text.substring(0, 2);
		if (!/[12][0-9]|3[01]/.test(day)) {
			day = day.substring(0, 1);
			if (!/[1-9]/.test(day)) {
				throw new CannotParseDateException();
			}
		}

		dateData.day = parseInt(day, 10);

		return took + day.length;
	}

	private static parseDayOfWeekTextual_(text: string, dateData: ParsedDateData, options: Options): number {
		return DateConverter_.parseDayOfWeekByTranslator_(text, (dayOfWeek: DayOfWeek): string => {
			return options.translator.translateDayOfWeek(dayOfWeek);
		});
	}

	private static parseDayOfWeekTextualFull_(text: string, dateData: ParsedDateData, options: Options): number {
		return DateConverter_.parseDayOfWeekByTranslator_(text, (dayOfWeek: DayOfWeek): string => {
			return options.translator.translateDayOfWeekFull(dayOfWeek);
		});
	}

	private static parseDayOfWeekByTranslator_(text: string, translate: (dayOfWeek: DayOfWeek) => string): number {
		let maxLength = 0;
		let matchedTranslationLength: number = 0;
		for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
			const translation = translate(dayOfWeek);
			maxLength = Math.max(maxLength, translation.length);

			if (
				text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()
				&& translation.length > matchedTranslationLength
			) {
				matchedTranslationLength = translation.length;
			}
		}

		if (matchedTranslationLength > 0) {
			return matchedTranslationLength;
		}

		let took = 0;
		while (/[a-zA-Z]/.test(text.substring(0, 1))) {
			text = text.substring(1);
			took++;
			if (took === maxLength) {
				break;
			}
		}

		return took;
	}

	private static parseMonth_(text: string, dateData: ParsedDateData): number {
		let took = 0;
		while (text.substring(0, 1) === '0') {
			text = text.substring(1);
			took++;
		}

		let month = text.substring(0, 2);
		if (month !== '10' && month !== '11' && month !== '12') {
			month = month.substring(0, 1);
			if (!/[1-9]/.test(month)) {
				throw new CannotParseDateException();
			}
		}

		dateData.month = parseInt(month, 10);

		return took + month.length;
	}

	private static parseMonthTextual_(text: string, dateData: ParsedDateData, options: Options): number {
		return DateConverter_.parseMonthByTranslator_(text, dateData, (month: Month): string => {
			return options.translator.translateMonth(month);
		});
	}

	private static parseMonthTextualShort_(text: string, dateData: ParsedDateData, options: Options): number {
		return DateConverter_.parseMonthByTranslator_(text, dateData, (month: Month): string => {
			return options.translator.translateMonthShort(month);
		});
	}

	private static parseMonthByTranslator_(text: string, dateData: ParsedDateData, translate: (month: Month) => string): number {
		let matchedMonth: number | null = null;
		let matchedTranslationLength: number = 0;
		for (let month = 1; month <= 12; month++) {
			const translation = translate(month - 1);
			if (
				text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()
				&& translation.length > matchedTranslationLength
			) {
				matchedMonth = month;
				matchedTranslationLength = translation.length;
			}
		}

		if (matchedMonth === null) {
			throw new CannotParseDateException();
		}

		dateData.month = matchedMonth;
		return matchedTranslationLength;
	}

	private static parseYear_(text: string, dateData: ParsedDateData, options: Options): number {
		let isNegative = false;
		if (text.substring(0, 1) === '-') {
			isNegative = true;
			text = text.substring(1);
		}

		const minDate = options.getMinDate_();
		const maxDate = options.getMaxDate_();
		const maxPositiveLength = maxDate.getFullYear() > 0 ? (maxDate.getFullYear() + '').length : 0;
		const maxNegativeLength = minDate.getFullYear() < 0 ? (-minDate.getFullYear() + '').length : 0;

		let yearLength = 0;
		while (/[0-9]/.test(text.substring(yearLength, yearLength + 1))) {
			if (
				(isNegative && yearLength + 1 > maxNegativeLength)
				|| (!isNegative && yearLength + 1 > maxPositiveLength)
			) {
				break;
			}
			yearLength++;
		}
		if (yearLength === 0) {
			throw new CannotParseDateException();
		}

		let year = parseInt(text.substring(0, yearLength), 10);
		if (isNegative) {
			year = -year;
		}

		dateData.year = year;

		return yearLength + (isNegative ? 1 : 0);
	}

	private static parseYearTwoDigits_(text: string, dateData: ParsedDateData, options: Options): number {
		const yearEnd = text.substring(0, 2);
		if (!/[0-9]{2}/.test(yearEnd)) {
			throw new CannotParseDateException();
		}

		const currentYear = (options.getToday()).getFullYear() + '';
		const yearBeginning = currentYear.substring(0, currentYear.length - 2);

		dateData.year = parseInt(yearBeginning + yearEnd, 10);

		return 2;
	}

	private static getValidPhrases_(type: string, options: Options): string[] | null {
		switch (type) {
			case 'j':
			case 'd':
			case 'n':
			case 'm':
			case 'Y':
			case 'y':
				return [];
			case 'D':
				return options.translator.dayOfWeekTranslations_;
			case 'l':
				return options.translator.dayOfWeekFullTranslations_;
			case 'F':
				return options.translator.monthTranslations_;
			case 'M':
				return options.translator.monthShortTranslations_;
			default:
				return null;
		}
	}

}
