import CRangeSliderOptions from '../core/entities/crangeslideroptions';

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
    test('If the item is in the items array, number type', () => {
        expect(options.findIndexByItem(8)).toBe(2);
    });
    test('If the item is not in the items array, number type', () => {
        expect(options.findIndexByItem(64)).toBe(-1);
    });
    test('If the item is in the items array, string type', () => {
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
    test('If the item is not in the items array, string type', () => {
        expect(options.findIndexByItem('понедельник')).toBe(-1);
    });
});
