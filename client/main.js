(function(){

    const urlField = document.getElementById('urlField');
    const downloadButton = document.getElementById('downloadButton');
    const formatSelect = document.getElementById('formatSelect');

    const menuDiv = document.getElementById('menu');
    const loadingDiv = document.getElementById('loading');
    const clientsDiv = document.getElementById('clientsDiv');

    const baseUrl = window.location.href;
    const githubBaseurl = 'https://api.github.com/repos/joaohudson/';
    
    const infoClients = [
        {
            name: 'Android Version',
            downloadName: 'YouTube Downloader and Converter.apk',
            repository: 'youtube-downloader-converter-mobile'
        },
        {
            name: 'Windows Version',
            downloadName: 'YouTube Downloader And Converter.zip',
            repository: 'youtube-downloader-converter-desktop'
        }
    ];

    async function fetchClients(){
        const clients = [];
        for(const info of infoClients){
            const headers = {Accept: 'application/vnd.github.v3+json'};
            const response = await fetch(githubBaseurl + info.repository + '/releases', {headers});

            if(!response.ok)
                continue;

            const releases = await response.json();
            clients.push({name: info.name, downloadName: info.downloadName, url: releases[0].assets[0].browser_download_url});
        }
        return clients;
    }

    function displayLoading(active){
        if(active){
            menuDiv.style.display = 'none';
            loadingDiv.style.display = 'block';
        }else{
            menuDiv.style.display = 'block';
            loadingDiv.style.display = 'none';
        }
    }

    async function download(url){
        const response = await fetch(url);

        if(!response.ok){
            throw (await response.text());
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    async function getVideoName(url, type){
        const response = await fetch(url);

        if(!response.ok){
            throw await response.text();
        }

        return await response.text() + '.' + type;
    }

    async function generateUrls(url){
        if(url.includes('playlist?')){
            const response = await fetch(baseUrl + 'playlist?url=' + url);
            if(!response.ok){
                throw 'Invalid url!';
            }

            return await response.json();
        }

        return [url];
    }

    async function getPlayListTitle(url){
        const response = await fetch(baseUrl + 'playlist-title?url=' + url);

        if(!response.ok){
            throw await response.text();
        }

        return await response.text();
    }

    downloadButton.onclick = async () => {
        try{
            const type = formatSelect.value;
            displayLoading(true);
            const urls = await generateUrls(urlField.value);
            const prefix = urls.length == 1 ? '' : '[' + await getPlayListTitle(urlField.value) + '] - ';
            for(const url of urls){
                const blobUrl = await download(baseUrl + 'download?type=' + type + '&url=' +url);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = prefix + await getVideoName(baseUrl + 'name?url=' + url, type);
                a.click();
                a.remove();
            }

            displayLoading(false);
        }
        catch(e){
            alert(e);
            displayLoading(false);
        }
    }

    async function main(){
        const clients = await fetchClients();

        for(let i = 0; i < clients.length - 1; i++){
            const client = clients[i];
            const a = document.createElement('a');
            a.href = client.url;
            a.download = client.downloadName;
            a.innerText = client.name;
            clientsDiv.appendChild(a);

            const separator = document.createElement('label');
            separator.id = 'separator';
            separator.innerText = '|';
            clientsDiv.appendChild(separator);
        }

        const client = clients[clients.length - 1];
        const a = document.createElement('a');
        a.href = client.url;
        a.download = client.downloadName;
        a.innerText = client.name;
        clientsDiv.appendChild(a);
    }

    main();
})();