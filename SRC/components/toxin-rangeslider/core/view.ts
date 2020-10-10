import Handle from './entities/handle';
import Tip from './entities/tip';
import Line from './entities/line';
import Rangeslider from './entities/rangeslider';

class TRSView {
  currentSettings: RangeSliderOptions;

  private offsetFrom: number;

  private offsetTo: number;

  private htmlTemplate = `<div class='rangeslider'>
        <div class='rangeslider__tip-min'>00</div>                
        <div class='rangeslider__tip-max'>99</div>
        <div class='rangeslider__line'></div>
        <div class='rangeslider__line-selected'></div>
        <div class='rangeslider__handle rangeslider__handle-from'>
          <div class='rangeslider__tip rangeslider__tip-from'>23</div>
        </div>
        <div class='rangeslider__handle rangeslider__handle-to'>
          <div class='rangeslider__tip rangeslider__tip-to'>456</div>
        </div>
        </div>`;

  el: JQuery<Element>;

  rangeslider: Rangeslider;

  onHandlePositionUpdate!: (handle: Handle, pxNewPos: number) => void;

  data: RangeSliderOptions;

  handleFrom: Handle;

  handleTo: Handle;

  tipFrom: Tip;

  tipTo: Tip;

  tipMin: Tip;

  tipMax: Tip;

  line: Line;

  lineSelected: Line;

  constructor(el: JQuery<HTMLElement>) {
    this.el = el;
    this.el.html(this.htmlTemplate);

    this.rangeslider = new Rangeslider(el.find('.rangeslider'));

    this.line = new Line(el.find('.rangeslider__line'));

    this.lineSelected = new Line(this.rangeslider.el.find('.rangeslider__line-selected'));

    this.data = el.data('options');
    this.tipFrom = new Tip(el.find('.rangeslider__tip-from'));
    this.tipTo = new Tip(el.find('.rangeslider__tip-to'));
    this.tipMin = new Tip(el.find('.rangeslider__tip-min'));
    this.tipMax = new Tip(el.find('.rangeslider__tip-max'));

    this.handleFrom = new Handle(this.rangeslider.el.find('.rangeslider__handle-from'));

    this.offsetFrom = this.handleFrom.getWidth() / 2;

    this.handleTo = new Handle(this.rangeslider.el.find('.rangeslider__handle-to'));

    this.offsetTo = this.handleTo.getWidth() / 2;

    this.rangeslider.addControls([
      this.tipMin,
      this.tipFrom,
      this.tipTo,
      this.tipMax,
      this.handleFrom,
      this.handleTo,
      this.line,
      this.lineSelected,
    ]);
    this.currentSettings = {};

    this.bindThis();
    this.addEventListeners();
  }

  private bindThis() {
    this.onMouseDownByLine = this.onMouseDownByLine.bind(this);
    this.onMouseDownByHandle = this.onMouseDownByHandle.bind(this);
  }

  private addEventListeners() {
    this.line.el.on('mousedown.line', this.onMouseDownByLine);

    this.handleFrom.el.on('mousedown.handleFrom', this.onMouseDownByHandle);
    this.handleTo.el.on('mousedown.handleTo', this.onMouseDownByHandle);
  }

  drawSlider(oldSettings: RangeSliderOptions, newSettings: RangeSliderOptions) {
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

    $.extend(this.currentSettings, newSettings);

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
    const isUsingItemsCurrent = currentValues!?.length > 1;

    const isVerticalChanged = currentIsVertical !== oldIsVertical;
    const isTwoHandlesChanged = currentIsTwoHandles !== oldIsTwoHandles;
    const isTipChanged = currentIsTip !== oldIsTip;
    const minValueChanged = oldMinValue !== currentMinValue;
    const maxValueChanged = oldMaxValue !== currentMaxValue;
    const valueFromChanged = oldValueFrom !== currentValueFrom;
    const valueToChanged = oldValueTo !== currentValueTo;
    const indexFromChanged = currentIndexFrom !== oldIndexFrom;
    const indexToChanged = currentIndexTo !== oldIndexTo;
    let isNeedRedraw = false;

    if (isVerticalChanged) {
      setVertical(currentIsVertical!);
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTwoHandlesChanged) {
      setTwoHandles(currentIsTwoHandles!);
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTipChanged) {
      if (currentIsTip) {
        if (currentIsTwoHandles) this.tipFrom.show();
        this.tipTo.show();
        this.tipMin.show();
        this.tipMax.show();
      } else {
        if (currentIsTwoHandles) this.tipFrom.hide();
        this.tipTo.hide();
        this.tipMin.hide();
        this.tipMax.hide();
      }
    }

    if (isNeedRedraw || minValueChanged) {
      this.tipMin.setText(currentMinValue!);
    }

    if (isNeedRedraw || maxValueChanged) {
      this.tipMax.setText(currentMaxValue!);
    }

    const isItemValuesChanged = !this.isEqualArrays(oldValues!, currentValues!);
    if (isNeedRedraw || isItemValuesChanged) {
      if (currentValues) {
        const count = currentValues.length;
        if (count > 1) {
          this.tipMin.setText(currentValues[0]);
          this.tipMax.setText(currentValues[count - 1]);
        }
      }
    }

    if (currentIsTwoHandles) {
      if (isNeedRedraw || valueFromChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
        const val = isUsingItemsCurrent ? currentIndexFrom : Number(currentValueFrom);
        const posXWithOutStep = this.convertRelativeValueToPixelValue(val!);
        const posXWithStep = this.getSteppedPos(posXWithOutStep);
        this.moveHandle(this.handleFrom, posXWithStep == null ? posXWithOutStep : posXWithStep);
      }
    }

    if (isNeedRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = isUsingItemsCurrent ? currentIndexTo : Number(currentValueTo);
      const posXWithOutStep = this.convertRelativeValueToPixelValue(val!);
      const posXWithStep = this.getSteppedPos(posXWithOutStep);
      this.moveHandle(this.handleTo, posXWithStep == null ? posXWithOutStep : posXWithStep);
    }

    if (isUsingItemsCurrent) {
      const pxLength = this.line.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues!.length - 1);

      if (currentIsTwoHandles && (isNeedRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom! * pxStep;
        this.moveHandle(this.handleFrom, newPos);
      }

      if (isNeedRedraw || indexToChanged) {
        const newPos = currentIndexTo! * pxStep;
        this.moveHandle(this.handleTo, newPos);
      }
    }
  }

  isEqualArrays(ar1: (string | number)[] | null, ar2: (string | number)[] | null): boolean {
    if (!ar1 || !ar2) return false;
    if (ar1.length !== ar2.length) return false;
    return ar1.every((value, index) => value === ar2[index]);
  }

  private onMouseDownByHandle(e: JQuery.TriggeredEvent) {
    const $el = $(e.target);
    let currentHandle: Handle = this.handleFrom;
    if ($el.is(this.handleTo.el) || $el.is(this.tipTo.el)) currentHandle = this.handleTo;

    currentHandle.setMoving(true);
    const clientPos = this.currentSettings.isVertical ? e.clientY : e.clientX;
    const shiftPos = clientPos! - currentHandle.getOffset();

    this.rangeslider.el.on('mousemove.rangeslider', e => this.onMouseMoveRangeSlider(e, currentHandle, shiftPos));
    const $document = $(document);
    $document.on('mousemove.document', e => this.onMouseMoveRangeSlider(e, currentHandle, shiftPos));
    currentHandle.el.on('mouseup.handle', e => this.onMouseUp(e, currentHandle));

    $document.on('mouseup.document', e => this.onMouseUp(e, currentHandle));
  }

  private onMouseMoveRangeSlider(e: JQuery.TriggeredEvent, currentHandle: Handle, shiftPos: number) {
    const $target = $(e.target);
    const { isVertical } = this.currentSettings;

    const offsetPos = isVertical ? e.offsetY : e.offsetX;
    const targetOffset = isVertical ? $target.offset()!.top : $target.offset()!.left;
    let newPos = this.getSteppedPos(offsetPos! + targetOffset - this.line.getOffset() - this.offsetFrom);

    const clientPos = isVertical ? e.clientY : e.clientX;
    if (newPos == null) newPos = clientPos! - this.line.getOffset() - shiftPos;
    newPos = this.validate(newPos, currentHandle);

    this.onHandlePositionUpdate(currentHandle, newPos);

    return false;
  }

  validate(pos: number, currentHandle: Handle): number {
    let result = pos;
    const lw = this.line.getSize();
    const ch = currentHandle;

    if (this.currentSettings.isTwoHandles) {
      if (ch.is(this.handleFrom) && pos < 0) result = 0;
      if (ch.is(this.handleFrom) && pos > this.handleTo.getPos()) result = this.handleTo.getPos();
      if (ch.is(this.handleTo) && pos > lw - ch.getSize()) result = lw - ch.getSize();
      if (ch.is(this.handleTo) && pos < this.handleFrom.getPos()) result = this.handleFrom.getPos();
    } else {
      if (pos < 0) result = 0;
      if (pos > lw - ch.getSize()) result = lw - ch.getSize();
    }

    return result;
  }

  private onMouseUp(e: JQuery.TriggeredEvent, currentHandle: Handle) {
    currentHandle.setMoving(false);
    this.rangeslider.el.off('mousemove.rangeslider');
    currentHandle.el.off('mouseup.handle');
    $(document).off('mousemove.document');
    $(document).off('mouseup.document');
  }

  private onMouseDownByLine(e: JQuery.TriggeredEvent) {
    e.preventDefault();
    let offsetPos = this.currentSettings.isVertical ? e.offsetY : e.offsetX;
    if (offsetPos! < this.offsetFrom) offsetPos = this.offsetFrom;
    if (offsetPos! > this.line.getSize() - this.offsetTo) {
      offsetPos = this.line.getSize() - this.offsetTo;
    }

    const nearHandle = this.getNearestHandle(offsetPos!);

    let newPos = this.getSteppedPos(offsetPos! - this.offsetFrom);
    if (newPos == null) {
      const offset = nearHandle.is(this.handleFrom) ? this.offsetFrom : this.handleTo.getSize() - this.offsetTo;
      newPos = offsetPos! - offset;
    }
    this.onHandlePositionUpdate(nearHandle, newPos);

    const newEvent = e;
    newEvent.target = nearHandle.el;
    nearHandle.el.trigger(newEvent, 'mousedown.handle');
  }

  getNearestHandle(pos: number): Handle {
    if (this.currentSettings.isTwoHandles) {
      if (pos < this.handleFrom.getPos()) return this.handleFrom;
      if (pos > this.handleTo.getPos()) return this.handleTo;
      const distanceBetweenHandles = this.handleTo.getPos() - this.handleFrom.getPos() - this.handleFrom.getSize();
      const half = this.handleFrom.getPos() + this.handleFrom.getSize() + distanceBetweenHandles / 2;
      if (pos < half) return this.handleFrom;
      return this.handleTo;
    }
    return this.handleTo;
  }

  moveHandle(currentHandle: Handle, pxX: number): HandleMovingResult {
    let { valueFrom, valueTo } = this.currentSettings;

    const values = this.currentSettings.items?.values;
    const isUsingItemsCurrent = values!?.length > 1;

    currentHandle.setPos(pxX);
    let restoreIndex = -1;
    if (isUsingItemsCurrent) {
      const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = lw / (values!.length - 1);
      restoreIndex = Math.round(pxX / pxStep);
      if (currentHandle.is(this.handleFrom)) {
        this.currentSettings.items!.indexFrom = restoreIndex;
        this.currentSettings.valueFrom = values![restoreIndex];
      } else {
        this.currentSettings.items!.indexTo = restoreIndex;
        this.currentSettings.valueTo = values![restoreIndex];
      }
    } else {
      if (currentHandle.is(this.handleFrom)) {
        this.currentSettings.valueFrom = this.convertPixelValueToRelativeValue(pxX);
      } else this.currentSettings.valueTo = this.convertPixelValueToRelativeValue(pxX);
      valueFrom = this.currentSettings.valueFrom;
      valueTo = this.currentSettings.valueTo;
    }

    if (currentHandle.is(this.handleFrom)) {
      this.handleFrom.incZIndex();
      this.handleTo.decZIndex();
    } else {
      this.handleTo.incZIndex();
      this.handleFrom.decZIndex();
    }
    this.drawLineSelected(currentHandle);

    this.tipFrom.setText(valueFrom!);
    this.tipTo.setText(valueTo!);

    const isHandleFrom = currentHandle.is(this.handleFrom);
    return {
      isFromHandle: isHandleFrom,
      value: isHandleFrom ? valueFrom! : valueTo!,
      isUsingItems: isUsingItemsCurrent,
      index: restoreIndex,
    };
  }

  private drawLineSelected(currentHandle: Handle) {
    if (this.currentSettings.isTwoHandles) {
      if (currentHandle.is(this.handleFrom)) {
        this.lineSelected.setPos(this.handleFrom.getPos() + this.offsetFrom);
      }
      this.lineSelected.setSize(
        this.handleTo.getPos() -
          this.handleFrom.getPos() +
          this.handleTo.getSize() -
          this.offsetFrom -
          this.offsetTo +
          1,
      );
    } else {
      this.lineSelected.setSize(currentHandle.getPos() + currentHandle.getSize() - this.offsetTo + 1);
    }
  }

  convertRelativeValueToPixelValue(val: number): number {
    const { items, minValue, maxValue } = this.currentSettings;
    const values = items?.values;
    const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
    const isHasValues = items && values && values.length > 1;
    let result;
    if (isHasValues) {
      const pxStep = lw / (values!.length - 1);
      result = val * pxStep;
    } else {
      const relLength = Number(maxValue!) - Number(minValue!);
      const relPercent = (val - Number(minValue!)) / relLength;
      result = lw * relPercent;
    }
    return result;
  }

  convertPixelValueToRelativeValue(val: number): number {
    const { maxValue, minValue } = this.currentSettings;
    const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
    const percent = val / lw;
    const result = Math.round(Number(minValue!) + percent * (Number(maxValue!) - Number(minValue!)));
    return result;
  }

  getSteppedPos(pxValue: number): number | null {
    const { stepValue, items, maxValue, minValue } = this.currentSettings;
    const values = items?.values;
    const pxLength = this.line.getSize() - this.offsetFrom - this.offsetTo;
    const isDefinedStep = stepValue! > 0;
    const isDefinedSetOfValues = items && values && values.length > 1;
    const isTooLongLine = pxLength > Number(maxValue!) - Number(minValue!);
    const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

    if (isHaveStep) {
      let pxStep: number;

      if (isDefinedStep) {
        pxStep = this.convertRelativeValueToPixelValue(Number(minValue!) + Number(stepValue!));
      }

      if (isTooLongLine) {
        const relativeLength = Number(maxValue!) - Number(minValue!);
        pxStep = pxLength / relativeLength;
        if (isDefinedStep) pxStep *= stepValue!;
      }

      if (isDefinedSetOfValues) {
        pxStep = pxLength / (values!.length - 1);
      }

      const nStep = Math.round(pxValue / pxStep!);
      let newPos = nStep * pxStep!;

      if (pxValue / pxStep! > Math.trunc(pxLength / pxStep!)) {
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
