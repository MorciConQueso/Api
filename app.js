var express = require('express');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var md5 = require('md5');
var cursos = require('./model/cursos.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/cursos/:idNino', function(req, res) {
    var idNino = req.param('idNino');
    cursos.getCoursesByNino(idNino, function(response) {
        res.json(response);
    });
});

app.use(router);


app.listen(3000, function() {
   console.log("Server running on port 3000") ;
});