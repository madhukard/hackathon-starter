/**
 * Module dependencies.
 */

var koa = require('koa');
var session = require('koa-session-store');
//var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var mongooseStore = require('koa-session-mongoose');
var passport = require('koa-passport');
//var expressValidator = require('express-validator');
var logger = require('koa-logger');
var route = require('koa-route');
var serve = require('koa-static');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = koa();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Koa configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

app.use(logger());
app.use(serve(path.join(__dirname, 'public')));
app.use(session({
  secret: secrets.sessionSecret,
  store: mongooseStore.create()
}));


/*
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    db: mongoose.connection.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.token = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());
*/



/**
 * Application routes.
 */

app.use(route.get('/', homeController.index));
app.use(route.get('/login', userController.getLogin));
app.use(route.post('/login', userController.postLogin));
app.use(route.get('/logout', userController.logout));
app.use(route.get('/signup', userController.getSignup));
app.use(route.post('/signup', userController.postSignup));
app.use(route.get('/contact', contactController.getContact));
app.use(route.post('/contact', contactController.postContact));
app.use(route.get('/account', passportConf.isAuthenticated, userController.getAccount));
app.use(route.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile));
app.use(route.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword));
app.use(route.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount));
app.use(route.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink));
app.use(route.get('/api', apiController.getApi));
app.use(route.get('/api/lastfm', apiController.getLastfm));
app.use(route.get('/api/nyt', apiController.getNewYorkTimes));
app.use(route.get('/api/aviary', apiController.getAviary));
app.use(route.get('/api/paypal', apiController.getPayPal));
app.use(route.get('/api/paypal/success', apiController.getPayPalSuccess));
app.use(route.get('/api/paypal/cancel', apiController.getPayPalCancel));
app.use(route.get('/api/steam', apiController.getSteam));
app.use(route.get('/api/scraping', apiController.getScraping));
app.use(route.get('/api/twilio', apiController.getTwilio));
app.use(route.post('/api/twilio', apiController.postTwilio));

/*
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);

*/

/**
 * OAuth routes for sign-in.
 */

/*
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
*/

/**
 * OAuth routes for API examples that require authorization.
 */

/*
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
*/
/**
 * Start Express server.
 */

app.listen(3000);

console.log("✔ Express server listening on port %d in %s mode", 3000, 'app.settings.env');
