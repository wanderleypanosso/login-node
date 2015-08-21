var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var passportInit = require('./passport-init');
var auth = require('./passport-auth');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var templatedMessages = require('./templated-messages');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var usuarios = require('./routes/usuarios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'sdfasdfgafdsgsdfghhjulkuiotyeuhw',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
passportInit(passport);

auth.initialize({
        requireAuthenticatedRedirect: '/usuarios/entrar',
        requireAuthenticatedMessage: 'Você precisa entrar para ter acesso',
        requireNotAuthenticatedRedirect: '/',
        requireNotAuthenticatedMessage: 'Você precisa sair para ter acesso',
});

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.messages = templatedMessages(req, res, 'flashes');
    res.locals.validations = templatedMessages(req, res, 'validations');
    next();
});

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/usuarios', usuarios);

app.get('*', function(req, res, next){
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = (function(){
    if (app.get('env') === 'development') {
        process.env['MONGOLAB_URI'] = 'mongodb://localhost:27017/autenticacao'
    }
    var connection = mongoose.connect(process.env.MONGOLAB_URI, function(err){
        if (err){
            console.warn(err);
            throw err;
        }
        else {
            console.log('connected to mongodb');
        }
    });
    if (connection)
        return app;
})();
