const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const app = express();
const csrf = require('csurf');

require('dotenv').config();

class Server {

  constructor() {
    this.initViewEngine();
    this.initExpressMiddleWare();
    this.initRoutes();
    this.initErrorHandlers();
  }

  initViewEngine() {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
  }

  initExpressMiddleWare() {
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(express.static(__dirname + '/public'));
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));

    app.use((req, res, next) => {
        let csrfToken = req.csrfToken();
        res.locals._csrf = csrfToken;
        res.cookie('XSRF-TOKEN', csrfToken);
        next();
    });

    process.on('uncaughtException', (err) => {
        if (err) console.log(err, err.stack);
    });
  }

  initRoutes() {
    router.load(app, './controllers');

        // redirect all others to the index (HTML5 history)
        app.all('/*', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });
  }

  initErrorHandlers() {
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
  }

}

let server = new Server();

module.exports = app;