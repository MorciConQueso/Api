/**
 * Created by Sara on 05/05/2016.
 */
var bd = require('../bd.js');

function getCourse(params, callback) {
    var sql = "select * from cursos where id = " + params.idCurso;
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
            json.curso = rows[0];
        }
        callback(json, statusCode);
    })
}

function setCourse(body, callback) {
    var sql = "insert into cursos(nombre, idProfesor) " +
        "values('" + body.nombre + "', " + body.idProfesor + ")";
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
            json.result = {
                affectedRows: rows.affectedRows,
                insertId: rows.insertId,
                message: rows.message
            };
        }
        callback(json, statusCode);
    })
}

function getCoursesNino(params, callback) {
    var sql = "select c.* " +
        "from cursos c " + "inner join ninos_has_cursos nc on c.id = nc.idCurso " +
        "inner join ninos n on c.id = nc.idNino " +
        "where n.id = " + params.idNino;
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

function setNinoCurso(body, callback) {
    var sql = "insert into ninos_has_cursos(idNino, idCurso) " +
        "values(" + body.idNino + ", " + body.idCurso + ")";
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
            json.result = {
                affectedRows: rows.affectedRows,
                insertId: rows.insertId,
                message: rows.message
            };
        }
        callback(json, statusCode);
    })
}

function setClase(body, callback) {
    var sql = "insert into clases(fecha, idCurso) " +
        "values (now(), " + body.idCurso + ")";
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

function getClases(params, callback) {
    var sql = "select cl.id, cl.fecha, c.nombre as nomCurso " +
        "from clases cl " +
        "inner join cursos c on cl.idCurso = c.id " +
        "where c.id = " + params.idCurso + " " +
        "order by cl.fecha desc";
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
            //json.curso = rows[0].nomCurso || null;
            json.clases = toObject(rows)
        }
        callback(json, statusCode);
    })
}

function getNinosCurso(params, callback) {
    var sql = "select n.* from ninos n " +
        "inner join ninos_has_cursos nc on n.id = nc.idNino " +
        "where nc.idCurso = " + params.idCurso;
    console.log(sql);
    bd.query(sql, function (err, rows, fields) {
        var json = {};
        var statusCode = 400;
        if (err) {
            json.res = 0;
            json.result = err;
        }
        else {
            json.res = 1;
            json.ninos = rows;
            statusCode = 200;
        }
        callback(json, statusCode);
    })
}

function toObject(rows) {
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var obj = {
            id: item.id,
            fecha: dateToString(item.fecha)
        };
        result.push(obj);
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

module.exports.getCoursesNino = getCoursesNino;
module.exports.getNinosCurso = getNinosCurso;
module.exports.setNinoCurso = setNinoCurso;
module.exports.setCourse = setCourse;
module.exports.getCourse = getCourse;
module.exports.setClase = setClase;
module.exports.getClases = getClases;

