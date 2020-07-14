/* eslint-disable @typescript-eslint/no-var-requires */
import TRSView from '../core/view';
import TRSModel from '../core/model';
import TRSPresenter from '../core/presenter';

const path = require('path');
const fs = require('fs');
const less = require('less');

let cssFromLess: string;
let presenter: TRSPresenter;

function ConfigureJSDOM() {
    const textHTML =
        '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
    const fixWidth = '.test-in-jest {width: 390px;}.rangeslider{width: 390px;}.rangeslider__line{width: 390px;}';
    const urlLess = new URL(
        path.normalize(__dirname + '../../../../components/toxin-rangeslider/toxin-rangeslider.less'),
    );

    const LessFromFile = fs.readFileSync(urlLess.href, 'utf8');

    less.render(LessFromFile, function(e: Less.RenderError, output: Less.RenderOutput | undefined) {
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
    const options = {
        isVertical: false,
        isTwoHandles: true,
        isTip: true,
        minValue: 0,
        maxValue: 1060,
        stepValue: 0,
        valueFrom: 322,
        valueTo: 720,
    };
    presenter = new TRSPresenter(new TRSModel(options), new TRSView($('.test-in-jest')));
});

describe('Check if model is updated after handles position change', () => {
    test('Left handle', () => {
        const oldValue = presenter.model.settings.valueFrom;
        presenter.onHandlePositionUpdate(presenter.view.handleFrom, 150);
        expect(presenter.model.settings.valueFrom).toBe(425);
    });
    test('Right handle', () => {
        const oldValue = presenter.model.settings.valueFrom;
        presenter.onHandlePositionUpdate(presenter.view.handleFrom, 200);
        expect(presenter.model.settings.valueFrom).toBe(567);
    });
});