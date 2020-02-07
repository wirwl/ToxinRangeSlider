//const $ = require('../../../jquery/dist/jquery');
export default class TRSModel {
    settings: ExamplePluginOptions;
    static defaults: ExamplePluginOptions = {
        isVertical: false,
        isInterval: true,
        isTip: true,
        minValue: 10,
        maxValue: 1000,
        stepValue: 0,
        valueFrom: 10,
        valueTo: 750,
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
