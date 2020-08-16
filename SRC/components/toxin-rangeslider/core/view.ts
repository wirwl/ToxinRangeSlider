import Handle from '../core/entities/handle';
import Tip from './entities/tip';
import Line from './entities/line';
import Rangeslider from './entities/rangeslider';
import CRangeSliderOptions from './entities/crangeslideroptions';

class TRSView {
    settings: CRangeSliderOptions;
    private offsetFrom: number;
    private offsetTo: number;
    private htmlTemplate =
        `<div class='rangeslider'>
        <div class='rangeslider__tip-min'>00</div>
        <div class='rangeslider__tip rangeslider__tip-from'>23</div>
        <div class='rangeslider__tip rangeslider__tip-to'>456</div>
        <div class='rangeslider__tip-max'>99</div>
        <div class='rangeslider__line'></div>
        <div class='rangeslider__line-selected'></div>
        <div class='rangeslider__handle rangeslider__handle-from'></div>
        <div class='rangeslider__handle rangeslider__handle-to'></div>
        </div>`;
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
        this.el.html(this.htmlTemplate);

        this.rangeslider = new Rangeslider(el.find('.rangeslider'));

        this.line = new Line(el.find('.rangeslider__line'));
        this.line.el.on('mousedown.line', e => this.onMouseDownByLine(e));

        this.lineSelected = new Line(this.rangeslider.el.find('.rangeslider__line-selected'));

        this.data = el.data('options');
        this.tipFrom = new Tip(el.find('.rangeslider__tip-from'));
        this.tipTo = new Tip(el.find('.rangeslider__tip-to'));
        this.tipMin = new Tip(el.find('.rangeslider__tip-min'));
        this.tipMax = new Tip(el.find('.rangeslider__tip-max'));

        this.handleFrom = new Handle(this.rangeslider.el.find('.rangeslider__handle-from'));
        this.handleFrom.el.on('mousedown.handleFrom', e => this.onMouseDownByHandle(e));
        this.offsetFrom = this.handleFrom.getWidth() / 2;

        this.handleTo = new Handle(this.rangeslider.el.find('.rangeslider__handle-to'));
        this.handleTo.el.on('mousedown.handleTo', e => this.onMouseDownByHandle(e));
        this.offsetTo = this.handleTo.getWidth() / 2;

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

    drawSlider(os: CRangeSliderOptions, ns: CRangeSliderOptions, isFirstDraw = false) {
        this.settings.extend(ns);

        if (ns.isVertical != os?.isVertical) {
            this.rangeslider.setIsVertical(ns.isVertical);
            isFirstDraw = true;
        }

        if (isFirstDraw || ns.isTwoHandles != os?.isTwoHandles) {
            this.rangeslider.setIsInterval(ns.isTwoHandles);
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

        if (isFirstDraw || this.settings.getMinValue() != os?.getMinValue()) {
            this.tipMin.setText(this.settings.getMinValue());
        }
        if (isFirstDraw || this.settings.getMaxValue() != os?.getMaxValue()) {
            this.tipMax.setText(this.settings.getMaxValue());
        }

        const isItemValuesChanged = !this.isEqualArrays(os?.items?.values, ns.items?.values);
        if (isFirstDraw || isItemValuesChanged) {
            if (this.settings.items?.values) {
                const count = this.settings.items.values.length;
                if (count > 1) {
                    this.tipMin.setText(this.settings.items.values[0]);
                    this.tipMax.setText(this.settings.items.values[count - 1]);
                }
            }
        }

        if (ns.isTwoHandles)
            if (
                isFirstDraw ||
                ns.getValueFrom() != os.getValueFrom() ||
                ns.getMinValue() != os.getMinValue() ||
                ns.getMaxValue() != os.getMaxValue() ||
                isItemValuesChanged
            ) {
                const val = this.settings.getIsHaveItems()
                    ? this.settings.items.indexFrom
                    : (this.settings.getValueFrom() as number);
                const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
                const posXWithStep = this.getSteppedPos(posXWithOutStep);
                this.moveHandle(this.handleFrom, posXWithStep == null ? posXWithOutStep : posXWithStep);
            }

        if (
            isFirstDraw ||
            ns.getValueTo() != os?.getValueTo() ||
            ns.getMinValue() != os?.getMinValue() ||
            ns.getMaxValue() != os?.getMaxValue() ||
            isItemValuesChanged
        ) {
            const val = this.settings.getIsHaveItems() ? this.settings.items.indexTo : (this.settings.getValueTo() as number);
            const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
            const posXWithStep = this.getSteppedPos(posXWithOutStep);
            this.moveHandle(this.handleTo, posXWithStep == null ? posXWithOutStep : posXWithStep);
        }
        if (this.settings.getIsHaveItems()) {
            const pxLength = this.line.getSize() - this.offsetFrom - this.offsetTo;
            const pxStep = pxLength / (this.settings.items.values.length - 1);
            if (
                this.settings.isTwoHandles &&
                (isFirstDraw || (os && os.items && ns.items.indexFrom != os.items.indexFrom))
            ) {
                const newPos = ns.items.indexFrom * pxStep;
                this.moveHandle(this.handleFrom, newPos);
            }

            if (isFirstDraw || (os && os.items && ns.items.indexTo != os.items.indexTo)) {
                const newPos = ns.items.indexTo * pxStep;
                this.moveHandle(this.handleTo, newPos);
            }
        }
    }

    isEqualArrays(ar1: (string | number)[], ar2: (string | number)[]): boolean {
        if (!ar1 || !ar2) return false;
        if (ar1.length != ar2.length) return false;
        return ar1.every((value, index) => value === ar2[index]);
    }

    onMouseDownByHandle(e: JQuery.TriggeredEvent) {
        const currentHandle: Handle = $(e.target).is(this.handleFrom.el) ? this.handleFrom : this.handleTo;
        currentHandle.setIsMoving(true);
        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        const shiftPos = clientPos - currentHandle.getOffset();

        this.rangeslider.el.on('mousemove.rangeslider', e => this.onMouseMove(e, currentHandle, shiftPos));
        const $document = $(document);
        $document.on('mousemove.document', e => this.onMouseMove(e, currentHandle, shiftPos));
        currentHandle.el.on('mouseup.handle', e => this.onMouseUp(e, currentHandle));
        $document.on('mouseup.document', e => this.onMouseUp(e, currentHandle));
    }

    onMouseMove(e: JQuery.TriggeredEvent, currentHandle: Handle, shiftPos: number) {
        const $target = $(e.target);

        const offsetPos = this.settings.isVertical ? e.offsetY : e.offsetX;
        const targetOffset = this.settings.isVertical ? $target.offset().top : $target.offset().left;
        let newPos = this.getSteppedPos(offsetPos + targetOffset - this.line.getOffset() - this.offsetFrom);

        const clientPos = this.settings.isVertical ? e.clientY : e.clientX;
        if (newPos == null) newPos = clientPos - this.line.getOffset() - shiftPos;
        newPos = this.validate(newPos, currentHandle);

        this.onHandlePositionUpdate(currentHandle, newPos);

        return false;
    }

    validate(pos: number, currentHandle: Handle): number {
        let result = pos;
        const lw = this.line.getSize();
        const ch = currentHandle;

        if (this.settings.isTwoHandles) {
            if (ch.is(this.handleFrom) && pos < 0) result = 0;
            if (ch.is(this.handleFrom) && pos > this.handleTo.getPos()) result = this.handleTo.getPos();
            if (ch.is(this.handleTo) && pos > lw - ch.getSize()) result = lw - ch.getSize();
            if (ch.is(this.handleTo) && pos < this.handleFrom.getPos()) result = this.handleFrom.getPos();
        } else {
            if (pos < 0) result = 0;
            if (pos > lw - ch.getSize()) result = lw - ch.getSize();
        }

        return result;
    }

    onMouseUp(e: JQuery.TriggeredEvent, currentHandle: Handle) {
        currentHandle.setIsMoving(false);
        this.rangeslider.el.off('mousemove.rangeslider');
        currentHandle.el.off('mouseup.handle');
        $(document).off('mousemove.document');
        $(document).off('mouseup.document');
    }

    onMouseDownByLine(e: JQuery.TriggeredEvent) {
        e.preventDefault();
        let offsetPos = this.settings.isVertical ? e.offsetY : e.offsetX;

        if (offsetPos < this.offsetFrom) offsetPos = this.offsetFrom;
        if (offsetPos > this.line.getSize() - this.offsetTo) offsetPos = this.line.getSize() - this.offsetTo;

        const nearHandle = this.getNearestHandle(offsetPos);

        let newPos = this.getSteppedPos(offsetPos - this.offsetFrom);
        if (newPos == null)
            newPos =
                offsetPos - (nearHandle.is(this.handleFrom) ? this.offsetFrom : this.handleTo.getSize() - this.offsetTo);
        this.onHandlePositionUpdate(nearHandle, newPos);

        const newEvent = e;
        newEvent.target = nearHandle.el;
        nearHandle.el.trigger(newEvent, 'mousedown.handle');
    }

    getNearestHandle(pos: number): Handle {
        if (this.settings.isTwoHandles) {
            if (pos < this.handleFrom.getPos()) return this.handleFrom;
            if (pos > this.handleTo.getPos()) return this.handleTo;
            const distanceBetweenHandles = this.handleTo.getPos() - this.handleFrom.getPos() - this.handleFrom.getSize();
            const half = this.handleFrom.getPos() + this.handleFrom.getSize() + distanceBetweenHandles / 2;
            if (pos < half) return this.handleFrom;
            else return this.handleTo;
        } else {
            return this.handleTo;
        }
    }

    moveHandle(currentHandle: Handle, pxX: number): HandleMovingResult {
        currentHandle.setPos(pxX);
        let restoreIndex = -1;
        if (this.settings.getIsHaveItems()) {
            const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
            const pxStep = lw / (this.settings.items.values.length - 1);
            restoreIndex = Math.round(pxX / pxStep);
            if (currentHandle.is(this.handleFrom)) this.settings.items.indexFrom = restoreIndex;
            else this.settings.items.indexTo = restoreIndex;
        } else {
            if (currentHandle.is(this.handleFrom)) this.settings.setValueFrom(this.convertPixelValueToRelativeValue(pxX));
            else this.settings.setValueTo(this.convertPixelValueToRelativeValue(pxX));
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

        const isHandleFrom = currentHandle.is(this.handleFrom);
        return {
            isFromHandle: isHandleFrom,
            value: isHandleFrom ? this.settings.getValueFrom() : this.settings.getValueTo(),
            isUsingItems: this.settings.getIsHaveItems(),
            index: restoreIndex,
        };
    }

    drawLineSelected(currentHandle: Handle) {
        if (this.settings.isTwoHandles) {
            if (currentHandle.is(this.handleFrom)) this.lineSelected.setPos(this.handleFrom.getPos() + this.offsetFrom);
            this.lineSelected.setSize(
                this.handleTo.getPos() - this.handleFrom.getPos() + this.handleTo.getSize() - this.offsetFrom - this.offsetTo + 1);
        } else {
            this.lineSelected.setSize(currentHandle.getPos() + currentHandle.getSize() - this.offsetTo + 1);
        }
    }

    drawTips(currentHandle: Handle) {
        this.tipFrom.setText(this.settings.getValueFrom());
        this.tipTo.setText(this.settings.getValueTo());

        this.tipFrom.setPos(this.handleFrom.getPos() + (this.handleFrom.getSize() - this.tipFrom.getSize()) / 2);
        this.tipTo.setPos(this.handleTo.getPos() + (this.handleTo.getSize() - this.tipTo.getSize()) / 2);

        if (this.settings.isTwoHandles) {
            const distanceBetweenHandles = this.tipTo.getPos() - this.tipFrom.getPos() - this.tipFrom.getSize();
            if (distanceBetweenHandles < 1) {
                this.tipTo.hide();
                this.tipFrom.setText(this.tipFrom.getText() + '-' + this.tipTo.getText());
                this.tipFrom.setPos(
                    this.handleFrom.getPos() +
                    (this.handleTo.getPos() - this.handleFrom.getPos() + this.handleTo.getSize() - this.tipFrom.getSize()) / 2);
            } else {
                if (this.settings.isTip) this.tipTo.show();
            }
            if (
                (!this.settings.getIsHaveItems() && this.settings.getValueFrom() == this.settings.getValueTo()) ||
                (this.settings.getIsHaveItems() && this.settings.items.indexFrom == this.settings.items.indexTo)
            ) {
                this.tipFrom.setText(this.settings.getValueFrom());
                this.tipFrom.setPos(this.handleFrom.getPos() + (this.handleFrom.getSize() - this.tipFrom.getSize()) / 2);
            }
        }

        if (this.settings.isTip) {
            const tax = this.line.getSize() - this.tipMax.getSize();
            let distanceMin = this.tipFrom.getPos() - this.tipMin.getSize();
            const distanceMax = tax - this.tipTo.getPos() - this.tipTo.getSize();
            let distanceBetweenTipFromAndTipMax = 1;
            distanceBetweenTipFromAndTipMax = tax - this.tipFrom.getPos() - this.tipFrom.getSize();
            distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
            distanceMax < 1 ? this.tipMax.hide() : this.tipMax.show();
            if (distanceBetweenTipFromAndTipMax < 1) this.tipMax.hide();

            if (!this.settings.isTwoHandles) {
                distanceMin = this.tipTo.getPos() - this.tipMin.getSize();
                distanceMin < 1 ? this.tipMin.hide() : this.tipMin.show();
            }
        }
    }

    convertRelativeValueToPixelValue(val: number): number {
        const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
        const isHasValues = this.settings.items && this.settings.items.values && this.settings.items.values.length > 1;
        let result;
        if (isHasValues) {
            const pxStep = lw / (this.settings.items.values.length - 1);
            result = val * pxStep;
        } else {
            const relLength = (this.settings.getMaxValue() as number) - (this.settings.getMinValue() as number);
            const relPercent = (val - (this.settings.getMinValue() as number)) / relLength;
            result = lw * relPercent;
        }
        return result;
    }

    convertPixelValueToRelativeValue(val: number): number {
        const lw = this.line.getSize() - this.offsetFrom - this.offsetTo;
        const percent = val / lw;
        const result = Math.round(
            (this.settings.getMinValue() as number) +
            percent * ((this.settings.getMaxValue() as number) - (this.settings.getMinValue() as number)),
        );
        return result;
    }

    getSteppedPos(pxValue: number): number {
        const pxLength = this.line.getSize() - this.offsetFrom - this.offsetTo;
        const isDefinedStep = this.settings.stepValue > 0;
        const isDefinedSetOfValues =
            this.settings.items && this.settings.items.values && this.settings.items.values.length > 1;
        const isTooLongLine = pxLength > (this.settings.getMaxValue() as number) - (this.settings.getMinValue() as number);
        const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

        if (isHaveStep) {
            let pxStep: number;

            if (isDefinedStep)
                pxStep = this.convertRelativeValueToPixelValue(
                    (this.settings.getMinValue() as number) + this.settings.stepValue,
                );

            if (isTooLongLine) {
                pxStep = pxLength / ((this.settings.getMaxValue() as number) - (this.settings.getMinValue() as number));
                if (isDefinedStep) pxStep = pxStep * this.settings.stepValue;
            }

            if (isDefinedSetOfValues) {
                pxStep = pxLength / (this.settings.items.values.length - 1);
            }

            const nStep = Math.round(pxValue / pxStep);
            let newPos = nStep * pxStep;

            if (pxValue / pxStep > Math.trunc(pxLength / pxStep)) {
                const remainder = pxLength - newPos;
                if (pxValue > newPos + remainder / 2) newPos += remainder;
            }
            if (newPos > pxLength) newPos = pxLength;
            return newPos;
        }
        return null;
    }
}

export default TRSView;
