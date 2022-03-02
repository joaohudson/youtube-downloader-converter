require('dotenv/config');
const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.get('/download', (req, res) => {
    const url = req.query.url;
    const type = req.query.type;

    if(type == 'mp4'){
        downloadMp4(url, res);
    }
    else if(type == 'mp3'){
        downloadMp3(url, res);
    }
});

app.get('/name', async (req, res) => {
    try{
        res.send(await getVideoName(req.query.url));
    }
    catch(e){
        res.status(e.status).send(e.message);
    }
});

app.listen(process.env.PORT, () =>{
    console.log('Server listen in port ' + process.env.PORT);
});

async function getVideoName(url){
    try{
        const info = await ytdl.getInfo(url);
        return info.player_response.videoDetails.title;
    }catch(e){
        throw {status: 400, message: 'Invalid url!' };
    }
}

function downloadMp4(url, res){
    res.setHeader('Content-Disposition', 'attachment; filename=video.mp4');
    ytdl(url, {format: 'mp4'})
    .on('error', () => res.status(400).send('Invalid url!'))
    .pipe(res);
}

function downloadMp3(url, res){
    res.setHeader('Content-Disposition', 'attachment; filename=video.mp4');
    ytdl(url, {filter: 'audioonly'})
    .on('error', (err) => res.status(400).send(err))
    .pipe(res);
}
