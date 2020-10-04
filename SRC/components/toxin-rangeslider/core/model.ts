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
    onHandlePositionChange(this: HandleMovingResult): void {},
  };

  constructor(options?: RangeSliderOptions) {
    this.settings = new CRangeSliderOptions();
    this.settings.extend(TRSModel.defaults);
    this.settings.extend(options!);
  }

  validate() {
    const {
      items,
      items: { indexFrom, indexTo, values },
      stepValue,
      isTwoHandles,
      isVertical,
      isTip,
      IsHaveItems,
      getMinValue,
      getMaxValue,
      setMinValue,
      setMaxValue,
      getValueFrom,
      getValueTo,
      setValueFrom,
      setValueTo,
    } = this.settings;

    if (IsHaveItems()) {
      setMinValue(values![0]!);
      setMaxValue(values![values!.length - 1]);

      if (typeof indexFrom === 'undefined') this.settings.items.indexFrom = 0;
      if (typeof indexTo === 'undefined') this.settings.items.indexTo = values!.length - 1;

      if (indexTo! > values!.length - 1) {
        this.settings.items.indexTo = values!.length - 1;
      }
      if (isTwoHandles) {
        if (indexFrom! > indexTo!) {
          this.settings.items.indexFrom = indexTo;
        }
        if (indexFrom! < 0) this.settings.items.indexFrom = 0;
      }
    } else {
      let maxValue = Number(getMaxValue());
      let minValue = Number(getMinValue());
      let valueFrom = Number(getValueFrom());
      let valueTo = Number(getValueTo());

      if (typeof isVertical !== 'boolean') this.settings.isVertical = TRSModel.defaults.isVertical;
      if (typeof isTwoHandles !== 'boolean') this.settings.isTwoHandles = TRSModel.defaults.isTwoHandles;
      if (typeof isTip !== 'boolean') this.settings.isTip = TRSModel.defaults.isTip;
      if (Number.isNaN(minValue)) setMinValue(TRSModel.defaults.minValue!);
      if (Number.isNaN(maxValue)) setMaxValue(TRSModel.defaults.maxValue!);
      if (Number.isNaN(valueFrom)) setValueFrom(TRSModel.defaults.valueFrom!);
      if (Number.isNaN(valueTo)) setValueTo(TRSModel.defaults.valueTo!);
      if (Number.isNaN(stepValue)) this.settings.stepValue = TRSModel.defaults.stepValue;
      if (typeof items !== 'object') this.settings.items = TRSModel.defaults.items!;

      if (minValue === maxValue) {
        setValueFrom(minValue);
        valueFrom = Number(getValueFrom());
        setMaxValue(minValue + 1);
        maxValue = Number(getMaxValue());
        setValueTo(maxValue);
        valueTo = Number(getValueTo());
      }

      if (maxValue < minValue) {
        setMinValue(maxValue);
        setMaxValue(minValue);
        minValue = Number(getMinValue());
        maxValue = Number(getMaxValue());
        if (valueFrom < minValue || valueFrom > maxValue) setValueFrom(getMinValue());
        if (valueTo < minValue || valueTo > maxValue) setValueTo(getMaxValue());
      }

      const size = maxValue - minValue;

      if (stepValue! < 1) this.settings.stepValue = 1;
      if (this.settings.stepValue! > size) this.settings.stepValue = size;

      if (isTwoHandles) {
        if (valueFrom > valueTo) {
          setValueFrom(valueTo);
          setValueTo(valueFrom);
          valueFrom = Number(getValueFrom());
          valueTo = Number(getValueTo());
        }
        if (valueTo < valueFrom) setValueTo(valueFrom);
        if (valueFrom < minValue) setValueFrom(minValue);
      } else if (valueTo < minValue) setValueTo(minValue);

      if (valueTo > maxValue) setValueTo(maxValue);
    }
  }
}

export default TRSModel;
