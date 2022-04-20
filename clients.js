const clientsInfo = require('./clients-info.json');
const {get} = require('axios');

const githubBaseurl = 'https://api.github.com/repos/joaohudson/';
const headers = {Accept: 'application/vnd.github.v3+json'};

async function fetchRepository(repo){
    try{
        return await get(githubBaseurl + repo + '/releases', {headers});
    }
    catch(e){
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

module.exports = {
    fetchClients
}