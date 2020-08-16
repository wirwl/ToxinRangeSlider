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
        onHandlePositionChange(this: HandleMovingResult): void { },
    };

    constructor(options: RangeSliderOptions) {
        this.settings = new CRangeSliderOptions();
        this.settings.extend(TRSModel.defaults);
        this.settings.extend(options);
    }

    validate() {
        let {
            items: { indexFrom, indexTo, values },
            stepValue, isTwoHandles
        } = this.settings;

        if (this.settings.getIsHaveItems()) {
            if (indexTo > values.length - 1)
                indexTo = values.length - 1;
            if (isTwoHandles) {
                if (indexFrom > indexTo)
                    indexFrom = indexTo;
                if (indexFrom < 0) indexFrom = 0;
            }
        } else {
            const size = (this.settings.getMaxValue() as number) - (this.settings.getMinValue() as number);
            if (stepValue < 0) stepValue = 0;
            if (stepValue > size) stepValue = size;
            if (this.settings.getValueTo() > this.settings.getMaxValue()) this.settings.setValueTo(this.settings.getMaxValue());
            if (isTwoHandles) {
                if (this.settings.getValueFrom() > this.settings.getValueTo()) this.settings.setValueFrom(this.settings.getValueTo());
                if (this.settings.getValueFrom() < this.settings.getMinValue()) this.settings.setValueFrom(this.settings.getMinValue());
            }
        }
    }
}

export default TRSModel;
