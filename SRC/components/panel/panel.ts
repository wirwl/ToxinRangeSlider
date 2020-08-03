import TRSPresenter from '../toxin-rangeslider/core/presenter';

class Panel {
    private $panel: JQuery<HTMLElement>;
    private $inputs: JQuery<HTMLElement>;
    private $minValue: JQuery<HTMLElement>;
    private $maxValue: JQuery<HTMLElement>;
    private $stepValue: JQuery<HTMLElement>;
    private $valueFrom: JQuery<HTMLElement>;
    private $valueTo: JQuery<HTMLElement>;
    private $indexFrom: JQuery<HTMLElement>;
    private $indexTo: JQuery<HTMLElement>;
    private $buttonAdd: JQuery<HTMLElement>;
    private $buttonRemove: JQuery<HTMLElement>;
    private $select: JQuery<HTMLElement>;
    private select: HTMLSelectElement;
    private $rangesliderRootElement: JQuery<HTMLElement>;
    private rangeslider: TRSPresenter;
    private $isVertical: JQuery<HTMLElement>;
    private $isTwoHandles: JQuery<HTMLElement>;
    private $isShowTips: JQuery<HTMLElement>;

    constructor(element: HTMLElement) {
        this.initVariables(element);
        this.addEventListeners();
    }

    private initVariables(element: HTMLElement) {
        this.$panel = $(element);
        this.$inputs = this.$panel.find('input');
        this.$minValue = this.$panel.find('.js-panel__input-min-value').find('.js-input__field');
        this.$maxValue = this.$panel.find('.js-panel__input-max-value').find('.js-input__field');
        this.$stepValue = this.$panel.find('.js-panel__input-step-value').find('.js-input__field');
        this.$valueFrom = this.$panel.find('.js-panel__input-value-from').find('.js-input__field');
        this.$valueTo = this.$panel.find('.js-panel__input-value-to').find('.js-input__field');
        this.$indexFrom = this.$panel.find('.js-panel__input-index-from').find('.js-input__field');
        this.$indexTo = this.$panel.find('.js-panel__input-index-to').find('.js-input__field');
        this.$buttonAdd = this.$panel.find('.js-select-items').find('.js-select-items__button-add');
        this.$buttonRemove = this.$panel.find('.js-select-items').find('.js-select-items__button-remove');
        this.$select = this.$panel.find('.js-select-items').find('.js-select-items__options');
        this.select = this.$select[0] as HTMLSelectElement;
        this.$rangesliderRootElement = this.$panel.find('.toxin-rangeslider-here');
        this.rangeslider = this.$rangesliderRootElement.data('toxinRangeSlider');
        this.$isVertical = this.$panel.find('.js-panel__checkbox-is-vertical').find('.checkbox__input');
        this.$isTwoHandles = this.$panel.find('.js-panel__checkbox-is-two-handles').find('.checkbox__input');
        this.$isShowTips = this.$panel.find('.js-panel__checkbox-is-tip').find('.checkbox__input');
    }

    private addEventListeners() {
        const valueFrom = this.$valueFrom;
        const valueTo = this.$valueTo;
        const indexFrom = this.$indexFrom;
        const indexTo = this.$indexTo;

        this.rangeslider.update({
            onHandlePositionChange(this: HandleMovingResult) {
                if (this.isFromHandle) {
                    valueFrom.val(this.value);
                    if (this.isUsingItems) indexFrom.val(this.index);
                } else {
                    valueTo.val(this.value);
                    if (this.isUsingItems) indexTo.val(this.index);
                }
            },
        });

        this.$isVertical.change(this.handleIsVerticalChange.bind(this));
        this.$isTwoHandles.change(this.handleIsTwoHandlesChange.bind(this));
        this.$isShowTips.change(this.handleIsShowTipsChange.bind(this));
        this.$minValue.on('input.minValue', this.handleMinValueInput.bind(this));
        this.$maxValue.on('input.maxValue', this.handleMaxValueInput.bind(this));
        this.$valueFrom.on('input.valueFrom', this.handleValueFromInput.bind(this));
        this.$valueTo.on('input.valueTo', this.handleValueToInput.bind(this));
        this.$indexFrom.on('input.indexFrom', this.handleIndexFromInput.bind(this));
        this.$indexTo.on('input.indexTo', this.handleIndexToInput.bind(this));
        this.$stepValue.on('input.stepValue', this.handleStepValueInput.bind(this));
        this.$stepValue.keypress(this.preventMinusTyping);
        this.$indexFrom.keypress(this.preventMinusTyping);
        this.$indexTo.keypress(this.preventMinusTyping);
        this.$inputs.on('focusout.inputs', this.handleInputsFocusout.bind(this));
        this.$buttonAdd.on('click.buttonAdd', this.handleButtonAddClick.bind(this));
        this.$buttonRemove.on('click.buttonRemove', this.handleButtonRemoveClick.bind(this));
    }

    handleInputsFocusout(event: JQuery.FocusOutEvent) {
        const $element = $(event.target);
        if ($element.parent().parent().hasClass('js-panel__input-min-value'))
            $element.val(this.rangeslider.data.minValue);
        if ($element.parent().parent().hasClass('js-panel__input-max-value'))
            $element.val(this.rangeslider.data.maxValue);
        if ($element.parent().parent().hasClass('js-panel__input-step-value'))
            $element.val(this.rangeslider.data.stepValue);
        if ($element.parent().parent().hasClass('js-panel__input-value-from'))
            $element.val(this.rangeslider.data.valueFrom);
        if ($element.parent().parent().hasClass('js-panel__input-value-to'))
            $element.val(this.rangeslider.data.valueTo);
        if ($element.parent().parent().hasClass('js-panel__input-index-from'))
            $element.val(this.rangeslider.data.items.indexFrom);
        if ($element.parent().parent().hasClass('js-panel__input-index-to'))
            $element.val(this.rangeslider.data.items.indexTo);
    };

    private handleStepValueInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        if (el.value.length) {
            const value = parseInt(el.value);
            if (value < 1) el.value = '1';
            if (!this.isStepValid()) el.value = this.getRangeLength().toString();
            this.rangeslider.update({ stepValue: value });
        }
    };

    handleButtonRemoveClick(event: JQuery.ClickEvent) {
        const $selectOptions = this.$select.find('option');
        const isUsingItems = this.select.length > 1;
        this.$minValue.prop('disabled', isUsingItems);
        this.$maxValue.prop('disabled', isUsingItems);
        this.$stepValue.prop('disabled', isUsingItems);
        const options = $.map($selectOptions, function (option: HTMLOptionElement) {
            return option.value;
        });
        this.rangeslider.update({ items: { values: options } });
        this.updatePanelValues();
    };

    private handleButtonAddClick(event: JQuery.ClickEvent) {
        const $selectOptions = this.$select.find('option');
        const isUsingItems = this.select.length > 1;
        this.$minValue.prop('disabled', isUsingItems);
        this.$maxValue.prop('disabled', isUsingItems);
        this.$stepValue.prop('disabled', isUsingItems);
        const options = $.map($selectOptions, function (option: HTMLOptionElement) {
            return option.value;
        });
        console.log(options);
        this.rangeslider.update({ items: { values: options } });
        this.updatePanelValues();
    };

    private handleIndexFromInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        if (el.value.length) {
            const indexFrom = parseInt(el.value);
            const indexTo = parseInt(this.$indexTo.val() as string);
            if (indexFrom > indexTo) el.value = indexTo.toString();
            this.rangeslider.update({ items: { indexFrom: parseInt(el.value) } });
            this.$valueFrom.val(this.rangeslider.data.valueFrom);
        }
    };

    private handleIndexToInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        if (el.value.length) {
            const maxIndex = this.rangeslider.data.items.values.length - 1;
            const indexFrom = parseInt(this.$indexFrom.val() as string);
            const indexTo = parseInt(el.value);
            if (indexTo < indexFrom) el.value = indexFrom.toString();
            if (indexTo > maxIndex) el.value = maxIndex.toString();
            this.rangeslider.update({ items: { indexTo: parseInt(el.value) } });
            this.$valueTo.val(this.rangeslider.data.valueTo);
        }
    };

    private handleValueFromInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        let valueFrom = parseInt(el.value);
        if (!isNaN(valueFrom)) {
            if (this.rangeslider.data.isHaveItems) {
                const indexFrom = this.rangeslider.data.findIndexByItem(el.value);
                if (indexFrom > this.rangeslider.data.items.indexTo) el.value = this.rangeslider.data.valueTo as string;
            } else {
                el.value = valueFrom.toString();
                if (valueFrom < this.rangeslider.data.minValue) el.value = this.rangeslider.data.minValue as string;
                if (parseInt(el.value) > this.rangeslider.data.valueTo)
                    el.value = this.rangeslider.data.valueTo as string;
            }
            this.rangeslider.update({ valueFrom: el.value });
            if (this.rangeslider.data.isHaveItems) this.$indexFrom.val(this.rangeslider.data.items.indexFrom);
        }
    };

    private handleValueToInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        let valueTo = parseInt(el.value);
        if (!isNaN(valueTo)) {
            if (this.rangeslider.data.isHaveItems) {
                const indexTo = this.rangeslider.data.findIndexByItem(el.value);
                if (indexTo == -1) el.value = this.rangeslider.data.valueTo as string;
                if (indexTo < this.rangeslider.data.items.indexFrom) el.value = this.rangeslider.data.valueFrom as string;
            } else {
                el.value = valueTo.toString();
                if (this.rangeslider.data.isTwoHandles && valueTo < this.rangeslider.data.valueFrom)
                    el.value = this.rangeslider.data.valueFrom as string;
                if (!this.rangeslider.data.isTwoHandles && valueTo < this.rangeslider.data.minValue)
                    el.value = this.rangeslider.data.minValue as string;
                if (valueTo > this.rangeslider.data.maxValue) el.value = this.rangeslider.data.maxValue as string;
            }
            if (!this.rangeslider.data.isHaveItems && !isNaN(parseInt(el.value))) {
                this.rangeslider.update({ valueTo: el.value });
                if (this.rangeslider.data.isHaveItems) this.$indexTo.val(this.rangeslider.data.items.indexTo);
            }
        }
    };

    private handleMinValueInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        let minValue = parseInt(el.value);
        if (!isNaN(minValue)) {
            el.value = minValue.toString();
            const maxValue = parseInt(this.$maxValue.val() as string);
            if (minValue >= maxValue) {
                el.value = (maxValue - 1).toString();
                minValue = parseInt(el.value);
            }
            const toValue = parseInt(this.$valueTo.val() as string);
            const fromValue = parseInt(this.$valueFrom.val() as string);
            if (toValue < minValue) this.$valueTo.val(minValue);
            if (this.rangeslider.data.isTwoHandles && fromValue < minValue)
                this.$valueFrom.val(el.value);
            if (!this.isStepValid()) this.$stepValue.val(this.getRangeLength().toString());
            this.rangeslider.update({
                minValue: el.value,
                valueFrom: this.$valueFrom.val() as number,
                valueTo: this.$valueTo.val() as number,
            });
        }
    };

    private handleMaxValueInput(event: JQuery.ChangeEvent) {
        const el = event.target as HTMLInputElement;
        let maxValue = parseInt(el.value);
        if (!isNaN(maxValue)) {
            el.value = maxValue.toString();
            const minValue = parseInt(this.$minValue.val() as string);
            if (maxValue <= minValue) {
                el.value = (minValue + 1).toString();
                maxValue = parseInt(el.value);
            }
            const toValue = parseInt(this.$valueTo.val() as string);
            const fromValue = parseInt(this.$valueFrom.val() as string);
            if (toValue > maxValue) this.$valueTo.val(maxValue);
            if (this.rangeslider.data.isTwoHandles && fromValue > maxValue) this.$valueFrom.val(minValue);

            if (!this.isStepValid()) this.$stepValue.val(this.getRangeLength().toString());
            this.rangeslider.update({
                maxValue: el.value,
                valueFrom: this.$valueFrom.val() as number,
                valueTo: this.$valueTo.val() as number,
            });
        }
    };

    private handleIsShowTipsChange(event: JQuery.ChangeEvent) {
        this.rangeslider.update({ isTip: (event.target as HTMLInputElement).checked });
    };

    private updatePanelValues() {
        console.log('called updatePanelValues');
        console.log(this);
        this.$minValue.val(this.rangeslider.data.minValue);
        this.$maxValue.val(this.rangeslider.data.maxValue);
        this.$valueFrom.val(this.rangeslider.data.valueFrom);
        this.$valueTo.val(this.rangeslider.data.valueTo);
        if (this.select.length > 1) {
            this.$indexFrom.prop('disabled', false);
            this.$indexTo.prop('disabled', false);
            this.$indexFrom.val(this.rangeslider.data.items.indexFrom);
            this.$indexTo.val(this.rangeslider.data.items.indexTo);
        } else {
            this.$indexFrom.prop('disabled', true);
            this.$indexTo.prop('disabled', true);
        }
    }

    private getRangeLength(): number {
        return (this.rangeslider.data.maxValue as number) - (this.rangeslider.data.minValue as number);
    }

    private isStepValid(): boolean {
        return (this.$stepValue.val() as number) < this.getRangeLength();
    }

    private preventMinusTyping(event: any) {
        if (event.key == '-') event.preventDefault();
    }

    private handleIsVerticalChange(event: JQuery.ChangeEvent) {
        const element = event.target as HTMLInputElement;
        element.checked ? this.$panel.addClass('panel_is-vertical') : this.$panel.removeClass('panel_is-vertical');
        this.rangeslider.update({ isVertical: element.checked });
    }

    private handleIsTwoHandlesChange(event: JQuery.ChangeEvent) {
        const checkbox = event.target as HTMLInputElement;
        this.rangeslider.update({ isTwoHandles: checkbox.checked });
        if (!checkbox.checked) {
            this.$valueFrom.prop('disabled', true);
            if (this.rangeslider.data.isHaveItems) this.$indexFrom.prop('disabled', true);
        } else {
            this.$valueFrom.prop('disabled', false);
            if (this.rangeslider.data.isHaveItems) this.$indexFrom.prop('disabled', false);
            if (!this.rangeslider.data.isHaveItems) {
                const minValue: number = parseInt(this.$minValue.val() as string);
                const maxValue: number = parseInt(this.$maxValue.val() as string);
                const valueFrom: number = parseInt(this.$valueFrom.val() as string);
                if (valueFrom < minValue || valueFrom > maxValue) this.$valueFrom.val(minValue);
                this.rangeslider.update({ valueFrom: this.$valueFrom.val() as number });
            }
        }
    };
}

const panels = $('.panel');
panels.each((index, element) => { new Panel(element) });
