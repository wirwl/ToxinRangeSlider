import Handle from '../core/entities/handle';
import Tip from './entities/tip';
import Line from './entities/line';
import Rangeslider from './entities/rangeslider';
import CRangeSliderOptions from './entities/crangeslideroptions';
export default class TRSView {
    settings: CRangeSliderOptions;
    private offsetFrom: number;
    private offsetTo: number;
    private template =
        "<div class='rangeslider'>" +
        "<div class='rangeslider__tip-min'>00</div>" +
        "<div class='rangeslider__tip rangeslider__tip-from'>23</div>" +
        "<div class='rangeslider__tip rangeslider__tip-to'>456</div>" +
        "<div class='rangeslider__tip-max'>99</div>" +
        "<div class='rangeslider__line'></div>" +
        "<div class='rangeslider__line-selected'></div>" +
        "<div class='rangeslider__handle rangeslider__handle-from'></div>" +
        "<div class='rangeslider__handle rangeslider__handle-to'></div>" +
        '</div>';
    el: JQuery<Element>;
    rangeslider: Rangeslider;
    list: HTMLUListElement | null;
    onSubmitCb: Function;
    onRemoveTaskCb: Function;
    onHandlePositionUpdate: Function;
    data: RangeSliderOptions;
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
        this.handleFrom.el.mousedown(e => this.onMouseDownByHandle(e));
        this.offsetFrom = this.handleFrom.width / 2;

        this.handleTo = new Handle(this.rangeslider.el.find('.rangeslider__handle-to'), this.tipTo);
        this.handleTo.el.mousedown(e => this.onMouseDownByHandle(e));
        this.offsetTo = this.handleTo.width / 2;

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
        this.settings = new CRangeSliderOptions();
    }
    drawSlider(os: CRangeSliderOptions, ns: CRangeSliderOptions | RangeSliderOptions, isFirstDraw = false) {
        this.settings.extend(ns);
        const isItemValuesChanged = !this.isEqualArrays(os?.items?.values, ns.items.values);

        if (ns.isVertical != os?.isVertical) {
            this.rangeslider.isVertical = ns.isVertical;
            isFirstDraw = true;
        }

        if (isFirstDraw || ns.isTwoHandles != os?.isTwoHandles) {
            this.rangeslider.isInterval = ns.isTwoHandles;
            isFirstDraw = true;
        }
        if (isFirstDraw || ns.isTip != os?.isTip)
            if (ns.isTip) {
                if (ns.isTwoHandles) this.tipFrom.show();
                this.tipTo.show();
                this.tipMin.show();
                this.tipMax.show();
            } else {
                if (ns.isTwoHandles) this.tipFrom.hide();
                this.tipTo.hide();
                this.tipMin.hide();
                this.tipMax.hide();
            }

        if (isFirstDraw || ns.minValue != os.minValue) {
            this.tipMin.text = ns.minValue;
        }
        if (isFirstDraw || ns.maxValue != os.maxValue) {
            this.tipMax.text = ns.maxValue;
        }

        if (isFirstDraw || isItemValuesChanged) {
            if (ns.items.values) {
                const count = ns.items.values.length;
                if (count > 1) {
                    this.tipMin.text = ns.items.values[0];
                    this.tipMax.text = ns.items.values[count - 1];
                }
            }
        }

        if (ns.isTwoHandles)
            if (
                isFirstDraw ||
                ns.valueFrom != os.valueFrom ||
                ns.minValue != os.minValue ||
                ns.maxValue != os.maxValue ||
                isItemValuesChanged
            ) {
                const val = this.settings.isHaveItems
                    ? this.settings.items.indexFrom
                    : (this.settings.valueFrom as number);
                const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
                const posXWithStep = this.getSteppedPos(posXWithOutStep + this.line.offset + this.offsetFrom);
                this.moveHandle(this.handleFrom, posXWithStep == null ? posXWithOutStep : posXWithStep);
            }

        if (
            isFirstDraw ||
            ns.valueTo != os.valueTo ||
            ns.minValue != os.minValue ||
            ns.maxValue != os.maxValue ||
            isItemValuesChanged
        ) {
            const val = this.settings.isHaveItems ? this.settings.items.indexTo : (this.settings.valueTo as number);
            const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
            const posXWithStep = this.getSteppedPos(
                posXWithOutStep + this.line.offset + this.handleTo.size - this.offsetTo,
            );
            this.moveHandle(this.handleTo, posXWithStep == null ? posXWithOutStep : posXWithStep);
        }
        if (this.settings.isHaveItems) {
            const pxLength = this.line.size - this.offsetFrom - this.offsetTo;
            const pxStep = pxLength / this.settings.items.values.length;
            if (this.settings.isTwoHandles && (isFirstDraw || ns.items.indexFrom != os.items.indexFrom)) {
                const newPos = ns.items.indexFrom * pxStep;
                this.moveHandle(this.handleFrom, newPos);
            }

            if (isFirstDraw || ns.items.indexTo != os.items.indexTo) {
                const newPos = ns.items.indexTo * pxStep;
                this.moveHandle(this.handleTo, newPos);
            }
        }
    }
    isEqualArrays(ar1: (string | number)[], ar2: (string | number)[]): boolean {
        if (!ar1 || !ar2) return false;
        if (ar1.length != ar2.length) return false;
        for (let i = 0; i < ar1.length; i++) if (ar1[i] !== ar2[i]) return false;
        return true;
    }
    onMouseDownByHandle(e: JQuery.MouseDownEvent) {
        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        const currentHandle: Handle = $(e.target).is(this.handleFrom.el) ? this.handleFrom : this.handleTo;
        currentHandle.isMoving = true;
        const shiftPos = clientPos - currentHandle.offset;

        this.rangeslider.el.mousemove(e => this.onMouseMove(e, currentHandle, shiftPos));
        $(document).mousemove(e => this.onMouseMove(e, currentHandle, shiftPos));
        currentHandle.el.mouseup(e => this.onMouseUp(e, currentHandle));
        $(document).mouseup(e => this.onMouseUp(e, currentHandle));
    }
    onMouseMove(e: JQuery.MouseMoveEvent, currentHandle: Handle, shiftPos: number) {
        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        const offsetPos = this.settings.isVertical ? e.offsetY : e.offsetX;
        const $target = $(e.target);
        const targetOffset = this.settings.isVertical ? $target.offset().top : $target.offset().left;

        let newPos = this.getSteppedPos(offsetPos + targetOffset);
        if (newPos == null) newPos = clientPos - this.line.offset - shiftPos;
        newPos = this.validate(newPos, currentHandle);

        this.onHandlePositionUpdate(currentHandle, newPos);

        return false;
    }
    validate(pos: number, currentHandle: Handle): number {
        let result = pos;
        const lw = this.line.size;
        const ch = currentHandle;

        if (this.settings.isTwoHandles) {
            if (ch.is(this.handleFrom) && pos < 0) result = 0;
            if (ch.is(this.handleFrom) && pos > this.handleTo.pos) result = this.handleTo.pos;
            if (ch.is(this.handleTo) && pos > lw - ch.size) result = lw - ch.size;
            if (ch.is(this.handleTo) && pos < this.handleFrom.pos) result = this.handleFrom.pos;
        } else {
            if (pos < 0) result = 0;
            if (pos > lw - ch.size) result = lw - ch.size;
        }

        return result;
    }
    onMouseUp(e: JQuery.MouseUpEvent, currentHandle: Handle) {
        currentHandle.isMoving = false;
        this.rangeslider.el.off('mousemove');
        currentHandle.el.off('mouseup');
        $(document).off('mousemove');
        $(document).off('mouseup');
    }
    onMouseDownByLine(e: JQuery.MouseDownEvent) {
        e.preventDefault();
        let offsetPos = this.settings.isVertical ? e.offsetY : e.offsetX;

        if (offsetPos < this.offsetFrom) offsetPos = this.offsetFrom;
        if (offsetPos > this.line.size - this.offsetTo) offsetPos = this.line.size - this.offsetTo;

        console.log(offsetPos);
        const nearHandle = this.getNearestHandle(offsetPos);

        let newPos = this.getSteppedPos(offsetPos + this.line.offset);
        if (!newPos)
            newPos =
                offsetPos - (nearHandle.is(this.handleFrom) ? this.offsetFrom : this.handleTo.size - this.offsetTo);
        this.onHandlePositionUpdate(nearHandle, newPos);

        const newEvent = e;
        newEvent.target = nearHandle.el;
        nearHandle.el.trigger(newEvent, 'mousedown');
    }
    getNearestHandle(pos: number): Handle {
        if (this.settings.isTwoHandles) {
            if (pos < this.handleFrom.pos) return this.handleFrom;
            if (pos > this.handleTo.pos) return this.handleTo;
            const distanceBetweenHandles = this.handleTo.pos - this.handleFrom.pos - this.handleFrom.size;
            const half = this.handleFrom.pos + this.handleFrom.size + distanceBetweenHandles / 2;
            if (pos < half) return this.handleFrom;
            else return this.handleTo;
        } else {
            return this.handleTo;
        }
    }
    moveHandle(currentHandle: Handle, pxX: number): HandleMovingResult {
        const isHandleFrom = currentHandle.is(this.handleFrom);
        currentHandle.pos = pxX;
        let restoreIndex = -1;
        if (this.settings.isHaveItems) {
            const lw = this.line.size - this.offsetFrom - this.offsetTo;
            const pxStep = lw / this.settings.items.values.length;
            restoreIndex = Math.round(pxX / pxStep);
            if (currentHandle.is(this.handleFrom)) this.settings.items.indexFrom = restoreIndex;
            else this.settings.items.indexTo = restoreIndex;
        } else {
            if (currentHandle.is(this.handleFrom)) this.settings.valueFrom = this.convertPixelValueToRelativeValue(pxX);
            else this.settings.valueTo = this.convertPixelValueToRelativeValue(pxX);
        }

        if (currentHandle.is(this.handleFrom)) {
            this.handleFrom.incZIndex();
            this.handleTo.decZIndex();
        } else {
            this.handleTo.incZIndex();
            this.handleFrom.decZIndex();
        }
        this.drawLineSelected(currentHandle);
        this.drawTips(currentHandle);

        return {
            isFromHandle: currentHandle.is(this.handleFrom),
            value: isHandleFrom ? this.settings.valueFrom : this.settings.valueTo,
            isUsingItems: this.settings.isHaveItems,
            index: restoreIndex,
        };
    }
    drawLineSelected(currentHandle: Handle) {
        if (this.settings.isTwoHandles) {
            if (currentHandle.is(this.handleFrom)) this.lineSelected.pos = this.handleFrom.pos + this.offsetFrom;
            this.lineSelected.size =
                this.handleTo.pos - this.handleFrom.pos + this.handleTo.size - this.offsetFrom - this.offsetTo + 1;
        } else {
            this.lineSelected.size = currentHandle.pos + currentHandle.size - this.offsetTo + 1;
        }
    }
    drawTips(currentHandle: Handle) {
        this.tipFrom.text = this.settings.valueFrom;
        this.tipTo.text = this.settings.valueTo;

        this.tipFrom.pos = this.handleFrom.pos + (this.handleFrom.size - this.tipFrom.size) / 2;
        this.tipTo.pos = this.handleTo.pos + (this.handleTo.size - this.tipTo.size) / 2;

        if (this.settings.isTwoHandles) {
            const distanceBetweenHandles = this.tipTo.pos - this.tipFrom.pos - this.tipFrom.size;
            if (distanceBetweenHandles < 1) {
                this.tipTo.hide();
                this.tipFrom.text = this.tipFrom.text + '-' + this.tipTo.text;
                this.tipFrom.pos =
                    this.handleFrom.pos +
                    (this.handleTo.pos - this.handleFrom.pos + this.handleTo.size - this.tipFrom.size) / 2;
            } else {
                if (this.settings.isTip) this.tipTo.show();
            }
            if (
                (!this.settings.isHaveItems && this.settings.valueFrom == this.settings.valueTo) ||
                (this.settings.isHaveItems && this.settings.items.indexFrom == this.settings.items.indexTo)
            ) {
                this.tipFrom.text = this.settings.valueFrom;
                this.tipFrom.pos = this.handleFrom.pos + (this.handleFrom.size - this.tipFrom.size) / 2;
            }
        }

        if (this.settings.isTip) {
            const tax = this.line.size - this.tipMax.size;
            let distanceMin = this.tipFrom.pos - this.tipMin.size;
            const distanceMax = tax - this.tipTo.pos - this.tipTo.size;
            let distancBetweenTipFromAndTipMax = 1;
            distancBetweenTipFromAndTipMax = tax - this.tipFrom.pos - this.tipFrom.size;
            distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
            distanceMax < 1 ? this.tipMax.hide() : this.tipMax.show();
            if (distancBetweenTipFromAndTipMax < 1) this.tipMax.hide();

            if (!this.settings.isTwoHandles) {
                distanceMin = this.tipTo.pos - this.tipMin.size;
                distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
            }
        }
    }
    convertRelativeValueToPixelValue(val: number): number {
        const lw = this.line.size - this.offsetFrom - this.offsetTo;
        const isHasValues = this.settings.items.values.length > 1;
        let result;
        if (isHasValues) {
            const pxStep = lw / this.settings.items.values.length;
            result = val * pxStep;
        } else {
            const relLength = (this.settings.maxValue as number) - (this.settings.minValue as number);
            const relPercent = (val - (this.settings.minValue as number)) / relLength;
            result = lw * relPercent;
        }
        return result;
    }
    convertPixelValueToRelativeValue(val: number): number {
        const lw = this.line.size - this.offsetFrom - this.offsetTo;
        const percent = val / lw;
        const result = Math.round(
            (this.settings.minValue as number) +
                percent * ((this.settings.maxValue as number) - (this.settings.minValue as number)),
        );
        return result;
    }
    getSteppedPos(clientPos: number): number {
        const pxLength = this.line.size - this.offsetFrom - this.offsetTo;
        const isDefinedStep = this.settings.stepValue > 0;
        const isDefinedSetOfValues = this.settings.items.values.length > 1;
        const isTooLongLine = pxLength > (this.settings.maxValue as number) - (this.settings.minValue as number);
        const isNeedStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

        if (isNeedStep) {
            const pos = clientPos - this.line.offset - this.offsetFrom;

            let pxStep: number;

            if (isDefinedStep)
                pxStep = this.convertRelativeValueToPixelValue(
                    (this.settings.minValue as number) + this.settings.stepValue,
                );

            if (isTooLongLine) {
                pxStep = pxLength / ((this.settings.maxValue as number) - (this.settings.minValue as number));
                if (isDefinedStep) pxStep = pxStep * this.settings.stepValue;
            }

            if (isDefinedSetOfValues) {
                pxStep = pxLength / this.settings.items.values.length;
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
}
