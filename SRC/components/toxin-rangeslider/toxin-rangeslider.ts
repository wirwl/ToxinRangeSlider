import TRSPresenter from './core/presenter';
import TRSView from './core/view';
import TRSModel from './core/model';

$.fn.toxinRangeSlider = function(this: JQuery<HTMLElement>, options: RangeSliderOptions): JQuery {
  this.each(function() {
    if (!$.data(this, 'toxinRangeSlider')) {
      $.data(this, 'toxinRangeSlider', new TRSPresenter(new TRSModel(options), new TRSView($(this))));
    }
  });
  return this;
};

$.fn.toxinRangeSlider.options = TRSModel.defaults;

const el = $('.toxin-rangeslider-here');
el.each(function() {
  $(this).toxinRangeSlider();
});
