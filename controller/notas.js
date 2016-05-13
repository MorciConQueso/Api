/**
 * Created by buny on 05/05/2016.
 */
var bd = require('../bd.js');

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getNotasDia(body, callback) {
    var sql = "select c.id, c.comportamiento, c.puntualidad, c.ejercicios, c.ayudaCompanieros from calificaciones c " +
        "inner join calificaciones_has_ninos cn on c.id = cn.idCalificacion " +
        "inner join ejercicios e on e.id = c.idEjercicio " +
        "where e.fecha = '" + body.fecha + "' and e.idCurso = " + body.idCurso + " and cn.idNino = " + body.idNino + ";";
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err
        } else {
            statusCode = 200;
            json.res = 1;
            json.calificaciones = rows[0] || null;
        }
        callback(json, statusCode);
    });
}

function getNotasMes(body, callback) {
    var sql = "select c.id, c.comportamiento, c.puntualidad, c.ejercicios, c.ayudaCompanieros from calificaciones c " +
        "inner join calificaciones_has_ninos cn on c.id = cn.idCalificacion " +
        "inner join ejercicios e on e.id = c.idEjercicio " +
        "where month(e.fecha) = " + body.fecha + " and e.idCurso = " + body.idCurso + " and cn.idNino = " + body.idNino + ";";
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
            json.nombreMes = monthNames[body.fecha - 1];
            json.calificaciones = rows || null;
        }
        callback(json, statusCode);
    });
}

function getNotasEjercicio(params, callback) {
    var sql = "select c.* from calificaciones c " +
        "inner join calificaciones_has_ninos cn on c.id = cn.idCalificacion " +
        "where c.idEjercicio = " + params.idEjercicio +
        " and cn.idNino = " + params.idNino;
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
            json.calificaciones = rows[0] || null;
        }
        callback(json, statusCode);
    });
}

function setNotasEjercicio(body, callback) {
    var sql = "insert into calificaciones(comportamiento,puntualidad,ejercicios, ayudaCompanieros, idEjercicio) " +
        "values (" + body.comportamiento + ", " + body.puntualidad + ", " +
        body.ejercicios + ", " + body.ayuda + ", " + body.idEjercicio + ")";
    bd.query(sql, function (err, rows, fields) {
        if (err) {
            callback({
                res: 0,
                result: err
            }, 400);
        }
        else {
            var sql = "insert into calificaciones_has_ninos(idCalificacion, idNino)" +
                "values (" + rows.insertId + ", " + body.idNino + ")";
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
            });
        }
    });
}
module.exports.getNotasDia = getNotasDia;
module.exports.getNotasMes = getNotasMes;
module.exports.getNotasEjercicio = getNotasEjercicio;
module.exports.setNotasEjercicio = setNotasEjercicio;
