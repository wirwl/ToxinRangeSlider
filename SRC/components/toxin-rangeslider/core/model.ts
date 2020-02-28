//const $ = require('../../../jquery/dist/jquery');
export default class TRSModel {
    settings: RangeSliderOptions;
    static defaults: RangeSliderOptions = {
        isVertical: false,
        isInterval: true,
        isTip: true,
        minValue: 0,
        maxValue: 1220,
        stepValue: 0,
        valueFrom: 0,
        valueTo: 610,
        values: [],
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
    calcLastStepValue(): number {
        const length = this.settings.maxValue - this.settings.minValue;
        const stepCount = Math.trunc(length / this.settings.stepValue);
        return length - stepCount * this.settings.stepValue;
    }
    validate() {}
    getTasks() {
        return JSON.parse(localStorage.todo || '[]');
    }
    removeTask(inx: number) {
        const list = this.getTasks().filter((task: any, i: number) => {
            return i !== inx;
        });
        localStorage.todo = JSON.stringify(list);
    }
    addTask(val: string) {
        const list = this.getTasks();
        list.push(val);
        localStorage.todo = JSON.stringify(list);
    }
}
