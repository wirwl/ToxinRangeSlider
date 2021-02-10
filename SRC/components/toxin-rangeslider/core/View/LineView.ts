/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import ObservableSubject from '../ObservableSubject';
import DOMOperations from './DOMOperations';
import HandleView from './HandleView';

export default class LineView extends DOMOperations {
  private currentSettings: RangeSliderOptions;

  private offsetFrom = 8;

  private offsetTo = 8;

  publisher: ObservableSubject;

  constructor(data: any, public handleFromView: HandleView, public handleToView: HandleView) {
    super(data);
    this.currentSettings = data.currentSettings;
    this.publisher = new ObservableSubject();
    this.onMouseDownByLine = this.onMouseDownByLine.bind(this);
    // this.getNearestHandle = this.getNearestHandle.bind(this);
  }

  public draw(pos: number | false, size: number): void {
    if (pos) this.setPos(pos);
    if (size) this.setSize(size);
  }

  // private redrawLineSelected(currentHandle: HandleView): void {
  //   const { isTwoHandles } = this.currentSettings;
  //   const isHandleFromMoving = currentHandle.is(this.handleFromView);

  //   const pos = isHandleFromMoving && this.handleFromView.getPos() + this.offsetFrom;
  //   const size = isTwoHandles
  //     ? this.handleToView.getPos() -
  //       this.handleFromView.getPos() +
  //       this.handleToView.getSize() -
  //       this.offsetFrom -
  //       this.offsetTo +
  //       1
  //     : currentHandle.getPos() + currentHandle.getSize() - this.offsetTo + 1;

  //   this.lineSelectedView.draw(pos, size);
  // }

  public onMouseDownByLine(e: JQuery.TriggeredEvent): void {
    e.preventDefault();
    const eOffset = this.currentSettings.isVertical ? e.offsetY : e.offsetX;
    let offsetPos: number;
    try {
      if (eOffset) offsetPos = eOffset;
      else throw Error('Value is undefined. This is not valid value!');
    } catch (e) {
      throw e;
    }

    if (offsetPos < 8) offsetPos = 8;
    if (offsetPos > this.getSize() - 8) {
      offsetPos = this.getSize() - 8;
    }

    const nearHandle: HandleView = this.getNearestHandle(offsetPos);

    let newPos = this.getSteppedPos(offsetPos - this.offsetFrom);
    if (newPos == null) {
      const offset = nearHandle.is(this.handleFromView) ? this.offsetFrom : this.handleToView.getSize() - this.offsetTo;
      newPos = offsetPos - offset;
    }

    nearHandle.moveHandle(newPos, this);
    // this.publisher.notify(handleMovingResult);
    const newEvent = e;
    newEvent.target = nearHandle.$el;
    nearHandle.$el.trigger(newEvent, 'mousedown.handle');
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

  private getSteppedPos(pxValue: number): number | null {
    const { stepValue, items, maxValue, minValue } = this.currentSettings;
    const values = items?.values;
    const pxLength = this.getSize() - this.offsetFrom - this.offsetTo;
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

  private convertRelativeValueToPixelValue(val: number): number {
    const { items, minValue, maxValue } = this.currentSettings;
    const values = items?.values;
    const lw = this.getSize() - this.offsetFrom - this.offsetTo;
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
