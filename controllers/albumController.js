'use strict'
var Album = require('../models/Album');
var Artist = require('../models/artist');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res) {
  var albumId = req.params.id;

  Album.findById(albumId).populate({
    path: 'artist'
  }).exec((err, album) => {
    if (err) {
      res.status(500).send({
        message: 'Error en la conexion con las base de datos'
      });
    } else {
      if (!album) {
        res.status(404).send({
          message: 'Error al encontrar el album'
        });
      } else {
        res.status(200).send({
          message: 'ok',
          album: album
        });
      }
    }
  });
}

function saveAlbum(req, res) {
  var params = req.body;
  var album = new Album();

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({
        message: 'Error en la conexion con las base de datos'
      });
    } else {
      if (!albumStored) {
        res.status(404).send({
          message: 'Error al guardar el album'
        });
      } else {
        res.status(200).send({
          message: 'ok',
          album: albumStored
        });
      }
    }
  });
}

function Albums(req, res) {
  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPage = 5;

  Album.find().sort('title').populate({
    path: 'artist'
  }).paginate(page, itemsPerPage, (err, albums, total) => {
    if (err) {
      res.status(500).send({
        message: 'Error en la conexion con las base de datos'
      });
    } else {
      if (!albums) {
        res.status(404).send({
          message: 'No se encontraron albums'
        });
      } else {
        res.status(200).send({
          message: 'ok',
          total: total,
          album: albums
        });
      }
    }
  })
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var params = req.body;

  Album.findByIdAndUpdate(albumId, params, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({
        message: 'Error en la conexion con las base de datos'
      });
    } else {
      if (!albumUpdated) {
        res.status(404).send({
          message: 'Error al guardar el album'
        });
      } else {
        res.status(200).send({
          message: 'ok',
          album: albumUpdated
        });
      }
    }
  });
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;

  Album.remove({
    _id: albumId
  }, (err, deletedAlbum) => {
    if (err) {
      res.status(500).send({
        message: 'Error en la conexion con las base de datos'
      });
    } else {
      if (!deletedAlbum) {
        res.status(404).send({
          message: 'No se encontró el album'
        });
      } else {
        Song.remove({
          album: deletedAlbum._id
        }, (err, deletedSong) => {
          if (err) {
            res.status(500).send({
              message: 'Error en la conexion con las base de datos'
            });
          } else {
            if (!deletedAlbum) {
              res.status(404).send({
                message: 'No se encontró el album'
              });
            } else {
              res.status(200).send({
                message: 'ok',
                album: deletedAlbum
              });
            }
          }
        });
      }
    }
  });
}

module.exports = {
  getAlbum,
  saveAlbum,
  Albums,
  updateAlbum,
  deleteAlbum
}
