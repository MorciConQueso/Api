/**
 * Created by Usuario on 23/05/2016.
 */
var bd = require('../bd');

function getProfesores(callback) {
    var sql = "select id, nombre, apellidos from usuarios where tipo = 'profesor'";
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
            json.profesores = rows || [];
        }
        callback(json, statusCode);
    })
}

function getInfoProfesor(params, callback) {
    var sql = "select p.especializacion, p.cualidades, u.nombre, u.apellidos from profesores p " +
        "inner join usuarios u on p.idUsuario = u.id " +
        "where p.idUsuario = " + params.idUsuario;
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode;
        if (err) {
            json.res = 0;
            json.result = err;
        }
        else {
            statusCode = 200;
            json.res = 1;
            json.info = rows[0] || {};
        }
        callback(json, statusCode);
    })
}

function getCursosProfesor(idUser, callback) {
    var sql = "select * from cursos where idUsuario = " + idUser;
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.resutl = err;
        }
        else {
            statusCode = 200;
            json.res = 1;
            json.cursos = rows;
        }
        callback(json, statusCode);
    });
}

function setDatosProfesor(body, callback) {
    var sql = "insert into profesores(especializacion, cualidades, idUsuario) " +
        "values ('" + body.especializacion + "', '" + body.cualidades + "', " + body.idUsuario +
        ");";
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
                affectedRows: rows.affectedRows,
                insertId: rows.insertId,
                message: rows.message
            }
        }
        callback(json, statusCode);
    })
}

module.exports.getProfesores = getProfesores;
module.exports.getInfoProfesor = getInfoProfesor;
module.exports.getCursosProfesor = getCursosProfesor;
module.exports.setDatosProfesor = setDatosProfesor;