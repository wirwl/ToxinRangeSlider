import TRSElement from '../entities/element';
class Tip extends TRSElement {
    setText(value: string | number) {
        this.el.text(value);
        this._width = parseFloat(this.el.css('width'));
        this._height = parseFloat(this.el.css('height'));
    }
    getText(): string | number {
        return this.el.text();
    }
}

export default Tip;
