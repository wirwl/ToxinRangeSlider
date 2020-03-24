import TRSView from './view';
import TRSModel from './model';
import Handle from './entities/handle';
import CRangeSliderOptions from './entities/crangeslideroptions';
const $ = require('../../../jquery/dist/jquery');
/**
 * Presenter listenes to view events, retrieve data, manipulates it and
 * updates the view
 */
export default class TRSPresenter {
    view: TRSView;
    model: TRSModel;
    data: CRangeSliderOptions;
    constructor(model: TRSModel, view: TRSView) {
        this.view = view;
        this.model = model;
        this.view.onHandlePositionUpdate = this.onHandlePositionUpdate.bind(this);
        this.init();
        this.view.settings.extend({ minValue: 100, maxValue: 1100, items: { values: [] } });
    }
    init() {
        $.extend(true, this.model.settings, this.view.data);
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
        this.model.settings.onHandlePositionChange.call(result);
    }

    update(opt: RangeSliderOptions) {
        const oldSettings = new CRangeSliderOptions(this.model.settings);

        this.model.settings.extend(opt);
        this.model.validate();

        this.data = this.model.settings;

        this.view.drawSlider(oldSettings, this.model.settings);
    }
}
