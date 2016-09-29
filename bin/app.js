var express = require('express');
var path = require('path')
var logger = require('morgan');
var template = require('art-template')
var routes = require('./../routes/index');
var port = process.env.PORT || 3000
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session'); //zw
var parseurl = require('parseurl')
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash'); //zw
var cookieParser = require('cookie-parser');
// template
template.config('base', '')
template.config('extname', '.html')
app.engine('.html', template.__express)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '../src'));

app.use(flash()); //zw

app.use(logger('dev'));

// static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.resolve(__dirname, 'src/index.html')));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(cookieParser());

//app.use(session({
//    secret: 'blog',
//    key: 'db',
//    store: new MongoStore({
//        url: 'mongodb://localhost/blog',
//        ttl: 14 * 24 * 60 * 60 // = 14 days. Default
//    }),
//    resave: true,
//    saveUninitialized: true,
//}));

//app.use(session({
//    secret: 'blog',
//    resave: false,
//    saveUninitialized: true
//}))
app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'blog'
}));
// route
app.use(routes);

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})