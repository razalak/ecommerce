var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var fileupload = require('express-fileupload');
const mysql = require('./configure/db-connect');
const userRouter = require('./routes/user'); // Import your user router
const adminRouter = require('./routes/admin'); // Import your admin router
var session=require('express-session')
var app = express(); // Create the Express app here

const port = 3001; // Change to an available port

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine(
  'hbs',
  hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '/views/layout/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
  })
);
app.set('view engine', 'hbs'); // Set the view engine
mysql.execute('select * from PRODUCT').then(function(data) {
  console.log('database connected successfully');
}).catch(function(err) {
  console.error(err);
});
app.use(session({secret:"@123",resave:false,saveUninitialized: false,cookie:{maxAge:600000}}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
