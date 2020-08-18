import TRSElement from './element';

class Handle extends TRSElement {
  setIsMoving(value: boolean) {
    if (value) this.el.addClass('rangeslider__handle_isMoving');
    else this.el.removeClass('rangeslider__handle_isMoving');
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

export default Handle;
