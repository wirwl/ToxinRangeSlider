import TRSElement from '../entities/element';
import Tip from './tip';
import Handle from './handle';
import Line from './line';
class Rangeslider extends TRSElement {
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
            val.setIsVertical(value);
            val.refresh();
        });
    }

    constructor(el: JQuery<HTMLElement>) {
        super(el);
        el.on('dragstart', e => e.preventDefault());
    }

    addControls(controls: (Tip | Handle | Line)[]) {
        this.controls = controls;
    }
}

export default Rangeslider;
