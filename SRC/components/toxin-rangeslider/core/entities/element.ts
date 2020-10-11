class TRSElement {
  $el: JQuery<HTMLElement>;

  protected _isVertical = false;

  isVertical(): boolean {
    return this._isVertical;
  }

  setVertical(value: boolean) {
    this._isVertical = value;
    this.$el.removeAttr('style');
  }

  protected _x = 0;

  getX(): number {
    return this._x;
  }

  setX(value: number) {
    this._x = value;
    this.$el.css('left', value);
  }

  protected _right = 0;

  getRight(): number {
    return this._right;
  }

  setRight(value: number) {
    this._right = value;
    this.$el.css('right', value);
  }

  protected _bottom = 0;

  getBottom(): number {
    return this._bottom;
  }

  setBottom(value: number) {
    this._bottom = value;
    this.$el.css('bottom', value);
  }

  private _y = 0;

  getY(): number {
    return this._y;
  }

  setY(value: number) {
    this._y = value;
    this.$el.css('top', value);
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

  protected _width = 0;

  getWidth(): number {
    return this._width;
  }

  setWidth(value: number) {
    this._width = value;
    this.$el.css('width', value);
  }

  protected _height = 0;

  getHeight(): number {
    return this._height;
  }

  setHeight(value: number) {
    this._height = value;
    this.$el.css('height', value);
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
    this.refresh();
  }

  refresh() {
    this._x = parseFloat(this.$el.css('left'));
    this._y = parseFloat(this.$el.css('top'));
    this._width = parseFloat(this.$el.css('width'));
    this._height = parseFloat(this.$el.css('height'));
    this._right = parseFloat(this.$el.css('right'));
    this._bottom = parseFloat(this.$el.css('bottom'));
  }

  appendToDomTree(childElement: TRSElement) {
    this.$el.append(childElement.$el);
  }

  removeFromDomTree() {
    this.$el.remove();
  }
}

export default TRSElement;
