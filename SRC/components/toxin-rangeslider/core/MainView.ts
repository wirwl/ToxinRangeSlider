/* eslint-disable prefer-const */
/* eslint-disable no-console */
import TipView from './View/TipView';
import LineView from './View/LineView';
import HandleView from './View/HandleView';
import ObservableSubject from './ObservableSubject';
import defaultRangeSliderState, { SliderDomEntities } from './defaults';

class TRSView {
  private state!: RangeSliderOptions;

  private offsetFrom!: number;

  private offsetTo!: number;

  private el!: JQuery<Element>;

  // private rangeslider!: Rangeslider;

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

  private _isTwoHandles = false;

  private _isVertical = false;

  private $rangeslider!: JQuery<HTMLElement>;

  readonly CLASSES = {
    modOneHandle: 'rangeslider_one-handle',
    modIsVertical: 'rangeslider_is-vertical',
  };

  constructor(el: JQuery<HTMLElement>) {
    this.bindThis();
    this.init(el);
    this.addEventListeners();
  }

  private init(el: JQuery<HTMLElement>): void {
    this.el = el;
    this.el.html(SliderDomEntities.rootElement);

    this.notifier = new ObservableSubject();

    this.state = $.extend(true, {}, defaultRangeSliderState);

    // this.rangeslider = new Rangeslider(el.find('.rangeslider'));
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

  private setTwoHandles = (value: boolean): void => {
    this._isTwoHandles = value;
    this.$rangeslider.find('.rangeslider__line-selected').removeAttr('style');
    if (this._isTwoHandles) this.$rangeslider.removeClass(this.CLASSES.modOneHandle);
    else this.$rangeslider.addClass(this.CLASSES.modOneHandle);
  };

  private setVertical = (value: boolean): void => {
    this._isVertical = value;
    if (value) this.$rangeslider.addClass(this.CLASSES.modIsVertical);
    else this.$rangeslider.removeClass(this.CLASSES.modIsVertical);
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

  private addEventListeners(): void {
    this.lineView.$el.on('mousedown.line', this.lineView.onMouseDownByLine);
    this.handleFromView.$el.on('mousedown.handle', e => this.handleFromView.onMouseDownByHandle(e, this.lineView));
    this.handleToView.$el.on('mousedown.handle', e => this.handleToView.onMouseDownByHandle(e, this.lineView));
  }

  addObservers(observerModel: anyFunction): void {
    this.notifier.addObserver(observerModel);
    this.handleFromView.notifier.addObserver(this.receiveDataAfterUserInput);
    this.handleToView.notifier.addObserver(this.receiveDataAfterUserInput);
    this.lineView.notifier.addObserver(this.receiveDataAfterUserInput);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private receiveDataAfterUserInput({ value, handle, event }: any): void {
    const isClickOnLine = handle === undefined;
    const isHandleMoving = event === undefined;
    const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
    const currentHandle: HandleView = handle || this.getNearestHandle(value);
    const isFromHandle = currentHandle.is(this.handleFromView);

    if (isHandleMoving) value -= this.lineView.getOffset();
    if (isClickOnLine)
      value = isFromHandle ? value - this.offsetFrom : value - this.handleToView.getSize() + this.offsetTo;
    const relValue = currentHandle.convertPixelValueToRelativeValue(value, lineWidth, this.state);

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
    return this.el.data('options');
  }

  firstDrawSlider(state: RangeSliderOptions): void {
    this.drawSlider(state, true);
  }

  drawSlider(newSettings = {}, forceRedraw = false): void {
    const oldSettings = this.state;
    const {
      minValue: oldMinValue,
      maxValue: oldMaxValue,
      valueFrom: oldValueFrom,
      valueTo: oldValueTo,
      isVertical: oldIsVertical,
      isTip: oldIsTip,
      isTwoHandles: oldIsTwoHandles,
    } = oldSettings;

    const oldIndexFrom = oldSettings.items?.indexFrom;
    const oldIndexTo = oldSettings.items?.indexTo;
    const oldValues = oldSettings.items?.values;

    $.extend(true, this.state, newSettings);

    const {
      minValue: currentMinValue,
      maxValue: currentMaxValue,
      valueFrom: currentValueFrom,
      valueTo: currentValueTo,
      isVertical: currentIsVertical,
      isTip: currentIsTip,
      isTwoHandles: currentIsTwoHandles,
    } = this.state;

    const currentIndexFrom = this.state.items?.indexFrom;
    const currentIndexTo = this.state.items?.indexTo;
    const currentValues = this.state.items?.values;

    const { setVertical, setTwoHandles } = this;
    const isUsingItemsCurrent = currentValues?.length > 1;
    const isVerticalChanged = currentIsVertical !== oldIsVertical;
    const isTwoHandlesChanged = currentIsTwoHandles !== oldIsTwoHandles;
    const isTipChanged = currentIsTip !== oldIsTip;
    const minValueChanged = oldMinValue !== currentMinValue;
    const maxValueChanged = oldMaxValue !== currentMaxValue;
    const valueFromChanged = oldValueFrom !== currentValueFrom;
    const valueToChanged = oldValueTo !== currentValueTo;
    const indexFromChanged = currentIndexFrom !== oldIndexFrom;
    const indexToChanged = currentIndexTo !== oldIndexTo;
    let isNeedRedraw = forceRedraw;

    if (isVerticalChanged) {
      setVertical(currentIsVertical);
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTwoHandlesChanged) {
      setTwoHandles(currentIsTwoHandles);

      if (currentIsTwoHandles) {
        if (!this.$rangeslider.find('.rangeslider__handle-from').length) {
          this.handleFromView.appendToDomTree();
          this.handleFromView.$el.on('mousedown.handleFrom', e =>
            this.handleFromView.onMouseDownByHandle(e, this.lineView),
          );
          this.tipFromView.setText(currentValueFrom);
        }
      } else this.handleFromView.removeFromDomTree();
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTipChanged) {
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

    if (isNeedRedraw || minValueChanged) {
      this.tipMinView.setText(currentMinValue);
    }

    if (isNeedRedraw || maxValueChanged) {
      this.tipMaxView.setText(currentMaxValue);
    }

    const isItemValuesChanged = !this.isEqualArrays(oldValues, currentValues);
    if (isNeedRedraw || isItemValuesChanged) {
      if (currentValues) {
        const count = currentValues.length;
        if (count > 1) {
          this.tipMinView.setText(currentValues[0]);
          this.tipMaxView.setText(currentValues[count - 1]);
        }
      }
    }

    if (currentIsTwoHandles) {
      if (isNeedRedraw || valueFromChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
        const val = isUsingItemsCurrent ? currentIndexFrom : Number(currentValueFrom);
        const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
        // this.handleFromView.steppedMoveHandle(val, lineWidth, this.state);
        const newPxPos = this.handleFromView.convertRelativeValueToPixelValue(val, lineWidth, this.state);
        this.handleFromView.moveHandle(Number(newPxPos));
        this.tipFromView.setText(currentValueFrom);
      }
    }

    if (isNeedRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = isUsingItemsCurrent ? currentIndexTo : Number(currentValueTo);
      const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      // this.handleToView.steppedMoveHandle(val, lineWidth, this.state);
      const newPxPos = this.handleToView.convertRelativeValueToPixelValue(val, lineWidth, this.state);
      this.handleToView.moveHandle(Number(newPxPos));
      this.tipToView.setText(currentValueTo);
    }

    if (isUsingItemsCurrent) {
      const pxLength = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues.length - 1);

      if (currentIsTwoHandles && (isNeedRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom * pxStep;
        this.handleFromView.moveHandle(newPos);
        this.tipFromView.setText(currentValueFrom);
      }

      if (isNeedRedraw || indexToChanged) {
        const newPos = currentIndexTo * pxStep;
        this.handleToView.moveHandle(newPos);
        this.tipToView.setText(currentValueTo);
      }
    }

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

  private isEqualArrays(ar1: (string | number)[] | null, ar2: (string | number)[] | null): boolean {
    if (!ar1 || !ar2) return false;
    if (ar1.length !== ar2.length) return false;
    return ar1.every((value, index) => value === ar2[index]);
  }
}

export default TRSView;
