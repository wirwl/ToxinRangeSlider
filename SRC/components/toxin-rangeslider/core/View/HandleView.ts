/* eslint-disable @typescript-eslint/no-explicit-any */
export default class HandleView {
  $el: JQuery<HTMLElement>;

  $parentElement: JQuery<HTMLElement>;

  protected _isVertical = false;

  constructor(data: any) {
    this.$parentElement = data.$parentElement;
    this.$el = $(data.domEntity);
    this.appendToDomTree();
  }

  appendToDomTree(): void {
    this.$parentElement.append(this.$el);
  }

  removeFromDomTree(): void {
    this.$el.off();
    this.$el.remove();
  }

  getWidth(): number {
    return parseFloat(this.$el.css('width'));
  }

  setVertical(value: boolean) {
    this._isVertical = value;
    this.$el.removeAttr('style');
  }
}
