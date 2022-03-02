require('dotenv/config');
const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.get('/download', (req, res) => {
    const url = req.query.url;
    res.setHeader('Content-Disposition', 'attachment; filename=video.mp4');
    ytdl(url, {format: 'mp4'})
    .on('error', () => res.status(400).send('Invalid url!'))
    .pipe(res);
});

app.listen(process.env.PORT, () =>{
    console.log('Server listen in port ' + process.env.PORT);
});