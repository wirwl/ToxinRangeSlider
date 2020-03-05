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
        const result: HandleMovingResult = this.view.moveHandle(handle, newPos);
        if (result.isFromHandle) {
            if (result.isUsingItems) this.model.settings.items.indexFrom = result.index;
            this.model.settings.valueFrom = result.value;
        } else {
            if (result.isUsingItems) this.model.settings.items.indexTo = result.index;
            this.model.settings.valueTo = result.value;
        }
        this.model.settings.onHandlePositionChange.call(result, result.value, result.isFromHandle, this.model.settings);
    }
    update(opt: RangeSliderOptions, isForceRedraw = false) {
        const oldSettings = $.extend({}, this.model.settings);
        $.extend(this.model.settings, opt);
        this.model.validate();
        this.view.drawSlider(oldSettings, this.model.settings, isForceRedraw);
    }
    reset() {}
}
