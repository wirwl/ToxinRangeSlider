import '../core/view';
import TRSView from '../core/view';

import puppeteer from 'puppeteer';
import { pageExtend } from 'puppeteer-jquery';
//import '../../../../node_modules/jquery/dist/jquery.js';
//import * as $ from 'jquery';
//const $: JQueryStatic = require('jquery');
//global['$'] = global['jQuery'] = $;

//window = (global as any).window;

//console.log($);

import '../../toxin-rangeslider/toxin-rangeslider';
import TRSModel from '../core/model';

//const examplePlugin = require('../../toxin-rangeslider/toxin-rangeslider');
//const puppeteer = require('puppeteer');
//import $ from 'jquery';
//var $ = require('jquery');
//const absolutePath = path.join(__dirname, 'style.css');
//const $ = require('../../../jquery/dist/jquery');

const pug = require('pug');
const fs = require('fs');
const path = require('path');
const less = require('less');
let cssFromLess: string;

// (global as any).window = window;
// (global as any).$ = $;

async function injectJquery(page: puppeteer.Page) {
    await page.evaluate(() => {
        const jq = document.createElement('script');
        jq.setAttribute('type', 'text/javascript');
        jq.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
        return new Promise(resolve => {
            jq.addEventListener('load', () => {
                resolve();
            });
            document.getElementsByTagName('head')[0].appendChild(jq);
        });
    });
    const watchDog = page.waitForFunction('window.jQuery !== undefined');
    await watchDog;
}

beforeAll(async () => {
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

    // console.log(cssFromLessCommon + cssFromLess);

    document.documentElement.innerHTML = getHtmlFromPug();
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssFromLessCommon + cssFromLess;
    head.appendChild(style);

    // $.document = document;
    // $.window = window;
    //console.log(document.documentElement.innerHTML);

    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // page.setViewport({ width: 1920, height: 1080 });
    //await page.setContent(getHtmlFromPug());
    // console.log($('.test1').length);

    //await injectJquery(page);
    //const pageEx = await pageExtend(page);
    //console.log(await pageEx.jQuery('.test1'));
    //await pageEx.screenshot({ path: 'testresult.png', fullPage: true });

    // (global as any).window.$ = jest.fn(() => {
    //     return { on: jest.fn() };
    // });
});

test('Check result of convertRelativeValueToPixelValue function', () => {
    // const view = new TRSView($('.test1'));
    // $.css = jest.fn().mockReturnValue(243);
    // expect(view.convertRelativeValueToPixelValue(10, 750, 1000)).toBe(169.6767676767677);
});

test('Check result value of calcLastStepValue function', () => {
    // const model = new TRSModel({ minValue: 10, maxValue: 999, stepValue: 100 });
    // expect(model.calcLastStepValue()).toBe(89);
});
let trs;
test('Check result of getNearestHandle() function', () => {
    $('.test1').examplePlugin({
        isVertical: false,
        isInterval: true,
        isTip: true,
        minValue: 0,
        maxValue: 1060,
        stepValue: 0,
        valueFrom: 322,
        valueTo: 720,
        values: [],
    });
    trs = $('.test1').data('toxinRangeSlider');
    expect(trs.view.getNearestHandle(32)).toBe(trs.view.$handleFrom);
});

afterAll(() => {
    //await page.close();
    //await browser.close();
});
