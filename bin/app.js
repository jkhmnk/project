var express = require('express');
var path = require('path')
var logger = require('morgan');
var template = require('art-template')
var routes = require('./../routes/index');

var port = process.env.PORT || 3000
var app = express();

// template
template.config('base', '')
template.config('extname', '.html')
app.engine('.html', template.__express)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '../src'));

app.use(logger('dev'));

// static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.resolve(__dirname, 'src/index.html')));

// route
app.use(routes);

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})