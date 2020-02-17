import TRSElement from '../entities/element';
export default class Tip extends TRSElement {
    //value: string | number;
    set text(value: string | number) {
        //this.value = value;
        this.el.text(value);
        this._width = parseFloat(this.el.css('width'));
        this._height = parseFloat(this.el.css('height'));
    }
    get text(): string | number {
        return this.el.text();
    }
    constructor(el: JQuery<HTMLElement>) {
        super(el);
    }
}
