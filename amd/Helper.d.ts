import Day from './Day';
import Options from './Options';
import { MoveDirection_ } from './ViewModel';
export declare enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 0
}
export declare enum Month {
    January = 0,
    February = 1,
    March = 2,
    April = 3,
    May = 4,
    June = 5,
    July = 6,
    August = 7,
    September = 8,
    October = 9,
    November = 10,
    December = 11
}
export declare enum Align {
    Left = 1,
    Right = 2,
    Center = 3
}
export declare enum Position {
    BottomRight = 1,
    BottomLeft = 2,
    TopRight = 3,
    TopLeft = 4
}
export declare enum KeyCode_ {
    Enter = 13,
    Space = 32,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    Esc = 27
}
export declare enum ListenerType_ {
    MouseDown = "mousedown",
    Focus = "focus",
    FocusIn = "focusin",
    Blur = "blur",
    KeyDown = "keydown",
    KeyUp = "keyup",
    KeyPress = "keypress",
    TouchStart = "touchstart",
    TouchMove = "touchmove",
    AnimationEnd = "animationend"
}
export default class Helper_ {
    private static readonly months_;
    private static deprecatedMethods_;
    private static cssAnimationSupport_;
    private static passiveEventListenerSupport_;
    static resetTime_(date: Date | null): Date | null;
    static normalizeDate_(parameterName: string, value: Day | Date | string | null, isNullable: boolean, options: Options): Date | null;
    static isElement_(element: HTMLElement): boolean;
    static isValidDate_(value: any): boolean;
    static inArray_(list: any[], item: any): boolean;
    static addEventListener_(element: Node, listenerType: ListenerType_, listener: (event: Event) => void, isPassive?: boolean): () => void;
    static preventDefault_(event: Event): void;
    static stopPropagation_(event: Event): void;
    static checkString_(parameterName: string, value: string | null, checkNonEmpty?: boolean): string;
    static checkNumber_(parameterName: string, value: number, min?: number | null, max?: number | null): number;
    static checkFunction_<Type extends Function>(parameterName: string, value: Type | null, isNullable?: boolean): Type | null;
    static warnDeprecatedUsage_(deprecatedMethod: string, alternateMethods: string[]): void;
    static addSwipeListener_(element: HTMLElement, listener: (event: TouchEvent, moveDirection: MoveDirection_) => void): void;
    static isCssAnimationSupported_(): boolean;
    static isPassiveEventListenerSupported_(): boolean;
    static isMobile_(): boolean;
}
