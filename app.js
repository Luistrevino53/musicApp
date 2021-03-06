'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/userRoutes');
var artist_routes = require('./routes/artistRoutes');
var album_routes = require('./routes/albumRoutes');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http

//rutas base
app.use('/api',user_routes);
app.use('/api/artist', artist_routes);
app.use('/api/album', album_routes);


module.exports = app;
