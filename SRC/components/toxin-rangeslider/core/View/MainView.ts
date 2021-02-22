import TipView from './SubViews/TipView';
import LineView from './SubViews/LineView';
import HandleView from './SubViews/HandleView';
import ObservableSubject from '../ObservableSubject';
import defaultRangeSliderState, { SliderDomEntities, SliderModificators } from '../defaults';
import {
  convertPixelValueToRelativeValue,
  convertRelativeValueToPixelValue,
  isEqualArrays,
  mergeSliderOptions,
} from '../utils';
import { SubViewData, UserInputData } from '../types';

class TRSView {
  private state!: RangeSliderOptions;

  private offsetFrom!: number;

  private offsetTo!: number;

  private $el!: JQuery<Element>;

  public handleFromView!: HandleView;

  public handleToView!: HandleView;

  private tipFromView!: TipView;

  private tipToView!: TipView;

  private tipMinView!: TipView;

  private tipMaxView!: TipView;

  private lineView!: LineView;

  private lineSelectedView!: LineView;

  public notifier!: ObservableSubject;

  public controls: (TipView | HandleView | LineView)[] = [];

  private $rangeslider!: JQuery<HTMLElement>;

  constructor(el: JQuery<HTMLElement>) {
    this.bindThis();
    this.init(el);
  }

  private init(el: JQuery<HTMLElement>): void {
    this.$el = el;
    this.$el.html(SliderDomEntities.rootElement);

    this.notifier = new ObservableSubject();

    this.state = $.extend(true, {}, defaultRangeSliderState);

    this.$rangeslider = el.find('.rangeslider');

    this.initSubViews();

    this.addControls([
      this.tipMinView,
      this.tipFromView,
      this.tipToView,
      this.tipMaxView,
      this.handleFromView,
      this.handleToView,
      this.lineView,
      this.lineSelectedView,
    ]);
  }

  private addControls(controls: (TipView | HandleView | LineView)[]): void {
    this.controls = controls;
  }

  private setTwoHandles = (isTwoHandles: boolean): void => {
    this.$rangeslider.find('.rangeslider__line-selected').removeAttr('style');
    if (isTwoHandles) this.$rangeslider.removeClass(SliderModificators.oneHandle);
    else this.$rangeslider.addClass(SliderModificators.oneHandle);
  };

  private setVertical = (value: boolean): void => {
    if (value) this.$rangeslider.addClass(SliderModificators.isVertical);
    else this.$rangeslider.removeClass(SliderModificators.isVertical);
    this.controls.forEach(val => val.setVertical(value));
  };

  private initSubView<T>(
    SubView: new (data: SubViewData) => T,
    domEntity: string,
    $parentElement = this.$rangeslider,
  ): T {
    return new SubView({
      domEntity,
      $parentElement,
    });
  }

  private initSubViews(): void {
    const { lineMain, lineSelected, tipMin, tipMax, tipFrom, tipTo, handleFrom, handleTo } = SliderDomEntities;
    const { initSubView } = this;

    this.lineView = initSubView(LineView, lineMain);
    this.lineSelectedView = initSubView(LineView, lineSelected);
    this.tipMinView = initSubView(TipView, tipMin);
    this.tipMaxView = initSubView(TipView, tipMax);
    this.handleFromView = initSubView(HandleView, handleFrom);
    this.offsetFrom = this.handleFromView.getWidth() / 2;
    this.tipFromView = initSubView(TipView, tipFrom, this.handleFromView.$el);
    this.handleToView = initSubView(HandleView, handleTo);
    this.offsetTo = this.handleToView.getWidth() / 2;
    this.tipToView = initSubView(TipView, tipTo, this.handleToView.$el);
  }

  private bindThis(): void {
    this.receiveDataAfterUserInput = this.receiveDataAfterUserInput.bind(this);
    this.initSubView = this.initSubView.bind(this);
  }

  addObservers(observerModel: anyFunction): void {
    this.notifier.addObserver(observerModel);
    this.handleFromView.notifier.addObserver(this.receiveDataAfterUserInput);
    this.handleToView.notifier.addObserver(this.receiveDataAfterUserInput);
    this.lineView.notifier.addObserver(this.receiveDataAfterUserInput);
  }

  private receiveDataAfterUserInput({ value, handle, event }: UserInputData): void {
    const isClickOnLine = handle === undefined;
    const isHandleMoving = event === undefined;
    const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
    const currentHandle: HandleView = handle || this.getNearestHandle(value);
    const isFromHandle = currentHandle.is(this.handleFromView);

    if (isHandleMoving) value -= this.lineView.getOffset();
    if (isClickOnLine)
      value = isFromHandle ? value - this.offsetFrom : value - this.handleToView.getSize() + this.offsetTo;
    const relValue = convertPixelValueToRelativeValue(value, lineWidth, this.state);

    if (relValue) {
      // Notify model about user input
      this.notifier.notify({ isFromHandle, relValue });

      // Immediately moving handles after LMB pressed on line
      if (isClickOnLine) {
        const newEvent: JQuery.TriggeredEvent = event;
        currentHandle.$el.trigger(newEvent, 'mousedown.handle');
      }
    }
  }

  private getNearestHandle(pxPosOnLine: number): HandleView {
    if (this.state.isTwoHandles) {
      if (pxPosOnLine < this.handleFromView.getPos()) return this.handleFromView;
      if (pxPosOnLine > this.handleToView.getPos()) return this.handleToView;
      const distanceBetweenHandles =
        this.handleToView.getPos() - this.handleFromView.getPos() - this.handleFromView.getSize();
      const half = this.handleFromView.getPos() + this.handleFromView.getSize() + distanceBetweenHandles / 2;
      if (pxPosOnLine < half) return this.handleFromView;
      return this.handleToView;
    }
    return this.handleToView;
  }

  getDataOptions(): RangeSliderOptions {
    return this.$el.data('options');
  }

  firstDrawSlider(state: RangeSliderOptions): void {
    this.drawSlider(state, true);
  }

  drawSlider(newState: AnyObject, forceRedraw = false): void {
    const oldState = $.extend(true, {}, this.state);
    mergeSliderOptions(this.state, newState);
    let isNeedRedraw = forceRedraw;

    isNeedRedraw = this.changeSliderOrientation(oldState, isNeedRedraw);
    isNeedRedraw = this.appendHandleFromToDOMTree(oldState, isNeedRedraw);
    this.appendTipsToDOMTree(oldState, isNeedRedraw);
    this.drawTips(oldState, isNeedRedraw);
    this.drawHandles(oldState, isNeedRedraw);
    this.drawLineSelected();
  }

  private changeSliderOrientation(oldState: RangeSliderOptions, forceRedraw: boolean): boolean {
    const { isVertical: oldIsVertical } = oldState;
    const { isVertical: currentIsVertical } = this.state;
    const isVerticalChanged = currentIsVertical !== oldIsVertical;
    let isNeedRedraw = forceRedraw;

    if (isVerticalChanged) {
      this.setVertical(currentIsVertical);
      isNeedRedraw = true;
    }
    return isNeedRedraw;
  }

  private appendHandleFromToDOMTree(oldState: RangeSliderOptions, forceRedraw: boolean): boolean {
    const { isTwoHandles: oldIsTwoHandles } = oldState;
    const { isTwoHandles: currentIsTwoHandles, valueFrom: currentValueFrom } = this.state;
    const isTwoHandlesChanged = currentIsTwoHandles !== oldIsTwoHandles;
    let isNeedRedraw = forceRedraw;

    if (forceRedraw || isTwoHandlesChanged) {
      this.setTwoHandles(currentIsTwoHandles);
      if (currentIsTwoHandles) {
        const isHandleFromInDOMTree = this.$rangeslider.find('.rangeslider__handle-from').length;
        if (!isHandleFromInDOMTree) {
          this.handleFromView.appendToDomTree();
          this.handleFromView.$el.on('mousedown.handleFrom', e => this.handleFromView.onMouseDownByHandle(e));
          this.tipFromView.setText(currentValueFrom);
        }
      } else this.handleFromView.removeFromDomTree();
      isNeedRedraw = true;
    }
    return isNeedRedraw;
  }

  private appendTipsToDOMTree(oldState: RangeSliderOptions, forceRedraw: boolean): void {
    const { isTip: oldIsTip } = oldState;
    const { isTip: currentIsTip, isTwoHandles: currentIsTwoHandles } = this.state;
    const isTipChanged = currentIsTip !== oldIsTip;

    if (forceRedraw || isTipChanged) {
      if (currentIsTip) {
        if (currentIsTwoHandles) this.tipFromView.appendToDomTree();
        this.tipToView.appendToDomTree();
        this.tipMinView.appendToDomTree();
        this.tipMaxView.appendToDomTree();
      } else {
        if (currentIsTwoHandles) this.tipFromView.removeFromDomTree();
        this.tipToView.removeFromDomTree();
        this.tipMinView.removeFromDomTree();
        this.tipMaxView.removeFromDomTree();
      }
    }
  }

  private drawTips(oldState: RangeSliderOptions, forceRedraw: boolean): void {
    const { minValue: oldMinValue, maxValue: oldMaxValue } = oldState;
    const { minValue: currentMinValue, maxValue: currentMaxValue } = this.state;
    const minValueChanged = oldMinValue !== currentMinValue;
    const maxValueChanged = oldMaxValue !== currentMaxValue;
    const oldValues = oldState.items?.values;
    const currentValues = this.state.items?.values;

    if (forceRedraw || minValueChanged) {
      this.tipMinView.setText(currentMinValue);
    }

    if (forceRedraw || maxValueChanged) {
      this.tipMaxView.setText(currentMaxValue);
    }
    const isItemValuesChanged = !isEqualArrays(oldValues, currentValues);
    if (forceRedraw || isItemValuesChanged) {
      if (currentValues) {
        const count = currentValues.length;
        if (count > 1) {
          this.tipMinView.setText(currentValues[0]);
          this.tipMaxView.setText(currentValues[count - 1]);
        }
      }
    }
  }

  private drawHandles(oldState: RangeSliderOptions, forceRedraw: boolean): void {
    const { minValue: oldMinValue, maxValue: oldMaxValue, valueFrom: oldValueFrom, valueTo: oldValueTo } = oldState;

    const oldIndexFrom = oldState.items?.indexFrom;
    const oldIndexTo = oldState.items?.indexTo;
    const oldValues = oldState.items?.values;

    const {
      minValue: currentMinValue,
      maxValue: currentMaxValue,
      valueFrom: currentValueFrom,
      valueTo: currentValueTo,
      isTwoHandles: currentIsTwoHandles,
    } = this.state;

    const currentIndexFrom = this.state.items?.indexFrom;
    const currentIndexTo = this.state.items?.indexTo;
    const currentValues = this.state.items?.values;
    const isUsingItemsCurrent = currentValues?.length > 1;
    const minValueChanged = oldMinValue !== currentMinValue;
    const maxValueChanged = oldMaxValue !== currentMaxValue;
    const valueFromChanged = oldValueFrom !== currentValueFrom;
    const valueToChanged = oldValueTo !== currentValueTo;
    const indexFromChanged = currentIndexFrom !== oldIndexFrom;
    const indexToChanged = currentIndexTo !== oldIndexTo;
    const isItemValuesChanged = !isEqualArrays(oldValues, currentValues);

    if (currentIsTwoHandles) {
      if (forceRedraw || valueFromChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
        const val = currentValueFrom;
        const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
        const newPxPos = convertRelativeValueToPixelValue(val, lineWidth, this.state);
        this.handleFromView.moveHandle(Number(newPxPos));
        this.tipFromView.setText(currentValueFrom);
      }
    }

    if (forceRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = currentValueTo;
      const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const newPxPos = convertRelativeValueToPixelValue(val, lineWidth, this.state);
      this.handleToView.moveHandle(Number(newPxPos));
      this.tipToView.setText(currentValueTo);
    }

    if (isUsingItemsCurrent) {
      const pxLength = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues.length - 1);

      if (currentIsTwoHandles && (forceRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom * pxStep;
        this.handleFromView.moveHandle(newPos);
        this.tipFromView.setText(currentValueFrom);
      }

      if (forceRedraw || indexToChanged) {
        const newPos = currentIndexTo * pxStep;
        this.handleToView.moveHandle(newPos);
        this.tipToView.setText(currentValueTo);
      }
    }
  }

  private drawLineSelected(): void {
    const { isTwoHandles: currentIsTwoHandles } = this.state;
    const pos = currentIsTwoHandles ? this.handleFromView.getPos() + this.offsetFrom : 0;
    const size = currentIsTwoHandles
      ? this.handleToView.getPos() -
        this.handleFromView.getPos() +
        this.handleToView.getSize() -
        this.offsetFrom -
        this.offsetTo +
        1
      : this.handleToView.getPos() + this.handleToView.getSize() - this.offsetTo + 1;
    this.lineSelectedView.draw(pos, size);
  }
}

export default TRSView;
