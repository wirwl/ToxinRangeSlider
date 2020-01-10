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
    private isSplitTips: boolean;
    private oldTFW: number;
    private oldTTX: number;
    private valueFrom: number;
    private valueTo: number;
    private offsetLeft: number;
    private offsetRight: number;
    private min: number;
    private max: number;
    private template =
        "<div class='caption'>" +
        "<div class='caption__text'>Range Slider</div>" +
        "<div class='caption__value'>25</div>" +
        '</div>' +
        "<div class='rangeslider'>" +
        "<div class='rangeslider__tip-min'>00</div>" +
        "<div class='rangeslider__tip-from'>23</div>" +
        "<div class='rangeslider__tip-to'>456</div>" +
        "<div class='rangeslider__tip-max'>99</div>" +
        "<div class='rangeslider__line'></div>" +
        "<div class='rangeslider__line-selected'></div>" +
        "<div class='rangeslider__handle rangeslider__handle-from'></div>" +
        "<div class='rangeslider__handle rangeslider__handle-to'></div>" +
        '</div>';
    el: JQuery<Element>;
    $rangeslider: JQuery<HTMLElement>;
    $tipMin: JQuery<HTMLElement>;
    $tipFrom: JQuery<HTMLElement>;
    $tipTo: JQuery<HTMLElement>;
    $tipMax: JQuery<HTMLElement>;
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
        this.$tipMin = el.find('.rangeslider__tip-min');
        this.$tipFrom = el.find('.rangeslider__tip-from');
        this.$tipTo = el.find('.rangeslider__tip-to');
        this.$tipMax = el.find('.rangeslider__tip-max');
        this.$line = el.find('.rangeslider__line');
        this.$handleFrom = this.$rangeslider.find('.rangeslider__handle-from');
        this.$handleTo = this.$rangeslider.find('.rangeslider__handle-to');
        this.offsetLeft = parseFloat(this.$handleFrom.css('width')) / 2;
        this.offsetRight = parseFloat(this.$handleTo.css('width')) / 2;
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
        //this.improveTipWidth(this.$tipFrom, this.$handleFrom);
        this.setTipXPos(this.$tipFrom, this.$handleFrom);
        //this.improveTipWidth(this.$tipTo, this.$handleTo);
        this.setTipXPos(this.$tipTo, this.$handleTo);
    }
    // moveAt(e: JQuery.MouseDownEvent | JQuery.MouseMoveEvent, shiftX: number) {
    //     //const shiftX = e.clientX - this.$handleFrom[0].getBoundingClientRect().left;

    //     this.$handleFrom.css('left', e.pageX - shiftX + 'px');
    // }
    convertRelativeValueToPixelValue(min: number, val: number, max: number): number {
        const lw = parseInt(this.$line.css('width')) - this.offsetLeft - this.offsetRight;
        const percent = ((val - min) / (max - min)) * 100;
        return ~~((lw / 100) * percent);
    }
    convertPixelValueToRelativeValue(val: number): number {
        let lw = parseInt(this.$line.css('width'));
        lw = lw - this.offsetLeft - this.offsetRight;
        const percent = val / lw;
        return ~~(this.min + percent * (this.max - this.min));
    }
    setTipXPos(tip: JQuery<HTMLElement>, handle: JQuery<HTMLElement>) {
        const hl = parseInt(handle.css('left'));
        const hw = parseInt(handle.css('width'));
        const tl = parseInt(tip.css('left'));
        const tw = parseInt(tip.css('width'));
        tip.css('left', tl + (hw - tw) / 2);
    }
    // improveTipWidth(tip: JQuery<HTMLElement>, handle: JQuery<HTMLElement>) {
    //     const tw = parseInt(tip.css('width'));
    //     const hw = parseInt(handle.css('width'));
    //     if (hw % 2) {
    //         console.log('нечётное число');
    //         tip.css('width', tw % 2 ? tw : tw + 1);
    //     } else {
    //         console.log('чётное число');
    //         tip.css('width', tw % 2 ? tw + 1 : tw);
    //     }
    // }
    onMouseDown(e: JQuery.MouseDownEvent) {
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
        $(document).mouseup(e => {
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
        let tfx = parseInt(this.$tipFrom.css('left'));
        let tfw = parseInt(this.$tipFrom.css('width'));
        let ttx = parseInt(this.$tipTo.css('left'));
        let ttw = parseInt(this.$tipTo.css('width'));
        const tiw = parseInt(this.$tipMin.css('width'));
        const taw = parseInt(this.$tipMax.css('width'));
        const tax = lw - taw;
        const shift = shiftX + this.$line.offset().left;

        const isTwoHandles = this.$handleFrom.css('display') != 'none';

        //this.$handleFrom.length > 0;

        const currentTip = currentHandle.is(this.$handleFrom) ? this.$tipFrom : this.$tipTo;
        // const ctx = parseInt(currentTip.css('left'));
        // const ctw = parseInt(currentTip.css('width'));
        // const distanceMin = tfx - tiw;
        // if (distanceMin < 1) this.$tipMin.hide();
        // else this.$tipMin.show();
        // const distanceMax = lw - tfx - tfw - taw;
        // if (distanceMax < 1) this.$tipMax.hide();
        // else this.$tipMax.show();

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
            //есть 2й ползунок
            if (currentHandle.is(this.$handleTo)) {
                //если тянем мышкой 2й ползунок
                this.$lineSelected.css('width', newLeft - hfx - htw + this.offsetLeft + this.offsetRight);
                // const distanceMin = ttx - tiw;
                // console.log(distanceMin);
            } else {
                //если тянем мышкой 1й ползунок
                this.$lineSelected.css('left', newLeft + hfw - this.offsetLeft);
                this.$lineSelected.css('width', htx - newLeft - htw + this.offsetLeft + this.offsetRight);
                // const distanceMin = tfx - tiw;
                // const distanceMax = tax - tfx - tfw;
                // if (distanceMin < 1) this.$tipMin.hide();
                // else this.$tipMin.show();
                // if (distanceMax < 1) this.$tipMax.hide();
                // else this.$tipMax.show();
            }
        } else {
            //если тянем мышкой единственный ползунок
            this.$lineSelected.css('width', newLeft - 1 + this.offsetRight);
        }
        //-----------------------------------------------------------
        const newValue = this.convertPixelValueToRelativeValue(newLeft);
        currentTip.text(newValue);
        if (currentTip.is(this.$tipFrom)) tfw = parseFloat(this.$tipFrom.css('width'));
        else ttw = parseFloat(this.$tipTo.css('width'));

        if (this.$tipTo.length > 0) {
            if (currentHandle.is(this.$handleFrom)) {
                this.$tipFrom.css('left', newLeft + (chw - tfw) / 2);
            } else {
                //if (this.$tipTo.css('display') != 'none')
                this.$tipTo.css('left', newLeft + (chw - ttw) / 2);
            }
        }
        //------------------------------------------------------------
        if (currentHandle.is(this.$handleFrom)) this.valueFrom = newValue;
        else this.valueTo = newValue;

        if (isTwoHandles) {
            if (currentHandle.is(this.$handleFrom)) {
                let distanceBetweenHandles;
                if (this.isSplitTips) distanceBetweenHandles = ttx - (newLeft + (hfw - tfw) / 2) - this.oldTFW;
                else distanceBetweenHandles = ttx - tfx - tfw;

                if (distanceBetweenHandles < 1 && !this.isSplitTips) {
                    console.log('Первое сцепление');
                }

                if (distanceBetweenHandles < 1) {
                    if (!this.isSplitTips) this.oldTFW = tfw;
                    this.isSplitTips = true;
                    this.$tipTo.hide();
                    this.$tipFrom.text(this.valueFrom + ' - ' + this.valueTo);
                    tfw = parseFloat(this.$tipFrom.css('width'));
                    this.$tipFrom.css('left', hfx + (htx - hfx + htw - tfw) / 2);
                    tfx = parseFloat(this.$tipFrom.css('left'));
                } else {
                    this.isSplitTips = false;
                    this.$tipTo.show();
                    this.$tipFrom.css('left', newLeft + (chw - this.oldTFW) / 2);
                    tfx = parseFloat(this.$tipFrom.css('left'));
                }
            } else {
                let distanceBetweenHandles;
                if (this.isSplitTips)
                    //htx + (htw - ttw) / 2
                    distanceBetweenHandles = ttx - (hfx + (hfw - this.oldTFW) / 2) - this.oldTFW;
                else distanceBetweenHandles = ttx - tfx - tfw;

                console.log(distanceBetweenHandles);

                if (distanceBetweenHandles < 1) {
                    if (!this.isSplitTips) {
                        this.oldTFW = tfw;
                        this.oldTTX = ttx;
                    }
                    this.isSplitTips = true;
                    this.$tipTo.hide();
                    this.$tipFrom.text(this.valueFrom + ' - ' + this.valueTo);
                    tfw = parseFloat(this.$tipFrom.css('width'));
                    this.$tipFrom.css('left', hfx + (htx - hfx + htw - tfw) / 2);
                    tfx = parseFloat(this.$tipFrom.css('left'));
                } else {
                    this.isSplitTips = false;
                    this.$tipTo.show();
                    this.$tipFrom.text(this.valueFrom);
                    this.$tipFrom.css('left', hfx + (hfw - this.oldTFW) / 2);
                    //this.$tipTo.css('left', newLeft + (chw - this.oldTFW) / 2);
                    //ttx = parseFloat(this.$tipTo.css('left'));
                }
            }
        }
        //this.oldTFW = 0;
        //------------------------------------------------------------

        //------------------------------------------------------------
        tfx = parseFloat(this.$tipFrom.css('left'));
        ttx = parseFloat(this.$tipTo.css('left'));
        let distanceMin = tfx - tiw;
        const distanceMax = tax - ttx - ttw;
        distanceMin < 1 ? this.$tipMin.hide() : this.$tipMin.show();
        distanceMax < 1 ? this.$tipMax.hide() : this.$tipMax.show();
        if (!isTwoHandles) {
            distanceMin = ttx - tiw;
            distanceMin < 1 ? this.$tipMin.hide() : this.$tipMin.show();
        }
        //-----------------------------------------------------------
    }
    drawSlider1() {}
    redrawSlider1() {
        this.drawSlider1();
    }
    drawSlider(oldSettings: ExamplePluginOptions, newSettings: ExamplePluginOptions, isFirstDraw = false) {
        this.min = newSettings.minValue;
        this.max = newSettings.maxValue;
        let hfx = parseInt(this.$handleFrom.css('left'));
        const hfw = parseInt(this.$handleFrom.css('width'));
        const htx = parseInt(this.$handleTo.css('left'));
        const htw = parseInt(this.$handleTo.css('width'));
        let tfx = parseInt(this.$tipFrom.css('left'));
        const tfw = parseInt(this.$tipFrom.css('width'));
        const ttx = parseInt(this.$tipTo.css('left'));
        let ttw = parseInt(this.$tipTo.css('width'));
        const tix = parseInt(this.$tipMin.css('left'));
        const tiw = parseInt(this.$tipMin.css('width'));
        const tax = parseInt(this.$tipMax.css('left'));
        const taw = parseInt(this.$tipMax.css('width'));
        const lx = parseInt(this.$line.css('left'));
        const lw = parseInt(this.$line.css('width'));
        const lsx = parseInt(this.$lineSelected.css('left'));
        let lsw = parseInt(this.$lineSelected.css('width'));

        if (!isFirstDraw) {
        }
        if (isFirstDraw || newSettings.isInterval != oldSettings.isInterval) {
            const countHandles = this.$rangeslider.find('.rangeslider__handle');
            if (newSettings.isInterval) {
                this.$handleFrom.show();
                this.$lineSelected.removeClass('rangeslider__line-selected_isOneHandle');
            } else {
                this.$handleFrom.hide();
                this.$lineSelected.addClass('rangeslider__line-selected_isOneHandle');
                this.$tipFrom.hide();
                this.$lineSelected.css('left', 1);
                this.$lineSelected.css('width', htx - 1 + this.offsetRight);
            }
        }
        if (isFirstDraw || newSettings.isTip != oldSettings.isTip) {
            if (newSettings.isTip) {
                if (newSettings.isInterval) this.$tipFrom.show();
                this.$tipTo.show();
            } else {
                if (newSettings.isInterval) this.$tipFrom.hide();
                this.$tipTo.hide();
            }
        }
        if (isFirstDraw || (newSettings.valueFrom != oldSettings.valueFrom && newSettings.isInterval)) {
            this.valueFrom = newSettings.valueFrom;
            this.$tipFrom.text(newSettings.valueFrom);
            this.$handleFrom.css(
                'left',
                this.convertRelativeValueToPixelValue(
                    newSettings.minValue,
                    newSettings.valueFrom,
                    newSettings.maxValue,
                ),
            );
            hfx = parseInt(this.$handleFrom.css('left'));
            this.$lineSelected.css('left', hfx + hfw - this.offsetLeft);
            this.$lineSelected.css('width', htx - hfx - htw + this.offsetRight);
            this.$tipFrom.css('left', hfx + (hfw - tfw) / 2);
            tfx = parseInt(this.$tipFrom.css('left'));
            const distanceMin = tfx - tiw;
            if (distanceMin < 1) this.$tipMin.hide();
            else this.$tipMin.show();
        }
        if (isFirstDraw || newSettings.valueTo != oldSettings.valueTo) {
            this.valueTo = newSettings.valueTo;
            this.$tipTo.text(newSettings.valueTo);
            this.$handleTo.css(
                'left',
                this.convertRelativeValueToPixelValue(newSettings.minValue, newSettings.valueTo, newSettings.maxValue),
            );
            const htx = parseInt(this.$handleTo.css('left'));
            if (newSettings.isInterval)
                this.$lineSelected.css('width', htx - hfx - htw + this.offsetLeft + this.offsetRight);
            else this.$lineSelected.css('width', htx - 1 + this.offsetRight);
            lsw = parseInt(this.$lineSelected.css('width'));
            this.$tipTo.css('left', htx + (htw - ttw) / 2);
            const ttx = parseInt(this.$tipTo.css('left'));
            ttw = parseInt(this.$tipTo.css('width'));
            const distanceMax = lw - ttx - ttw - taw;
            if (distanceMax < 1) this.$tipMax.hide();
            else this.$tipMax.show();
            if (!newSettings.isInterval) {
                const distanceMin = ttx - tiw;
                distanceMin < 1 ? this.$tipMin.hide() : this.$tipMin.show();
            }
        }
        if (isFirstDraw || newSettings.minValue != oldSettings.minValue) {
            this.$tipMin.text(newSettings.minValue);
        }
        if (isFirstDraw || newSettings.maxValue != oldSettings.maxValue) {
            this.$tipMax.text(newSettings.maxValue);
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
