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
    $('.test1').toxinRangeSlider({
        onHandlePositionChange() {
            console.log(this);
        },
    });
    $('.test2').toxinRangeSlider({ isVertical: true });
    const trs1 = $('.test1').data('toxinRangeSlider');
    const trs2 = $('.test2').data('toxinRangeSlider');
    trs2.update({});
});
