export default class TRSElement {
    el: JQuery<HTMLElement>;
    isVertical = false;

    protected _x: number;
    get x(): number {
        return this._x;
    }
    set x(value: number) {
        this._x = value;
        this.el.css('left', value);
        this.el.css('right', 'auto');
    }

    protected _right: number;
    get right(): number {
        return this._right;
    }
    set right(value: number) {
        this._right = value;
        this.el.css('right', value);
        this.el.css('left', 'auto');
    }

    protected _bottom: number;
    get bottom(): number {
        return this._bottom;
    }
    set bottom(value: number) {
        this._bottom = value;
        this.el.css('bottom', value);
        this.el.css('top', 'auto');
    }

    private _y: number;
    get y(): number {
        return this._y;
    }
    set y(value: number) {
        this._y = value;
        this.el.css('top', value);
    }

    get offsetTop(): number {
        return this.el.offset().top;
    }

    get offsetLeft(): number {
        return this.el.offset().left;
    }

    get offset(): number {
        return this.isVertical ? this.offsetTop : this.offsetLeft;
    }

    get pos(): number {
        return this.isVertical ? this.y : this.x;
    }
    set pos(value: number) {
        this.isVertical ? (this.y = value) : (this.x = value);
    }

    protected _width: number;
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        this._width = value;
        this.el.css('width', value);
    }

    protected _height: number;
    get height(): number {
        return this._height;
    }
    set height(value: number) {
        this._height = value;
        this.el.css('height', value);
    }

    get size(): number {
        return this.isVertical ? this.height : this.width;
    }
    set size(value: number) {
        this.isVertical ? (this.height = value) : (this.width = value);
    }

    constructor(el: JQuery<HTMLElement>) {
        this.el = el;
        this._x = parseFloat(el.css('left'));
        this._y = parseFloat(el.css('top'));
        this._width = parseFloat(el.css('width'));
        this._height = parseFloat(el.css('height'));
        this._right = parseFloat(el.css('right'));
        this._bottom = parseFloat(el.css('bottom'));
    }

    show() {
        this.el.show();
    }
    hide() {
        this.el.hide();
    }
}
