/**
 * Created by Usuario on 05/05/2016.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'academykids'
});

function connect() {
    connection.connect();
}

function query(sql, callback) {
    connection.query(sql, callback);
}

module.exports.connect = connect;
module.exports.query = query;