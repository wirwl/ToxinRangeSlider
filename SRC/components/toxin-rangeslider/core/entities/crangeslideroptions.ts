/* eslint-disable @typescript-eslint/no-empty-function */
class CRangeSliderOptions implements RangeSliderOptions {
  static emptySettings = new CRangeSliderOptions({ items: {} });

  isVertical?: boolean;

  isTwoHandles?: boolean;

  isTip?: boolean;

  minValue?: number;

  getMinValue = (): number | string => {
    return this.IsHaveItems()! ? this.items.values![0]! : this.minValue!;
  };

  setMinValue = (value: number | string): void => {
    if (!this.IsHaveItems()) this.minValue = parseFloat(value.toString());
  };

  maxValue?: number;

  getMaxValue = (): number | string => {
    return this.IsHaveItems()! ? this.items.values![this.items.values!.length - 1] : this.maxValue!;
  };

  setMaxValue = (value: number | string): void => {
    if (!this.IsHaveItems()) this.maxValue = parseFloat(value.toString());
  };

  stepValue?: number;

  IsHaveItems = (): boolean => {
    return this.items!?.values!?.length > 1;
  };

  valueFrom?: number;

  getValueFrom = (): number | string => {
    if (this.IsHaveItems()) return this.items.values![this.items.indexFrom!];
    return this.valueFrom!;
  };

  setValueFrom = (value: number | string): void => {
    if (this.IsHaveItems()) {
      const newIndex = this.findIndexByItem(value);
      if (newIndex > -1) this.items.indexFrom = newIndex;
    } else this.valueFrom = parseFloat(value.toString());
  };

  valueTo?: number;

  getValueTo = (): number | string => {
    if (this.IsHaveItems()) return this.items.values![this.items.indexTo!];
    return this.valueTo!;
  };

  setValueTo = (value: number | string): void => {
    if (this.IsHaveItems()) {
      const newIndex = this.findIndexByItem(value);
      if (newIndex > -1) this.items.indexTo = newIndex;
    } else this.valueTo = parseFloat(value.toString());
  };

  items: RangeSliderItems;

  onHandlePositionChange?(this: HandleMovingResult): void;

  constructor(anotherOptions?: CRangeSliderOptions | RangeSliderOptions) {
    this.items = {};
    this.onHandlePositionChange = function() {};
    if (anotherOptions) this.extend(anotherOptions);
  }

  findIndexByItem(item: number | string): number {
    return this.items.values!.findIndex(value => value.toString() === item.toString());
  }

  extend(o: RangeSliderOptions | CRangeSliderOptions) {
    if (!o) return;
    const { items, isVertical, isTwoHandles, isTip, minValue, maxValue, valueFrom, valueTo, stepValue } = o;
    const { indexFrom, indexTo, values } = items || { undefined };

    if (typeof items !== 'undefined') {
      if (typeof indexFrom !== 'undefined') this.items.indexFrom = indexFrom;
      if (typeof indexTo !== 'undefined') this.items.indexTo = indexTo;
      if (typeof values !== 'undefined') this.items.values = [...values];
    }

    const isUsingItemsValues = this.items && this.items.values && this.items.values.length > 1;

    if (isVertical !== null && typeof isVertical !== 'undefined') this.isVertical = isVertical;
    if (isTwoHandles !== null && typeof isTwoHandles !== 'undefined') this.isTwoHandles = isTwoHandles;
    if (isTip !== null && typeof isTip !== 'undefined') this.isTip = isTip;
    if (minValue !== null && typeof minValue !== 'undefined')
      if (!isUsingItemsValues) this.minValue = parseFloat(minValue.toString());
    if (maxValue !== null && typeof maxValue !== 'undefined')
      if (!isUsingItemsValues) this.maxValue = parseFloat(maxValue.toString());
    if (stepValue !== null && typeof stepValue !== 'undefined') this.stepValue = stepValue;
    if (valueFrom !== null && typeof valueFrom !== 'undefined')
      if (!isUsingItemsValues) this.valueFrom = parseFloat(valueFrom.toString());
      else this.setValueFrom(valueFrom);
    if (valueTo !== null && typeof valueTo !== 'undefined')
      if (!isUsingItemsValues) this.valueTo = parseFloat(valueTo.toString());
      else this.setValueTo(valueTo);
    if (o.onHandlePositionChange !== null && typeof o.onHandlePositionChange !== 'undefined')
      this.onHandlePositionChange = o.onHandlePositionChange;
  }
}

export default CRangeSliderOptions;
