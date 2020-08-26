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
    this.updatePanelValues();
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

    this.$isVertical.on('change.isVertical', this.handleIsVerticalChange.bind(this));
    this.$isTwoHandles.on('change.isTwoHandles', this.handleIsTwoHandlesChange.bind(this));
    this.$isShowTips.on('change', this.handleIsShowTipsChange.bind(this));
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

  private handleInputsFocusout(event: JQuery.FocusOutEvent) {
    const $element = $(event.target);
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-min-value')
    ) {
      $element.val(this.rangeslider.data.getMinValue());
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-max-value')
    ) {
      $element.val(this.rangeslider.data.getMaxValue());
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-step-value')
    ) {
      $element.val(this.rangeslider.data.stepValue);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-value-from')
    ) {
      $element.val(this.rangeslider.data.getValueFrom());
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-value-to')
    ) {
      $element.val(this.rangeslider.data.getValueTo());
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-index-from')
    ) {
      $element.val(this.rangeslider.data.items.indexFrom);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-index-to')
    ) {
      $element.val(this.rangeslider.data.items.indexTo);
    }
  }

  private handleStepValueInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const value = parseInt(el.value, 10);
      if (value < 1) el.value = '1';
      if (!this.isStepValid()) el.value = this.getRangeLength().toString();
      this.rangeslider.update({ stepValue: parseInt(el.value, 10) });
    }
  }

  private handleButtonRemoveClick() {
    const $selectOptions = this.$select.find('option');
    const isUsingItems = this.select.length > 1;
    this.$minValue.prop('disabled', isUsingItems);
    this.$maxValue.prop('disabled', isUsingItems);
    this.$stepValue.prop('disabled', isUsingItems);
    const options = $.map($selectOptions, (option: HTMLOptionElement) => option.value);
    this.rangeslider.update({ items: { values: options } });
    this.updatePanelValues();
  }

  private handleButtonAddClick() {
    const $selectOptions = this.$select.find('option');
    const isUsingItems = this.select.length > 1;
    this.$minValue.prop('disabled', isUsingItems);
    this.$maxValue.prop('disabled', isUsingItems);
    this.$stepValue.prop('disabled', isUsingItems);
    const options = $.map($selectOptions, (option: HTMLOptionElement) => option.value);
    this.rangeslider.update({ items: { values: options } });
    this.updatePanelValues();
  }

  private handleIndexFromInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const indexFrom = parseInt(el.value, 10);
      const indexTo = parseInt(this.$indexTo.val() as string, 10);
      if (indexFrom > indexTo) el.value = indexTo.toString();
      this.rangeslider.update({ items: { indexFrom: parseInt(el.value, 10) } });
      this.$valueFrom.val(this.rangeslider.data.getValueFrom());
    }
  }

  private handleIndexToInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const maxIndex = this.rangeslider.data.items.values.length - 1;
      const indexFrom = parseInt(this.$indexFrom.val() as string, 10);
      const indexTo = parseInt(el.value, 10);
      if (indexTo < indexFrom) el.value = indexFrom.toString();
      if (indexTo > maxIndex) el.value = maxIndex.toString();
      this.rangeslider.update({ items: { indexTo: parseInt(el.value, 10) } });
      this.$valueTo.val(this.rangeslider.data.getValueTo());
    }
  }

  private handleValueFromInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;

    if (this.rangeslider.data.IsHaveItems()) {
      const indexFrom = this.rangeslider.data.findIndexByItem(el.value);

      if (indexFrom === -1) return;

      this.rangeslider.update({ items: { indexFrom } });
      this.$indexFrom.val(indexFrom);
    } else {
      if (Number.isNaN(Number(el.value))) return;
      this.rangeslider.update({ valueFrom: Number(el.value) });
    }
  }

  private handleValueToInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;

    if (this.rangeslider.data.IsHaveItems()) {
      const indexTo = this.rangeslider.data.findIndexByItem(el.value);

      if (indexTo === -1) return;

      this.rangeslider.update({ items: { indexTo } });
      this.$indexTo.val(indexTo);
    } else {
      if (Number.isNaN(Number(el.value))) return;
      let newValueTo = Number(el.value);
      if (this.rangeslider.data.isTwoHandles) {
        const valueFrom = Number(this.$valueFrom.val());
        if (newValueTo < this.$valueFrom.val()) newValueTo = valueFrom;
      }
      this.rangeslider.update({ valueTo: newValueTo });
    }
  }

  private handleMinValueInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;
    let minValue = parseInt(el.value, 10);
    if (!Number.isNaN(minValue)) {
      el.value = minValue.toString();
      const maxValue = parseInt(this.$maxValue.val() as string, 10);
      if (minValue >= maxValue) {
        el.value = (maxValue - 1).toString();
        minValue = parseInt(el.value, 10);
      }
      const toValue = parseInt(this.$valueTo.val() as string, 10);
      const fromValue = parseInt(this.$valueFrom.val() as string, 10);
      if (toValue < minValue) this.$valueTo.val(minValue);
      if (this.rangeslider.data.isTwoHandles && fromValue < minValue) {
        this.$valueFrom.val(el.value);
      }
      if (!this.isStepValid()) this.$stepValue.val(this.getRangeLength().toString());
      this.rangeslider.update({
        minValue: el.value,
        valueFrom: this.$valueFrom.val() as number,
        valueTo: this.$valueTo.val() as number,
      });
    }
  }

  private handleMaxValueInput(event: JQuery.ChangeEvent) {
    const el = event.target as HTMLInputElement;
    let maxValue = parseInt(el.value, 10);
    if (!Number.isNaN(maxValue)) {
      el.value = maxValue.toString();
      const minValue = parseInt(this.$minValue.val() as string, 10);
      if (maxValue <= minValue) {
        el.value = (minValue + 1).toString();
        maxValue = parseInt(el.value, 10);
      }
      const toValue = parseInt(this.$valueTo.val() as string, 10);
      const fromValue = parseInt(this.$valueFrom.val() as string, 10);
      if (toValue > maxValue) this.$valueTo.val(maxValue);
      if (this.rangeslider.data.isTwoHandles && fromValue > maxValue) {
        this.$valueFrom.val(minValue);
      }

      if (!this.isStepValid()) {
        this.$stepValue.val(this.getRangeLength().toString());
      }
      this.rangeslider.update({
        maxValue: el.value,
        valueFrom: this.$valueFrom.val() as number,
        valueTo: this.$valueTo.val() as number,
      });
    }
  }

  private handleIsShowTipsChange(event: JQuery.ChangeEvent) {
    this.rangeslider.update({ isTip: (event.target as HTMLInputElement).checked });
  }

  private updatePanelValues() {
    this.$minValue.val(this.rangeslider.data.getMinValue());
    this.$maxValue.val(this.rangeslider.data.getMaxValue());
    if (this.rangeslider.data.isTwoHandles) this.$valueFrom.val(this.rangeslider.data.getValueFrom());
    this.$valueTo.val(this.rangeslider.data.getValueTo());
    if (this.select.length > 1) {
      if (this.rangeslider.data.isTwoHandles) {
        this.$indexFrom.prop('disabled', false);
        this.$indexFrom.val(this.rangeslider.data.items.indexFrom);
      }
      this.$indexTo.prop('disabled', false);
      this.$indexTo.val(this.rangeslider.data.items.indexTo);
    } else {
      this.$indexFrom.prop('disabled', true);
      this.$indexTo.prop('disabled', true);
    }
    this.$stepValue.val(this.rangeslider.data.stepValue);
  }

  private getRangeLength(): number {
    return (this.$maxValue.val() as number) - (this.$minValue.val() as number);
  }

  private isStepValid(): boolean {
    return (this.$stepValue.val() as number) < this.getRangeLength();
  }

  private preventMinusTyping(event: any) {
    if (event.key === '-') event.preventDefault();
  }

  private handleIsVerticalChange(event: JQuery.ChangeEvent) {
    const element = event.target as HTMLInputElement;
    if (element.checked) this.$panel.addClass('panel_is-vertical');
    else this.$panel.removeClass('panel_is-vertical');
    this.rangeslider.update({ isVertical: element.checked });
  }

  private handleIsTwoHandlesChange(event: JQuery.ChangeEvent) {
    const checkbox = event.target as HTMLInputElement;
    this.rangeslider.update({ isTwoHandles: checkbox.checked });
    if (!checkbox.checked) {
      this.$valueFrom.prop('disabled', true);
      if (this.rangeslider.data.IsHaveItems()) this.$indexFrom.prop('disabled', true);
    } else {
      this.$valueFrom.prop('disabled', false);
      if (this.rangeslider.data.IsHaveItems()) this.$indexFrom.prop('disabled', false);
      if (!this.rangeslider.data.IsHaveItems()) {
        const minValue: number = parseInt(this.$minValue.val() as string, 10);
        const maxValue: number = parseInt(this.$maxValue.val() as string, 10);
        let valueFrom: number = parseInt(this.$valueFrom.val() as string, 10);
        if (Number.isNaN(Number(valueFrom))) valueFrom = minValue;
        const valueTo: number = parseInt(this.$valueTo.val() as string, 10);
        if (valueFrom < minValue || valueFrom > valueTo || valueFrom > maxValue) valueFrom = minValue;
        this.rangeslider.update({ valueFrom });
      }
    }
    this.updatePanelValues();
  }
}

const $panels = $('.panel');
$panels.each((index, element) => {
  new Panel(element);
});
