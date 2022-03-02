(function(){

    const urlField = document.getElementById('urlField');
    const downloadButton = document.getElementById('downloadButton');

    const menuDiv = document.getElementById('menu');
    const loadingDiv = document.getElementById('loading');

    const baseUrl = 'http://localhost:8082/download?url=';

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

    downloadButton.onclick = async () => {
        try{
            displayLoading(true);
            const url = await download(baseUrl + urlField.value);
            displayLoading(false);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'video.mp4';
            a.click();
            a.remove();
        }
        catch(e){
            alert(e);
            displayLoading(false);
        }
    }
})();