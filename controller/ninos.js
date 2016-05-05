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

function getNino(idNino, callback) {
    var sql = "SELECT n.* FROM ninos n WHERE n.id = " + idNino;
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
            json.nino = rows[0];
        }
        callback(json, statusCode);
    });
}

function getCoursesByNino(idNino, callback) {
    var sql = "SELECT c.* FROM cursos c INNER JOIN ninos_has_cursos nc ON c.id = nc.cursos_id where nc.ninos_id = " + idNino;
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
            json.cursos = rows;
        }
        callback(json, statusCode);
    });
}

module.exports.getCoursesByNino = getCoursesByNino;
module.exports.getNino = getNino;
module.exports.activateNino = activateNino;