//    "delay": "^4.1.0",
//    "puppeteer": "^1.11.0"


const puppeteer = require('puppeteer');
const delay = require('delay');
const cred = require('./credentials.json');

const launchSettings = Object.assign({
    defaultViewport: { width: 1000, height: 1000 },
},
    process.argv[2] === 'debug' ? {
        devtools: true,
        // headless: false,
        sloMo: 500,
    } : {}
);

(async () => {
    const browser = await puppeteer.launch(launchSettings);
    const page = await browser.newPage();

    await page.goto(cred.url);

    await page.waitFor('input[name$="UserNameInput"]');
    await delay(100);
    await page.type('input[name$="UserNameInput"]', cred.username, { delay: 24 });

    await page.waitFor('input[name$="PasswordInput"]');
    await delay(100);
    await page.type('input[name$="PasswordInput"]', cred.password, { delay: 24 });

    await Promise.all([
        page.waitForNavigation(),
        page.click('input[type="submit"]')
    ]);

    await page.screenshot({path: '0.png'});
    await browser.close();
})();