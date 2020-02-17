import TRSElement from '../entities/element';
import Tip from './tip';
export default class Handle extends TRSElement {
    value: string | number;
    tip: Tip;
    constructor(el: JQuery<HTMLElement>, tip: Tip) {
        super(el);
        this.tip = tip;
    }
    is(h: Handle): boolean {
        return this.el.is(h.el);
    }
}
