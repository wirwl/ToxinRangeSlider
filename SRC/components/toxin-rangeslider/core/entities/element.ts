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

  setVertical(value: boolean) {
    this._isVertical = value;
    this.$el.removeAttr('style');
  }

  getX(): number {
    return parseFloat(this.$el.css('left'));
  }

  setX(value: number) {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css('left', `${valueInPercent}%`);
  }

  setWidth(value: number) {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css('width', `${valueInPercent}%`);
  }

  getY(): number {
    return parseFloat(this.$el.css('top'));
  }

  setY(value: number) {
    this.$el.css('top', `${(value / this.getParentElementHeight()) * 100}%`);
  }

  getOffsetTop(): number {
    return this.$el.offset()!.top;
  }

  getOffsetLeft(): number {
    return this.$el.offset()!.left;
  }

  getOffset(): number {
    return this.isVertical() ? this.getOffsetTop() : this.getOffsetLeft();
  }

  getPos(): number {
    return this.isVertical() ? this.getY() : this.getX();
  }

  setPos(value: number) {
    if (this.isVertical()) this.setY(value);
    else this.setX(value);
  }

  getWidth(): number {
    return parseFloat(this.$el.css('width'));
  }

  getHeight(): number {
    return parseFloat(this.$el.css('height'));
  }

  setHeight(value: number) {
    this.$el.css('height', `${(value / this.getParentElementHeight()) * 100}%`);
  }

  getSize(): number {
    return this.isVertical() ? this.getHeight() : this.getWidth();
  }

  setSize(value: number) {
    if (this.isVertical()) this.setHeight(value);
    else this.setWidth(value);
  }

  constructor(el: JQuery<HTMLElement>) {
    this.$el = el;
    this.$parentElement = this.$el.parent();
  }

  appendToDomTree(childElement: TRSElement) {
    this.$el.append(childElement.$el);
  }

  removeFromDomTree() {
    this.$el.off();
    this.$el.remove();
  }
}

export default TRSElement;
