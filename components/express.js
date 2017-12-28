let helmet = require('helmet'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    exphbs = require('express-handlebars'),
    routescan = require('express-routescan'),
    session_mw = require('../middleware/session'),
    filter = require('content-filter'),
    user = require('../models/user');

class Express {
    constructor(that) {
        this.app = that.app;
        this.express = that.express;
        this.localhostAddr = that.localhostAddress;
        this.base = __dirname.replace('components', '');
    }

    main() {
        const hbs = exphbs.create({
            extname: 'hbs',
            helpers: htmlHelpers,
            partialsDir: [
                this.base + '/public/views/panel/partials',
                this.base + '/public/views/site/partials',
            ],
        });
        global.handlebars = hbs;

        handlebars.getPartials()
            .then((partials) => {
                global.handlebars.partials = partials;
            });

        this.app.use(cors({credentials: true, origin: true}));
        this.app.set('port', (process.env.PORT || conf.port));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(filter());
        this.app.use(helmet());
        this.app.use(this.express.static(this.base + '/public'));
        this.app.use('/docs', this.express.static(this.base + '/public/static'));
        this.app.set('views', this.base + '/public/views');
        this.app.set('js', this.base +'/public/assets/js');
        this.app.set('css', this.base +'/public/assets/css');
        this.app.engine('hbs', hbs.engine);
        this.app.set('view engine', 'hbs');
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', this.localhostAddr);
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
        this.app.use(session({
            secret: conf.expressSecret,
            saveUninitialized: true,
            resave: false,
            store: new MongoStore({
                url: conf.mongodbURL,
                collection: 'sessions'
            })
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(session_mw());

        passport.use(new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password'
            },
            (username, password, done) => {
                user.validateUser(username, password, (user) => {
                    if(user) {
                        return done(null, user);
                    } else {
                        return done(user, false);
                    }
                });
            }
        ));

        passport.serializeUser(function(op, done) {
            done(null, op);
        });

        passport.deserializeUser(function(op, done) {
            done(null, op);
        });

        this.app.post('/auth',
            passport.authenticate('local', {
                successRedirect: '/panel',
                failureRedirect: '/login'
            }), (req, res) => {
                res.redirect('/panel');
            }
        );

        this.app.get('/logout', function(req, res){
            req.logout();
            res.redirect('/login');
        });

        routescan(this.app, {methods: ['get', 'post'], verbose: false});
    }
}

module.exports = Express;