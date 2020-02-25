export default class TRSElement {
    el: JQuery<HTMLElement>;
    isVertical = false;

    private _x: number;
    get x(): number {
        return this._x;
    }
    set x(value: number) {
        this._x = value;
        this.el.css('left', value);
    }

    private _y: number;
    get y(): number {
        return this._y;
    }
    set y(value: number) {
        this._y = value;
        this.el.css('top', value);
    }

    get thickness(): number {
        return this.isVertical ? this.y : this.x;
    }
    set thickness(value: number) {
        this.isVertical ? (this.x = value) : (this.y = value);
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
    get heigth(): number {
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
    }

    show() {
        this.el.show();
    }
    hide() {
        this.el.hide();
    }
}
