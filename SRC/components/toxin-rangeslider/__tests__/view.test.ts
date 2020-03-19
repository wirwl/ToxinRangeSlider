import '../core/view';
import '../../toxin-rangeslider/toxin-rangeslider';
import TRSPresenter from '../core/presenter';
import TRSView from '../core/view';
import TRSModel from '../core/model';

const pug = require('pug');
const fs = require('fs');
const path = require('path');
const less = require('less');
let cssFromLess: string;
// let plugin: JQuery<HTMLElement>;
// let rangeslider: TRSPresenter;
let view: TRSView;

function fixWidthForJSDOM(root: JQuery<HTMLElement>) {
    const widthRoot = parseFloat(root.css('width'));
    const widthRS = widthRoot - parseFloat(root.css('border-left-width')) - parseFloat(root.css('border-right-width'));
    const rs = root.find('.rangeslider');
    const widthLine = widthRS - parseFloat(rs.css('border-left-width')) - parseFloat(rs.css('border-right-width'));
}
function addHtmlCSStoJSDOM() {
    const urlLess = new URL(
        path.normalize(__dirname + '../../../../components/toxin-rangeslider/toxin-rangeslider.less'),
    );
    const urlCommonLess = new URL(path.normalize(__dirname + '../../../../common.less'));

    const getHtmlFromPug = pug.compileFile('src/pages/index/index.pug');
    const LessFromFile = fs.readFileSync(urlLess.href, 'utf8');
    const LessFromFileCommon = fs.readFileSync(urlCommonLess.href, 'utf8');

    let cssFromLessCommon: string;
    less.render(LessFromFileCommon, function(e: Less.RenderError, output: Less.RenderOutput | undefined) {
        cssFromLessCommon = output.css;
    });
    less.render(LessFromFile, function(e: Less.RenderError, output: Less.RenderOutput | undefined) {
        cssFromLess = output.css;
    });
    document.documentElement.innerHTML = getHtmlFromPug();
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssFromLessCommon + cssFromLess;
    head.appendChild(style);
}

function ConfigureJSDOM() {
    const textHTML =
        '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
    const fixWidth = '.test-in-jest {width: 390px;}.rangeslider{width: 390px;}.rangeslider__line{width: 390px;}';
    const urlLess = new URL(
        path.normalize(__dirname + '../../../../components/toxin-rangeslider/toxin-rangeslider.less'),
    );
    const urlCommonLess = new URL(path.normalize(__dirname + '../../../../common.less'));

    const LessFromFile = fs.readFileSync(urlLess.href, 'utf8');
    const LessFromFileCommon = fs.readFileSync(urlCommonLess.href, 'utf8');

    let cssFromLessCommon: string;
    less.render(LessFromFileCommon, function(e: Less.RenderError, output: Less.RenderOutput | undefined) {
        cssFromLessCommon = output.css;
    });
    less.render(LessFromFile, function(e: Less.RenderError, output: Less.RenderOutput | undefined) {
        cssFromLess = output.css;
    });
    document.documentElement.innerHTML = textHTML;
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssFromLessCommon + cssFromLess + fixWidth;
    head.appendChild(style);
}

beforeAll(async () => {
    ConfigureJSDOM();
    //plugin = $('.test-in-jest');
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
    // plugin.toxinRangeSlider();
    // rangeslider = plugin.data('toxinRangeSlider');
});

describe('Check result of getNearestHandle() function. Six different tests.', () => {
    beforeEach(() => {});
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

// test('Check result of validate() function in view layer', () => {
//     expect(rangeslider.view.validate(9999)).toBe(244);
// });

// test('Check result of convertRelativeValueToPixelValue function', () => {
//     rangeslider.update({ minValue: 10, maxValue: 1000 });
//     expect(rangeslider.view.convertRelativeValueToPixelValue(750)).toBe(182.3838383838384);
// });

afterAll(() => {});
