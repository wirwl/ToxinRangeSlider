import TRSElement from '../entities/element';

export default class Rangeslider extends TRSElement {
    get thickness(): number {
        return this.isVertical ? this.width : this.height;
    }
    set thickness(value: number) {
        if (this.isVertical) {
            this.width = value;
            this.el.css('min-width', value);
        } else {
            this.height = value;
            this.el.css('min-height', value);
        }
    }
    get length(): number {
        return this.isVertical ? this.width : this.height;
    }
    // set length(value: number) {
    //     this.isVertical ? (this.height = value) : (this.width = value);
    // }
    constructor(el: JQuery<HTMLElement>) {
        super(el);
    }
}
