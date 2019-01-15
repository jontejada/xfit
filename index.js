const puppeteer = require('puppeteer');
const cred = require('./credentials.json');

const launchSettings = process.argv[2] === 'debug' ? {
    devtools: true,
    // headless: false,
    sloMo: 500,
} : {};

(async () => {
    const browser = await puppeteer.launch(launchSettings);
    const page = await browser.newPage();

    await page.goto(cred.url);
    await page.screenshot({path: '0.png'});
    await browser.close();
})();