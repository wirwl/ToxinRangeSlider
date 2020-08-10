/* eslint-disable @typescript-eslint/no-empty-function */
class CRangeSliderOptions implements RangeSliderOptions {
    isVertical?: boolean;
    isTwoHandles?: boolean;
    isTip?: boolean;

    private _minValue?: number;
    public getMinValue(): number | string {
        return this.getIsHaveItems() ? this.items.values[0] : this._minValue;
    }

    public setMinValue(value: number | string) {
        if (!this.getIsHaveItems()) this._minValue = parseFloat(value.toString());
    }

    private _maxValue?: number;
    getMaxValue(): number | string {
        return this.getIsHaveItems() ? this.items.values[this.items.values.length - 1] : this._maxValue;
    }
    setMaxValue(value: number | string) {
        if (!this.getIsHaveItems()) this._maxValue = parseFloat(value.toString());
    }

    stepValue?: number;
    getIsHaveItems(): boolean {
        return this.items?.values?.length > 1;
    }
    setIsHaveItems(value: boolean) { }

    private _valueFrom?: number;
    getValueFrom(): number | string {
        if (this.items?.values?.length > 1) {
            return this.items.values[this.items.indexFrom];
        } else return this._valueFrom;
    }
    setValueFrom(value: number | string) {
        if (this.items?.values?.length > 1) {
            const newIndex = this.findIndexByItem(value);
            if (newIndex > -1) this.items.indexFrom = newIndex;
        } else this._valueFrom = parseFloat(value.toString());
    }

    private _valueTo?: number;
    getValueTo(): number | string {
        if (this.items?.values?.length > 1) {
            return this.items.values[this.items.indexTo];
        } else return this._valueTo;
    }
    setValueTo(value: number | string) {
        if (this.getIsHaveItems()) {
            const newIndex = this.findIndexByItem(value);
            if (newIndex > -1) this.items.indexTo = newIndex;
        } else this._valueTo = parseFloat(value.toString());
    }

    items: RangeSliderItems;
    onHandlePositionChange?(this: HandleMovingResult): void;

    constructor(anotherOptions: CRangeSliderOptions | RangeSliderOptions = null) {
        this.items = {};
        this.onHandlePositionChange = function () { };
        if (anotherOptions) this.extend(anotherOptions);
    }

    findIndexByItem(item: number | string): number {
        return this.items.values.findIndex(value => value == item);
    }

    extend(o: RangeSliderOptions | CRangeSliderOptions) {
        if (!o) return;

        const minValue = ((o as CRangeSliderOptions).getMinValue) ? (o as CRangeSliderOptions).getMinValue() : (o as RangeSliderOptions).minValue;
        const maxValue = ((o as CRangeSliderOptions).getMaxValue) ? (o as CRangeSliderOptions).getMaxValue() : (o as RangeSliderOptions).maxValue;
        const valueFrom = ((o as CRangeSliderOptions).getValueFrom) ? (o as CRangeSliderOptions).getValueFrom() : (o as RangeSliderOptions).valueFrom;
        const valueTo = ((o as CRangeSliderOptions).getValueTo) ? (o as CRangeSliderOptions).getValueTo() : (o as RangeSliderOptions).valueTo;
        

        if (typeof o.items !== 'undefined') {
            if (typeof o.items?.indexFrom !== 'undefined') this.items.indexFrom = o.items.indexFrom;
            if (typeof o.items?.indexTo !== 'undefined') this.items.indexTo = o.items.indexTo;
            if (typeof o.items?.values !== 'undefined') this.items.values = [...o.items.values];
        }

        const isUsingItemsValues = this.items && this.items.values && this.items.values.length > 1;

        if (typeof o.isVertical !== 'undefined') this.isVertical = o.isVertical;
        if (typeof o.isTwoHandles !== 'undefined') this.isTwoHandles = o.isTwoHandles;
        if (typeof o.isTip !== 'undefined') this.isTip = o.isTip;
        if (typeof minValue !== 'undefined')
            if (!isUsingItemsValues) this._minValue = parseFloat(minValue.toString());
        if (typeof maxValue !== 'undefined')
            if (!isUsingItemsValues) this._maxValue = parseFloat(maxValue.toString());
        if (typeof o.stepValue !== 'undefined') this.stepValue = o.stepValue;
        if (typeof valueFrom !== 'undefined')
            if (!isUsingItemsValues) this._valueFrom = parseFloat(valueFrom.toString());
            else this.setValueFrom(valueFrom);
        if (typeof valueTo !== 'undefined')
            if (!isUsingItemsValues) this._valueTo = parseFloat(valueTo.toString());
            else this.setValueTo(valueTo);
        if (typeof o.onHandlePositionChange !== 'undefined') this.onHandlePositionChange = o.onHandlePositionChange;
    }
}

export default CRangeSliderOptions;
