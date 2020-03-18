import TRSPresenter from '../core/presenter';
import '../../toxin-rangeslider/toxin-rangeslider';
import TRSModel from '../core/model';

const fs = require('fs');
const path = require('path');
const less = require('less');
let cssFromLess: string;
let plugin: JQuery<HTMLElement>;
let rangeslider: TRSPresenter;
let model: TRSModel;

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
    model = new TRSModel({});
});

describe('Check correctness of validate() function, that correct invalid values', () => {
    describe('If rangeslider has set of values', () => {
        test('Check if indexTo field value out of range (is greater than numbers of values)', () => {
            model.settings.extend({ items: { values: [1, 2, 3, 4, 5], indexTo: 10 } });
            model.validate();
            expect(model.settings.items.indexTo).toBe(4);
        });
        describe('If rangeslider has two handles', () => {
            test('Check if indexFrom field value is bigger than indexTo field value', () => {
                model.settings.extend({ items: { values: [1, 2, 3, 4, 5], indexFrom: 12, indexTo: 3 } });
                model.validate();
                expect(model.settings.items.indexFrom).toBe(3);
            });
            test('Check if indexFrom field value is less than zero', () => {
                model.settings.extend({ items: { values: [1, 2, 3, 4, 5], indexFrom: -1 } });
                model.validate();
                expect(model.settings.items.indexFrom).toBe(0);
            });
        });
    });
    describe('If rangeslider has range of values from one(min.) to another(max.)', () => {
        test('Check if stepValue field value is less than zero', () => {
            model.settings.extend({ items: { values: [] }, stepValue: -5 });
            model.validate();
            expect(model.settings.stepValue).toBe(0);
        });
        test('Check if stepValue field value is greater than length of rangeslider', () => {
            model.settings.extend({ items: { values: [] }, minValue: 100, maxValue: 1000, stepValue: 3000 });
            model.validate();
            expect(model.settings.stepValue).toBe(900);
        });
        test('Check if valueTo field value is greater than maxValue field value', () => {
            model.settings.extend({ items: { values: [] }, valueTo: 1000, maxValue: 921 });
            model.validate();
            expect(model.settings.valueTo).toBe(921);
        });
        describe('If rangeslider has two handles', () => {
            test('Check if valueFrom field value is greater than valueTo field value ', () => {
                model.settings.extend({ items: { values: [] }, valueFrom: 2000, valueTo: 1234, maxValue: 5000 });
                model.validate();
                expect(model.settings.valueFrom).toBe(1234);
            });
            test('Check if valueFrom field value is less than minValue field value ', () => {
                model.settings.extend({ items: { values: [] }, valueFrom: 2000, minValue: 3000, maxValue: 5000 });
                model.validate();
                expect(model.settings.valueFrom).toBe(3000);
            });
        });
    });
});
