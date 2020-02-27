import Handle from '../core/entities/handle';
import Tip from './entities/tip';
import Line from './entities/line';
import Rangeslider from './entities/rangeslider';
export default class TRSView {
    private settings: ExamplePluginOptions;
    private offsetLeft: number;
    private offsetRight: number;
    private template =
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
    //$rangeslider: JQuery<HTMLElement>;
    rangeslider: Rangeslider;
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
    line: Line;
    lineSelected: Line;
    constructor(el: JQuery<HTMLElement>) {
        this.el = el;
        this.el.html(this.template);

        this.rangeslider = new Rangeslider(el.find('.rangeslider'));

        this.line = new Line(el.find('.rangeslider__line'));
        this.line.el.mousedown(e => this.onMouseDownByLine(e));

        this.lineSelected = new Line(this.rangeslider.el.find('.rangeslider__line-selected'));

        this.data = el.data('options');
        this.tipFrom = new Tip(el.find('.rangeslider__tip-from'));
        this.tipTo = new Tip(el.find('.rangeslider__tip-to'));
        this.tipMin = new Tip(el.find('.rangeslider__tip-min'));
        this.tipMax = new Tip(el.find('.rangeslider__tip-max'));

        this.handleFrom = new Handle(this.rangeslider.el.find('.rangeslider__handle-from'), this.tipFrom);
        this.handleFrom.el.mousedown(e => this.onMouseDown(e));
        this.offsetLeft = this.handleFrom.width / 2;

        this.handleTo = new Handle(this.rangeslider.el.find('.rangeslider__handle-to'), this.tipTo);
        this.handleTo.el.mousedown(e => this.onMouseDown(e));
        this.offsetRight = this.handleTo.width / 2;

        this.rangeslider.addControls([
            this.tipMin,
            this.tipFrom,
            this.tipTo,
            this.tipMax,
            this.handleFrom,
            this.handleTo,
            this.line,
            this.lineSelected,
        ]);
        console.log(this.rangeslider.controls);
    }

    convertRelativeValueToPixelValue(val: number): number {
        const lw = this.line.size - this.offsetLeft - this.offsetRight;
        let result;
        if (this.settings.values && this.settings.values.length > 1) {
            const pxStep = lw / (this.settings.values.length - 1);
            result = val * pxStep;
        } else {
            const percent = ((val - this.settings.minValue) / (this.settings.maxValue - this.settings.minValue)) * 100;
            result = lw * (percent / 100);
        }
        return result;
    }
    convertPixelValueToRelativeValue(val: number): number {
        const lw = this.line.size - this.offsetLeft - this.offsetRight;
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
    validate(pos: number, currentHandle: Handle): number {
        let result = pos;
        const lw = this.line.size;
        const ch = currentHandle;
        //this.handleFrom.isMoving ? this.handleFrom : this.handleTo;
        if (pos < 0) result = 0;
        if (pos > lw - ch.size) result = lw - ch.size;
        if (this.settings.isInterval) {
            if (ch.is(this.handleFrom)) if (pos > this.handleTo.pos) result = this.handleTo.pos;
            if (ch.is(this.handleTo)) if (pos < this.handleFrom.pos) result = this.handleFrom.pos;
        }
        return result;
    }
    getNearestHandle(pos: number): Handle {
        if (this.settings.isInterval) {
            if (pos < this.handleFrom.pos) return this.handleFrom;
            if (pos > this.handleTo.pos) return this.handleTo;
            const distanceBetweenHandles = this.handleTo.pos - this.handleFrom.pos - this.handleFrom.size;
            const half = this.handleFrom.pos + this.handleFrom.size + distanceBetweenHandles / 2;
            if (pos < half) return this.handleFrom;
            else return this.handleTo;
        } else {
            if (pos < this.handleTo.pos) return this.handleFrom;
            else return this.handleTo;
        }
    }
    onMouseUp(e: JQuery.MouseUpEvent, currentHandle: Handle) {
        this.rangeslider.el.off('mousemove');
        currentHandle.el.off('mouseup');
    }
    onMouseDown(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        const currentHandle: Handle = $(e.target).is(this.handleFrom.el) ? this.handleFrom : this.handleTo;
        const shiftPos = clientPos - currentHandle.offset;

        this.rangeslider.el.mousemove(e => this.onHandleMove(e, currentHandle, shiftPos));
        currentHandle.el.mouseup(e => this.onMouseUp(e, currentHandle));
        $(document).mouseup(e => this.onMouseUp(e, currentHandle));
    }
    onMouseDownByLine(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        const pos = clientPos - this.line.offset;

        const nearHandle = this.getNearestHandle(pos);
        const posWithoutStep =
            pos - (nearHandle.is(this.handleFrom) ? this.offsetLeft : this.handleTo.size - this.offsetRight);
        const posWithStep = this.getSteppedPos(clientPos);
        this.onHandlePositionUpdate(nearHandle, posWithStep == null ? posWithoutStep : posWithStep);

        const newEvent = e;
        newEvent.target = nearHandle.el;
        nearHandle.el.trigger(newEvent, 'mousedown');
    }
    getSteppedPos(clientPos: number): number {
        const pxLength = this.line.size - this.offsetLeft - this.offsetRight;
        const isDefinedStep = this.settings.stepValue > 0;
        const isDefinedSetOfValues = this.settings.values.length > 1;
        const isTooLongLine = pxLength > this.settings.maxValue - this.settings.minValue;

        if (isDefinedStep || isTooLongLine || isDefinedSetOfValues) {
            const pos = clientPos - this.line.offset - this.offsetLeft;

            let pxStep: number;

            if (isDefinedStep)
                pxStep = this.convertRelativeValueToPixelValue(this.settings.minValue + this.settings.stepValue);

            if (isTooLongLine) {
                pxStep = pxLength / (this.settings.maxValue - this.settings.minValue);
                if (isDefinedStep) pxStep = pxStep * this.settings.stepValue;
            }

            if (isDefinedSetOfValues) {
                pxStep = pxLength / (this.settings.values.length - 1);
            }

            const nStep = Math.round(pos / pxStep);
            let newPos = nStep * pxStep;

            if (pos / pxStep > Math.trunc(pxLength / pxStep)) {
                const remainder = pxLength - newPos;
                if (pos > newPos + remainder / 2) newPos += remainder;
            }
            return newPos;
        }
        return null;
    }
    onHandleMove(e: JQuery.MouseMoveEvent, currentHandle: Handle, shiftPos: number) {
        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        const newPosWithoutStep = clientPos - this.line.offset - shiftPos;
        const newLeftWithStep = this.getSteppedPos(clientPos);
        let newPos = newLeftWithStep == null ? newPosWithoutStep : newLeftWithStep;
        newPos = this.validate(newPos, currentHandle);
        this.onHandlePositionUpdate(currentHandle, newPos);
    }
    getValue(val: number): any {
        const isValues = this.settings.values.length > 1;
        return isValues ? this.settings.values[val] : Math.round(val);
    }
    drawLineSelected(currentHandle: Handle) {
        if (this.settings.isInterval) {
            if (currentHandle.is(this.handleFrom)) this.lineSelected.pos = this.handleFrom.pos + this.offsetLeft;
            this.lineSelected.size =
                this.handleTo.pos - this.handleFrom.pos + this.handleTo.size - this.offsetLeft - this.offsetRight + 1;
        } else {
            this.lineSelected.width = currentHandle.pos + currentHandle.size - this.offsetRight + 1;
        }
    }
    drawTips(currentHandle: Handle) {
        const lw = this.line.size;

        currentHandle.value = this.convertPixelValueToRelativeValue(currentHandle.pos);
        currentHandle.displayValue = this.getValue(currentHandle.value);
        //-----------------------------------------------------------
        this.tipFrom.text = this.handleFrom.displayValue;
        this.tipTo.text = this.handleTo.displayValue;
        //-------------------------------------------
        this.tipFrom.pos = this.handleFrom.pos + (this.handleFrom.size - this.tipFrom.size) / 2;
        this.tipTo.pos = this.handleTo.pos + (this.handleTo.size - this.tipTo.size) / 2;
        //------------------------------------------------------------
        if (this.settings.isInterval) {
            const distanceBetweenHandles = this.tipTo.pos - this.tipFrom.pos - this.tipFrom.size;
            if (distanceBetweenHandles < 1) {
                this.tipTo.hide();
                this.tipFrom.text = this.tipFrom.text + '-' + this.tipTo.text;
                this.tipFrom.pos =
                    this.handleFrom.pos +
                    (this.handleTo.pos - this.handleFrom.pos + this.handleTo.size - this.tipFrom.size) / 2;
            } else {
                this.tipTo.show();
            }
            if (this.handleFrom.displayValue == this.handleTo.displayValue) {
                this.tipFrom.text = this.handleFrom.displayValue;
                this.tipFrom.pos = this.handleFrom.pos + (this.handleFrom.size - this.tipFrom.size) / 2;
            }
        }
        //------------------------------------------------------------
        const tax = lw - this.tipMax.size;
        let distanceMin = this.tipFrom.pos - this.tipMin.size;
        const distanceMax = tax - this.tipTo.pos - this.tipTo.size;
        let distancBetweenTipFromAndTipMax = 1;
        distancBetweenTipFromAndTipMax = tax - this.tipFrom.pos - this.tipFrom.size;
        distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
        distanceMax < 1 ? this.tipMax.hide() : this.tipMax.show();
        if (distancBetweenTipFromAndTipMax < 1) this.tipMax.hide();

        if (!this.settings.isInterval) {
            distanceMin = this.tipTo.pos - this.tipMin.size;
            distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
        }
    }
    moveHandle(currentHandle: Handle, pxX: number): Handle {
        currentHandle.isMoving = true;

        currentHandle.pos = pxX;
        //this.validate(pxX, currentHandle);
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
            : this.convertRelativeValueToPixelValue(step);
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
    evalThickness(isVertical: boolean): number {
        if (isVertical) {
            return 60;
        } else {
            let minTipPos = this.tipTo.y;
            if (this.settings.isInterval && this.tipFrom.y < minTipPos) minTipPos = this.tipFrom.y;
            let maxHandlePos = this.handleTo.y + this.handleTo.height;
            if (this.settings.isInterval && this.handleFrom.y + this.handleFrom.height > maxHandlePos)
                maxHandlePos = this.handleFrom.y + this.handleFrom.height;
            //return maxHandlePos - minTipPos;
            return maxHandlePos;
        }
    }

    drawSlider(os: ExamplePluginOptions, ns: ExamplePluginOptions, isFirstDraw = false) {
        this.settings = ns;
        //if (ns.stepValue > 0) this.drawLineByStep(ns.stepValue);
        //-------------------------------------------------------------------

        //-------------------------------------------------------------------
        if (ns.isVertical != os?.isVertical) this.rangeslider.isVertical = ns.isVertical;
        //-------------------------------------------------------------------
        if (ns.isVertical) {
            this.el.css('width', this.evalThickness(ns.isVertical));
        } else {
            this.el.css('height', this.evalThickness(ns.isVertical));
        }
        //-------------------------------------------------------------------
        if (isFirstDraw || ns.isInterval != os.isInterval) {
            if (ns.isInterval) {
                this.handleFrom.show();
                this.lineSelected.el.removeClass('rangeslider__line-selected_isOneHandle');
            } else {
                this.handleFrom.hide();
                this.lineSelected.el.addClass('rangeslider__line-selected_isOneHandle');
                this.tipFrom.hide();
                this.lineSelected.pos = 0;
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
                const posXWithOutStep = this.convertRelativeValueToPixelValue(ns.valueFrom);
                const posXWithStep = this.getSteppedPos(posXWithOutStep + this.line.offset + this.offsetLeft);
                this.moveHandle(this.handleFrom, posXWithStep == null ? posXWithOutStep : posXWithStep);
            }
        //-----------------------------------------------------------------
        if (isFirstDraw || ns.valueTo != os.valueTo || ns.minValue != os.minValue || ns.maxValue != os.maxValue) {
            const posXWithOutStep = this.convertRelativeValueToPixelValue(ns.valueTo);
            const posXWithStep = this.getSteppedPos(
                posXWithOutStep + this.line.offset + this.handleTo.width - this.offsetRight,
            );
            this.moveHandle(this.handleTo, posXWithStep == null ? posXWithOutStep : posXWithStep);
        }
    }
}
