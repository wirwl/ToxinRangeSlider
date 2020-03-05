import CRangeSliderOptions from './entities/rangeslideroptions';

export default class TRSModel {
    stt: CRangeSliderOptions;
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
        this.settings = $.extend(this.settings, TRSModel.defaults);
        this.settings = $.extend(this.settings, options);
    }
    validate() {}
}
