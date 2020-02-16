//import $ from 'jQuery';
//let $: JQueryStatic = require('jquery');
import Handle from '../core/entities/handle';
type resultMoveHandle = { isFromHandle: boolean; value: number };
export default class TRSView {
    private settings: ExamplePluginOptions;
    private isSplitTips: boolean;
    private offsetLeft: number;
    private offsetRight: number;
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
    onHandlePositionUpdate: Function;
    data: ExamplePluginOptions;
    handleFrom: Handle;
    handleTo: Handle;
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
        this.onSubmitCb = function() {};
        this.onRemoveTaskCb = function() {};
        this.data = el.data('options');
        this.$handleFrom[0].ondragstart = function() {
            return false;
        };
        this.$handleFrom.mousedown(e => this.onMouseDown(e));
        this.$handleTo.mousedown(e => this.onMouseDown(e));
        this.setTipXPos(this.$tipFrom, this.$handleFrom);
        this.setTipXPos(this.$tipTo, this.$handleTo);

        this.handleFrom = new Handle(this.$handleFrom);
        this.handleTo = new Handle(this.$handleTo);

        console.log(this.handleFrom.x);
        this.handleFrom.isVertical = true;
        console.log(this.handleFrom.pos);
    }

    convertRelativeValueToPixelValue(min: number, val: number, max: number): number {
        const lw = parseFloat(this.$line.css('width')) - this.offsetLeft - this.offsetRight;
        let result;
        if (this.settings.values && this.settings.values.length > 1) {
            const pxStep = lw / (this.settings.values.length - 1);
            result = val * pxStep;
        } else {
            const percent = ((val - min) / (max - min)) * 100;
            result = lw * (percent / 100);
        }
        return result;
    }
    convertPixelValueToRelativeValue(val: number): number {
        const lw = parseFloat(this.$line.css('width')) - this.offsetLeft - this.offsetRight;
        let result;
        if (this.settings.values && this.settings.values.length > 1) {
            const pxStep = lw / (this.settings.values.length - 1);
            result = Math.round(val / pxStep);
        } else {
            const percent = val / lw;
            result = Math.round(this.settings.minValue + percent * (this.settings.maxValue - this.settings.minValue));
        }
        return result;
    }
    setTipXPos(tip: JQuery<HTMLElement>, handle: JQuery<HTMLElement>) {
        const hl = parseFloat(handle.css('left'));
        const hw = parseFloat(handle.css('width'));
        const tl = parseFloat(tip.css('left'));
        const tw = parseFloat(tip.css('width'));
        tip.css('left', tl + (hw - tw) / 2);
    }
    getNearestHandle(pos: number) {
        const hfx = parseFloat(this.$handleFrom.css('left'));
        const hfw = parseFloat(this.$handleFrom.css('width'));
        const htx = parseFloat(this.$handleTo.css('left'));
        const htw = parseFloat(this.$handleTo.css('width'));
        if (this.settings.isInterval) {
            if (pos < hfx) return this.$handleFrom;
            if (pos > htx) return this.$handleTo;
            const distanceBetweenHandles = htx - hfx - hfw;
            const half = hfx + hfw + distanceBetweenHandles / 2;
            if (pos < half) return this.$handleFrom;
            else return this.$handleTo;
        } else {
            if (pos < htx) return this.$handleFrom;
            else return this.$handleTo;
        }
        return null;
    }
    onMouseUp(e: JQuery.MouseUpEvent, currentHandle: JQuery<HTMLElement>) {
        this.$rangeslider.off('mousemove');
        currentHandle.off('mouseup');
        currentHandle.css('z-index', '11');
    }
    onMouseDown(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        const currentHandle: JQuery<HTMLElement> = $(e.target);
        const shiftX = e.clientX - currentHandle.offset().left;

        this.$rangeslider.mousemove(e => this.onHandleMove(e, currentHandle, shiftX));
        currentHandle.mouseup(e => this.onMouseUp(e, currentHandle));
        $(document).mouseup(e => this.onMouseUp(e, currentHandle));
    }
    onMouseDownByLine(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        const currentHandle: JQuery<HTMLElement> = $(e.target);
        const pos = e.clientX - currentHandle.offset().left;
        this.onHandlePositionUpdate(this.getNearestHandle(pos), 0);
    }
    onHandleMove(e: JQuery.MouseMoveEvent, currentHandle: JQuery<HTMLElement>, shiftX: number) {
        const shift = shiftX + this.$line.offset().left;
        const newLeft = e.clientX - shift;

        if (this.settings.stepValue > 0 || this.settings.values.length > 1) {
            const pos = e.clientX - this.$line.offset().left - this.offsetLeft;
            const pxLength = parseFloat($('.rangeslider__line').css('width')) - this.offsetLeft - this.offsetRight;
            let pxStep = this.convertRelativeValueToPixelValue(
                this.settings.minValue,
                this.settings.minValue + this.settings.stepValue,
                this.settings.maxValue,
            );
            //console.log(pxStep);
            let totalstep = Math.round(pxLength / pxStep);

            if (this.settings.values) {
                const count = this.settings.values.length;
                if (count > 1) {
                    pxStep = pxLength / (count - 1);
                    totalstep = count;
                }
            }

            let nstep = Math.round(pos / pxStep);
            //console.log(pos);
            if (Math.trunc(pos / pxStep) >= totalstep - 1) {
                const prevnStep = (totalstep - 1) * pxStep;
                const pxLastStepHalf = (pxLength - prevnStep) / 2;
                if (pos > prevnStep + pxLastStepHalf) nstep = totalstep;
            }
            this.onHandlePositionUpdate(currentHandle, nstep * pxStep);
        } else this.onHandlePositionUpdate(currentHandle, newLeft);
    }
    moveHandle(currentHandle: JQuery<HTMLElement>, newLeft: number): resultMoveHandle {
        //let hfx = parseFloat(this.$handleFrom.css('left'));
        //const hfw = parseFloat(this.$handleFrom.css('width'));
        //let htx = parseFloat(this.$handleTo.css('left'));
        //const htw = parseFloat(this.$handleTo.css('width'));
        let chx = parseFloat(currentHandle.css('left'));
        const chw = parseFloat(currentHandle.css('width'));
        const lx = parseFloat(this.$line.css('left'));
        const lw = parseFloat(this.$line.css('width'));
        const lsx = parseFloat(this.$lineSelected.css('left'));
        const lsw = parseFloat(this.$lineSelected.css('width'));
        let tfx = parseFloat(this.$tipFrom.css('left'));
        let tfw = parseFloat(this.$tipFrom.css('width'));
        let ttx = parseFloat(this.$tipTo.css('left'));
        let ttw = parseFloat(this.$tipTo.css('width'));
        const tiw = parseFloat(this.$tipMin.css('width'));
        const taw = parseFloat(this.$tipMax.css('width'));
        const tax = lw - taw;

        const isTwoHandles = this.$handleFrom.css('display') != 'none';
        const isHandleFrom = currentHandle.is(this.$handleFrom);
        const isValues = this.settings.values && this.settings.values.length > 1;

        const currentTip = currentHandle.is(this.$handleFrom) ? this.$tipFrom : this.$tipTo;
        currentHandle.css('z-index', '99');

        if (newLeft < 0) newLeft = 0;
        if (isTwoHandles) {
            if (currentHandle.is(this.$handleFrom)) if (newLeft > this.handleTo.x) newLeft = this.handleTo.x;
            if (currentHandle.is(this.$handleTo)) if (newLeft < this.handleFrom.x) newLeft = this.handleFrom.x;
        }
        if (newLeft > lw - chw) newLeft = lw - chw;

        currentHandle.css('left', newLeft);
        isHandleFrom ? (this.handleFrom.x = newLeft) : (this.handleTo.x = newLeft);
        chx = newLeft;

        if (isTwoHandles) {
            //есть 2й ползунок
            if (currentHandle.is(this.$handleTo)) {
                //если тянем мышкой 2й ползунок
                this.$lineSelected.css(
                    'width',
                    newLeft - this.handleFrom.x - this.handleTo.width + this.offsetLeft + this.offsetRight + 1,
                );
            } else {
                //если тянем мышкой 1й ползунок
                this.$lineSelected.css('left', newLeft + this.handleFrom.width - this.offsetLeft);
                this.$lineSelected.css(
                    'width',
                    this.handleTo.x - newLeft - this.handleTo.width + this.offsetLeft + this.offsetRight + 1,
                );
            }
        } else {
            //если тянем мышкой единственный ползунок
            this.$lineSelected.css('width', newLeft + this.offsetRight + 1);
        }
        //-----------------------------------------------------------
        const newValue = this.convertPixelValueToRelativeValue(newLeft);
        if (isValues) {
            currentTip.text(this.settings.values[newValue]);
        } else {
            currentTip.text(Math.round(newValue));
        }
        //-------------------------------------------
        const anotherTip = currentTip.is(this.$tipTo) ? this.$tipFrom : this.$tipTo;
        const anotherValue = currentTip.is(this.$tipTo) ? this.settings.valueFrom : this.settings.valueTo;
        if (isValues) {
            anotherTip.text(this.settings.values[anotherValue]);
        } else {
            anotherTip.text(Math.round(anotherValue));
        }
        //-------------------------------------------
        tfw = parseFloat(this.$tipFrom.css('width'));
        ttw = parseFloat(this.$tipTo.css('width'));

        if (this.$tipTo.length > 0) {
            if (currentHandle.is(this.$handleFrom)) {
                this.$tipFrom.css('left', newLeft + (chw - tfw) / 2);
                tfx = parseFloat(this.$tipFrom.css('left'));
            } else {
                this.$tipTo.css('left', newLeft + (chw - ttw) / 2);
                ttx = parseFloat(this.$tipTo.css('left'));

                this.$tipFrom.css('left', this.handleFrom.x + (this.handleFrom.width - tfw) / 2);
                tfx = parseFloat(this.$tipFrom.css('left'));
            }
        }
        //------------------------------------------------------------
        if (currentHandle.is(this.$handleFrom)) this.settings.valueFrom = newValue;
        else this.settings.valueTo = newValue;

        if (isTwoHandles) {
            const distanceBetweenHandles = ttx - tfx - tfw;
            if (distanceBetweenHandles < 1) {
                this.isSplitTips = true;
                this.$tipTo.hide();
                this.$tipFrom.text(
                    isValues
                        ? this.settings.values[this.settings.valueFrom] +
                              '-' +
                              this.settings.values[this.settings.valueTo]
                        : Math.round(this.settings.valueFrom) + ' - ' + Math.round(this.settings.valueTo),
                );
                tfw = parseFloat(this.$tipFrom.css('width'));
                this.$tipFrom.css(
                    'left',
                    this.handleFrom.x + (this.handleTo.x - this.handleFrom.x + this.handleTo.width - tfw) / 2,
                );
            } else {
                this.isSplitTips = false;
                this.$tipTo.show();
                this.$tipFrom.text(
                    isValues ? this.settings.values[this.settings.valueFrom] : Math.round(this.settings.valueFrom),
                );
                this.$tipFrom.css('left', this.handleFrom.x + (chw - tfw) / 2);
            }
            if (Math.round(this.settings.valueFrom) == Math.round(this.settings.valueTo)) {
                this.$tipFrom.text(
                    isValues ? this.settings.values[this.settings.valueFrom] : Math.round(this.settings.valueFrom),
                );
                tfw = parseFloat(this.$tipFrom.css('width'));
                this.$tipFrom.css('left', this.handleFrom.x + (chw - tfw) / 2);
            }
        }
        //------------------------------------------------------------
        tfx = parseFloat(this.$tipFrom.css('left'));
        ttx = parseFloat(this.$tipTo.css('left'));
        let distanceMin = tfx - tiw;
        const distanceMax = tax - ttx - ttw;
        let distancBetweenTipFromAndTipMax = 1;
        distancBetweenTipFromAndTipMax = tax - tfx - tfw;
        distanceMin < 1 ? this.$tipMin.hide() : this.$tipMin.show();
        distanceMax < 1 ? this.$tipMax.hide() : this.$tipMax.show();
        if (distancBetweenTipFromAndTipMax < 1) this.$tipMax.hide();

        if (!isTwoHandles) {
            distanceMin = ttx - tiw;
            distanceMin < 1 ? this.$tipMin.hide() : this.$tipMin.show();
        }
        //-----------------------------------------------------------
        return {
            isFromHandle: currentHandle.is(this.$handleFrom) ? true : false,
            value: newValue,
        };
    }
    drawSlider1() {}
    redrawSlider1() {
        this.drawSlider1();
    }
    drawLineByStep(step: number) {
        $('.rangeslider__thinline').remove();
        $('.rangeslider__thinline-half').remove();

        const isValues = this.settings.values && this.settings.values.length > 1;
        const pxLength = parseFloat($('.rangeslider__line').css('width')) - this.offsetRight;
        const pxStep = isValues
            ? (pxLength - this.offsetLeft) / (this.settings.values.length - 1)
            : this.convertRelativeValueToPixelValue(this.settings.minValue, step, this.settings.maxValue);
        console.log(pxStep);
        console.log(pxLength);
        console.log('------');
        let lastStep = 0;
        for (let i = this.offsetLeft; i < pxLength; i += pxStep) {
            console.log(i);
            this.drawThinLine(i);
            if (i + pxStep < pxLength) this.drawThinLine(i + pxStep / 2, 'rangeslider__thinline-half');
            else lastStep = i + (pxLength - i) / 2;
        }
        this.drawThinLine(pxLength);
        this.drawThinLine(lastStep, 'rangeslider__thinline-half');
        //----------------------------------------------------------
    }
    drawThinLine(pos: number, cls = 'rangeslider__thinline') {
        const newdiv = document.createElement('div');
        $(newdiv)
            .addClass(cls)
            .css('left', pos);
        $('.rangeslider').append(newdiv);
    }
    drawSlider(os: ExamplePluginOptions, ns: ExamplePluginOptions, isFirstDraw = false) {
        this.settings = ns;
        const hfx = parseFloat(this.$handleFrom.css('left'));
        const hfw = parseFloat(this.$handleFrom.css('width'));
        const htx = parseFloat(this.$handleTo.css('left'));
        const htw = parseFloat(this.$handleTo.css('width'));
        const tfx = parseFloat(this.$tipFrom.css('left'));
        const tfw = parseFloat(this.$tipFrom.css('width'));
        const ttx = parseFloat(this.$tipTo.css('left'));
        const ttw = parseFloat(this.$tipTo.css('width'));
        const tix = parseFloat(this.$tipMin.css('left'));
        const tiw = parseFloat(this.$tipMin.css('width'));
        const tax = parseFloat(this.$tipMax.css('left'));
        const taw = parseFloat(this.$tipMax.css('width'));
        const lx = parseFloat(this.$line.css('left'));
        const lw = parseFloat(this.$line.css('width'));
        const lsx = parseFloat(this.$lineSelected.css('left'));
        const lsw = parseFloat(this.$lineSelected.css('width'));
        //if (ns.stepValue > 0) this.drawLineByStep(ns.stepValue);
        //-------------------------------------------------------------------
        if (!isFirstDraw) {
        }
        if (isFirstDraw || ns.isInterval != os.isInterval) {
            const countHandles = this.$rangeslider.find('.rangeslider__handle');
            if (ns.isInterval) {
                this.$handleFrom.show();
                this.$lineSelected.removeClass('rangeslider__line-selected_isOneHandle');
            } else {
                this.$handleFrom.hide();
                this.$lineSelected.addClass('rangeslider__line-selected_isOneHandle');
                this.$tipFrom.hide();
                this.$lineSelected.css('left', 0);
            }
        }
        //------------------------------------------------------------
        if (ns.isTip) {
            if (ns.isInterval) this.$tipFrom.show();
            this.$tipTo.show();
        } else {
            if (ns.isInterval) this.$tipFrom.hide();
            this.$tipTo.hide();
        }
        //------------------------------------------------------------
        if (isFirstDraw || ns.minValue != os.minValue) {
            this.$tipMin.text(ns.minValue);
        }
        if (isFirstDraw || ns.maxValue != os.maxValue) {
            this.$tipMax.text(ns.maxValue);
        }
        //-------------------------------------------------------------
        if (isFirstDraw || ns.values != os.values) {
            if (ns.values) {
                const count = ns.values.length;
                if (count > 1) {
                    this.$tipMin.text(ns.values[0]);
                    this.$tipMax.text(ns.values[count - 1]);
                }
            }
        }
        //-------------------------------------------------------------
        if (ns.isInterval)
            if (
                isFirstDraw ||
                ns.valueFrom != os.valueFrom ||
                ns.minValue != os.minValue ||
                ns.maxValue != os.maxValue
            ) {
                this.moveHandle(
                    this.$handleFrom,
                    this.convertRelativeValueToPixelValue(ns.minValue, ns.valueFrom, ns.maxValue),
                );
            }
        //-----------------------------------------------------------------
        if (isFirstDraw || ns.valueTo != os.valueTo || ns.minValue != os.minValue || ns.maxValue != os.maxValue) {
            this.moveHandle(
                this.$handleTo,
                this.convertRelativeValueToPixelValue(ns.minValue, ns.valueTo, ns.maxValue),
            );
        }
        //-----------------------------------------------------------------------
        if (isFirstDraw || ns.stepValue != os.stepValue) {
        }
    }
    removeDOMelements() {}
    emptyList() {
        if (this.list) this.list.innerHTML = '';
    }
    addTask(text: string, inx: number) {
        // const taskView = new TaskView(text, inx);
        // taskView.onRemoveTaskCb = this.onRemoveTaskCb;
        // if (this.list) this.list.appendChild(taskView.render());
    }
}
