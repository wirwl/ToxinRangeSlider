class TRSModel {
  settings: RangeSliderOptions;

  static defaults: RangeSliderOptions = {
    isVertical: false,
    isTwoHandles: true,
    isTip: true,
    minValue: 0,
    maxValue: 1000,
    stepValue: 1,
    valueFrom: 0,
    valueTo: 1000,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onHandlePositionChange(this: HandleMovingResult): void {},
  };

  constructor(options?: RangeSliderOptions) {
    this.settings = {};
    $.extend(true, this.settings, TRSModel.defaults);
    $.extend(true, this.settings, options);
  }

  validate() {
    const { items, stepValue, isTwoHandles, isVertical, isTip } = this.settings;

    const indexFrom = items?.indexFrom;
    const indexTo = items?.indexTo;
    const values = items?.values;
    const isUsingItems = items!?.values!?.length > 1;

    if (isUsingItems) {
      this.settings.minValue = values![0]!;
      this.settings.maxValue = values![values!.length - 1];
      this.settings.valueFrom = values![indexFrom!];
      this.settings.valueTo = values![indexTo!];

      if (typeof indexFrom === 'undefined') this.settings.items!.indexFrom = 0;
      if (typeof indexTo === 'undefined') this.settings.items!.indexTo = values!.length - 1;

      if (indexTo! > values!.length - 1) {
        this.settings.items!.indexTo = values!.length - 1;
      }
      if (isTwoHandles) {
        if (indexFrom! > indexTo!) {
          this.settings.items!.indexFrom = indexTo;
        }
        if (indexFrom! < 0) this.settings.items!.indexFrom = 0;
      }
    } else {
      let maxValue = Number(isUsingItems ? items!.values![items!.values!?.length - 1]! : this.settings.maxValue);
      let minValue = Number(isUsingItems ? items!.values![0]! : this.settings.minValue);
      let { valueFrom } = this.settings;
      let { valueTo } = this.settings;

      if (typeof isVertical !== 'boolean') this.settings.isVertical = TRSModel.defaults.isVertical;
      if (typeof isTwoHandles !== 'boolean') this.settings.isTwoHandles = TRSModel.defaults.isTwoHandles;
      if (typeof isTip !== 'boolean') this.settings.isTip = TRSModel.defaults.isTip;
      if (Number.isNaN(minValue)) this.settings.minValue = Number(TRSModel.defaults.minValue);
      if (Number.isNaN(maxValue)) this.settings.maxValue = Number(TRSModel.defaults.maxValue!);
      if (Number.isNaN(valueFrom)) this.settings.valueFrom = Number(TRSModel.defaults.valueFrom!);
      if (Number.isNaN(valueTo)) this.settings.valueTo = Number(TRSModel.defaults.valueTo!);
      if (Number.isNaN(stepValue)) this.settings.stepValue = TRSModel.defaults.stepValue;
      if (typeof items !== 'object') this.settings.items = TRSModel.defaults.items!;

      if (minValue === maxValue) {
        this.settings.valueFrom = minValue;
        valueFrom = this.settings.valueFrom;
        this.settings.maxValue = minValue + 1;
        maxValue = Number(isUsingItems ? items!.values![items!.values!?.length - 1]! : this.settings.maxValue);
        this.settings.valueTo = maxValue;
        valueTo = maxValue;
      }

      if (maxValue < minValue!) {
        this.settings.minValue = maxValue;
        this.settings.maxValue = minValue;
        minValue = maxValue;
        maxValue = minValue;
        if (valueFrom! < minValue || valueFrom! > maxValue) this.settings.valueFrom = minValue;

        if (valueTo! < minValue || valueTo! > maxValue) this.settings.valueTo = maxValue;
      }

      const size = maxValue - minValue!;
      if (stepValue! < 1) this.settings.stepValue = 1;
      if (this.settings.stepValue! > size) this.settings.stepValue = size;

      if (isTwoHandles) {
        if (valueFrom! > valueTo!) {
          this.settings.valueFrom = valueTo;
          this.settings.valueTo = valueFrom;
          valueFrom = this.settings.valueFrom;
          valueTo = this.settings.valueTo;
        }
        if (valueTo! < valueFrom!) this.settings.valueTo = valueFrom;

        if (valueFrom! < minValue) this.settings.valueFrom = minValue;
      } else if (valueTo! < minValue) this.settings.valueTo = minValue;

      if (valueTo! > maxValue) this.settings.valueTo = maxValue;
    }
  }
}

export default TRSModel;
