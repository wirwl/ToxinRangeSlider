import Handle from './entities/handle';
import Tip from './entities/tip';
import Line from './entities/line';
import Rangeslider from './entities/rangeslider';
import CRangeSliderOptions from './entities/crangeslideroptions';

class TRSView {
  currentSettings: CRangeSliderOptions;

  private offsetFrom: number;

  private offsetTo: number;

  private htmlTemplate = `<div class='rangeslider'>
        <div class='rangeslider__tip-min'>00</div>
        <div class='rangeslider__tip rangeslider__tip-from'>23</div>
        <div class='rangeslider__tip rangeslider__tip-to'>456</div>
        <div class='rangeslider__tip-max'>99</div>
        <div class='rangeslider__line'></div>
        <div class='rangeslider__line-selected'></div>
        <div class='rangeslider__handle rangeslider__handle-from'></div>
        <div class='rangeslider__handle rangeslider__handle-to'></div>
        </div>`;

  el: JQuery<Element>;

  rangeslider: Rangeslider;

  onHandlePositionUpdate: Function;

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
    this.line.el.on('mousedown.line', e => this.onMouseDownByLine(e));

    this.lineSelected = new Line(this.rangeslider.el.find('.rangeslider__line-selected'));

    this.data = el.data('options');
    this.tipFrom = new Tip(el.find('.rangeslider__tip-from'));
    this.tipTo = new Tip(el.find('.rangeslider__tip-to'));
    this.tipMin = new Tip(el.find('.rangeslider__tip-min'));
    this.tipMax = new Tip(el.find('.rangeslider__tip-max'));

    this.handleFrom = new Handle(this.rangeslider.el.find('.rangeslider__handle-from'));
    this.handleFrom.el.on('mousedown.handleFrom', e => this.onMouseDownByHandle(e));
    this.offsetFrom = this.handleFrom.getWidth() / 2;

    this.handleTo = new Handle(this.rangeslider.el.find('.rangeslider__handle-to'));
    this.handleTo.el.on('mousedown.handleTo', e => this.onMouseDownByHandle(e));
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
    this.currentSettings = new CRangeSliderOptions();
  }

  drawSlider(oldSettings: CRangeSliderOptions, newSettings: CRangeSliderOptions) {
    const {
      getMinValue: oldGetMinValue,
      getMaxValue: oldGetMaxValue,
      getValueFrom: oldGetValueFrom,
      getValueTo: oldGetValueTo,
      isVertical: oldIsVertical,
      isTip: oldIsTip,
      isTwoHandles: oldIsTwoHandles,
      items: { indexFrom: oldIndexFrom, indexTo: oldIndexTo, values: oldValues },
    } = oldSettings;

    this.currentSettings.extend(newSettings);
    const {
      getMinValue: currentGetMinValue,
      getMaxValue: currentGetMaxValue,
      getValueFrom: currentGetValueFrom,
      getValueTo: currentGetValueTo,
      IsHaveItems: currentIsHaveItems,
      isVertical: currentIsVertical,
      isTip: currentIsTip,
      isTwoHandles: currentIsTwoHandles,
      items: { indexFrom: currentIndexFrom, indexTo: currentIndexTo, values: currentValues },
    } = this.currentSettings;

    const { setIsVertical, setIsTwoHandles: setIsInterval } = this.rangeslider;

    const isVerticalChanged = currentIsVertical !== oldIsVertical;
    const isTwoHandlesChanged = currentIsTwoHandles !== oldIsTwoHandles;
    const isTipChanged = currentIsTip !== oldIsTip;
    const minValueChanged = oldGetMinValue() !== currentGetMinValue();
    const maxValueChanged = oldGetMaxValue() !== currentGetMaxValue();
    const valueFromChanged = oldGetValueFrom() !== currentGetValueFrom();
    const valueToChanged = oldGetValueTo() !== currentGetValueTo();
    const indexFromChanged = currentIndexFrom !== oldIndexFrom;
    const indexToChanged = currentIndexTo !== oldIndexTo;
    let isNeedRedraw = false;

    if (isVerticalChanged) {
      setIsVertical(currentIsVertical);
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTwoHandlesChanged) {
      setIsInterval(currentIsTwoHandles);
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
      this.tipMin.setText(currentGetMinValue());
    }

    if (isNeedRedraw || maxValueChanged) {
      this.tipMax.setText(currentGetMaxValue());
    }

    const isItemValuesChanged = !this.isEqualArrays(oldValues, currentValues);
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
        const val = currentIsHaveItems() ? currentIndexFrom : (currentGetValueFrom() as number);
        const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
        const posXWithStep = this.getSteppedPos(posXWithOutStep);
        this.moveHandle(this.handleFrom, posXWithStep == null ? posXWithOutStep : posXWithStep);
      }
    }

    if (isNeedRedraw || valueToChanged || minValueChanged || maxValueChanged || isItemValuesChanged) {
      const val = currentIsHaveItems() ? currentIndexTo : (currentGetValueTo() as number);
      const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
      const posXWithStep = this.getSteppedPos(posXWithOutStep);
      this.moveHandle(this.handleTo, posXWithStep == null ? posXWithOutStep : posXWithStep);
    }

    if (currentIsHaveItems()) {
      const pxLength = this.line.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues.length - 1);

      if (currentIsTwoHandles && (isNeedRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom * pxStep;
        this.moveHandle(this.handleFrom, newPos);
      }

      if (isNeedRedraw || indexToChanged) {
        const newPos = currentIndexTo * pxStep;
        this.moveHandle(this.handleTo, newPos);
      }
    }
  }

  isEqualArrays(ar1: (string | number)[], ar2: (string | number)[]): boolean {
    if (!ar1 || !ar2) return false;
    if (ar1.length !== ar2.length) return false;
    return ar1.every((value, index) => value === ar2[index]);
  }

  onMouseDownByHandle(e: JQuery.TriggeredEvent) {
    const currentHandle: Handle = $(e.target).is(this.handleFrom.el) ? this.handleFrom : this.handleTo;
    currentHandle.setIsMoving(true);
    const clientPos = this.currentSettings.isVertical ? e.clientY : e.clientX;
    const shiftPos = clientPos - currentHandle.getOffset();

    this.rangeslider.el.on('mousemove.rangeslider', e => this.onMouseMove(e, currentHandle, shiftPos));
    const $document = $(document);
    $document.on('mousemove.document', e => this.onMouseMove(e, currentHandle, shiftPos));
    currentHandle.el.on('mouseup.handle', e => this.onMouseUp(e, currentHandle));
    $document.on('mouseup.document', e => this.onMouseUp(e, currentHandle));
  }

  onMouseMove(e: JQuery.TriggeredEvent, currentHandle: Handle, shiftPos: number) {
    const $target = $(e.target);
    const { isVertical } = this.currentSettings;

    const offsetPos = isVertical ? e.offsetY : e.offsetX;
    const targetOffset = isVertical ? $target.offset().top : $target.offset().left;
    let newPos = this.getSteppedPos(offsetPos + targetOffset - this.line.getOffset() - this.offsetFrom);

    const clientPos = isVertical ? e.clientY : e.clientX;
    if (newPos == null) newPos = clientPos - this.line.getOffset() - shiftPos;
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

  onMouseUp(e: JQuery.TriggeredEvent, currentHandle: Handle) {
    currentHandle.setIsMoving(false);
    this.rangeslider.el.off('mousemove.rangeslider');
    currentHandle.el.off('mouseup.handle');
    $(document).off('mousemove.document');
    $(document).off('mouseup.document');
  }

  onMouseDownByLine(e: JQuery.TriggeredEvent) {
    e.preventDefault();
    let offsetPos = this.currentSettings.isVertical ? e.offsetY : e.offsetX;

    if (offsetPos < this.offsetFrom) offsetPos = this.offsetFrom;
    if (offsetPos > this.line.getSize() - this.offsetTo) {
      offsetPos = this.line.getSize() - this.offsetTo;
    }

    const nearHandle = this.getNearestHandle(offsetPos);

    let newPos = this.getSteppedPos(offsetPos - this.offsetFrom);
    if (newPos == null) {
      const offset = nearHandle.is(this.handleFrom) ? this.offsetFrom : this.handleTo.getSize() - this.offsetTo;
      newPos = offsetPos - offset;
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
    const {
      IsHaveItems,
      items: { values },
      getValueFrom,
      getValueTo,
      setValueFrom,
      setValueTo,
    } = this.currentSettings;

    currentHandle.setPos(pxX);
    let restoreIndex = -1;
    if (IsHaveItems()) {
      const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = lw / (values.length - 1);
      restoreIndex = Math.round(pxX / pxStep);
      if (currentHandle.is(this.handleFrom)) this.currentSettings.items.indexFrom = restoreIndex;
      else this.currentSettings.items.indexTo = restoreIndex;
    } else if (currentHandle.is(this.handleFrom)) {
      setValueFrom(this.convertPixelValueToRelativeValue(pxX));
    } else setValueTo(this.convertPixelValueToRelativeValue(pxX));

    if (currentHandle.is(this.handleFrom)) {
      this.handleFrom.incZIndex();
      this.handleTo.decZIndex();
    } else {
      this.handleTo.incZIndex();
      this.handleFrom.decZIndex();
    }
    this.drawLineSelected(currentHandle);
    this.drawTips();

    const isHandleFrom = currentHandle.is(this.handleFrom);
    return {
      isFromHandle: isHandleFrom,
      value: isHandleFrom ? getValueFrom() : getValueTo(),
      isUsingItems: IsHaveItems(),
      index: restoreIndex,
    };
  }

  drawLineSelected(currentHandle: Handle) {
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

  drawTips() {
    const {
      isTwoHandles,
      isTip,
      IsHaveItems,
      items: { indexFrom, indexTo },
      getValueFrom,
      getValueTo,
    } = this.currentSettings;

    this.tipFrom.setText(getValueFrom());
    this.tipTo.setText(getValueTo());

    this.tipFrom.setPos(this.handleFrom.getPos() + (this.handleFrom.getSize() - this.tipFrom.getSize()) / 2);
    this.tipTo.setPos(this.handleTo.getPos() + (this.handleTo.getSize() - this.tipTo.getSize()) / 2);

    if (isTwoHandles) {
      const distanceBetweenHandles = this.tipTo.getPos() - this.tipFrom.getPos() - this.tipFrom.getSize();
      if (distanceBetweenHandles < 1) {
        this.tipTo.hide();
        this.tipFrom.setText(`${this.tipFrom.getText()}-${this.tipTo.getText()}`);
        this.tipFrom.setPos(
          this.handleFrom.getPos() +
            (this.handleTo.getPos() - this.handleFrom.getPos() + this.handleTo.getSize() - this.tipFrom.getSize()) / 2,
        );
      } else if (isTip) this.tipTo.show();
      if ((!IsHaveItems() && getValueFrom() === getValueTo()) || (IsHaveItems() && indexFrom === indexTo)) {
        this.tipFrom.setText(getValueFrom());
        this.tipFrom.setPos(this.handleFrom.getPos() + (this.handleFrom.getSize() - this.tipFrom.getSize()) / 2);
      }
    }

    if (isTip) {
      const tax = this.line.getSize() - this.tipMax.getSize();
      let distanceMin = this.tipFrom.getPos() - this.tipMin.getSize();
      const distanceMax = tax - this.tipTo.getPos() - this.tipTo.getSize();
      let distanceBetweenTipFromAndTipMax = 1;
      distanceBetweenTipFromAndTipMax = tax - this.tipFrom.getPos() - this.tipFrom.getSize();
      if (distanceMin < 1) this.tipMin.hide();
      else this.tipMin.show();
      if (distanceMax < 1) this.tipMax.hide();
      else this.tipMax.show();
      if (distanceBetweenTipFromAndTipMax < 1) this.tipMax.hide();

      if (!isTwoHandles) {
        distanceMin = this.tipTo.getPos() - this.tipMin.getSize();
        if (distanceMin < 1) this.tipMin.hide();
        else this.tipMin.show();
      }
    }
  }

  convertRelativeValueToPixelValue(val: number): number {
    const {
      items,
      items: { values },
      getMaxValue,
      getMinValue,
    } = this.currentSettings;
    const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
    const isHasValues = items && values && values.length > 1;
    let result;
    if (isHasValues) {
      const pxStep = lw / (values.length - 1);
      result = val * pxStep;
    } else {
      const relLength = (getMaxValue() as number) - (getMinValue() as number);
      const relPercent = (val - (getMinValue() as number)) / relLength;
      result = lw * relPercent;
    }
    return result;
  }

  convertPixelValueToRelativeValue(val: number): number {
    const { getMaxValue, getMinValue } = this.currentSettings;
    const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
    const percent = val / lw;
    const result = Math.round(
      (getMinValue() as number) + percent * ((getMaxValue() as number) - (getMinValue() as number)),
    );
    return result;
  }

  getSteppedPos(pxValue: number): number {
    const {
      stepValue,
      items,
      items: { values },
      getMaxValue,
      getMinValue,
    } = this.currentSettings;
    const pxLength = this.line.getSize() - this.offsetFrom - this.offsetTo;
    const isDefinedStep = stepValue > 0;
    const isDefinedSetOfValues = items && values && values.length > 1;
    const isTooLongLine = pxLength > (getMaxValue() as number) - (getMinValue() as number);
    const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

    if (isHaveStep) {
      let pxStep: number;

      if (isDefinedStep) {
        pxStep = this.convertRelativeValueToPixelValue((getMinValue() as number) + stepValue);
      }

      if (isTooLongLine) {
        const relativeLength = (getMaxValue() as number) - (getMinValue() as number);
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
