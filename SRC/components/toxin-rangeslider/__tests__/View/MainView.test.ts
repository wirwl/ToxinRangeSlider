/* eslint-disable dot-notation */

import path from 'path';
import less from 'less';
import fs from 'fs';
import TRSModel from '../../core/model';
import { mergeSliderOptions } from '../../core/utils';
import TRSView from '../../core/View/MainView';

let cssFromLess: string;
let view: TRSView;

function ConfigureJSDOM(): void {
  const textHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
  const fixWidth = '.test-in-jest {width: 390px;}.rangeslider{width: 390px;}.rangeslider__line{width: 390px;}';
  const urlLess = path.normalize(`${__dirname}../../../../../components/toxin-rangeslider/toxin-rangeslider.less`);

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

ConfigureJSDOM();
// eslint-disable-next-line prefer-const
view = new TRSView($('.test-in-jest'));
mergeSliderOptions(view['state'], TRSModel.defaults);
mergeSliderOptions(view['state'], {
  isVertical: false,
  isTwoHandles: true,
  isTip: true,
  minValue: 0,
  maxValue: 1060,
  stepValue: 0,
  valueFrom: 322,
  valueTo: 720,
});

describe('Check result of getNearestHandle() function. Six different tests.', () => {
  describe('If there are two handles.', () => {
    test('LMB clicked on the left of first handle', () => {
      expect(view['getNearestHandle'](32)).toBe(view.handleFromView);
    });
    test('LMB clicked between two handles, closer to left handle', () => {
      expect(view['getNearestHandle'](95)).toBe(view.handleFromView);
    });
    test('LMB clicked between two handles, closer to rigth handle', () => {
      expect(view['getNearestHandle'](208)).toBe(view.handleToView);
    });
    test('LMB clicked on the right of second handle', () => {
      expect(view['getNearestHandle'](300)).toBe(view.handleToView);
    });
  });
  describe('If there are one handle.', () => {
    beforeAll(() => {
      mergeSliderOptions(view['state'], {
        isTwoHandles: false,
        valueTo: 491,
      });
    });
    test('LMB clicked on the left of handle', () => {
      expect(view['getNearestHandle'](10)).toBe(view.handleToView);
    });
    test('LMB clicked on the right of handle', () => {
      expect(view['getNearestHandle'](203)).toBe(view.handleToView);
    });
  });
});
