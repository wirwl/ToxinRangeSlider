export default class CRangeSliderOptions implements RangeSliderOptions {
    isVertical?: boolean; // = false;
    isTwoHandles?: boolean; // = true;
    isTip?: boolean; // = true;

    //minValue?: number;
    private _minValue: number | string;
    get minValue(): number | string {
        return this.isHaveItems ? this.items.values[0] : this._minValue;
    }
    set minValue(value: number | string) {
        if (!this.isHaveItems) this._minValue = value;
    }

    //maxValue?: number;
    private _maxValue: number | string;
    get maxValue(): number | string {
        return this.isHaveItems ? this.items.values[this.items.values.length - 1] : this._maxValue;
    }
    set maxValue(value: number | string) {
        if (!this.isHaveItems) this._maxValue = value;
    }

    stepValue?: number;
    get isHaveItems(): boolean {
        return this.items?.values?.length > 1;
    }
    set isHaveItems(value: boolean) {}

    private _valueFrom?: number | string;
    get valueFrom(): number | string {
        if (this.items?.values?.length > 1) {
            return this.items.values[this.items.indexFrom];
        } else return this._valueFrom;
    }
    set valueFrom(value: number | string) {
        if (this.items?.values?.length > 1) {
            const newIndex = this.findIndexByItem(value);
            if (newIndex > -1) this.items.indexFrom = newIndex;
        } else this._valueFrom = value;
    }

    private _valueTo?: number | string;
    get valueTo(): number | string {
        if (this.items?.values?.length > 1) {
            return this.items.values[this.items.indexTo];
        } else return this._valueTo;
    }
    set valueTo(value: number | string) {
        if (this.isHaveItems) {
            const newIndex = this.findIndexByItem(value);
            if (newIndex > -1) this.items.indexTo = newIndex;
        } else this._valueTo = value;
    }

    items: RangeSliderItems; // = { indexFrom: 0, indexTo: 2, values: [2, 4, 8, 16] };
    //{ indexFrom: 0; indexTo: 1; values: [20000, 40000, 80000, 16, 32, 64000, 12800] };

    onHandlePositionChange: Function;
    constructor() {
        this.onHandlePositionChange = function() {};
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
}
