/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable import/no-cycle */

import { ERRORS } from '../const';
import ObservableSubject from '../ObservableSubject';
import DOMOperations from './DOMOperations';
import LineView from './LineView';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class HandleView extends DOMOperations {
  private currentSettings: RangeSliderOptions;

  notifier: ObservableSubject;

  constructor(data: any, private isHandleFrom = false, lineView: LineView) {
    super(data);
    this.currentSettings = data.currentSettings;
    this.notifier = new ObservableSubject();
    this.onMouseDownByHandle = this.onMouseDownByHandle.bind(this);
    this.$el.on('mousedown.handle', e => this.onMouseDownByHandle(e, lineView));
  }

  setMoving(value: boolean): void {
    if (value) this.$el.addClass('rangeslider__handle_isMoving');
    else this.$el.removeClass('rangeslider__handle_isMoving');
  }

  is(h: HandleView): boolean {
    return this.$el.is(h.$el);
  }

  public onMouseDownByHandle(e: JQuery.TriggeredEvent, line: LineView): void {
    this.setMoving(true);
    const clientPos = this.isVertical() ? e.clientY : e.clientX;
    let shiftPos: number;
    try {
      if (clientPos) shiftPos = clientPos - this.getOffset();
      else throw new Error(ERRORS.undefinedValue);
    } catch (e) {
      throw e;
    }

    this.$parentElement.on('mousemove.rangeslider', e => this.onMouseMoveHandle(e, shiftPos, line));

    const $document = $(document);
    $document.on('mousemove.document', e => this.onMouseMoveHandle(e, shiftPos, line));

    this.$parentElement.on('mouseup.handle', e => this.onMouseUp(e, this));
    $document.on('mouseup.document', e => this.onMouseUp(e, this));
  }

  private onMouseUp(e: JQuery.TriggeredEvent, currentHandle: HandleView): void {
    currentHandle.setMoving(false);
    this.$parentElement.off('mousemove.rangeslider');
    currentHandle.$el.off('mouseup.handle');
    $(document).off('mousemove.document');
    $(document).off('mouseup.document');
  }

  private onMouseMoveHandle(e: JQuery.TriggeredEvent, shiftPos: number, line: LineView): boolean {
    const $target = $(e.target);
    const eOffset = this.isVertical() ? e.offsetY : e.offsetX;
    const offsetPos = eOffset || 0;

    const targetOffsetCoord = $target.offset();
    let targetOffset: number;
    try {
      if (targetOffsetCoord) targetOffset = this.isVertical() ? targetOffsetCoord.top : targetOffsetCoord.left;
      else throw new Error(ERRORS.undefinedValue);
    } catch (e) {
      throw e;
    }

    let newPos = this.getSteppedPos(offsetPos + targetOffset - line.getOffset() - 8, line);

    const eClient = this.isVertical() ? e.clientY : e.clientX;
    const clientPos = eClient || 0;

    if (newPos == null) newPos = clientPos - line.getOffset() - shiftPos;

    this.notifier.notify({
      value: newPos,
      handle: this,
    });
    return false;
  }

  public steppedMoveHandle(val: number, lineView: LineView): void {
    const posXWithOutStep = this.convertRelativeValueToPixelValue(val, lineView);
    const posXWithStep = this.getSteppedPos(posXWithOutStep, lineView);
    this.moveHandle(posXWithStep == null ? posXWithOutStep : posXWithStep);
  }

  public moveHandle(pxPos: number): void {
    this.setPos(pxPos);
  }

  public getSteppedPos(pxValue: number, line: LineView): number | null {
    const { stepValue, items, maxValue, minValue } = this.currentSettings;
    const values = items?.values;
    const pxLineLength = line.getSize() - 8 - 8;
    const isDefinedStep = stepValue > 1;
    const isDefinedSetOfValues = items && values && values.length > 1;
    const isTooLongLine = pxLineLength > Number(maxValue) - Number(minValue);
    const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

    if (isHaveStep) {
      let pxStep = 0;

      if (isDefinedStep) {
        const relLineLength = Number(maxValue) - Number(minValue);
        pxStep = (pxLineLength / relLineLength) * stepValue;
        // pxStep = this.convertRelativeValueToPixelValue(Number(minValue) + Number(stepValue), line);
      }

      if (isTooLongLine) {
        const relativeLength = Number(maxValue) - Number(minValue);
        pxStep = pxLineLength / relativeLength;
        if (isDefinedStep) pxStep *= stepValue;
      }

      if (isDefinedSetOfValues) {
        pxStep = pxLineLength / (values.length - 1);
      }

      const nStep = Math.round(pxValue / pxStep);
      let newPos = nStep * pxStep;

      if (pxValue / pxStep > Math.trunc(pxLineLength / pxStep)) {
        const remainder = pxLineLength - newPos;
        if (pxValue > newPos + remainder / 2) newPos += remainder;
      }
      if (newPos > pxLineLength) newPos = pxLineLength;
      return newPos;
    }
    return null;
  }

  public convertPixelValueToRelativeValue(val: number, line: LineView): number {
    const { maxValue, minValue } = this.currentSettings;
    const lineWidth = line.getSize() - 8 - 8;
    const percent = val / lineWidth;
    const result = Math.round(Number(minValue) + percent * (Number(maxValue) - Number(minValue)));
    return result;
  }

  private convertRelativeValueToPixelValue(val: number, line: LineView): number {
    const { items, minValue, maxValue } = this.currentSettings;
    const values = items?.values;
    const lw = line.getSize() - 8 - 8;
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
}
