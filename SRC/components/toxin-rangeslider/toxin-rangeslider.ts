//import jQuery from 'jquery';
//const jQuery = require('jquery')(window);
//const jQuery = require('../../jquery/dist/jquery');

//import '../../components/toxin-rangeslider/toxin-rangeslider.less';

//import { jQuery } from '../../jquery/dist/jquery';
//if (!jQuery)
//const jQuery = require("../../jquery/dist/jquery");

import TRSPresenter from './core/presenter';
import TRSView from './core/view';
import TRSModel from './core/model';
// const TRSPresenter = require('./core/presenter');
// const TRSView = require('./core/view');
// const TRSModel = require('./core/model');

//import { ExampleService } from './example-service';
// eslint-disable-next-line prettier/prettier
// Define the plugin function on the jQuery extension point.
//Object.assign<ExamplePluginFunction, ExamplePluginDefaultOptions>(
//const jQuery = require('../../jquery/dist/jquery');
// eslint-disable-next-line prettier/prettier

//const { jQuery, $ } = require('jquery')(window);

//console.log((global as any).jQuery);

(function($) {
    $.fn.examplePlugin = function(this: JQuery, options: ExamplePluginOptions): JQuery {
        //new TRSPresenter(new TRSModel($, options), new TRSView(this));
        if (!$.data(this[0], 'tox inRangeSlider')) {
            $.data(this[0], 'toxinRangeSlider', new TRSPresenter(new TRSModel(options), new TRSView(this)));
        }
        return this;
    };
    $.fn.examplePlugin.options = TRSModel.defaults;
    const el = $('.toxin-rangeslider');
    if (el.length > 0) el.examplePlugin();
})(jQuery);
