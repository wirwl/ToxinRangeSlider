import TRSElement from '../entities/element';
import Tip from './tip';
import Handle from './handle';
import Line from './line';
export default class Rangeslider extends TRSElement {
    public controls: (Tip | Handle | Line)[];

    private _isInterval = false;
    get isInterval(): boolean {
        return this._isInterval;
    }
    set isInterval(value: boolean) {
        this._isInterval = value;
        this.el.find('.rangeslider__line-selected').removeAttr('style');
        value ? this.el.removeClass('rangeslider_one-handle') : this.el.addClass('rangeslider_one-handle');
    }

    protected _isVertical = false;
    get isVertical(): boolean {
        return this._isVertical;
    }
    set isVertical(value: boolean) {
        this._isVertical = value;
        value ? this.el.addClass('rangeslider_is-vertical') : this.el.removeClass('rangeslider_is-vertical');
        this.controls.forEach(val => {
            val.isVertical = value;
            val.refresh();
        });
    }

    get thickness(): number {
        return this.isVertical ? this.width : this.height;
    }
    set thickness(value: number) {
        if (this.isVertical) {
            this._width = value;
            this.el.css('width', value);
        } else {
            this._height = value;
            this.el.css('height', value);
        }
    }
    get length(): number {
        return this.isVertical ? this.height : this.width;
    }

    constructor(el: JQuery<HTMLElement>) {
        super(el);
    }
    addControls(controls: (Tip | Handle | Line)[]) {
        this.controls = controls;
    }
}
