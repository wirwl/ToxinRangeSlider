import { HttpMethod } from 'puppeteer';

export default class Handle {
    private el: JQuery<HTMLElement>;
    isVertical = false;

    get pos(): number {
        return this.isVertical ? this.y : this.x;
    }
    set pos(value: number) {
        this.isVertical ? (this.x = value) : (this.y = value);
    }

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

    private _width: number;
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        this._width = value;
        this.el.css('width', value);
    }

    private _height: number;
    get heigth(): number {
        return this._height;
    }
    set height(value: number) {
        this._height = value;
        this.el.css('height', value);
    }

    constructor(el: JQuery<HTMLElement>) {
        this.el = el;
        this._x = parseFloat(el.css('left'));
        this._y = parseFloat(el.css('top'));
        this._width = parseFloat(el.css('width'));
        this._height = parseFloat(el.css('height'));
    }
}
