namespace TheDatepicker {

	export class RangeDatepickers {

		public readonly sinceDatepicker: Datepicker;
		public readonly untilDatepicker: Datepicker;
		public readonly options: RangeOptions;

		public constructor(
			sinceDatepicker: Datepicker,
			untilDatepicker: Datepicker,
			options: RangeOptions | null = null
		) {
			if (!(sinceDatepicker instanceof Datepicker) || !(untilDatepicker instanceof Datepicker)) {
				throw new Error('Datepicker was expected to be an instance of Datepicker.');
			}
			if (options !== null && !(options instanceof RangeOptions)) {
				throw new Error('Options was expected to be an instance of RangeOptions.');
			}

			this.options = options !== null ? options.clone() : new RangeOptions();

			this.sinceDatepicker = sinceDatepicker;
			this.untilDatepicker = untilDatepicker;
		}

		private init() {

		}

	}

}
