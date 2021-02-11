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

  notifierNearestHandle: ObservableSubject;

  notifierModel: ObservableSubject;

  constructor(data: any, public handleFromView: HandleView, public handleToView: HandleView) {
    super(data);

    this.currentSettings = data.currentSettings;

    this.notifierNearestHandle = new ObservableSubject();
    this.notifierModel = new ObservableSubject();

    this.onMouseDownByLine = this.onMouseDownByLine.bind(this);
  }

  public draw(pos: number | false, size: number): void {
    if (pos) this.setPos(pos);
    if (size) this.setSize(size);
  }

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

    // const nearHandle: HandleView = this.getNearestHandle(offsetPos);

    // let newPos = this.getSteppedPos(offsetPos - this.offsetFrom);
    // if (newPos == null) {
    //   const offset = nearHandle.is(this.handleFromView) ? this.offsetFrom : this.handleToView.getSize() - this.offsetTo;
    //   newPos = offsetPos - offset;
    // }

    this.notifierNearestHandle.notify({ offsetPos });
    // nearHandle.moveHandle(newPos, this);
    // const newEvent = e;
    // newEvent.target = nearHandle.$el;
    // nearHandle.$el.trigger(newEvent, 'mousedown.handle');
  }
}
