import ObservableSubject from '../ObservableSubject';
import DOMOperations from './DOMOperations';

// interface StateLineView {
//   isVertical: boolean;
// }

export default class LineView extends DOMOperations {
  notifierUserInput: ObservableSubject = new ObservableSubject();

  constructor({ domEntities, state: { isVertical } }: SubViewData) {
    super({
      domEntities,
      state: { isVertical },
    });
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
    if (eOffset) this.notifierUserInput.notify({ value: eOffset, event });
  }
}
