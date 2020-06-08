namespace TheDatepicker {

	export enum ElementName {
		Container,
		ContainerOver,
		ContainerLeft,
		Deselect,
		DeselectButton,
		Body,
	}

	export class ClassNames {

		private isInitialized_ = false;

		private prefix_ = 'the-datepicker__';

		private classNames_ = {
			[ElementName.Container]: ['container'],
			[ElementName.ContainerOver]: ['container--over'],
			[ElementName.ContainerLeft]: ['container--left'],
			[ElementName.Deselect]: ['deselect'],
			[ElementName.DeselectButton]: ['deselect-button'],
			[ElementName.Body]: ['body'],
		};

		public setClassName(elementName: ElementName, className: string | string[] | null): void {
			this.classNames_[Helper_.checkNumber_('Element', elementName, 0) as ElementName] = this.normalizeClassName_(className);
		}

		public addClassName(elementName: ElementName, className: string | string[]): void {
			this.classNames_[Helper_.checkNumber_('Element', elementName, 0) as ElementName].concat(this.normalizeClassName_(className));
		}

		public getClassNames(elementName: ElementName): string[] {
			if (!this.isInitialized_) {

			}

			return this.classNames_[elementName];
		}

		private normalizeClassName_(className: string | string[] | null): string[] {
			if (typeof className !== 'object' || className.constructor !== Array) {
				className = Helper_.checkString_('Class name', className as string).split(' ');
			}

			const result: string[] = [];
			for (let index = 0; index < className.length; index++) {
				const name = Helper_.checkString_('Class name', className[index]);
				if (name) {
					result.push(name);
				}
			}

			return result;
		}

	}

}
