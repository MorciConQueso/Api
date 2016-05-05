/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');

function login(body, callback) {
    var sql = "select * from usuarios where nickname = '" + body.nickname + "'";
    bd.query(sql, function (err, rows, fileds) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err
        }
        else {
            statusCode = 200;
            if (rows.length > 0) {
                if (checkPassword(body, rows[0])) {
                    json.res = 1;
                    json.user = rows[0];
                }
                else {
                    json.res = 2;
                    json.result = "Invalid password"
                }
            }
            else {
                json.res = 3;
                json.result = "Invalid user"
            }
        }
        callback(json, statusCode);
    })
}

function checkPassword(body, user) {
    var pass = body.password;
    var pass2 = user.password;
    return pass === pass2;
}

module.exports.login = login;