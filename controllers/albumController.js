'use strict'
var Album = require('../models/Album');
var Artist = require('../models/artist');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res){
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, albumStored)=>{
    if(err){
      res.status(500).send({message: 'Error en la conexion con las base de datos'});
    }else{
      if(!albumStored){
        res.status(404).send({message: 'Error al encontrar el album'});
      }else{
        res.status(200).send({message: 'ok', album:albumStored});
      }
    }
  });
}

function saveAlbum(req, res){
  var params = req.body;
  var album = new Album();

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored)=>{
    if(err){
      res.status(500).send({message: 'Error en la conexion con las base de datos'});
    }else{
      if(!albumStored){
        res.status(404).send({message: 'Error al guardar el album'});
      }else{
        res.status(200).send({message: 'ok', album:albumStored});
      }
    }
  });

}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbum
}
