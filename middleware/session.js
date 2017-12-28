module.exports = function() {
    return function(req, res, next) {
        try {
            if(typeof req.user != 'undefined' && req.isAuthenticated()) {
                req.data = {
                    logged: true,
                    info: req.session.passport.user
                }
            } else {
                req.data = {
                    logged: false,
                    info: null
                }
            }
            if(req.originalUrl.indexOf("panel") != -1 && req.data.logged == false) {
                res.redirect('/login');
            } else if(req.originalUrl.indexOf("api") != -1 && req.data.logged == false) {
                res.send('Session not found. Please sign in to use BotDelive.');
            } else {
                next()
            }
        } catch (ex) {
            next();
        }
    }
};