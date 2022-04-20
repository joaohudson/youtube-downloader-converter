const clientsInfo = require('./clients-info.json');
const {get} = require('axios');

const UpdateInfo = {
    None: 'None',
    Correction: 'Correction',
    Feature: 'Feature',
    Required: 'Required'
}

const githubBaseurl = 'https://api.github.com/repos/joaohudson/';
const headers = {Accept: 'application/vnd.github.v3+json'};

async function fetchRepository(repo){
    try{
        return await get(githubBaseurl + repo + '/releases', {headers});
    }
    catch(e){
        console.log('[clients.js] - [fetchRepository]');
        console.log(e);
        return null;
    }
}

async function fetchClients(){
    const clients = [];
    for(const info of clientsInfo){
        const response = await fetchRepository(info.repository);

        if(!response)
            continue;

        const releases = response.data;
        clients.push({name: info.name, downloadName: info.downloadName, url: releases[0].assets[0].browser_download_url});
    }
    return clients;
}

async function checkUpdate(clientName, version){
    try{
        const infos = clientsInfo.filter(info => info.name == clientName);
        if(infos.length == 0){
            throw 'Client name not found: ' + clientName;
        }
    
        const info = infos[0];
        const response = await fetchRepository(info.repository);

        const lastRelease = response.data[0];
        const tagName = lastRelease.tag_name;

        const lastVersion = tagName.substring(1).split('.');
        const currentVersion = version.split('.');

        if(lastVersion[0] > currentVersion[0]){
            return {
                info: UpdateInfo.Required
            };
        }
        else if(lastVersion[1] > currentVersion[1]){
            return {
                info: UpdateInfo.Feature
            };
        }
        else if(lastVersion[2] > currentVersion[2]){
            return {
                info: UpdateInfo.Correction
            };
        }
        else{
            return {
                info: UpdateInfo.None
            };
        }
    }
    catch(e){
        console.log('[clients.js] - [checkUpdate]');
        console.log(e);
        return {
            info: UpdateInfo.None
        };
    }
}

module.exports = {
    fetchClients,
    checkUpdate
}