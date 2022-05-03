'use strict';

const fs = require('fs')
const sqlite3 = require('sqlite3');

const dbFileName = './database.sqlite3';

const createTable = `
    CREATE TABLE IF NOT EXISTS likedNFTs (
        id TEXT,
        token TEXT,
        contract TEXT,
        wallet TEXT,
        likes NUMBER);
`;

function createDatabase() {
    const db = new sqlite3.Database(dbFileName);
    if (!fs.existsSync(dbFileName)) {
        fs.openSync(dbFileName, 'w');

        db.run(createTable, (err) => {
            if (err) {
                throw createResult;
            } else {
                console.log('Likes table created.');
            }
        });
    } else {
        console.log('Connected to database.');
    }
    return db;
}

module.exports = {
    createDatabase
}