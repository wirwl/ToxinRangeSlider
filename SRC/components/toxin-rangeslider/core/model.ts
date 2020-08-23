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
      getIsHaveItems,
      getMinValue,
      getMaxValue,
      setMinValue,
      setMaxValue,
      getValueFrom,
      getValueTo,
      setValueFrom,
      setValueTo
    } = this.settings;

    if (getIsHaveItems()) {
      setMinValue(values[0]);
      setMaxValue(values[values.length-1]);

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
      let maxValue = getMaxValue() as number;
      let minValue = getMinValue() as number;
      let valueFrom = getValueFrom() as number;
      let valueTo = getValueTo() as number;

      if (maxValue<=minValue) {
        setMinValue(maxValue);        
        setMaxValue(minValue);
        minValue=getMinValue() as number;
        maxValue=getMaxValue() as number;
        if (valueFrom<minValue || valueFrom>maxValue) setValueFrom(getMinValue());
        if (valueTo<minValue || valueTo>maxValue) setValueTo(getMaxValue());
      }

      const size = maxValue - minValue;

      if (stepValue < 1) this.settings.stepValue = 1;
      if (this.settings.stepValue > size) this.settings.stepValue = size;

      if (isTwoHandles) {
        if (valueFrom > valueTo) {
          setValueFrom(valueTo);
          setValueTo(valueFrom);
          valueFrom = getValueFrom() as number;
          valueTo = getValueTo() as number;
        }
        if (valueTo < valueFrom) setValueTo(valueFrom);
        if (valueFrom < minValue) setValueFrom(minValue);
      } else if (valueTo < minValue) setValueTo(minValue);

      if (valueTo > maxValue) setValueTo(maxValue);
    }
  }
}

export default TRSModel;
