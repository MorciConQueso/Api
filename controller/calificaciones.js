/**
 * Created by buny on 05/05/2016.
 */
var bd = require('../bd.js');

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getCalificacionesDia(body, callback) {
    var sql = "select c.id, c.comportamiento ,c.puntualidad ,c.ejercicios ,c.ayudaCompanieros from calificaciones c " +
        "inner join calificaciones_has_ninos cn on c.id = cn.idCalificacion " +
        "where cn.fecha = '" + body.fecha + "' and c.idCurso = " + body.idCurso + " and cn.idNino = " + body.idNino + ";";
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

function getCalificacionesMes(body, callback) {
    var sql = "select c.id, c.comportamiento, c.puntualidad, c.ejercicios, c.ayudaCompanieros from calificaciones c " +
        "inner join calificaciones_has_ninos cn on c.id = cn.idCalificacion " +
        "where month(cn.fecha) = month('" + body.fecha + "') and c.idCurso = " + body.idCurso + " and cn.idNino = " + body.idNino + ";";
    bd.query(sql, function(err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if(err) {
            json.res = 0;
            json.result = err;
        }
        else{
            statusCode = 200;
            json.res  = 1;
            json.nombreMes = monthNames[body.fecha -1];
            json.calificaciones = rows || null;
        }
        callback(json, statusCode);
    });
}

function setCalificacionesEjercicios(body, params, callback) {
    var sql = "insert into "
}

module.exports.getCalificacionesDia = getCalificacionesDia;
module.exports.getCalificacionesMes = getCalificacionesMes;
module.exports.setCalificacionesEjercicios = setCalificacionesEjercicios;