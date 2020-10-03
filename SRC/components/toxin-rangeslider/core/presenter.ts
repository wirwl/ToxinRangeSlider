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
    this.data = new CRangeSliderOptions();
    this.view.onHandlePositionUpdate = this.onHandlePositionUpdate.bind(this);
    this.init();
  }

  init() {
    this.model.settings.extend(this.view.data);
    this.model.validate();
    this.data = this.model.settings;
    this.view.drawSlider(CRangeSliderOptions.emptySettings, this.model.settings);
  }

  onHandlePositionUpdate(handle: Handle, pxNewPos: number) {
    const { setValueFrom, setValueTo, onHandlePositionChange } = this.model.settings;
    const { isFromHandle, isUsingItems, index, value } = this.view.moveHandle(handle, pxNewPos);

    if (isFromHandle) {
      if (isUsingItems) this.model.settings.items.indexFrom = index;
      setValueFrom(value);
    } else {
      if (isUsingItems) this.model.settings.items.indexTo = index;
      setValueTo(value);
    }
    onHandlePositionChange!.call({ isFromHandle, isUsingItems, index, value });
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
