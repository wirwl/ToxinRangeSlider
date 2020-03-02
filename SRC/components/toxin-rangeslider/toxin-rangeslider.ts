import TRSPresenter from './core/presenter';
import TRSView from './core/view';
import TRSModel from './core/model';

// eslint-disable-next-line prettier/prettier
;(function($) {
    $.fn.toxinRangeSlider = function(this: JQuery, options: RangeSliderOptions): JQuery {
        if (!$.data(this, 'toxinRangeSlider')) {
            $.data(this, 'toxinRangeSlider', new TRSPresenter(new TRSModel(options), new TRSView(this)));
        }
        return this;
    };

    $.fn.toxinRangeSlider.options = TRSModel.defaults;

    const el = $('.toxin-rangeslider-here');
    el.each(function() {
        $(this).toxinRangeSlider();
    });
})(jQuery);
