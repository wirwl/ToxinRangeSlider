import block from 'bem-cn';
import Rangeslider from './entities/rangeslider';
import TipView from './View/TipView';
import LineView from './View/LineView';
import HandleView from './View/HandleView';
import { Observer } from './ObservableSubject';

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

  constructor(el: JQuery<HTMLElement>) {
    this.init(el);
    this.bindThis();
    this.addEventListeners();
  }

  private init(el: JQuery<HTMLElement>): void {
    this.el = el;
    this.el.html(SliderDomEntities.rootElement);

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

    this.lineView = new LineView(
      {
        domEntity: SliderDomEntities.lineMain,
        $parentElement: this.rangeslider.$el,
        currentSettings: this.currentSettings,
      },
      this.handleFromView,
      this.handleToView,
    );

    this.lineSelectedView = new LineView(
      {
        domEntity: SliderDomEntities.lineSelected,
        $parentElement: this.rangeslider.$el,
      },
      this.handleFromView,
      this.handleToView,
    );

    this.tipMinView = new TipView({
      domEntity: SliderDomEntities.tipMin,
      $parentElement: this.rangeslider.$el,
    });

    this.tipMaxView = new TipView({
      domEntity: SliderDomEntities.tipMax,
      $parentElement: this.rangeslider.$el,
    });

    this.handleFromView = new HandleView(
      {
        domEntity: SliderDomEntities.handleFrom,
        $parentElement: this.rangeslider.$el,
        currentSettings: this.currentSettings,
      },
      true,
      this.lineView,
    );
    this.lineView.handleFromView = this.handleFromView;

    this.offsetFrom = this.handleFromView.getWidth() / 2;

    this.tipFromView = new TipView({
      domEntity: SliderDomEntities.tipFrom,
      $parentElement: this.rangeslider.$el.find('.rangeslider__handle-from'),
    });

    this.handleToView = new HandleView(
      {
        domEntity: SliderDomEntities.handleTo,
        $parentElement: this.rangeslider.$el,
        currentSettings: this.currentSettings,
      },
      false,
      this.lineView,
    );
    this.lineView.handleToView = this.handleToView;

    this.offsetTo = this.handleToView.getWidth() / 2;

    this.tipToView = new TipView({
      domEntity: SliderDomEntities.tipTo,
      $parentElement: this.rangeslider.$el.find('.rangeslider__handle-to'),
    });

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

  private bindThis(): void {
    this.onMouseDownByLine = this.onMouseDownByLine.bind(this);
    // this.onMouseDownByHandle = this.onMouseDownByHandle.bind(this);
  }

  private addEventListeners(): void {
    this.lineView.$el.on('mousedown.line', this.onMouseDownByLine);
  }

  private onMouseDownByLine(e: JQuery.TriggeredEvent): void {
    this.lineView.onMouseDownByLine(e);
  }

  private redrawLineSelected(currentHandle: HandleView): void {
    const { isTwoHandles } = this.currentSettings;
    const isHandleFromMoving = currentHandle.is(this.handleFromView);

    const pos = isHandleFromMoving && this.handleFromView.getPos() + this.offsetFrom;
    const size = isTwoHandles
      ? this.handleToView.getPos() -
        this.handleFromView.getPos() +
        this.handleToView.getSize() -
        this.offsetFrom -
        this.offsetTo +
        1
      : currentHandle.getPos() + currentHandle.getSize() - this.offsetTo + 1;

    this.lineSelectedView.draw(pos, size);
  }

  private getNearestHandle(pos: number): HandleView {
    if (this.currentSettings.isTwoHandles) {
      if (pos < this.handleFromView.getPos()) return this.handleFromView;
      if (pos > this.handleToView.getPos()) return this.handleToView;
      const distanceBetweenHandles =
        this.handleToView.getPos() - this.handleFromView.getPos() - this.handleFromView.getSize();
      const half = this.handleFromView.getPos() + this.handleFromView.getSize() + distanceBetweenHandles / 2;
      if (pos < half) return this.handleFromView;
      return this.handleToView;
    }
    return this.handleToView;
  }

  addObservers(observer: Observer): void {
    this.handleFromView.notifier.addObserver(observer);
    this.handleToView.notifier.addObserver(observer);
    this.handleFromView.notifier.addObserver(this.tipFromView);
    this.handleToView.notifier.addObserver(this.tipToView);
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
        this.handleFromView.normalizedMoveHandle(val, this.lineView);
      }
    }

    if (isNeedRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = isUsingItemsCurrent ? currentIndexTo : Number(currentValueTo);
      this.handleToView.normalizedMoveHandle(val, this.lineView);
    }

    if (isUsingItemsCurrent) {
      const pxLength = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues.length - 1);

      if (currentIsTwoHandles && (isNeedRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom * pxStep;
        this.handleFromView.moveHandle(newPos, this.lineView);
      }

      if (isNeedRedraw || indexToChanged) {
        const newPos = currentIndexTo * pxStep;
        this.handleToView.moveHandle(newPos, this.lineView);
      }
    }
  }

  private isEqualArrays(ar1: (string | number)[] | null, ar2: (string | number)[] | null): boolean {
    if (!ar1 || !ar2) return false;
    if (ar1.length !== ar2.length) return false;
    return ar1.every((value, index) => value === ar2[index]);
  }
}

export default TRSView;
