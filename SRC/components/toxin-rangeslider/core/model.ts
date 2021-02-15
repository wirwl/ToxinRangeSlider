/* eslint-disable */

import defaultRangeSliderState from './defaults';

/* eslint-disable no-console */
class TRSModel {
  private settings: RangeSliderOptions;

  static readonly defaults: RangeSliderOptions = $.extend(true, {}, defaultRangeSliderState);

  constructor(options?: RangeSliderOptions) {
    this.settings = $.extend(true, {}, TRSModel.defaults);
    $.extend(true, this.settings, options);
    this.validate();
  }

  updateHandleState({ isFromHandle, relValue }: HandleMovingResult): void {
    // const {
    //   valueFrom,
    //   valueTo,
    //   items: { indexFrom, indexTo, values },
    // } = this.settings;
    let index = -1;
    if (this.isUsingItems()) {
      for (let i = 0; i < this.settings.items.values.length; i += 1) {
        if (relValue.toString() === this.settings.items.values[i].toString()) {
          index = i;
          break;
        }
      }
    }
    if (isFromHandle) {
      if (this.isUsingItems()) {
        this.settings.items.indexFrom = index;
        this.settings.valueFrom = this.settings.items.values[index];
      } else this.settings.valueFrom = relValue;
    } else if (this.isUsingItems()) {
      this.settings.items.indexTo = index;
      this.settings.valueTo = this.settings.items.values[index];
    } else this.settings.valueTo = relValue;

    this.validate();
  }

  isUsingItems(): boolean {
    return this.settings.items.values.length > 1;
  }

  updateState(data = {}): void {
    $.extend(true, this.settings, data);
    this.validate();
  }

  getState(): RangeSliderOptions {
    return this.settings;
  }

  isStepValueDefined(): void {
    const { stepValue } = this.settings;

    const isHasStepValue = stepValue > 1;

    if (isHasStepValue) {
      const { valueFrom, valueTo, minValue, maxValue } = this.settings;
      const relLengthTotal = Number(maxValue) - Number(minValue);
      const stepCountTotal = Math.ceil(relLengthTotal / stepValue);
      const remainderValue = relLengthTotal % stepValue;
      const isHasRemainder = remainderValue > 0;

      const roundHandleValue = (value: number) => {
        const relLengthValue = Number(value) - Number(minValue);
        //Index started from 0
        const stepIndexValue = Math.trunc(relLengthValue / stepValue);
        const stepValueDynamic = isHasRemainder && stepIndexValue >= stepCountTotal - 1 ? remainderValue : stepValue;
        const halfStepValueDynamic = stepValueDynamic / 2;

        const prevRightValue = Number(minValue) + stepIndexValue * stepValue;
        const nextRightValue = prevRightValue + stepValueDynamic;
        const betweenPrevNextValue = prevRightValue + halfStepValueDynamic;

        if (value <= betweenPrevNextValue) return prevRightValue;
        return nextRightValue;
      };

      this.settings.valueFrom = roundHandleValue(Number(valueFrom));
      this.settings.valueTo = roundHandleValue(Number(valueTo));
    }
  }

  onHandlePositionChange(data: HandleMovingResult): void {
    const { isFromHandle } = data;
    const validatedRelValue = isFromHandle ? this.settings.valueFrom : this.settings.valueTo;
    this.settings.onHandlePositionChange?.call({ ...this.settings }, { isFromHandle, relValue: validatedRelValue });
  }

  private validate(): void {
    const { items, stepValue, isTwoHandles, isVertical, isTip } = this.settings;

    const indexFrom = items?.indexFrom;
    const indexTo = items?.indexTo;
    const values = items?.values;
    const isUsingItems = items && items.values.length > 1;

    this.isStepValueDefined();

    if (isUsingItems) {
      // eslint-disable-next-line prefer-destructuring
      this.settings.minValue = values[0];
      this.settings.maxValue = values[values.length - 1];
      this.settings.valueFrom = values[indexFrom];
      this.settings.valueTo = values[indexTo];

      if (typeof indexFrom === 'undefined') this.settings.items.indexFrom = 0;
      if (typeof indexTo === 'undefined') this.settings.items.indexTo = values.length - 1;

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
      let maxValue = Number(isUsingItems ? items.values[items.values?.length - 1] : this.settings.maxValue);
      let minValue = Number(isUsingItems ? items.values[0] : this.settings.minValue);
      let { valueFrom } = this.settings;
      let { valueTo } = this.settings;

      if (typeof isVertical !== 'boolean') this.settings.isVertical = TRSModel.defaults.isVertical;
      if (typeof isTwoHandles !== 'boolean') this.settings.isTwoHandles = TRSModel.defaults.isTwoHandles;
      if (typeof isTip !== 'boolean') this.settings.isTip = TRSModel.defaults.isTip;
      if (Number.isNaN(minValue)) this.settings.minValue = Number(TRSModel.defaults.minValue);
      if (Number.isNaN(maxValue)) this.settings.maxValue = Number(TRSModel.defaults.maxValue);
      if (Number.isNaN(valueFrom)) this.settings.valueFrom = Number(TRSModel.defaults.valueFrom);
      if (Number.isNaN(valueTo)) this.settings.valueTo = Number(TRSModel.defaults.valueTo);
      if (Number.isNaN(stepValue)) this.settings.stepValue = TRSModel.defaults.stepValue;
      if (typeof items !== 'object') this.settings.items = TRSModel.defaults.items;

      if (minValue === maxValue) {
        this.settings.valueFrom = minValue;
        valueFrom = this.settings.valueFrom;
        this.settings.maxValue = minValue + 1;
        maxValue = Number(isUsingItems ? items.values[items.values?.length - 1] : this.settings.maxValue);
        this.settings.valueTo = maxValue;
        valueTo = maxValue;
      }

      if (maxValue < minValue) {
        this.settings.minValue = maxValue;
        this.settings.maxValue = minValue;
        minValue = maxValue;
        maxValue = minValue;
        if (valueFrom < minValue || valueFrom > maxValue) this.settings.valueFrom = minValue;

        if (valueTo < minValue || valueTo > maxValue) this.settings.valueTo = maxValue;
      }

      const size = maxValue - minValue;
      if (stepValue < 1) this.settings.stepValue = 1;
      if (this.settings.stepValue > size) this.settings.stepValue = size;

      if (isTwoHandles) {
        if (valueFrom > valueTo) {
          this.settings.valueFrom = valueTo;
          this.settings.valueTo = valueFrom;
          valueFrom = this.settings.valueFrom;
          valueTo = this.settings.valueTo;
        }
        if (valueTo < valueFrom) this.settings.valueTo = valueFrom;

        if (valueFrom < minValue) this.settings.valueFrom = minValue;
      } else if (valueTo < minValue) this.settings.valueTo = minValue;

      if (valueTo > maxValue) this.settings.valueTo = maxValue;
    }
  }
}

export default TRSModel;
