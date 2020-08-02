import TRSPresenter from '../toxin-rangeslider/core/presenter';
import { parse } from '@babel/core';

$(document).ready(() => {
    const $panels = $('.panel');

    $panels.each(function (index) {
        const $panel = $(this);
        const $inputs = $panel.find('input');
        const $minValue = $panel.find('.js-panel__input-min-value').find('.js-input__field');
        const $maxValue = $panel.find('.js-panel__input-max-value').find('.js-input__field');
        const $stepValue = $panel.find('.js-panel__input-step-value').find('.js-input__field');
        const $valueFrom = $panel.find('.js-panel__input-value-from').find('.js-input__field');
        const $valueTo = $panel.find('.js-panel__input-value-to').find('.js-input__field');
        const $indexFrom = $panel.find('.js-panel__input-index-from').find('.js-input__field');
        const $indexTo = $panel.find('.js-panel__input-index-to').find('.js-input__field');
        const $buttonAdd = $panel.find('.js-select-items').find('.js-select-items__button-add');
        const $buttonRemove = $panel.find('.js-select-items').find('.js-select-items__button-remove');
        const $select = $panel.find('.js-select-items').find('.js-select-items__options');

        const select = $select[0] as HTMLSelectElement;
        const $rangesliderRootElement = $panel.find('.toxin-rangeslider-here');
        const rangeslider: TRSPresenter = $rangesliderRootElement.data('toxinRangeSlider');
        const $isVertical = $panel.find('.js-panel__checkbox-is-vertical').find('.checkbox__input');
        const $isTwoHandles = $panel.find('.js-panel__checkbox-is-two-handles').find('.checkbox__input');
        const $isShowTips = $panel.find('.js-panel__checkbox-is-tip').find('.checkbox__input');

        rangeslider.update({
            onHandlePositionChange(this: HandleMovingResult) {
                if (this.isFromHandle) {
                    $valueFrom.val(this.value);
                    if (this.isUsingItems) $indexFrom.val(this.index);
                } else {
                    $valueTo.val(this.value);
                    if (this.isUsingItems) $indexTo.val(this.index);
                }
            },
        });

        $isVertical.change(function (this: HTMLInputElement) {
            this.checked ? $panel.addClass('panel_is-vertical') : $panel.removeClass('panel_is-vertical');
            rangeslider.update({ isVertical: this.checked });
        });

        $isTwoHandles.change(function (this: HTMLInputElement) {
            rangeslider.update({ isTwoHandles: this.checked });
            if (!this.checked) {
                $valueFrom.prop('disabled', true);
                if (rangeslider.data.isHaveItems) $indexFrom.prop('disabled', true);
            } else {
                $valueFrom.prop('disabled', false);
                if (rangeslider.data.isHaveItems) $indexFrom.prop('disabled', false);
                if (!rangeslider.data.isHaveItems) {
                    const minValue: number = parseInt($minValue.val() as string);
                    const maxValue: number = parseInt($maxValue.val() as string);
                    const valueFrom: number = parseInt($valueFrom.val() as string);
                    if (valueFrom < minValue || valueFrom > maxValue) $valueFrom.val(minValue);
                    rangeslider.update({ valueFrom: $valueFrom.val() as number });
                }
            }
        });

        $isShowTips.change(function (this: HTMLInputElement) {
            rangeslider.update({ isTip: this.checked });
        });

        function updatePanelValues() {
            $minValue.val(rangeslider.data.minValue);
            $maxValue.val(rangeslider.data.maxValue);
            $valueFrom.val(rangeslider.data.valueFrom);
            $valueTo.val(rangeslider.data.valueTo);
            if (select.length > 1) {
                $indexFrom.prop('disabled', false);
                $indexTo.prop('disabled', false);
                $indexFrom.val(rangeslider.data.items.indexFrom);
                $indexTo.val(rangeslider.data.items.indexTo);
            } else {
                $indexFrom.prop('disabled', true);
                $indexTo.prop('disabled', true);
            }
        }

        function getRangeLength(): number {            
            return (rangeslider.data.maxValue as number) - (rangeslider.data.minValue as number);
        }

        function isStepValid(): boolean {
            return ($stepValue.val() as number) < getRangeLength();
        }

        function preventMinusTyping(event: any) {
            if (event.key == '-') event.preventDefault();
        }

        $minValue.on('input.minValue', function (this: HTMLInputElement, event) {
            let minValue = parseInt(this.value);
            if (!isNaN(minValue)) {
                this.value = minValue.toString();
                const maxValue = parseInt($maxValue.val() as string);
                if (minValue >= maxValue) {
                    this.value = (maxValue - 1).toString();
                    minValue = parseInt(this.value);
                }
                const toValue = parseInt($valueTo.val() as string);
                const fromValue = parseInt($valueFrom.val() as string);
                if (toValue < minValue) $valueTo.val(minValue);
                if (rangeslider.data.isTwoHandles && fromValue < minValue) $valueFrom.val(this.value);
                if (!isStepValid()) $stepValue.val(getRangeLength().toString());
                rangeslider.update({
                    minValue: this.value,
                    valueFrom: $valueFrom.val() as number,
                    valueTo: $valueTo.val() as number,
                });
            }
        });

        $maxValue.on('input.maxValue', function (this: HTMLInputElement, event) {
            let maxValue = parseInt(this.value);
            if (!isNaN(maxValue)) {
                this.value = maxValue.toString();
                const minValue = parseInt($minValue.val() as string);
                if (maxValue <= minValue) {
                    this.value = (minValue + 1).toString();
                    maxValue = parseInt(this.value);
                }
                const toValue = parseInt($valueTo.val() as string);
                const fromValue = parseInt($valueFrom.val() as string);
                if (toValue > maxValue) $valueTo.val(maxValue);
                if (rangeslider.data.isTwoHandles && fromValue > maxValue) $valueFrom.val(minValue);

                if (!isStepValid()) $stepValue.val(getRangeLength().toString());
                rangeslider.update({
                    maxValue: this.value,
                    valueFrom: $valueFrom.val() as number,
                    valueTo: $valueTo.val() as number,
                });
            }
        });

        $valueFrom.on('input.valueFrom', function (this: HTMLInputElement, event) {
            let valueFrom = parseInt(this.value);
            if (!isNaN(valueFrom)) {
                if (rangeslider.data.isHaveItems) {
                    const indexFrom = rangeslider.data.findIndexByItem(this.value);
                    if (indexFrom > rangeslider.data.items.indexTo) this.value = rangeslider.data.valueTo as string;
                } else {
                    this.value = valueFrom.toString();
                    if (valueFrom < rangeslider.data.minValue) this.value = rangeslider.data.minValue as string;
                    if (parseInt(this.value) > rangeslider.data.valueTo)
                        this.value = rangeslider.data.valueTo as string;
                }
                rangeslider.update({ valueFrom: this.value });
                if (rangeslider.data.isHaveItems) $indexFrom.val(rangeslider.data.items.indexFrom);
            }
        });

        $valueTo.on('input.valueTo', function (this: HTMLInputElement) {
            let valueTo = parseInt(this.value);
            if (!isNaN(valueTo)) {
                if (rangeslider.data.isHaveItems) {
                    const indexTo = rangeslider.data.findIndexByItem(this.value);
                    if (indexTo == -1) this.value = rangeslider.data.valueTo as string;
                    if (indexTo < rangeslider.data.items.indexFrom) this.value = rangeslider.data.valueFrom as string;
                } else {
                    this.value = valueTo.toString();
                    if (rangeslider.data.isTwoHandles && valueTo < rangeslider.data.valueFrom)
                        this.value = rangeslider.data.valueFrom as string;
                    if (!rangeslider.data.isTwoHandles && valueTo < rangeslider.data.minValue)
                        this.value = rangeslider.data.minValue as string;
                    if (valueTo > rangeslider.data.maxValue) this.value = rangeslider.data.maxValue as string;
                }
                if (!rangeslider.data.isHaveItems && !isNaN(parseInt(this.value))) {
                    rangeslider.update({ valueTo: this.value });
                    if (rangeslider.data.isHaveItems) $indexTo.val(rangeslider.data.items.indexTo);
                }
            }
        });

        $indexFrom.on('input', function (this: HTMLInputElement) {
            if (this.value.length) {
                const indexFrom = parseInt(this.value);
                const indexTo = parseInt($indexTo.val() as string);
                if (indexFrom > indexTo) this.value = indexTo.toString();
                rangeslider.update({ items: { indexFrom: parseInt(this.value) } });
                $valueFrom.val(rangeslider.data.valueFrom);
            }
        });

        $indexTo.on('input', function (this: HTMLInputElement) {
            if (this.value.length) {
                const maxIndex = rangeslider.data.items.values.length - 1;
                const indexFrom = parseInt($indexFrom.val() as string);
                const indexTo = parseInt(this.value);
                if (indexTo < indexFrom) this.value = indexFrom.toString();
                if (indexTo > maxIndex) this.value = maxIndex.toString();
                rangeslider.update({ items: { indexTo: parseInt(this.value) } });
                $valueTo.val(rangeslider.data.valueTo);
            }
        });

        $stepValue.on('input.stepValue', function (this: HTMLInputElement) {
            if (this.value.length) {
                const value = parseInt(this.value);
                if (value < 1) this.value = '1';
                if (!isStepValid()) this.value = getRangeLength().toString();
                rangeslider.update({ stepValue: value });
            }
        });

        $buttonAdd.click(function (this: HTMLButtonElement) {
            const $selectOptions = $select.find('option');
            const isUsingItems = select.length > 1;
            $minValue.prop('disabled', isUsingItems);
            $maxValue.prop('disabled', isUsingItems);
            $stepValue.prop('disabled', isUsingItems);

            const options = $.map($selectOptions, function (option: HTMLOptionElement) {
                return option.value;
            });
            rangeslider.update({ items: { values: options } });
            updatePanelValues();
        });

        $buttonRemove.click(function (this: HTMLButtonElement) {
            const $selectOptions = $select.find('option');
            const isUsingItems = select.length > 1;
            $minValue.prop('disabled', isUsingItems);
            $maxValue.prop('disabled', isUsingItems);
            $stepValue.prop('disabled', isUsingItems);

            const options = $.map($selectOptions, function (option: HTMLOptionElement) {
                return option.value;
            });
            rangeslider.update({ items: { values: options } });
            updatePanelValues();
        });

        $stepValue.keypress(preventMinusTyping);
        $indexFrom.keypress(preventMinusTyping);
        $indexTo.keypress(preventMinusTyping);

        $inputs.focusout(function (this: HTMLElement) {
            console.log('focusout fired...');
            const $element = $(this);
            if ($element.parent().parent().hasClass('js-panel__input-min-value'))
                $element.val(rangeslider.data.minValue);
            if ($element.parent().parent().hasClass('js-panel__input-max-value'))
                $element.val(rangeslider.data.maxValue);
            if ($element.parent().parent().hasClass('js-panel__input-step-value'))
                $element.val(rangeslider.data.stepValue);
            if ($element.parent().parent().hasClass('js-panel__input-value-from'))
                $element.val(rangeslider.data.valueFrom);
            if ($element.parent().parent().hasClass('js-panel__input-value-to'))
                $element.val(rangeslider.data.valueTo);
            if ($element.parent().parent().hasClass('js-panel__input-index-from'))
                $element.val(rangeslider.data.items.indexFrom);
            if ($element.parent().parent().hasClass('js-panel__input-index-to'))
                $element.val(rangeslider.data.items.indexTo);
        })
    });
});
