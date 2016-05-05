/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');
function getNino(idNino, callback) {
    var sql = "SELECT * FROM ninos WHERE id = " + idNino;
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