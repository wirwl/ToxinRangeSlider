import TRSView from './view';
import TRSModel from './model';
import Handle from './entities/handle';
const $ = require('../../../jquery/dist/jquery');
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
        this.view.onHandlePositionUpdate = this.onHandlePositionUpdate.bind(this);
        this.init();
    }
    init() {
        $.extend(this.model.settings, this.view.data);
        this.model.validate();
        this.view.drawSlider(null, this.model.settings, true);
    }
    onHandlePositionUpdate(handle: Handle, newPos: number) {
        const result: Handle = this.view.moveHandle(handle, newPos);
        result.is(this.view.handleFrom)
            ? (this.model.settings.valueFrom = result.value)
            : (this.model.settings.valueTo = result.value);
    }
    update(opt: ExamplePluginOptions, isForceRedraw = false) {
        const oldSettings = $.extend({}, this.model.settings);
        $.extend(this.model.settings, opt);
        this.model.validate();
        this.view.drawSlider(oldSettings, this.model.settings, isForceRedraw);
    }
    reset() {}
}
