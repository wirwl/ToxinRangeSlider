import './index.less';
import '../../favicons/favicons.js';

$(document).ready(() => {
    $('.test1').toxinRangeSlider({
        onHandlePositionChange() {},
    });
    $('.test2').toxinRangeSlider({ isVertical: true });
    const trs1 = $('.test1').data('toxinRangeSlider');
    const trs2 = $('.test2').data('toxinRangeSlider');
    trs2.update({
        onHandlePositionChange() {},
    });
});
