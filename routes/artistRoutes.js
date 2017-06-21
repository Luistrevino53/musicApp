'use strict'
var express = require('express');
var artistController = require('../controllers/artistController');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

var api = express.Router();

api.get('/prueba', artistController.pruebas);
api.get('/:page?',md_auth.ensureAuth, artistController.getAllArtist);
api.post('/create',md_auth.ensureAuth, artistController.createArtist);
api.get('/:id',md_auth.ensureAuth, artistController.getArtist);
api.put('/update/:id',md_auth.ensureAuth, artistController.updateArtist);
api.delete('/delete/:id', md_auth.ensureAuth, artistController.deleteArtist);

module.exports = api;
