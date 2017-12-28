let http = require('http'),
    https = require('https'),
    io = require('socket.io'),

    express = require('express'),
    app = express(),

    mongodb = require('mongodb'),
    mongClient = mongodb.MongoClient,

    Express = require('./components/express'),
    Socket = require('./components/socket');

let isDev = process.argv[2],
    localhostAddress = '';

global.conf = require('./config.json');
global.htmlHelpers = require('./helper/htmlHelper');

mongClient.connect(conf.mongodbURL, function (err, db) {
    if (err) throw err;
    global.db = db;
    global.ObjectID = function(id) {
        return new mongodb.ObjectID(id);
    };

    if (typeof isDev !== 'undefined' && isDev != null && isDev == 'dev') {
        localhostAddress = conf.localhostDev;
    } else {
        localhostAddress = conf.localhost;
    }

    if (typeof isDev !== 'undefined' && isDev != null && isDev == 'dev') {
        const server = http.createServer(app);
        io = io(server);
        server.listen(conf.portDev);
        console.log(`[DEV] Running on port: ${conf.portDev}`);
    } else {
        http.createServer((req, res) => {
            res.writeHead(301, {Location: 'https://' + req.headers.host + req.url});
            res.end();
        }).listen(conf.port);
        const serverSSL = https.createServer({
            cert: fs.readFileSync(conf.SSL.fullchain),
            key: fs.readFileSync(conf.SSL.privkey),
        }, app);
        io = io(serverSSL);
        serverSSL.listen(conf.portSSL);
        console.log(`[PRODUCTION] Running on port: ${conf.port}`);
    }

    new Express({express, app, localhostAddress}).main();
    new Socket({io}).main();
});