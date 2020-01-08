import $ from 'jquery';
import TRSPresenter from './core/presenter';
import TRSView from './core/view';
import TRSModel from './core/model';
//import { ExampleService } from './example-service';

// Define the plugin function on the jQuery extension point.
//Object.assign<ExamplePluginFunction, ExamplePluginDefaultOptions>(
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
