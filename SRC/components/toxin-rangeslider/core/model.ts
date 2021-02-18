import defaultRangeSliderState from './defaults';
import { mergeSliderOptions } from './utils';

class TRSModel {
  private state: RangeSliderOptions;

  static readonly defaults: RangeSliderOptions = $.extend(true, {}, defaultRangeSliderState);

  constructor(options?: AnyObject) {
    this.state = $.extend(true, {}, TRSModel.defaults);
    mergeSliderOptions(this.state, options || {});
    this.validate();
  }

  private validateIsStepValueDefined(): void {
    const { stepValue } = this.state;

    const isHasStepValue = stepValue > 1;

    if (isHasStepValue) {
      const { valueFrom, valueTo, minValue, maxValue } = this.state;
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

      this.state.valueFrom = roundHandleValue(Number(valueFrom));
      this.state.valueTo = roundHandleValue(Number(valueTo));
    }
  }

  private validateItemsValues(): void {
    const { items, isTwoHandles } = this.state;
    const indexFrom = items?.indexFrom;
    const indexTo = items?.indexTo;
    const values = items?.values;

    [this.state.minValue] = values;
    this.state.maxValue = values[values.length - 1];
    this.state.valueFrom = values[indexFrom];
    this.state.valueTo = values[indexTo];

    if (typeof indexFrom === 'undefined') this.state.items.indexFrom = 0;
    if (typeof indexTo === 'undefined') this.state.items.indexTo = values.length - 1;

    if (indexTo > values.length - 1) {
      this.state.items.indexTo = values.length - 1;
    }

    if (isTwoHandles) {
      if (indexFrom > indexTo) {
        this.state.valueFrom = this.state.valueTo;
        this.state.items.indexFrom = indexTo;
      }
      if (indexFrom < 0) this.state.items.indexFrom = 0;
    }
  }

  private applyDefaultValuesForUndefinedValues(): void {
    const { items, stepValue, isTwoHandles, isVertical, isTip, minValue, maxValue, valueFrom, valueTo } = this.state;

    if (typeof isVertical !== 'boolean') this.state.isVertical = TRSModel.defaults.isVertical;
    if (typeof isTwoHandles !== 'boolean') this.state.isTwoHandles = TRSModel.defaults.isTwoHandles;
    if (typeof isTip !== 'boolean') this.state.isTip = TRSModel.defaults.isTip;
    if (Number.isNaN(minValue)) this.state.minValue = Number(TRSModel.defaults.minValue);
    if (Number.isNaN(maxValue)) this.state.maxValue = Number(TRSModel.defaults.maxValue);
    if (Number.isNaN(valueFrom)) this.state.valueFrom = Number(TRSModel.defaults.valueFrom);
    if (Number.isNaN(valueTo)) this.state.valueTo = Number(TRSModel.defaults.valueTo);
    if (Number.isNaN(stepValue)) this.state.stepValue = TRSModel.defaults.stepValue;
    if (typeof items !== 'object') this.state.items = TRSModel.defaults.items;
  }

  private validateMinAndMaxValues(): void {
    const { items } = this.state;
    let { valueFrom, valueTo } = this.state;

    const isUsingItems = items && items.values.length > 1;

    let maxValue = Number(isUsingItems ? items.values[items.values?.length - 1] : this.state.maxValue);
    let minValue = Number(isUsingItems ? items.values[0] : this.state.minValue);

    if (minValue === maxValue) {
      this.state.valueFrom = minValue;
      valueFrom = this.state.valueFrom;
      this.state.maxValue = minValue + 1;
      maxValue = Number(isUsingItems ? items.values[items.values?.length - 1] : this.state.maxValue);
      this.state.valueTo = maxValue;
      valueTo = maxValue;
    }

    if (maxValue < minValue) {
      this.state.minValue = maxValue;
      this.state.maxValue = minValue;
      minValue = maxValue;
      maxValue = minValue;
      if (valueFrom < minValue || valueFrom > maxValue) this.state.valueFrom = minValue;

      if (valueTo < minValue || valueTo > maxValue) this.state.valueTo = maxValue;
    }
  }

  private validateStepValue(): void {
    const { maxValue, minValue, stepValue } = this.state;

    const size = Number(maxValue) - Number(minValue);
    if (stepValue < 1) this.state.stepValue = 1;
    if (this.state.stepValue > size) this.state.stepValue = size;
  }

  private validateHandlesValue(): void {
    const { isTwoHandles, minValue, maxValue } = this.state;
    let { valueFrom, valueTo } = this.state;

    if (isTwoHandles) {
      if (valueFrom > valueTo) {
        this.state.valueFrom = valueTo;
        this.state.valueTo = valueFrom;
        valueFrom = this.state.valueFrom;
        valueTo = this.state.valueTo;
      }
      if (valueTo < valueFrom) this.state.valueTo = valueFrom;

      if (valueFrom < minValue) this.state.valueFrom = minValue;
    } else if (valueTo < minValue) this.state.valueTo = minValue;

    if (valueTo > maxValue) this.state.valueTo = maxValue;
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

  private getIndex(relValue: number | string): number {
    const {
      items: { values },
    } = this.state;
    let index = -1;
    if (this.isUsingItems()) {
      for (let i = 0; i < values.length; i += 1) {
        if (relValue.toString() === values[i].toString()) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  updateState(data: AnyObject): void {
    mergeSliderOptions(this.state, data);
    this.validate();
  }

  getState(): RangeSliderOptions {
    return this.state;
  }

  onHandlePositionChange(data: HandleMovingResult): void {
    const { isFromHandle, relValue } = data;

    if (isFromHandle) this.setValueFrom(relValue);
    else this.setValueTo(relValue);

    const validatedRelValue = isFromHandle ? this.getValueFrom() : this.getValueTo();
    this.state.onHandlePositionChange?.call({ ...this.state }, { isFromHandle, relValue: validatedRelValue });
  }

  getIsVertical(): boolean {
    return this.state.isVertical;
  }

  setIsVertical(isVertical: boolean): void {
    this.state.isVertical = isVertical;
  }

  getIsTwoHandles(): boolean {
    return this.state.isTwoHandles;
  }

  setIsTwoHandles(isTwoHandles: boolean): void {
    this.state.isTwoHandles = isTwoHandles;
  }

  getIsTip(): boolean {
    return this.state.isTip;
  }

  setIsTip(isTip: boolean): void {
    this.state.isTip = isTip;
  }

  getMinValue(): number | string {
    return this.state.minValue;
  }

  setMinValue(newMinValue: number | string): void {
    const newValueIndex = this.getIndex(newMinValue);
    if (newValueIndex !== -1) this.state.minValue = this.state.items.values[newValueIndex];
    this.validate();
  }

  getMaxValue(): number | string {
    return this.state.maxValue;
  }

  setMaxValue(newMaxValue: number | string): void {
    const newValueIndex = this.getIndex(newMaxValue);
    if (newValueIndex !== -1) {
      this.state.maxValue = this.state.items.values[newValueIndex];
      this.validate();
    }
  }

  getStepValue(): number {
    return this.state.stepValue;
  }

  setStepValue(newStepValue: number): void {
    this.state.stepValue = newStepValue;
    this.validate();
  }

  getValueFrom(): number | string {
    return this.state.valueFrom;
  }

  setValueFrom(newValueFrom: number | string): void {
    if (this.isUsingItems()) {
      const newValueIndex = this.getIndex(newValueFrom);
      if (newValueIndex !== -1) {
        this.state.valueFrom = this.state.items.values[newValueIndex];
        this.state.items.indexFrom = newValueIndex;
      }
    } else this.state.valueFrom = newValueFrom;
    this.validate();
  }

  getValueTo(): number | string {
    return this.state.valueTo;
  }

  setValueTo(newValueTo: number | string): void {
    if (this.isUsingItems()) {
      const newValueIndex = this.getIndex(newValueTo);
      if (newValueIndex !== -1) {
        this.state.valueTo = this.state.items.values[newValueIndex];
        this.state.items.indexTo = newValueIndex;
      }
    } else this.state.valueTo = newValueTo;
    this.validate();
  }

  getItems(): RangeSliderItems {
    return this.state.items;
  }

  setItems(newItems: RangeSliderItems): void {
    this.state.items = { ...newItems };
    this.validate();
  }

  getItemsValues(): (number | string)[] {
    return this.state.items?.values;
  }

  setItemsValues(values: (number | string)[]): void {
    this.state.items.values = values;
    this.validate();
  }

  getIndexFrom(): number {
    return this.state.items?.indexFrom;
  }

  setIndexFrom(index: number): void {
    if (this.state.items) {
      this.state.items.indexFrom = index;
      if (this.isUsingItems()) this.state.valueFrom = this.state.items.values[index];
      this.validate();
    }
  }

  getIndexTo(): number {
    return this.state.items?.indexTo;
  }

  setIndexTo(index: number): void {
    if (this.state.items) {
      this.state.items.indexTo = index;
      if (this.isUsingItems()) this.state.valueTo = this.state.items.values[index];
      this.validate();
    }
  }

  isUsingItems(): boolean {
    return this.state.items?.values?.length > 1;
  }
}

export default TRSModel;
