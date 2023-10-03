const {
    Client
} = require('pg');

const db = new Client({
    user: 'melchiornatthan',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = db;