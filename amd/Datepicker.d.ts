import Day from './Day';
import Options from './Options';
export interface HTMLDatepickerInputElement {
    datepicker?: Datepicker;
}
export interface HTMLDatepickerContainerElement extends HTMLElement {
    datepicker?: Datepicker;
    onfocusin?: (event: FocusEvent) => void;
}
export type HTMLDatepickerElement = (HTMLDatepickerInputElement & HTMLElement) | HTMLDatepickerContainerElement;
export type ReadyListener = (datepicker: Datepicker, element: HTMLDatepickerElement) => void;
export type ReadyPromiseResolve = (datepicker: Datepicker) => void;
export default class Datepicker {
    readonly options: Options;
    input: (HTMLDatepickerInputElement & HTMLElement) | null;
    readonly container: HTMLDatepickerContainerElement;
    private readonly isContainerExternal_;
    private readonly inputClickable_;
    private readonly inputText_;
    private readonly viewModel_;
    private initializationPhase_;
    private inputListenerRemover_;
    private listenerRemovers_;
    private deselectElement_;
    private deselectButton_;
    private static document_;
    private static readyListeners_;
    private static areGlobalListenersInitialized_;
    private static activeViewModel_;
    private static hasClickedViewModel_;
    constructor(input: (HTMLDatepickerInputElement & HTMLElement) | null, container?: HTMLDatepickerContainerElement | null, options?: Options | null);
    render(): void;
    open(event?: Event | null): boolean;
    isOpened(): boolean;
    close(event?: Event | null): boolean;
    reset(event?: Event | null): boolean;
    destroy(): void;
    isDestroyed(): boolean;
    selectDate(date: Date | string | null, doUpdateMonth?: boolean, event?: Event | null): boolean;
    getSelectedDate(): Date | null;
    getSelectedDateFormatted(format?: string | null): string | null;
    getCurrentMonth(): Date;
    goToMonth(month: Date | string, event?: Event | null): boolean;
    parseRawInput(): Date | null;
    getDay(date: Date | string): Day;
    canType_(char: string): boolean;
    readInput_(event?: Event | null): boolean;
    updateInput_(): void;
    static onDatepickerReady(element: HTMLDatepickerElement, callback?: ReadyListener | null): Promise<Datepicker> | null;
    private createContainer_;
    private createDeselectElement_;
    private updateDeselectElement_;
    private preselectFromInput_;
    private initListeners_;
    private removeInitialInputListener_;
    private triggerReady_;
    private triggerReadyListener_;
    private onActivate_;
    private updateContainer_;
    private static setBodyClass_;
    private static activateViewModel_;
}
export declare const onDatepickerReady: typeof Datepicker.onDatepickerReady;
