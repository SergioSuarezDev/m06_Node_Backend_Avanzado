//Modulos
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Configuración del View Engine Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json({limit: '5mb'})); 
app.use(bodyParser.urlencoded({extended: false, limit: '5mb', parameterLimit: 5000}));


//Conexion a la base de datos
require('./lib/mongoose');
require('./models/anuncio');

app.use('/', require('./routes/index')); //Vista HTML
app.use('/api_v1/', require('./routes/api_v1/index')); // API INDEX
app.use('/api_v1/anuncio/', require('./routes/api_v1/anuncio')); // API ANUNCIO

// Renderizar error 404
app.use(function(req, res, next) {
  //res.status(404);
  //res.json("error")
  next(createError(404));
});

// error 
app.use(function(err, req, res, next) {

  // locals para development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar error 500
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
