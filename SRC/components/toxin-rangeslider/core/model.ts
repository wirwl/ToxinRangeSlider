export default class TRSModel {
    settings: ExamplePluginOptions;
    static defaults: ExamplePluginOptions = {
        isVertical: false,
        isInterval: true,
        isTip: true,
        minValue: 10,
        maxValue: 100,
        step: 0,
        valueFrom: 55,
        valueTo: 75,
    };
    constructor(options: ExamplePluginOptions) {
        this.settings = $.extend({}, TRSModel.defaults, options);
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
