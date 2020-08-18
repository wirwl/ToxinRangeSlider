/* eslint-disable @typescript-eslint/no-var-requires */
import TRSView from '../core/view';
import TRSModel from '../core/model';
import CRangeSliderOptions from '../core/entities/crangeslideroptions';

const path = require('path');
const less = require('less');
const fs = require('fs');

let cssFromLess: string;
let view: TRSView;

function ConfigureJSDOM() {
  const textHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
  const fixWidth = '.test-in-jest {width: 390px;}.rangeslider{width: 390px;}.rangeslider__line{width: 390px;}';
  const urlLess = new URL(
    path.normalize(`${__dirname}../../../../components/toxin-rangeslider/toxin-rangeslider.less`),
  );

  const LessFromFile = fs.readFileSync(urlLess.href, 'utf8');

  less.render(LessFromFile, (e: Less.RenderError, output: Less.RenderOutput | undefined) => {
    cssFromLess = output.css;
  });
  document.documentElement.innerHTML = textHTML;
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = cssFromLess + fixWidth;
  head.appendChild(style);
}

beforeAll(async () => {
  ConfigureJSDOM();
  view = new TRSView($('.test-in-jest'));
  view.settings.extend(TRSModel.defaults);
  view.settings.extend({
    isVertical: false,
    isTwoHandles: true,
    isTip: true,
    minValue: 0,
    maxValue: 1060,
    stepValue: 0,
    valueFrom: 322,
    valueTo: 720,
  });
});

describe('Check result of isEqualArrays() function, return value true or false', () => {
  const ar1String = ['a', 'bb', '123'];
  const ar2String = ['a', 'bb', '123'];
  const ar3String = ['a', 'bb', '124'];
  const ar4String = ['a', 'bb', '123', 'x'];
  const ar1Number = [1, 2, 3, 4, 5];
  const ar2Number = [1, 2, 3, 4, 5];
  const ar3Number = [1, 2, 3, 4, 6];
  const ar4Number = [1, 2, 3, 4, 5, 6];
  test('isEqualArrays() function return true if two array is equal, both arrays have string type', () => {
    expect(view.isEqualArrays(ar1String, ar2String)).toBe(true);
  });
  test('isEqualArrays() function return true if two array is equal, both arrays have number type', () => {
    expect(view.isEqualArrays(ar1Number, ar2Number)).toBe(true);
  });
  describe('Check if isEqualArrays() function return false, different situations', () => {
    test('If string arrays have different length', () => {
      expect(view.isEqualArrays(ar3String, ar4String)).toBe(false);
    });
    test('If number arrays have different length', () => {
      expect(view.isEqualArrays(ar3Number, ar4Number)).toBe(false);
    });
    test('If different values in string arrays, but same length', () => {
      expect(view.isEqualArrays(ar2String, ar3String)).toBe(false);
    });
    test('If different values in number arrays, but same length', () => {
      expect(view.isEqualArrays(ar2Number, ar3Number)).toBe(false);
    });
    test('Arrays have different types', () => {
      expect(view.isEqualArrays(ar2Number, ar3String)).toBe(false);
    });
    test('First array is null', () => {
      expect(view.isEqualArrays(null, ar3String)).toBe(false);
    });
    test('Second array is null', () => {
      expect(view.isEqualArrays(ar2Number, null)).toBe(false);
    });
  });
});

describe('Check result of getNearestHandle() function. Six different tests.', () => {
  describe('If there are two handles.', () => {
    test('LMB clicked on the left of first handle', () => {
      expect(view.getNearestHandle(32)).toBe(view.handleFrom);
    });
    test('LMB clicked between two handles, closer to left handle', () => {
      expect(view.getNearestHandle(95)).toBe(view.handleFrom);
    });
    test('LMB clicked between two handles, closer to rigth handle', () => {
      expect(view.getNearestHandle(208)).toBe(view.handleTo);
    });
    test('LMB clicked on the right of second handle', () => {
      expect(view.getNearestHandle(300)).toBe(view.handleTo);
    });
  });
  describe('If there are one handle.', () => {
    beforeAll(() => {
      view.settings.extend({
        isTwoHandles: false,
        valueTo: 491,
      });
    });
    test('LMB clicked on the left of handle', () => {
      expect(view.getNearestHandle(10)).toBe(view.handleTo);
    });
    test('LMB clicked on the right of handle', () => {
      expect(view.getNearestHandle(203)).toBe(view.handleTo);
    });
  });
});

describe('Check result of moveHandle() function', () => {
  test('If rangeslider has range of values from one(min.) to another(max.)  ', () => {
    const result: HandleMovingResult = view.moveHandle(view.handleFrom, 10);
    const relValue = view.convertPixelValueToRelativeValue(10);
    expect(result.isFromHandle).toBe(true);
    expect(result.value).toBe(relValue);
    expect(result.isUsingItems).toBe(view.settings.items?.values?.length > 1);
  });
  test('If rangeslider has collection of items', () => {
    view.settings.extend({ items: { values: [1, 2, 3, 4, 5], indexFrom: 0, indexTo: 4 } });
    const result: HandleMovingResult = view.moveHandle(view.handleTo, 20);
    const relValue = view.convertPixelValueToRelativeValue(20);
    expect(result.isFromHandle).toBe(false);
    expect(result.value).toBe(relValue);
    expect(result.isUsingItems).toBe(view.settings.items?.values?.length > 1);
  });
});

describe('Check result of convertRelativeValueToPixelValue() function', () => {
  test('If passed value is index for values array', () => {
    view.settings.extend({ items: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } });
    expect(view.convertRelativeValueToPixelValue(3)).toBe(102);
  });
  test('If passed value is relative value', () => {
    view.settings.extend({ minValue: 100, maxValue: 1100, items: { values: [] } });
    expect(view.convertRelativeValueToPixelValue(600)).toBe(187);
  });
});

describe('Check result of convertPixelValueToRelativeValue() function ', () => {
  test('If passed value is relative value', () => {
    expect(view.convertPixelValueToRelativeValue(187)).toBe(600);
  });
});

describe('Check result of validate() function', () => {
  describe('If there are two handles', () => {
    beforeEach(() => {
      view.drawSlider(
        null,
        new CRangeSliderOptions({
          isTwoHandles: true,
          minValue: 0,
          maxValue: 1060,
          valueFrom: 322,
          valueTo: 491,
          items: { values: [] },
        }),
      );
    });
    test('If from handle position is less than zero', () => {
      expect(view.validate(-5, view.handleFrom)).toBe(0);
    });
    test('If from handle position is bigger than to handle position', () => {
      expect(view.validate(444, view.handleFrom)).toBe(view.handleTo.getPos());
    });
    test('if to handle position is bigger than rangeslider length', () => {
      expect(view.validate(444, view.handleTo)).toBe(view.line.getSize() - view.handleTo.getSize());
    });
    test('if to handle position is less than from handle position', () => {
      expect(view.validate(100, view.handleTo)).toBe(view.handleFrom.getPos());
    });
  });
  describe('If only one handle', () => {
    beforeEach(() => {
      view.drawSlider(
        null,
        new CRangeSliderOptions({
          isTwoHandles: false,
          minValue: 0,
          maxValue: 1060,
          valueFrom: 322,
          valueTo: 491,
          items: { values: [] },
        }),
      );
    });
    test('If to handle position is less than zero', () => {
      expect(view.validate(-15, view.handleTo)).toBe(0);
    });
    test('if to handle position is bigger than rangeslider length', () => {
      expect(view.validate(500, view.handleTo)).toBe(view.line.getSize() - view.handleTo.getSize());
    });
  });
});

describe('Check result of getSteppedPos() function', () => {
  beforeEach(() => {
    view.drawSlider(
      null,
      new CRangeSliderOptions({
        isTwoHandles: true,
        minValue: 0,
        maxValue: 2000,
        valueFrom: 322,
        valueTo: 491,
        stepValue: 0,
        items: { values: [] },
      }),
    );
  });
  test('If there is no step', () => {
    expect(view.getSteppedPos(15)).toBe(null);
  });
  test('If there is step. Step is defined, rounding down ', () => {
    view.drawSlider(
      null,
      new CRangeSliderOptions({
        minValue: 0,
        maxValue: 374,
        stepValue: 100,
      }),
    );
    expect(view.getSteppedPos(40)).toBe(0);
  });
  test('If there is step. Step is defined, rounding up ', () => {
    view.drawSlider(
      null,
      new CRangeSliderOptions({
        minValue: 0,
        maxValue: 374,
        stepValue: 100,
      }),
    );
    expect(view.getSteppedPos(60)).toBe(100);
  });
  test('If there is step. Step not defined but pixel length of rangeslider is bigger than relative length, rounding down', () => {
    view.drawSlider(null, new CRangeSliderOptions({ minValue: 0, maxValue: 93.5, stepValue: 0 }));
    expect(view.getSteppedPos(1)).toBe(0);
  });
  test('If there is step. Step not defined but pixel length of rangeslider is bigger than relative length, rounding up', () => {
    view.drawSlider(null, new CRangeSliderOptions({ minValue: 0, maxValue: 93.5, stepValue: 0 }));
    expect(view.getSteppedPos(2)).toBe(4);
  });
  test('If there is step. Defined set of values, rounding down', () => {
    view.drawSlider(
      null,
      new CRangeSliderOptions({
        items: { values: [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], indexFrom: 0, indexTo: 9 },
      }),
    );
    expect(view.getSteppedPos(10)).toBe(0);
  });
  test('If there is step. Defined set of values, rounding up', () => {
    view.drawSlider(
      null,
      new CRangeSliderOptions({
        items: { values: [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], indexFrom: 0, indexTo: 9 },
      }),
    );
    expect(view.getSteppedPos(20)).toBe(37.4);
  });
});
