/* eslint-disable @typescript-eslint/no-var-requires */
import TRSView from '../core/View/MainView';
import TRSModel from '../core/model';
import TRSPresenter from '../core/presenter';
import defaultRangeSliderState from '../core/defaults';

const path = require('path');
const fs = require('fs');
const less = require('less');

let cssFromLess: string;
let presenter: TRSPresenter;

function ConfigureJSDOM(): void {
  const textHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
  const fixWidth = '.test-in-jest {width: 390px;}.rangeslider{width: 390px;}.rangeslider__line{width: 390px;}';
  const urlLess = path.normalize(`${__dirname}../../../../components/toxin-rangeslider/toxin-rangeslider.less`);

  const LessFromFile = fs.readFileSync(urlLess, 'utf8');

  less.render(LessFromFile, (e: Less.RenderError, output: Less.RenderOutput | undefined) => {
    cssFromLess = output ? output.css : '';
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
  const model = new TRSModel();
  const view = new TRSView($('.test-in-jest'));
  presenter = new TRSPresenter(model, view);
});

describe('Check getState and setState methods', () => {
  test('Check what return getState method', () => {
    expect(presenter.getState()).toStrictEqual(defaultRangeSliderState);
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
    presenter.update(newValues);
    expect(presenter.getState()).toStrictEqual(newValues);
  });
});

describe('Check set and get methods for each rangeslider state values, such as isVertical, isTwoHandles, isTip, minValue, maxValue, stepValue, valueFrom, valueTo, items, indexFrom, indexTo, values', () => {
  test('Check what return setIsVertical method', () => {
    presenter.setIsVertical(false);
    expect(presenter.getIsVertical()).toBe(false);
  });

  test('Check what return getIsTwoHandles method', () => {
    presenter.setIsTwoHandles(true);
    expect(presenter.getIsTwoHandles()).toBe(true);
  });

  test('Check what return getIsTip method', () => {
    presenter.setIsTip(false);
    expect(presenter.getIsTip()).toBe(false);
  });

  test('Check what return getMinValue method', () => {
    presenter.setMinValue(0);
    expect(presenter.getMinValue()).toBe(0);
  });

  test('Check what return getMaxValue method', () => {
    presenter.setMaxValue(3003);
    expect(presenter.getMaxValue()).toBe(3003);
  });

  test('Check what return getStepValue method', () => {
    presenter.setStepValue(77);
    expect(presenter.getStepValue()).toBe(77);
  });

  test('Check what return getValueFrom method', () => {
    presenter.setValueFrom(154);
    expect(presenter.getValueFrom()).toBe(154);
  });

  test('Check what return getValueTo method', () => {
    presenter.setValueTo(154);
    expect(presenter.getValueTo()).toBe(154);
  });

  test('Check what return getItems method', () => {
    const items = { indexFrom: 0, indexTo: 3, values: [1, 2, 3, 4] };
    presenter.setItems(items);
    expect(presenter.getItems()).toStrictEqual(items);
  });

  test('Check what return getIndexFrom method', () => {
    presenter.setIndexFrom(1);
    expect(presenter.getIndexFrom()).toBe(1);
  });

  test('Check what return getIndexTo method', () => {
    presenter.setIndexTo(2);
    expect(presenter.getIndexTo()).toBe(2);
  });

  test('Check what return getItemsValues method', () => {
    const values = [1, 2, 3, 4, 5];
    presenter.setItemsValues(values);
    expect(presenter.getItemsValues()).toBe(values);
  });

  test('Check what return isUsingItems method', () => {
    expect(presenter.isUsingItems()).toBe(true);
  });
});
