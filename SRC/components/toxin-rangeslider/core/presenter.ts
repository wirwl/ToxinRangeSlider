import TRSView from './view';
import TRSModel from './model';
import Handle from './entities/handle';
import CRangeSliderOptions from './entities/crangeslideroptions';

class TRSPresenter {
  view: TRSView;

  model: TRSModel;

  data: CRangeSliderOptions;

  constructor(model: TRSModel, view: TRSView) {
    this.view = view;
    this.model = model;
    this.view.onHandlePositionUpdate = this.onHandlePositionUpdate.bind(this);
    this.init();
  }

  init() {
    this.model.settings.extend(this.view.data);
    this.model.validate();
    this.view.drawSlider(null, this.model.settings, true);
  }

  onHandlePositionUpdate(handle: Handle, pxNewPos: number) {
    const result: HandleMovingResult = this.view.moveHandle(handle, pxNewPos);
    if (result.isFromHandle) {
      if (result.isUsingItems) this.model.settings.items.indexFrom = result.index;
      this.model.settings.setValueFrom(result.value);
    } else {
      if (result.isUsingItems) this.model.settings.items.indexTo = result.index;
      this.model.settings.setValueTo(result.value);
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

export default TRSPresenter;
