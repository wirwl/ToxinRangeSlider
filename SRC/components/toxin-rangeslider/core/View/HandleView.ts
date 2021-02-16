/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ObservableSubject from '../ObservableSubject';
import DOMOperations from './DOMOperations';
import LineView from './LineView';

export default class HandleView extends DOMOperations {
  notifier!: ObservableSubject;

  constructor(data: SubViewData) {
    super(data);
    this.bindThis();
    this.init();
  }

  private bindThis(): void {
    this.onMouseDownByHandle = this.onMouseDownByHandle.bind(this);
  }

  private init(): void {
    this.notifier = new ObservableSubject();
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
    if (!clientPos) return;
    const shiftPos: number = clientPos - this.getOffset();

    this.$parentElement.on('mousemove.rangeslider', e => this.onMouseMoveHandle(e, shiftPos));

    const $document = $(document);
    $document.on('mousemove.document', e => this.onMouseMoveHandle(e, shiftPos));

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

  private onMouseMoveHandle(e: JQuery.TriggeredEvent, shiftPos: number): void {
    e.preventDefault();
    const eClient = this.isVertical() ? e.clientY : e.clientX;
    if (!eClient) return;
    const newPos = eClient - shiftPos;

    this.notifier.notify({
      value: newPos,
      handle: this,
    });
  }

  // public steppedMoveHandle(val: number, lineWidth: number, state: RangeSliderOptions): void {
  //   const posXWithOutStep = this.convertRelativeValueToPixelValue(val, lineWidth, state);
  //   const posXWithStep = this.getSteppedPos(posXWithOutStep, lineWidth, state);
  //   this.moveHandle(posXWithStep === null ? posXWithOutStep : posXWithStep);
  // }

  public moveHandle(pxPos: number): void {
    this.setPos(pxPos);
  }

  // public getSteppedPos(pxValue: number, pxLineLength: number, state: RangeSliderOptions): number | null {
  //   const { stepValue, items, maxValue, minValue } = state;
  //   const values = items?.values;
  //   const isDefinedStep = stepValue > 1;
  //   const isDefinedSetOfValues = items && values && values.length > 1;
  //   const isTooLongLine = pxLineLength > Number(maxValue) - Number(minValue);
  //   const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

  //   if (isHaveStep) {
  //     let pxStep = 0;

  //     if (isDefinedStep) {
  //       const relLineLength = Number(maxValue) - Number(minValue);
  //       pxStep = (pxLineLength / relLineLength) * stepValue;
  //     }

  //     if (isTooLongLine) {
  //       const relativeLength = Number(maxValue) - Number(minValue);
  //       pxStep = pxLineLength / relativeLength;
  //       if (isDefinedStep) pxStep *= stepValue;
  //     }

  //     if (isDefinedSetOfValues) {
  //       pxStep = pxLineLength / (values.length - 1);
  //     }

  //     const nStep = Math.round(pxValue / pxStep);
  //     let newPos = nStep * pxStep;

  //     if (pxValue / pxStep > Math.trunc(pxLineLength / pxStep)) {
  //       const remainder = pxLineLength - newPos;
  //       if (pxValue > newPos + remainder / 2) newPos += remainder;
  //     }
  //     if (newPos > pxLineLength) newPos = pxLineLength;
  //     return newPos;
  //   }
  //   return null;
  // }

  public convertPixelValueToRelativeValue(val: number, lineWidth: number, state: RangeSliderOptions): number | string {
    let result: number | string;
    const { items, maxValue, minValue } = state;
    const values = items?.values;
    const isUsingItemsCurrent = items && values && values.length > 1;
    let restoreIndex = -1;

    if (isUsingItemsCurrent) {
      const pxStep = lineWidth / (items.values.length - 1);
      restoreIndex = Math.round(val / pxStep);
      result = values[restoreIndex];
    } else {
      const percent = val / lineWidth;
      result = Math.round(Number(minValue) + percent * (Number(maxValue) - Number(minValue)));
    }
    return result;
  }

  convertRelativeValueToPixelValue(val: number, lineWidth: number, state: RangeSliderOptions): number {
    const { items, minValue, maxValue } = state;
    const values = items?.values;
    const isHasValues = items && values && values.length > 1;
    let result;
    if (isHasValues) {
      const pxStep = lineWidth / (values.length - 1);
      result = val * pxStep;
    } else {
      const relLength = Number(maxValue) - Number(minValue);
      const relPercent = (val - Number(minValue)) / relLength;
      result = lineWidth * relPercent;
    }
    return result;
  }
}
