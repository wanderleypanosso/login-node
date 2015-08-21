var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var db = mongoose.connection;

var UsuarioSchema = mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        index: true,
        required: true
    },
    senha:{
        type: String,
        required: true
    }
});

var Usuario = module.exports = mongoose.model('Usuario', UsuarioSchema);

module.exports.createUsuario = function(usuario, callback){
    console.log('encrypt inside start');
    bcrypt.hash(usuario.senha, bcrypt.genSaltSync(9), null, function(err, hash){
        console.log('encrypt start');
        if (err)
            throw err;
        console.log('db start');
        usuario.senha = hash;
        usuario.save(callback);
        console.log('end start');
    });
}

module.exports.getUsuarioByEmail = function(email, callback){
    var query = { email: email };
    Usuario.findOne(query, callback);
}

module.exports.getUsuarioById = function(id, callback){
    Usuario.findById(id, callback);
}

module.exports.compararSenha = function(usuario, confirmacao, callback){
    bcrypt.compare(confirmacao, usuario.senha, function(err, valido){
        if (err){
            callback(err);
        }else {
            callback(null, valido);
        }
    });
}
