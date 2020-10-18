import TRSElement from './element';
import Tip from './tip';
import Handle from './handle';
import Line from './line';

class Rangeslider extends TRSElement {
  readonly CLASSES = {
    modOneHandle: 'rangeslider_one-handle',
    modIsVertical: 'rangeslider_is-vertical',
  };

  public controls: (Tip | Handle | Line)[] = [];

  private _isTwoHandles = false;

  isTwoHandles = (): boolean => {
    return this._isTwoHandles;
  };

  setTwoHandles = (value: boolean): void => {
    this._isTwoHandles = value;
    this.$el.find('.rangeslider__line-selected').removeAttr('style');
    if (this._isTwoHandles) this.$el.removeClass(this.CLASSES.modOneHandle);
    else this.$el.addClass(this.CLASSES.modOneHandle);
  };

  protected _isVertical = false;

  isVertical = (): boolean => {
    return this._isVertical;
  };

  setVertical = (value: boolean): void => {
    this._isVertical = value;
    if (value) this.$el.addClass(this.CLASSES.modIsVertical);
    else this.$el.removeClass(this.CLASSES.modIsVertical);
    this.controls.forEach(val => {
      val.setVertical(value);
    });
  };

  constructor(el: JQuery<HTMLElement>) {
    super(el);
    el.on('dragstart', e => e.preventDefault());
  }

  addControls(controls: (Tip | Handle | Line)[]): void {
    this.controls = controls;
  }
}

export default Rangeslider;
