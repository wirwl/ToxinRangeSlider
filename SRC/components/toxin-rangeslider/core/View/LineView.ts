/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export default class LineView {
  $el: JQuery<HTMLElement>;

  $parentElement: JQuery<HTMLElement>;

  protected _isVertical = false;

  constructor(data: any) {
    this.$parentElement = data.$parentElement;
    this.$el = $(data.domEntity);
    this.appendToDomTree();
  }

  public draw(pos: number | false, size: number): void {
    if (pos) this.setPos(pos);
    if (size) this.setSize(size);
  }

  setVertical(value: boolean) {
    this._isVertical = value;
    this.$el.removeAttr('style');
  }

  isVertical(): boolean {
    return this._isVertical;
  }

  getWidth(): number {
    return parseFloat(this.$el.css('width'));
  }

  getHeight(): number {
    return parseFloat(this.$el.css('height'));
  }

  getSize(): number {
    return this.isVertical() ? this.getHeight() : this.getWidth();
  }

  getOffset(): number {
    return this.isVertical() ? this.getOffsetTop() : this.getOffsetLeft();
  }

  getOffsetTop(): number {
    let result: number;
    try {
      const offset = this.$el.offset();
      if (!offset)
        throw new Error('Offset method return undefined value. Can not get top property value from offset method!');
      result = offset.top;
    } catch (e) {
      throw e;
    }
    return result;
  }

  getOffsetLeft(): number {
    let result: number;
    try {
      const offset = this.$el.offset();
      if (!offset)
        throw new Error('Offset method return undefined value. Can not get left property value from offset method!');
      result = offset.left;
    } catch (e) {
      throw e;
    }
    return result;
  }

  appendToDomTree(): void {
    this.$parentElement.append(this.$el);
  }

  removeFromDomTree(): void {
    this.$el.off();
    this.$el.remove();
  }

  getParentElementWidth(): number {
    return parseFloat(this.$parentElement.css('width'));
  }

  getParentElementHeight(): number {
    return parseFloat(this.$parentElement.css('height'));
  }

  getX(): number {
    return parseFloat(this.$el.css('left'));
  }

  setX(value: number): void {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css('left', `${valueInPercent}%`);
  }

  setWidth(value: number): void {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css('width', `${valueInPercent}%`);
  }

  setHeight(value: number): void {
    this.$el.css('height', `${(value / this.getParentElementHeight()) * 100}%`);
  }

  getY(): number {
    return parseFloat(this.$el.css('top'));
  }

  setY(value: number): void {
    this.$el.css('top', `${(value / this.getParentElementHeight()) * 100}%`);
  }

  setPos(value: number): void {
    if (this.isVertical()) this.setY(value);
    else this.setX(value);
  }

  setSize(value: number): void {
    if (this.isVertical()) this.setHeight(value);
    else this.setWidth(value);
  }
}
