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
    this.model.setState(this.view.getDataOptions());
    this.view.addObservers(this.notifyModel);
    this.view.firstDrawSlider(this.getState());
  }

  private notifyModel(data: HandleMovingResult): void {
    this.model.onHandlePositionChange(data);
    this.view.drawSlider(this.getState());
  }

  getState(): RangeSliderOptions {
    return this.model.getState();
  }

  setState(data = {}): void {
    this.model.setState(data);
    this.view.drawSlider(this.getState());
  }

  getIsVertical(): boolean {
    return this.model.getIsVertical();
  }

  setIsVertical(isVertical: boolean): void {
    this.model.setIsVertical(isVertical);
  }

  getIsTwoHandles(): boolean {
    return this.model.getIsTwoHandles();
  }

  setIsTwoHandles(isTwoHandles: boolean): void {
    this.model.setIsTwoHandles(isTwoHandles);
  }

  getIsTip(): boolean {
    return this.model.getIsTip();
  }

  setIsTip(isTip: boolean): void {
    this.model.setIsTip(isTip);
  }

  getMinValue(): number | string {
    return this.model.getMinValue();
  }

  setMinValue(newMinValue: number | string): void {
    this.model.setMinValue(newMinValue);
  }

  getMaxValue(): number | string {
    return this.model.getMaxValue();
  }

  setMaxValue(newMaxValue: number | string): void {
    this.model.setMaxValue(newMaxValue);
  }

  getStepValue(): number {
    return this.model.getStepValue();
  }

  setStepValue(newStepValue: number): void {
    this.model.setStepValue(newStepValue);
  }

  getValueFrom(): number | string {
    return this.model.getValueFrom();
  }

  setValueFrom(newValueFrom: number | string): void {
    this.model.setValueFrom(newValueFrom);
  }

  getValueTo(): number | string {
    return this.model.getValueTo();
  }

  setValueTo(newValueTo: number | string): void {
    this.model.setValueTo(newValueTo);
  }

  getItems(): RangeSliderItems {
    return this.model.getItems();
  }

  setItems(newItems: RangeSliderItems): void {
    this.model.setItems(newItems);
  }

  getItemsValues(): (number | string)[] {
    return this.model.getItemsValues();
  }

  setItemsValues(values: (number | string)[]): void {
    this.model.setItemsValues(values);
  }

  getIndexFrom(): number {
    return this.model.getIndexFrom();
  }

  setIndexFrom(index: number): void {
    this.model.setIndexFrom(index);
  }

  getIndexTo(): number {
    return this.model.getIndexTo();
  }

  setIndexTo(index: number): void {
    this.model.setIndexTo(index);
  }

  isUsingItems(): boolean {
    return this.model.isUsingItems();
  }
}

export default TRSPresenter;
