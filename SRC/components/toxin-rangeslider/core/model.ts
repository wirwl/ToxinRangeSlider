import CRangeSliderOptions from './entities/crangeslideroptions';

export default class TRSModel {
    settings: CRangeSliderOptions;
    static defaults: RangeSliderOptions = {
        isVertical: false,
        isTwoHandles: true,
        isTip: true,
        minValue: 0,
        maxValue: 1000,
        stepValue: 0,
        valueFrom: 0,
        valueTo: 1000,
        items: { indexFrom: 0, indexTo: 1, values: [] },
        onHandlePositionChange(this: HandleMovingResult): void {},
    };
    constructor(options: RangeSliderOptions) {
        this.settings = new CRangeSliderOptions();
        //$.extend(true, this.settings, TRSModel.defaults);
        //$.extend(true, this.settings, options);
        this.settings.extend(TRSModel.defaults);
        this.settings.extend(options);
    }
    validate() {
        if (this.settings.isHaveItems) {
            if (this.settings.items.indexTo > this.settings.items.values.length - 1)
                this.settings.items.indexTo = this.settings.items.values.length - 1;
            if (this.settings.isTwoHandles) {
                if (this.settings.items.indexFrom > this.settings.items.indexTo)
                    this.settings.items.indexFrom = this.settings.items.indexTo;
                if (this.settings.items.indexFrom < 0) this.settings.items.indexFrom = 0;
            }
        } else {
            const size = (this.settings.maxValue as number) - (this.settings.minValue as number);
            if (this.settings.stepValue < 0) this.settings.stepValue = 0;
            if (this.settings.stepValue > size) this.settings.stepValue = size;
            if (this.settings.valueTo > this.settings.maxValue) this.settings.valueTo = this.settings.maxValue;
            if (this.settings.isTwoHandles) {
                if (this.settings.valueFrom > this.settings.valueTo) this.settings.valueFrom = this.settings.valueTo;
                if (this.settings.valueFrom < this.settings.minValue) this.settings.valueFrom = this.settings.minValue;
            }
        }
    }
}
