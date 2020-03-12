import CRangeSliderOptions from './entities/rangeslideroptions';

export default class TRSModel {
    settings: CRangeSliderOptions;
    static defaults: RangeSliderOptions = {
        isVertical: false,
        isTwoHandles: true,
        isTip: true,
        minValue: 0,
        maxValue: 122,
        stepValue: 0,
        valueFrom: 0,
        valueTo: 122,
        //values: [],
        items: { indexFrom: 0, indexTo: 2, values: [] },
        //items: { indexFrom: 0, indexTo: 2, values: [2, 4, 8, 16, 32, 64, 128] },
        // items: {
        //     indexFrom: 0,
        //     indexTo: 7,
        //     values: [
        //         'январь',
        //         'февраль',
        //         'март',
        //         'апрель',
        //         'май',
        //         'июнь',
        //         'июль',
        //         'август',
        //         'сентябрь',
        //         'октябрь',
        //         'ноябрь',
        //         'декабрь',
        //     ],
        //},
        //values: [2, 4, 8, 16, 32, 64, 128],
        // values: [
        //     'январь',
        //     'февраль',
        //     'март',
        //     'апрель',
        //     'май',
        //     'июнь',
        //     'июль',
        //     'август',
        //     'сентябрь',
        //     'октябрь',
        //     'ноябрь',
        //     'декабрь',
        // ],
        onHandlePositionChange: function() {},
    };
    constructor(options: RangeSliderOptions) {
        //this.settings = $.extend({}, TRSModel.defaults, options);
        this.settings = new CRangeSliderOptions();
        this.settings = $.extend(true, this.settings, TRSModel.defaults);
        this.settings = $.extend(true, this.settings, options);
    }
    validate() {
        if (this.settings.isHaveItems) {
            if (this.settings.items.indexFrom > this.settings.items.indexTo)
                this.settings.items.indexFrom = this.settings.items.indexTo;
            if (this.settings.items.indexFrom < 0) this.settings.items.indexFrom = 0;
            if (this.settings.items.indexTo < this.settings.items.indexFrom)
                this.settings.items.indexTo = this.settings.items.indexFrom;
            if (this.settings.items.indexTo > this.settings.items.values.length - 1)
                this.settings.items.indexTo = this.settings.items.values.length - 1;
        } else {
            const size = (this.settings.maxValue as number) - (this.settings.minValue as number);
            if (this.settings.stepValue < 0) this.settings.stepValue = 0;
            if (this.settings.stepValue > size) this.settings.stepValue = size;
            if (this.settings.valueTo > this.settings.maxValue) this.settings.valueTo = this.settings.maxValue;
            if (this.settings.valueTo < this.settings.valueFrom) this.settings.valueTo = this.settings.valueFrom;
            if (this.settings.valueFrom < this.settings.minValue) this.settings.valueFrom = this.settings.minValue;
            if (this.settings.valueFrom > this.settings.valueTo) this.settings.valueFrom = this.settings.valueTo;
        }
    }
}
