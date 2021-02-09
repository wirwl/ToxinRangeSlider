/* eslint-disable import/no-cycle */
import Handle from '../entities/handle';

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

  isVertical(): boolean {
    return this._isVertical;
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

  setVertical(value: boolean): void {
    this._isVertical = value;
    this.$el.removeAttr('style');
  }

  setMoving(value: boolean): void {
    if (value) this.$el.addClass('rangeslider__handle_isMoving');
    else this.$el.removeClass('rangeslider__handle_isMoving');
  }

  is(h: Handle | HandleView): boolean {
    return this.$el.is(h.$el);
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

  getParentElementWidth(): number {
    return parseFloat(this.$parentElement.css('width'));
  }

  getParentElementHeight(): number {
    return parseFloat(this.$parentElement.css('height'));
  }

  getOffset(): number {
    return this.isVertical() ? this.getOffsetTop() : this.getOffsetLeft();
  }

  getY(): number {
    return parseFloat(this.$el.css('top'));
  }

  setY(value: number): void {
    this.$el.css('top', `${(value / this.getParentElementHeight()) * 100}%`);
  }

  getX(): number {
    return parseFloat(this.$el.css('left'));
  }

  setX(value: number): void {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css('left', `${valueInPercent}%`);
  }

  getPos(): number {
    return this.isVertical() ? this.getY() : this.getX();
  }

  setPos(value: number): void {
    if (this.isVertical()) this.setY(value);
    else this.setX(value);
  }

  getHeight(): number {
    return parseFloat(this.$el.css('height'));
  }

  getSize(): number {
    return this.isVertical() ? this.getHeight() : this.getWidth();
  }
}
