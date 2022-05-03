'use strict';

const express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    path = require('path'),
    cors = require('cors');

const port = process.env.PORT || 1337;

// Run DB Initialize/Connect
const init = require('./helpers/init-db.js');

// Open database in memory
global.db = init.createDatabase();

// Middle-ware
app.use('/', express.static(path.join(__dirname, './dist')))
app.use(cors()); // it enables all cors requests

// Server options
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Catch Body Parser Error
app.use((err, req, res, next) => {
    if (err.hasOwnProperty('type') && err.type == 'entity.parse.failed') {
        return res.status(400).json({ message: 'Please provide valid JSON in body.' });
    } else {
        next();
    }
});

// Routers
const router = require('./routes/router.js');
app.use('/api', router);


server.listen(port, () => {
    console.log(`Server listening on ${port}.`);
});
