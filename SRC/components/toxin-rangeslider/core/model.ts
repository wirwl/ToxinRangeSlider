/* eslint-disable @typescript-eslint/no-empty-function */
import CRangeSliderOptions from './entities/crangeslideroptions';

class TRSModel {
    settings: CRangeSliderOptions;
    static defaults: RangeSliderOptions = {
        isVertical: false,
        isTwoHandles: true,
        isTip: true,
        minValue: 0,
        maxValue: 1000,
        stepValue: 1,
        valueFrom: 0,
        valueTo: 1000,
        items: null,
        onHandlePositionChange(this: HandleMovingResult): void {},
    };

    constructor(options: RangeSliderOptions) {
        this.settings = new CRangeSliderOptions();
        this.settings.extend(TRSModel.defaults);
        this.settings.extend(options);
    }

    validate() {
        if (this.settings.getIsHaveItems()) {
            if (this.settings.items.indexTo > this.settings.items.values.length - 1)
                this.settings.items.indexTo = this.settings.items.values.length - 1;
            if (this.settings.isTwoHandles) {
                if (this.settings.items.indexFrom > this.settings.items.indexTo)
                    this.settings.items.indexFrom = this.settings.items.indexTo;
                if (this.settings.items.indexFrom < 0) this.settings.items.indexFrom = 0;
            }
        } else {
            const size = (this.settings.getMaxValue() as number) - (this.settings.getMinValue() as number);
            if (this.settings.stepValue < 0) this.settings.stepValue = 0;
            if (this.settings.stepValue > size) this.settings.stepValue = size;
            if (this.settings.getValueTo() > this.settings.getMaxValue()) this.settings.setValueTo(this.settings.getMaxValue());
            if (this.settings.isTwoHandles) {
                if (this.settings.getValueFrom() > this.settings.getValueTo()) this.settings.setValueFrom(this.settings.getValueTo());
                if (this.settings.getValueFrom() < this.settings.getMinValue()) this.settings.setValueFrom(this.settings.getMinValue());
            }
        }
    }
}

export default TRSModel;
