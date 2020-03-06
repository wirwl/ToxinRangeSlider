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
        const $selectOptions = $select.find('option');
        const select = $select[0] as HTMLSelectElement;
        const $rangeliderRootElement = $panel.find('.toxin-rangeslider-here');
        const $rangeslider = $rangeliderRootElement.find('.rangeslider');
        const rangeslider = $rangeliderRootElement.data('toxinRangeSlider');
        const $isVertical = $panel.find('.panel__checkbox-is-vertical').find('.checkbox__input');
        const $isTwoHandles = $panel.find('.panel__checkbox-is-two-handles').find('.checkbox__input');
        const $isShowTips = $panel.find('.panel__checkbox-is-tip').find('.checkbox__input');
        setDataInPanel($panel);

        rangeslider.update({
            onHandlePositionChange(this: HandleMovingResult) {
                //value: number | string, isFromHandle: boolean, settings: RangeSliderOptions) {
                //isFromHandle ? $valueFrom.val(value) : $valueTo.val(value);
                //const isUsingItems = settings.items.values.length > 1;
                // if (isFromHandle) {
                //     settings.valueFrom;
                // } else {
                //     settings.valueTo;
                // }

                if (this.isFromHandle) {
                    $valueFrom.val(this.value);
                    $indexFrom.val(this.index);
                } else {
                    $valueTo.val(this.value);
                    $indexTo.val(this.index);
                }
            },
        });

        $isVertical.change(function(this: HTMLInputElement) {
            this.checked ? $panel.addClass('panel_is-vertical') : $panel.removeClass('panel_is-vertical');
            rangeslider.update({ isVertical: this.checked });
        });

        $isTwoHandles.change(function(this: HTMLInputElement) {
            rangeslider.update({ isTwoHandles: this.checked });
            if (!this.checked) $valueFrom.prop('disabled', 1);
            else $valueFrom.prop('disabled', 0);
        });

        $isShowTips.change(function(this: HTMLInputElement) {
            rangeslider.update({ isTip: this.checked });
        });

        $valueFrom.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ valueFrom: this.value });
        });

        $valueTo.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ valueTo: this.value });
        });

        $indexFrom.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ items: { indexFrom: this.value } });
            ($valueFrom as JQuery<HTMLInputElement>)[0].value = rangeslider.model.settings.valueFrom;
        });
        $indexTo.focusout(function(this: HTMLInputElement) {
            rangeslider.update({ items: { indexTo: this.value } });
            ($valueTo as JQuery<HTMLInputElement>)[0].value = rangeslider.model.settings.valueTo;
        });
        $buttonAdd.click(function(this: HTMLButtonElement) {
            const isUsingItems = select.length > 1;
            $minValue.prop('disabled', isUsingItems);
            $maxValue.prop('disabled', isUsingItems);
            $stepValue.prop('disabled', isUsingItems);

            const options = $.map($selectOptions, function(option: HTMLOptionElement) {
                return option.value;
            });
            console.log(options);
            rangeslider.update({ items: { values: options } });
        });
        $buttonRemove.click(function(this: HTMLButtonElement) {
            const isUsingItems = select.length > 1;
            $minValue.prop('disabled', isUsingItems);
            $maxValue.prop('disabled', isUsingItems);
            $stepValue.prop('disabled', isUsingItems);
        });
    });
});
