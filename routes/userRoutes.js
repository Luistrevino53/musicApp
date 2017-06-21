'use strict'

var express = require('express');
var userController = require('../controllers/userController');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

var api = express.Router();

api.get('/pruebas', md_auth.ensureAuth, userController.pruebas);
api.post('/user', userController.saveUser);
api.post('/login', userController.loginUser);
api.put('/user/:id', md_auth.ensureAuth, userController.updateUser);
api.get('/users',md_auth.ensureAuth,userController.getUsers);
api.delete('/user/:id',md_auth.ensureAuth, userController.removeUsers);
//api.post('/upload/:id',[md_auth.ensureAuth, md_upload], userController.uploadImage);

module.exports = api;
