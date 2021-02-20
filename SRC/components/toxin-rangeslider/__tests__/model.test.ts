import TRSModel from '../core/model';
import defaultRangeSliderState from '../core/defaults';

let model: TRSModel;

beforeAll(async () => {
  model = new TRSModel();
});

describe('Check getState and setState methods', () => {
  test('Check that return getState method', () => {
    expect(model.getState()).toStrictEqual(defaultRangeSliderState);
  });

  test('Check that return setState method', () => {
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

  test('Check what return isTwoHandles method', () => {
    model.setIsTwoHandles(true);
    expect(model.getIsTwoHandles()).toBe(true);
  });
});

// describe('Check correctness of validate() function, that correct invalid values', () => {
//   describe('If rangeslider has set of values', () => {
//     test('Check if indexTo field value out of range (is greater than numbers of values)', () => {
//       $.extend(true, model.settings, { items: { values: [1, 2, 3, 4, 5], indexTo: 10 } });
//       model.validate();
//       expect(model.settings.items.indexTo).toBe(4);
//     });
//     describe('If rangeslider has two handles', () => {
//       test('Check if indexFrom field value is bigger than indexTo field value', () => {
//         $.extend(true, model.settings, { items: { values: [1, 2, 3, 4, 5], indexFrom: 12, indexTo: 3 } });
//         model.validate();
//         expect(model.settings.items.indexFrom).toBe(3);
//       });
//       test('Check if indexFrom field value is less than zero', () => {
//         $.extend(true, model.settings, { items: { values: [1, 2, 3, 4, 5], indexFrom: -1 } });
//         model.validate();
//         expect(model.settings.items.indexFrom).toBe(0);
//       });
//     });
//   });
//   describe('If rangeslider has range of values from one(min.) to another(max.)', () => {
//     test('Check if stepValue field value is less than zero', () => {
//       model = new TRSModel();
//       $.extend(true, model.settings, { items: { values: [] }, stepValue: -5 });
//       model.validate();
//       expect(model.settings.stepValue).toBe(1);
//     });
//     test('Check if stepValue field value is greater than length of rangeslider', () => {
//       model = new TRSModel();
//       $.extend(true, model.settings, {
//         items: { values: [] },
//         minValue: 100,
//         maxValue: 1000,
//         stepValue: 3000,
//       });
//       model.validate();
//       expect(model.settings.stepValue).toBe(900);
//     });
//     test('Check if valueTo field value is greater than maxValue field value', () => {
//       $.extend(true, model.settings, { items: { values: [] }, valueTo: 1000, maxValue: 921 });
//       model.validate();
//       expect(model.settings.valueTo).toBe(921);
//     });
//     describe('If rangeslider has two handles', () => {
//       test('Check if valueFrom field value is greater than valueTo field value ', () => {
//         $.extend(true, model.settings, {
//           items: { values: [] },
//           valueFrom: 2000,
//           valueTo: 1234,
//           maxValue: 5000,
//         });
//         model.validate();
//         expect(model.settings.valueFrom).toBe(1234);
//       });
//       test('Check if valueFrom field value is less than minValue field value ', () => {
//         $.extend(model.settings, {
//           items: { values: [] },
//           valueFrom: 2000,
//           minValue: 3000,
//           maxValue: 5000,
//         });
//         model.validate();
//         expect(model.settings.valueFrom).toBe(3000);
//       });
//     });
//   });
// });
