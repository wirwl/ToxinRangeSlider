export default class CRangeSliderOptions implements RangeSliderOptions {
    isVertical?: boolean;
    isTwoHandles?: boolean;
    isTip?: boolean;

    private _minValue?: number;
    get minValue(): number | string {
        return this.isHaveItems ? this.items.values[0] : this._minValue;
    }
    set minValue(value: number | string) {
        if (!this.isHaveItems) this._minValue = parseFloat(value.toString());
    }

    private _maxValue?: number;
    get maxValue(): number | string {
        return this.isHaveItems ? this.items.values[this.items.values.length - 1] : this._maxValue;
    }
    set maxValue(value: number | string) {
        if (!this.isHaveItems) this._maxValue = parseFloat(value.toString());
    }

    stepValue?: number;
    get isHaveItems(): boolean {
        return this.items?.values?.length > 1;
    }
    set isHaveItems(value: boolean) {}

    private _valueFrom?: number;
    get valueFrom(): number | string {
        if (this.items?.values?.length > 1) {
            return this.items.values[this.items.indexFrom];
        } else return this._valueFrom;
    }
    set valueFrom(value: number | string) {
        if (this.items?.values?.length > 1) {
            const newIndex = this.findIndexByItem(value);
            if (newIndex > -1) this.items.indexFrom = newIndex;
        } else this._valueFrom = parseFloat(value.toString());
    }

    private _valueTo?: number;
    get valueTo(): number | string {
        if (this.items?.values?.length > 1) {
            return this.items.values[this.items.indexTo];
        } else return this._valueTo;
    }
    set valueTo(value: number | string) {
        if (this.isHaveItems) {
            const newIndex = this.findIndexByItem(value);
            if (newIndex > -1) this.items.indexTo = newIndex;
        } else this._valueTo = parseFloat(value.toString());
    }

    items: RangeSliderItems; // = { indexFrom: 0, indexTo: 2, values: [2, 4, 8, 16] };
    //{ indexFrom: 0; indexTo: 1; values: [20000, 40000, 80000, 16, 32, 64000, 12800] };

    onHandlePositionChange: Function;
    constructor(anotherObject: CRangeSliderOptions = null) {
        this.items = {};
        this.onHandlePositionChange = function() {};
        if (anotherObject) this.extend(anotherObject);
    }
    findIndexByItem(item: number | string): number {
        let result = -1;
        for (let i = 0; i < this.items.values.length; i++) {
            if (this.items.values[i] == item) {
                result = i;
                break;
            }
        }
        return result;
    }
    extend(o: RangeSliderOptions | CRangeSliderOptions) {
        const isUsingItemsValuesThis = this.items && this.items.values && this.items.values.length > 1;
        const isUsingItemsValuesO = o.items && o.items.values && o.items.values.length > 1;
        const isUsingItemsValues = isUsingItemsValuesThis || isUsingItemsValuesO;

        if (typeof o.isVertical !== 'undefined') this.isVertical = o.isVertical;
        if (typeof o.isTwoHandles !== 'undefined') this.isTwoHandles = o.isTwoHandles;
        if (typeof o.isTip !== 'undefined') this.isTip = o.isTip;
        if (typeof o.minValue !== 'undefined')
            if (!isUsingItemsValues) this._minValue = parseFloat(o.minValue.toString());
        if (typeof o.maxValue !== 'undefined')
            if (!isUsingItemsValues) this._maxValue = parseFloat(o.maxValue.toString());
        if (typeof o.stepValue !== 'undefined') this.stepValue = o.stepValue;
        if (typeof o.valueFrom !== 'undefined')
            if (!isUsingItemsValues) this._valueFrom = parseFloat(o.valueFrom.toString());
            else this.valueFrom = o.valueFrom;
        if (typeof o.valueTo !== 'undefined')
            if (!isUsingItemsValues) this._valueTo = parseFloat(o.valueTo.toString());
            else this.valueTo = o.valueTo;
        if (typeof o.items !== 'undefined') {
            if (typeof o.items.indexFrom !== 'undefined') this.items.indexFrom = o.items.indexFrom;
            if (typeof o.items.indexTo !== 'undefined') this.items.indexTo = o.items.indexTo;
            if (typeof o.items.values !== 'undefined') this.items.values = [...o.items.values];
        }
        if (typeof o.onHandlePositionChange !== 'undefined') this.onHandlePositionChange = o.onHandlePositionChange;
    }
}