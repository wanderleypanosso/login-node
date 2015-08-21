var passport = require('passport');
var settings = null;


function initialize(failureSettings) {
    settings = failureSettings;
};

function requireAuthenticated(failureSettings){
    return function(req, res, next){
        console.log('requireAuthenticated');
        if (req.isAuthenticated()){
            return next();
        }

        failureSettings = failureSettings ? failureSettings : {};

        if((failureSettings.failureMessage) || (settings.requireAuthenticatedMessage))
            req.flash('error', failureSettings.failureMessage ? failureSettings.failureMessage : settings.requireAuthenticatedMessage);

        if((failureSettings.failureRedirect) || (settings.requireAuthenticatedRedirect))
            res.redirect(failureSettings.failureRedirect ? failureSettings.failureRedirect : settings.requireAuthenticatedRedirect);
    }
}

function requireNotAuthenticated(failureSettings){
    return function(req, res, next){
        console.log('requireNotAuthenticated');
        if (!req.isAuthenticated()){
            return next();
        }

        failureSettings = failureSettings ? failureSettings : {};

        if((failureSettings.failureMessage) || (settings.requireNotAuthenticatedMessage))
            req.flash('error', failureSettings.failureMessage ? failureSettings.failureMessage : settings.requireNotAuthenticatedMessage);

        if((failureSettings.failureRedirect) || (settings.requireNotAuthenticatedRedirect))
            res.redirect(failureSettings.failureRedirect ? failureSettings.failureRedirect : settings.requireNotAuthenticatedRedirect);
    }
}

module.exports = {
        requireAuthenticated : requireAuthenticated,
        requireNotAuthenticated : requireNotAuthenticated,
        initialize: initialize
}
