var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var passport = require('passport');
require('./passport-init.js');

app.set("views", "./views");
app.set("view engine", "jade");

app.use(require('./logging.js'));
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

require('express-debug')(app, {});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('express-session')({
  secret: 'keyboard cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var authRouter = require('./auth');
app.use(authRouter);

app.use(function (req, res, next) {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
		next();
		return;
	}
	res.redirect('/login');
});

app.get('/', function (req, res) {
    res.render('home', {
        title: "Home"
    });
});


var adminRouter = require('./admin.js');
app.use('/admin', adminRouter);

var apiRouter = require('./api.js');
app.use('/api', apiRouter);

app.listen(3000, function () {
    console.log('App listening on port 3000');
});


