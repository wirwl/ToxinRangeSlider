import TRSElement from '../entities/element';
import Tip from './tip';
export default class Handle extends TRSElement {
    value: number;
    displayValue: number;
    tip: Tip;
    isMoving: boolean;
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
