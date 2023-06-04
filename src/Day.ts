import Helper_, { DayOfWeek } from './Helper';

export type CreateDay = (date: Date) => Day;
export type FormatDate = (date: Date, format: string | null) => string;

export default class Day {

	public readonly dayNumber: number;
	public readonly month: number;
	public readonly year: number;
	public readonly dayOfWeek: number;
	public readonly isWeekend: boolean;

	public isToday = false;
	public isPast = false;
	public isAvailable = true;
	public isInValidity = true;
	public isVisible = false;
	public isInCurrentMonth = false;
	public isSelected = false;
	public isHighlighted = false;
	public isFocused = false;

	private readonly createDay_: CreateDay;
	private readonly formatDate_: FormatDate;

	public constructor(date: Date, createDay: CreateDay, formatDate: FormatDate) {
		this.dayNumber = date.getDate();
		this.month = date.getMonth() + 1;
		this.year = date.getFullYear();
		this.dayOfWeek = date.getDay();
		this.isWeekend = this.dayOfWeek === DayOfWeek.Saturday || this.dayOfWeek === DayOfWeek.Sunday;
		this.createDay_ = createDay;
		this.formatDate_ = formatDate;
	}

	public getDate(): Date {
		return new Date(this.year, this.month - 1, this.dayNumber, 0, 0, 0, 0);
	}

	public getFormatted(): string {
		return this.year + '-' + ('0' + this.month).slice(-2) + '-' + ('0' + this.dayNumber).slice(-2);
	}

	public getInputFormatted(format: string | null = null): string {
		return this.formatDate_(this.getDate(), Helper_.checkString_('Format', format));
	}

	public isEqualToDate(date: Date): boolean {
		return Helper_.isValidDate_(date)
			&& this.dayNumber === date.getDate()
			&& this.month === date.getMonth() + 1
			&& this.year === date.getFullYear();
	}

	public isEqualToDay(day: Day): boolean {
		return day instanceof Day
			&& this.dayNumber === day.dayNumber
			&& this.month === day.month
			&& this.year === day.year;
	}

	public getSibling(shift = 1): Day {
		const date = this.getDate();
		date.setDate(date.getDate() + Helper_.checkNumber_('Shift', shift));
		return this.createDay_(date);
	}

}
