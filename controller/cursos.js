/**
 * Created by Sara on 05/05/2016.
 */
var bd = require('../bd.js');

function getCourses(idCurso, callback) {
    var sql = "SELECT * FROM cursos where id = " + idCurso;
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

module.exports.getCoursesByUser = getCoursesByUser;


