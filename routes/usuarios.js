var express = require('express');
var router = express.Router();
var Usuario = require('../models/usuario');

var passport = require('passport');

var auth = require('../passport-auth');

/* GET usuarios listing. */
router.route('/registrar')

    .get(auth.requireNotAuthenticated(), function(req, res, next) {
        res.render('registrar', { title: 'Registrar-se', menu: 1 });
    })

    .post(function(req, res, next) {

        req.checkBody('nome', 'Nome é obrigatório').notEmpty();
        req.checkBody('email', 'E-mail inválido').isEmail();
        req.checkBody('senha', 'Senha deve ter pelo menos 6 caracteres').len(6);
        req.assert('confirma_senha', 'Confirmação de senha incorreta').equals(req.body.senha);

        var errors = req.validationErrors();
        console.log(errors);
        Usuario.getUsuarioByEmail(req.body.email, function(err, usuario){
            if (err)
                throw err;
            if (usuario){
                if (!errors)
                    errors = [];
                errors.push({
                    param: 'email',
                    msg: 'Email já está sendo utilizado por outro usuário',
                    value: req.body.email
                });
            }

            if (errors){
                res.render('registrar', {
                    title: 'Registrar-se',
                    errors : errors,
                    user: req.user,
                    nome : req.body.nome,
                    email : req.body.email,
                });
                return;
            }

            var novoUsuario = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            });
            console.log('create start');
            Usuario.createUsuario(novoUsuario, function(err, usuario){
                console.log('create inside start');
                if(err){
                    console.warn(err);
                    req.flash('error', 'Erro ao registrar usuário.');
                    req.flash('warning', 'Por favor tente novamente.');
                    res.redirect('/usuarios/registrar');
                    return next();
                }
                req.flash('success', 'Você foi registrado com sucesso.');
                req.flash('info', 'Entre para acessar a Área restrita.');
                res.redirect('/usuarios/entrar');
                console.log(usuario);
            });
        });
    });

router.route('/entrar')
    .get(auth.requireNotAuthenticated(), function(req, res, next) {
        res.render('entrar', { title: 'Entrar', menu: 2  });
    })

    .post(passport.authenticate('local', {
            failureRedirect: '/usuarios/entrar',
            failureFlash: 'Email e/ou Senha incorretos!'
        }), function(req, res){
            req.flash('success', 'Você está logado!');
            res.redirect('/');
        }
    );

router.route('/sair')
    .get(auth.requireAuthenticated(), function(req, res, next) {
        if(req.isAuthenticated()){
            req.logout();
            req.flash('info', 'Você saiu!');
            res.redirect('/usuarios/entrar');
        }
    });

module.exports = router;
