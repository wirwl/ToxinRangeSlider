import TRSElement from './element';

class Tip extends TRSElement {
  setText(value: string | number) {
    this.$el.text(value);
  }

  getText(): string | number {
    return this.$el.text();
  }
}

export default Tip;
