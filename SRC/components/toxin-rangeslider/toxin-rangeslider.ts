import './toxin-rangeslider.less';

//import $ from 'jquery';
//const $ = require('jquery');
import TRSPresenter from './core/presenter';
import TRSView from './core/view';
import TRSModel from './core/model';
//import { ExampleService } from './example-service';
// eslint-disable-next-line prettier/prettier
// Define the plugin function on the jQuery extension point.
//Object.assign<ExamplePluginFunction, ExamplePluginDefaultOptions>(
console.log('trx');

// eslint-disable-next-line prettier/prettier
;(function($) {
    $.fn.examplePlugin = function(this: JQuery, options: ExamplePluginOptions): JQuery {
        //new TRSPresenter(new TRSModel($, options), new TRSView(this));
        if (!$.data(this[0], 'toxinRangeSlider')) {
            $.data(this[0], 'toxinRangeSlider', new TRSPresenter(new TRSModel(options), new TRSView(this)));
        }
        return this;
    };
    $.fn.examplePlugin.options = TRSModel.defaults;
    const el = $('.toxin-rangeslider');
    if (el.length > 0) el.examplePlugin();
})(jQuery);

console.log($);
