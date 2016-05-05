/**
 * Created by Usuario on 05/05/2016.
 */
    var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'academykids'
});
var curso = {
    id: null,
    nombre: null,
    nombreProfesor: null
};

function getCoursesByNino(idNino, callback) {
    connection.connect();
    var sql = "SELECT * FROM cursos c INNER JOIN ninos_has_cursos nc ON c.id = nc.cursos_id where nc.ninos_id = "+idNino;
    connection.query(sql, function(err, rows, fields) {
        if(err) callback(error);
        else callback(rows);
    })
}

module.exports.getCoursesByNino = getCoursesByNino;