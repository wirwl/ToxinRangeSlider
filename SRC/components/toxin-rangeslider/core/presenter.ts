import TRSView from './view';
import TRSModel from './model';

/**
 * Presenter listenes to view events, retrieve data, manipulates it and
 * updates the view
 */
export default class TRSPresenter {
    view: TRSView;
    model: TRSModel;
    constructor(model: TRSModel, view: TRSView) {
        this.view = view;
        this.model = model;
        this.view.onSubmitCb = this.onSubmit.bind(this);
        this.view.onRemoveTaskCb = this.onRemoveTask.bind(this);
        //this.view.onRenderSlider = this.onRenderSlider.bind(this);
        this.init();
        //this.updateList();
    }
    //onRenderSlider(settings: ExamplePluginOptions) {}
    init() {
        $.extend(this.model.settings, this.view.data);
        this.model.validate();
        this.view.drawSlider(null, this.model.settings, true);
    }
    update(opt: ExamplePluginOptions) {
        const oldSettings = $.extend({}, this.model.settings);
        $.extend(this.model.settings, opt);
        this.model.validate();
        this.view.drawSlider(oldSettings, this.model.settings);
    }
    onRemoveTask(inx: number) {
        this.model.removeTask(inx);
        this.updateList();
    }
    onSubmit(text: string) {
        this.model.addTask(text);
        this.updateList();
    }
    updateList() {
        this.view.emptyList();
        this.model.getTasks().forEach((text: string, inx: number) => {
            this.view.addTask(text, inx);
        });
    }
}
