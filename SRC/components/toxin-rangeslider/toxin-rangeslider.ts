import TRSPresenter from './core/presenter';
import TRSView from './core/View/MainView';
import TRSModel from './core/model';

$.fn.toxinRangeSlider = function toxinRangeSlider(this: JQuery<HTMLElement>, options?: RangeSliderOptions): JQuery {
  this.each(function eachHTMLElement() {
    if (!$.data(this, 'toxinRangeSlider')) {
      $.data(this, 'toxinRangeSlider', new TRSPresenter(new TRSModel(options), new TRSView($(this))));
    }
  });
  return this;
};

$.fn.toxinRangeSlider.options = { ...TRSModel.defaults };

const el = $('.toxin-rangeslider-here');
el.each(function eachHTMLElement() {
  $(this).toxinRangeSlider();
});
