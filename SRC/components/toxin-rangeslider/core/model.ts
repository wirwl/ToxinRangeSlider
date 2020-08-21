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
    const {
      items: { indexFrom, indexTo, values },
      stepValue,
      isTwoHandles,
    } = this.settings;

    if (this.settings.getIsHaveItems()) {
      if (indexTo > values.length - 1) {
        this.settings.items.indexTo = values.length - 1;
      }
      if (isTwoHandles) {
        if (indexFrom > indexTo) {
          this.settings.items.indexFrom = indexTo;
        }
        if (indexFrom < 0) this.settings.items.indexFrom = 0;
      }
    } else {
      const maxValue = this.settings.getMaxValue() as number;
      const minValue = this.settings.getMinValue() as number;
      let valueFrom = this.settings.getValueFrom() as number;
      const valueTo = this.settings.getValueTo() as number;
      const size = maxValue - minValue;

      if (stepValue < 0) this.settings.stepValue = 0;
      if (stepValue > size) this.settings.stepValue = size;

      if (isTwoHandles) {
        if (valueFrom > valueTo) {
          valueFrom = valueTo;
          this.settings.setValueFrom(valueTo);
        }
        if (valueTo < valueFrom) this.settings.setValueTo(valueFrom);
        if (valueFrom < minValue) this.settings.setValueFrom(minValue);
      } else if (valueTo < minValue) this.settings.setValueTo(minValue);

      if (valueTo > maxValue) this.settings.setValueTo(maxValue);
    }
  }
}

export default TRSModel;
