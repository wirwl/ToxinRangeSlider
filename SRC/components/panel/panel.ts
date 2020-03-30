import TRSPresenter from '../toxin-rangeslider/core/presenter';

$(document).ready(() => {
    // $('#p1')
    //     .find('.panel__toxin-rangeslider')
    //     .toxinRangeSlider();
    // $('#p2')
    //     .find('.panel__toxin-rangeslider')
    //     .toxinRangeSlider({ isInterval: false });
    // $('#p3')
    //     .find('.panel__toxin-rangeslider')
    //     .toxinRangeSlider({ isVertical: true });
    // $('#p4')
    //     .find('.panel__toxin-rangeslider')
    //     .toxinRangeSlider({ isVertical: true });

    function setDataInPanel($panel: JQuery<HTMLElement>) {}

    const $panels = $('.panel');

    $panels.each(function(index) {
        const $panel = $(this);
        const $minValue = $panel.find('.panel__input-min-value').find('.number__input');
        const $maxValue = $panel.find('.panel__input-max-value').find('.number__input');
        const $stepValue = $panel.find('.panel__input-step-value').find('.number__input');
        const $valueFrom = $panel.find('.panel__input-value-from').find('.number__input');
        const $valueTo = $panel.find('.panel__input-value-to').find('.number__input');
        const $indexFrom = $panel.find('.panel__input-index-from').find('.number__input');
        const $indexTo = $panel.find('.panel__input-index-to').find('.number__input');
        const $buttonAdd = $panel.find('.select-items').find('.select-items__button-add');
        const $buttonRemove = $panel.find('.select-items').find('.select-items__button-remove');
        const $select = $panel.find('.select-items').find('.select-items__options');

        const select = $select[0] as HTMLSelectElement;
        const $rangeliderRootElement = $panel.find('.toxin-rangeslider-here');
        const rangeslider: TRSPresenter = $rangeliderRootElement.data('toxinRangeSlider');
        const $isVertical = $panel.find('.panel__checkbox-is-vertical').find('.checkbox__input');
        const $isTwoHandles = $panel.find('.panel__checkbox-is-two-handles').find('.checkbox__input');
        const $isShowTips = $panel.find('.panel__checkbox-is-tip').find('.checkbox__input');
        setDataInPanel($panel);

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

        $isVertical.change(function(this: HTMLInputElement) {
            this.checked ? $panel.addClass('panel_is-vertical') : $panel.removeClass('panel_is-vertical');
            rangeslider.update({ isVertical: this.checked });
        });

        $isTwoHandles.change(function(this: HTMLInputElement) {
            rangeslider.update({ isTwoHandles: this.checked });
            if (!this.checked) {
                $valueFrom.prop('disabled', true);
                $indexFrom.prop('disabled', true);
            } else {
                $valueFrom.prop('disabled', false);
                $indexFrom.prop('disabled', false);
            }
        });

        $isShowTips.change(function(this: HTMLInputElement) {
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
        $minValue.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ minValue: parseFloat(this.value) });
            updatePanelValues();
        });

        $maxValue.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ maxValue: parseFloat(this.value) });
            updatePanelValues();
        });

        $stepValue.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ stepValue: parseInt(this.value) });
        });

        $valueFrom.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ valueFrom: this.value });
            if (rangeslider.data.isHaveItems) $indexFrom.val(rangeslider.data.items.indexFrom);
        });

        $valueTo.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ valueTo: this.value });
            if (rangeslider.data.isHaveItems) $indexTo.val(rangeslider.data.items.indexTo);
        });

        $indexFrom.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ items: { indexFrom: parseInt(this.value) } });
            $valueFrom.val(rangeslider.data.valueFrom);
        });
        $indexTo.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ items: { indexTo: parseInt(this.value) } });
            $valueTo.val(rangeslider.data.valueTo);
        });

        $buttonAdd.click(function(this: HTMLButtonElement) {
            const $selectOptions = $select.find('option');
            const isUsingItems = select.length > 1;
            $minValue.prop('disabled', isUsingItems);
            $maxValue.prop('disabled', isUsingItems);
            $stepValue.prop('disabled', isUsingItems);

            const options = $.map($selectOptions, function(option: HTMLOptionElement) {
                return option.value;
            });
            rangeslider.update({ items: { values: options } });
            updatePanelValues();
        });
        $buttonRemove.click(function(this: HTMLButtonElement) {
            const $selectOptions = $select.find('option');
            const isUsingItems = select.length > 1;
            $minValue.prop('disabled', isUsingItems);
            $maxValue.prop('disabled', isUsingItems);
            $stepValue.prop('disabled', isUsingItems);

            const options = $.map($selectOptions, function(option: HTMLOptionElement) {
                return option.value;
            });
            rangeslider.update({ items: { values: options } });
            updatePanelValues();
        });
    });
});
