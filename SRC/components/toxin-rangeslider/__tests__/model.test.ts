import TRSModel from '../core/model';
import defaultRangeSliderState from '../core/defaults';

let model: TRSModel;

beforeAll(async () => {
  model = new TRSModel();
});

describe('Check getState and setState methods', () => {
  test('Check what return getState method', () => {
    expect(model.getState()).toStrictEqual(defaultRangeSliderState);
  });

  test('Check what return setState method', () => {
    const newValues = {
      isVertical: true,
      isTwoHandles: false,
      isTip: false,
      minValue: 110,
      maxValue: 2234,
      stepValue: 10,
      valueFrom: 110,
      valueTo: 2234,
      items: { indexFrom: 0, indexTo: 0, values: [] },
    };
    model.setState(newValues);
    expect(model.getState()).toStrictEqual(newValues);
  });
});

describe('Check set and get methods for each rangeslider state values, such as isVertical, isTwoHandles, isTip, minValue, maxValue, stepValue, valueFrom, valueTo, items, indexFrom, indexTo, values', () => {
  test('Check what return setIsVertical method', () => {
    model.setIsVertical(false);
    expect(model.getIsVertical()).toBe(false);
  });

  test('Check what return getIsTwoHandles method', () => {
    model.setIsTwoHandles(true);
    expect(model.getIsTwoHandles()).toBe(true);
  });

  test('Check what return getIsTip method', () => {
    model.setIsTip(false);
    expect(model.getIsTip()).toBe(false);
  });

  test('Check what return getMinValue method', () => {
    model.setMinValue(0);
    expect(model.getMinValue()).toBe(0);
  });

  test('Check what return getMaxValue method', () => {
    model.setMaxValue(3003);
    expect(model.getMaxValue()).toBe(3003);
  });

  test('Check what return getStepValue method', () => {
    model.setStepValue(77);
    expect(model.getStepValue()).toBe(77);
  });

  test('Check what return getValueFrom method', () => {
    model.setValueFrom(154);
    expect(model.getValueFrom()).toBe(154);
  });

  test('Check what return getValueTo method', () => {
    model.setValueTo(154);
    expect(model.getValueTo()).toBe(154);
  });

  test('Check what return getItems method', () => {
    const items = { indexFrom: 0, indexTo: 3, values: [1, 2, 3, 4] };
    model.setItems(items);
    expect(model.getItems()).toStrictEqual(items);
  });

  test('Check what return getIndexFrom method', () => {
    model.setIndexFrom(1);
    expect(model.getIndexFrom()).toBe(1);
  });

  test('Check what return getIndexTo method', () => {
    model.setIndexTo(2);
    expect(model.getIndexTo()).toBe(2);
  });

  test('Check what return getItemsValues method', () => {
    const values = [1, 2, 3, 4, 5];
    model.setItemsValues(values);
    expect(model.getItemsValues()).toBe(values);
  });
});
