import TRSElement from '../entities/element';
import Tip from './tip';
export default class Handle extends TRSElement {
    set isMoving(value: boolean) {
        if (value) this.el.addClass('rangeslider__handle_isMoving');
        else this.el.removeClass('rangeslider__handle_isMoving');
    }
    tip: Tip;
    constructor(el: JQuery<HTMLElement>, tip: Tip) {
        super(el);
        this.tip = tip;
    }
    is(h: Handle): boolean {
        return this.el.is(h.el);
    }
    incZIndex(value = 99) {
        this.el.css('z-index', value);
    }
    decZIndex(value = 11) {
        this.el.css('z-index', value);
    }
}
