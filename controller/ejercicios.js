/**
 * Created by Usuario on 05/05/2016.
 */
var bd = require('../bd.js');

function getEjerciciosCurso(idCurso, date, callback) {
    var sql = "select * from ejercicios where fecha = '" + date + "' and cursos_id = " + idCurso;
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

function createEjercicioCurso(body, callback) {
    var sql = "INSERT INTO ejercicios(descripcion, url, Cursos_id, fecha) VALUES( "
        + "'" + body.desc + "' , "
        + "'" + body.url + "' , "
        + body.idCurso + " , "
        + "now())";
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
                message: rows.message,
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
            desc: item.descripcion,
            url: item.url,
            idCurso: item.Curso_id,
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
    return dia + "/" + mes + "/" + ano;
}

module.exports.getEjerciciosCurso = getEjerciciosCurso;
module.exports.createEjercicioCurso = createEjercicioCurso;