/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');

function getEjerciciosCurso(params, callback) {
    var sql = "select e.id, e.titulo, e.descripcion, e.url, c.fecha from ejercicios e " +
        "inner join clases c on c.id = e.idClase " +
        "where e.idCurso = " + params.idCurso;
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
            json.ejercicios = toObject(rows);
        }
        callback(json, statuscode);
    })
}

function getEjerciciosCursoFecha(params, callback) {
    var sql = "select e.id, e.titulo, e.descripcion, e.url, c.fecha from ejercicios e " +
        "inner join clases c on c.id = e.idClase " +
        "where e.idCurso = " + params.idCurso + " and " +
        " c.fecha = '" + params.fecha + "'";
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
            json.ejercicios = toObject(rows);
        }
        callback(json, statusCode);
    })
}

function setEjercicioCurso(body, callback) {
    var sql = "insert into ejercicios(titulo, descripcion, url, idCurso, fecha) values( " +
        "'" + body.titulo + "' , " +
        "'" + body.desc + "' , " +
        "'" + body.url + "' , " +
        body.idCurso + " , " +
        "now())";
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
        }
        callback(json, statusCode);
    })
}

function toObject(rows) {
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var date = dateToString(item.fecha)
        var object = {
            id: item.id,
            titulo: item.titulo,
            desc: item.descripcion,
            url: item.url,
            idCurso: item.idCurso,
            fecha: date
        };
        result.push(object);
    }
    return result;
}

function dateToString(date) {
    var dia = date.getDate();
    if (dia < 10) dia = "0" + dia;
    var mes = date.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    var ano = date.getFullYear();
    return dia + "-" + mes + "-" + ano;
}

module.exports.getEjerciciosCurso = getEjerciciosCurso;
module.exports.getEjerciciosCursoFecha = getEjerciciosCursoFecha;
module.exports.setEjercicioCurso = setEjercicioCurso;
