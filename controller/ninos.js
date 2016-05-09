/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');

function activateNino(body, callback) {
    var sql = "UPDATE ninos set activado = true where id = " + body.idNino + " and usuarios_id = " + body.idUsuario;
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

module.exports.activateNino = activateNino;
module.exports.getNinosUser = getNinosUser;