import '../core/view';
import TRSView from '../core/view';
//import $ from 'jquery';
//const absolutePath = path.join(__dirname, 'style.css');
const $ = require('jquery');
const pug = require('pug');
const path = require('path');
const less = require('less');
const html =
    '<!DOCTYPE html><html lang="en"><head><title>ToxinRangeSlider1</title><style>.rangeslider__line {width:247px} </style></head><body><div class="test" style="width: 247px"></div></body></html>';
// import puppeteer from 'puppeteer';

// let browser: Promise<puppeteer.Browser>;
// let page: Promise<puppeteer.Page>;

// async function injectJquery(page: puppeteer.Page) {
//     await page.evaluate(() => {
//         const jq = document.createElement('script');
//         jq.setAttribute('type', 'text/javascript');
//         jq.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
//         return new Promise(resolve => {
//             jq.addEventListener('load', () => {
//                 resolve();
//             });
//             document.getElementsByTagName('head')[0].appendChild(jq);
//         });
//     });
//     const watchDog = page.waitForFunction('window.jQuery !== undefined');
//     await watchDog;
// }

beforeAll(async () => {
    // browser = puppeteer.launch({
    //     ignoreDefaultArgs: ['--disable-extensions'],
    // });
    // page = (await browser).newPage();
    // // https://code.jquery.com/jquery-3.2.1.min.js' });
    // console.log(page.content());
    // page.setContent('<div class="test" style="width=247px"><div>');
    // console.log(page.content());
    //await page.goto('https://google.com');
    //await browser.newPage();
    // await page.setContent('<!DOCTYPE html><html lang="en"><head><title>Google</title></head><body></body></html>');
    // await injectJquery(page);
    //await page.addScriptTag({ url: require.resolve('jquery') });
    // const JQ: any = await $(
    //     page.evaluate(() => {
    //         return window;
    //     }),
    // );
    // const w = await page.evaluate(() => {
    //     console.log(window);
    //     return 'a';
    // });
    //console.log(w);

    const compiledFunction = pug.compileFile('src/pages/index/index.pug');

    less.render('.class { width: (1 + 1) }', function(e: Less.RenderError, output: Less.RenderOutput | undefined) {
        console.log(output.css);
    });

    //console.log(compiledFunction());
    document.documentElement.innerHTML = compiledFunction();
});

test('Check result of convertRelativeValueToPixelValue function', () => {
    // const $: JQueryStatic = await page.evaluate(
    //     (): JQueryStatic => {
    //         const $ = (window as any).$;
    //         return $('head title')[0];
    //     },
    // );
    // console.log($('head title')[0]);
    //const view = new TRSView($('.test'));
    //expect(view.convertRelativeValueToPixelValue(0, 50, 100)).toBe(150);
    //document.body.innerHTML = '<div>' + '  <span id="username" />' + '  <button id="button" />' + '</div>';
    //await expect(page.title()).resolves.toMatch('Google');
});

afterAll(async () => {
    //await page.close();
    //await browser.close();
});
