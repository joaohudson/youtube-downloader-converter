const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const YOUTUBE_LOAD_TIME = 5000;

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function delay(time){
    return new Promise((res) => setTimeout(res, time));
}

async function getPlayList(url){
    if(!url.includes('youtube.com'))
        throw 'Invalid url!';

    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get(url);
    await delay(YOUTUBE_LOAD_TIME);
    const links = await driver.findElements(By.tagName('a'));
    const urls = [];

    for(const a of links){
        const href = await a.getAttribute('href');
        if(href && href.includes('/watch?v=') && href.includes('index=')){
            urls.push(href);
        }
    }

    await driver.close();
    return Array.from(new Set(urls));
}

module.exports = {
    getPlayList
};