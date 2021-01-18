import TRSPresenter from '../toxin-rangeslider/core/presenter';

export default class Panel {
  readonly CLASSES = {
    modIsVertical: 'panel_is-vertical',
  };

  private $panel: JQuery<HTMLElement>;

  private $inputs!: JQuery<HTMLElement>;

  private $minValue!: JQuery<HTMLElement>;

  private $maxValue!: JQuery<HTMLElement>;

  private $stepValue!: JQuery<HTMLElement>;

  private $valueFrom!: JQuery<HTMLElement>;

  private $valueTo!: JQuery<HTMLElement>;

  private $indexFrom!: JQuery<HTMLElement>;

  private $indexTo!: JQuery<HTMLElement>;

  private $buttonAdd!: JQuery<HTMLElement>;

  private $buttonRemove!: JQuery<HTMLElement>;

  private $select!: JQuery<HTMLElement>;

  private select!: HTMLSelectElement | null;

  private $rangesliderRootElement!: JQuery<HTMLElement>;

  private rangeslider!: TRSPresenter;

  private $isVertical!: JQuery<HTMLElement>;

  private $isTwoHandles!: JQuery<HTMLElement>;

  private $isShowTips!: JQuery<HTMLElement>;

  constructor(element: HTMLElement) {
    this.$panel = $(element);
    this.initMembers();
    this.bindThis();
    this.addEventListeners();
    this.updatePanelValues();
  }

  private bindThis(): void {
    this.handleIsVerticalChange = this.handleIsVerticalChange.bind(this);
    this.handleIsTwoHandlesChange = this.handleIsTwoHandlesChange.bind(this);
    this.handleIsShowTipsChange = this.handleIsShowTipsChange.bind(this);
    this.handleMinValueInput = this.handleMinValueInput.bind(this);
    this.handleMaxValueInput = this.handleMaxValueInput.bind(this);
    this.handleValueFromInput = this.handleValueFromInput.bind(this);
    this.handleValueToInput = this.handleValueToInput.bind(this);
    this.handleIndexFromInput = this.handleIndexFromInput.bind(this);
    this.handleIndexToInput = this.handleIndexToInput.bind(this);
    this.handleStepValueInput = this.handleStepValueInput.bind(this);
    this.handleInputsFocusout = this.handleInputsFocusout.bind(this);
    this.handleButtonAddClick = this.handleButtonAddClick.bind(this);
    this.handleButtonRemoveClick = this.handleButtonRemoveClick.bind(this);
  }

  private initMembers() {
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

  private addEventListeners(): void {
    const valueFrom = this.$valueFrom;
    const valueTo = this.$valueTo;
    const indexFrom = this.$indexFrom;
    const indexTo = this.$indexTo;

    this.rangeslider.update({
      onHandlePositionChange(this: HandleMovingResult) {
        const { isFromHandle, isUsingItems, index, value } = this;
        if (isFromHandle) {
          valueFrom.val(value);
          if (isUsingItems) indexFrom.val(index);
        } else {
          valueTo.val(value);
          if (isUsingItems) indexTo.val(index);
        }
      },
    });

    this.$isVertical.on('change.isVertical', this.handleIsVerticalChange);
    this.$isTwoHandles.on('change.isTwoHandles', this.handleIsTwoHandlesChange);
    this.$isShowTips.on('change.isShowTips', this.handleIsShowTipsChange);
    this.$minValue.on('input.minValue', this.handleMinValueInput);
    this.$maxValue.on('input.maxValue', this.handleMaxValueInput);
    this.$valueFrom.on('input.valueFrom', this.handleValueFromInput);
    this.$valueTo.on('input.valueTo', this.handleValueToInput);
    this.$indexFrom.on('input.indexFrom', this.handleIndexFromInput);
    this.$indexTo.on('input.indexTo', this.handleIndexToInput);
    this.$stepValue.on('input.stepValue', this.handleStepValueInput);
    this.$stepValue.keypress(this.preventMinusTyping);
    this.$indexFrom.keypress(this.preventMinusTyping);
    this.$indexTo.keypress(this.preventMinusTyping);
    this.$inputs.on('focusout.inputs', this.handleInputsFocusout);
    this.$buttonAdd.on('click.buttonAdd', this.handleButtonAddClick);
    this.$buttonRemove.on('click.buttonRemove', this.handleButtonRemoveClick);
  }

  private handleInputsFocusout(event: JQuery.TriggeredEvent): void {
    const {
      items,
      items: { values },
      minValue,
      maxValue,
      valueFrom,
      valueTo,
      stepValue,
    } = this.rangeslider.data;
    const isUsingItems = values.length > 1;
    const $element = $(event.target);
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-min-value')
    ) {
      $element.val(isUsingItems ? values[0] : minValue);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-max-value')
    ) {
      $element.val(isUsingItems ? values[items.values?.length - 1] : maxValue);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-step-value')
    ) {
      $element.val(stepValue);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-value-from')
    ) {
      $element.val(valueFrom);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-value-to')
    ) {
      $element.val(valueTo);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-index-from')
    ) {
      $element.val(items.indexFrom);
    }
    if (
      $element
        .parent()
        .parent()
        .hasClass('js-panel__input-index-to')
    ) {
      $element.val(items.indexTo);
    }
  }

  private handleStepValueInput(event: JQuery.TriggeredEvent): void {
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const value = parseInt(el.value, 10);
      if (value < 1) el.value = '1';
      if (!this.isStepValid()) el.value = this.getRangeLength().toString();
      this.rangeslider.update({ stepValue: parseInt(el.value, 10) });
    }
  }

  private handleButtonRemoveClick(): void {
    const $selectOptions = this.$select.find('option');
    const isUsingItems = this.select ? this.select.length > 1 : false;
    this.$minValue.prop('disabled', isUsingItems);
    this.$maxValue.prop('disabled', isUsingItems);
    this.$stepValue.prop('disabled', isUsingItems);
    const options: HTMLOptionElement[] = [];
    $selectOptions.each((_, el) => {
      options.push(el);
    });
    const newValues = $.map(options, (option: HTMLOptionElement) => option.value);
    this.rangeslider.update({ items: { values: newValues } });
    this.updatePanelValues();
  }

  private handleButtonAddClick(): void {
    const $selectOptions = this.$select.find('option');
    const isUsingItems = this.select ? this.select.length > 1 : false;
    this.$minValue.prop('disabled', isUsingItems);
    this.$maxValue.prop('disabled', isUsingItems);
    this.$stepValue.prop('disabled', isUsingItems);
    const options: HTMLOptionElement[] = [];
    $selectOptions.each((_, el) => {
      options.push(el);
    });
    const newValues = $.map(options, (option: HTMLOptionElement) => option.value);
    this.rangeslider.update({ items: { values: newValues } });
    this.updatePanelValues();
  }

  private handleIndexFromInput(event: JQuery.TriggeredEvent): void {
    const { valueFrom } = this.rangeslider.data;
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const indexFrom = parseInt(el.value, 10);
      const indexTo = parseInt(String(this.$indexTo.val()), 10);
      if (indexFrom > indexTo) el.value = indexTo.toString();
      this.rangeslider.update({ items: { indexFrom: parseInt(el.value, 10) } });
      this.$valueFrom.val(valueFrom);
    }
  }

  private handleIndexToInput(event: JQuery.TriggeredEvent): void {
    const {
      items: { values },
      valueTo,
    } = this.rangeslider.data;
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const maxIndex = values.length - 1;
      const indexFrom = parseInt(String(this.$indexFrom.val()), 10);
      const indexTo = parseInt(el.value, 10);
      if (indexTo < indexFrom) el.value = indexFrom.toString();
      if (indexTo > maxIndex) el.value = maxIndex.toString();
      this.rangeslider.update({ items: { indexTo: parseInt(el.value, 10) } });
      this.$valueTo.val(valueTo);
    }
  }

  private findIndexByItem(values: (number | string)[], item: number | string): number {
    return values.findIndex(value => value.toString() === item.toString());
  }

  private handleValueFromInput(event: JQuery.TriggeredEvent): void {
    const {
      items: { values },
    } = this.rangeslider.data;
    const el = event.target as HTMLInputElement;

    if (values.length > 1) {
      const indexFrom = this.findIndexByItem(values, el.value);

      if (indexFrom === -1) return;

      this.rangeslider.update({ items: { indexFrom } });
      this.$indexFrom.val(indexFrom);
    } else {
      if (Number.isNaN(Number(el.value))) return;
      this.rangeslider.update({ valueFrom: Number(el.value) });
    }
    this.updatePanelValues();
  }

  private handleValueToInput(event: JQuery.TriggeredEvent): void {
    const {
      isTwoHandles,
      items: { values },
    } = this.rangeslider.data;
    const el = event.target as HTMLInputElement;

    if (values.length > 1) {
      const indexTo = this.findIndexByItem(values, el.value);

      if (indexTo === -1) return;

      this.rangeslider.update({ items: { indexTo } });
      this.$indexTo.val(indexTo);
    } else {
      if (Number.isNaN(Number(el.value))) return;
      let newValueTo = Number(el.value);
      if (isTwoHandles) {
        const valueFrom = Number(this.$valueFrom.val());
        if (newValueTo < valueFrom) newValueTo = valueFrom;
      }
      this.rangeslider.update({ valueTo: newValueTo });
    }
    this.updatePanelValues();
  }

  private handleMinValueInput(event: JQuery.TriggeredEvent): void {
    const { isTwoHandles } = this.rangeslider.data;
    const el = event.target as HTMLInputElement;
    let minValue = parseInt(el.value, 10);

    if (!Number.isNaN(minValue)) {
      el.value = minValue.toString();
      const maxValue = parseInt(String(this.$maxValue.val()), 10);
      if (minValue >= maxValue) {
        el.value = (maxValue - 1).toString();
        minValue = parseInt(el.value, 10);
      }
      const toValue = parseInt(String(this.$valueTo.val()), 10);
      const fromValue = parseInt(String(this.$valueFrom.val()), 10);
      if (toValue < minValue) this.$valueTo.val(minValue);
      if (isTwoHandles && fromValue < minValue) {
        this.$valueFrom.val(el.value);
      }
      if (!this.isStepValid()) this.$stepValue.val(this.getRangeLength().toString());
      this.rangeslider.update({
        minValue: el.value,
        valueFrom: Number(this.$valueFrom.val()),
        valueTo: Number(this.$valueTo.val()),
      });
    }
  }

  private handleMaxValueInput(event: JQuery.TriggeredEvent): void {
    const { isTwoHandles } = this.rangeslider.data;
    const el = event.target as HTMLInputElement;
    let maxValue = parseInt(el.value, 10);

    if (!Number.isNaN(maxValue)) {
      el.value = maxValue.toString();
      const minValue = parseInt(String(this.$minValue.val()), 10);
      if (maxValue <= minValue) {
        el.value = (minValue + 1).toString();
        maxValue = parseInt(el.value, 10);
      }
      const toValue = parseInt(String(this.$valueTo.val()), 10);
      const fromValue = parseInt(String(this.$valueFrom.val()), 10);
      if (toValue > maxValue) this.$valueTo.val(maxValue);
      if (isTwoHandles && fromValue > maxValue) {
        this.$valueFrom.val(minValue);
      }

      if (!this.isStepValid()) {
        this.$stepValue.val(this.getRangeLength().toString());
      }
      this.rangeslider.update({
        maxValue: el.value,
        valueFrom: Number(this.$valueFrom.val()),
        valueTo: Number(this.$valueTo.val()),
      });
    }
  }

  private handleIsShowTipsChange(event: JQuery.TriggeredEvent): void {
    const el = event.target as HTMLInputElement;
    this.rangeslider.update({ isTip: el.checked });
  }

  private updatePanelValues(): void {
    const {
      items,
      items: { values, indexFrom, indexTo },
      isVertical,
      isTwoHandles,
      isTip,
      minValue,
      maxValue,
      valueFrom,
      valueTo,
      stepValue,
    } = this.rangeslider.data;
    const isUsingItems = values.length > 1;
    this.$isVertical.prop('checked', isVertical);
    this.$isTwoHandles.prop('checked', isTwoHandles);
    this.$isShowTips.prop('checked', isTip);
    this.$minValue.val(isUsingItems ? items.values[0] : minValue);
    this.$maxValue.val(isUsingItems ? values[values.length - 1] : maxValue);
    if (isTwoHandles) this.$valueFrom.val(valueFrom);
    this.$valueTo.val(valueTo);
    if (this.select && this.select.length > 1) {
      if (isTwoHandles) {
        this.$indexFrom.prop('disabled', false);
        this.$indexFrom.val(indexFrom);
      }
      this.$indexTo.prop('disabled', false);
      this.$indexTo.val(indexTo);
    } else {
      this.$indexFrom.prop('disabled', true);
      this.$indexTo.prop('disabled', true);
    }
    this.$stepValue.val(stepValue);
  }

  private getRangeLength(): number {
    return Number(this.$maxValue.val()) - Number(this.$minValue.val());
  }

  private isStepValid(): boolean {
    return Number(this.$stepValue.val()) < this.getRangeLength();
  }

  private preventMinusTyping(event: JQuery.TriggeredEvent): void {
    if (event.key === '-') event.preventDefault();
  }

  private handleIsVerticalChange(event: JQuery.TriggeredEvent): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) this.$panel.addClass(this.CLASSES.modIsVertical);
    else this.$panel.removeClass(this.CLASSES.modIsVertical);
    this.rangeslider.update({ isVertical: checkbox.checked });
  }

  private handleIsTwoHandlesChange(event: JQuery.TriggeredEvent): void {
    const {
      items: { values },
    } = this.rangeslider.data;
    const checkbox = event.target as HTMLInputElement;
    this.rangeslider.update({ isTwoHandles: checkbox.checked });
    const isUsingItems = values.length > 1;
    if (!checkbox.checked) {
      this.$valueFrom.prop('disabled', true);
      if (isUsingItems) this.$indexFrom.prop('disabled', true);
    } else {
      this.$valueFrom.prop('disabled', false);
      if (isUsingItems) this.$indexFrom.prop('disabled', false);
      if (!isUsingItems) {
        const minValue: number = parseInt(String(this.$minValue.val()), 10);
        const maxValue: number = parseInt(String(this.$maxValue.val()), 10);
        let valueFrom: number = parseInt(String(this.$valueFrom.val()), 10);
        if (Number.isNaN(Number(valueFrom))) valueFrom = minValue;
        const valueTo: number = parseInt(String(this.$valueTo.val()), 10);
        if (valueFrom < minValue || valueFrom > valueTo || valueFrom > maxValue) valueFrom = minValue;
        this.rangeslider.update({ valueFrom });
      }
    }
    this.updatePanelValues();
  }
}
