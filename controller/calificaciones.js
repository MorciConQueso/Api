/**
 * Created by buny on 05/05/2016.
 */
var bd = require('../bd.js');
function getCalificaciones(idNino,idCurso,fecha,callback){
    var sql = "SELECT * FROM calificaciones c INNER JOIN calificaciones_has_ninos nc ON c.id = nc.calificaciones_id WHERE nc.ninos_id = "+idNino+" AND c.cursos_id = "+idCurso+" AND nc.fecha = '"+fecha+"'";
    bd.query(sql,function(err, rows, fields){
        var json = {};
        var statusCode = 400;
        if (err){
            json.res = 0;
            json.result = err
        }else{
            statusCode = 200;
            json.res = 1;
            json.nino = rows[0];
        }
        callback(json, statusCode);
    });
}

function setCalificaciones(body,idNino,callback){
    //FUNCION SIN TERMINAR!!!
    console.log(body.comportamiento);
    var sql = "INSERT INTO calificaciones (comportamiento,puntualidad,ejercicios,ayudaCompanieros) " +
        "VALUES ("+body.comportamiento+", "+body.puntualidad+","+body.puntEjercicios+","+body.ayudaCompanieros+"); ";
    bd.query(sql, function (err, rows, fileds) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err
        }
        else {
            statusCode = 200;
            json.res = 1;
            json.result = "Calificaciones insertadas";
        }
        callback(json, statusCode);
    })
}

module.exports.getCalificaciones = getCalificaciones;
module.exports.setCalificaciones = setCalificaciones;