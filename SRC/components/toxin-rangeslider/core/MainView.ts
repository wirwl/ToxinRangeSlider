import Handle from './entities/handle';
// import Tip from './entities/tip';
// import Line from './entities/line';
import Rangeslider from './entities/rangeslider';
import { ERRORS } from './const';
import TipView from './View/TipView';
import LineView from './View/LineView';
import HandleView from './View/HandleView';
import ObservableSubject from './ObservableSubject';

const SliderDomEntities = {
  rootElement: `<div class='rangeslider'></div>`,
  tipMin: `<div class='rangeslider__tip-min'>00</div>`,
  tipMax: `<div class='rangeslider__tip-max'>99</div>`,
  tipFrom: `<div class='rangeslider__tip rangeslider__tip-from'>23</div>`,
  tipTo: `<div class='rangeslider__tip rangeslider__tip-to'>456</div>`,
  lineMain: `<div class='rangeslider__line'></div>`,
  lineSelected: `<div class='rangeslider__line-selected'></div>`,
  handleTo: `<div class='rangeslider__handle rangeslider__handle-to'>`,
  handleFrom: `<div class='rangeslider__handle rangeslider__handle-from'>`,
};

class TRSView {
  publisher: ObservableSubject;

  currentSettings: RangeSliderOptions;

  private offsetFrom: number;

  private offsetTo: number;

  el: JQuery<Element>;

  rangeslider: Rangeslider;

  private data: RangeSliderOptions;

  handleFromView: HandleView;

  handleToView: HandleView;

  tipFromView: TipView;

  tipToView: TipView;

  tipMinView: TipView;

  tipMaxView: TipView;

  lineView: LineView;

  lineSelectedView: LineView;

  constructor(el: JQuery<HTMLElement>) {
    this.el = el;
    this.el.html(SliderDomEntities.rootElement);

    this.publisher = new ObservableSubject();

    this.rangeslider = new Rangeslider(el.find('.rangeslider'));

    // this.line = new Line(el.find('.rangeslider__line'));
    this.lineView = new LineView({
      domEntity: SliderDomEntities.lineMain,
      $parentElement: this.rangeslider.$el,
    });

    // this.lineSelected = new Line(this.rangeslider.$el.find('.rangeslider__line-selected'));
    this.lineSelectedView = new LineView({
      domEntity: SliderDomEntities.lineSelected,
      $parentElement: this.rangeslider.$el,
    });

    this.data = el.data('options');

    // this.tipFrom = new Tip(el.find('.rangeslider__tip-from'));

    // this.tipTo = new Tip(el.find('.rangeslider__tip-to'));

    // this.tipMin = new Tip(el.find('.rangeslider__tip-min'));
    this.tipMinView = new TipView({
      domEntity: SliderDomEntities.tipMin,
      $parentElement: this.rangeslider.$el,
    });

    // this.tipMax = new Tip(el.find('.rangeslider__tip-max'));
    this.tipMaxView = new TipView({
      domEntity: SliderDomEntities.tipMax,
      $parentElement: this.rangeslider.$el,
    });

    // this.handleFrom = new Handle(this.rangeslider.$el.find('.rangeslider__handle-from'));
    this.handleFromView = new HandleView({
      domEntity: SliderDomEntities.handleFrom,
      $parentElement: this.rangeslider.$el,
    });
    this.offsetFrom = this.handleFromView.getWidth() / 2;
    this.tipFromView = new TipView({
      domEntity: SliderDomEntities.tipFrom,
      $parentElement: this.rangeslider.$el.find('.rangeslider__handle-from'),
    });

    // this.handleTo = new Handle(this.rangeslider.$el.find('.rangeslider__handle-to'));
    this.handleToView = new HandleView({
      domEntity: SliderDomEntities.handleTo,
      $parentElement: this.rangeslider.$el,
    });
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

    this.bindThis();
    this.addEventListeners();
  }

  getDataOptions(): RangeSliderOptions {
    return this.data;
  }

  private bindThis(): void {
    this.onMouseDownByLine = this.onMouseDownByLine.bind(this);
    this.onMouseDownByHandle = this.onMouseDownByHandle.bind(this);
  }

  private addEventListeners(): void {
    this.lineView.$el.on('mousedown.line', this.onMouseDownByLine);
    this.handleFromView.$el.on('mousedown.handleFrom', this.onMouseDownByHandle);
    this.handleToView.$el.on('mousedown.handleTo', this.onMouseDownByHandle);
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
          this.handleFromView.$el.on('mousedown.handleFrom', this.onMouseDownByHandle);
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
        const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
        const posXWithStep = this.getSteppedPos(posXWithOutStep);
        this.moveHandle(this.handleFromView, posXWithStep == null ? posXWithOutStep : posXWithStep);
      }
    }

    if (isNeedRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = isUsingItemsCurrent ? currentIndexTo : Number(currentValueTo);
      const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
      const posXWithStep = this.getSteppedPos(posXWithOutStep);
      this.moveHandle(this.handleToView, posXWithStep == null ? posXWithOutStep : posXWithStep);
    }

    if (isUsingItemsCurrent) {
      const pxLength = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues.length - 1);

      if (currentIsTwoHandles && (isNeedRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom * pxStep;
        this.moveHandle(this.handleFromView, newPos);
      }

      if (isNeedRedraw || indexToChanged) {
        const newPos = currentIndexTo * pxStep;
        this.moveHandle(this.handleToView, newPos);
      }
    }
  }

  isEqualArrays(ar1: (string | number)[] | null, ar2: (string | number)[] | null): boolean {
    if (!ar1 || !ar2) return false;
    if (ar1.length !== ar2.length) return false;
    return ar1.every((value, index) => value === ar2[index]);
  }

  private onMouseDownByHandle(e: JQuery.TriggeredEvent): void {
    const $el = $(e.target);
    let currentHandle: Handle | HandleView = this.handleFromView;
    if ($el.is(this.handleToView.$el) || $el.is(this.tipToView.$el)) currentHandle = this.handleToView;

    currentHandle.setMoving(true);
    const clientPos = this.currentSettings.isVertical ? e.clientY : e.clientX;
    let shiftPos: number;
    try {
      if (clientPos) shiftPos = clientPos - currentHandle.getOffset();
      else throw new Error(ERRORS.undefinedValue);
    } catch (e) {
      throw e;
    }

    this.rangeslider.$el.on('mousemove.rangeslider', e => this.onMouseMoveRangeSlider(e, currentHandle, shiftPos));
    const $document = $(document);
    $document.on('mousemove.document', e => this.onMouseMoveRangeSlider(e, currentHandle, shiftPos));
    currentHandle.$el.on('mouseup.handle', e => this.onMouseUp(e, currentHandle));

    $document.on('mouseup.document', e => this.onMouseUp(e, currentHandle));
  }

  private onMouseMoveRangeSlider(
    e: JQuery.TriggeredEvent,
    currentHandle: Handle | HandleView,
    shiftPos: number,
  ): boolean {
    const $target = $(e.target);
    const { isVertical } = this.currentSettings;

    const eOffset = isVertical ? e.offsetY : e.offsetX;
    const offsetPos = eOffset || 0;

    const targetOffsetCoord = $target.offset();
    let targetOffset: number;
    try {
      if (targetOffsetCoord) targetOffset = isVertical ? targetOffsetCoord.top : targetOffsetCoord.left;
      else throw new Error(ERRORS.undefinedValue);
    } catch (e) {
      throw e;
    }

    let newPos = this.getSteppedPos(offsetPos + targetOffset - this.lineView.getOffset() - this.offsetFrom);

    const eClient = isVertical ? e.clientY : e.clientX;
    const clientPos = eClient || 0;

    if (newPos == null) newPos = clientPos - this.lineView.getOffset() - shiftPos;
    newPos = this.validate(newPos, currentHandle);
    // this.onHandlePositionUpdate(currentHandle, newPos);
    const handleMovingResult = this.moveHandle(currentHandle, newPos);
    this.publisher.notify(handleMovingResult);

    return false;
  }

  validate(pos: number, currentHandle: Handle | HandleView): number {
    let result = pos;
    const lw = this.lineView.getSize();
    const ch = currentHandle;

    if (this.currentSettings.isTwoHandles) {
      if (ch.is(this.handleFromView) && pos < 0) result = 0;
      if (ch.is(this.handleFromView) && pos > this.handleToView.getPos()) result = this.handleToView.getPos();
      if (ch.is(this.handleToView) && pos > lw - ch.getSize()) result = lw - ch.getSize();
      if (ch.is(this.handleToView) && pos < this.handleFromView.getPos()) {
        result = this.handleFromView.getPos();
      }
    } else {
      if (pos < 0) result = 0;
      if (pos > lw - ch.getSize()) result = lw - ch.getSize();
    }

    return result;
  }

  private onMouseUp(e: JQuery.TriggeredEvent, currentHandle: Handle | HandleView): void {
    currentHandle.setMoving(false);
    this.rangeslider.$el.off('mousemove.rangeslider');
    currentHandle.$el.off('mouseup.handle');
    $(document).off('mousemove.document');
    $(document).off('mouseup.document');
  }

  private onMouseDownByLine(e: JQuery.TriggeredEvent): void {
    e.preventDefault();
    const eOffset = this.currentSettings.isVertical ? e.offsetY : e.offsetX;
    let offsetPos: number;
    try {
      if (eOffset) offsetPos = eOffset;
      else throw Error('Value is undefined. This is not valid value!');
    } catch (e) {
      throw e;
    }

    if (offsetPos < this.offsetFrom) offsetPos = this.offsetFrom;
    if (offsetPos > this.lineView.getSize() - this.offsetTo) {
      offsetPos = this.lineView.getSize() - this.offsetTo;
    }

    const nearHandle: Handle | HandleView = this.getNearestHandle(offsetPos);

    let newPos = this.getSteppedPos(offsetPos - this.offsetFrom);
    if (newPos == null) {
      const offset = nearHandle.is(this.handleFromView) ? this.offsetFrom : this.handleToView.getSize() - this.offsetTo;
      newPos = offsetPos - offset;
    }

    // this.onHandlePositionUpdate(nearHandle, newPos);
    const handleMovingResult = this.moveHandle(nearHandle, newPos);
    this.publisher.notify(handleMovingResult);

    const newEvent = e;
    newEvent.target = nearHandle.$el;
    nearHandle.$el.trigger(newEvent, 'mousedown.handle');
  }

  getNearestHandle(pos: number): Handle | HandleView {
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

  moveHandle(currentHandle: Handle | HandleView, pxX: number): HandleMovingResult {
    let { valueFrom, valueTo } = this.currentSettings;

    const values = this.currentSettings.items?.values;
    const isUsingItemsCurrent = values?.length > 1;
    const isHandleFrom = currentHandle.is(this.handleFromView);

    currentHandle.setPos(pxX);
    let restoreIndex = -1;
    if (isUsingItemsCurrent) {
      const lw = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = lw / (values.length - 1);
      restoreIndex = Math.round(pxX / pxStep);
      if (isHandleFrom) {
        this.currentSettings.items.indexFrom = restoreIndex;
        this.currentSettings.valueFrom = values[restoreIndex];
      } else {
        this.currentSettings.items.indexTo = restoreIndex;
        this.currentSettings.valueTo = values[restoreIndex];
      }
    } else {
      if (isHandleFrom) {
        this.currentSettings.valueFrom = this.convertPixelValueToRelativeValue(pxX);
      } else this.currentSettings.valueTo = this.convertPixelValueToRelativeValue(pxX);
      valueFrom = this.currentSettings.valueFrom;
      valueTo = this.currentSettings.valueTo;
    }

    this.redrawLineSelected(currentHandle);
    if (isHandleFrom) this.tipFromView.setText(valueFrom);
    else this.tipToView.setText(valueTo);

    return {
      isFromHandle: isHandleFrom,
      value: isHandleFrom ? valueFrom : valueTo,
      isUsingItems: isUsingItemsCurrent,
      index: restoreIndex,
    };
  }

  private redrawLineSelected(currentHandle: Handle | HandleView): void {
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

  convertRelativeValueToPixelValue(val: number): number {
    const { items, minValue, maxValue } = this.currentSettings;
    const values = items?.values;
    const lw = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
    const isHasValues = items && values && values.length > 1;
    let result;
    if (isHasValues) {
      const pxStep = lw / (values.length - 1);
      result = val * pxStep;
    } else {
      const relLength = Number(maxValue) - Number(minValue);
      const relPercent = (val - Number(minValue)) / relLength;
      result = lw * relPercent;
    }
    return result;
  }

  convertPixelValueToRelativeValue(val: number): number {
    const { maxValue, minValue } = this.currentSettings;
    const lw = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
    const percent = val / lw;
    const result = Math.round(Number(minValue) + percent * (Number(maxValue) - Number(minValue)));
    return result;
  }

  getSteppedPos(pxValue: number): number | null {
    const { stepValue, items, maxValue, minValue } = this.currentSettings;
    const values = items?.values;
    const pxLength = this.lineView.getSize() - this.offsetFrom - this.offsetTo;
    const isDefinedStep = stepValue > 1;
    const isDefinedSetOfValues = items && values && values.length > 1;
    const isTooLongLine = pxLength > Number(maxValue) - Number(minValue);
    const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

    if (isHaveStep) {
      let pxStep = 0;

      if (isDefinedStep) {
        pxStep = this.convertRelativeValueToPixelValue(Number(minValue) + Number(stepValue));
      }

      if (isTooLongLine) {
        const relativeLength = Number(maxValue) - Number(minValue);
        pxStep = pxLength / relativeLength;
        if (isDefinedStep) pxStep *= stepValue;
      }

      if (isDefinedSetOfValues) {
        pxStep = pxLength / (values.length - 1);
      }

      const nStep = Math.round(pxValue / pxStep);
      let newPos = nStep * pxStep;

      if (pxValue / pxStep > Math.trunc(pxLength / pxStep)) {
        const remainder = pxLength - newPos;
        if (pxValue > newPos + remainder / 2) newPos += remainder;
      }
      if (newPos > pxLength) newPos = pxLength;
      return newPos;
    }
    return null;
  }
}

export default TRSView;
