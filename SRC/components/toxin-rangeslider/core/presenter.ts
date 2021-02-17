import TRSView from './View/MainView';
import TRSModel from './model';

class TRSPresenter {
  constructor(private model: TRSModel, private view: TRSView) {
    this.bindThis();
    this.init();
  }

  private bindThis(): void {
    this.notifyModel = this.notifyModel.bind(this);
  }

  private init(): void {
    this.model.updateState(this.view.getDataOptions());
    this.view.addObservers(this.notifyModel);
    this.view.firstDrawSlider(this.getState());
  }

  private notifyModel(data: HandleMovingResult): void {
    this.model.updateHandleState(data);
    this.model.onHandlePositionChange(data);
    this.view.drawSlider(this.getState());
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
