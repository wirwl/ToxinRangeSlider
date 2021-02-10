/* eslint-disable @typescript-eslint/no-explicit-any */
import TRSView from './MainView';
import TRSModel from './model';

class TRSPresenter {
  private view: TRSView;

  private model: TRSModel;

  constructor(model: TRSModel, view: TRSView) {
    this.view = view;
    this.model = model;

    this.view.addObservers(this);
    this.model.updateState(this.view.getDataOptions());
    this.view.drawSlider(this.getState(), true);
  }

  updateInObserver(data: any): void {
    this.model.updateHandleState(data);
    this.model.onHandlePositionChange(data);
  }

  getState(): RangeSliderOptions {
    return this.model.getState();
  }

  update(data = {}): void {
    this.model.updateState(data);
    this.view.drawSlider(this.getState());
  }
}

export default TRSPresenter;
