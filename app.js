var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request = require('superagent');
var browserify = require('browserify-middleware');

var underscore = require('underscore');

var session = require('express-session');

var sys = require('sys');

var twitter = require('twitter-api').createClient();

var routes = require('./routes/index');

var cons = require('consolidate');

var stylus = require('stylus');
var jeet = require('jeet');
var nib = require('nib');
var autoprefixer = require('autoprefixer-stylus');
var flatuicolors = require('stylus-flatuicolors');
var typeUtils = require('stylus-type-utils');
var fontFace = require('stylus-font-face');

var superagent = require('superagent');
var app = express();

app.engine('dust', cons.dust);
cons.dust.helpers = require('dustjs-helpers');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

app.set('env','development')

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'lksjiwKsd23sNS4Na'}));

app.use(stylus.middleware({
    src: __dirname + '/',
    dest: __dirname + '/public/',
    debug: true,
    force: true,
    compile: function compile(str, path) {
        return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib()).use(jeet()).use(typeUtils()).use(fontFace()).use(autoprefixer()).use(flatuicolors())
    }
}));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

var shared = ['underscore','superagent'];
app.get('/js/bundle.js', browserify(shared));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/fontdef/:fontname/:fontfile',function(req,res){
    res.sendfile(__dirname + '/node_modules/typopro/web/' + req.params.fontname + '/' + req.params.fontfile);
});

app.get('/list/countries',function(req,res){
_ = underscore;

var consumerKey = 'pNW9U55Ou9XgniHqTQ6Oc7bpJ',
    consumerSec = 'doOmeYU26hDKCCBVQQbLtsyYuUhrgfFi6cbPn9kmztk8xcQO6R';

twitter.setAuth ( consumerKey, consumerSec );

twitter.fetchBearerToken( function( bearer, raw, status ){

    if( ! bearer ){
        console.error('Status '+status+', failed to fetch bearer token');
        //console.error( sys.inspect(raw) );
        return;
    }

    twitter.setAuth( bearer );
    console.log( 'Have OAuth 2 bearer token: ' + bearer );

    twitter.get( 'trends/available', {}, function( data, error, status ){
        if( error ){
            console.error('Status '+status+', failed to fetch application rate limit status');
            //console.error( sys.inspect(error) );
            return;
        }

        var countriesList = [];
        _.each(data,function(key,value,list){
            if (key.placeType.name == 'Country' ) {
                countriesList.push({'name': key.name, 'value': key.woeid});
            }
        });
        res.json(countriesList);

        twitter.setAuth ( consumerKey, consumerSec );
    });
} );

});

app.get('/trends/:woeid',function(req,res){
_ = underscore;

var consumerKey = 'pNW9U55Ou9XgniHqTQ6Oc7bpJ',
    consumerSec = 'doOmeYU26hDKCCBVQQbLtsyYuUhrgfFi6cbPn9kmztk8xcQO6R';

var woeid = req.params.woeid;

// OAuth 1a required to fetch bearer token.
twitter.setAuth ( consumerKey, consumerSec );

twitter.fetchBearerToken( function( bearer, raw, status ){

    if( ! bearer ){
        console.error('Status '+status+', failed to fetch bearer token');
        //console.error( sys.inspect(raw) );
        return;
    }

    twitter.setAuth( bearer );
    console.log( 'Have OAuth 2 bearer token: ' + bearer );

    twitter.get( 'trends/place', {id:woeid}, function( data, error, status ){
        if( error ){
            console.error('Status '+status);
            //console.error( sys.inspect(error) );
            return;
        }
        res.json(data);
        twitter.setAuth ( consumerKey, consumerSec );
        console.log('Invalidating token ..' );
        twitter.invalidateBearerToken( bearer, function( nothing, raw, status ){
            if( 200 !== status ){
                console.error('Status '+status+', failed to invalidate bearer token');
                return;
            }
            console.log('Done.');
        } );
    });
} );

});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
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
