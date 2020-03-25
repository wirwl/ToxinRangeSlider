import TRSElement from '../entities/element';
export default class Tip extends TRSElement {
    set text(value: string | number) {
        this.el.text(value);
        this._width = parseFloat(this.el.css('width'));
        this._height = parseFloat(this.el.css('height'));
    }
    get text(): string | number {
        return this.el.text();
    }
}
