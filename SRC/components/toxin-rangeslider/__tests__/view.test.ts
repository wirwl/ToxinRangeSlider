import '../core/view';
import TRSView from '../core/view';
import puppeteer from 'puppeteer';
import { pageExtend } from 'puppeteer-jquery';
//import '../../../../node_modules/jquery/dist/jquery.js';
//import * as $ from 'jquery';
const $: JQueryStatic = require('jquery');
//global['$'] = global['jQuery'] = $;
import '../../toxin-rangeslider/toxin-rangeslider';
//const examplePlugin = require('../../toxin-rangeslider/toxin-rangeslider');
//const puppeteer = require('puppeteer');
//import $ from 'jquery';
//var $ = require('jquery');
//const absolutePath = path.join(__dirname, 'style.css');
//const $ = require('jquery');
const pug = require('pug');
const fs = require('fs');
const path = require('path');
const less = require('less');
let cssFromLess: string;

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

beforeAll(() => {
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
    //const browser = await puppeteer.launch({ headless: false });
    // await page.setContent(getHtmlFromPug());
    // await injectJquery(page);
    // const pageEx = await pageExtend(page);
    // console.log(await pageEx.jQuery('.test1'));
    // await pageEx.screenshot({ path: 'testresult.png', fullPage: true });
});

test('Check result of convertRelativeValueToPixelValue function', () => {
    //console.log($('.test1').children.length);
    $('.test1').examplePlugin();
    console.log($('.test1').find('.rangeslider__line').length);
    // const view = new TRSView($('.test1'));
    // console.log(view.$line[0].clientWidth);
    // expect(view.convertRelativeValueToPixelValue(0, 50, 100)).toBe(150);
});

afterAll(() => {
    //await page.close();
    //await browser.close();
});