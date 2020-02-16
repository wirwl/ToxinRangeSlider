import '../core/view';
import '../../toxin-rangeslider/toxin-rangeslider';
import TRSPresenter from '../core/presenter';

const pug = require('pug');
const fs = require('fs');
const path = require('path');
const less = require('less');
let cssFromLess: string;
let plugin: JQuery<HTMLElement>;
let rangeslider: TRSPresenter;

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
    const fixWidth = '.test-in-jest {width: 260px;}.rangeslider{width: 260px;}.rangeslider__line{width: 260px;}';
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
    plugin = $('.test-in-jest');
    plugin.examplePlugin({
        isVertical: false,
        isInterval: true,
        isTip: true,
        minValue: 0,
        maxValue: 1060,
        stepValue: 0,
        valueFrom: 322,
        valueTo: 720,
    });
    rangeslider = plugin.data('toxinRangeSlider');
});

test('Check result of convertRelativeValueToPixelValue function', () => {
    expect(rangeslider.view.convertRelativeValueToPixelValue(10, 750, 1000)).toBe(182.3838383838384);
});

describe('Check result of getNearestHandle() function. Six diffrent tests.', () => {
    beforeEach(() => {});
    describe('If there are two handles.', () => {
        test('LMB clicked on the left of first handle', () => {
            expect(rangeslider.view.getNearestHandle(32)).toBe(rangeslider.view.handleFrom.el);
        });
        test('LMB clicked between two handles, closer to left handle', () => {
            expect(rangeslider.view.getNearestHandle(95)).toBe(rangeslider.view.handleFrom.el);
        });
        test('LMB clicked between two handles, closer to rigth handle', () => {
            expect(rangeslider.view.getNearestHandle(130)).toBe(rangeslider.view.$handleTo);
        });
        test('LMB clicked on the right of second handle', () => {
            expect(rangeslider.view.getNearestHandle(200)).toBe(rangeslider.view.$handleTo);
        });
    });
    describe('If there are one handle.', () => {
        beforeAll(() => {
            rangeslider.update({
                isInterval: false,
                valueTo: 491,
            });
        });
        test('LMB clicked on the left of handle', () => {
            expect(rangeslider.view.getNearestHandle(41)).toBe(rangeslider.view.handleFrom.el);
        });
        test('LMB clicked on the right of handle', () => {
            expect(rangeslider.view.getNearestHandle(203)).toBe(rangeslider.view.$handleTo);
        });
    });
});

afterAll(() => {
    //await page.close();
    //await browser.close();
});
