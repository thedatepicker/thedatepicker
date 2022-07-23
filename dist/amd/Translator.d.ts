import { DayOfWeek, Month } from './Helper';
export declare enum TitleName {
    GoBack = 0,
    GoForward = 1,
    Close = 2,
    Reset = 3,
    Deselect = 4,
    Month = 5,
    Year = 6,
    GoBackTableOfYears = 7,
    GoForwardTableOfYears = 8
}
export default class Translator {
    dayOfWeekFullTranslations_: string[];
    dayOfWeekTranslations_: string[];
    monthTranslations_: string[];
    monthShortTranslations_: string[];
    private titles_;
    clone(): Translator;
    setDayOfWeekTranslation(dayOfWeek: DayOfWeek, translation: string): void;
    setDayOfWeekFullTranslation(dayOfWeek: DayOfWeek, translation: string): void;
    setMonthTranslation(month: Month, translation: string): void;
    setMonthShortTranslation(month: Month, translation: string): void;
    setTitleTranslation(titleName: TitleName, translation: string): void;
    translateDayOfWeek(dayOfWeek: DayOfWeek): string;
    translateDayOfWeekFull(dayOfWeek: DayOfWeek): string;
    translateMonth(month: Month): string;
    translateMonthShort(month: Month): string;
    translateTitle(titleName: TitleName): string;
}
