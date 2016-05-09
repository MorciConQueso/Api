var express = require('express');

var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var ninos = require('./controller/ninos.js');
var courses = require('./controller/cursos.js');
var calif = require('./controller/calificaciones.js');
var users = require('./controller/usuarios.js');
var ejercicios = require('./controller/ejercicios.js');
var bd = require('./bd.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

var router = express.Router();

var userTypes = ['admin', 'profesor', 'padre'];

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
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            if (data.tipo === userTypes[0] || data.tipo === userTypes[1])
                ejercicios.createEjercicioCurso(body, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                });
            else {
                var jsonA = {
                    res: 3,
                    result: "Permission Denied"
                };
                res.json(jsonA);
                res.statusCode = 400;
            }
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

//CALIFICACIONES
router.get('/curso/:idCurso/notas/:fecha/nino/:idNino', function (req, res) {
    var params = req.params;
    var head = req.headers;
    var body = {
        idNino: params.idNino,
        idCurso: params.idCurso,
        fecha: params.fecha
    };
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            var array = body.fecha.split("-");
            if (array.length > 1)
                calif.getCalificacionesDia(body, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                });
            else
                calif.getCalificacionesMes(body, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                });
        }
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

router.post('/calificaciones/:idNino', function (req, res) {
    var body = req.body;
    var nino = req.param('idNino');
    calif.setCalificaciones(body, nino, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

app.use(router);

app.listen(3000, function () {
    console.log("Server running on port 3000");
    bd.connect();
});