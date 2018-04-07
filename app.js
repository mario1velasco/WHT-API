var express = require('express');
var path = require('ejs');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

// const server = require('http').Server(app);

require('./config/db.config');
require('./config/passport.config').setup(passport);

const corsConfig = require('./config/cors.config');
const usersRoutes = require('./routes/user.routes');
const sessionRoutes = require('./routes/session.routes');
const chatsRoutes = require('./routes/chat.routes');

var app = express();

// require('./config/socket')();
// require('./config/socket').iosocket(require('http').Server(app));

app.use(cors(corsConfig))
//Permito el paso de todo
// app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'mellamomario',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 2419200000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.session = req.user || {};
  next();
});

app.use('/users', usersRoutes);
app.use('/users', chatsRoutes);
app.use('/session', sessionRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  // res.send(err.message);
  res.json({
    message:err.message,
    status:err.status,
    errors:err.errors
  });
});


    // "start": "node ./bin/www",
// server.listen(3000, function () {
//   console.log("Servidor corriendo en http://localhost:3000");
// });

module.exports = app;
