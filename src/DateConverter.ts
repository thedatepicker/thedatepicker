namespace TheDatepicker {

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

	export class DateConverter_ {

		private readonly escapeChar_ = '\\';

		public constructor(private readonly options_: Options) {
		}

		public formatDate_(format: string, date: Date | null): string | null {
			if (date === null) {
				return null;
			}

			let escapeNext = false;
			let result = '';
			for (let position = 0; position < format.length; position++) {
				const char = format.substring(position, position + 1);

				if (escapeNext) {
					result += char;
					escapeNext = false;
					continue;
				}

				if (char === this.escapeChar_) {
					escapeNext = true;
					continue;
				}

				const formatter = this.getFormatter_(char);
				if (formatter !== null) {
					result += formatter.call(this, date);
					continue;
				}

				result += char;
			}

			return result;
		}

		public parseDate_(format: string, text: string): Date | null {
			if (text === '') {
				return null;
			}

			const dateData = new ParsedDateData();
			let escapeNext = false;
			let textPosition = 0;
			for (let position = 0; position < format.length; position++) {
				const char = format.substring(position, position + 1);

				if (escapeNext) {
					escapeNext = false;

				} else if (char === this.escapeChar_) {
					escapeNext = true;
					continue;

				} else {
					const parser = this.getParser_(char);
					if (parser !== null) {
						try {
							textPosition += parser.call(this, text.substring(textPosition), dateData);
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

		private getFormatter_(type: string): ((date: Date) => string) | null {
			switch (type) {
				// Day of the month (1 to 31)
				case 'j':
					return this.formatDay_;

				// Day of the month with leading zero (01 to 31)
				case 'd':
					return this.formatDayWithLeadingZero_;

				// Short textual representation of a day of the week (Mo through Su)
				case 'D':
					return this.formatDayOfWeekTextual_;

				// Textual representation of a day of the week (Monday through Sunday)
				case 'l':
					return this.formatDayOfWeekTextualFull_;

				// Numeric representation of a month (1 through 12)
				case 'n':
					return this.formatMonth_;

				// Numeric representation of a month with leading zero (01 through 12)
				case 'm':
					return this.formatMonthWithLeadingZero_;

				// Textual representation of a month (January through December)
				case 'F':
					return this.formatMonthTextual_;

				// Short textual representation of a month (Jan through Dec)
				case 'M':
					return this.formatMonthTextualShort_;

				// Full year (1999 or 2003)
				case 'Y':
					return this.formatYear_;

				// Year, 2 digits (99 or 03)
				case 'y':
					return this.formatYearTwoDigits_;

				default:
					return null;
			}
		}

		private formatDay_(date: Date): string {
			return date.getDate() + '';
		}

		private formatDayWithLeadingZero_(date: Date): string {
			return ('0' + date.getDate()).slice(-2);
		}

		private formatDayOfWeekTextual_(date: Date): string {
			return this.options_.translator.translateDayOfWeek(date.getDay());
		}

		private formatDayOfWeekTextualFull_(date: Date): string {
			return this.options_.translator.translateDayOfWeekFull(date.getDay());
		}

		private formatMonth_(date: Date): string {
			return (date.getMonth() + 1) + '';
		}

		private formatMonthWithLeadingZero_(date: Date): string {
			return ('0' + (date.getMonth() + 1)).slice(-2);
		}

		private formatMonthTextual_(date: Date): string {
			return this.options_.translator.translateMonth(date.getMonth());
		}

		private formatMonthTextualShort_(date: Date): string {
			return this.options_.translator.translateMonthShort(date.getMonth());
		}

		private formatYear_(date: Date): string {
			return date.getFullYear() + '';
		}

		private formatYearTwoDigits_(date: Date): string {
			const year = date.getFullYear() + '';
			return year.substring(year.length - 2);
		}

		private getParser_(type: string): ((text: string, dateData: ParsedDateData) => number) | null {
			switch (type) {
				case 'j':
				case 'd':
					return this.parseDay_;

				case 'D':
					return this.parseDayOfWeekTextual_;

				case 'l':
					return this.parseDayOfWeekTextualFull_;

				case 'n':
				case 'm':
					return this.parseMonth_;

				case 'F':
					return this.parseMonthTextual_;

				case 'M':
					return this.parseMonthTextualShort_;

				case 'Y':
					return this.parseYear_;

				case 'y':
					return this.parseYearTwoDigits_;

				default:
					return null;
			}
		}

		private parseDay_(text: string, dateData: ParsedDateData): number {
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

		private parseDayOfWeekTextual_(text: string): number {
			return this.parseDayOfWeekByTranslator_(text, (dayOfWeek: DayOfWeek): string => {
				return this.options_.translator.translateDayOfWeek(dayOfWeek);
			});
		}

		private parseDayOfWeekTextualFull_(text: string): number {
			return this.parseDayOfWeekByTranslator_(text, (dayOfWeek: DayOfWeek): string => {
				return this.options_.translator.translateDayOfWeekFull(dayOfWeek);
			});
		}

		private parseDayOfWeekByTranslator_(text: string, translate: (dayOfWeek: DayOfWeek) => string): number {
			let maxLength = 0;
			for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
				const translation = translate(dayOfWeek);
				maxLength = Math.max(maxLength, translation.length);

				if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()) {
					return translation.length;
				}
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

		private parseMonth_(text: string, dateData: ParsedDateData): number {
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

		private parseMonthTextual_(text: string, dateData: ParsedDateData): number {
			return this.parseMonthByTranslator_(text, dateData, (month: Month): string => {
				return this.options_.translator.translateMonth(month);
			});
		}

		private parseMonthTextualShort_(text: string, dateData: ParsedDateData): number {
			return this.parseMonthByTranslator_(text, dateData, (month: Month): string => {
				return this.options_.translator.translateMonthShort(month);
			});
		}

		private parseMonthByTranslator_(text: string, dateData: ParsedDateData, translate: (month: Month) => string): number {
			for (let month = 1; month <= 12; month++) {
				const translation = translate(month - 1);

				if (text.substring(0, translation.length).toLowerCase() === translation.toLowerCase()) {
					dateData.month = month;
					return translation.length;
				}
			}

			throw new CannotParseDateException();
		}

		private parseYear_(text: string, dateData: ParsedDateData): number {
			let isNegative = false;
			if (text.substring(0, 1) === '-') {
				isNegative = true;
				text = text.substring(1);
			}

			let yearLength = 0;
			while (/[0-9]/.test(text.substring(yearLength, yearLength + 1))) {
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

		private parseYearTwoDigits_(text: string, dateData: ParsedDateData): number {
			const yearEnd = text.substring(0, 2);
			if (!/[0-9]{2}/.test(yearEnd)) {
				throw new CannotParseDateException();
			}

			const currentYear = (this.options_.getToday()).getFullYear() + '';
			const yearBeginning = currentYear.substring(0, currentYear.length - 2);

			dateData.year = parseInt(yearBeginning + yearEnd, 10);

			return 2;
		}

	}

}
