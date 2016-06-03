var express = require('express');

var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var ninos = require('./controller/ninos.js');
var profesores = require('./controller/profesor.js');
var courses = require('./controller/cursos.js');
var notas = require('./controller/notas.js');
var users = require('./controller/usuarios.js');
var ejercicios = require('./controller/ejercicios.js');
var bd = require('./bd.js');

var app = express();
var corsOptions = {
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors(corsOptions));

var router = express.Router();

var userTypes = ['admin', 'profesor', 'padre'];

router.get('/', function (req, res) {
    res.send('Academy Kids Api Running');
});

//USUARIO
router.post('/user/login', function (req, res) {
    var body = req.body;
    users.login(body, function (json, code) {
        res.json(json);
        res.statusCode = code;
    });
});

router.post('/user/register', function (req, res) {
    var body = req.body;
    users.register(body, function (json, code) {
        res.json(json);
        res.statusCode = code;
    })
});

router.put('/user/password', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            users.changePass(body, data, function (json, code) {
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
    })
});

router.put('/user/update', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            users.updateUser(body, data, function (json, code) {
                res.json(json);
                res.statusCode = code;
            })
        } else {
            var json = {
                res: 2,
                result: data
            };
            res.json(json);
            res.statusCode = 400;
        }
    })
});

router.get('/user/ninos', function (req, res) {
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

router.post('/user/ninos', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            if (data.tipo === userTypes[0])
                ninos.setNinoUser(body, function (json, code) {
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
    })
});

router.get('/nino/:idNino', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (data.tipo === userTypes[0] || data.tipo === userTypes[2])
                ninos.getNino(params, data.id, function (json, code) {
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
    })
});

router.put('/nino/:idNino', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (data.tipo === userTypes[0] || data.tipo === userTypes[2])
                ninos.updateNino(body, data.id, function (json, code) {
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

router.get('/curso/:idCurso', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            courses.getCourse(params, function (json, code) {
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
    })
});

router.post('/cursos', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            if (data.tipo === userTypes[0])
                courses.setCourse(body, function (json, code) {
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

router.get('/nino/:idNino/cursos', function (req, res) {

    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) courses.getCoursesNino(params, function (json, code) {
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

router.post('/nino/cursos', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            if (data.tipo === userTypes[0] || data.tipo === userTypes[1])
                courses.setNinoCurso(body, function (json, code) {
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

router.post('/nino/activate', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            ninos.activateNino(body, data.id, function (json, code) {
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

router.get('/profesores', function (req, res) {
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (data.id === users[0]) {
                profesores.getProfesores(function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                })
            }
            else {
                var jsonA = {
                    res: 3,
                    result: "Permission Denied"
                };
                res.json(jsonA);
                res.statusCode = 400;
            }
        }
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

router.get('/profesor/cursos', function (req, res) {
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (data.tipo === userTypes[1]) {
                profesores.getCursosProfesor(data.id, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                });
            }
            else {
                var jsonA = {
                    res: 3,
                    result: "Permission Denied"
                };
                res.json(jsonA);
                res.statusCode = 400;
            }
        } else {
            var json = {
                res: 2,
                result: data
            };
            res.json(json);
            res.statusCode = 400;
        }
    })
});

router.get('/profesor/:idProfesor/info', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (dat.id === users[0] || data.id === users[1]) {
                profesores.getInfoProfesor(params, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                })
            }
            else {
                var jsonA = {
                    res: 3,
                    result: "Permission Denied"
                };
                res.json(jsonA);
                res.statusCode = 400;
            }
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

router.post('/profesor/info', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (data.id === users[0] || data.id === users[1]) {
                profesores.setDatosProfesor(body, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                });
            }
            else {
                var jsonA = {
                    res: 3,
                    result: "Permission Denied"
                };
                res.json(jsonA);
                res.statusCode = 400;
            }
        }
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

router.get('/curso/:idCurso/ninos', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk) {
            if (data.tipo === userTypes[0] || data.tipo === userTypes[1]) {
                courses.getNinosCurso(params, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                })
            }
            else {
                var jsonA = {
                    res: 3,
                    result: "Permission Denied"
                };
                res.json(jsonA);
                res.statusCode = 400;
            }
        }
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

router.get('/curso/:idCurso/clases', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            courses.getClases(params, function (json, code) {
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

router.post('/curso/clase', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            if (data.tipo === userTypes[0] || data.tipo === userTypes[1])
                courses.setClase(body, function (json, code) {
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

router.get('/curso/:idCurso/ejercicios/', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            ejercicios.getEjerciciosCurso(params, function (json, code) {
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

router.get('/curso/:idCurso/ejercicios/:fecha', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            ejercicios.getEjerciciosCursoFecha(params, function (json, code) {
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
                ejercicios.setEjercicioCurso(body, function (json, code) {
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

router.get('/notas/curso/:idCurso/nino/:idNino/lim/:lim', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            notas.getNotasCurso(params, function (json, code) {
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

router.get('/notas/:fecha/curso/:idCurso/nino/:idNino', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            notas.getNotasClase(params, function (json, code) {
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

router.get('/notas/curso/:idCurso/nino/:idNino/', function (req, res) {
    var params = req.params;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            notas.getNotas(params, function (json, code) {
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

router.post('/curso/notas', function (req, res) {
    var body = req.body;
    var head = req.headers;
    users.autenticate(head, function (isOk, data) {
        if (isOk)
            if (data.tipo === userTypes[0] || data.tipo === userTypes[1]) {
                notas.setNotas(body, function (json, code) {
                    res.json(json);
                    res.statusCode = code;
                })
            } else {
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
    })
});

app.use(router);

app.listen(3000, function () {
    console.log("Server running on port 3000");
    bd.connect();
});