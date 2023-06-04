import Helper_ from './Helper';

export enum ClassNameType {
	Container,
	ContainerOver,
	ContainerLeft,
	ContainerResponsive,
	Main,
	Body,
	BodySwipeable,
	Tables,
	Header,
	HeaderTop,
	HeaderControl,
	HeaderNavigation,
	HeaderState,
	HeaderMonth,
	HeaderYear,
	HeaderMonthYear,
	HeaderYearsToggle,
	Button,
	ButtonContent,
	SelectInput,
	Deselect,
	DeselectButton,
	HeaderTitle,
	HeaderTitleContent,
	Reset,
	Close,
	Go,
	GoNext,
	GoPrevious,
	Table,
	TableRow,
	TableCell,
	TableCellUnavailable,
	TableCellHighlighted,
	TableCellSelected,
	CalendarTable,
	CalendarTableHeader,
	CalendarTableHeaderCell,
	CalendarTableBody,
	YearsTable,
	YearsTableBody,
	WeekDayWeekend,
	Day,
	DayToday,
	DayPast,
	DayWeekend,
	DayUnavailable,
	DayOutside,
	DayHighlighted,
	DaySelected,
	DayButton,
	DayButtonContent,
	YearCellButton,
	YearCellButtonContent,
	Animated,
	AnimateFadeOutLeft,
	AnimateFadeInRight,
	AnimateFadeOutUp,
	AnimateFadeInDown,
	AnimateFadeOutRight,
	AnimateFadeInLeft,
	AnimateFadeOutDown,
	AnimateFadeInUp,
	ContainerDarkMode,
	MainDarkMode,
}

export default class ClassNames {

	private classNames_ = [
		['container'], // Container
		['container--over'], // ContainerOver
		['container--left'], // ContainerLeft
		['container--responsive'], // ContainerResponsive
		['main'], // Main
		['body'], // Body
		['body--swipeable'], // BodySwipeable
		['tables'], // Tables
		['header'], // Header
		['top'], // HeaderTop
		['control'], // HeaderControl
		['navigation'], // HeaderNavigation
		['state'], // HeaderState
		['month'], // HeaderMonth
		['year'], // HeaderYear
		['month-year'], // HeaderMonthYear
		['year-button'], // HeaderYearsToggle
		['button'], // Button
		['button-content'], // ButtonContent
		['select'], // SelectInput
		['deselect'], // Deselect
		['deselect-button'], // DeselectButton
		['title'], // HeaderTitle
		['title-content'], // HeaderTitleContent
		['reset'], // Reset
		['close'], // Close
		['go'], // Go
		['go-next'], // GoNext
		['go-previous'], // GoPrevious
		['table'], // Table
		['row'], // TableRow
		['cell'], // TableCell
		['cell--unavailable'], // TableCellUnavailable
		['cell--highlighted'], // TableCellHighlighted
		['cell--selected'], // TableCellSelected
		['calendar'], // CalendarTable
		['calendar-header'], // CalendarTableHeader
		['week-day'], // CalendarTableHeaderCell
		['calendar-body'], // CalendarTableBody
		['years'], // YearsTable
		['years-body'], // YearsTableBody
		['week-day--weekend'], // WeekDayWeekend
		['day'], // Day
		['day--today'], // DayToday
		['day--past'], // DayPast
		['day--weekend'], // DayWeekend
		['day--unavailable'], // DayUnavailable
		['day--outside'], // DayOutside
		['day--highlighted'], // DayHighlighted
		['day--selected'], // DaySelected
		['day--button'], // DayButton
		['day-content'], // DayButtonContent
		['year-cell-button'], // YearCellButton
		['year-cell-content'], // YearCellButtonContent
		['animated'], // Animated
		['fade-out-left'], // AnimateFadeOutLeft
		['fade-in-right'], // AnimateFadeInRight
		['fade-out-up'], // AnimateFadeOutUp
		['fade-in-down'], // AnimateFadeInDown
		['fade-out-right'], // AnimateFadeOutRight
		['fade-in-left'], // AnimateFadeInLeft
		['fade-out-down'], // AnimateFadeOutDown
		['fade-in-up'], // AnimateFadeInUp
		['container--darkmode'], // ContainerDarkMode
		['main--darkmode'], // MainDarkMode
	];

	public clone(): ClassNames {
		const classNames = new ClassNames();
		let index;
		for (index = 0; index < this.classNames_.length; index++) {
			classNames.classNames_ = this.classNames_.slice(0);
		}
		return classNames;
	}

	public setClassName(type: ClassNameType, className: string | string[] | null): void {
		if (type === ClassNameType.ContainerDarkMode) {
			Helper_.warnDeprecatedUsage_('ClassNameType.ContainerDarkMode', ['ClassNameType.MainDarkMode']);
			this.setClassName(ClassNameType.MainDarkMode, className);
		}
		this.classNames_[this.checkType_(type)] = this.normalizeClassName_(className);
	}

	public addClassName(type: ClassNameType, className: string | string[]): void {
		this.classNames_[this.checkType_(type)].concat(this.normalizeClassName_(className));
	}

	public getClassName(type: ClassNameType): string[] {
		return this.classNames_[type].slice(0);
	}

	private checkType_(type: ClassNameType): number {
		return Helper_.checkNumber_('Class name type', type, 0, this.classNames_.length - 1);
	}

	private normalizeClassName_(className: string | string[] | null): string[] {
		const parameterName = 'Class name';
		if (typeof className !== 'object' || className.constructor !== Array) {
			className = Helper_.checkString_(parameterName, className as string).split(/\s+/);
		}

		const result: string[] = [];
		for (let index = 0; index < className.length; index++) {
			const name = Helper_.checkString_(parameterName, className[index]);
			if (name) {
				result.push(name);
			}
		}

		return result;
	}

}
