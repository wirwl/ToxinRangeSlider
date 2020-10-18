class TRSElement {
  $parentElement: JQuery<HTMLElement>;

  $el: JQuery<HTMLElement>;

  protected _isVertical = false;

  getParentElementWidth(): number {
    return parseFloat(this.$parentElement.css('width'));
  }

  getParentElementHeight(): number {
    return parseFloat(this.$parentElement.css('height'));
  }

  isVertical(): boolean {
    return this._isVertical;
  }

  setVertical(value: boolean): void {
    this._isVertical = value;
    this.$el.removeAttr('style');
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

  getY(): number {
    return parseFloat(this.$el.css('top'));
  }

  setY(value: number): void {
    this.$el.css('top', `${(value / this.getParentElementHeight()) * 100}%`);
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

  getOffset(): number {
    return this.isVertical() ? this.getOffsetTop() : this.getOffsetLeft();
  }

  getPos(): number {
    return this.isVertical() ? this.getY() : this.getX();
  }

  setPos(value: number): void {
    if (this.isVertical()) this.setY(value);
    else this.setX(value);
  }

  getWidth(): number {
    return parseFloat(this.$el.css('width'));
  }

  getHeight(): number {
    return parseFloat(this.$el.css('height'));
  }

  setHeight(value: number): void {
    this.$el.css('height', `${(value / this.getParentElementHeight()) * 100}%`);
  }

  getSize(): number {
    return this.isVertical() ? this.getHeight() : this.getWidth();
  }

  setSize(value: number): void {
    if (this.isVertical()) this.setHeight(value);
    else this.setWidth(value);
  }

  constructor(el: JQuery<HTMLElement>) {
    this.$el = el;
    this.$parentElement = this.$el.parent();
  }

  appendToDomTree(childElement: TRSElement): void {
    this.$el.append(childElement.$el);
  }

  removeFromDomTree(): void {
    this.$el.off();
    this.$el.remove();
  }
}

export default TRSElement;
