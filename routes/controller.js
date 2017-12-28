let crypto = require('crypto');

module.exports = {
    '/': function (req, res) {
        res.render('site/index.hbs', {lang: req.query.lang || 'en'});
    },
    '/panel': function (req, res) {
        res.render('panel/index.hbs', {message: 'Experimental.'})
    },
    '/login': function (req, res) {
        if(req.isAuthenticated()) {
            res.redirect('/panel')
        } else {
            res.render('panel/login.hbs')
        }
    }
};