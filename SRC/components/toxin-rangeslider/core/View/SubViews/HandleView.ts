import ObservableSubject from '../../ObservableSubject';
import { SubViewData } from '../../types';
import DOMOperations from '../DOMOperations';

export default class HandleView extends DOMOperations {
  notifier!: ObservableSubject;

  constructor(data: SubViewData) {
    super(data);
    this.bindThis();
    this.init();
    this.addEventListeners();
  }

  private bindThis(): void {
    this.onMouseDownByHandle = this.onMouseDownByHandle.bind(this);
  }

  private init(): void {
    this.notifier = new ObservableSubject();
  }

  private addEventListeners(): void {
    this.$el.on('mousedown.handle', e => this.onMouseDownByHandle(e));
  }

  setMoving(value: boolean): void {
    if (value) this.$el.addClass('rangeslider__handle_isMoving');
    else this.$el.removeClass('rangeslider__handle_isMoving');
  }

  is(h: HandleView): boolean {
    return this.$el.is(h.$el);
  }

  public onMouseDownByHandle(e: JQuery.TriggeredEvent): void {
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

  public moveHandle(pxPos: number): void {
    this.setPos(pxPos);
  }
}
