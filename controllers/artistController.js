'use strict'
var Artist = require('../models/artist');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/Album');
var Song = require('../models/song');

function pruebas(req, res){
  res.status(200).send({message: 'ArtistController works'});
}

function getAllArtist(req, res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }

  var itemsPerPage = 5;
  Artist.find().sort('name').paginate(page, itemsPerPage,(err,artists,total)=>{
      if(err){
          res.status(500).send({message: 'Error al conseguir el artista'});
      }else{
        if(!artists){
          res.status(404).send({message: 'No se encuentra los artistas'});
        }else{
          return res.status(200).send({
            message: 'ok',
            total: total,
            artists: artists
          });
        }
      }
  });
}

function getArtist(req, res){
  var artistId = req.params.id;
  Artist.findOne({_id: artistId}, (err, artist)=>{
    if(err){
      res.status(500).send({message: 'Error al conseguir el artista'});
    }else{
      if(!artist){
        res.status(404).send({message: 'No se encuentra el artista'});
      }else{
        res.status(200).send({message:'Artista encontrado', artist: artist});
      }
    }
  });

}

function createArtist(req, res){
  var artist = new Artist();
  var params = req.body;

  if(params.name == null){
    return res.status(500).send({message: 'Envia el nombre de artista'});
  }
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored)=>{
    if(err){
      res.status(500).send({message: 'Error al guardar el artista'});
    }else{
      if(!artistStored){
        res.status(404).send({message: 'No se a registrado el artista'});
      }else{
        res.status(200).send({message: 'Artista guardado Correctamente', artists: artistStored})
      }
    }
  });


}
function updateArtist(req, res){
  var artistId = req.params.id;
  var params = req.body;

  Artist.findByIdAndUpdate(artistId, params, (err, artistUpdated)=>{
    if(err){
      res.status(500).send({message: 'Error en actualizar el artista'});
    }else{
      if(!artistUpdated){
        res.status(404).send({message: 'No se Pudo encontrar el artista'});
      }else{
        res.status(200).send({message: 'Artista modificado', artist: artistUpdated});
      }
    }
  });
}

function deleteArtist(req, res){
  var artistId = req.params.id;
  Artist.remove({_id: artistId}, (err, artist)=>{
    if(err){
      res.status(500).send({message: 'Error al eliminar artista'});
    }else{
      if(!artist){
        res.status(404).send({message: 'No se pudo encontrar el artista'});
      }else{
        Album.find({artist: artist._id}).remove((err, albumRemoved)=>{
          if(err){
            res.status(500).send({message: 'Error al eliminar artista'});
          }else{
            if(!albumRemoved){
              res.status(404).send({message: 'No se pudo encontrar el artista'});
            }else{

              Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                if(err){
                  res.status(500).send({message: 'Error al eliminar artista'});
                }else{
                  if(!songRemoved){
                    res.status(404).send({message: 'No se pudo encontrar el artista'});
                  }else{
                    res.status(200).send({message: 'Artista eliminado', artist: artist});
                    }
                  }
              }) ;
            }
          }
        });
      }
    }
  });
}

module.exports = {
  pruebas,
  createArtist,
  getArtist,
  updateArtist,
  getAllArtist,
  deleteArtist
};
