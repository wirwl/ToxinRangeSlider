import TRSView from './view';
import TRSModel from './model';
import Handle from './entities/handle';

class TRSPresenter {
  view: TRSView;

  model: TRSModel;

  data: RangeSliderOptions;

  constructor(model: TRSModel, view: TRSView) {
    this.view = view;
    this.model = model;
    this.data = {};
    this.view.onHandlePositionUpdate = this.onHandlePositionUpdate.bind(this);
    this.init();
  }

  init() {
    $.extend(true, this.model.settings, this.view.data);
    this.model.validate();
    this.data = this.model.settings;
    this.view.drawSlider({}, this.model.settings);
  }

  updateSettings({ isFromHandle, isUsingItems, index, value }: HandleMovingResult) {
    if (isFromHandle) {
      if (isUsingItems) {
        this.model.settings.items!.indexFrom = index;
        this.model.settings.valueFrom = this.model.settings.items!.values![index];
      } else this.model.settings.valueFrom = value;
    } else if (isUsingItems) {
      this.model.settings.items!.indexTo = index;
      this.model.settings.valueTo = this.model.settings.items!.values![index];
    } else this.model.settings.valueTo = value;
  }

  onHandlePositionUpdate(handle: Handle, pxNewPos: number): void {
    const { onHandlePositionChange } = this.model.settings;
    const handleMovingResult = this.view.moveHandle(handle, pxNewPos);

    this.updateSettings(handleMovingResult);
    onHandlePositionChange!.call(handleMovingResult);
  }

  update(opt: RangeSliderOptions) {
    const oldSettings = { ...this.model.settings };

    $.extend(true, this.model.settings, opt);
    this.model.validate();
    this.data = this.model.settings;

    this.view.drawSlider(oldSettings, this.model.settings);
  }
}

export default TRSPresenter;
