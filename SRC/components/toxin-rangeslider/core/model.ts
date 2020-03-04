export default class TRSModel {
    settings: RangeSliderOptions;
    static defaults: RangeSliderOptions = {
        isVertical: false,
        isTwoHandles: true,
        isTip: true,
        minValue: 0,
        maxValue: 1220,
        stepValue: 0,
        valueFrom: 0,
        valueTo: 610,
        //values: [],
        items: { indexFrom: 0, indexTo: 1, values: [] },
        //values: [20000, 40000, 80000, 16, 32, 64000, 12800],
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
        this.settings = $.extend({}, TRSModel.defaults, options);
    }
    validate() {}
}
