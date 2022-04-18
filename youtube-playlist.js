const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {get} = require('axios');

const YOUTUBE_LOAD_TIME = 5000;

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

function checkYoutubeVideo(url){
    return url && url.includes('/watch?v=') && url.includes('index=');
}

function checkYoutubeMusicVideo(url){
    return url && url.includes('/watch?v=');
}

async function delay(time){
    return new Promise((res) => setTimeout(res, time));
}

async function getPlayListTitle(url){
    try{
        const response = await get(url);
        const page = response.data;
        
        const openTitleTag = '<title>';
        const begin = page.indexOf(openTitleTag) + openTitleTag.length;
        const end = page.indexOf(' - YouTube</title>');
        return page.substring(begin, end);
    }catch(e){
        throw 'Invalid url!';
    }
}

async function getPlayList(url){
    if(!url.includes('youtube.com'))
        throw 'Invalid url!';

    const checkVideo = url.includes('://music.youtube.com') ? checkYoutubeMusicVideo : checkYoutubeVideo;

    try{
        const driver = await new Builder().forBrowser('chrome').build();
        await driver.get(url);
        await delay(YOUTUBE_LOAD_TIME);
        const links = await driver.findElements(By.css('a'));
        const urls = [];

        for(const a of links){
            const href = await a.getAttribute('href');
            if(checkVideo(href)){
                urls.push(href);
            }
        }

        await driver.close();
        return Array.from(new Set(urls));
    }
    catch(e){
        console.log('[youtube-playlist.js] - [getPlayList]');
        console.log(e);
        throw 'Invalid url!';
    }
}

module.exports = {
    getPlayList,
    getPlayListTitle
};