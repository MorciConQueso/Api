var express = require('express');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var md5 = require('md5');
var ninos = require('./controller/ninos.js');
var calif = require('./controller/calificaciones.js');
var users = require('./controller/usuarios.js');
var cursos = require('./controller/cursos.js');
var bd = require('./bd.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.post('/users/login', function (req, res) {
    var body = req.body;
    users.login(body, function(json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

router.get('/nino/:idNino', function (req, res) {
    var idNino = req.param('idNino');
    ninos.getNino(idNino, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

router.get('/nino/:idNino/cursos', function (req, res) {
    var idNino = req.param('idNino');
    ninos.getCoursesByNino(idNino, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

//Calificaciones
router.get('/calificaciones/:idNino/:idCurso/:fecha', function (req, res) {
    var idNino = req.param('idNino');
    var idCurso = req.param('idCurso');
    var fecha = req.param('fecha');
    calif.getCalificaciones(idNino,idCurso,fecha, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

//Cursos
router.get('/cursos/:idCurso', function (req, res) {
    var idCurso = req.param('idCurso');
    cursos.getCourses(idCurso, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

app.use(router);

app.listen(3000, function () {
    console.log("Server running on port 3000");
    bd.connect();
});