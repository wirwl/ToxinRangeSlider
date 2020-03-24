import '../core/view';
import '../../toxin-rangeslider/toxin-rangeslider';
import TRSView from '../core/view';
import CRangeSliderOptions from '../core/entities/crangeslideroptions';

const fs = require('fs');
const path = require('path');
const less = require('less');
let cssFromLess: string;
let view: TRSView;

let options: CRangeSliderOptions;

beforeAll(() => {
    options = new CRangeSliderOptions({
        isVertical: false,
        isTwoHandles: true,
        isTip: true,
        minValue: 0,
        maxValue: 1220,
        stepValue: 0,
        valueFrom: 0,
        valueTo: 1220,
        items: { indexFrom: 0, indexTo: 1, values: [2, 4, 8, 16, 32] },
    });
});

describe('Check result of findIndexByItem() method. ', () => {
    test('If values in items have number type', () => {
        expect(options.findIndexByItem(8)).toBe(2);
    });
    test('If values in items have string type', () => {
        options.extend({
            items: {
                values: [
                    'январь',
                    'февраль',
                    'март',
                    'апрель',
                    'май',
                    'июнь',
                    'июль',
                    'август',
                    'сентябрь',
                    'октябрь',
                    'ноябрь',
                    'декабрь',
                ],
            },
        });
        expect(options.findIndexByItem('май')).toBe(4);
    });
});
