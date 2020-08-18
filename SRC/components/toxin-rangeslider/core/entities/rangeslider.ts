import TRSElement from './element';
import Tip from './tip';
import Handle from './handle';
import Line from './line';

class Rangeslider extends TRSElement {
  public controls: (Tip | Handle | Line)[];

  private _isInterval = false;

  getIsInterval(): boolean {
    return this._isInterval;
  }

  setIsInterval(value: boolean) {
    this._isInterval = value;
    this.el.find('.rangeslider__line-selected').removeAttr('style');
    if (value) this.el.removeClass('rangeslider_one-handle');
    else this.el.addClass('rangeslider_one-handle');
  }

  protected _isVertical = false;

  getIsVertical(): boolean {
    return this._isVertical;
  }

  setIsVertical(value: boolean) {
    this._isVertical = value;
    if (value) this.el.addClass('rangeslider_is-vertical');
    else this.el.removeClass('rangeslider_is-vertical');
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
