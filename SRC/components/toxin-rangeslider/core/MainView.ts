/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import block from 'bem-cn';
import Rangeslider from './entities/rangeslider';
import TipView from './View/TipView';
import LineView from './View/LineView';
import HandleView from './View/HandleView';
import ObservableSubject from './ObservableSubject';

const b = block('rangeslider');

const SliderDomEntities = {
  rootElement: `<div class='${b()}'></div>`,
  tipMin: `<div class='${b('tip-min')}'>00</div>`,
  tipMax: `<div class='${b('tip-max')}'>99</div>`,
  tipFrom: `<div class='${b('tip')} ${b('tip-from')}'>23</div>`,
  tipTo: `<div class='${b('tip')} ${b('tip-to')}'>456</div>`,
  lineMain: `<div class='${b('line')}'></div>`,
  lineSelected: `<div class='${b('line-selected')}'></div>`,
  handleFrom: `<div class='${b('handle')} ${b('handle-from')}'>`,
  handleTo: `<div class='${b('handle')} ${b('handle-to')}'>`,
};

class TRSView {
  private currentSettings!: RangeSliderOptions;

  private offsetFrom!: number;

  private offsetTo!: number;

  private el!: JQuery<Element>;

  private rangeslider!: Rangeslider;

  public handleFromView!: HandleView;

  public handleToView!: HandleView;

  private tipFromView!: TipView;

  private tipToView!: TipView;

  private tipMinView!: TipView;

  private tipMaxView!: TipView;

  private lineView!: LineView;

  private lineSelectedView!: LineView;

  public notifier!: ObservableSubject;

  constructor(el: JQuery<HTMLElement>) {
    this.bindThis();
    this.init(el);
    this.addEventListeners();
  }

  private init(el: JQuery<HTMLElement>): void {
    this.el = el;
    this.el.html(SliderDomEntities.rootElement);

    this.notifier = new ObservableSubject();

    this.currentSettings = {
      isVertical: false,
      isTwoHandles: true,
      isTip: true,
      minValue: 0,
      maxValue: 4321,
      stepValue: 1,
      valueFrom: 0,
      valueTo: 4321,
      items: { indexFrom: 0, indexTo: 0, values: [] },
    };

    this.rangeslider = new Rangeslider(el.find('.rangeslider'));
    this.initSubViews();

    this.rangeslider.addControls([
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

  private initSubView<T>(
    SubView: new (...args: any[]) => T,
    domEntity: string,
    $parentElement = this.rangeslider.$el,
  ): T {
    return new SubView({
      domEntities: {
        domEntity,
        $parentElement,
      },
      state: this.currentSettings,
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
    this.lineView.notifierUserInput.addObserver(this.receiveDataAfterUserInput);
  }

  private receiveDataAfterUserInput({ value, handle, event }: any): void {
    const isClickOnLine = handle === undefined;

    if (!isClickOnLine) {
      if (value < 0) value = 0;
      const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      if (value > lineWidth) value = lineWidth;
    } else {
      if (value < this.offsetFrom) value = this.offsetFrom;
      if (value > this.lineView.getSize() - 8) {
        value = this.lineView.getSize() - 8;
      }
    }

    const currentHandle: HandleView = handle || this.getNearestHandle(value);
    const isFromHandle = currentHandle.is(this.handleFromView);

    const isUsingItemsCurrent = this.currentSettings.items.values.length > 1;
    let restoreIndex = -1;
    if (isUsingItemsCurrent) {
      const lw = this.lineView.getSize() - 8 - 8;
      const pxStep = lw / (this.currentSettings.items.values.length - 1);
      restoreIndex = Math.round(value / pxStep);
    }

    let offset = 0;
    if (isClickOnLine) {
      const pxLineLength = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const newPos = currentHandle.getSteppedPos(value - this.offsetFrom, pxLineLength);
      if (newPos == null) {
        offset = currentHandle.is(this.handleFromView) ? this.offsetFrom : this.handleToView.getSize() - this.offsetTo;
      }
    }

    const lineWidth = this.lineView.getSize() - 8 - 8;
    const relValue = isUsingItemsCurrent
      ? this.currentSettings.items.values[restoreIndex]
      : currentHandle.convertPixelValueToRelativeValue(value - offset, lineWidth);

    // Notify model about user input
    this.notifier.notify({ isFromHandle, relValue });

    // Immediately moving handles after LMB pressed on line
    if (isClickOnLine) {
      const newEvent: JQuery.TriggeredEvent = event;
      newEvent.target = currentHandle.$el;
      currentHandle.$el.trigger(newEvent, 'mousedown.handle');
    }
  }

  private getNearestHandle(pxPosOnLine: number): HandleView {
    if (this.currentSettings.isTwoHandles) {
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

  drawSlider(newSettings = {}, forceRedraw = false): void {
    const oldSettings = this.currentSettings;
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

    $.extend(true, this.currentSettings, newSettings);

    const {
      minValue: currentMinValue,
      maxValue: currentMaxValue,
      valueFrom: currentValueFrom,
      valueTo: currentValueTo,
      isVertical: currentIsVertical,
      isTip: currentIsTip,
      isTwoHandles: currentIsTwoHandles,
    } = this.currentSettings;

    const currentIndexFrom = this.currentSettings.items?.indexFrom;
    const currentIndexTo = this.currentSettings.items?.indexTo;
    const currentValues = this.currentSettings.items?.values;

    const { setVertical, setTwoHandles } = this.rangeslider;
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
        if (!this.rangeslider.$el.find('.rangeslider__handle-from').length) {
          this.rangeslider.appendToDomTree(this.handleFromView);
          this.handleFromView.$el.on('mousedown.handleFrom', e =>
            this.handleFromView.onMouseDownByHandle(e, this.lineView),
          );
          this.tipFromView.setText(currentValueFrom);
          console.log(currentValueFrom);
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
        this.handleFromView.steppedMoveHandle(val, lineWidth);
        this.tipFromView.setText(currentValueFrom);
      }
    }

    if (isNeedRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = isUsingItemsCurrent ? currentIndexTo : Number(currentValueTo);
      const lineWidth = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      this.handleToView.steppedMoveHandle(val, lineWidth);
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
