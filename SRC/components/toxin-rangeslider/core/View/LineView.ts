import ObservableSubject from '../ObservableSubject';
import DOMOperations from './DOMOperations';

export default class LineView extends DOMOperations {
  notifier: ObservableSubject = new ObservableSubject();

  constructor(data: SubViewData) {
    super(data);
    this.bindThis();
  }

  private bindThis(): void {
    this.onMouseDownByLine = this.onMouseDownByLine.bind(this);
  }

  public draw(pos: number | false, size: number): void {
    if (pos) this.setPos(pos);
    if (size) this.setSize(size);
  }

  public onMouseDownByLine(event: JQuery.TriggeredEvent): void {
    const eOffset = this.isVertical() ? event.offsetY : event.offsetX;
    if (eOffset) this.notifier.notify({ value: eOffset, event });
  }
}
