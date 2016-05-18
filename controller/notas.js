/**
 * Created by buny on 05/05/2016.
 */
var bd = require('../bd.js');

var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Semptiembre", "Octubre", "Noviembre", "Diciembre"
];

function getNotasCurso(params, callback) {
    var sql = "select c.id, c.comportamiento, c.puntualidad, c.ejercicios, c.ayuda, cl.fecha from calificaciones c " +
        "inner join clases cl on c.idClase = cl.id " +
        "where c.idCurso = " + params.idCurso + " " +
        "and c.idNino = " + params.idNino + " " +
        "order by cl.fecha desc limit 3";
    console.log(sql);
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
            json.notas = toObject(rows);
        }
        callback(json, statusCode);
    })
}

function getNotasClase(params, callback) {
    var sql = "select c.id, c.comportamiento, c.puntualidad, c.ejercicios, c.ayuda, cl.fecha from calificaciones c " +
        "inner join clases cl on c.idClase = cl.id " +
        "where c.idCurso = " + params.idCurso + " " +
        "and cl.fecha = '" + params.fecha + "' " +
        "and c.idNino = " + params.idNino;
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
            json.notas = toObject(rows);
        }
        callback(json, statusCode);
    })
}

function getNotasMes(params, callback) {
    var sql = "select c.id, c.comportamiento, c.puntualidad, c.ejercicios, c.ayuda, fecha from calificaciones c " +
        "inner join clases cl on c.idClase = cl.id " +
        "where c.idCurso = " + params.idCurso + " " +
        "and month(cl.fecha) = '" + params.fecha + "' " +
        "and c.idNino = " + params.idNino;
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
            json.mes = monthNames[parseInt(params.fecha)];
            json.notas = toObject(rows);
        }
        callback(json, statusCode);
    })
}

function setNotas(body, callback) {
    var sql = "select n.id as idNino, n.idUsuario, c.idCurso, c.idProfesor, c.id as idClase" +
        " from ninos n, clases c where n.id = " + body.idNino + " and c.id = " + body.idClase;
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err;
            callback(json, statusCode);
        }
        else {
            var values = rows[0];
            var sql = "insert into calificaciones(comportamiento, puntualidad, ejercicios, ayuda," +
                "idClase, idCurso, idProfesor, idNino, idUsuario) values(" +
                body.comportamiento + ", " + body.puntualidad + ", " + ", " + body.ejercicios + ", " + body.ayuda + ", " +
                values.idClase + ", " + values.idCurso + ", " + values.idProfesor + ", " + values.idNino + ", " + values.idUsuario + ")";
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
                    };
                }
                callback(json, statusCode);
            })
        }
    });
}

function toObject(rows) {
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var date = dateToString(item.fecha);
        var object = {
            comportamiento: item.comportamiento,
            puntualidad: item.puntualidad,
            ejercicios: item.ejercicios,
            ayuda: item.ayuda,
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

module.exports.getNotasClase = getNotasClase;
module.exports.getNotasMes = getNotasMes;
module.exports.getNotasCurso = getNotasCurso;
module.exports.setNotas = setNotas;