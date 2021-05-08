'use strict'
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MobileDetect = require('mobile-detect');
const winston = require('./winstonLogger');

const logWithPlatformDetails = (req, text) => {
    const md = new MobileDetect(req.headers['user-agent']);
    return `[${req.connection.remoteAddress}][${
        req.headers['x-forwarded-for']
    }] ${text} ${md.mobile()} ${md.userAgent()} ${md.os()} ${md.version(
        md.mobile()
    )}`;
};

app.use(express.static('build'));

app.get('/ping', function(req, res) {
    res.send('ok');
});

app.get('*', function(req, res, next) {
    winston.info(
        logWithPlatformDetails(req, `Resource requested: ${req.originalUrl}`)
    );
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

// We tell React Loadable to load all required assets and start listening - ROCK AND ROLL!
async function listen() {
    app.listen(PORT);
    console.log(`App listening on port ${PORT}!`)
    app.timeout = 30000;
}

listen()