import './index.less';

import '../../favicons/favicons.js';

import '../../../node_modules/jquery/dist/jquery.js';

import '../../components/toxin-rangeslider/toxin-rangeslider';

import { createToDo, ToDo } from '../../components/todo/todo';
import '../../components/todo/todo';

$(document).ready(() => {
    $('.test1').examplePlugin({ isInterval: true });
    const trs = $('.test1').data('toxinRangeSlider');
    trs.update({ isInterval: false });
});
