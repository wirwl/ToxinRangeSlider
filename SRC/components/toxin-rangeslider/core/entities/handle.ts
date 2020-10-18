import TRSElement from './element';

class Handle extends TRSElement {
  setMoving(value: boolean): void {
    if (value) this.$el.addClass('rangeslider__handle_isMoving');
    else this.$el.removeClass('rangeslider__handle_isMoving');
  }

  is(h: Handle): boolean {
    return this.$el.is(h.$el);
  }
}

export default Handle;
