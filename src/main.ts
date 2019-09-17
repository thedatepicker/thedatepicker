// @ts-ignore
HTMLElement.prototype.onDatepickerReady = function (callback: (datepicker: TheDatepicker.Datepicker) => void): void {
	if (typeof this.datepicker !== 'undefined') {
		callback(this.datepicker);
		return;
	}

	if (typeof this.datepickerReadyListeners === 'undefined') {
		this.datepickerReadyListeners = [];
	}

	this.datepickerReadyListeners.push(callback);
};
