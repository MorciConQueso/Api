/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');
var crypto = require('crypto');

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

function register(body, callback) {
    generateApiKey(function (apikey) {
        var sql = "INSERT INTO usuarios(nickname, password, tipo, nombre, apellidos, apiKey) VALUES (" +
            "'" + body.nickname + "', " +
            "'" + cryptPass(body.password) + "', " +
            "'" + body.tipo + "', " +
            "'" + body.nombre + "', " +
            "'" + body.apellidos + "', " +
            "'" + apikey + "'" +
            " )";
        bd.query(sql, function (err, rows, fields) {
            var json = {};
            var statuscode = 400;
            if (err) {
                json.res = 0;
                json.result = err;
            }
            else {
                statuscode = 200;
                json.res = 1;
                json.result = {
                    affectedRows: rows.affectedRows,
                    insertId: rows.insertId,
                    message: rows.message
                };
            }
            callback(json, statuscode);
        })
    });
}

function autenticate(head, callback) {
    var apiKey = head.authorization;
    var sql = "SELECT * from usuarios where apikey = '" + apiKey + "'";
    bd.query(sql, function (err, rows, fields) {
        if (err) callback(false, err);
        else {
            if (rows.length > 0) {
                if (rows[0].apiKey === apiKey) callback(true, rows[0]);
                else callback(false, "Invalid Key");
            }
            else
                callback(false, "Invalid User");
        }
    });
}

function changePass(body, user, callback) {
    if (body.idUsuario === user.id) {
        if (checkPassword({password: body.data.oldPass}, user)) {
            var newPass = cryptPass(body.data.newPass);
            var sql = "update usuarios set password = '" + newPass + "' where id = " + user.id;
            bd.query(sql, function (err, rows, fields) {
                var json = {};
                var statusCode = 400;
                if (err) {
                    json.res = 0;
                    json.result = err;
                }
                else {
                    user.password = newPass;
                    json.res = 1;
                    json.user = user;
                    statusCode = 200
                }
                callback(json, statusCode);
            })
        }
        else {
            var jsonA = {
                res: 4,
                result: "Invalid old password"
            };
            callback(jsonA, 400);
        }
    }
    else {
        var json = {
            res: 3,
            result: "Cant change password"
        };
        callback(json, 400);
    }
}

function updateUser(body, user, callback) {
    if (body.id === user.id) {
        var sql = "update usuarios set nombre = '" + body.nombre + "', apellidos = '" + body.apellidos + "' where id = " + body.id;
        bd.query(sql, function (err, rows, fields) {
            var json = {};
            var statusCode = 400;
            if (err) {
                json.res = 0;
                json.result = err;
            }
            else {
                user.nombre = body.nombre;
                user.apellidos = body.apellidos;
                statusCode = 200;
                json.res = 1;
                json.user = user;
            }
            callback(json, statusCode);
        });
    }
    else {
        var json = {
            res: 3,
            result: "Cant change password"
        };
        callback(json, 400);
    }
}

function generateApiKey(callback) {
    var hash = crypto.createHash('sha256');
    hash.on('readable', function () {
        var data = hash.read();
        if (data) callback(data.toString('hex'));
    });
    hash.write(new Date().getTime() + "");
    hash.end();
}

function cryptPass(pass) {
    var algoritm = 'aes-256-ctr';
    var key = 'd6F3Efeq';
    var cipher = crypto.createCipher(algoritm, key);
    var crypted = cipher.update(pass, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypPass(pass) {
    var algoritm = 'aes-256-ctr';
    var key = 'd6F3Efeq';
    var decipher = crypto.createDecipher(algoritm, key);
    var dec = decipher.update(pass, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function checkPassword(body, user) {
    var pass = body.password;
    var pass2 = decrypPass(user.password);
    return pass === pass2;
}

module.exports.login = login;
module.exports.register = register;
module.exports.changePass = changePass;
module.exports.updateUser = updateUser;
module.exports.autenticate = autenticate;