const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

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

async function getPlayList(url){
    if(!url.includes('youtube.com'))
        throw 'Invalid url!';

    const checkVideo = url.includes('://music.youtube.com') ? checkYoutubeMusicVideo : checkYoutubeVideo;
    //TODO: remover
    console.log('>>>' + checkVideo.name);

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
            //TODO: remover
            console.log('>>>' + href);
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
    getPlayList
};