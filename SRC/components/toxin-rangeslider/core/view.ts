//import $ from 'jQuery';
//let $: JQueryStatic = require('jquery');
import Handle from '../core/entities/handle';
import Tip from './entities/tip';
import Line from './entities/line';
import { HttpMethod } from 'puppeteer';
//type resultMoveHandle = { isFromHandle: boolean; value: number };
export default class TRSView {
    private settings: ExamplePluginOptions;
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
    $line: JQuery<HTMLElement>;
    input: HTMLInputElement | null;
    $input: JQuery<Element>;
    list: HTMLUListElement | null;
    onSubmitCb: Function;
    onRemoveTaskCb: Function;
    onHandlePositionUpdate: Function;
    data: ExamplePluginOptions;
    handleFrom: Handle;
    handleTo: Handle;
    tipFrom: Tip;
    tipTo: Tip;
    tipMin: Tip;
    tipMax: Tip;
    lineSelected: Line;
    constructor(el: JQuery<HTMLElement>) {
        this.el = el;
        this.el.html(this.template);
        this.$rangeslider = el.find('.rangeslider');
        this.$line = el.find('.rangeslider__line');
        this.data = el.data('options');
        this.tipFrom = new Tip(el.find('.rangeslider__tip-from'));
        this.tipTo = new Tip(el.find('.rangeslider__tip-to'));
        this.tipMin = new Tip(el.find('.rangeslider__tip-min'));
        this.tipMax = new Tip(el.find('.rangeslider__tip-max'));

        this.handleFrom = new Handle(this.$rangeslider.find('.rangeslider__handle-from'), this.tipFrom);
        this.handleFrom.el[0].ondragstart = function() {
            return false;
        };
        this.handleFrom.el.mousedown(e => this.onMouseDown(e));
        this.offsetLeft = this.handleFrom.width / 2;

        this.handleTo = new Handle(this.$rangeslider.find('.rangeslider__handle-to'), this.tipTo);
        this.handleTo.el.mousedown(e => this.onMouseDown(e));
        this.offsetRight = this.handleTo.width / 2;

        this.$line.mousedown(e => this.onMouseDownByLine(e));

        this.lineSelected = new Line(this.$rangeslider.find('.rangeslider__line-selected'));
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
    validate(pos: number): number {
        let result = pos;
        const lw = parseFloat(this.$line.css('width'));
        const ch = this.handleFrom.isMoving ? this.handleFrom : this.handleTo;
        console.log('from x:' + this.handleFrom.x);
        console.log('  to x:' + this.handleTo.x);
        if (pos < 0) result = 0;
        if (pos > lw - ch.width) result = lw - ch.width;
        if (this.settings.isInterval) {
            if (ch.is(this.handleFrom)) if (pos > this.handleTo.x) result = this.handleTo.x;
            if (ch.is(this.handleTo)) if (pos < this.handleFrom.x) result = this.handleFrom.x;
        }
        return result;
    }
    getNearestHandle(pos: number): Handle {
        if (this.settings.isInterval) {
            if (pos < this.handleFrom.x) return this.handleFrom;
            if (pos > this.handleTo.x) return this.handleTo;
            const distanceBetweenHandles = this.handleTo.x - this.handleFrom.x - this.handleFrom.width;
            const half = this.handleFrom.x + this.handleFrom.width + distanceBetweenHandles / 2;
            if (pos < half) return this.handleFrom;
            else return this.handleTo;
        } else {
            if (pos < this.handleTo.x) return this.handleFrom;
            else return this.handleTo;
        }
    }
    onMouseUp(e: JQuery.MouseUpEvent, currentHandle: Handle) {
        this.$rangeslider.off('mousemove');
        currentHandle.el.off('mouseup');
    }
    onMouseDown(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        const currentHandle: Handle = $(e.target).is(this.handleFrom.el) ? this.handleFrom : this.handleTo;
        const shiftX = e.clientX - currentHandle.el.offset().left;

        this.$rangeslider.mousemove(e => this.onHandleMove(e, currentHandle, shiftX));
        currentHandle.el.mouseup(e => this.onMouseUp(e, currentHandle));
        $(document).mouseup(e => this.onMouseUp(e, currentHandle));
    }
    onMouseDownByLine(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        const $currentHandle: JQuery<HTMLElement> = $(e.target);
        let pos = e.clientX - $currentHandle.offset().left;
        const nearHandle = this.getNearestHandle(pos);
        pos = nearHandle.is(this.handleFrom) ? pos - this.offsetLeft : pos - this.offsetRight;
        this.onHandlePositionUpdate(nearHandle, pos);
    }

    onHandleMove(e: JQuery.MouseMoveEvent, currentHandle: Handle, shiftX: number) {
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
            let totalstep = Math.round(pxLength / pxStep);

            if (this.settings.values) {
                const count = this.settings.values.length;
                if (count > 1) {
                    pxStep = pxLength / (count - 1);
                    totalstep = count;
                }
            }

            let nstep = Math.round(pos / pxStep);

            if (Math.trunc(pos / pxStep) >= totalstep - 1) {
                const prevnStep = (totalstep - 1) * pxStep;
                const pxLastStepHalf = (pxLength - prevnStep) / 2;
                if (pos > prevnStep + pxLastStepHalf) nstep = totalstep;
            }
            this.onHandlePositionUpdate(currentHandle, nstep * pxStep);
        } else this.onHandlePositionUpdate(currentHandle, newLeft);
    }
    getValue(val: number): any {
        const isValues = this.settings.values.length > 1;
        return isValues ? this.settings.values[val] : Math.round(val);
    }
    drawLineSelected(currentHandle: Handle) {
        if (this.settings.isInterval) {
            if (currentHandle.is(this.handleFrom)) this.lineSelected.x = this.handleFrom.x + this.offsetLeft;
            this.lineSelected.width =
                this.handleTo.x - this.handleFrom.x + this.handleTo.width - this.offsetLeft - this.offsetRight + 1;
        } else {
            this.lineSelected.width = currentHandle.x + currentHandle.width - this.offsetRight + 1;
        }
    }
    drawTips(currentHandle: Handle) {
        const lw = parseFloat(this.$line.css('width'));

        currentHandle.value = this.convertPixelValueToRelativeValue(currentHandle.x);
        currentHandle.displayValue = this.getValue(currentHandle.value);
        //-----------------------------------------------------------
        this.tipFrom.text = this.handleFrom.displayValue;
        this.tipTo.text = this.handleTo.displayValue;
        //-------------------------------------------
        this.tipFrom.x = this.handleFrom.x + (this.handleFrom.width - this.tipFrom.width) / 2;
        this.tipTo.x = this.handleTo.x + (this.handleTo.width - this.tipTo.width) / 2;
        //------------------------------------------------------------
        if (this.settings.isInterval) {
            const distanceBetweenHandles = this.tipTo.x - this.tipFrom.x - this.tipFrom.width;
            if (distanceBetweenHandles < 1) {
                this.tipTo.hide();
                this.tipFrom.text = this.tipFrom.text + '-' + this.tipTo.text;
                this.tipFrom.x =
                    this.handleFrom.x +
                    (this.handleTo.x - this.handleFrom.x + this.handleTo.width - this.tipFrom.width) / 2;
            } else {
                this.tipTo.show();
            }
            if (this.handleFrom.displayValue == this.handleTo.displayValue) {
                this.tipFrom.text = this.handleFrom.displayValue;
                this.tipFrom.x = this.handleFrom.x + (this.handleFrom.width - this.tipFrom.width) / 2;
            }
        }
        //------------------------------------------------------------
        const tax = lw - this.tipMax.width;
        let distanceMin = this.tipFrom.x - this.tipMin.width;
        const distanceMax = tax - this.tipTo.x - this.tipTo.width;
        let distancBetweenTipFromAndTipMax = 1;
        distancBetweenTipFromAndTipMax = tax - this.tipFrom.x - this.tipFrom.width;
        distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
        distanceMax < 1 ? this.tipMax.hide() : this.tipMax.show();
        if (distancBetweenTipFromAndTipMax < 1) this.tipMax.hide();

        if (!this.settings.isInterval) {
            distanceMin = this.tipTo.x - this.tipMin.width;
            distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
        }
    }
    moveHandle(currentHandle: Handle, pxX: number): Handle {
        currentHandle.isMoving = true;

        currentHandle.x = this.validate(pxX);
        if (currentHandle.is(this.handleFrom)) {
            this.handleFrom.incZIndex();
            this.handleTo.decZIndex();
        } else {
            this.handleTo.incZIndex();
            this.handleFrom.decZIndex();
        }

        this.drawLineSelected(currentHandle);
        this.drawTips(currentHandle);

        currentHandle.isMoving = false;
        return currentHandle;
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
        //if (ns.stepValue > 0) this.drawLineByStep(ns.stepValue);
        //-------------------------------------------------------------------
        if (isFirstDraw || ns.isInterval != os.isInterval) {
            if (ns.isInterval) {
                this.handleFrom.show();
                this.lineSelected.el.removeClass('rangeslider__line-selected_isOneHandle');
            } else {
                this.handleFrom.hide();
                this.lineSelected.el.addClass('rangeslider__line-selected_isOneHandle');
                this.tipFrom.hide();
                this.lineSelected.x = 0;
            }
        }
        //------------------------------------------------------------
        if (ns.isTip) {
            if (ns.isInterval) this.tipFrom.show();
            this.tipTo.show();
        } else {
            if (ns.isInterval) this.tipFrom.hide();
            this.tipTo.hide();
        }
        //------------------------------------------------------------
        if (isFirstDraw || ns.minValue != os.minValue) {
            this.tipMin.text = ns.minValue;
        }
        if (isFirstDraw || ns.maxValue != os.maxValue) {
            this.tipMax.text = ns.maxValue;
        }
        //-------------------------------------------------------------
        if (isFirstDraw || ns.values != os.values) {
            if (ns.values) {
                const count = ns.values.length;
                if (count > 1) {
                    this.tipMin.text = ns.values[0];
                    this.tipMax.text = ns.values[count - 1];
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
                    this.handleFrom,
                    this.convertRelativeValueToPixelValue(ns.minValue, ns.valueFrom, ns.maxValue),
                );
            }
        //-----------------------------------------------------------------
        if (isFirstDraw || ns.valueTo != os.valueTo || ns.minValue != os.minValue || ns.maxValue != os.maxValue) {
            this.moveHandle(this.handleTo, this.convertRelativeValueToPixelValue(ns.minValue, ns.valueTo, ns.maxValue));
        }
        //-----------------------------------------------------------------------
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
