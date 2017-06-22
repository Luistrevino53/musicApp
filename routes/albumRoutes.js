'use strict'
var express = require('express');
var albumController = require('../controllers/albumController');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

var api = express.Router();


api.get('/:id', albumController.getAlbum);
api.get('/all/:page?', md_auth.ensureAuth, albumController.Albums);
api.post('/', md_auth.ensureAuth,albumController.saveAlbum);
api.put('/update/:id', md_auth.ensureAuth, albumController.updateAlbum);
api.delete('/:id', md_auth.ensureAuth, albumController.deleteAlbum);

module.exports = api;
