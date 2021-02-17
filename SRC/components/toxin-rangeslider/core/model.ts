import defaultRangeSliderState from './defaults';
import { mergeSliderOptions } from './utils';

class TRSModel {
  private settings: RangeSliderOptions;

  static readonly defaults: RangeSliderOptions = $.extend(true, {}, defaultRangeSliderState);

  constructor(options?: AnyObject) {
    this.settings = $.extend(true, {}, TRSModel.defaults);
    mergeSliderOptions(this.settings, options || {});
    this.validate();
  }

  updateState(data: AnyObject): void {
    mergeSliderOptions(this.settings, data);
    this.validate();
  }

  updateHandleState({ isFromHandle, relValue }: HandleMovingResult): void {
    const {
      items: { values },
    } = this.settings;

    let index = -1;
    if (this.isUsingItems()) {
      for (let i = 0; i < values.length; i += 1) {
        if (relValue.toString() === values[i].toString()) {
          index = i;
          break;
        }
      }
    }
    if (isFromHandle) {
      if (this.isUsingItems()) {
        this.settings.items.indexFrom = index;
        this.settings.valueFrom = values[index];
      } else this.settings.valueFrom = relValue;
    } else if (this.isUsingItems()) {
      this.settings.items.indexTo = index;
      this.settings.valueTo = values[index];
    } else this.settings.valueTo = relValue;

    this.validate();
  }

  getState(): RangeSliderOptions {
    return this.settings;
  }

  onHandlePositionChange(data: HandleMovingResult): void {
    const { isFromHandle } = data;
    const validatedRelValue = isFromHandle ? this.settings.valueFrom : this.settings.valueTo;
    this.settings.onHandlePositionChange?.call({ ...this.settings }, { isFromHandle, relValue: validatedRelValue });
  }

  private isUsingItems(): boolean {
    return this.settings.items?.values?.length > 1;
  }

  private validateIsStepValueDefined(): void {
    const { stepValue } = this.settings;

    const isHasStepValue = stepValue > 1;

    if (isHasStepValue) {
      const { valueFrom, valueTo, minValue, maxValue } = this.settings;
      const relLengthTotal = Number(maxValue) - Number(minValue);
      const stepCountTotal = Math.ceil(relLengthTotal / stepValue);
      const remainderValue = relLengthTotal % stepValue;
      const isHasRemainder = remainderValue > 0;

      const roundHandleValue = (value: number): number => {
        const relLengthValue = Number(value) - Number(minValue);
        // Index started from 0
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

  private validateItemsValues(): void {
    const { items, isTwoHandles } = this.settings;
    const indexFrom = items?.indexFrom;
    const indexTo = items?.indexTo;
    const values = items?.values;

    [this.settings.minValue] = values;
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
  }

  private applyDefaultValuesForUndefinedValues(): void {
    const { items, stepValue, isTwoHandles, isVertical, isTip, minValue, maxValue, valueFrom, valueTo } = this.settings;

    if (typeof isVertical !== 'boolean') this.settings.isVertical = TRSModel.defaults.isVertical;
    if (typeof isTwoHandles !== 'boolean') this.settings.isTwoHandles = TRSModel.defaults.isTwoHandles;
    if (typeof isTip !== 'boolean') this.settings.isTip = TRSModel.defaults.isTip;
    if (Number.isNaN(minValue)) this.settings.minValue = Number(TRSModel.defaults.minValue);
    if (Number.isNaN(maxValue)) this.settings.maxValue = Number(TRSModel.defaults.maxValue);
    if (Number.isNaN(valueFrom)) this.settings.valueFrom = Number(TRSModel.defaults.valueFrom);
    if (Number.isNaN(valueTo)) this.settings.valueTo = Number(TRSModel.defaults.valueTo);
    if (Number.isNaN(stepValue)) this.settings.stepValue = TRSModel.defaults.stepValue;
    if (typeof items !== 'object') this.settings.items = TRSModel.defaults.items;
  }

  private validateMinAndMaxValues(): void {
    const { items } = this.settings;
    let { valueFrom, valueTo } = this.settings;

    const isUsingItems = items && items.values.length > 1;

    let maxValue = Number(isUsingItems ? items.values[items.values?.length - 1] : this.settings.maxValue);
    let minValue = Number(isUsingItems ? items.values[0] : this.settings.minValue);

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
  }

  private validateStepValue(): void {
    const { maxValue, minValue, stepValue } = this.settings;

    const size = Number(maxValue) - Number(minValue);
    if (stepValue < 1) this.settings.stepValue = 1;
    if (this.settings.stepValue > size) this.settings.stepValue = size;
  }

  private validateHandlesValue(): void {
    const { isTwoHandles, minValue, maxValue } = this.settings;
    let { valueFrom, valueTo } = this.settings;

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

  private validate(): void {
    this.applyDefaultValuesForUndefinedValues();

    this.validateIsStepValueDefined();

    if (this.isUsingItems()) {
      this.validateItemsValues();
    } else {
      this.validateMinAndMaxValues();

      this.validateStepValue();

      this.validateHandlesValue();
    }
  }
}

export default TRSModel;
