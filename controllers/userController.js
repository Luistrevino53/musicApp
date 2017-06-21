'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req, res){
  res.status(200).send({
    message: 'Probando una accion del controlador del api rest'
  });
}

function getUsers(req, res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }

  var itemsPerPage = 5;
  User.find().sort('name').paginate(page, itemsPerPage,(err,artists,total)=>{
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

function saveUser(req, res){
  var user = new User();
  var params = req.body;

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_ADMIN';
  user.image = 'null';

  if(params.password){
    //Encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, (err, hash)=>{
      user.password = hash;
      if(user.name != null && user.surname != null && user.email != null){
        //guardar el usuario
        user.save((err, userStored)=>{
          if(err){
              res.status(500).send({message: 'Error al guardar el usuario'});
          }else{
              if(!userStored){
                res.status(404).send({message: 'No se a registrado el usuario'});
              }else{
                res.status(200).send({message: 'Usuario guardado', user: userStored});
              }
          }
        });
      }else{
        res.status(200).send({message: 'Introduce todo los campos'})
      }
    })
  }else{
    res.status(500).send({message: 'Introduce la contraseña'});
  }

}


function loginUser(req, res){
  var params = req.body;

  var email = params.email;
  var password =  params.password;

  User.findOne({email: email.toLowerCase()}, (err, user)=>{
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!user){
        res.status(404).send({message: 'El usuario no exciste'});
      }else{
        //comprobar contraseña
        bcrypt.compare(password, user.password, (err, check)=>{
          if(check){
            //devolver los datos del usuario
            if(params.gethash){
              //devolver un tocken de jwt
              res.status(200).send({message:'Usuario Logeado Correctamente', token: jwt.createToken(user)});
            }else{
              res.status(200).send({message: 'Usuario Logeado Correctamente', user});
            }
          }else{
            res.status(404).send({message: 'Contraseña o email incorrecto'});
          }
        });
      }
    }
  });
}

function updateUser(req, res){
  var userId = req.params.id;
  var update =  req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
    if(err){
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }else{
      if(!userUpdate){
        res.status(404).send({message: 'No se a podido actualizar el usuario'});
      }else{
        res.status(200).send({message: 'Usuario actualizado',user: userUpdate});
      }
    }
  });
}

function removeUsers(req, res){
  var artistId = req.params.id;
  User.remove({_id: artistId}, (err, artist)=>{
    if(err){
      res.status(500).send({message: 'Error al eliminar artista'});
    }else{
      if(!artist){
        res.status(404).send({message: 'No se pudo encontrar el artista'});
      }else{
        res.status(200).send({message: 'Artista eliminado', artist: artist});
      }
    }
  });
}

/*function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.image.path;
    var files_split = file_path.split('\\');
    var file_name = files_split[2];



    console.log(file_path);
  }else{
    res.status(200).send({message: 'No has subido ninguna imagen...'});
  }
}*/

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  //uploadImage
  getUsers,
  removeUsers
};
