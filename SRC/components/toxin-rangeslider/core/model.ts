//const $ = require('../../../jquery/dist/jquery');
export default class TRSModel {
    settings: ExamplePluginOptions;
    static defaults: ExamplePluginOptions = {
        isVertical: false,
        isInterval: false,
        isTip: true,
        minValue: 0,
        maxValue: 1060,
        stepValue: 0,
        valueFrom: 322,
        valueTo: 491,
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
    };
    constructor(options: ExamplePluginOptions) {
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
