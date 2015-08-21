var LocalStrategy = require('passport-local').Strategy;
var Usuario = require('./models/usuario');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        Usuario.getUsuarioById(id, function(err, usuario){
            done(err, usuario);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done){
        Usuario.getUsuarioByEmail(username, function(err, usuario){
            if (err)
                throw err;
            if (!usuario){
                return done(null, false);
            }

            Usuario.compararSenha(usuario, password, function(err, valido){
                if (err)
                    throw err;
                if (valido){
                    return done(null, usuario);
                }else{
                    return done('Senha incorreta', false);
                }
            });
        });
    }));

}
