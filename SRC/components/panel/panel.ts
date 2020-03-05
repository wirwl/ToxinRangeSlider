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
        const $valueFrom = $panel.find('.panel__input-value-from').find('.number__input');
        const $valueTo = $panel.find('.panel__input-value-to').find('.number__input');
        const $indexFrom = $panel.find('.panel__input-index-from').find('.number__input');
        const $indexTo = $panel.find('.panel__input-index-to').find('.number__input');
        const $rangeliderRootElement = $panel.find('.toxin-rangeslider-here');
        const $rangeslider = $rangeliderRootElement.find('.rangeslider');
        const rangeslider = $rangeliderRootElement.data('toxinRangeSlider');
        const $isVertical = $panel.find('.panel__checkbox-is-vertical').find('.checkbox__input');
        const $isTwoHandles = $panel.find('.panel__checkbox-is-two-handles').find('.checkbox__input');
        const $isShowTips = $panel.find('.panel__checkbox-is-tip').find('.checkbox__input');
        setDataInPanel($panel);

        rangeslider.update({
            onHandlePositionChange(value: number | string, isFromHandle: boolean, settings: RangeSliderOptions) {
                //isFromHandle ? $valueFrom.val(value) : $valueTo.val(value);
                //const isUsingItems = settings.items.values.length > 1;
                if (isFromHandle) {
                    settings.valueFrom;
                } else {
                    settings.valueTo;
                }
            },
        });

        $isVertical.change(function(this: HTMLInputElement) {
            this.checked ? $panel.addClass('panel_is-vertical') : $panel.removeClass('panel_is-vertical');
            rangeslider.update({ isVertical: this.checked });
        });

        $isTwoHandles.change(function(this: HTMLInputElement) {
            rangeslider.update({ isTwoHandles: this.checked });
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
        });
    });
});
