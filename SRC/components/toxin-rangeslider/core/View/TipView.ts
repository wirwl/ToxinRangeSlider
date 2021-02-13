import DOMOperations from './DOMOperations';

export default class TipView extends DOMOperations {
  setText(value: string | number): void {
    this.$el.text(value);
  }

  getText(): string | number {
    return this.$el.text();
  }
}
