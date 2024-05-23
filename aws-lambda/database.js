const mysql = require('mysql');
const util = require('util');

function createConnection() {
    const connection = mysql.createConnection({
       host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    connection.connect(err => {
        if (err) {
            console.error('Error connecting to the database: ' + err.stack);
            return;
        }
        console.log('Connected to database with ID ' + connection.threadId);
    });

    connection.query = util.promisify(connection.query);
    return connection;
}

module.exports = createConnection;
