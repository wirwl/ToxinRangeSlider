import './index.less';
import '../../favicons/favicons.js';

//import '../../../node_modules/jquery/dist/jquery.js';

//import '../../components/toxin-rangeslider/toxin-rangeslider';

//import { createToDo, ToDo } from '../../components/todo/todo';
//import '../../components/todo/todo';

// import $ from 'jquery';
// (window as any).jQuery = $;
// (window as any).$ = $;

$(document).ready(() => {
    //jQuery(document).ready(function($) {
    $('.test1').examplePlugin({ isInterval: true, isTip: true });
    const trs = $('.test1').data('toxinRangeSlider');
    trs.update({ isInterval: true, isTip: true, valueFrom: 35, valueTo: 65 });
    //trs.update({ minValue: 0, maxValue: 110, stepValue: 10 });
});
