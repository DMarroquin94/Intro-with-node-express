var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var isUserLoggedIn = false;
var typeOfUser = "";
var remember = false;



app.use(cookieParser('This is my passphrase'));

app.get('/', function(req, res){

  if (remember) {
    res.send('<form method="post" action="/login"><p>Check to <label>'
      + '<input type="text" value='+req.cookies.username+' name="username" />'
      + '<input type="text" value='+req.cookies.userpass+' name="userpass" />'
      + '<input type="checkbox" checked=ToCompute name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  } else {
    res.send('<form method="post" action="/login"><p>Check to <label>'
      + '<input type="text" value="" name="username" />'
      + '<input type="text" value="" name="userpass" />'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  }
});

app.get('/clear', function (req, res) {
  
    res.redirect('/');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/isUserLoggedIn/:view', function (req, res) {
   if (isUserLoggedIn && typeOfUser == "admin") 
    res.redirect("authorized/" + req.params.view)
  else 
    res.redirect("unauthorized/" + req.params.view)
});

app.get('/isUserLoggedIn/authorized/customers', function (req, res) {
  res.render('customers');
});

app.get('/isUserLoggedIn/authorized/create', function (req, res) {
  res.render('create');
});

app.get('/isUserLoggedIn/unauthorized/customers', function (req, res) {
  if (typeOfUser == "employee")
    res.render('viewcustomers');
  else 
    res.render('customer-view');
});

app.get('/isUserLoggedIn/unauthorized/create', function (req, res) {
  res.render('user/unauthorized', {title: "You do not have access to this page!"});
});

app.post('/login',  function (req, res) {

  if (req.body.username == "admin" && req.body.userpass == "pass") {
      typeOfUser = "admin";

      if (req.body.remember) {
         res.cookie('remember', true);
         remember = true;
         res.cookie('username', req.body.username);
         res.cookie('userpass', req.body.userpass);
      }
      else { 
         remember = false;
         res.cookie('remember', false);
      }
  
    isUserLoggedIn = true;

    res.render('loggedin', {title: "Logged in!"});
  } else if (req.body.username == "employee" && req.body.userpass == "54321") {
      
      typeOfUser = "employee";

      if (req.body.remember) {
         res.cookie('remember', true);
         remember = true;
         res.cookie('username', req.body.username);
         res.cookie('userpass', req.body.userpass);
      }
      else { 
        remember = false;
         res.cookie('remember', false);
      }
  
    isUserLoggedIn = true;
    res.render('loggedin', {title: "Logged in!"});
  } else if (req.body.username == "customer" && req.body.userpass == "12345") {
     typeOfUser = "customer";
      if (req.body.remember) {
         res.cookie('remember', true);
         remember = true;
         res.cookie('username', req.body.username);
         res.cookie('userpass', req.body.userpass);
      }
      else { 
        remember = false;
         res.cookie('remember', false);
      }
  
    isUserLoggedIn = true;
    res.render('loggedin2', {title: "Logged in!"});
  } else {
    res.redirect('/');
  }
});

app.get('/logout',  function (req, res) {
   if (res.cookie("remember")) {
        res.cookie('remember', true);
        //res.cookie('username', "admin");
        //res.cookie('userpass', "user");
      }
      else {
        res.clearCookie('username');
        res.clearCookie('userpass');
      }

  isUserLoggedIn = false;
  res.render('loggedout', {title: "Logged out!"});
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

module.exports = app;