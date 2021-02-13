/* eslint-disable @typescript-eslint/no-explicit-any */
export default class DOMOperations {
  $el!: JQuery<HTMLElement>;

  $parentElement!: JQuery<HTMLElement>;

  state!: AnySubViewState;

  protected _isVertical = false;

  constructor(data: ParentSubViewData) {
    this.initSubView(data);
  }

  private initSubView({ domEntities: { domEntity, $parentElement }, state }: ParentSubViewData): void {
    this.$el = $(domEntity);
    this.$parentElement = $parentElement;
    this.initState(state);

    this.appendToDomTree();
  }

  private initState(state: AnySubViewState): void {
    this.state = { ...state };
  }

  updateState(state: AnySubViewState): void {
    this.state = { ...this.state, ...state };
  }

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
    return this.$el.offset()?.top || 0;
  }

  getOffsetLeft(): number {
    return this.$el.offset()?.left || 0;
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

  appendToDomTree(): void {
    this.$parentElement.append(this.$el);
  }

  removeFromDomTree(): void {
    this.$el.off();
    this.$el.remove();
  }
}
