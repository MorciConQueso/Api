var express = require('express');

var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var ninos = require('./controller/ninos.js');
var courses = require('./controller/cursos.js');
var calif = require('./controller/calificaciones.js');
var users = require('./controller/usuarios.js');
var ejercicios = require('./controller/ejercicios.js');
var cursos = require('./controller/cursos.js');
var bd = require('./bd.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

var router = express.Router();

//USUARIO
router.post('/users/login', function (req, res) {
    var body = req.body;
    users.login(body, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

router.post('/users/register', function (req, res) {
    var body = req.body;
    users.register(body, function (json, code) {
        res.json(json);
        res.statusCode = code;
    })
});

router.get('/users/ninos', function (req, res) {
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) ninos.getNinosUser(data.id, function (json, code) {
            res.json(json);
            res.statusCode = code;
        });
        else {
            var json = {
                res: 2,
                result: data
            };
            res.json(json);
            res.statusCode = 400;
        }
    })
});

//NIÑOS
router.get('/nino/:idNino/cursos', function (req, res) {
    var params = req.params;
    var head = req.headers;
    var idNino = params.idNino;
    users.autenticate(head, function (isOk, data) {
        if (isOk) courses.getCoursesNino(idNino, function (json, code) {
            res.json(json);
            res.statusCode = code;
        });
        else {
            var json = {
                res: 2,
                result: data
            };
            res.json(json);
            res.statusCode = 400;
        }
    })
});

//router.post('/nino/activate', function (req, res) {
//    var body = req.body;
//    ninos.activateNino(body, function (json, code) {
//        res.json(json);
//        res.statusCode = code;
//    })
//});

router.get('/nino/:idNino', function (req, res) {
    var params = req.params;
    var idNino = params.idNino;
    ninos.getNino(idNino, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

//CURSOS
router.get('/curso/:idCurso/ejercicios/:date', function (req, res) {
    var params = req.params;
    var head = req.headers;
    var idCurso = params.idCurso;
    var date = params.date;
    users.autenticate(head, function (isOk, data) {
        if (isOk) ejercicios.getEjerciciosCurso(idCurso, date, function (json, code) {
            res.json(json);
            res.statusCode = code;
        });
        else {
            var json = {
                res: 2,
                result: data
            };
            res.json(json);
            res.statusCode = 400;
        }
    });
});

router.post('/curso/ejercicio', function (req, res) {
    var body = req.body;
    ejercicios.createEjercicioCurso(body, function (json, code) {
        res.json(json);
        res.statusCode = code;
    })
});

//CALIFICACIONES
router.get('/calificaciones/:idNino/:idCurso/:fecha', function (req, res) {
    var idNino = req.param('idNino');
    var idCurso = req.param('idCurso');
    var fecha = req.param('fecha');
    calif.getCalificaciones(idNino, idCurso, fecha, function (json, code) {
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
    })
});

router.post('/calificaciones/:idNino', function (req, res) {
    var body = req.body;
    var nino = req.param('idNino');
    calif.setCalificaciones(body,nino, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

app.use(router);

app.listen(3000, function () {
    console.log("Server running on port 3000");
    bd.connect();
});