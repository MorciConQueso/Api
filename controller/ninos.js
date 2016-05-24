/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');

function activateNino(body, idUser, callback) {
    var sql = "UPDATE ninos set activado = true where id = " + body.idNino + " and idUsuario = " + idUser;
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err
        }
        else {
            statusCode = 200;
            json.res = 1;
            json.result = {
                status: rows.serverStatus,
                affectedRows: rows.affectedRows,
                message: rows.message
            };
        }
        callback(json, statusCode);
    })
}

function getNinosUser(idUser, callback) {
    var sql = "select id, nombre, apellidos, privacidad, activado " +
        "from ninos " +
        "where idUsuario = " + idUser;
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err;
        }
        else {
            json.res = 1;
            json.ninos = rows;
            statusCode = 200;
        }
        callback(json, statusCode);
    });
}

function getNino(params, idUser, callback) {
    if (params.idNino === -1) {
        json({res: 4, result: "idNino no valido"});
        callback(json, 400);
    }
    else {
        var sql = "select * from ninos where id = " + params.idNino;
        bd.query(sql, function (err, rows, fields) {
            var json = {};
            var statusCode = 400;
            if (err) {
                json.res = 0;
                json.result = err;
            }
            else {
                if (rows.length === 0) {
                    json.res = 3;
                    json.result = "Niño not found";
                }
                else if (rows[0].idUsuario === idUser) {
                    statusCode = 200;
                    json.res = 1;
                    json.nino = rows[0] || null;
                }
                else {
                    json.res = 3;
                    json.result = "This kid is not your son"
                }
            }
            callback(json, statusCode);
        })
    }
}

function setNinoUser(body, callback) {
    var sql = "insert into ninos(nombre, apellidos, idUsuario) " +
        "values ('" + body.nombre + "', '" + body.apellidos + "', " + body.idPadre + ")";
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err;
        }
        else {
            json.res = 1;
            json.result = {
                affectedRows: rows.affectedRows,
                insertId: rows.insertId,
                message: rows.message
            };
            statusCode = 200;
        }
        callback(json, statusCode);
    })
}

function updateNino(body, idUser, callback) {
    var sql = "update ninos set nombre = '" + body.nombre + "', " +
        "apellidos = '" + body.apellidos + "', " +
        "privacidad = " + body.privacidad + " " +
        "where id = " + body.id;
    if (idUser === body.idUsuario) {
        bd.query(sql, function (err, rows, fields) {
            var json = {};
            var statusCode = 400;
            if (err) {
                json.res = 0;
                json.result = err;
            }
            else {
                statusCode = 200;
                json.res = 1;
                json.result = {
                    status: rows.serverStatus,
                    affectedRows: rows.affectedRows,
                    message: rows.message
                };
            }
            callback(json, statusCode);
        });
    }
    else {
        var json = {
            res: 3,
            result: "This kid is not your son"
        };
        callback(json, 400);
    }
}

module.exports.activateNino = activateNino;
module.exports.getNinosUser = getNinosUser;
module.exports.setNinoUser = setNinoUser;
module.exports.getNino = getNino;
module.exports.updateNino = updateNino;