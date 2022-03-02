(function(){

    const urlField = document.getElementById('urlField');
    const downloadButton = document.getElementById('downloadButton');
    const formatSelect = document.getElementById('formatSelect');

    const menuDiv = document.getElementById('menu');
    const loadingDiv = document.getElementById('loading');

    const baseUrl = window.location.href;

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

    downloadButton.onclick = async () => {
        try{
            const type = formatSelect.value;
            displayLoading(true);
            const url = await download(baseUrl + 'download?type=' + type + '&url=' +urlField.value);
            displayLoading(false);

            const a = document.createElement('a');
            a.href = url;
            a.download = await getVideoName(baseUrl + 'name?url=' + urlField.value, type);
            a.click();
            a.remove();
        }
        catch(e){
            alert(e);
            displayLoading(false);
        }
    }
})();