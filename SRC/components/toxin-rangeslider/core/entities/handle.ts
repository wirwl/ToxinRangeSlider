import TRSElement from '../entities/element';
import Tip from './tip';
export default class Handle extends TRSElement {
    //value: number | string;
    //index: number;
    //displayValue: number | string;
    tip: Tip;
    constructor(el: JQuery<HTMLElement>, tip: Tip) {
        super(el);
        this.tip = tip;
        el[0].ondragstart = function() {
            return false;
        };
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
