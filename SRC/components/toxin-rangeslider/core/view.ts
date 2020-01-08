//import $ from 'jQuery';

/**
 * Encapsulate a single task view logic
 */
class TaskView {
    text: string;
    inx: number;
    onRemoveTaskCb: any;
    //: (inx: number) => {};
    constructor(text: string, inx: number) {
        this.text = text;
        this.inx = inx;
        //this.onRemoveTaskCb = function(): void {};
    }
    render() {
        const el = document.createElement('li');
        el.innerHTML = this.text + ' <a href="#" data-inx="' + this.inx + '">[x]</a>';
        this.onRemoveTaskCb = this.onRemoveTaskCb || function() {};
        el.querySelector('a')!.addEventListener('click', e => {
            e.preventDefault();
            this.onRemoveTaskCb(parseInt((e.target as HTMLUListElement).dataset.inx!, 10));
        });
        return el;
    }
}

export default class TRSView {
    private heights = {
        caption: 10,
        tip: 10,
    };
    private template =
        "<div class='caption'>" +
        "<div class='caption__text'>Range Slider</div>" +
        "<div class='caption__value'>25</div>" +
        '</div>' +
        "<div class='rangeslider'>" +
        "<div class='rangeslider__tip-from'>23</div>" +
        "<div class='rangeslider__tip-to'>456</div>" +
        "<div class='rangeslider__line'></div>" +
        "<div class='rangeslider__line-selected'></div>" +
        "<div class='rangeslider__handle rangeslider__handle-from'></div>" +
        "<div class='rangeslider__handle rangeslider__handle-to'></div>" +
        '</div>';
    el: JQuery<Element>;
    $rangeslider: JQuery<HTMLElement>;
    $tipFrom: JQuery<HTMLElement>;
    $tipTo: JQuery<HTMLElement>;
    $handleFrom: JQuery<HTMLElement>;
    $handleTo: JQuery<HTMLElement> | null;
    $line: JQuery<HTMLElement>;
    $lineSelected: JQuery<HTMLElement>;
    input: HTMLInputElement | null;
    $input: JQuery<Element>;
    list: HTMLUListElement | null;
    onSubmitCb: Function;
    onRemoveTaskCb: Function;
    data: ExamplePluginOptions;
    constructor(el: JQuery<HTMLElement>) {
        this.el = el;
        this.el.html(this.template);
        this.$rangeslider = el.find('.rangeslider');
        this.$tipFrom = el.find('.rangeslider__tip-from');
        this.$tipTo = el.find('.rangeslider__tip-to');
        this.$line = el.find('.rangeslider__line');
        this.$handleFrom = this.$rangeslider.find('.rangeslider__handle-from');
        this.$handleTo = this.$rangeslider.find('.rangeslider__handle-to');
        this.$lineSelected = this.$rangeslider.find('.rangeslider__line-selected');
        this.input = el[0].querySelector('[data-bind=input]');
        this.$input = $(this.input);
        this.list = el[0].querySelector('[data-bind=tasks]');
        this.onSubmitCb = function() {};
        this.onRemoveTaskCb = function() {};
        //this.drawSlider = function() {};
        // this.el[0].addEventListener('submit', e => {
        //     e.preventDefault();
        //     if (this.input) this.onSubmitCb(this.input.value);
        // });
        this.data = el.data('options');
        this.$handleFrom[0].ondragstart = function() {
            return false;
        };
        this.$handleFrom.mousedown(e => this.onMouseDown(e));
        this.$handleTo.mousedown(e => this.onMouseDown(e));
        this.improveTipWidth(this.$tipFrom, this.$handleFrom);
        this.setTipXPos(this.$tipFrom, this.$handleFrom);
        this.improveTipWidth(this.$tipTo, this.$handleTo);
        this.setTipXPos(this.$tipTo, this.$handleTo);
    }
    // moveAt(e: JQuery.MouseDownEvent | JQuery.MouseMoveEvent, shiftX: number) {
    //     //const shiftX = e.clientX - this.$handleFrom[0].getBoundingClientRect().left;

    //     this.$handleFrom.css('left', e.pageX - shiftX + 'px');
    // }
    convertRelativeValueToPixelValue(relativeValue: number) {}
    convertPixelValueToRelativeValue(pixelValue: number) {}
    setTipXPos(tip: JQuery<HTMLElement>, handle: JQuery<HTMLElement>) {
        const hl = parseInt(handle.css('left'));
        const hw = parseInt(handle.css('width'));
        const tl = parseInt(tip.css('left'));
        const tw = parseInt(tip.css('width'));
        tip.css('left', tl + (hw - tw) / 2);
    }
    improveTipWidth(tip: JQuery<HTMLElement>, handle: JQuery<HTMLElement>) {
        const tw = parseInt(tip.css('width'));
        const hw = parseInt(handle.css('width'));
        if (hw % 2) {
            console.log('нечётное число');
            tip.css('width', tw % 2 ? tw : tw + 1);
        } else {
            console.log('чётное число');
            tip.css('width', tw % 2 ? tw + 1 : tw);
        }
    }
    onMouseDown(e: JQuery.MouseDownEvent) {
        console.log('asdf');
        e.preventDefault();
        const currentHandle: JQuery<HTMLElement> = $(e.target);
        const shiftX = e.clientX - currentHandle.offset().left;
        //const shiftX = e.clientX - currentHandle[0].getBoundingClientRect().left;

        //this.moveAt(e, shiftX);
        //this.onHandleMove(e, currentHandle, shiftX);
        this.$rangeslider.mousemove(e => this.onHandleMove(e, currentHandle, shiftX));
        currentHandle.mouseup(e => {
            this.$rangeslider.off('mousemove');
            currentHandle.off('mouseup');
            currentHandle.css('z-index', '11');
        });
        this.$rangeslider.mouseup(e => {
            this.$rangeslider.off('mousemove');
            currentHandle.off('mouseup');
            currentHandle.css('z-index', '11');
        });
    }
    onHandleMove(e: JQuery.MouseMoveEvent | JQuery.MouseDownEvent, currentHandle: JQuery<HTMLElement>, shiftX: number) {
        const hfx = parseInt(this.$handleFrom.css('left'));
        const hfw = parseInt(this.$handleFrom.css('width'));
        const htx = parseInt(this.$handleTo.css('left'));
        const htw = parseInt(this.$handleTo.css('width'));
        const chx = parseInt(currentHandle.css('left'));
        const chw = parseInt(currentHandle.css('width'));
        const lx = parseInt(this.$line.css('left'));
        const lw = parseInt(this.$line.css('width'));
        const lsx = parseInt(this.$lineSelected.css('left'));
        const lsw = parseInt(this.$lineSelected.css('width'));
        const tfw = parseInt(this.$tipFrom.css('width'));
        const ttw = parseInt(this.$tipTo.css('width'));
        const shift = shiftX + this.$line.offset().left;

        const isTwoHandles = this.$handleFrom.css('display') != 'none';
        //this.$handleFrom.length > 0;

        const currentTip = currentHandle.is(this.$handleFrom) ? this.$tipFrom : this.$tipTo;

        currentHandle.css('z-index', '99');

        let newLeft = e.clientX - shift;
        if (newLeft < 0) newLeft = 0;
        if (isTwoHandles) {
            if (currentHandle.is(this.$handleFrom)) if (newLeft > htx) newLeft = htx;
            if (currentHandle.is(this.$handleTo)) if (newLeft < hfx) newLeft = hfx;
        }
        if (newLeft > lw - chw) newLeft = lw - chw;

        currentHandle.css('left', newLeft + 'px');

        if (isTwoHandles) {
            //если есть 2й ползунок
            if (currentHandle.is(this.$handleTo)) {
                //если тянем мышкой 2й ползунок
                this.$lineSelected.css('width', newLeft - hfx - htw);
            } else {
                //если тянем мышкой 1й ползунок
                this.$lineSelected.css('left', newLeft + chw);
                this.$lineSelected.css('width', htx - newLeft - htw);
            }
        } else {
            //тянем мышкой единственный ползунок
            this.$lineSelected.css('width', newLeft);
        }
        //-----------------------------------------------------------
        if (this.$tipTo.length > 0) {
            if (currentHandle.is(this.$handleFrom)) {
                //this.$tipFrom.css('left', 0);
                //this.setTipXPos(this.$tipFrom, currentHandle);
                this.$tipFrom.css('left', newLeft + (chw - tfw) / 2);
            } else {
                this.$tipTo.css('left', newLeft + (chw - ttw) / 2);
            }
        }
    }
    drawSlider1() {}
    redrawSlider1() {
        this.drawSlider1();
    }
    drawSlider(oldSettings: ExamplePluginOptions, newSettings: ExamplePluginOptions, isFirstDraw = false) {
        const htl = this.$handleTo.css('left');
        const htw = this.$handleTo.css('width');
        if (!isFirstDraw) {
            console.log('not');
        }
        if (isFirstDraw || newSettings.isInterval != oldSettings.isInterval) {
            const countHandles = this.$rangeslider.find('.rangeslider__handle');
            if (newSettings.isInterval) {
                if (countHandles.length != 2) {
                    // this.$rangeslider.append("<div class='rangeslider__handle rangeslider__handle-from'></div>");
                    // this.$handleFrom = this.$rangeslider.find('.rangeslider__handle-from');
                    // this.$handleFrom.mousedown(e => this.onMouseDown(e));
                    this.$handleFrom.show();
                    this.$lineSelected.removeClass('rangeslider__line-selected_isOneHandle');
                }
            } else {
                if (countHandles.length != 1) {
                    this.$handleFrom.hide();
                    this.$lineSelected.addClass('rangeslider__line-selected_isOneHandle');
                    // this.$handleFrom.remove();
                    // this.$handleFrom = this.$rangeslider.find('.rangeslider__handle-from');
                }
                if (this.$tipFrom.length > 0) {
                    this.$tipFrom.hide();
                    // this.$tipFrom.remove();
                    // this.$tipFrom = this.$rangeslider.find('.rangeslider__tip-from');
                }
                this.$lineSelected.css('left', 1);
                this.$lineSelected.css('width', htl);
            }
        }
    }
    removeDOMelements() {}
    emptyList() {
        if (this.list) this.list.innerHTML = '';
    }
    addTask(text: string, inx: number) {
        const taskView = new TaskView(text, inx);
        taskView.onRemoveTaskCb = this.onRemoveTaskCb;
        if (this.list) this.list.appendChild(taskView.render());
    }
}
