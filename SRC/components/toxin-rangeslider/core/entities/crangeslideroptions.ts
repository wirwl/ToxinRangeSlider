/* eslint-disable @typescript-eslint/no-empty-function */
class CRangeSliderOptions implements RangeSliderOptions {
  static emptySettings = new CRangeSliderOptions({ items: {} });

  isVertical?: boolean;

  isTwoHandles?: boolean;

  isTip?: boolean;

  minValue?: number;

  getMinValue = (): number | string => {
    return this.getIsHaveItems() ? this.items.values[0] : this.minValue;
  };

  setMinValue = (value: number | string): void => {
    if (!this.getIsHaveItems()) this.minValue = parseFloat(value.toString());
  };

  maxValue?: number;

  getMaxValue = (): number | string => {
    return this.getIsHaveItems() ? this.items.values[this.items.values.length - 1] : this.maxValue;
  };

  setMaxValue = (value: number | string): void => {
    if (!this.getIsHaveItems()) this.maxValue = parseFloat(value.toString());
  }

  stepValue?: number;

  getIsHaveItems = (): boolean => {
    return this.items?.values?.length > 1;
  };

  valueFrom?: number;

  getValueFrom = (): number | string => {
    if (this.getIsHaveItems()) return this.items.values[this.items.indexFrom];
    return this.valueFrom;
  };

  setValueFrom = (value: number | string): void => {
    if (this.getIsHaveItems()) {
      const newIndex = this.findIndexByItem(value);
      if (newIndex > -1) this.items.indexFrom = newIndex;
    } else this.valueFrom = parseFloat(value.toString());
  };

  valueTo?: number;

  getValueTo = (): number | string => {
    if (this.getIsHaveItems()) return this.items.values[this.items.indexTo];
    return this.valueTo;
  };

  setValueTo = (value: number | string): void => {
    if (this.getIsHaveItems()) {
      const newIndex = this.findIndexByItem(value);
      if (newIndex > -1) this.items.indexTo = newIndex;
    } else this.valueTo = parseFloat(value.toString());
  };

  items: RangeSliderItems;

  onHandlePositionChange?(this: HandleMovingResult): void;

  constructor(anotherOptions: CRangeSliderOptions | RangeSliderOptions = null) {
    this.items = {};
    this.onHandlePositionChange = function() {};
    if (anotherOptions) this.extend(anotherOptions);
  }

  findIndexByItem(item: number | string): number {
    return this.items.values.findIndex(value => value.toString() === item);
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

    if (typeof isVertical !== 'undefined') this.isVertical = isVertical;
    if (typeof isTwoHandles !== 'undefined') this.isTwoHandles = isTwoHandles;
    if (typeof isTip !== 'undefined') this.isTip = isTip;
    if (typeof minValue !== 'undefined') if (!isUsingItemsValues) this.minValue = parseFloat(minValue.toString());
    if (typeof maxValue !== 'undefined') if (!isUsingItemsValues) this.maxValue = parseFloat(maxValue.toString());
    if (typeof stepValue !== 'undefined') this.stepValue = stepValue;
    if (typeof valueFrom !== 'undefined')
      if (!isUsingItemsValues) this.valueFrom = parseFloat(valueFrom.toString());
      else this.setValueFrom(valueFrom);
    if (typeof valueTo !== 'undefined')
      if (!isUsingItemsValues) this.valueTo = parseFloat(valueTo.toString());
      else this.setValueTo(valueTo);
    if (typeof o.onHandlePositionChange !== 'undefined') this.onHandlePositionChange = o.onHandlePositionChange;
  }
}

export default CRangeSliderOptions;
