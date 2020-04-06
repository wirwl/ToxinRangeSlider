import TRSElement from '../entities/element';
class Tip extends TRSElement {
    set text(value: string | number) {
        this.el.text(value);
        this._width = parseFloat(this.el.css('width'));
        this._height = parseFloat(this.el.css('height'));
    }
    get text(): string | number {
        return this.el.text();
    }
}

export default Tip;
