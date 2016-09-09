var express = require('express');
var http = require('http'); //zw
var path = require('path');
//var settings = require('./settings'); //zw
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var template = require('art-template')
//var bodyParser = require('body-parser');

var routes = require('./../routes/index');
//var users = require('./../routes/users');

//var session = require('express-session'); //zw
//var MongoStore = require('connect-mongo')(session); //zw
//var flash = require('connect-flash'); //zw
var port = process.env.PORT || 3000

var app = express();

//app.set('port', process.env.PORT || 3000); //zw
// view engine setup

// template
template.config('base', '')
template.config('extname', '.html')
app.engine('.html', template.__express)
app.set('views', path.join(__dirname, '../src'));
app.set('view engine', 'html')
//app.use(flash()); //zw

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser({keepExtensions: true, uploadDir: './public/images/'}));


// var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)

// static
app.use('static', express.static('./static'))
app.use('/', express.static(path.resolve(__dirname, '../src/index')));

app.use(cookieParser());

//app.use(session({ //zw
//    secret: settings.cookieSecret,
//    key: settings.db,
//    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
//    store: new MongoStore({
//        db: settings.db
//    })
//}))

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//module.exports = app;

//http.createServer(app).listen(app.get('port'), function () { //zw
//    console.log('server port is ' + app.get('port'));
//})

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})