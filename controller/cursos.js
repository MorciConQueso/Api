/**
 * Created by Sara on 05/05/2016.
 */
var bd = require('../bd.js');

function getCoursesNino(idNino, callback) {
    var sql = "select c.id, c.nombre, u.nombre as nomProf, u.apellidos as apeProf " +
        "from cursos c " + "inner join ninos_has_cursos nc on c.id = nc.idCurso " +
        "inner join ninos n on c.id = nc.idNino " +
        "inner join usuarios u on c.idUsuario = u.id " +
        "where n.id = " + idNino;
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
    })
}

/*
function createCurso(body, callback) {
    var sql = "INSERT INTO cursos(nombre, Usuarios_id) VALUES( "
        + "'" + body.nombre + "' , "
        + body.idUs + " , "
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
*/

module.exports.getCoursesNino = getCoursesNino;


