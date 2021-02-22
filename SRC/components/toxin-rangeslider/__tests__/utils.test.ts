import {
  convertPixelValueToRelativeValue,
  convertRelativeValueToPixelValue,
  isEqualArrays,
  mergeSliderOptions,
} from '../core/utils';

describe('Checking the return value of the mergeSliderOptions method', () => {
  const oldState = {
    isVertical: true,
    isTwoHandles: false,
    isTip: false,
    minValue: 2,
    maxValue: 8,
    stepValue: 1,
    valueFrom: 2,
    valueTo: 2,
    items: { indexFrom: 0, indexTo: 0, values: [2, 4, 8] },
  };
  const newState = {
    isVertical: false,
    isTwoHandles: false,
    isTip: true,
    minValue: 2,
    maxValue: 1024,
    valueFrom: 0,
    valueTo: 2,
    items: { indexFrom: 0, indexTo: 2, values: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024] },
  };
  const mergedState = {
    isVertical: false,
    isTwoHandles: false,
    isTip: true,
    minValue: 2,
    maxValue: 1024,
    stepValue: 1,
    valueFrom: 0,
    valueTo: 2,
    items: { indexFrom: 0, indexTo: 2, values: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024] },
  };
  test('If new items values defined (checking deepcopy)', () => {
    expect(mergeSliderOptions(oldState, newState)).toEqual(mergedState);
  });
});

describe('Checking the return value of the isEqualArrays method', () => {
  test('If first array is not defined', () => {
    const array1 = null;
    const array2 = [1, 2, 3, 4, 5];
    expect(isEqualArrays(array1, array2)).toBe(false);
  });

  test('If second array is not defined', () => {
    const array1 = [1, 2, 3, 4, 5];
    const array2 = null;
    expect(isEqualArrays(array1, array2)).toBe(false);
  });

  test('If both arrays is not defined', () => {
    const array1 = null;
    const array2 = null;
    expect(isEqualArrays(array1, array2)).toBe(false);
  });

  test('If arrays have different length', () => {
    const array1 = [1, 2, 3, 4, 5];
    const array2 = [1, 2, 3, 4, 5, 6, 7];
    expect(isEqualArrays(array1, array2)).toBe(false);
  });

  test('If arrays have different length and values', () => {
    const array1 = [1, 2, 3, 4, 5];
    const array2 = ['1', '2', '3', '4', '5'];
    expect(isEqualArrays(array1, array2)).toBe(false);
  });

  test('If arrays is equal (number values)', () => {
    const array1 = [1, 2, 3, 4, 5];
    const array2 = [1, 2, 3, 4, 5];
    expect(isEqualArrays(array1, array2)).toBe(true);
  });

  test('If arrays is equal (string values)', () => {
    const array1 = ['1', '2', '3', '4', '5'];
    const array2 = ['1', '2', '3', '4', '5'];
    expect(isEqualArrays(array1, array2)).toBe(true);
  });
});

const totalLineWidth = 390;
const offsetLeft = 8;
const offsetRigth = 8;
const lineWidth = totalLineWidth - offsetLeft - offsetRigth;
const stateWithoutItems = {
  isVertical: true,
  isTwoHandles: true,
  isTip: true,
  minValue: 123,
  maxValue: 1123,
  stepValue: 1,
  valueFrom: 110,
  valueTo: 2234,
  items: { indexFrom: 0, indexTo: 0, values: [] },
};

const stateWithItems = {
  isVertical: true,
  isTwoHandles: false,
  isTip: false,
  minValue: 2,
  maxValue: 1024,
  stepValue: 1,
  valueFrom: 2,
  valueTo: 4,
  items: { indexFrom: 0, indexTo: 1, values: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024] },
};

describe('Checking the return value of the convertPixelValueToRelativeValue method', () => {
  test('If items values is not defined', () => {
    expect(convertPixelValueToRelativeValue(187, lineWidth, stateWithoutItems)).toBe(623);
  });

  test('If items values is defined', () => {
    expect(convertPixelValueToRelativeValue(166.219, lineWidth, stateWithItems)).toBe(32);
  });
});

describe('Checking the return value of the convertRelativeValueToPixelValue method', () => {
  test('If items values is not defined', () => {
    expect(convertRelativeValueToPixelValue(623, lineWidth, stateWithoutItems)).toBe(187);
  });

  test('If items values is defined', () => {
    expect(convertRelativeValueToPixelValue(32, lineWidth, stateWithItems)).toBeCloseTo(166.219);
  });
});
